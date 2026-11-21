from abc import ABC, abstractmethod
import hmac
import hashlib
from app.core.config import settings

class VideoProvider(ABC):
    """Abstract interface decoupling platform from Cloudflare Stream or Mux."""

    @abstractmethod
    async def generate_direct_upload_url(self, video_id: str, max_duration_seconds: int = 3600) -> dict:
        """Return provider upload URL and provider asset id."""
        pass

    @abstractmethod
    def verify_webhook_signature(self, signature_header: str, body_bytes: bytes) -> bool:
        """Verify authenticity of webhook payload."""
        pass

    @abstractmethod
    def get_playback_url(self, provider_video_id: str) -> str:
        """Return HLS manifest URL."""
        pass

class MockVideoProvider(VideoProvider):
    """Zero-dependency local/test mock provider."""

    async def generate_direct_upload_url(self, video_id: str, max_duration_seconds: int = 3600) -> dict:
        return {
            "upload_url": f"http://localhost:8000/api/v1/videos/mock-upload/{video_id}",
            "provider_video_id": f"mock_stream_{video_id}",
        }

    def verify_webhook_signature(self, signature_header: str, body_bytes: bytes) -> bool:
        return signature_header == "valid_mock_signature"

    def get_playback_url(self, provider_video_id: str) -> str:
        return f"https://customer-m0.cloudflarestream.com/{provider_video_id}/manifest/video.m3u8"

class CloudflareStreamProvider(VideoProvider):
    """Production Cloudflare Stream implementation."""

    def __init__(self):
        self.account_id = settings.CLOUDFLARE_STREAM_ACCOUNT_ID
        self.api_token = settings.CLOUDFLARE_STREAM_API_TOKEN

    async def generate_direct_upload_url(self, video_id: str, max_duration_seconds: int = 3600) -> dict:
        import httpx
        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/stream/direct_upload"
        headers = {"Authorization": f"Bearer {self.api_token}", "Content-Type": "application/json"}
        payload = {"maxDurationSeconds": max_duration_seconds, "meta": {"techroom_video_id": video_id}}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers, timeout=10.0)
            data = resp.json()
            return {
                "upload_url": data["result"]["uploadURL"],
                "provider_video_id": data["result"]["uid"],
            }

    def verify_webhook_signature(self, signature_header: str, body_bytes: bytes) -> bool:
        if not settings.SECRET_KEY:
            return False
        expected = hmac.new(settings.SECRET_KEY.encode(), body_bytes, hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature_header, expected)

    def get_playback_url(self, provider_video_id: str) -> str:
        return f"https://customer-m0.cloudflarestream.com/{provider_video_id}/manifest/video.m3u8"

def get_video_provider() -> VideoProvider:
    if settings.VIDEO_PROVIDER == "cloudflare" and settings.CLOUDFLARE_STREAM_API_TOKEN:
        return CloudflareStreamProvider()
    return MockVideoProvider()
