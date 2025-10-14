"""
Debug example demonstrating from_db-based distance recalculation with debug messages.

This shows how Django's from_db classmethod automatically calculates
distance every time a Request is loaded from the database, with detailed debug output.
"""

from apps.Request.models import Request
from apps.JourneyStop.models import JourneyStop
from apps.Location.models import Location
from apps.User.models import User
from decimal import Decimal


def demonstrate_debug_from_db_recalculation():
    """
    Demonstrate how from_db-based recalculation works with debug messages.
    """
    print("=== Debug from_db Distance Recalculation Demo ===\n")

    # Create test data
    user = User.objects.create_user(
        email="debug@example.com", password="debug123", user_type="customer"
    )

    # Create locations
    location1 = Location.objects.create(
        address="123 Main St, New York",
        address_line1="123 Main St",
        city="New York",
        county="NY",
        postcode="10001",
        latitude=Decimal("40.7128"),
        longitude=Decimal("-74.0060"),
        contact_name="John Doe",
        contact_phone="123-456-7890",
    )

    location2 = Location.objects.create(
        address="456 Oak Ave, Brooklyn",
        address_line1="456 Oak Ave",
        city="Brooklyn",
        county="NY",
        postcode="11201",
        latitude=Decimal("40.7589"),
        longitude=Decimal("-73.9851"),
        contact_name="Jane Smith",
        contact_phone="098-765-4321",
    )

    # Create a request
    request = Request.objects.create(user=user, request_type="journey", status="draft")

    print(f"Created request {request.id}")
    print(f"Initial estimated_distance: {request.estimated_distance}")

    # Add stops
    JourneyStop.objects.create(
        request=request, location=location1, type="pickup", sequence=0
    )

    JourneyStop.objects.create(
        request=request, location=location2, type="dropoff", sequence=1
    )

    print(f"\nAdded {request.journey_stops.count()} journey stops")

    # Now fetch the request - this should trigger from_db() and _post_fetch()
    print("\n" + "=" * 60)
    print("FETCHING REQUEST - This should trigger from_db() and _post_fetch()")
    print("=" * 60)

    fetched_request = Request.objects.get(id=request.id)

    print(f"\nFinal result:")
    print(f"Request ID: {fetched_request.id}")
    print(f"Estimated Distance: {fetched_request.estimated_distance} km")

    # Fetch again to see if it skips calculation
    print("\n" + "=" * 60)
    print("FETCHING AGAIN - This should skip calculation (already calculated)")
    print("=" * 60)

    fetched_request2 = Request.objects.get(id=request.id)

    print(f"\nSecond fetch result:")
    print(f"Request ID: {fetched_request2.id}")
    print(f"Estimated Distance: {fetched_request2.estimated_distance} km")

    print("\n=== Debug Demo Complete ===")
    print("Key Debug Messages to Look For:")
    print("🔄 [from_db] - Request loaded from database")
    print("🔍 [_post_fetch] - Post-fetch processing started")
    print("🔍 [_stops_changed] - Checking if stops changed")
    print("📊 [_post_fetch] - Distance calculation needed")
    print("🚀 [_post_fetch] - Starting distance calculation")
    print("🌐 [calculate_distance_hybrid] - Hybrid calculation started")
    print("💾 [calculate_distance_google] - Cache check/API call")
    print("✅ [_post_fetch] - Distance calculated successfully")
    print("💾 [_post_fetch] - Database updated")
    print("⏭️  [_post_fetch] - Distance already calculated, skipping")


def demonstrate_debug_with_filter():
    """
    Demonstrate debug messages with filter operations.
    """
    print("\n=== Debug with Filter Operations ===\n")

    # Get all requests - this should trigger from_db() on each
    print("Filtering all requests - should trigger from_db() on each:")
    requests = Request.objects.filter(request_type="journey")

    for request in requests:
        print(f"Request {request.id}: {request.estimated_distance} km")


def demonstrate_debug_performance():
    """
    Demonstrate performance considerations with debug messages.
    """
    print("\n=== Debug Performance Considerations ===\n")

    print("Debug Message Categories:")
    print("🔄 Database Operations - from_db() calls")
    print("🔍 Processing - _post_fetch() and _stops_changed()")
    print("📊 Decision Making - whether to calculate distance")
    print("🚀 Calculation Start - beginning distance calculation")
    print("🌐 API Operations - Google API calls and caching")
    print("💾 Cache Operations - cache hits and misses")
    print("✅ Success - successful calculations")
    print("❌ Errors - failed calculations")
    print("⚠️  Warnings - insufficient data")
    print("⏭️  Skipping - already calculated")

    print("\nPerformance Tips:")
    print(
        "1. Monitor 🔄 messages - too many from_db() calls indicate performance issues"
    )
    print("2. Watch for 💾 cache hits - good caching reduces API calls")
    print("3. Look for ⏭️ skip messages - indicates efficient caching")
    print("4. Check for ❌ errors - failed calculations need investigation")
    print("5. Monitor 🌐 API calls - expensive operations")


if __name__ == "__main__":
    # This would be run in Django shell or management command
    print("To run this debug demo:")
    print("1. python manage.py shell")
    print("2. exec(open('apps/Request/examples/debug_from_db_example.py').read())")
    print("3. demonstrate_debug_from_db_recalculation()")
    print("4. demonstrate_debug_with_filter()")
    print("5. demonstrate_debug_performance()")

