import requests
import os
from typing import List, Dict, Optional, Tuple
from apps.Request.models import Request
from apps.JourneyStop.models import JourneyStop


def get_google_distance_matrix(
    origins: List[Tuple[float, float]],
    destinations: List[Tuple[float, float]],
    api_key: str = None,
) -> Dict:
    """
    Get distance matrix from Google Maps API.

    Args:
        origins: List of (lat, lng) tuples for origin points
        destinations: List of (lat, lng) tuples for destination points
        api_key: Google Maps API key (optional, can use environment variable)

    Returns:
        Dictionary with distance matrix data
    """
    if not api_key:
        api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if not api_key:
        raise ValueError("Google Maps API key is required")

    # Format coordinates as strings
    origin_str = "|".join([f"{lat},{lng}" for lat, lng in origins])
    dest_str = "|".join([f"{lat},{lng}" for lat, lng in destinations])

    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin_str,
        "destinations": dest_str,
        "key": api_key,
        "units": "metric",  # Use metric units (km)
        "mode": "driving",  # Can be 'driving', 'walking', 'bicycling', 'transit'
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error calling Google Maps API: {e}")
        return None


def calculate_distance_with_api(
    request: Request, api_key: str = None
) -> Optional[float]:
    """
    Calculate total distance using Google Maps API.

    Args:
        request: Request instance with journey stops
        api_key: Google Maps API key (optional)

    Returns:
        Total distance in kilometers, or None if API call fails
    """
    if not request:
        return None

    # Get all journey stops ordered by sequence
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
                (float(stop.location.latitude), float(stop.location.longitude))
            )

    if len(valid_stops) < 2:
        return None

    total_distance = 0.0

    # Calculate distance between consecutive stops
    for i in range(len(valid_stops) - 1):
        origins = [valid_stops[i]]
        destinations = [valid_stops[i + 1]]

        matrix_data = get_google_distance_matrix(origins, destinations, api_key)

        if matrix_data and matrix_data.get("status") == "OK":
            elements = matrix_data.get("rows", [{}])[0].get("elements", [])
            if elements and elements[0].get("status") == "OK":
                distance_text = elements[0].get("distance", {}).get("text", "0 km")
                # Extract numeric value from "15.2 km" format
                distance_km = float(distance_text.split()[0])
                total_distance += distance_km
            else:
                print(f"Error in distance calculation for leg {i+1}")
                return None
        else:
            print(
                f"API error for leg {i+1}: {matrix_data.get('error_message', 'Unknown error')}"
            )
            return None

    return round(total_distance, 2)


def calculate_leg_distances_with_api(
    request: Request, api_key: str = None
) -> List[Dict]:
    """
    Calculate distances for each leg using Google Maps API.

    Args:
        request: Request instance with journey stops
        api_key: Google Maps API key (optional)

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

    # Calculate distance for each leg using API
    for i in range(len(valid_stops) - 1):
        current_stop = valid_stops[i]
        next_stop = valid_stops[i + 1]

        origins = [(current_stop["lat"], current_stop["lon"])]
        destinations = [(next_stop["lat"], next_stop["lon"])]

        matrix_data = get_google_distance_matrix(origins, destinations, api_key)

        if matrix_data and matrix_data.get("status") == "OK":
            elements = matrix_data.get("rows", [{}])[0].get("elements", [])
            if elements and elements[0].get("status") == "OK":
                distance_text = elements[0].get("distance", {}).get("text", "0 km")
                duration_text = elements[0].get("duration", {}).get("text", "0 mins")
                distance_km = float(distance_text.split()[0])

                legs.append(
                    {
                        "from_stop_id": current_stop["id"],
                        "to_stop_id": next_stop["id"],
                        "from_address": current_stop["address"],
                        "to_address": next_stop["address"],
                        "from_type": current_stop["type"],
                        "to_type": next_stop["type"],
                        "distance_km": round(distance_km, 2),
                        "duration_text": duration_text,
                        "sequence": i + 1,
                    }
                )
            else:
                print(f"Error in distance calculation for leg {i+1}")
                return []
        else:
            print(
                f"API error for leg {i+1}: {matrix_data.get('error_message', 'Unknown error')}"
            )
            return []

    return legs


def get_route_summary_with_api(request: Request, api_key: str = None) -> Dict:
    """
    Get comprehensive route summary using Google Maps API.

    Args:
        request: Request instance with journey stops
        api_key: Google Maps API key (optional)

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
            "api_used": "google_maps",
        }

    # Calculate total distance using API
    total_distance = calculate_distance_with_api(request, api_key)

    # Calculate leg distances using API
    legs = calculate_leg_distances_with_api(request, api_key)

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
        "api_used": "google_maps",
    }


# Alternative: Mapbox API implementation
def get_mapbox_distance_matrix(
    origins: List[Tuple[float, float]],
    destinations: List[Tuple[float, float]],
    access_token: str = None,
) -> Dict:
    """
    Get distance matrix from Mapbox API.

    Args:
        origins: List of (lng, lat) tuples for origin points (note: Mapbox uses lng,lat order)
        destinations: List of (lng, lat) tuples for destination points
        access_token: Mapbox access token (optional, can use environment variable)

    Returns:
        Dictionary with distance matrix data
    """
    if not access_token:
        access_token = os.getenv("MAPBOX_ACCESS_TOKEN")

    if not access_token:
        raise ValueError("Mapbox access token is required")

    # Format coordinates as strings (Mapbox uses lng,lat format)
    origin_str = ";".join([f"{lng},{lat}" for lat, lng in origins])
    dest_str = ";".join([f"{lng},{lat}" for lat, lng in destinations])

    url = f"https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{origin_str};{dest_str}"
    params = {
        "access_token": access_token,
        "sources": "0",  # Use first point as source
        "destinations": "1",  # Use second point as destination
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error calling Mapbox API: {e}")
        return None
