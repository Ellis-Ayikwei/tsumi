import math
from typing import List, Dict, Optional, Tuple
from apps.Request.models import Request
from apps.JourneyStop.models import JourneyStop


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points using the Haversine formula.
    """
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    return c * 6371  # Earth radius in km


def vincenty_distance(
    lat1: float, lon1: float, lat2: float, lon2: float, max_iterations: int = 200
) -> float:
    """
    Calculate distance using the more accurate Vincenty's formulae.
    This is more accurate than Haversine for longer distances.
    """
    # WGS-84 ellipsoid parameters
    a = 6378137.0  # Semi-major axis
    f = 1 / 298.257223563  # Flattening
    b = (1 - f) * a  # Semi-minor axis

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    U1 = math.atan((1 - f) * math.tan(lat1))
    U2 = math.atan((1 - f) * math.tan(lat2))
    L = lon2 - lon1
    lambda_p = L

    for _ in range(max_iterations):
        sin_sigma = math.sqrt(
            (math.cos(U2) * math.sin(lambda_p)) ** 2
            + (
                math.cos(U1) * math.sin(U2)
                - math.sin(U1) * math.cos(U2) * math.cos(lambda_p)
            )
            ** 2
        )

        if sin_sigma == 0:
            return 0.0

        cos_sigma = math.sin(U1) * math.sin(U2) + math.cos(U1) * math.cos(
            U2
        ) * math.cos(lambda_p)
        sigma = math.atan2(sin_sigma, cos_sigma)

        sin_alpha = math.cos(U1) * math.cos(U2) * math.sin(lambda_p) / sin_sigma
        cos2_alpha = 1 - sin_alpha**2

        if cos2_alpha == 0:
            cos_2sigma_m = 0
        else:
            cos_2sigma_m = cos_sigma - 2 * math.sin(U1) * math.sin(U2) / cos2_alpha

        C = f / 16 * cos2_alpha * (4 + f * (4 - 3 * cos2_alpha))

        lambda_prev = lambda_p
        lambda_p = L + (1 - C) * f * sin_alpha * (
            sigma
            + C
            * sin_sigma
            * (cos_2sigma_m + C * cos_sigma * (-1 + 2 * cos_2sigma_m**2))
        )

        if abs(lambda_p - lambda_prev) < 1e-12:
            break

    u2 = cos2_alpha * (a**2 - b**2) / (b**2)
    A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
    B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))
    delta_sigma = (
        B
        * sin_sigma
        * (
            cos_2sigma_m
            + B
            / 4
            * (
                cos_sigma * (-1 + 2 * cos_2sigma_m**2)
                - B
                / 6
                * cos_2sigma_m
                * (-3 + 4 * sin_sigma**2)
                * (-3 + 4 * cos_2sigma_m**2)
            )
        )
    )

    s = b * A * (sigma - delta_sigma)
    return s / 1000  # Convert to kilometers


def apply_road_factor(distance: float, road_type: str = "urban") -> float:
    """
    Apply road factor to straight-line distance to approximate road distance.
    This is a simplified approach without API calls.
    """
    factors = {
        "highway": 1.1,  # Highways are relatively straight
        "urban": 1.3,  # Urban roads have more turns
        "rural": 1.2,  # Rural roads are somewhat straight
        "mountain": 1.5,  # Mountain roads are winding
        "city_center": 1.4,  # City centers have many turns
    }

    factor = factors.get(road_type, 1.3)
    return distance * factor


def calculate_terrain_factor(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Calculate a terrain factor based on elevation changes.
    This is a simplified approach - in reality, you'd need elevation data.
    """
    # Simplified terrain factor based on latitude (rough approximation)
    # Higher latitudes might have more challenging terrain
    avg_lat = (lat1 + lat2) / 2
    abs_lat = abs(avg_lat)

    if abs_lat > 60:  # Polar regions
        return 1.2
    elif abs_lat > 45:  # High latitudes
        return 1.1
    elif abs_lat > 30:  # Mid latitudes
        return 1.05
    else:  # Low latitudes
        return 1.0


def calculate_advanced_distance(
    request: Request,
    method: str = "vincenty",
    apply_road_correction: bool = True,
    road_type: str = "urban",
) -> Optional[float]:
    """
    Calculate distance using advanced methods with terrain and road corrections.

    Args:
        request: Request instance with journey stops
        method: "haversine", "vincenty", or "both"
        apply_road_correction: Whether to apply road distance factor
        road_type: Type of road for correction factor

    Returns:
        Total distance in kilometers
    """
    if not request:
        return None

    stops = request.stops.all().order_by("sequence")

    if len(stops) < 2:
        return None

    # Filter stops with valid coordinates
    valid_stops = []
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

    total_distance = 0.0

    # Calculate distance between consecutive stops
    for i in range(len(valid_stops) - 1):
        current_stop = valid_stops[i]
        next_stop = valid_stops[i + 1]

        lat1, lon1 = current_stop["lat"], current_stop["lon"]
        lat2, lon2 = next_stop["lat"], next_stop["lon"]

        if method == "haversine":
            distance = haversine_distance(lat1, lon1, lat2, lon2)
        elif method == "vincenty":
            distance = vincenty_distance(lat1, lon1, lat2, lon2)
        elif method == "both":
            # Use both methods and average them
            haversine_dist = haversine_distance(lat1, lon1, lat2, lon2)
            vincenty_dist = vincenty_distance(lat1, lon1, lat2, lon2)
            distance = (haversine_dist + vincenty_dist) / 2
        else:
            distance = haversine_distance(lat1, lon1, lat2, lon2)

        # Apply terrain factor
        terrain_factor = calculate_terrain_factor(lat1, lon1, lat2, lon2)
        distance *= terrain_factor

        # Apply road correction if requested
        if apply_road_correction:
            distance = apply_road_factor(distance, road_type)

        total_distance += distance

    return round(total_distance, 2)


