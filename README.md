# TechRoom

> **TechRoom: AI-native video streaming, learning, and creator platform built exclusively for software developers.**

Discover technical content, learn new skills, explore AI-powered video insights, share knowledge, connect with developers, and turn ideas into real-world projects.

## Core Principles
- **Watch. Ask. Run. Prove.**
- **Developer-Only Scope Lock**: Enforced by Scope Guard (rules + embedding/LLM classifier).
- **Authorization Before Retrieval**: No raw vectors or transcripts served without server-side permission checks.
- **Outbox Pattern**: Reliable at-least-once async handoff to Celery workers.
- **Derivable Vectors**: Chunks and transcripts reside in PostgreSQL; Qdrant is rebuildable at any time.

## Quick Start

### 1. Requirements
- Docker & Docker Compose
- Python 3.13+
- Node.js 20+

### 2. Run with Docker Compose
```bash
docker compose up -d
```

### 3. Run Backend Locally
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --app-dir backend --reload --port 8000
```

### 4. Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### 5. Run Tests
```bash
pytest backend/tests -v
```

See `docs/STATE.md` and `docs/ROADMAP.md` for architecture details and sprint tracking.
