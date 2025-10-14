import os
import json
import hashlib
import requests
from typing import List, Dict, Optional, Tuple
from django.core.cache import cache
from django.conf import settings
from apps.Request.models import Request
from apps.JourneyStop.models import JourneyStop
from .calculate_estimated_distance_advanced import (
    calculate_advanced_distance,
    calculate_advanced_leg_distances,
    get_advanced_route_summary,
    haversine_distance,
)


class DistanceCalculator:
    """
    Hybrid distance calculator that uses Google API as primary with caching,
    and falls back to advanced in-house calculations.
    """

    def __init__(self, api_key: str = None, cache_timeout: int = 3600):
        """
        Initialize the distance calculator.

        Args:
            api_key: Google Maps API key (optional, uses environment variable)
            cache_timeout: Cache timeout in seconds (default: 1 hour)
        """
        self.api_key = api_key or os.getenv("GOOGLE_MAPS_API_KEY")
        self.cache_timeout = cache_timeout
        self.cache_prefix = "distance_calc_"

    def _generate_cache_key(self, request_id: str, method: str = "google") -> str:
        """Generate a unique cache key for the request."""
        return f"{self.cache_prefix}{method}_{request_id}"

    def _get_request_hash(self, request: Request) -> str:
        """
        Generate a hash of the request's location data for cache invalidation.
        This ensures cache is invalidated when stops change.
        """
        stops_data = []
        for stop in request.stops.all().order_by("sequence"):
            if stop.location and stop.location.latitude and stop.location.longitude:
                stops_data.append(
                    {
                        "lat": float(stop.location.latitude),
                        "lon": float(stop.location.longitude),
                        "sequence": stop.sequence,
                    }
                )

        # Create hash of the stops data
        stops_json = json.dumps(stops_data, sort_keys=True)
        return hashlib.md5(stops_json.encode()).hexdigest()

    def _get_cached_result(self, request: Request, method: str) -> Optional[Dict]:
        """Get cached result if available and valid."""
        cache_key = self._generate_cache_key(str(request.id), method)
        cached_data = cache.get(cache_key)

        if cached_data:
            # Check if the request hash matches (stops haven't changed)
            current_hash = self._get_request_hash(request)
            if cached_data.get("request_hash") == current_hash:
                return cached_data.get("result")

        return None

    def _cache_result(self, request: Request, method: str, result: Dict):
        """Cache the calculation result."""
        cache_key = self._generate_cache_key(str(request.id), method)
        cache_data = {
            "result": result,
            "request_hash": self._get_request_hash(request),
            "method": method,
        }
        cache.set(cache_key, cache_data, self.cache_timeout)

    def _call_google_distance_matrix(
        self,
        origins: List[Tuple[float, float]],
        destinations: List[Tuple[float, float]],
    ) -> Optional[Dict]:
        """Call Google Distance Matrix API."""
        if not self.api_key:
            return None

        # Format coordinates as strings
        origin_str = "|".join([f"{lat},{lng}" for lat, lng in origins])
        dest_str = "|".join([f"{lat},{lng}" for lat, lng in destinations])

        url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        params = {
            "origins": origin_str,
            "destinations": dest_str,
            "key": self.api_key,
            "units": "metric",
            "mode": "driving",
            "traffic_model": "best_guess",  # Use traffic data if available
            "departure_time": "now",  # Use current time for traffic
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Google API error: {e}")
            return None

    def calculate_distance_google(self, request: Request) -> Optional[float]:
        """Calculate distance using Google API with caching."""
        print(f"🔍 [calculate_distance_google] Request {request.id} - checking cache")
        # Check cache first
        cached_result = self._get_cached_result(request, "google")
        if cached_result and "total_distance_km" in cached_result:
            print(
                f"💾 [calculate_distance_google] Request {request.id} - using cached result: {cached_result['total_distance_km']} km"
            )
            return cached_result["total_distance_km"]

        print(
            f"🌐 [calculate_distance_google] Request {request.id} - no cache, calling Google API"
        )

        # Get stops with valid coordinates
        stops = request.stops.all().order_by("sequence")
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
        legs_data = []

        # Calculate distance between consecutive stops
        for i in range(len(valid_stops) - 1):
            origins = [valid_stops[i]]
            destinations = [valid_stops[i + 1]]

            matrix_data = self._call_google_distance_matrix(origins, destinations)

            if matrix_data and matrix_data.get("status") == "OK":
                elements = matrix_data.get("rows", [{}])[0].get("elements", [])
                if elements and elements[0].get("status") == "OK":
                    distance_text = elements[0].get("distance", {}).get("text", "0 km")
                    duration_text = (
                        elements[0].get("duration", {}).get("text", "0 mins")
                    )
                    distance_km = float(distance_text.split()[0])
                    total_distance += distance_km

                    legs_data.append(
                        {
                            "distance_km": round(distance_km, 2),
                            "duration_text": duration_text,
                            "sequence": i + 1,
                        }
                    )
                else:
                    print(f"Google API error for leg {i+1}")
                    return None
            else:
                print(
                    f"Google API error for leg {i+1}: {matrix_data.get('error_message', 'Unknown error')}"
                )
                return None

        # Cache the result
        result = {
            "total_distance_km": round(total_distance, 2),
            "legs": legs_data,
            "method_used": "google_api",
            "cached_at": str(cache.get("current_time", "unknown")),
        }
        self._cache_result(request, "google", result)

        return round(total_distance, 2)

    def calculate_distance_fallback(self, request: Request) -> Optional[float]:
        """Calculate distance using advanced in-house methods as fallback."""
        # Check cache first
        cached_result = self._get_cached_result(request, "fallback")
        if cached_result and "total_distance_km" in cached_result:
            return cached_result["total_distance_km"]

        # Use advanced in-house calculation
        distance = calculate_advanced_distance(
            request, method="vincenty", apply_road_correction=True, road_type="urban"
        )

        # Cache the result
        result = {
            "total_distance_km": distance,
            "method_used": "advanced_vincenty",
            "cached_at": str(cache.get("current_time", "unknown")),
        }
        self._cache_result(request, "fallback", result)

        return distance

    def calculate_distance_hybrid(
        self, request: Request, prefer_api: bool = True
    ) -> Optional[float]:
        """
        Calculate distance using hybrid approach: Google API first, fallback to advanced in-house.

        Args:
            request: Request instance
            prefer_api: Whether to prefer Google API over fallback methods

        Returns:
            Distance in kilometers
        """
        if not request:
            print("❌ [calculate_distance_hybrid] No request provided")
            return None

        print(
            f"🌐 [calculate_distance_hybrid] Request {request.id} - prefer_api: {prefer_api}, api_key_available: {bool(self.api_key)}"
        )

        # Try Google API first if preferred and available
        if prefer_api and self.api_key:
            try:
                print(
                    f"🚀 [calculate_distance_hybrid] Request {request.id} - attempting Google API calculation"
                )
                distance = self.calculate_distance_google(request)
                if distance is not None:
                    print(
                        f"✅ [calculate_distance_hybrid] Request {request.id} - Google API success: {distance} km"
                    )
                    return distance
                else:
                    print(
                        f"⚠️  [calculate_distance_hybrid] Request {request.id} - Google API returned None"
                    )
            except Exception as e:
                print(
                    f"❌ [calculate_distance_hybrid] Request {request.id} - Google API failed: {e}"
                )

        # Fallback to advanced in-house calculation
        print(
            f"🔄 [calculate_distance_hybrid] Request {request.id} - falling back to advanced calculation"
        )
        fallback_distance = self.calculate_distance_fallback(request)
        if fallback_distance is not None:
            print(
                f"✅ [calculate_distance_hybrid] Request {request.id} - fallback success: {fallback_distance} km"
            )
        else:
            print(
                f"❌ [calculate_distance_hybrid] Request {request.id} - fallback failed"
            )
        return fallback_distance

    def calculate_leg_distances_hybrid(
        self, request: Request, prefer_api: bool = True
    ) -> List[Dict]:
        """Calculate leg distances using hybrid approach."""
        if not request:
            return []

        # Try Google API first if preferred and available
        if prefer_api and self.api_key:
            try:
                return self._calculate_leg_distances_google(request)
            except Exception as e:
                print(f"Google API failed for leg distances: {e}")

        # Fallback to advanced in-house calculation
        return calculate_advanced_leg_distances(
            request,
            method="vincenty",
            apply_road_correction=True,
            road_type="urban",
            optimize_route=False,
        )

    def _calculate_leg_distances_google(self, request: Request) -> List[Dict]:
        """Calculate leg distances using Google API."""
        # Check cache first
        cached_result = self._get_cached_result(request, "google_legs")
        if cached_result and "legs" in cached_result:
            return cached_result["legs"]

        stops = request.stops.all().order_by("sequence")
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

        legs = []

        # Calculate distance for each leg using Google API
        for i in range(len(valid_stops) - 1):
            current_stop = valid_stops[i]
            next_stop = valid_stops[i + 1]

            origins = [(current_stop["lat"], current_stop["lon"])]
            destinations = [(next_stop["lat"], next_stop["lon"])]

            matrix_data = self._call_google_distance_matrix(origins, destinations)

            if matrix_data and matrix_data.get("status") == "OK":
                elements = matrix_data.get("rows", [{}])[0].get("elements", [])
                if elements and elements[0].get("status") == "OK":
                    distance_text = elements[0].get("distance", {}).get("text", "0 km")
                    duration_text = (
                        elements[0].get("duration", {}).get("text", "0 mins")
                    )
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
                            "method_used": "google_api",
                        }
                    )
                else:
                    print(f"Error in Google API distance calculation for leg {i+1}")
                    return []
            else:
                print(
                    f"Google API error for leg {i+1}: {matrix_data.get('error_message', 'Unknown error')}"
                )
                return []

        # Cache the result
        result = {
            "legs": legs,
            "method_used": "google_api",
            "cached_at": str(cache.get("current_time", "unknown")),
        }
        self._cache_result(request, "google_legs", result)

        return legs

    def get_route_summary_hybrid(
        self, request: Request, prefer_api: bool = True
    ) -> Dict:
        """Get comprehensive route summary using hybrid approach."""
        if not request:
            return {}

        # Try Google API first if preferred and available
        if prefer_api and self.api_key:
            try:
                return self._get_route_summary_google(request)
            except Exception as e:
                print(f"Google API failed for route summary: {e}")

        # Fallback to advanced in-house calculation
        return get_advanced_route_summary(
            request,
            method="vincenty",
            apply_road_correction=True,
            road_type="urban",
            optimize_route=False,
        )

    def _get_route_summary_google(self, request: Request) -> Dict:
        """Get route summary using Google API."""
        # Check cache first
        cached_result = self._get_cached_result(request, "google_summary")
        if cached_result:
            return cached_result

        stops = request.stops.all().order_by("sequence")

        if len(stops) < 2:
            return {
                "total_distance_km": 0,
                "total_stops": len(stops),
                "valid_stops": 0,
                "legs": [],
                "has_valid_coordinates": False,
                "method_used": "google_api",
            }

        # Calculate total distance using Google API
        total_distance = self.calculate_distance_google(request)

        # Calculate leg distances using Google API
        legs = self._calculate_leg_distances_google(request)

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

        result = {
            "total_distance_km": total_distance,
            "straight_line_distance_km": round(straight_line_distance, 2),
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
            "method_used": "google_api",
            "cached_at": str(cache.get("current_time", "unknown")),
        }

        # Cache the result
        self._cache_result(request, "google_summary", result)

        return result

    def clear_cache(self, request: Request = None):
        """Clear cache for a specific request or all distance calculations."""
        if request:
            # Clear cache for specific request
            cache_keys = [
                self._generate_cache_key(str(request.id), "google"),
                self._generate_cache_key(str(request.id), "fallback"),
                self._generate_cache_key(str(request.id), "google_legs"),
                self._generate_cache_key(str(request.id), "google_summary"),
            ]
            for key in cache_keys:
                cache.delete(key)
        else:
            # Clear all distance calculation cache
            # Note: This is a simplified approach. In production, you might want
            # to use cache versioning or a more sophisticated cache key management
            pass


# Convenience functions for easy usage
def calculate_distance_hybrid(
    request: Request, prefer_api: bool = True
) -> Optional[float]:
    """Calculate distance using hybrid approach."""
    calculator = DistanceCalculator()
    return calculator.calculate_distance_hybrid(request, prefer_api)


def calculate_leg_distances_hybrid(
    request: Request, prefer_api: bool = True
) -> List[Dict]:
    """Calculate leg distances using hybrid approach."""
    calculator = DistanceCalculator()
    return calculator.calculate_leg_distances_hybrid(request, prefer_api)


def get_route_summary_hybrid(request: Request, prefer_api: bool = True) -> Dict:
    """Get route summary using hybrid approach."""
    calculator = DistanceCalculator()
    return calculator.get_route_summary_hybrid(request, prefer_api)


def clear_distance_cache(request: Request = None):
    """Clear distance calculation cache."""
    calculator = DistanceCalculator()
    calculator.clear_cache(request)
