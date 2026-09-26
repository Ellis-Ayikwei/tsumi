import logging

from django.db import connection
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


class ApiConnectionStatusView(APIView):
    """Liveness: the process is up and serving HTTP. Touches nothing."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, _):
        return Response({"status": "Connected Tsumi Api"})


class HealthCheckView(APIView):
    """Readiness: the database answers. Point the platform health check here."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, _):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return Response({"status": "ok", "checks": {"database": "ok"}})
        except Exception:
            logger.exception("Health check: database unreachable")
            return Response(
                {"status": "unhealthy", "checks": {"database": "error"}},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
