# ADR 0001: Modular Monolith and Core Technology Stack

- **Status**: Accepted
- **Date**: 2026-11-21
- **Decision Makers**: Principal Engineer

## Context & Problem Statement
TechRoom is an AI-native video streaming and learning platform built exclusively for software developers. The architecture must support rapid solo engineering, strict authorization checks before retrieval, high cohesion, low operational overhead, and deterministic testing.

## Decision
We adopt a **Modular Monolith** architecture:
- **Backend API**: Python 3.13 + FastAPI with strict Pydantic v2 schemas and SQLAlchemy 2.0 (async).
- **Database**: PostgreSQL 16 as the single transactional source of truth.
- **Cache & Message Broker**: Redis 7.
- **Async Workers**: Celery workers handling media events, transcription, chunking, and AI workflows.
- **Vector Search**: Qdrant, treated as rebuildable from PostgreSQL chunks.
- **Video Delivery**: Cloudflare Stream behind an abstract `VideoProvider` adapter.
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + TanStack Query.

## Consequences
- **Positive**: Single codebase, shared models, no microservice distributed transaction overhead, fast local development via Docker Compose.
- **Trade-offs**: Requires disciplined modular boundaries inside the backend package to prevent coupling.
