from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_password_hash
from app.models.ai import ScopeCheck, TranscriptChunk, VideoChapter, VideoSummary
from app.models.user import User
from app.models.video import Channel, Video

async def seed_initial_data(db: AsyncSession) -> None:
    """Pre-populate TechRoom with rich developer content for a vibrant YouTube-like experience."""
    # Check if already seeded
    existing = (await db.execute(select(Video))).scalars().first()
    if existing:
        return

    # 1. Seed creators
    users_data = [
        {"email": "alex@bytebyte.dev", "username": "alex_xu", "role": "creator"},
        {"email": "kelsey@cloudnative.io", "username": "kelsey_hightower", "role": "creator"},
        {"email": "tiangolo@fastapi.tiangolo.com", "username": "tiangolo", "role": "creator"},
    ]
    created_users = []
    for ud in users_data:
        u = User(
            email=ud["email"],
            username=ud["username"],
            hashed_password=get_password_hash("DevPassword123!"),
            role=ud["role"],
        )
        db.add(u)
        created_users.append(u)
    await db.flush()

    # 2. Seed channels
    channels_data = [
        {
            "owner_id": created_users[0].id,
            "handle": "systemdesign",
            "title": "System Design Decoded",
            "description": "Enterprise software architecture, scale, and distributed consensus.",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 128000,
        },
        {
            "owner_id": created_users[1].id,
            "handle": "devops_pro",
            "title": "Cloud Native & DevOps",
            "description": "Containers, Kubernetes, Observability, and Linux internals.",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 94000,
        },
        {
            "owner_id": created_users[2].id,
            "handle": "backend_mastery",
            "title": "Modern Backend Engineering",
            "description": "Async Python, High performance APIs, PostgreSQL, and Celery.",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 142000,
        },
    ]
    created_channels = []
    for cd in channels_data:
        c = Channel(**cd)
        db.add(c)
        created_channels.append(c)
    await db.flush()

    # 3. Seed videos
    videos_data = [
        {
            "channel_id": created_channels[0].id,
            "title": "Building Resilient Task Queues with Redis, Celery & PostgreSQL Outbox",
            "description": "Eliminating race conditions and message drops using transactional outbox pattern with SQLAlchemy 2.0 and Celery.",
            "category": "System Design",
            "tags": "redis,celery,outbox,postgres,architecture",
            "duration_seconds": 420,
            "views_count": 28410,
            "thumbnail_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_01",
        },
        {
            "channel_id": created_channels[0].id,
            "title": "Designing a Distributed Rate Limiter: Token Bucket vs Leaky Bucket",
            "description": "Detailed walkthrough of sliding window counters, Redis sorted sets, and DDoS mitigation strategies.",
            "category": "System Design",
            "tags": "ratelimit,redis,systemdesign,algorithms",
            "duration_seconds": 630,
            "views_count": 41200,
            "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_02",
        },
        {
            "channel_id": created_channels[1].id,
            "title": "Zero-Downtime Deployments with Docker, Traefik & GitHub Actions",
            "description": "Blue-green and canary deployment patterns with zero packet drops in production CI/CD pipelines.",
            "category": "DevOps",
            "tags": "docker,cicd,traefik,devops",
            "duration_seconds": 840,
            "views_count": 19540,
            "thumbnail_url": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_03",
        },
        {
            "channel_id": created_channels[2].id,
            "title": "PostgreSQL Indexing & EXPLAIN ANALYZE Performance Tuning",
            "description": "How to debug slow queries, choose between B-Tree, GIN, and BRIN indexes, and optimize joins.",
            "category": "Database",
            "tags": "postgres,sql,indexing,performance",
            "duration_seconds": 780,
            "views_count": 35890,
            "thumbnail_url": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_04",
        },
        {
            "channel_id": created_channels[2].id,
            "title": "FastAPI + SQLAlchemy 2.0 Async Modular Monolith Architecture",
            "description": "Clean domain boundaries, dependency injection, async session management, and Alembic migrations.",
            "category": "Python",
            "tags": "fastapi,python,sqlalchemy,async",
            "duration_seconds": 960,
            "views_count": 52100,
            "thumbnail_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_05",
        },
        {
            "channel_id": created_channels[0].id,
            "title": "Rust for Python Engineers: Concurrency, Ownership & High Throughput",
            "description": "Why and how Python teams extend backend performance bottlenecks with Rust pyo3 bindings.",
            "category": "Rust",
            "tags": "rust,python,concurrency,memory",
            "duration_seconds": 690,
            "views_count": 17400,
            "thumbnail_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_06",
        },
    ]

    for vd in videos_data:
        v = Video(**vd)
        db.add(v)
        await db.flush()

        # Seed Scope Guard approval
        db.add(ScopeCheck(
            video_id=v.id,
            score=0.98,
            decision="approved",
            reason="Verified developer technical tutorial passing developer-only policy.",
        ))

        # Seed Summary & Chapters
        db.add(VideoSummary(
            video_id=v.id,
            tldr=f"In-depth technical breakdown of {v.title}.",
            key_takeaways=[
                "Guaranteed reliable execution and resilience patterns.",
                "Production-tested architectural best practices.",
                "Hands-on code snippets with timestamped citations.",
            ],
            code_concepts=[v.category, "Clean Architecture", "Production Ready"],
        ))

        db.add(VideoChapter(
            video_id=v.id,
            start_time=0.0,
            end_time=float(v.duration_seconds // 3),
            title="1. Architecture & Foundations",
            summary="Understanding core trade-offs and edge cases.",
        ))
        db.add(VideoChapter(
            video_id=v.id,
            start_time=float(v.duration_seconds // 3),
            end_time=float((v.duration_seconds * 2) // 3),
            title="2. Implementation & Code Walkthrough",
            summary="Step-by-step code constructs and error handling.",
        ))
        db.add(VideoChapter(
            video_id=v.id,
            start_time=float((v.duration_seconds * 2) // 3),
            end_time=float(v.duration_seconds),
            title="3. Testing, Verification & Benchmarks",
            summary="Profiling performance, testing failures, and release gates.",
        ))

        # Seed Transcript chunks
        db.add(TranscriptChunk(
            video_id=v.id,
            start_time=0.0,
            end_time=float(v.duration_seconds // 3),
            text=f"Welcome to TechRoom. In this session we tackle {v.title}.",
        ))
        db.add(TranscriptChunk(
            video_id=v.id,
            start_time=float(v.duration_seconds // 3),
            end_time=float((v.duration_seconds * 2) // 3),
            text="Notice how the transactional boundaries isolate failures and avoid corrupting state.",
        ))

    await db.commit()
