from pydantic import BaseModel, Field

class ChannelCreate(BaseModel):
    handle: str = Field(min_length=3, max_length=50, pattern="^[a-zA-Z0-9_-]+$")
    title: str = Field(min_length=2, max_length=150)
    description: str | None = None

class ChannelResponse(BaseModel):
    id: str
    owner_id: str
    handle: str
    title: str
    description: str | None
    avatar_url: str | None = None
    subscribers_count: int = 0

class VideoUploadRequest(BaseModel):
    channel_id: str
    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    visibility: str = Field(default="public", pattern="^(public|unlisted|private)$")
    category: str = "General"
    tags: str | None = None
    thumbnail_url: str | None = None

class VideoUploadResponse(BaseModel):
    video_id: str
    upload_url: str
    provider_video_id: str

class VideoResponse(BaseModel):
    id: str
    channel_id: str
    title: str
    description: str | None
    visibility: str
    status: str
    duration_seconds: int
    playback_url: str | None = None
    thumbnail_url: str | None = None
    views_count: int = 0
    category: str = "General"
    tags: str | None = None
    channel_title: str | None = None
    channel_handle: str | None = None
    channel_avatar: str | None = None

class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)
    timestamp_seconds: int | None = None

class CommentResponse(BaseModel):
    id: str
    video_id: str
    user_id: str
    content: str
    timestamp_seconds: int | None
