from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.video import Channel
from app.schemas.video import ChannelCreate, ChannelResponse

router = APIRouter(prefix="/channels", tags=["Channels"])

@router.post("", response_model=ChannelResponse, status_code=status.HTTP_201_CREATED)
async def create_channel(
    payload: ChannelCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new developer creator channel."""
    # Ensure handle uniqueness
    existing = (await db.execute(select(Channel).where(Channel.handle == payload.handle))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Channel handle is already taken")

    channel = Channel(
        owner_id=current_user.id,
        handle=payload.handle,
        title=payload.title,
        description=payload.description,
    )
    # Upgrade user to creator if they were basic developer
    if current_user.role == "developer":
        current_user.role = "creator"

    db.add(channel)
    await db.commit()
    await db.refresh(channel)
    return channel

@router.get("/{handle}", response_model=ChannelResponse)
async def get_channel_by_handle(handle: str, db: AsyncSession = Depends(get_db)):
    """Public channel lookup."""
    channel = (await db.execute(select(Channel).where(Channel.handle == handle))).scalar_one_or_none()
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    return channel
