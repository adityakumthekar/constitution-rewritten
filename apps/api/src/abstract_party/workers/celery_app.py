from celery import Celery

from abstract_party.config import get_settings

settings = get_settings()

celery_app = Celery(
    "abstract_party",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.task_track_started = True
celery_app.conf.task_routes = {
    "abstract_party.workers.tasks.*": {"queue": "default"},
}

# Register tasks
from abstract_party.workers import tasks as _tasks  # noqa: E402, F401
