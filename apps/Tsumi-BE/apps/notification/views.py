from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """GET /notifications/?unread=1"""

    serializer_class = NotificationSerializer

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        if self.request.query_params.get("unread"):
            qs = qs.filter(read_at__isnull=True)
        return qs

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response.data["unread_count"] = Notification.objects.filter(
            user=request.user, read_at__isnull=True
        ).count()
        return response


class MarkReadView(APIView):
    """POST /notifications/<id>/read/ or /notifications/read-all/"""

    def post(self, request, pk=None):
        qs = Notification.objects.filter(user=request.user, read_at__isnull=True)
        if pk is not None:
            qs = qs.filter(pk=pk)
        qs.update(read_at=timezone.now())
        return Response(status=status.HTTP_204_NO_CONTENT)
