from minio import Minio
from minio.error import S3Error

from abstract_party.config import get_settings


class MinioService:
    def __init__(self) -> None:
        s = get_settings()
        self._client = Minio(
            s.minio_endpoint,
            access_key=s.minio_access_key,
            secret_key=s.minio_secret_key,
            secure=s.minio_use_ssl,
        )
        self._bucket = s.minio_bucket

    def ensure_bucket(self) -> None:
        try:
            if not self._client.bucket_exists(self._bucket):
                self._client.make_bucket(self._bucket)
        except S3Error:
            raise
