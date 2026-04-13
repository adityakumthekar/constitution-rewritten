# abstract-party (ALGOCRACY Phase 1)

Monorepo for an AI-assisted, transparent governance platform: Next.js 14 (App Router) frontend, FastAPI backend with LangGraph, Qdrant, Neo4j, PostgreSQL, Redis, Celery, and MinIO.

## Prerequisites

- Node 20+ and [pnpm](https://pnpm.io/) 9
- Python 3.11+
- Docker (for local infrastructure)

## Infrastructure

From the repository root:

```bash
docker compose up -d
```

This starts PostgreSQL, Redis, Qdrant, Neo4j, and MinIO. Ports and credentials match [`apps/api/.env.example`](apps/api/.env.example).

## Backend (`apps/api`)

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
export PYTHONPATH=src
alembic upgrade head
uvicorn abstract_party.main:app --reload --host 0.0.0.0 --port 8000
```

Optional Celery worker:

```bash
export PYTHONPATH=src
celery -A abstract_party.workers.celery_app worker --loglevel=info
```

## Frontend (`apps/web`)

```bash
cp apps/web/.env.example apps/web/.env.local
pnpm install
pnpm dev
```

Set `NEXTAUTH_SECRET` and point `NEXT_PUBLIC_API_URL` at the API (default `http://localhost:8000`).

## Mock Aadhaar (Phase 1)

- Use the login page with any Aadhaar-style id and PIN **`1234`**.
- The API issues JWTs; NextAuth stores the access token for authenticated chat persistence.

## Quality checks

```bash
# API
cd apps/api && export PYTHONPATH=src && pytest && ruff check src tests

# Web (from repo root)
pnpm exec turbo run lint build --filter=web
```

---

_No leaders. No lobbyists. No humans in the loop. Just logic._
