import type { Place } from "@tsumi/ui/lib/maps";

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
  pickup: Place | null;
  dropoff: Place | null;
  amount: string; // GHS as typed; parsed to pesewas on submit
}

const KEY = "tsumi_web_errand_draft";

export function loadDraft(): ErrandDraft {
  const fresh: ErrandDraft = {
    clientRequestId: crypto.randomUUID(),
    title: "",
    description: "",
    pickup: null,
    dropoff: null,
    amount: "",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<ErrandDraft> | null;
    return saved && typeof saved.clientRequestId === "string" ? { ...fresh, ...saved } : fresh;
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
