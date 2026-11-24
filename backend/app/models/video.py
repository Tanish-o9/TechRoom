from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Channel(BaseModel):
    """Creator channel representation."""
    __tablename__ = "channels"

    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    handle: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    subscribers_count: Mapped[int] = mapped_column(Integer, default=0)

class Video(BaseModel):
    """Developer video entity with processing lifecycle."""
    __tablename__ = "videos"

    channel_id: Mapped[str] = mapped_column(ForeignKey("channels.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    visibility: Mapped[str] = mapped_column(String(20), default="public")  # public, unlisted, private
    status: Mapped[str] = mapped_column(String(30), default="uploading", index=True)  # uploading, processing, ready, failed
    provider_video_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    views_count: Mapped[int] = mapped_column(Integer, default=0)
    category: Mapped[str] = mapped_column(String(50), default="General", index=True)
    tags: Mapped[str | None] = mapped_column(String(255), nullable=True)
