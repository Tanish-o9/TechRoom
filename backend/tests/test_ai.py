import pytest
from app.services.scope_guard import evaluate_scope

@pytest.mark.asyncio
async def test_scope_guard_developer_policy():
    # In-scope developer video
    res_dev = await evaluate_scope(
        title="High Throughput Rust & Python Backends",
        description="Building async workers with Celery and Redis",
    )
    assert res_dev["decision"] == "approved"
    assert res_dev["score"] >= 0.8

    # Disallowed entertainment / celebrity / lifestyle content
    res_fluff = await evaluate_scope(
        title="My Day in the Life Vacation Vlog",
        description="Celebrity lifestyle and daily entertainment",
    )
    assert res_fluff["decision"] == "rejected"
    assert res_fluff["score"] <= 0.2

@pytest.mark.asyncio
async def test_ai_enrichment_and_rag(client):
    # Register and create video
    await client.post(
        "/api/v1/auth/register",
        json={"email": "ai_tester@techroom.io", "username": "aitester", "password": "Password123!", "role": "creator"},
    )
    login = await client.post("/api/v1/auth/login", json={"email": "ai_tester@techroom.io", "password": "Password123!"})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chan = await client.post(
        "/api/v1/channels",
        json={"handle": "ai-channel", "title": "AI Tech Channel"},
        headers=headers,
    )
    channel_id = chan.json()["id"]

    vid = await client.post(
        "/api/v1/videos/upload-url",
        json={"channel_id": channel_id, "title": "Building Distributed Queues with Redis"},
        headers=headers,
    )
    video_id = vid.json()["video_id"]

    # 1. Trigger AI asset generation
    proc_res = await client.post(f"/api/v1/ai/process/{video_id}")
    assert proc_res.status_code == 200
    assert proc_res.json()["status"] == "processed"

    # 2. Fetch summary & chapters
    sum_res = await client.get(f"/api/v1/ai/summary/{video_id}")
    assert sum_res.status_code == 200
    summary_data = sum_res.json()
    assert "tldr" in summary_data
    assert len(summary_data["chapters"]) == 3
    assert summary_data["chapters"][1]["title"] == "Implementing Outbox Pattern"

    # 3. Fetch transcript chunks
    tr_res = await client.get(f"/api/v1/ai/transcript/{video_id}")
    assert tr_res.status_code == 200
    chunks = tr_res.json()
    assert len(chunks) == 3
    assert "outbox pattern" in chunks[1]["text"].lower()

    # 4. Ask grounded question (RAG with citations)
    ask_res = await client.post(
        f"/api/v1/ai/ask/{video_id}",
        json={"question": "How does the outbox pattern help with queue dispatching?"},
    )
    assert ask_res.status_code == 200
    qa = ask_res.json()
    assert "answer" in qa
    assert len(qa["citations"]) > 0
    assert qa["citations"][0]["start_time"] == 60.0
