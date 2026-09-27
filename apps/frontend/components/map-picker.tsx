"use client";

import { Crosshair, Loader2, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  ACCRA,
  GOOGLE_MAPS_API_KEY,
  type GMap,
  type GoogleMaps,
  type LatLng,
  loadGoogleMaps,
  type Place,
  reverseGeocode,
} from "@tsumi/ui/lib/maps";

/** Within about a metre: the map settled where we already know the address. */
const samePoint = (a: LatLng, b: LatLng) => Math.abs(a.lat - b.lat) < 1e-5 && Math.abs(a.lng - b.lng) < 1e-5;

/**
 * Choose a spot on a map, as in ride apps: the pin stays in the middle and the
 * map moves under it. The address under the pin is looked up when the map
 * stops moving, and Confirm hands back that address with its coordinates.
 */
export function MapPicker({
  title,
  initial,
  onPick,
  onClose,
}: {
  title: string;
  initial: Place | null;
  onPick: (place: Place) => void;
  onClose: () => void;
}) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<GMap | null>(null);
  const pickedRef = useRef<Place | null>(initial?.coords ? initial : null);
  const [picked, setPicked] = useState<Place | null>(pickedRef.current);
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  const [failed, setFailed] = useState(!GOOGLE_MAPS_API_KEY);
  const [moving, setMoving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  pickedRef.current = picked;

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("MapPicker: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set, so the map can't load.");
      return;
    }
    loadGoogleMaps().then(setMaps, () => setFailed(true));
  }, []);

  // Escape closes, like any dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const goTo = (coords: LatLng) => {
    map.current?.panTo(coords);
    map.current?.setZoom(17);
  };

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setError("This browser can't share your location. Move the map instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        goTo({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setLocating(false);
        setError("Location is off. Allow location for this site, or move the map to the spot.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  useEffect(() => {
    if (!maps || !el.current) return;
    let cancelled = false;
    const listeners: { remove(): void }[] = [];
    maps
      .importLibrary("maps")
      .then(async ({ Map }) => {
        if (cancelled || !el.current) return;
        const start = pickedRef.current?.coords;
        const m = new Map(el.current, {
          center: start ?? ACCRA,
          zoom: start ? 17 : 13,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
        });
        map.current = m;
        let seq = 0;
        listeners.push(m.addListener("dragstart", () => setMoving(true)));
        listeners.push(
          m.addListener("idle", () => {
            setMoving(false);
            const c = m.getCenter();
            if (!c) return;
            const coords = { lat: c.lat(), lng: c.lng() };
            const current = pickedRef.current;
            if (current?.coords && samePoint(current.coords, coords)) return;
            if (!current && samePoint(coords, ACCRA)) return; // the default view is not a choice
            const mine = ++seq;
            setResolving(true);
            setPicked({ address: `Pinned location (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`, coords });
            reverseGeocode(maps, coords).then((address) => {
              if (mine !== seq) return;
              if (address) setPicked({ address, coords });
              setResolving(false);
            });
          })
        );
        // Location already allowed: start where the customer is. Never prompts here.
        if (!start && navigator.permissions) {
          const state = await navigator.permissions
            .query({ name: "geolocation" })
            .then((s) => s.state, () => "unknown");
          if (state === "granted" && !cancelled) {
            navigator.geolocation.getCurrentPosition(({ coords }) => !cancelled && goTo({ lat: coords.latitude, lng: coords.longitude }), () => undefined, {
              timeout: 10_000,
              maximumAge: 60_000,
            });
          }
        }
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      listeners.forEach((l) => l.remove());
      map.current = null;
    };
  }, [maps]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white sm:h-[80vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close map" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {failed ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            The map isn&apos;t available right now. Close this and type the address instead.
          </div>
        ) : (
          <div className="relative flex-1 bg-gray-100 dark:bg-gray-800">
            <div ref={el} className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className={`-mt-10 flex flex-col items-center transition-transform ${moving ? "-translate-y-2" : ""}`}>
                <MapPin className="h-10 w-10 fill-gray-900 text-white drop-shadow-lg dark:fill-white dark:text-gray-900" />
                <span className="h-1.5 w-3 rounded-full bg-black/30" />
              </div>
            </div>
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              aria-label="Go to my location"
              className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg dark:bg-gray-900 dark:text-white"
            >
              {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
            </button>
          </div>
        )}

        <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-800">
          <p className="flex min-h-11 items-center gap-2 text-sm" aria-live="polite">
            {resolving && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-500" aria-hidden />}
            <span className={picked ? "" : "text-gray-500 dark:text-gray-400"}>{picked?.address ?? "Move the map to put the pin on the spot."}</span>
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={!picked || moving || resolving}
            onClick={() => picked && onPick(picked)}
            className="h-12 w-full rounded-xl bg-gray-900 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-gray-900"
          >
            Confirm this spot
          </button>
        </div>
      </div>
    </div>
  );
}
