from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Comment(BaseModel):
    """Developer comment on a video, timestamped or general."""
    __tablename__ = "comments"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    content: Mapped[str] = mapped_column(Text)
    timestamp_seconds: Mapped[int | None] = mapped_column(nullable=True)

class VideoReaction(BaseModel):
    """Developer like/reaction on a video."""
    __tablename__ = "video_reactions"
    __table_args__ = (UniqueConstraint("video_id", "user_id", name="uq_video_user_reaction"),)

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    reaction_type: Mapped[str] = mapped_column(String(20), default="like")

class ChannelSubscription(BaseModel):
    """User channel subscription."""
    __tablename__ = "channel_subscriptions"
    __table_args__ = (UniqueConstraint("channel_id", "subscriber_id", name="uq_channel_subscriber"),)

    channel_id: Mapped[str] = mapped_column(ForeignKey("channels.id", ondelete="CASCADE"), index=True)
    subscriber_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
