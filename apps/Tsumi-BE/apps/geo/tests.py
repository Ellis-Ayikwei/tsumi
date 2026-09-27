"""Service area tests. Need PostGIS (see backend/test_settings.py)."""

from django.test import SimpleTestCase
from rest_framework.test import APITestCase

from apps.errand.models import Errand
from apps.errand.tests import API, balance, make_user
from apps.geo.models import ServiceArea
from apps.geo.services import boundary_from_geojson, is_served

S = ServiceArea.Status


def square(west, south, east, north):
    return {"type": "Polygon", "coordinates": [[[west, south], [east, south], [east, north], [west, north], [west, south]]]}


ACCRA = square(-0.30, 5.50, -0.05, 5.70)
OSU = (5.556, -0.182)  # inside ACCRA
KUMASI = (6.688, -1.624)  # outside ACCRA


class CoverageRuleTests(SimpleTestCase):
    def test_truth_table(self):
        self.assertTrue(is_served(set(), any_active_area=False))  # nothing configured yet: open
        self.assertFalse(is_served(set(), any_active_area=True))  # outside every active area
        self.assertTrue(is_served({S.ACTIVE}, any_active_area=True))
        self.assertFalse(is_served({S.ACTIVE, S.NO_SERVICE}, any_active_area=True))  # carve-out wins
        self.assertFalse(is_served({S.NO_SERVICE}, any_active_area=False))


