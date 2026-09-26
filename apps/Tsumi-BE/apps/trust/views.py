from rest_framework import generics

from .models import TrustBadge, UserBadge
from .serializers import TrustBadgeSerializer, UserBadgeSerializer


class BadgeListView(generics.ListAPIView):
    serializer_class = TrustBadgeSerializer
    pagination_class = None
    queryset = TrustBadge.objects.filter(is_active=True)


class UserBadgeListView(generics.ListAPIView):
    """GET /trust/users/<user_id>/badges/ - badges are shown to customers choosing an agent."""

    serializer_class = UserBadgeSerializer
    pagination_class = None

    def get_queryset(self):
        return UserBadge.objects.select_related("badge").filter(user_id=self.kwargs["user_id"])
