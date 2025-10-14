import math
from typing import List, Dict, Optional
from apps.Request.models import Request
from apps.JourneyStop.models import JourneyStop


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth using the Haversine formula.

    Args:
        lat1, lon1: Latitude and longitude of first point in decimal degrees
        lat2, lon2: Latitude and longitude of second point in decimal degrees

    Returns:
        Distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))

    # Radius of earth in kilometers
    r = 6371
    return c * r


def calculate_estimated_distance(request: Request) -> Optional[float]:
    """
    Calculate the estimated total distance for a request using its journey stops.

    Args:
        request: Request instance with journey stops

    Returns:
        Total distance in kilometers, or None if insufficient location data
    """
    if not request:
        return None

    # Get all journey stops ordered by sequence
    stops = request.stops.all().order_by("sequence")

    if len(stops) < 2:
        return None

    total_distance = 0.0
    valid_stops = []

    # Filter stops with valid coordinates
    for stop in stops:
        if (
            stop.location
            and stop.location.latitude is not None
            and stop.location.longitude is not None
        ):
            valid_stops.append(
                {
                    "lat": float(stop.location.latitude),
                    "lon": float(stop.location.longitude),
                    "address": stop.location.address,
                    "type": stop.type,
                }
            )

    if len(valid_stops) < 2:
        return None

    # Calculate distance between consecutive stops
    for i in range(len(valid_stops) - 1):
        current_stop = valid_stops[i]
        next_stop = valid_stops[i + 1]

        distance = haversine_distance(
            current_stop["lat"], current_stop["lon"], next_stop["lat"], next_stop["lon"]
        )
        total_distance += distance

    return round(total_distance, 2)


def calculate_leg_distances(request: Request) -> List[Dict]:
    """
    Calculate distances for each leg of the journey.

    Args:
        request: Request instance with journey stops

    Returns:
        List of dictionaries with leg information including distance
    """
    if not request:
        return []

    stops = request.stops.all().order_by("sequence")

    if len(stops) < 2:
        return []

    legs = []
    valid_stops = []

    # Filter stops with valid coordinates
    for stop in stops:
        if (
            stop.location
            and stop.location.latitude is not None
            and stop.location.longitude is not None
        ):
            valid_stops.append(
                {
                    "id": str(stop.id),
                    "lat": float(stop.location.latitude),
                    "lon": float(stop.location.longitude),
                    "address": stop.location.address,
                    "type": stop.type,
                    "sequence": stop.sequence,
                }
            )

    if len(valid_stops) < 2:
        return []

    # Calculate distance for each leg
    for i in range(len(valid_stops) - 1):
        current_stop = valid_stops[i]
        next_stop = valid_stops[i + 1]

        distance = haversine_distance(
            current_stop["lat"], current_stop["lon"], next_stop["lat"], next_stop["lon"]
        )

        legs.append(
            {
                "from_stop_id": current_stop["id"],
                "to_stop_id": next_stop["id"],
                "from_address": current_stop["address"],
                "to_address": next_stop["address"],
                "from_type": current_stop["type"],
                "to_type": next_stop["type"],
                "distance_km": round(distance, 2),
                "sequence": i + 1,
            }
        )

    return legs


def get_route_summary(request: Request) -> Dict:
    """
    Get a comprehensive summary of the route including distances and stops.

    Args:
        request: Request instance with journey stops

    Returns:
        Dictionary with route summary information
    """
    if not request:
        return {}

    stops = request.stops.all().order_by("sequence")

    if len(stops) < 2:
        return {
            "total_distance_km": 0,
            "total_stops": len(stops),
            "valid_stops": 0,
            "legs": [],
            "has_valid_coordinates": False,
        }

    # Calculate total distance
    total_distance = calculate_estimated_distance(request)

    # Calculate leg distances
    legs = calculate_leg_distances(request)

    # Count valid stops
    valid_stops = sum(
        1
        for stop in stops
        if (
            stop.location
            and stop.location.latitude is not None
            and stop.location.longitude is not None
        )
    )

    return {
        "total_distance_km": total_distance,
        "total_stops": len(stops),
        "valid_stops": valid_stops,
        "legs": legs,
        "has_valid_coordinates": valid_stops >= 2,
        "pickup_address": (
            stops.first().location.address
            if stops.first() and stops.first().location
            else None
        ),
        "dropoff_address": (
            stops.last().location.address
            if stops.last() and stops.last().location
            else None
        ),
    }
