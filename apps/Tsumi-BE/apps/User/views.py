from django.db import transaction
from django.utils import timezone
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trust.services import agent_stats
from backend.api_exceptions import Conflict

from .models import AgentProfile
from .serializer import AgentProfileSerializer, KycSubmitSerializer


def _my_profile(request, lock=False):
    if not request.user.is_agent:
        raise PermissionDenied("Only agent accounts have an agent profile.")
    qs = AgentProfile.objects.select_for_update() if lock else AgentProfile.objects
    profile, _ = qs.get_or_create(user=request.user)
    return profile


class MyAgentProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /agents/me/ - availability and vehicle type, plus earned stats."""

    serializer_class = AgentProfileSerializer

    def get_object(self):
        return _my_profile(self.request)

    def retrieve(self, request, *args, **kwargs):
        data = self.get_serializer(self.get_object()).data
        data["stats"] = agent_stats(request.user.id)
        return Response(data)


class KycSubmitView(APIView):
    """POST /agents/me/kyc/ (multipart) - submit or resubmit identity documents."""

    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def post(self, request):
        profile = _my_profile(request, lock=True)
        if profile.kyc_status in (AgentProfile.KycStatus.PENDING, AgentProfile.KycStatus.APPROVED):
            raise Conflict(f"Your verification is already {profile.kyc_status}.")
        serializer = KycSubmitSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            kyc_status=AgentProfile.KycStatus.PENDING,
            kyc_submitted_at=timezone.now(),
            kyc_rejection_reason="",
        )
        return Response(AgentProfileSerializer(profile).data, status=201)
