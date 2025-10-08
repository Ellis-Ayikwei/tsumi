from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Errand, ErrandRating
from .serializers import (
    ErrandSerializer,
    ErrandCreateSerializer,
    ErrandRatingSerializer,
)


class ErrandViewSet(viewsets.ModelViewSet):
    queryset = Errand.objects.all()
    serializer_class = ErrandSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return ErrandCreateSerializer
        return ErrandSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        errand = serializer.save(customer=request.user)
        errand.calculate_commission()
        return Response(
            ErrandSerializer(errand).data, status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["get"])
    def my_errands(self, request):
        """Get errands created by current user"""
        errands = self.queryset.filter(customer=request.user)
        serializer = self.get_serializer(errands, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my_jobs(self, request):
        """Get errands assigned to current agent"""
        if request.user.user_type != "agent":
            return Response(
                {"error": "Only agents can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN,
            )
        errands = self.queryset.filter(agent=request.user)
        serializer = self.get_serializer(errands, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def available(self, request):
        """Get available errands for agents"""
        if request.user.user_type != "agent":
            return Response(
                {"error": "Only agents can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN,
            )
        errands = self.queryset.filter(status="pending", agent__isnull=True)
        serializer = self.get_serializer(errands, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        """Agent accepts an errand"""
        errand = self.get_object()
        if request.user.user_type != "agent":
            return Response(
                {"error": "Only agents can accept errands"},
                status=status.HTTP_403_FORBIDDEN,
            )
        if errand.status != "pending":
            return Response(
                {"error": "This errand is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        errand.agent = request.user
        errand.status = "assigned"
        errand.assigned_at = timezone.now()
        errand.save()
        return Response({"message": "Errand accepted successfully"})

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        """Agent starts the errand"""
        errand = self.get_object()
        if errand.agent != request.user:
            return Response(
                {"error": "You are not assigned to this errand"},
                status=status.HTTP_403_FORBIDDEN,
            )
        errand.status = "in_progress"
        errand.started_at = timezone.now()
        errand.save()
        return Response({"message": "Errand started"})

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        """Agent marks errand as completed"""
        errand = self.get_object()
        if errand.agent != request.user:
            return Response(
                {"error": "You are not assigned to this errand"},
                status=status.HTTP_403_FORBIDDEN,
            )
        errand.status = "completed"
        errand.completed_at = timezone.now()
        errand.save()
        return Response({"message": "Errand completed"})

    @action(detail=True, methods=["post"])
    def rate(self, request, pk=None):
        """Rate an errand and the agent/customer"""
        errand = self.get_object()
        if request.user not in [errand.customer, errand.agent]:
            return Response(
                {"error": "You are not part of this errand"},
                status=status.HTTP_403_FORBIDDEN,
            )

        rated_user = errand.agent if request.user == errand.customer else errand.customer

        serializer = ErrandRatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                errand=errand, rated_by=request.user, rated_user=rated_user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


