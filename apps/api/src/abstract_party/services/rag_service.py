from dataclasses import dataclass

from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as qmodels

from abstract_party.config import EmbeddingProvider, get_settings


@dataclass
class RagHit:
    text: str
    score: float
    payload: dict


class RagService:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = AsyncQdrantClient(url=settings.qdrant_url)
        self._collection = settings.qdrant_collection_name

    async def ensure_collection(self, vector_size: int) -> None:
        collections = await self._client.get_collections()
        names = {c.name for c in collections.collections}
        if self._collection in names:
            return
        await self._client.create_collection(
            collection_name=self._collection,
            vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
        )

    async def embed_query(self, text: str) -> list[float] | None:
        settings = get_settings()
        if (
            settings.embedding_provider == EmbeddingProvider.openai
            and settings.openai_api_key
        ):
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            res = await client.embeddings.create(
                model=settings.openai_embedding_model,
                input=text,
            )
            return list(res.data[0].embedding)
        return None

    async def search(self, query_vector: list[float], limit: int = 5) -> list[RagHit]:
        try:
            res = await self._client.search(
                collection_name=self._collection,
                query_vector=query_vector,
                limit=limit,
                with_payload=True,
            )
        except Exception:
            return []
        hits: list[RagHit] = []
        for p in res:
            payload = (p.payload or {}) if isinstance(p.payload, dict) else {}
            text = str(payload.get("text", ""))
            hits.append(RagHit(text=text, score=float(p.score or 0.0), payload=payload))
        return hits
