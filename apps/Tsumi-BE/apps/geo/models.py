from django.contrib.gis.db import models as gis
from django.db import models

from apps.Basemodel.models import Basemodel


class ServiceArea(Basemodel):
    """A region, city or zone drawn on the map, and whether Tsumi works there.

    Which areas contain a point is answered by PostGIS from the boundary, so
    areas need no parent links: a zone inside Accra is simply a smaller shape.
    """

    class Kind(models.TextChoices):
        REGION = "region", "Region"
        CITY = "city", "City or town"
        ZONE = "zone", "Zone"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        NO_SERVICE = "no_service", "No service"

    name = models.CharField(max_length=120)
    kind = models.CharField(max_length=10, choices=Kind.choices, default=Kind.ZONE)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.INACTIVE, db_index=True)
    note = models.CharField(max_length=255, blank=True)
    # WGS84 lng/lat, the same coordinates the apps send. GiST-indexed by default.
    boundary = gis.MultiPolygonField(srid=4326)

    class Meta:
        ordering = ["kind", "name"]
        constraints = [models.UniqueConstraint(fields=["kind", "name"], name="uniq_service_area_kind_name")]

    def __str__(self):
        return f"{self.name} ({self.kind})"
