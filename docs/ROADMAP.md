# TechRoom 16-Sprint Execution Roadmap

*Based on Developer-Only AI Video Platform Build Prompt Book v2.0*

## Core Principle: Watch. Ask. Run. Prove.
A developer-only learning and creator platform engineered for high signal, verified learning outcomes, and zero general entertainment drift.

---

### Sprint Schedule & Deliverables

- **S1 (Wk 1-2) Foundation (M1)**: Monorepo, Docker, CI, Health endpoints, PostgreSQL schema + Alembic, Celery skeleton.  
  *Demo*: Clean clone boots, CI green, health checks 200 OK.
- **S2 (Wk 3-4) Auth (M1)**: User registration, login, refresh token rotation, RBAC, profile, GitHub OAuth, rate limits.  
  *Demo*: Login flow + server-side authorization tests pass.
- **S3 (Wk 5-6) Media Ingestion (M2)**: Channels, Cloudflare Stream direct upload, signed idempotent webhooks.  
  *Demo*: Real video uploaded and marked ready via webhook.
- **S4 (Wk 7-8) Playback & Engagement (M2/M3)**: Watch page with HLS, batched watch events, comments, reactions, subscriptions.  
  *Demo*: End-to-end viewer journey.
- **S5 (Wk 9-10) Discovery (M3)**: Feed, PostgreSQL FTS + pg_trgm search, playlists, history.  
  *Demo*: Developer-focused search and playlists. Public Alpha.
- **S6 (Wk 11-12) AI Pipeline & ASR (M4)**: Outbox event relay, Whisper transcription, technical glossary biasing, interactive transcript panel.  
  *Demo*: Clickable timestamped transcript.
- **S7 (Wk 13-14) Vectors & Hybrid Search (M4/M5)**: Chunking, embeddings, Qdrant indexing, Reciprocal Rank Fusion (RRF).  
  *Demo*: Concept search lands directly on video timestamp.
- **S8 (Wk 15-16) AI Platform Layer (M4)**: LLM Gateway, prompt registry, summaries, chapters, Scope Guard v1 (developer-only filtering).  
  *Demo*: Auto-generated chapters, summary, creator metadata review.
- **S9 (Wk 17-18) Grounded RAG (M5)**: Video RAG assistant with strict timestamp citations, 9-layer injection defense.  
  *Demo*: Grounded Q&A with clickable timestamp citations.
- **S10 (Wk 19-20) Active Learning (M5)**: Notes, quizzes, flashcards with FSRS spaced repetition, hint ladder.  
  *Demo*: Watch-ask-practice loop.
- **S11 (Wk 21-22) Creator Studio (M3b/M6)**: Video manager, scheduling, retention drop analyzer (F17), repurposing drafts (F20).  
  *Demo*: Creator analytics and publishing workflows.
- **S12 (Wk 23-24) Code-Native Features (M5/M6)**: Frame-to-Code (F01), Ask-the-Screen (F03), Debug-to-Video (F10).  
  *Demo*: Code tab on watch page linking errors/frames to video moments.
- **S13 (Wk 25-26) Skill Graph & Recommendations (M6)**: Concept graph, prerequisite paths, content-based recommendation engine.  
  *Demo*: Adaptive learning paths.
- **S14 (Wk 27-28) Trust & Safety (M7)**: Moderation console, spam/scam detection (F32), privacy export and data deletion propagation.  
  *Demo*: Moderator flows and GDPR/data deletion verification.
- **S15 (Wk 29-30) Reliability & Hardening (M7)**: Security audit, load testing, automated backup and Qdrant rebuild drills, FinOps dashboard (N29).  
  *Demo*: Signed-off disaster recovery and security reports.
- **S16 (Wk 31-32) Launch (M7/M8)**: Production deploy, runbooks, MCP Server (F36), GitHub Sync (F37).  
  *Demo*: Public Beta.
