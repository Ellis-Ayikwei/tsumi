"use client";

import { useEffect, useRef, useState } from "react";

import {
  GOOGLE_MAPS_API_KEY,
  type GMap,
  type GMarker,
  type GoogleMaps,
  type LatLng,
  loadGoogleMaps,
  type Place,
  reverseGeocode,
} from "@tsumi/ui/lib/maps";

type Stop = "pickup" | "dropoff";

/**
 * Pickup (A) and drop-off (B) on one map. Drag a pin to the exact gate or
 * shop; the address under it is looked up when the drag ends. Shows nothing
 * until a stop is pinned, and nothing at all without a Maps key.
 */
export function PinsMap({
  pickup,
  dropoff,
  onMove,
}: {
  pickup: Place | null;
  dropoff: Place | null;
  onMove: (stop: Stop, place: Place) => void;
}) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<GMap | null>(null);
  const markers = useRef<Partial<Record<Stop, GMarker>>>({});
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  // A drag already put the pin where the customer wants it; don't re-frame the map.
  const skipFit = useRef(false);

  const points: Partial<Record<Stop, LatLng>> = {};
  if (pickup?.coords) points.pickup = pickup.coords;
  if (dropoff?.coords) points.dropoff = dropoff.coords;
  const key = JSON.stringify(points);
  const pinned = Object.keys(points).length > 0;

  useEffect(() => {
    if (pinned) loadGoogleMaps().then(setMaps, () => undefined);
    else {
      // The map element unmounts with no pins; start fresh next time.
      map.current = null;
      markers.current = {};
    }
  }, [pinned]);

  // Keep one map and at most two markers in step with the stops.
  useEffect(() => {
    if (!maps || !el.current) return;
    let cancelled = false;
    (async () => {
      const [{ Map }, { Marker }] = await Promise.all([maps.importLibrary("maps"), maps.importLibrary("marker")]);
      if (cancelled || !el.current) return;
      const current: Partial<Record<Stop, LatLng>> = JSON.parse(key);
      const first = current.pickup ?? current.dropoff;
      if (!first) return;
      map.current ??= new Map(el.current, {
        center: first,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      });
      for (const stop of ["pickup", "dropoff"] as const) {
        const at = current[stop];
        const existing = markers.current[stop];
        if (!at) {
          existing?.setMap(null);
          delete markers.current[stop];
        } else if (existing) {
          existing.setPosition(at);
        } else {
          const marker = new Marker({
            map: map.current,
            position: at,
            draggable: true,
            label: stop === "pickup" ? "A" : "B",
            title: stop === "pickup" ? "Pickup: drag to adjust" : "Drop-off: drag to adjust",
          });
          marker.addListener("dragend", async () => {
            const p = marker.getPosition();
            if (!p) return;
            const coords = { lat: p.lat(), lng: p.lng() };
            skipFit.current = true;
            const address = await reverseGeocode(maps, coords);
            onMoveRef.current(stop, { address: address ?? `Pinned location (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`, coords });
          });
          markers.current[stop] = marker;
        }
      }
      if (skipFit.current) {
        skipFit.current = false;
        return;
      }
      const both = current.pickup && current.dropoff ? [current.pickup, current.dropoff] : null;
      if (both) {
        map.current.fitBounds(
          {
            north: Math.max(both[0].lat, both[1].lat),
            south: Math.min(both[0].lat, both[1].lat),
            east: Math.max(both[0].lng, both[1].lng),
            west: Math.min(both[0].lng, both[1].lng),
          },
          56
        );
      } else {
        map.current.panTo(first);
        map.current.setZoom(16);
      }
    })().catch(() => undefined); // The typed addresses still post without the map.
    return () => {
      cancelled = true;
    };
  }, [maps, key]);

  if (!pinned || !GOOGLE_MAPS_API_KEY) return null;
  return (
    <div>
      <div ref={el} className="h-56 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Drag a pin to the exact spot. The address updates to match.</p>
    </div>
  );
}
