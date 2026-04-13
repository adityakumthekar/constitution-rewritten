from dataclasses import dataclass

from neo4j import AsyncDriver, AsyncGraphDatabase

from abstract_party.config import get_settings


@dataclass
class KgEdge:
    source: str
    target: str
    rel_type: str


class KnowledgeGraphService:
    def __init__(self) -> None:
        settings = get_settings()
        self._driver: AsyncDriver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )

    async def close(self) -> None:
        await self._driver.close()

    async def sample_acts(self, limit: int = 5) -> list[dict[str, str]]:
        query = """
        MATCH (a:Act)
        RETURN a.id AS id, a.title AS title
        LIMIT $limit
        """
        async with self._driver.session() as session:
            result = await session.run(query, limit=limit)
            rows: list[dict[str, object]] = []
            async for record in result:
                rows.append(record.data())
        return [{"id": str(r.get("id", "")), "title": str(r.get("title", ""))} for r in rows]

    async def ensure_seed_schema(self) -> None:
        """Create constraints and a tiny demo node if graph is empty (Phase 1 dev convenience)."""
        async with self._driver.session() as session:
            await session.run(
                "CREATE CONSTRAINT act_id IF NOT EXISTS FOR (a:Act) REQUIRE a.id IS UNIQUE"
            )
            await session.run(
                """
                MERGE (a:Act {id: $id})
                ON CREATE SET a.title = $title
                """,
                id="demo-constitution",
                title="Constitution of India (demo node)",
            )
