"use client";

import { useEffect, useRef, useState } from "react";

import { GOOGLE_MAPS_API_KEY, loadGoogleMaps } from "../lib/maps";
import type { RouteStop } from "../lib/stops";

/**
 * Every pinned stop on a small map, numbered in route order. Renders nothing
 * when no stop is pinned, no Maps key is set or Google is unreachable: the
 * addresses printed next to it stay the source of truth.
 */
export function RouteMap({ stops }: { stops: RouteStop[] }) {
  const el = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const pins = stops.flatMap((s, i) => (s.coords ? [{ label: String(i + 1), at: s.coords, kind: s.kind }] : []));
  const key = pins.map((p) => `${p.label}:${p.at.lat},${p.at.lng}`).join("|");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    const points = pins;
    (async () => {
      const maps = await loadGoogleMaps();
      const [{ Map }, { Marker }] = await Promise.all([maps.importLibrary("maps"), maps.importLibrary("marker")]);
      if (cancelled || !el.current) return;
      const map = new Map(el.current, {
        center: points[0].at,
        zoom: 15,
        disableDefaultUI: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
      });
      for (const p of points) {
        new Marker({ map, position: p.at, label: p.label, title: `Stop ${p.label}: ${p.kind === "pickup" ? "pickup" : "drop-off"}` });
      }
      if (points.length > 1) {
        map.fitBounds(
          {
            north: Math.max(...points.map((p) => p.at.lat)),
            south: Math.min(...points.map((p) => p.at.lat)),
            east: Math.max(...points.map((p) => p.at.lng)),
            west: Math.min(...points.map((p) => p.at.lng)),
          },
          48
        );
      }
    })().catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
    // `key` captures every pinned coordinate, so `pins` from the same render is current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!key || failed || !GOOGLE_MAPS_API_KEY) return null;
  return <div ref={el} className="h-44 w-full overflow-hidden rounded-2xl border bg-muted" aria-label="Map of the errand stops" role="img" />;
}
