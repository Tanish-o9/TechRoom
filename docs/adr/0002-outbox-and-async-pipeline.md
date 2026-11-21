# ADR 0002: Outbox Pattern for Asynchronous AI & Media Pipelines

- **Status**: Accepted
- **Date**: 2026-11-21
- **Decision Makers**: Principal Engineer

## Context & Problem Statement
Direct enqueuing to Redis/Celery inside HTTP request handlers causes race conditions and silent job drops when transactions rollback or network partitions occur. AI processing (ASR, chunking, Qdrant indexing, summaries) is expensive and must be reliably dispatched.

## Decision
All state transitions requiring asynchronous tasks write an event to an `outbox_events` table inside the exact same PostgreSQL database transaction. An outbox relay worker polls pending events and reliably dispatches them to Celery.

## Consequences
- **Positive**: Guaranteed at-least-once task delivery, complete audit log of system events, safe retries, and decoupled async processing.
- **Trade-offs**: Requires idempotent event handlers in workers using `idempotency_keys` and `provider_events`.
