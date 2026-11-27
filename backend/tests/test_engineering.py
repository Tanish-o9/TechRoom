import pytest


@pytest.mark.asyncio
async def test_missions_lifecycle(client):
    # 1. Fetch missions
    res = await client.get("/api/v1/engineering/missions")
    assert res.status_code == 200
    missions = res.json()
    assert len(missions) >= 1
    m_id = missions[0]["id"]

    # 2. Fetch single mission detail
    detail = await client.get(f"/api/v1/engineering/missions/{m_id}")
    assert detail.status_code == 200
    assert detail.json()["title"] == missions[0]["title"]
    assert "stages" in detail.json()

    # 3. Toggle task progress
    toggle = await client.post(
        f"/api/v1/engineering/missions/{m_id}/tasks/t7/toggle",
        json={"completed": True},
    )
    assert toggle.status_code == 200
    assert "t7" in toggle.json()["completed_tasks"]

    # 4. Ask AI Mentor
    mentor = await client.post(
        f"/api/v1/engineering/missions/{m_id}/mentor",
        json={"question": "What is the Raft leader completeness invariant?"},
    )
    assert mentor.status_code == 200
    assert "Leader Completeness Invariant" in mentor.json()["answer"]


@pytest.mark.asyncio
async def test_challenges_and_code_execution(client):
    # 1. List challenges
    res = await client.get("/api/v1/engineering/challenges")
    assert res.status_code == 200
    challenges = res.json()
    assert len(challenges) >= 1
    c_id = challenges[0]["id"]

    # 2. Evaluate with broken code (should fail tests)
    broken_eval = await client.post(
        f"/api/v1/engineering/challenges/{c_id}/evaluate",
        json={"code": challenges[0]["broken_code"]},
    )
    assert broken_eval.status_code == 200
    assert broken_eval.json()["status"] == "failed"
    assert broken_eval.json()["score"] == 0

    # 3. Evaluate with working solution (should pass tests)
    solution_code = (
        "def is_rate_limited(timestamps: list[int], window_sec: int, max_reqs: int, current_ts: int) -> bool:\n"
        "    active = [t for t in timestamps if t >= (current_ts - window_sec)]\n"
        "    return len(active) >= max_reqs\n"
    )
    passed_eval = await client.post(
        f"/api/v1/engineering/challenges/{c_id}/evaluate",
        json={"code": solution_code},
    )
    assert passed_eval.status_code == 200
    assert passed_eval.json()["status"] == "passed"
    assert passed_eval.json()["score"] == 100


@pytest.mark.asyncio
async def test_project_genome_and_rooms(client):
    # 1. Project Genome Topology
    genome = await client.get("/api/v1/engineering/projects/default/genome")
    assert genome.status_code == 200
    data = genome.json()
    assert len(data["nodes"]) >= 4
    assert len(data["edges"]) >= 3
    assert data["health_score"] == 98

    # 2. Engineering Rooms
    rooms = await client.get("/api/v1/engineering/rooms")
    assert rooms.status_code == 200
    assert len(rooms.json()) >= 1
    room_id = rooms.json()[0]["id"]

    # Post message in room
    msg = await client.post(
        f"/api/v1/engineering/rooms/{room_id}/messages",
        json={"user_name": "lead_architect", "message": "Applying Raft quorum patch."},
    )
    assert msg.status_code == 200
    assert msg.json()["user_name"] == "lead_architect"


@pytest.mark.asyncio
async def test_skill_passport_and_research(client):
    # 1. Skill Passport
    passport = await client.get("/api/v1/engineering/passport")
    assert passport.status_code == 200
    assert isinstance(passport.json(), list)

    # 2. Research Lab synthesis
    research = await client.post(
        "/api/v1/engineering/research/synthesize",
        json={"topic": "Transactional Outbox Pattern vs 2PC"},
    )
    assert research.status_code == 200
    r_data = research.json()
    assert "summary" in r_data
    assert len(r_data["citations"]) >= 1


@pytest.mark.asyncio
async def test_scope_check_and_direct_video(client):
    # 1. Scope check - reject entertainment
    bad = await client.post(
        "/api/v1/ai/scope-check",
        json={"title": "Celebrity Vlog & Lifestyle Daily Routine", "description": "Fun day out in the city"},
    )
    assert bad.status_code == 200
    assert bad.json()["decision"] == "rejected"

    # 2. Scope check - accept engineering
    good = await client.post(
        "/api/v1/ai/scope-check",
        json={"title": "Rust Concurrency: Mutex vs RwLock and Pin", "description": "Memory safety and atomic locks"},
    )
    assert good.status_code == 200
    assert good.json()["decision"] == "approved"

    # 3. Direct video upload creation
    vid = await client.post(
        "/api/v1/videos/direct",
        json={
            "title": "Zero-Copy Linux Networking with eBPF and XDP",
            "description": "Kernel packet steering and bypassing socket buffers.",
            "category": "DevOps",
            "tags": "ebpf,xdp,linux,kernel",
        },
    )
    assert vid.status_code == 201
    assert vid.json()["title"] == "Zero-Copy Linux Networking with eBPF and XDP"


@pytest.mark.asyncio
async def test_execute_snippet_endpoint(client):
    res = await client.post(
        "/api/v1/engineering/execute-snippet",
        json={"code": "print('HELLO_TECHROOM')"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "HELLO_TECHROOM" in data["stdout"]


@pytest.mark.asyncio
async def test_stats_and_passport_endpoints(client):
    stats_res = await client.get("/api/v1/engineering/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "active_missions_count" in stats
    assert "verified_xp" in stats

    pass_res = await client.get("/api/v1/engineering/passport")
    assert pass_res.status_code == 200
    evidence = pass_res.json()
    assert isinstance(evidence, list)

