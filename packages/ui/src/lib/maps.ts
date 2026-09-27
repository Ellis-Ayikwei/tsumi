/**
 * Google Maps JS, loaded from Google's script tag on first use.
 *
 * The key is a browser key: restrict it by HTTP referrer and to the Maps
 * JavaScript, Places (New) and Geocoding APIs in Google Cloud.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** A stop on an errand. coords is null when the address was typed, not pinned. */
export interface Place {
  address: string;
  coords: LatLng | null;
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/** Where the map opens before the customer has a location. */
export const ACCRA: LatLng = { lat: 5.6037, lng: -0.187 };

// The slice of the Maps JS API Tsumi uses. @types/google.maps is not installed,
// so these interfaces are the contract; extend them when using more of the API.
export interface GLatLng {
  lat(): number;
  lng(): number;
}
interface Listener {
  remove(): void;
}
export interface GMouseEvent {
  latLng?: GLatLng | null;
  feature?: GFeature;
}
export interface GFeature {
  getProperty(name: string): unknown;
}
/** The map's GeoJSON layer: draws polygons and reports clicks on them. */
export interface GData {
  addGeoJson(geojson: object): GFeature[];
  remove(feature: GFeature): void;
  forEach(callback: (feature: GFeature) => void): void;
  setStyle(style: (feature: GFeature) => Record<string, unknown>): void;
  addListener(event: string, handler: (event: GMouseEvent) => void): Listener;
}
export interface GMap {
  getCenter(): GLatLng | undefined;
  panTo(center: LatLng): void;
  setZoom(zoom: number): void;
  setCenter(center: LatLng): void;
  fitBounds(bounds: { north: number; south: number; east: number; west: number }, padding?: number): void;
  addListener(event: string, handler: (event: GMouseEvent) => void): Listener;
  data: GData;
}
export interface GMarker {
  addListener(event: string, handler: () => void): Listener;
  getPosition(): GLatLng | null | undefined;
  setPosition(position: LatLng): void;
  setLabel(label: string): void;
  setMap(map: GMap | null): void;
}
interface GPlace {
  location?: GLatLng | null;
  formattedAddress?: string | null;
}
export interface PlacePrediction {
  text: { text: string };
  mainText?: { text: string } | null;
  secondaryText?: { text: string } | null;
  toPlace(): { fetchFields(req: { fields: string[] }): Promise<{ place: GPlace }> };
}
export interface GoogleMaps {
  importLibrary(name: "maps"): Promise<{ Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap }>;
  importLibrary(name: "marker"): Promise<{ Marker: new (opts: Record<string, unknown>) => GMarker }>;
  importLibrary(name: "geocoding"): Promise<{
    Geocoder: new () => {
      geocode(req: { location: LatLng }): Promise<{ results: { formatted_address: string }[] }>;
    };
  }>;
  importLibrary(name: "places"): Promise<{
    AutocompleteSessionToken: new () => object;
    AutocompleteSuggestion: {
      fetchAutocompleteSuggestions(req: Record<string, unknown>): Promise<{
        suggestions: { placePrediction: PlacePrediction | null }[];
      }>;
    };
  }>;
}

type MapsWindow = Window & { google?: { maps?: GoogleMaps }; __tsumiMapsReady?: () => void };

let loading: Promise<GoogleMaps> | null = null;

/**
 * Loads the Maps script once per page. Rejects when no key is configured or the
 * script is blocked; callers fall back to typed addresses. A failed load is
 * retried on the next call.
 */
export function loadGoogleMaps(): Promise<GoogleMaps> {
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  if (!loading) {
    loading = new Promise<GoogleMaps>((resolve, reject) => {
      const w = window as MapsWindow;
      if (w.google?.maps?.importLibrary) return resolve(w.google.maps);
      w.__tsumiMapsReady = () => (w.google?.maps ? resolve(w.google.maps) : reject(new Error("Google Maps missing")));
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({
        key: GOOGLE_MAPS_API_KEY,
        v: "weekly",
        loading: "async",
        region: "GH",
        callback: "__tsumiMapsReady",
      })}`;
      script.async = true;
      script.onerror = () => {
        loading = null;
        script.remove();
        reject(new Error("Google Maps failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

/**
 * Street address for a point, or null when Google has none or is unreachable.
 * Billed per call: run it on a deliberate move (drag end, "use my location"),
 * never on every map frame.
 */
export async function reverseGeocode(maps: GoogleMaps, location: LatLng): Promise<string | null> {
  try {
    const { Geocoder } = await maps.importLibrary("geocoding");
    const { results } = await new Geocoder().geocode({ location });
    return results[0]?.formatted_address ?? null;
  } catch {
    return null;
  }
}

/** API coordinates are 6dp decimal strings (about 10 cm). null unless both parse. */
export function parseCoords(lat: string | null | undefined, lng: string | null | undefined): LatLng | null {
  if (lat == null || lng == null) return null;
  const point = { lat: Number(lat), lng: Number(lng) };
  return Number.isFinite(point.lat) && Number.isFinite(point.lng) ? point : null;
}
