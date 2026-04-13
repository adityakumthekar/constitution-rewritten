from typing import Any

import redis.asyncio as redis
from fastapi import APIRouter
from neo4j import AsyncGraphDatabase
from qdrant_client import AsyncQdrantClient
from sqlalchemy import text

from abstract_party.config import get_settings
from abstract_party.db.session import engine

router = APIRouter(tags=["health"])


@router.get("/health")
async def liveness() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
async def readiness() -> dict[str, Any]:
    settings = get_settings()
    checks: dict[str, str] = {}

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["postgres"] = "ok"
    except Exception as e:  # noqa: BLE001
        checks["postgres"] = f"error: {e!s}"

    try:
        r = redis.from_url(settings.redis_url)
        await r.ping()
        await r.aclose()
        checks["redis"] = "ok"
    except Exception as e:  # noqa: BLE001
        checks["redis"] = f"error: {e!s}"

    try:
        client = AsyncQdrantClient(url=settings.qdrant_url)
        await client.get_collections()
        checks["qdrant"] = "ok"
    except Exception as e:  # noqa: BLE001
        checks["qdrant"] = f"error: {e!s}"

    try:
        driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )
        async with driver.session() as session:
            await session.run("RETURN 1 AS n")
        await driver.close()
        checks["neo4j"] = "ok"
    except Exception as e:  # noqa: BLE001
        checks["neo4j"] = f"error: {e!s}"

    ok = all(v == "ok" for v in checks.values())
    return {"ready": ok, "checks": checks}
