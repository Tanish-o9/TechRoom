import pytest

@pytest.mark.asyncio
async def test_channel_and_video_lifecycle(client):
    # 1. Register creator
    reg = await client.post(
        "/api/v1/auth/register",
        json={"email": "creator@techroom.io", "username": "prodev", "password": "Password123!", "role": "creator"},
    )
    assert reg.status_code == 201

    login = await client.post("/api/v1/auth/login", json={"email": "creator@techroom.io", "password": "Password123!"})
    token = login.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Create channel
    chan_res = await client.post(
        "/api/v1/channels",
        json={"handle": "system-design", "title": "System Design Decoded", "description": "High performance backends"},
        headers=auth_headers,
    )
    assert chan_res.status_code == 201
    channel_id = chan_res.json()["id"]

    # 3. Request upload URL
    vid_res = await client.post(
        "/api/v1/videos/upload-url",
        json={
            "channel_id": channel_id,
            "title": "Building Distributed Queues with Redis & Celery",
            "description": "Complete architecture deep dive",
            "visibility": "public",
        },
        headers=auth_headers,
    )
    assert vid_res.status_code == 201
    upload_info = vid_res.json()
    video_id = upload_info["video_id"]
    provider_id = upload_info["provider_video_id"]
    assert "upload_url" in upload_info

    # 4. Webhook callback from video provider (signed + idempotent)
    webhook_body = {
        "event_id": f"evt_{provider_id}",
        "uid": provider_id,
        "status": {"state": "ready"},
        "duration": 420,
    }
    wh_headers = {"Webhook-Signature": "valid_mock_signature"}
    wh_res = await client.post("/api/v1/videos/webhook", json=webhook_body, headers=wh_headers)
    assert wh_res.status_code == 200
    assert wh_res.json()["status"] == "accepted"

    # Deduplicated webhook attempt
    wh_res2 = await client.post("/api/v1/videos/webhook", json=webhook_body, headers=wh_headers)
    assert wh_res2.status_code == 200
    assert wh_res2.json()["status"] == "deduplicated"

    # 5. Retrieve ready video with playback HLS URL
    get_res = await client.get(f"/api/v1/videos/{video_id}")
    assert get_res.status_code == 200
    assert get_res.json()["status"] == "ready"
    assert get_res.json()["duration_seconds"] == 420
    assert get_res.json()["playback_url"].startswith("http")

    # 6. Add timestamped developer comment
    comment_res = await client.post(
        f"/api/v1/videos/{video_id}/comments",
        json={"content": "Great explanation of outbox pattern at this timestamp!", "timestamp_seconds": 185},
        headers=auth_headers,
    )
    assert comment_res.status_code == 201
    assert comment_res.json()["timestamp_seconds"] == 185

    # 7. Like video
    like_res = await client.post(f"/api/v1/videos/{video_id}/like", headers=auth_headers)
    assert like_res.status_code == 200
    assert like_res.json()["liked"] is True

    # 8. List comments
    cm_list = await client.get(f"/api/v1/videos/{video_id}/comments")
    assert cm_list.status_code == 200
    assert len(cm_list.json()) == 1

    # 9. Search and category filter
    search_res = await client.get("/api/v1/videos?search=Queues")
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1
    assert search_res.json()[0]["id"] == video_id

    # 10. Empty search on nonexistent term
    none_res = await client.get("/api/v1/videos?search=NonExistentKeywordXYZ")
    assert none_res.status_code == 200
    assert len(none_res.json()) == 0

    # 11. Trending videos
    trend_res = await client.get("/api/v1/videos/trending")
    assert trend_res.status_code == 200
    assert len(trend_res.json()) >= 1

    # 12. Save video to library
    save_res = await client.post(f"/api/v1/videos/{video_id}/save", headers=auth_headers)
    assert save_res.status_code == 200
    assert save_res.json()["saved"] is True
    saved_list = await client.get("/api/v1/videos/saved", headers=auth_headers)
    assert saved_list.status_code == 200
    assert len(saved_list.json()) == 1

    # 13. Record and fetch watch history
    hist_post = await client.post(f"/api/v1/videos/{video_id}/history", headers=auth_headers)
    assert hist_post.status_code == 200
    hist_list = await client.get("/api/v1/videos/history", headers=auth_headers)
    assert hist_list.status_code == 200
    assert len(hist_list.json()) == 1

    # 14. Subscribe to channel
    sub_res = await client.post(f"/api/v1/videos/channels/{channel_id}/subscribe", headers=auth_headers)
    assert sub_res.status_code == 200
    assert sub_res.json()["subscribed"] is True

@pytest.mark.asyncio
async def test_unauthorized_channel_upload_rejected(client):
    # Register developer A
    await client.post(
        "/api/v1/auth/register",
        json={"email": "alice@techroom.io", "username": "alice", "password": "Password123!", "role": "creator"},
    )
    login_a = await client.post("/api/v1/auth/login", json={"email": "alice@techroom.io", "password": "Password123!"})
    token_a = login_a.json()["access_token"]

    # Alice creates channel
    chan = await client.post(
        "/api/v1/channels",
        json={"handle": "alice-channel", "title": "Alice Tech"},
        headers={"Authorization": f"Bearer {token_a}"},
    )
    alice_channel_id = chan.json()["id"]

    # Register developer B
    await client.post(
        "/api/v1/auth/register",
        json={"email": "bob@techroom.io", "username": "bob", "password": "Password123!", "role": "developer"},
    )
    login_b = await client.post("/api/v1/auth/login", json={"email": "bob@techroom.io", "password": "Password123!"})
    token_b = login_b.json()["access_token"]

    # Bob attempts to upload to Alice's channel -> 403 Forbidden
    res = await client.post(
        "/api/v1/videos/upload-url",
        json={"channel_id": alice_channel_id, "title": "Malicious Video Upload"},
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert res.status_code == 403
