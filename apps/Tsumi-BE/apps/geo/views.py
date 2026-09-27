"""Admin API for service areas. Every view requires is_staff."""

from django.contrib.gis.db.models.functions import AsGeoJSON
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from backend.api_exceptions import Conflict

from . import services
from .models import ServiceArea
from .serializers import ImportSerializer, PointQuerySerializer, ServiceAreaSerializer, ServiceAreaWriteSerializer

IsAdmin = permissions.IsAdminUser


def _with_geojson(qs):
    return qs.annotate(geojson=AsGeoJSON("boundary", precision=5))


def _save(area, data):
    """Apply validated fields, turning a circle into a real boundary. Duplicate names are a 409."""
    for field in ("name", "kind", "status", "note"):
        if field in data:
            setattr(area, field, data[field])
    if "boundary" in data:
        area.boundary = services.boundary_from_geojson(data["boundary"])
    elif "circle" in data:
        c = data["circle"]
        area.boundary = services.circle(c["lat"], c["lng"], c["radius_km"])
    try:
        with transaction.atomic():  # savepoint: a duplicate name must not poison the outer transaction
            area.save()
    except IntegrityError:
        raise Conflict(f"A {area.get_kind_display().lower()} named '{area.name}' already exists.")
    return _with_geojson(ServiceArea.objects.filter(pk=area.pk)).get()


@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def service_areas(request):
    """GET lists every area with its (simplified) shape for the map; POST creates one."""
    if request.method == "GET":
        qs = ServiceArea.objects.all()
        if request.query_params.get("status"):
            qs = qs.filter(status=request.query_params["status"])
        return Response(ServiceAreaSerializer(_with_geojson(qs), many=True).data)
    serializer = ServiceAreaWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    area = _save(ServiceArea(), serializer.validated_data)
    return Response(ServiceAreaSerializer(area).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAdmin])
def service_area_detail(request, pk):
    area = get_object_or_404(ServiceArea, pk=pk)
    if request.method == "DELETE":
        area.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = ServiceAreaWriteSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    return Response(ServiceAreaSerializer(_save(area, serializer.validated_data)).data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def service_area_import(request):
    """Bulk-create areas from a GeoJSON FeatureCollection (e.g. Ghana's regions)."""
    serializer = ImportSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        created, updated = services.import_features(serializer.validated_data["features"], serializer.validated_data["kind"])
    except IntegrityError:
        raise Conflict("Another import changed these areas at the same time. Try again.")
    return Response({"created": created, "updated": updated})


@api_view(["GET"])
@permission_classes([IsAdmin])
def service_area_check(request):
    """Would an errand pinned here be accepted? Lets admins test a spot on the map."""
    serializer = PointQuerySerializer(data=request.query_params)
    serializer.is_valid(raise_exception=True)
    served, blocking = services.coverage(serializer.validated_data["lat"], serializer.validated_data["lng"])
    return Response({"served": served, "message": None if served else services.refusal_message(blocking)})
