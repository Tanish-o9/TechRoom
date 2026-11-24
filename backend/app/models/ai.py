from sqlalchemy import JSON, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class TranscriptChunk(BaseModel):
    """Timestamped transcript segment for RAG retrieval and frame sync."""
    __tablename__ = "transcript_chunks"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    start_time: Mapped[float] = mapped_column(Float, index=True)
    end_time: Mapped[float] = mapped_column(Float)
    text: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(10), default="en")
    confidence: Mapped[float] = mapped_column(Float, default=1.0)

class VideoChapter(BaseModel):
    """Auto-generated or creator-edited technical chapter markers."""
    __tablename__ = "video_chapters"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    start_time: Mapped[float] = mapped_column(Float, index=True)
    end_time: Mapped[float] = mapped_column(Float)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

class VideoSummary(BaseModel):
    """AI-generated concise developer summary with key takeaways."""
    __tablename__ = "video_summaries"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), unique=True, index=True)
    tldr: Mapped[str] = mapped_column(Text)
    key_takeaways: Mapped[list] = mapped_column(JSON, default=list)
    code_concepts: Mapped[list] = mapped_column(JSON, default=list)

class ScopeCheck(BaseModel):
    """Scope Guard developer-only classification record (F27/N04)."""
    __tablename__ = "scope_checks"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), unique=True, index=True)
    score: Mapped[float] = mapped_column(Float)  # 0.0 to 1.0 developer relevance score
    decision: Mapped[str] = mapped_column(String(30))  # approved, rejected, review_needed
    reason: Mapped[str] = mapped_column(Text)

class LLMCall(BaseModel):
    """Audit and token/cost metering log for LLM Gateway (F34/N02/N29)."""
    __tablename__ = "llm_calls"

    task: Mapped[str] = mapped_column(String(100), index=True)
    model: Mapped[str] = mapped_column(String(100))
    prompt_version: Mapped[str] = mapped_column(String(50))
    tokens_in: Mapped[int] = mapped_column(Integer, default=0)
    tokens_out: Mapped[int] = mapped_column(Integer, default=0)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    cache_hit: Mapped[bool] = mapped_column(default=False)
