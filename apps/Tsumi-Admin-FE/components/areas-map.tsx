"use client";

import { useEffect, useRef, useState } from "react";

import {
  GOOGLE_MAPS_API_KEY,
  type GFeature,
  type GMap,
  type GoogleMaps,
  type LatLng,
  loadGoogleMaps,
} from "@tsumi/ui/lib/maps";

import type { ServiceArea, ServiceAreaStatus } from "@/lib/types";

const GHANA = { lat: 7.95, lng: -1.03 };

// Same meaning everywhere on the page: green serves, red refuses, grey is ignored.
export const STATUS_COLOR: Record<ServiceAreaStatus, string> = {
  active: "#16a34a",
  no_service: "#dc2626",
  inactive: "#9ca3af",
};

/**
 * Every area on one map, coloured by status. Clicking anywhere (inside an
 * area or not) reports the point, so the page can test coverage there and
 * offer to start a new area at that spot.
 */
export function AreasMap({ areas, onPick }: { areas: ServiceArea[]; onPick: (point: LatLng) => void }) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<GMap | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const framed = useRef(false);

  useEffect(() => {
    loadGoogleMaps().then(setMaps, () => setFailed(true));
  }, []);

  useEffect(() => {
    if (!maps || !el.current || map.current) return;
    let cancelled = false;
    maps
      .importLibrary("maps")
      .then(({ Map }) => {
        if (cancelled || !el.current) return;
        const m = new Map(el.current, { center: GHANA, zoom: 7, streetViewControl: false, mapTypeControl: false, clickableIcons: false });
        m.data.setStyle((f: GFeature) => {
          const color = STATUS_COLOR[(f.getProperty("status") as ServiceAreaStatus) ?? "inactive"];
          return { fillColor: color, strokeColor: color, fillOpacity: 0.18, strokeWeight: 2, cursor: "crosshair" };
        });
        const pick = (e: { latLng?: { lat(): number; lng(): number } | null }) => {
          if (e.latLng) onPickRef.current({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        };
        m.addListener("click", pick);
        m.data.addListener("click", pick); // clicks on a drawn area land on the data layer
        map.current = m;
        setReady(true);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [maps]);

  // Redraw every area whenever the list changes. Frame them once, so editing
  // a status doesn't move the map out from under the admin.
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    m.data.forEach((f) => m.data.remove(f));
    let west = 180, south = 90, east = -180, north = -90;
    for (const a of areas) {
      if (!a.geometry) continue;
      m.data.addGeoJson({ type: "Feature", geometry: a.geometry, properties: { id: a.id, status: a.status } });
      for (const polygon of a.geometry.coordinates)
        for (const ring of polygon)
          for (const [lng, lat] of ring) {
            west = Math.min(west, lng);
            east = Math.max(east, lng);
            south = Math.min(south, lat);
            north = Math.max(north, lat);
          }
    }
    if (west <= east && !framed.current) {
      m.fitBounds({ west, south, east, north }, 24);
      framed.current = true;
    }
  }, [areas, ready]);

  if (!GOOGLE_MAPS_API_KEY || failed) {
    return (
      <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to see and click areas on a map. Everything below still works without it.
      </p>
    );
  }
  return <div ref={el} className="h-[420px] w-full overflow-hidden rounded-lg border bg-muted" aria-label="Service areas map" role="application" />;
}
