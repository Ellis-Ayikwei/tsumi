from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import TrustBadge, UserBadge
from .serializers import TrustBadgeSerializer, UserBadgeSerializer


class TrustBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TrustBadge.objects.filter(is_active=True)
    serializer_class = TrustBadgeSerializer
    permission_classes = [AllowAny]


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=["get"])
    def my_badges(self, request):
        """Get current user's badges"""
        badges = self.get_queryset()
        serializer = self.get_serializer(badges, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def check_eligibility(self, request):
        """Check which badges the user is eligible for"""
        user = request.user
        eligible_badges = []

        all_badges = TrustBadge.objects.filter(is_active=True)
        for badge in all_badges:
            if UserBadge.objects.filter(user=user, badge=badge).exists():
                continue

            is_eligible = True
            reasons = []

            if badge.min_errands > user.completed_errands:
                is_eligible = False
                reasons.append(
                    f"Need {badge.min_errands - user.completed_errands} more completed errands"
                )

            if badge.min_rating > user.average_rating:
                is_eligible = False
                reasons.append(f"Need rating of at least {badge.min_rating}")

            if badge.requires_kyc and not user.kyc_verified:
                is_eligible = False
                reasons.append("KYC verification required")

            if is_eligible and not badge.requires_admin_approval:
                # Auto-award badge
                UserBadge.objects.create(user=user, badge=badge)
                eligible_badges.append(
                    {
                        "badge": TrustBadgeSerializer(badge).data,
                        "status": "awarded",
                    }
                )
            elif is_eligible:
                eligible_badges.append(
                    {
                        "badge": TrustBadgeSerializer(badge).data,
                        "status": "awaiting_approval",
                    }
                )
            else:
                eligible_badges.append(
                    {
                        "badge": TrustBadgeSerializer(badge).data,
                        "status": "not_eligible",
                        "reasons": reasons,
                    }
                )

        return Response(eligible_badges)


