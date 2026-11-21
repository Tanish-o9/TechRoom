from datetime import datetime
from sqlalchemy import DateTime, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class OutboxEvent(BaseModel):
    """Outbox pattern event table for reliable async task dispatching."""
    __tablename__ = "outbox_events"

    event_type: Mapped[str] = mapped_column(String(100), index=True)
    payload: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(30), default="pending", index=True)  # pending, processed, failed
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    next_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class ProviderEvent(BaseModel):
    """Deduplication and audit log for incoming external webhooks."""
    __tablename__ = "provider_events"

    provider: Mapped[str] = mapped_column(String(50), index=True)  # cloudflare, stripe, etc.
    event_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    event_type: Mapped[str] = mapped_column(String(100))
    payload: Mapped[dict] = mapped_column(JSON)

class IdempotencyKey(BaseModel):
    """Ensures safe retries across mutation requests."""
    __tablename__ = "idempotency_keys"

    key: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    target_endpoint: Mapped[str] = mapped_column(String(200))
    response_code: Mapped[int] = mapped_column(Integer)
    response_body: Mapped[dict] = mapped_column(JSON)
