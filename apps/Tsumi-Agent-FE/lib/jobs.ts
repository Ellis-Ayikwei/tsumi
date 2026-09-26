export const ACTIVE_STATUSES = "accepted,in_progress,delivered,disputed";
export const PAST_STATUSES = "completed,cancelled,refunded";

/** Directions link for a free-text address. Opens the phone's maps app. */
export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Ghana`)}`;
}
