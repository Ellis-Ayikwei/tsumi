"use client";

import { Crosshair, Loader2, Map as MapIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  type GoogleMaps,
  loadGoogleMaps,
  type Place,
  type PlacePrediction,
  reverseGeocode,
} from "@tsumi/ui/lib/maps";

import { MapPicker } from "./map-picker";

interface Suggestion {
  id: string;
  main: string;
  secondary: string;
  prediction: PlacePrediction;
}

/**
 * Address input with Google Places suggestions (Ghana only). Picking a
 * suggestion or "use my location" pins the stop; typing freely keeps it as a
 * plain address with no coordinates. Without a Maps key it is a plain input.
 */
export function PlaceField({
  id,
  label,
  placeholder,
  value,
  onChange,
  marker,
  locate = false,
  inputClassName,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
  marker: "circle" | "square";
  locate?: boolean;
  inputClassName: string;
}) {
  const [maps, setMaps] = useState<GoogleMaps | null>(null);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const sessionToken = useRef<object | null>(null);
  const seq = useRef(0);
  const text = value?.address ?? "";

  useEffect(() => {
    loadGoogleMaps().then(setMaps, () => undefined); // No key or blocked: plain input.
  }, []);

  useEffect(() => {
    const input = text.trim();
    // Only search what the customer is typing, not an address already pinned.
    if (!maps || !focused || value?.coords || input.length < 2) {
      setSuggestions([]);
      return;
    }
    const mine = ++seq.current;
    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = await maps.importLibrary("places");
        sessionToken.current ??= new AutocompleteSessionToken();
        const { suggestions: found } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionToken.current,
          includedRegionCodes: ["gh"],
        });
        if (mine !== seq.current) return;
        setSuggestions(
          found.flatMap(({ placePrediction: p }, i) =>
            p
              ? [{ id: `${i}-${p.text.text}`, main: p.mainText?.text ?? p.text.text, secondary: p.secondaryText?.text ?? "", prediction: p }]
              : []
          )
        );
      } catch {
        if (mine === seq.current) setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [text, maps, focused, value?.coords]);

  const choose = async (s: Suggestion) => {
    const address = s.secondary ? `${s.main}, ${s.secondary}` : s.main;
    setSuggestions([]);
    try {
      const { place } = await s.prediction.toPlace().fetchFields({ fields: ["location"] });
      sessionToken.current = null; // A session ends when a place is fetched.
      onChange({ address, coords: place.location ? { lat: place.location.lat(), lng: place.location.lng() } : null });
    } catch {
      onChange({ address, coords: null });
    }
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("This browser can't share your location. Type the address instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const coords = { lat: latitude, lng: longitude };
        const address = maps ? await reverseGeocode(maps, coords) : null;
        setLocating(false);
        onChange({ address: address ?? "My current location", coords });
      },
      () => {
        setLocating(false);
        setError("Location is off. Allow location for this site, or type the address.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  return (
    <div className="relative">
      <span
        aria-hidden
        className={`absolute left-4 top-7 z-10 h-2.5 w-2.5 -translate-y-1/2 bg-current ${marker === "circle" ? "rounded-full" : ""}`}
      />
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${inputClassName} pl-10 ${locate && !value?.coords ? "pr-24" : "pr-12"}`}
        placeholder={placeholder}
        value={text}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value ? { address: e.target.value, coords: null } : null)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <div className="absolute right-1.5 top-7 flex -translate-y-1/2 items-center">
        {locate && !value?.coords && (
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            aria-label="Use my current location"
            title="Use my current location"
            className="flex h-11 w-11 items-center justify-center rounded-lg opacity-70 hover:opacity-100"
          >
            {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
          </button>
        )}
        <button
          type="button"
          onClick={() => setPicking(true)}
          aria-label={value?.coords ? `Adjust ${label.toLowerCase()} on the map` : `Choose ${label.toLowerCase()} on the map`}
          title={value?.coords ? "Adjust on the map" : "Choose on the map"}
          className={`flex h-11 w-11 items-center justify-center rounded-lg hover:opacity-100 ${value?.coords ? "opacity-100" : "opacity-70"}`}
        >
          <MapIcon className="h-5 w-5" />
        </button>
      </div>
      {picking && (
        <MapPicker
          title={value?.coords ? `Adjust ${label.toLowerCase()}` : `Choose ${label.toLowerCase()} on the map`}
          initial={value}
          onClose={() => setPicking(false)}
          onPick={(place) => {
            setPicking(false);
            setError(null);
            onChange(place);
          }}
        />
      )}
      {suggestions.length > 0 && (
        <ul
          aria-label={`${label} suggestions`}
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        >
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                // Keep focus in the input so blur doesn't close the list before the click lands.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
                className="flex min-h-11 w-full flex-col justify-center px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="text-sm font-medium">{s.main}</span>
                {s.secondary && <span className="text-xs text-gray-500 dark:text-gray-400">{s.secondary}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
