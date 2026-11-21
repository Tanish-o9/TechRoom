import pytest

@pytest.mark.asyncio
async def test_auth_lifecycle(client):
    # 1. Register new developer
    reg_payload = {
        "email": "dev@techroom.io",
        "username": "coder1",
        "password": "StrongPassword123!",
        "role": "developer",
    }
    res_reg = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res_reg.status_code == 201
    user_data = res_reg.json()
    assert user_data["email"] == "dev@techroom.io"
    assert user_data["role"] == "developer"

    # 2. Duplicate registration rejected (409)
    res_dup = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res_dup.status_code == 409

    # 3. Login with correct credentials
    login_payload = {"email": "dev@techroom.io", "password": "StrongPassword123!"}
    res_login = await client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    tokens = res_login.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # 4. Access protected profile (/me) with Bearer token
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    res_me = await client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["username"] == "coder1"

    # 5. Access profile without token rejected (401)
    res_unauth = await client.get("/api/v1/auth/me")
    assert res_unauth.status_code == 401

    # 6. Rotate refresh token
    res_ref = await client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert res_ref.status_code == 200
    new_tokens = res_ref.json()
    assert "access_token" in new_tokens