class ServiceAreaAdminTests(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@example.test", is_staff=True)
        self.client.force_authenticate(self.admin)

    def create(self, **body):
        return self.client.post(f"{API}/admin/service-areas/", body, format="json")

    def check(self, point):
        return self.client.get(f"{API}/admin/service-areas/check/", {"lat": point[0], "lng": point[1]}).data

    def test_non_staff_forbidden(self):
        self.client.force_authenticate(make_user("plain@example.test"))
        self.assertEqual(self.client.get(f"{API}/admin/service-areas/").status_code, 403)

    def test_geojson_area_returns_geometry_and_governs_coverage(self):
        response = self.create(name="Greater Accra", kind="region", status="active", boundary=ACCRA)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["geometry"]["type"], "MultiPolygon")
        self.assertTrue(self.check(OSU)["served"])
        outside = self.check(KUMASI)
        self.assertFalse(outside["served"])
        self.assertIn("doesn't serve this spot", outside["message"])

    def test_no_service_zone_carves_out_of_active_area_with_its_note(self):
        self.create(name="Greater Accra", kind="region", status="active", boundary=ACCRA)
        response = self.create(
            name="Osu", kind="zone", status="no_service", note="Roads closed for the festival.",
            circle={"lat": OSU[0], "lng": OSU[1], "radius_km": 1},
        )
        self.assertEqual(response.status_code, 201, response.data)
        result = self.check(OSU)
        self.assertFalse(result["served"])
        self.assertEqual(result["message"], "Tsumi isn't running errands in Osu right now. Roads closed for the festival.")

    def test_inactive_areas_change_nothing(self):
        self.create(name="Greater Accra", kind="region", status="inactive", boundary=ACCRA)
        self.assertTrue(self.check(KUMASI)["served"])

    def test_bad_shapes_rejected_with_the_reason(self):
        swapped = square(5.50, -0.30, 5.70, 200)  # latitude out of range
        self.assertEqual(self.create(name="A", kind="zone", boundary=swapped).data["error"]["details"][0]["field"], "boundary")
        bowtie = {"type": "Polygon", "coordinates": [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]}
        response = self.create(name="B", kind="zone", boundary=bowtie)
        self.assertEqual(response.status_code, 400)
        self.assertIn("isn't valid", response.data["error"]["message"])
        self.assertEqual(self.create(name="C", kind="zone").status_code, 400)  # no shape at all
        self.assertEqual(ServiceArea.objects.count(), 0)

    def test_duplicate_name_is_conflict(self):
        self.create(name="Tema", kind="city", boundary=ACCRA)
        self.assertEqual(self.create(name="Tema", kind="city", boundary=ACCRA).status_code, 409)
        self.assertEqual(self.create(name="Tema", kind="zone", boundary=ACCRA).status_code, 201)

    def test_patch_status_and_delete(self):
        area_id = self.create(name="Tema", kind="city", boundary=ACCRA).data["id"]
        url = f"{API}/admin/service-areas/{area_id}/"
        response = self.client.patch(url, {"status": "no_service"}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["status"], "no_service")
        self.assertEqual(self.client.delete(url).status_code, 204)
        self.assertFalse(ServiceArea.objects.exists())

    def test_import_creates_inactive_and_reimport_keeps_status(self):
        collection = {
            "type": "FeatureCollection",
            "features": [
                {"type": "Feature", "properties": {"shapeName": "Greater Accra"}, "geometry": ACCRA},
                {"type": "Feature", "properties": {"ADM1_EN": "Ashanti"}, "geometry": square(-2.2, 6.0, -1.0, 7.5)},
            ],
        }
        url = f"{API}/admin/service-areas/import/"
        response = self.client.post(url, {"kind": "region", "features": collection}, format="json")
        self.assertEqual(response.data, {"created": 2, "updated": 0})
        self.assertEqual(set(ServiceArea.objects.values_list("status", flat=True)), {S.INACTIVE})
        ServiceArea.objects.filter(name="Ashanti").update(status=S.ACTIVE)
        response = self.client.post(url, {"kind": "region", "features": collection}, format="json")
        self.assertEqual(response.data, {"created": 0, "updated": 2})
        self.assertEqual(ServiceArea.objects.get(name="Ashanti").status, S.ACTIVE)

    def test_import_is_all_or_nothing(self):
        collection = {
            "type": "FeatureCollection",
            "features": [
                {"type": "Feature", "properties": {"name": "Good"}, "geometry": ACCRA},
                {"type": "Feature", "properties": {}, "geometry": ACCRA},
            ],
        }
        response = self.client.post(f"{API}/admin/service-areas/import/", {"kind": "region", "features": collection}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Feature 2 has no name", response.data["error"]["message"])
        self.assertFalse(ServiceArea.objects.exists())


class ErrandCoverageTests(APITestCase):
    def setUp(self):
        self.customer = make_user("customer@example.test", balance_pesewas=10000)
        ServiceArea.objects.create(
            name="Greater Accra", kind="region", status=S.ACTIVE,
            boundary=boundary_from_geojson(ACCRA),
        )
        self.client.force_authenticate(self.customer)

    def post(self, **extra):
        body = {"title": "Buy medicine", "errand_type": "shopping", "price_pesewas": 3000, "dropoff_address": "Somewhere", **extra}
        return self.client.post(f"{API}/errands/", body, format="json")

    def test_pin_inside_active_area_posts(self):
        response = self.post(dropoff_lat=f"{OSU[0]:.6f}", dropoff_lng=f"{OSU[1]:.6f}")
        self.assertEqual(response.status_code, 201, response.data)

    def test_pin_outside_is_refused_and_nothing_charged(self):
        response = self.post(pickup_address="Kejetia", pickup_lat=f"{KUMASI[0]:.6f}", pickup_lng=f"{KUMASI[1]:.6f}")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["details"][0]["field"], "pickup_lat")
        self.assertEqual(Errand.objects.count(), 0)
        self.assertEqual(balance(self.customer), 10000)

    def test_one_out_of_area_stop_refuses_the_whole_errand(self):
        body = {
            "title": "Two drops", "errand_type": "delivery", "price_pesewas": 3000,
            "stops": [
                {"kind": "pickup", "address": "Osu", "lat": f"{OSU[0]:.6f}", "lng": f"{OSU[1]:.6f}"},
                {"kind": "dropoff", "address": "Kejetia", "lat": f"{KUMASI[0]:.6f}", "lng": f"{KUMASI[1]:.6f}"},
            ],
        }
        response = self.client.post(f"{API}/errands/", body, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["details"][0]["field"], "stops.1.lat")
        self.assertEqual(Errand.objects.count(), 0)
        self.assertEqual(balance(self.customer), 10000)

    def test_typed_address_without_pin_still_posts(self):
        self.assertEqual(self.post().status_code, 201)
