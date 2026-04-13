from abstract_party.workers.celery_app import celery_app


@celery_app.task(name="abstract_party.embed_document")
def embed_document(object_name: str, bucket: str | None = None) -> dict[str, str]:
    """Placeholder: future pipeline will fetch from MinIO, chunk, embed, upsert to Qdrant."""
    return {"status": "queued", "object": object_name, "bucket": bucket or "default"}
