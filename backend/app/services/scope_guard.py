from app.services.llm_gateway import llm_gateway

ALLOWED_DOMAINS = {
    "programming", "software architecture", "dsa", "system design", "databases",
    "apis", "cloud", "devops", "security", "ai/ml", "data engineering", "open source", "developer tools",
}

DISALLOWED_DOMAINS = {"entertainment", "lifestyle", "celebrity", "music-only", "generic vlogs"}

async def evaluate_scope(title: str, description: str, transcript_sample: str = "") -> dict:
    """Multi-stage Scope Guard enforcing developer-only content (F27/N04)."""
    text_content = f"{title}\n{description}\n{transcript_sample}".lower()

    # Stage 1: Explicit disqualification check
    if any(disallowed in text_content for disallowed in DISALLOWED_DOMAINS):
        return {
            "score": 0.1,
            "decision": "rejected",
            "reason": "Content matches disallowed general entertainment categories.",
        }

    # Stage 2: Gateway evaluation
    sys_prompt = "You are TechRoom Scope Guard. Validate that this tutorial is exclusively for software developers."
    response = await llm_gateway.execute(
        task="scope_guard",
        system_prompt=sys_prompt,
        user_prompt=text_content,
        prompt_version="v2.0",
    )
    return response["result"]
