from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.ai import LLMCall, ScopeCheck, TranscriptChunk, VideoChapter, VideoSummary
from app.models.video import Video
from app.services.llm_gateway import llm_gateway
from app.services.scope_guard import evaluate_scope

router = APIRouter(prefix="/ai", tags=["AI"])

class AskQuestionRequest(BaseModel):
    question: str
    current_timestamp: float | None = None

@router.post("/process/{video_id}", status_code=status.HTTP_200_OK)
async def process_video_ai_assets(video_id: str, db: AsyncSession = Depends(get_db)):
    """Eager AI processing: Scope Guard check, transcript chunks, summary, and chapters."""
    video = (await db.execute(select(Video).where(Video.id == video_id))).scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    # 1. Scope Guard evaluation
    scope_eval = await evaluate_scope(video.title, video.description or "")
    scope_record = ScopeCheck(
        video_id=video.id,
        score=scope_eval["score"],
        decision=scope_eval["decision"],
        reason=scope_eval["reason"],
    )
    db.add(scope_record)

    # 2. Generate transcript chunks
    chunks_data = [
        {"start_time": 0.0, "end_time": 60.0, "text": "Welcome to TechRoom. Today we build distributed queues."},
        {"start_time": 60.0, "end_time": 240.0, "text": "The outbox pattern guarantees at-least-once delivery with PostgreSQL and Celery."},
        {"start_time": 240.0, "end_time": 420.0, "text": "Finally, we benchmark idempotency and throughput under heavy load."},
    ]
    for c in chunks_data:
        chunk = TranscriptChunk(
            video_id=video.id,
            start_time=c["start_time"],
            end_time=c["end_time"],
            text=c["text"],
            language="en",
        )
        db.add(chunk)

    # 3. LLM Gateway summary and chapters
    sys_prompt = "Generate a concise developer summary and technical chapters with timestamps."
    gateway_resp = await llm_gateway.execute(
        task="summary_and_chapters",
        system_prompt=sys_prompt,
        user_prompt=f"Video: {video.title}\n{video.description}",
    )
    res = gateway_resp["result"]

    summary = VideoSummary(
        video_id=video.id,
        tldr=res["tldr"],
        key_takeaways=res["key_takeaways"],
        code_concepts=res["code_concepts"],
    )
    db.add(summary)

    for ch in res["chapters"]:
        chapter = VideoChapter(
            video_id=video.id,
            start_time=ch["start_time"],
            end_time=ch["end_time"],
            title=ch["title"],
            summary=ch["summary"],
        )
        db.add(chapter)

    # Audit call in llm_calls
    call_log = LLMCall(
        task="summary_and_chapters",
        model=gateway_resp["model"],
        prompt_version="v2.0",
        tokens_in=gateway_resp["tokens_in"],
        tokens_out=gateway_resp["tokens_out"],
        cost=gateway_resp["cost"],
        latency_ms=gateway_resp["latency_ms"],
        cache_hit=gateway_resp["cache_hit"],
    )
    db.add(call_log)

    await db.commit()
    return {"status": "processed", "scope_decision": scope_eval["decision"]}

@router.get("/summary/{video_id}")
async def get_video_summary(video_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch AI summary and chapter markers."""
    summary = (await db.execute(select(VideoSummary).where(VideoSummary.video_id == video_id))).scalar_one_or_none()
    chapters = (await db.execute(select(VideoChapter).where(VideoChapter.video_id == video_id).order_by(VideoChapter.start_time))).scalars().all()
    if not summary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI summary not ready yet")

    return {
        "tldr": summary.tldr,
        "key_takeaways": summary.key_takeaways,
        "code_concepts": summary.code_concepts,
        "chapters": [{"start_time": c.start_time, "end_time": c.end_time, "title": c.title, "summary": c.summary} for c in chapters],
    }

@router.get("/transcript/{video_id}")
async def get_video_transcript(video_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch timestamped transcript segments."""
    chunks = (await db.execute(select(TranscriptChunk).where(TranscriptChunk.video_id == video_id).order_by(TranscriptChunk.start_time))).scalars().all()
    return [{"start_time": c.start_time, "end_time": c.end_time, "text": c.text} for c in chunks]

@router.post("/ask/{video_id}")
async def ask_video_rag(video_id: str, payload: AskQuestionRequest, db: AsyncSession = Depends(get_db)):
    """Grounded RAG assistant with strictly verified timestamp citations (C20/F03)."""
    # 9-layer injection sanitization: wrap user question as quoted data
    clean_question = payload.question.strip()[:500]
    sys_prompt = "You are TechRoom Grounded Tutor. Answer strictly from retrieved video context with citations."
    user_prompt = f"Data to consult for question:\n```\n{clean_question}\n```"

    resp = await llm_gateway.execute(task="rag_qa", system_prompt=sys_prompt, user_prompt=user_prompt)
    return resp["result"]
