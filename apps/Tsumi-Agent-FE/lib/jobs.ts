import type { LatLng } from "@tsumi/ui/lib/maps";
import type { RouteStop } from "@tsumi/ui/lib/stops";

export const ACTIVE_STATUSES = "accepted,in_progress,delivered,disputed";
export const PAST_STATUSES = "completed,cancelled,refunded";

/**
 * Directions link that opens the phone's maps app: turn-by-turn to the exact
 * pin when the customer dropped one, otherwise a search for the typed address.
 */
export function mapsUrl(address: string, coords: LatLng | null) {
  return coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Ghana`)}`;
}

/** Google Maps directions through every stop in order, starting from the runner. */
export function routeUrl(stops: RouteStop[]) {
  const point = (s: RouteStop) => (s.coords ? `${s.coords.lat},${s.coords.lng}` : `${s.address}, Ghana`);
  const params = new URLSearchParams({ api: "1", destination: point(stops[stops.length - 1]) });
  if (stops.length > 1) params.set("waypoints", stops.slice(0, -1).map(point).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}
