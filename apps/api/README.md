# abstract-party API

FastAPI backend. Requires Python 3.11+.

## Setup

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
```

## Database migrations

With Docker Compose Postgres running from repo root:

```bash
export PYTHONPATH=src
alembic upgrade head
```

## Run

```bash
export PYTHONPATH=src
uvicorn abstract_party.main:app --reload --host 0.0.0.0 --port 8000
```

## Celery worker

```bash
export PYTHONPATH=src
celery -A abstract_party.workers.celery_app worker --loglevel=info
```
