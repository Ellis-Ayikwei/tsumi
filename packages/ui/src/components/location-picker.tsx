"use client";

import { Clock, Crosshair, Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  ACCRA,
  GOOGLE_MAPS_API_KEY,
  type GMap,
  type GoogleMaps,
  type LatLng,
  loadGoogleMaps,
  type Place,
  type PlacePrediction,
} from "../lib/maps";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./drawer";
import { Input } from "./input";

const RECENTS_KEY = "tsumi_recent_places";
const MAX_RECENTS = 5;

function readRecents(): Place[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Place[]).filter((p) => typeof p?.address === "string") : [];
  } catch {
    return [];
  }
}

/** Within about a metre: the map settled on a point we already have an address for. */
const samePoint = (a: LatLng, b: LatLng) => Math.abs(a.lat - b.lat) < 1e-5 && Math.abs(a.lng - b.lng) < 1e-5;

const pinnedLabel = ({ lat, lng }: LatLng) => `Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;

interface Suggestion {
  id: string;
  main: string;
  secondary: string;
  prediction: PlacePrediction;
}

/**
 * Uber-style place picker in a bottom sheet: the pin stays in the middle and
 * the map moves under it; search, current location and recent places all move
 * the map, and the address under the pin is what gets confirmed.
 *
 * Without a Maps key (or when Google is unreachable) it degrades to a typed
 * address plus "Use current location", so posting an errand never depends on
 * Google being up.
 */
export function LocationPicker({
  open,
  onOpenChange,
  title,
  confirmLabel,
  value,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmLabel: string;
  value: Place | null;
  onPick: (place: Place) => void;
}) {
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  const [mapsFailed, setMapsFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recents, setRecents] = useState<Place[]>([]);
  const [picked, setPicked] = useState<Place | null>(null);
  const [resolving, setResolving] = useState(false);
  const [moving, setMoving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapEl = useRef<HTMLDivElement | null>(null);
  const map = useRef<GMap | null>(null);
  const pickedRef = useRef<Place | null>(null);
  const sessionToken = useRef<object | null>(null);
  const searchSeq = useRef(0);
  pickedRef.current = picked;

  useEffect(() => {
    if (!open) return;
    setQuery(value?.coords ? "" : (value?.address ?? ""));
    setPicked(value);
    setSuggestions([]);
    setError(null);
    setRecents(readRecents());
    loadGoogleMaps().then(setMaps, () => setMapsFailed(true));
    // Reset only when the sheet opens: callers build `value` inline on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // One map per opening of the sheet; the element is unmounted when it closes.
  useEffect(() => {
    if (!open || !maps) return;
    let cancelled = false;
    const listeners: { remove(): void }[] = [];
    (async () => {
      const [{ Map }, { Geocoder }] = await Promise.all([maps.importLibrary("maps"), maps.importLibrary("geocoding")]);
      if (cancelled || !mapEl.current) return;
      const start = pickedRef.current?.coords;
      const instance = new Map(mapEl.current, {
        center: start ?? ACCRA,
        zoom: start ? 17 : 13,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        clickableIcons: false,
      });
      map.current = instance;
      const geocoder = new Geocoder();
      let seq = 0;
      listeners.push(instance.addListener("dragstart", () => setMoving(true)));
      listeners.push(
        instance.addListener("idle", () => {
          setMoving(false);
          const center = instance.getCenter();
          if (!center) return;
          const coords = { lat: center.lat(), lng: center.lng() };
          // The default Accra view is not a choice the customer made.
          if (!pickedRef.current && samePoint(coords, ACCRA)) return;
          // Search results and the initial value already carry an address; only
          // a map the customer moved needs reverse geocoding (billed per call).
          const current = pickedRef.current;
          if (current?.coords && samePoint(current.coords, coords)) return;
          const mine = ++seq;
          setResolving(true);
          setPicked({ address: pinnedLabel(coords), coords });
          geocoder
            .geocode({ location: coords })
            .then(({ results }) => {
              if (mine === seq && results[0]) setPicked({ address: results[0].formatted_address, coords });
            })
            .catch(() => undefined) // Keep the pinned-coordinates label; the pin itself is what matters.
            .finally(() => mine === seq && setResolving(false));
        })
      );
      // Location already allowed: open on the customer, as ride apps do. Never prompts here.
      if (!start && navigator.permissions && "geolocation" in navigator) {
        const state = await navigator.permissions
          .query({ name: "geolocation" })
          .then((status) => status.state, () => "unknown");
        if (state === "granted" && !cancelled) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              if (cancelled) return;
              instance.panTo({ lat: coords.latitude, lng: coords.longitude });
              instance.setZoom(17);
            },
            () => undefined, // Stay on Accra; search and drag still work.
            { timeout: 10_000, maximumAge: 60_000 }
          );
        }
      }
    })().catch(() => setMapsFailed(true));
    return () => {
      cancelled = true;
      listeners.forEach((l) => l.remove());
      map.current = null;
    };
  }, [open, maps]);

  // Places (New) autocomplete, limited to Ghana and biased to the map area.
  useEffect(() => {
    const input = query.trim();
    if (!maps || input.length < 2) {
      setSuggestions([]);
      return;
    }
    const mine = ++searchSeq.current;
    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = await maps.importLibrary("places");
        sessionToken.current ??= new AutocompleteSessionToken();
        const center = map.current?.getCenter();
        const { suggestions: found } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionToken.current,
          includedRegionCodes: ["gh"],
          ...(center && { locationBias: { center: { lat: center.lat(), lng: center.lng() }, radius: 30000 } }),
        });
        if (mine !== searchSeq.current) return;
        setSuggestions(
          found.flatMap(({ placePrediction: p }, i) =>
            p
              ? [{ id: `${i}-${p.text.text}`, main: p.mainText?.text ?? p.text.text, secondary: p.secondaryText?.text ?? "", prediction: p }]
              : []
          )
        );
      } catch {
        if (mine === searchSeq.current) setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, maps]);

  const moveTo = (place: Place) => {
    setPicked(place);
    setQuery("");
    setSuggestions([]);
    setError(null);
    if (place.coords && map.current) {
      map.current.panTo(place.coords);
      map.current.setZoom(17);
    }
  };

  const choose = async (s: Suggestion) => {
    setResolving(true);
    try {
      const { place } = await s.prediction.toPlace().fetchFields({ fields: ["location", "formattedAddress"] });
      sessionToken.current = null; // A session ends when a place is fetched.
      const coords = place.location ? { lat: place.location.lat(), lng: place.location.lng() } : null;
      moveTo({ address: s.secondary ? `${s.main}, ${s.secondary}` : s.main, coords });
    } catch {
      setError("Could not open that place. Pick another result or move the pin.");
    } finally {
      setResolving(false);
    }
  };

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("This browser can't share your location. Search for the place instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocating(false);
        const coords = { lat: latitude, lng: longitude };
        if (map.current) {
          // The idle handler reverse-geocodes once the map settles here.
          map.current.panTo(coords);
          map.current.setZoom(17);
        } else {
          setPicked({ address: query.trim() || "My current location", coords });
        }
      },
      () => {
        setLocating(false);
        setError("Location is off. Allow location access for this site, or search for the place.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  const typedOnly = !maps;
  const result: Place | null = typedOnly
    ? query.trim()
      ? { address: query.trim(), coords: picked?.coords ?? null }
      : picked
    : picked;

  const confirm = () => {
    if (!result) return;
    // Recents make the next errand one tap.
    try {
      const rest = readRecents().filter((p) => p.address !== result.address);
      localStorage.setItem(RECENTS_KEY, JSON.stringify([result, ...rest].slice(0, MAX_RECENTS)));
    } catch {
      // Storage disabled: recents just don't persist.
    }
    onPick(result);
    onOpenChange(false);
  };

  const showLists = !typedOnly && query.trim().length >= 2;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {typedOnly ? "Type the address, or use where you are now." : "Search, or drag the map to put the pin on the spot."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-3 px-5 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden />
            <Input
              aria-label={title}
              className="h-12 rounded-xl pl-10 pr-10"
              placeholder={typedOnly ? "e.g. East Legon, American House" : "Search a place, street or landmark"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showLists ? (
            <ul className="divide-y rounded-2xl border" aria-label="Search results">
              {suggestions.length === 0 && <li className="p-4 text-sm text-muted-foreground">No matches yet. Keep typing or move the pin.</li>}
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => choose(s)} className="flex w-full items-start gap-3 p-3 text-left hover:bg-accent">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{s.main}</span>
                      {s.secondary && <span className="block truncate text-xs text-muted-foreground">{s.secondary}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-1">
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm font-medium hover:bg-accent"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand">
                  {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                </span>
                {locating ? "Finding you..." : "Use my current location"}
              </button>
              {recents.map((place) => (
                <button
                  key={place.address}
                  type="button"
                  onClick={() => moveTo(place)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm hover:bg-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <span className="truncate">{place.address}</span>
                </button>
              ))}
            </div>
          )}

          {!typedOnly && (
            // data-vaul-no-drag: dragging the map must not drag the sheet closed.
            <div data-vaul-no-drag className="relative h-64 overflow-hidden rounded-3xl border bg-muted">
              <div ref={mapEl} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className={cn("-mt-10 flex flex-col items-center transition-transform", moving && "-translate-y-2")}>
                  <MapPin className="h-10 w-10 fill-primary text-primary-foreground drop-shadow-lg" strokeWidth={1.5} />
                  <span className="h-1.5 w-3 rounded-full bg-black/30" />
                </div>
              </div>
            </div>
          )}
          {mapsFailed && GOOGLE_MAPS_API_KEY && (
            <p className="text-xs text-muted-foreground">Map unavailable right now. Your typed address still works.</p>
          )}

          {!typedOnly && (
            <p className="flex min-h-10 items-center gap-2 text-sm" aria-live="polite">
              {resolving && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />}
              <span className={cn(!picked && "text-muted-foreground")}>{picked?.address ?? "Move the map to place the pin."}</span>
            </p>
          )}
          {typedOnly && picked?.coords && !query.trim() && <p className="text-sm">{picked.address}</p>}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <DrawerFooter>
          <Button size="xl" disabled={!result || moving || resolving} onClick={confirm}>
            {confirmLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
