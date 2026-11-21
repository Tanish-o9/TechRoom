from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "techroom_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

@celery_app.task(name="outbox.process_events")
def process_outbox_events():
    """Periodic worker task to drain and route outbox events."""
    return {"processed": 0, "status": "idle"}
