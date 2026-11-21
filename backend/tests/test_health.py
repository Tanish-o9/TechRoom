import pytest

@pytest.mark.asyncio
async def test_liveness_endpoint(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "techroom-api"}

@pytest.mark.asyncio
async def test_readiness_endpoint(client):
    response = await client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"
    assert response.json()["database"] == "healthy"
