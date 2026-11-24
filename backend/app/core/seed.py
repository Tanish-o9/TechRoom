from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.ai import ScopeCheck, TranscriptChunk, VideoChapter, VideoSummary
from app.models.user import User
from app.models.video import Channel, Video


async def seed_initial_data(db: AsyncSession) -> None:
    """Pre-populate TechRoom with rich developer content across all categories."""
    # 1. Seed or get creators
    users_data = [
        {"email": "alex@bytebyte.dev", "username": "alex_xu", "role": "creator"},
        {"email": "kelsey@cloudnative.io", "username": "kelsey_hightower", "role": "creator"},
        {"email": "tiangolo@fastapi.tiangolo.com", "username": "tiangolo", "role": "creator"},
        {"email": "dan@react.dev", "username": "dan_abramov", "role": "creator"},
    ]
    
    user_map = {}
    for ud in users_data:
        existing_u = (await db.execute(select(User).where(User.username == ud["username"]))).scalar_one_or_none()
        if not existing_u:
            u = User(
                email=ud["email"],
                username=ud["username"],
                hashed_password=get_password_hash("DevPassword123!"),
                role=ud["role"],
            )
            db.add(u)
            await db.flush()
            user_map[ud["username"]] = u
        else:
            user_map[ud["username"]] = existing_u

    # 2. Seed or get channels
    channels_data = [
        {
            "owner_username": "alex_xu",
            "handle": "systemdesign",
            "title": "System Design Decoded",
            "description": "Enterprise software architecture, scale, and distributed consensus.",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 128000,
        },
        {
            "owner_username": "kelsey_hightower",
            "handle": "devops_pro",
            "title": "Cloud Native & DevOps",
            "description": "Containers, Kubernetes, Observability, and Linux internals.",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 94000,
        },
        {
            "owner_username": "tiangolo",
            "handle": "backend_mastery",
            "title": "Modern Backend Engineering",
            "description": "Async Python, High performance APIs, PostgreSQL, and Celery.",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 142000,
        },
        {
            "owner_username": "dan_abramov",
            "handle": "react_architecture",
            "title": "React Architecture & Systems",
            "description": "Deep dive into React 19, server actions, concurrent rendering, and performance optimization.",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "subscribers_count": 165000,
        },
    ]

    channel_map = {}
    for cd in channels_data:
        existing_c = (await db.execute(select(Channel).where(Channel.handle == cd["handle"]))).scalar_one_or_none()
        if not existing_c:
            owner = user_map[cd["owner_username"]]
            c = Channel(
                owner_id=owner.id,
                handle=cd["handle"],
                title=cd["title"],
                description=cd["description"],
                avatar_url=cd["avatar_url"],
                subscribers_count=cd["subscribers_count"],
            )
            db.add(c)
            await db.flush()
            channel_map[cd["handle"]] = c
        else:
            channel_map[cd["handle"]] = existing_c

    # 3. Seed videos across all Explore Topics
    videos_data = [
        # System Design
        {
            "channel_handle": "systemdesign",
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
            "channel_handle": "systemdesign",
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
            "channel_handle": "systemdesign",
            "title": "Mastering Distributed Transactions: 2PC vs Saga Pattern in Microservices",
            "description": "How to coordinate transactions across distributed services without distributed locking or data corruption.",
            "category": "System Design",
            "tags": "systemdesign,distributed,saga,microservices,kafka",
            "duration_seconds": 890,
            "views_count": 74200,
            "thumbnail_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_sd3",
        },

        # DevOps
        {
            "channel_handle": "devops_pro",
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
            "channel_handle": "devops_pro",
            "title": "Kubernetes Production Post-Mortem: Debugging OOMKilled, Evictions & Pod Networking",
            "description": "Root cause analysis of real production cluster crashes, cgroup memory limits, and CoreDNS bottlenecks.",
            "category": "DevOps",
            "tags": "kubernetes,docker,devops,networking,linux",
            "duration_seconds": 820,
            "views_count": 38900,
            "thumbnail_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_k8s",
        },

        # Database
        {
            "channel_handle": "backend_mastery",
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
            "channel_handle": "backend_mastery",
            "title": "Designing Write-Heavy Distributed Databases with ClickHouse & PostgreSQL Partitioning",
            "description": "Ingesting 100K events per second: columnar storage mechanics, vector execution, and zero lock contention.",
            "category": "Database",
            "tags": "database,postgres,clickhouse,sharding,analytics",
            "duration_seconds": 710,
            "views_count": 44100,
            "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_db2",
        },

        # Python
        {
            "channel_handle": "backend_mastery",
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
            "channel_handle": "backend_mastery",
            "title": "High-Performance Asyncio: Concurrency, Event Loops & Connection Pooling",
            "description": "Under the hood of Python async runtime:uvloop, avoiding blocking calls, and socket pooling at scale.",
            "category": "Python",
            "tags": "python,asyncio,concurrency,performance",
            "duration_seconds": 640,
            "views_count": 31400,
            "thumbnail_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_py2",
        },

        # Rust
        {
            "channel_handle": "systemdesign",
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
        {
            "channel_handle": "systemdesign",
            "title": "Zero-Cost Abstractions: Writing a High-Performance Redis Clone in Rust",
            "description": "Building an in-memory key-value cache from scratch using Tokio async networking and zero-copy byte parsing.",
            "category": "Rust",
            "tags": "rust,redis,networking,tokio,concurrency",
            "duration_seconds": 920,
            "views_count": 61500,
            "thumbnail_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_rust2",
        },

        # React
        {
            "channel_handle": "react_architecture",
            "title": "React 19 Server Components, Actions & Full-Stack Next.js Architecture",
            "description": "Deep dive into RSC streaming boundaries, optimistic updates, Server Actions, and bundle minimization.",
            "category": "React",
            "tags": "react,react19,nextjs,typescript,frontend",
            "duration_seconds": 750,
            "views_count": 68400,
            "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_react1",
        },
        {
            "channel_handle": "react_architecture",
            "title": "Building High-Throughput Micro-Frontends with React, Vite & TypeScript",
            "description": "Module Federation, runtime contract validation, and isolated state bridges across enterprise frontends.",
            "category": "React",
            "tags": "react,state,performance,microfrontends,typescript",
            "duration_seconds": 610,
            "views_count": 32100,
            "thumbnail_url": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
            "status": "ready",
            "provider_video_id": "seed_stream_react2",
        },
    ]

    for vd in videos_data:
        existing_v = (await db.execute(select(Video).where(Video.title == vd["title"]))).scalar_one_or_none()
        if existing_v:
            continue

        channel = channel_map[vd["channel_handle"]]
        v = Video(
            channel_id=channel.id,
            title=vd["title"],
            description=vd["description"],
            category=vd["category"],
            tags=vd["tags"],
            duration_seconds=vd["duration_seconds"],
            views_count=vd["views_count"],
            thumbnail_url=vd["thumbnail_url"],
            status=vd["status"],
            provider_video_id=vd["provider_video_id"],
        )
        db.add(v)
        await db.flush()

        # Seed Scope Guard approval
        db.add(ScopeCheck(
            video_id=v.id,
            score=0.99,
            decision="approved",
            reason=f"Verified developer technical tutorial passing developer-only policy for {vd['category']}.",
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
