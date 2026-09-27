import { type LatLng, parseCoords } from "./maps";
import type { Errand, StopKind } from "./types";

export interface RouteStop {
  position: number;
  kind: StopKind;
  address: string;
  coords: LatLng | null;
  note: string;
}

/**
 * An errand's stops in order. Errands posted before stops existed have none
 * stored; their pickup and drop-off stand in, so every screen reads one list.
 */
export function errandStops(errand: Errand): RouteStop[] {
  if (errand.stops?.length) {
    return errand.stops.map((s) => ({ position: s.position, kind: s.kind, address: s.address, coords: parseCoords(s.lat, s.lng), note: s.note }));
  }
  const stops: RouteStop[] = [];
  if (errand.pickup_address) {
    stops.push({ position: 0, kind: "pickup", address: errand.pickup_address, coords: parseCoords(errand.pickup_lat, errand.pickup_lng), note: "" });
  }
  if (errand.dropoff_address) {
    stops.push({ position: stops.length, kind: "dropoff", address: errand.dropoff_address, coords: parseCoords(errand.dropoff_lat, errand.dropoff_lng), note: "" });
  }
  return stops;
}
