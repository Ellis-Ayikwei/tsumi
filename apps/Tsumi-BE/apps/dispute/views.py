from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response

from apps.errand.services import visible_errands

from . import services
from .models import Dispute
from .serializers import DisputeSerializer


class DisputeListCreateView(generics.ListCreateAPIView):
    """GET/POST /disputes/ - disputes on errands where the caller is customer or agent."""

    serializer_class = DisputeSerializer

    def get_queryset(self):
        user = self.request.user
        return Dispute.objects.select_related("errand").filter(
            Q(errand__customer=user) | Q(errand__agent=user)
        )

    def create(self, request, *args, **kwargs):
        serializer = DisputeSerializer(data=request.data)
        # Errands the caller cannot see are indistinguishable from missing ones.
        serializer.fields["errand"].queryset = visible_errands(request.user)
        serializer.is_valid(raise_exception=True)
        errand = serializer.validated_data["errand"]
        dispute = services.open_dispute(
            errand.pk,
            request.user,
            serializer.validated_data["reason"],
            serializer.validated_data["description"],
        )
        return Response(DisputeSerializer(dispute).data, status=status.HTTP_201_CREATED)
