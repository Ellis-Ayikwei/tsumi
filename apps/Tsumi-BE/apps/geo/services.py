"""Service coverage: where Tsumi runs errands, answered by PostGIS."""

import json

from django.contrib.gis.gdal import GDALException
from django.contrib.gis.geos import GEOSException, GEOSGeometry, MultiPolygon, Point
from django.db import connection, transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import ServiceArea

Status = ServiceArea.Status

# Property names that hold a feature's name in common boundary files
# (geoBoundaries uses shapeName; HDX/OCHA files use ADM1_EN / ADM2_EN).
NAME_KEYS = ("name", "shapeName", "NAME", "ADM2_EN", "ADM1_EN", "region", "REGION", "district", "DISTRICT")
MAX_IMPORT_FEATURES = 500


def is_served(containing: set[str], any_active_area: bool) -> bool:
    """The coverage rule, given the statuses of the areas a pin falls in.

    A pin in a no-service area is never served. Until any area is active
    the rest of the map is open, so importing regions (inactive by default)
    never switches Tsumi off by accident. Once one is active, a pin must sit
    inside an active area. Inactive areas count for nothing.
    """
    if Status.NO_SERVICE in containing:
        return False
    return not any_active_area or Status.ACTIVE in containing


def coverage(lat, lng):
    """(served, blocking_area) for a pin; blocking_area is the no-service area that refused it."""
    point = Point(float(lng), float(lat), srid=4326)
    hits = list(
        ServiceArea.objects.filter(boundary__intersects=point)
        .exclude(status=Status.INACTIVE)
        .only("name", "status", "note")
    )
    statuses = {h.status for h in hits}
    any_active = Status.ACTIVE in statuses or ServiceArea.objects.filter(status=Status.ACTIVE).exists()
    blocking = next((h for h in hits if h.status == Status.NO_SERVICE), None)
    return is_served(statuses, any_active), blocking


def refusal_message(blocking):
    """What the customer sees when a pin is outside coverage."""
    if blocking:
        return f"Tsumi isn't running errands in {blocking.name} right now." + (f" {blocking.note}" if blocking.note else "")
    return "Tsumi doesn't serve this spot yet. Move the pin inside our service area."


def boundary_from_geojson(geometry) -> MultiPolygon:
    """A validated MultiPolygon from admin-supplied GeoJSON (Polygon or MultiPolygon)."""
    try:
        geom = GEOSGeometry(json.dumps(geometry), srid=4326)
    except (GEOSException, GDALException, ValueError, TypeError):
        raise ValidationError({"boundary": "That isn't valid GeoJSON. Send a Polygon or MultiPolygon geometry."})
    if geom.geom_type == "Polygon":
        geom = MultiPolygon(geom, srid=4326)
    if geom.geom_type != "MultiPolygon" or geom.empty:
        raise ValidationError({"boundary": f"Send a Polygon or MultiPolygon, not {geom.geom_type}."})
    xmin, ymin, xmax, ymax = geom.extent
    if not (-180 <= xmin <= xmax <= 180 and -90 <= ymin <= ymax <= 90):
        raise ValidationError({"boundary": "Coordinates are out of range. GeoJSON lists longitude first, then latitude."})
    if not geom.valid:
        raise ValidationError({"boundary": f"The shape isn't valid ({geom.valid_reason}). Fix it and upload again."})
    return geom


def circle(lat, lng, radius_km) -> MultiPolygon:
    """A round area measured on the ground (geography buffer), for quick zones."""
    with connection.cursor() as cur:
        cur.execute(
            "SELECT ST_AsBinary(ST_Buffer(ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, %s, 'quad_segs=16')::geometry)",
            [float(lng), float(lat), float(radius_km) * 1000],
        )
        wkb = cur.fetchone()[0]
    return MultiPolygon(GEOSGeometry(memoryview(wkb), srid=4326), srid=4326)


def import_features(collection, kind):
    """Create or refresh one area per feature of a GeoJSON FeatureCollection.

    All or nothing. New areas start inactive; re-importing the same file only
    refreshes shapes and never changes a status an admin already set.
    Returns (created, updated).
    """
    if not isinstance(collection, dict) or collection.get("type") != "FeatureCollection":
        raise ValidationError({"features": "Upload a GeoJSON FeatureCollection."})
    features = collection.get("features") or []
    if not features:
        raise ValidationError({"features": "The file has no features."})
    if len(features) > MAX_IMPORT_FEATURES:
        raise ValidationError({"features": f"Up to {MAX_IMPORT_FEATURES} features per import; this file has {len(features)}."})

    shapes = {}
    for i, feature in enumerate(features, start=1):
        props = (feature or {}).get("properties") or {}
        name = next((str(props[k]).strip() for k in NAME_KEYS if props.get(k)), "")
        if not name:
            raise ValidationError({"features": f"Feature {i} has no name. Looked for: {', '.join(NAME_KEYS)}."})
        if name in shapes:
            raise ValidationError({"features": f"'{name}' appears twice in the file."})
        try:
            shapes[name] = boundary_from_geojson((feature or {}).get("geometry"))
        except ValidationError as e:
            raise ValidationError({"features": f"{name}: {e.detail['boundary'][0]}"})

    now = timezone.now()
    with transaction.atomic():
        existing = {a.name: a for a in ServiceArea.objects.select_for_update().filter(kind=kind, name__in=shapes)}
        for name, area in existing.items():
            area.boundary, area.updated_at = shapes[name], now
        ServiceArea.objects.bulk_update(existing.values(), ["boundary", "updated_at"])
        ServiceArea.objects.bulk_create(
            ServiceArea(name=name, kind=kind, boundary=shape) for name, shape in shapes.items() if name not in existing
        )
    return len(shapes) - len(existing), len(existing)
