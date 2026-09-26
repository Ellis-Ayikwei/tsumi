from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from . import services
from .models import Errand
from .serializers import (
    CancelSerializer,
    ErrandCreateSerializer,
    ErrandDetailSerializer,
    ErrandSerializer,
    RateSerializer,
)


class ErrandViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    """
    GET  /errands/                  mine (customer), or ?scope=available|mine (agent)
    POST /errands/                  create and fund from wallet (402 if short)
    GET  /errands/<id>/
    POST /errands/<id>/accept|release|start|deliver|confirm|cancel|rate/
    """

    def get_queryset(self):
        qs = services.visible_errands(self.request.user).select_related("rating")
        if self.action == "retrieve":
            qs = qs.prefetch_related("events")
        user = self.request.user
        scope = self.request.query_params.get("scope")
        if user.is_agent and scope == "available":
            qs = qs.filter(status=Errand.Status.OPEN)
        elif user.is_agent and scope == "mine":
            qs = qs.filter(agent=user)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status__in=status_filter.split(","))
        return qs

    def get_serializer_class(self):
        if self.action == "create":
            return ErrandCreateSerializer
        if self.action == "retrieve":
            return ErrandDetailSerializer
        return ErrandSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_agent:
            raise PermissionDenied("Agent accounts cannot post errands. Use a customer account.")
        serializer = ErrandCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        errand, created = services.create_errand(request.user, serializer.validated_data)
        return Response(
            ErrandSerializer(errand, context={"request": request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def _respond(self, errand_id):
        errand = services.visible_errands(self.request.user).prefetch_related("events").get(pk=errand_id)
        return Response(ErrandDetailSerializer(errand, context={"request": self.request}).data)

    def _check_visible(self):
        # 404 for errands the caller may not see, before any service call.
        self.get_object()

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        self._check_visible()
        services.accept(pk, request.user)
        return self._respond(pk)

    @action(detail=True, methods=["post"])
    def release(self, request, pk=None):
        self._check_visible()
        services.release(pk, request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        self._check_visible()
        services.start(pk, request.user)
        return self._respond(pk)

    @action(detail=True, methods=["post"])
    def deliver(self, request, pk=None):
        self._check_visible()
        services.deliver(pk, request.user)
        return self._respond(pk)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        self._check_visible()
        services.confirm(pk, request.user)
        return self._respond(pk)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        self._check_visible()
        serializer = CancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.cancel(pk, request.user, serializer.validated_data["reason"])
        return self._respond(pk)

    @action(detail=True, methods=["post"])
    def rate(self, request, pk=None):
        self._check_visible()
        serializer = RateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.rate(pk, request.user, **serializer.validated_data)
        return self._respond(pk)
