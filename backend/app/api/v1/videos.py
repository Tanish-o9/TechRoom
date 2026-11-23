from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_optional_current_user
from app.core.database import get_db
from app.models.outbox import OutboxEvent, ProviderEvent
from app.models.social import ChannelSubscription, Comment, SavedVideo, VideoReaction, WatchHistory
from app.models.user import User
from app.models.video import Channel, Video
from app.schemas.video import (
    CommentCreate,
    CommentResponse,
    VideoResponse,
    VideoUploadRequest,
    VideoUploadResponse,
)
from app.services.video_provider import get_video_provider

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.post("/upload-url", response_model=VideoUploadResponse, status_code=status.HTTP_201_CREATED)
async def get_upload_url(
    payload: VideoUploadRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Enforce channel ownership and return direct provider upload URL."""
    # 1. Authorize channel ownership server-side
    channel = (await db.execute(select(Channel).where(Channel.id == payload.channel_id))).scalar_one_or_none()
    if not channel or (channel.owner_id != current_user.id and current_user.role != "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to upload to this channel")

    provider = get_video_provider()
    # Create preliminary video record
    video = Video(
        channel_id=channel.id,
        title=payload.title,
        description=payload.description,
        visibility=payload.visibility,
        category=payload.category,
        tags=payload.tags,
        thumbnail_url=payload.thumbnail_url,
        status="uploading",
    )
    db.add(video)
    await db.flush()

    upload_data = await provider.generate_direct_upload_url(video_id=video.id)
    video.provider_video_id = upload_data["provider_video_id"]
    await db.commit()

    return VideoUploadResponse(
        video_id=video.id,
        upload_url=upload_data["upload_url"],
        provider_video_id=upload_data["provider_video_id"],
    )

@router.post("/webhook", status_code=status.HTTP_200_OK)
async def provider_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    webhook_signature: str = Header(default="", alias="Webhook-Signature"),
):
    """Verify, deduplicate, and process video provider state transitions."""
    body_bytes = await request.body()
    provider = get_video_provider()

    if not provider.verify_webhook_signature(webhook_signature, body_bytes):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature")

    payload = await request.json()
    event_id = payload.get("event_id") or payload.get("uid")
    if not event_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing webhook event_id")

    # Deduplicate via provider_events
    existing = (await db.execute(select(ProviderEvent).where(ProviderEvent.event_id == event_id))).scalar_one_or_none()
    if existing:
        return {"status": "deduplicated", "event_id": event_id}

    provider_event = ProviderEvent(
        provider="cloudflare",
        event_id=event_id,
        event_type=payload.get("status", {}).get("state", "ready"),
        payload=payload,
    )
    db.add(provider_event)

    # Update video state if ready
    provider_video_id = payload.get("uid") or payload.get("video_uid")
    video = (await db.execute(select(Video).where(Video.provider_video_id == provider_video_id))).scalar_one_or_none()
    if video:
        video.status = "ready"
        video.duration_seconds = int(payload.get("duration", 0))

        # Enqueue Outbox event for AI indexing & transcript worker
        outbox_event = OutboxEvent(
            event_type="video.ready",
            payload={"video_id": video.id, "channel_id": video.channel_id},
        )
        db.add(outbox_event)

    await db.commit()
    return {"status": "accepted", "event_id": event_id}

@router.get("", response_model=list[VideoResponse])
async def list_public_videos(
    category: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List publicly visible ready videos with optional category & search filter."""
    query = (
        select(Video, Channel)
        .join(Channel, Video.channel_id == Channel.id)
        .where(Video.visibility == "public", Video.status == "ready")
    )
    if category and category.lower() != "all":
        query = query.where(Video.category == category)
    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.where(
            (Video.title.ilike(search_pattern))
            | (Video.description.ilike(search_pattern))
            | (Video.tags.ilike(search_pattern))
        )

    query = query.order_by(Video.created_at.desc()).limit(50)
    results = (await db.execute(query)).all()
    provider = get_video_provider()

    return [
        VideoResponse(
            id=v.id,
            channel_id=v.channel_id,
            title=v.title,
            description=v.description,
            visibility=v.visibility,
            status=v.status,
            duration_seconds=v.duration_seconds,
            playback_url=provider.get_playback_url(v.provider_video_id) if v.provider_video_id else None,
            thumbnail_url=v.thumbnail_url,
            views_count=v.views_count,
            category=v.category,
            tags=v.tags,
            channel_title=c.title,
            channel_handle=c.handle,
            channel_avatar=c.avatar_url,
        )
        for v, c in results
    ]

@router.get("/trending", response_model=list[VideoResponse])
async def list_trending_videos(db: AsyncSession = Depends(get_db)):
    """List trending architecture & developer videos sorted by popularity."""
    query = (
        select(Video, Channel)
        .join(Channel, Video.channel_id == Channel.id)
        .where(Video.visibility == "public", Video.status == "ready")
        .order_by(Video.views_count.desc())
        .limit(30)
    )
    results = (await db.execute(query)).all()
    provider = get_video_provider()
    return [
        VideoResponse(
            id=v.id,
            channel_id=v.channel_id,
            title=v.title,
            description=v.description,
            visibility=v.visibility,
            status=v.status,
            duration_seconds=v.duration_seconds,
            playback_url=provider.get_playback_url(v.provider_video_id) if v.provider_video_id else None,
            thumbnail_url=v.thumbnail_url,
            views_count=v.views_count,
            category=v.category,
            tags=v.tags,
            channel_title=c.title,
            channel_handle=c.handle,
            channel_avatar=c.avatar_url,
        )
        for v, c in results
    ]

@router.get("/saved", response_model=list[VideoResponse])
async def list_saved_videos(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List saved tutorials for library."""
    query = (
        select(Video, Channel)
        .join(SavedVideo, SavedVideo.video_id == Video.id)
        .join(Channel, Video.channel_id == Channel.id)
        .where(SavedVideo.user_id == current_user.id)
        .order_by(SavedVideo.created_at.desc())
    )
    results = (await db.execute(query)).all()
    provider = get_video_provider()
    return [
        VideoResponse(
            id=v.id,
            channel_id=v.channel_id,
            title=v.title,
            description=v.description,
            visibility=v.visibility,
            status=v.status,
            duration_seconds=v.duration_seconds,
            playback_url=provider.get_playback_url(v.provider_video_id) if v.provider_video_id else None,
            thumbnail_url=v.thumbnail_url,
            views_count=v.views_count,
            category=v.category,
            tags=v.tags,
            channel_title=c.title,
            channel_handle=c.handle,
            channel_avatar=c.avatar_url,
        )
        for v, c in results
    ]

@router.get("/history", response_model=list[VideoResponse])
async def list_watch_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List watch history for current user."""
    query = (
        select(Video, Channel)
        .join(WatchHistory, WatchHistory.video_id == Video.id)
        .join(Channel, Video.channel_id == Channel.id)
        .where(WatchHistory.user_id == current_user.id)
        .order_by(WatchHistory.created_at.desc())
        .limit(50)
    )
    results = (await db.execute(query)).all()
    provider = get_video_provider()
    return [
        VideoResponse(
            id=v.id,
            channel_id=v.channel_id,
            title=v.title,
            description=v.description,
            visibility=v.visibility,
            status=v.status,
            duration_seconds=v.duration_seconds,
            playback_url=provider.get_playback_url(v.provider_video_id) if v.provider_video_id else None,
            thumbnail_url=v.thumbnail_url,
            views_count=v.views_count,
            category=v.category,
            tags=v.tags,
            channel_title=c.title,
            channel_handle=c.handle,
            channel_avatar=c.avatar_url,
        )
        for v, c in results
    ]

@router.delete("/history", status_code=status.HTTP_200_OK)
async def clear_watch_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Clear all watch history for current user."""
    from sqlalchemy import delete
    await db.execute(delete(WatchHistory).where(WatchHistory.user_id == current_user.id))
    await db.commit()
    return {"status": "cleared"}

@router.get("/liked", response_model=list[VideoResponse])
async def list_liked_videos(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List liked videos for current user."""
    query = (
        select(Video, Channel)
        .join(VideoReaction, VideoReaction.video_id == Video.id)
        .join(Channel, Video.channel_id == Channel.id)
        .where(VideoReaction.user_id == current_user.id, VideoReaction.reaction_type == "like")
        .order_by(VideoReaction.created_at.desc())
    )
    results = (await db.execute(query)).all()
    provider = get_video_provider()
    return [
        VideoResponse(
            id=v.id,
            channel_id=v.channel_id,
            title=v.title,
            description=v.description,
            visibility=v.visibility,
            status=v.status,
            duration_seconds=v.duration_seconds,
            playback_url=provider.get_playback_url(v.provider_video_id) if v.provider_video_id else None,
            thumbnail_url=v.thumbnail_url,
            views_count=v.views_count,
            category=v.category,
            tags=v.tags,
            channel_title=c.title,
            channel_handle=c.handle,
            channel_avatar=c.avatar_url,
        )
        for v, c in results
    ]

@router.post("/{video_id}/save", status_code=status.HTTP_200_OK)
async def toggle_save_video(
    video_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle saving a video into library/saved list."""
    existing = (
        await db.execute(
            select(SavedVideo).where(
                SavedVideo.video_id == video_id,
                SavedVideo.user_id == current_user.id,
            )
        )
    ).scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.commit()
        return {"saved": False}
    db.add(SavedVideo(video_id=video_id, user_id=current_user.id))
    await db.commit()
    return {"saved": True}

@router.post("/{video_id}/history", status_code=status.HTTP_200_OK)
async def record_watch_history(
    video_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record an item into user watch history."""
    db.add(WatchHistory(video_id=video_id, user_id=current_user.id))
    await db.commit()
    return {"status": "recorded"}

@router.post("/channels/{channel_id}/subscribe", status_code=status.HTTP_200_OK)
async def toggle_channel_subscription(
    channel_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle subscribing to a developer creator channel."""
    existing = (
        await db.execute(
            select(ChannelSubscription).where(
                ChannelSubscription.channel_id == channel_id,
                ChannelSubscription.subscriber_id == current_user.id,
            )
        )
    ).scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.commit()
        return {"subscribed": False}
    db.add(ChannelSubscription(channel_id=channel_id, subscriber_id=current_user.id))
    await db.commit()
    return {"subscribed": True}

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    """Retrieve video enforcing visibility & ownership authorization."""
    query = (
        select(Video, Channel)
        .join(Channel, Video.channel_id == Channel.id)
        .where(Video.id == video_id)
    )
    row = (await db.execute(query)).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    video, channel = row

    # Authorization before data delivery
    if video.visibility == "private":
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        if channel.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to private video")

    # Increment views
    video.views_count += 1
    await db.commit()

    provider = get_video_provider()
    return VideoResponse(
        id=video.id,
        channel_id=video.channel_id,
        title=video.title,
        description=video.description,
        visibility=video.visibility,
        status=video.status,
        duration_seconds=video.duration_seconds,
        playback_url=provider.get_playback_url(video.provider_video_id) if video.provider_video_id else None,
        thumbnail_url=video.thumbnail_url,
        views_count=video.views_count,
        category=video.category,
        tags=video.tags,
        channel_title=channel.title,
        channel_handle=channel.handle,
        channel_avatar=channel.avatar_url,
    )

@router.post("/{video_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment(
    video_id: str,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Post comment on video."""
    video = (await db.execute(select(Video).where(Video.id == video_id))).scalar_one_or_none()
    if not video or video.status != "ready":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found or not ready")

    comment = Comment(
        video_id=video.id,
        user_id=current_user.id,
        content=payload.content,
        timestamp_seconds=payload.timestamp_seconds,
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

@router.get("/{video_id}/comments", response_model=list[CommentResponse])
async def list_comments(video_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch comments for a video."""
    comments = (await db.execute(select(Comment).where(Comment.video_id == video_id).order_by(Comment.created_at.desc()))).scalars().all()
    return comments

@router.post("/{video_id}/like", status_code=status.HTTP_200_OK)
async def toggle_like(
    video_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle like on video."""
    existing = (
        await db.execute(
            select(VideoReaction).where(
                VideoReaction.video_id == video_id,
                VideoReaction.user_id == current_user.id,
            )
        )
    ).scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"liked": False}

    reaction = VideoReaction(video_id=video_id, user_id=current_user.id, reaction_type="like")
    db.add(reaction)
    await db.commit()
    return {"liked": True}