def calculate_route_optimization(stops: List[Dict]) -> List[Dict]:
    """
    Optimize route using nearest neighbor algorithm (simplified TSP).
    This reorders stops to minimize total distance.
    """
    if len(stops) < 3:
        return stops

    # Keep first stop (pickup) and last stop (dropoff) fixed
    pickup = stops[0]
    dropoff = stops[-1]
    intermediate_stops = stops[1:-1]

    if not intermediate_stops:
        return stops

    # Simple nearest neighbor for intermediate stops
    optimized = [pickup]
    remaining = intermediate_stops.copy()
    current = pickup

    while remaining:
        # Find nearest stop to current position
        nearest_idx = 0
        min_distance = float("inf")

        for i, stop in enumerate(remaining):
            distance = haversine_distance(
                current["lat"], current["lon"], stop["lat"], stop["lon"]
            )
            if distance < min_distance:
                min_distance = distance
                nearest_idx = i

        # Add nearest stop to route
        nearest_stop = remaining.pop(nearest_idx)
        optimized.append(nearest_stop)
        current = nearest_stop

    optimized.append(dropoff)
    return optimized


def calculate_advanced_leg_distances(
    request: Request,
    method: str = "vincenty",
    apply_road_correction: bool = True,
    road_type: str = "urban",
    optimize_route: bool = False,
) -> List[Dict]:
    """
    Calculate advanced leg distances with optimization options.
    """
    if not request:
        return []

    stops = request.stops.all().order_by("sequence")

    if len(stops) < 2:
        return []

    # Get valid stops
    valid_stops = []
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

    # Optimize route if requested
    if optimize_route and len(valid_stops) > 2:
        valid_stops = calculate_route_optimization(valid_stops)

    legs = []

    # Calculate distance for each leg
    for i in range(len(valid_stops) - 1):
        current_stop = valid_stops[i]
        next_stop = valid_stops[i + 1]

        lat1, lon1 = current_stop["lat"], current_stop["lon"]
        lat2, lon2 = next_stop["lat"], next_stop["lon"]

        # Calculate base distance
        if method == "haversine":
            distance = haversine_distance(lat1, lon1, lat2, lon2)
        elif method == "vincenty":
            distance = vincenty_distance(lat1, lon1, lat2, lon2)
        else:
            distance = haversine_distance(lat1, lon1, lat2, lon2)

        # Apply corrections
        terrain_factor = calculate_terrain_factor(lat1, lon1, lat2, lon2)
        distance *= terrain_factor

        if apply_road_correction:
            distance = apply_road_factor(distance, road_type)

        legs.append(
            {
                "from_stop_id": current_stop["id"],
                "to_stop_id": next_stop["id"],
                "from_address": current_stop["address"],
                "to_address": next_stop["address"],
                "from_type": current_stop["type"],
                "to_type": next_stop["type"],
                "distance_km": round(distance, 2),
                "straight_line_km": round(
                    haversine_distance(lat1, lon1, lat2, lon2), 2
                ),
                "road_factor": apply_road_factor(1.0, road_type),
                "terrain_factor": terrain_factor,
                "sequence": i + 1,
            }
        )

    return legs


def get_advanced_route_summary(
    request: Request,
    method: str = "vincenty",
    apply_road_correction: bool = True,
    road_type: str = "urban",
    optimize_route: bool = False,
) -> Dict:
    """
    Get comprehensive route summary with advanced calculations.
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
            "method_used": method,
            "road_correction_applied": apply_road_correction,
            "route_optimized": optimize_route,
        }

    # Calculate total distance
    total_distance = calculate_advanced_distance(
        request, method, apply_road_correction, road_type
    )

    # Calculate leg distances
    legs = calculate_advanced_leg_distances(
        request, method, apply_road_correction, road_type, optimize_route
    )

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

    # Calculate straight-line distance for comparison
    straight_line_distance = 0.0
    valid_stops_list = []
    for stop in stops:
        if (
            stop.location
            and stop.location.latitude is not None
            and stop.location.longitude is not None
        ):
            valid_stops_list.append(
                {
                    "lat": float(stop.location.latitude),
                    "lon": float(stop.location.longitude),
                }
            )

    if len(valid_stops_list) >= 2:
        for i in range(len(valid_stops_list) - 1):
            straight_line_distance += haversine_distance(
                valid_stops_list[i]["lat"],
                valid_stops_list[i]["lon"],
                valid_stops_list[i + 1]["lat"],
                valid_stops_list[i + 1]["lon"],
            )

    return {
        "total_distance_km": total_distance,
        "straight_line_distance_km": round(straight_line_distance, 2),
        "road_correction_factor": apply_road_factor(1.0, road_type),
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
        "method_used": method,
        "road_correction_applied": apply_road_correction,
        "route_optimized": optimize_route,
    }
