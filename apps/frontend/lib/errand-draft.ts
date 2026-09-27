import type { Place } from "@tsumi/ui/lib/maps";
import type { StopKind } from "@tsumi/ui/lib/types";

/** Matches TSUMI_MAX_ERRAND_STOPS on the API. */
export const MAX_STOPS = 8;

/** One place on the route. `id` keeps React rows stable while stops are reordered. */
export interface DraftStop {
  id: string;
  kind: StopKind;
  place: Place | null;
  note: string;
}

export const newStop = (kind: StopKind): DraftStop => ({ id: crypto.randomUUID(), kind, place: null, note: "" });

/**
 * The errand being written. It starts in the home page box, continues on
 * /request-errand and survives the trip through sign-in, so nothing is typed
 * twice. clientRequestId travels with it: posting again after sign-in returns
 * the same errand instead of charging twice.
 */
export interface ErrandDraft {
  clientRequestId: string;
  title: string;
  description: string;
  stops: DraftStop[]; // in route order
  amount: string; // GHS as typed; parsed to pesewas on submit
}

const KEY = "tsumi_web_errand_draft";

export function loadDraft(): ErrandDraft {
  const fresh: ErrandDraft = {
    clientRequestId: crypto.randomUUID(),
    title: "",
    description: "",
    stops: [newStop("pickup"), newStop("dropoff")],
    amount: "",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as
      | (Partial<ErrandDraft> & { pickup?: Place | null; dropoff?: Place | null })
      | null;
    if (!saved || typeof saved.clientRequestId !== "string") return fresh;
    const { pickup, dropoff, ...rest } = saved;
    // Drafts saved before multi-stop errands held one pickup and one drop-off.
    const stops = Array.isArray(rest.stops) && rest.stops.length
      ? rest.stops
      : [{ ...newStop("pickup"), place: pickup ?? null }, { ...newStop("dropoff"), place: dropoff ?? null }];
    return { ...fresh, ...rest, stops };
  } catch {
    return fresh;
  }
}

export function saveDraft(draft: ErrandDraft) {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Private mode or storage disabled: the draft just doesn't persist.
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing stored to clear.
  }
}

/**
 * Where to go after sign-in. `next` comes from the URL, so only same-site
 * paths pass; "//evil.test" and "https://..." fall back.
 */
export function safeNext(next: string | null, fallback: string) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
