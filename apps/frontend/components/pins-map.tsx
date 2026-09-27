"use client";

import { useEffect, useRef, useState } from "react";

import {
  GOOGLE_MAPS_API_KEY,
  type GMap,
  type GMarker,
  type GoogleMaps,
  loadGoogleMaps,
  type Place,
  reverseGeocode,
} from "@tsumi/ui/lib/maps";

import type { DraftStop } from "@/lib/errand-draft";

/**
 * Every pinned stop on one map, numbered in route order. Drag a pin to the
 * exact gate or shop; the address under it is looked up when the drag ends.
 * Shows nothing until a stop is pinned, and nothing at all without a Maps key.
 */
export function PinsMap({ stops, onMove }: { stops: DraftStop[]; onMove: (index: number, place: Place) => void }) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<GMap | null>(null);
  const markers = useRef(new Map<string, GMarker>()); // keyed by stop id, so reordering keeps each pin
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const stopsRef = useRef(stops);
  stopsRef.current = stops;
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  // A drag already put the pin where the customer wants it; don't re-frame the map.
  const skipFit = useRef(false);

  const pinned = stops.flatMap((s, i) => (s.place?.coords ? [{ id: s.id, label: String(i + 1), at: s.place.coords }] : []));
  const key = pinned.map((p) => `${p.id}:${p.label}:${p.at.lat},${p.at.lng}`).join("|");

  useEffect(() => {
    if (key) loadGoogleMaps().then(setMaps, () => undefined);
    else {
      // The map element unmounts with no pins; start fresh next time.
      map.current = null;
      markers.current.clear();
    }
  }, [key]);

  useEffect(() => {
    if (!maps || !el.current || !key) return;
    let cancelled = false;
    const points = pinned;
    (async () => {
      const [{ Map: GoogleMap }, { Marker }] = await Promise.all([maps.importLibrary("maps"), maps.importLibrary("marker")]);
      if (cancelled || !el.current) return;
      map.current ??= new GoogleMap(el.current, {
        center: points[0].at,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      });
      const live = new Set(points.map((p) => p.id));
      for (const [id, marker] of markers.current) {
        if (!live.has(id)) {
          marker.setMap(null);
          markers.current.delete(id);
        }
      }
      for (const p of points) {
        const existing = markers.current.get(p.id);
        if (existing) {
          existing.setPosition(p.at);
          existing.setLabel(p.label);
          continue;
        }
        const marker = new Marker({ map: map.current, position: p.at, draggable: true, label: p.label, title: `Stop ${p.label}: drag to adjust` });
        marker.addListener("dragend", async () => {
          const pos = marker.getPosition();
          if (!pos) return;
          const coords = { lat: pos.lat(), lng: pos.lng() };
          skipFit.current = true;
          const address = await reverseGeocode(maps, coords);
          const index = stopsRef.current.findIndex((s) => s.id === p.id);
          if (index >= 0) {
            onMoveRef.current(index, { address: address ?? `Pinned location (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`, coords });
          }
        });
        markers.current.set(p.id, marker);
      }
      if (skipFit.current) {
        skipFit.current = false;
        return;
      }
      if (points.length > 1) {
        map.current.fitBounds(
          {
            north: Math.max(...points.map((p) => p.at.lat)),
            south: Math.min(...points.map((p) => p.at.lat)),
            east: Math.max(...points.map((p) => p.at.lng)),
            west: Math.min(...points.map((p) => p.at.lng)),
          },
          56
        );
      } else {
        map.current.panTo(points[0].at);
        map.current.setZoom(16);
      }
    })().catch(() => undefined); // The typed addresses still post without the map.
    return () => {
      cancelled = true;
    };
    // `key` captures every pin's id, number and position, so `pinned` from the same render is current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps, key]);

  if (!key || !GOOGLE_MAPS_API_KEY) return null;
  return (
    <div>
      <div ref={el} className="h-56 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Drag a pin to the exact spot. The address updates to match.</p>
    </div>
  );
}
