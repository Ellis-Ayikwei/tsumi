"use client";

import { useEffect, useRef, useState } from "react";

import { GOOGLE_MAPS_API_KEY, type LatLng, loadGoogleMaps } from "../lib/maps";

/**
 * Pickup (A) and drop-off (B) pins on a small map. Renders nothing when no stop
 * is pinned, no Maps key is set or Google is unreachable: the addresses printed
 * next to it stay the source of truth.
 */
export function RouteMap({ pickup, dropoff }: { pickup: LatLng | null; dropoff: LatLng | null }) {
  const el = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const stops = [pickup && { label: "A", at: pickup }, dropoff && { label: "B", at: dropoff }].filter(
    (s): s is { label: string; at: LatLng } => Boolean(s)
  );
  const key = stops.map((s) => `${s.label}${s.at.lat},${s.at.lng}`).join("|");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    (async () => {
      const maps = await loadGoogleMaps();
      const [{ Map }, { Marker }] = await Promise.all([maps.importLibrary("maps"), maps.importLibrary("marker")]);
      if (cancelled || !el.current) return;
      const map = new Map(el.current, {
        center: stops[0].at,
        zoom: 15,
        disableDefaultUI: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      });
      for (const s of stops) new Marker({ map, position: s.at, label: s.label, title: s.label === "A" ? "Pickup" : "Drop-off" });
      if (stops.length === 2) {
        const [a, b] = stops.map((s) => s.at);
        map.fitBounds(
          {
            north: Math.max(a.lat, b.lat),
            south: Math.min(a.lat, b.lat),
            east: Math.max(a.lng, b.lng),
            west: Math.min(a.lng, b.lng),
          },
          48
        );
      }
    })().catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
    // `key` captures every coordinate in `stops`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!key || failed || !GOOGLE_MAPS_API_KEY) return null;
  return <div ref={el} className="h-44 w-full overflow-hidden rounded-2xl border bg-muted" aria-label="Map of the errand stops" role="img" />;
}
