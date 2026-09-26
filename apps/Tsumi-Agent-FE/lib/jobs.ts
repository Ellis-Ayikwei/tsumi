import type { LatLng } from "@tsumi/ui/lib/maps";

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
