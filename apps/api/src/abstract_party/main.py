from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from abstract_party.api.routers import auth, chat, health
from abstract_party.config import get_settings
from abstract_party.core.limiter import limiter
from abstract_party.services.minio_service import MinioService


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        MinioService().ensure_bucket()
    except Exception:
        # Local dev without MinIO running — bucket creation is optional for liveness.
        pass
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="abstract-party API",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(chat.router)
    return app


app = create_app()
