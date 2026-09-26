import type { Place } from "@tsumi/ui/lib/maps";
import type { ErrandType } from "@tsumi/ui/lib/types";

/** The errand being written survives reloads and the Paystack top-up redirect. */
export interface ErrandDraft {
  clientRequestId: string;
  errandType: ErrandType;
  title: string;
  description: string;
  pickup: Place | null;
  dropoff: Place | null;
  price: string; // GHS text as typed; parsed to pesewas on submit
}

const DRAFT_KEY = "tsumi_errand_draft";
const RESUME_KEY = "tsumi_resume_errand";
const LAST_DROPOFF_KEY = "tsumi_last_dropoff";

// Starting prices per type, in pesewas. Customers can change them.
export const SUGGESTED_PRICE_PESEWAS: Record<ErrandType, number> = {
  pickup: 2500,
  delivery: 3000,
  shopping: 4000,
  custom: 3000,
};

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private mode or storage disabled: drafts just don't persist.
  }
}

/** Stored places are JSON; older builds stored a bare address string. */
function asPlace(raw: unknown): Place | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof (parsed as Place).address === "string") return parsed as Place;
  } catch {
    // Not JSON: a typed address.
  }
  return { address: raw, coords: null };
}

export function newDraft(errandType: ErrandType): ErrandDraft {
  return {
    clientRequestId: crypto.randomUUID(),
    errandType,
    title: "",
    description: "",
    pickup: null,
    dropoff: asPlace(read(LAST_DROPOFF_KEY)),
    price: String(SUGGESTED_PRICE_PESEWAS[errandType] / 100),
  };
}

export const drafts = {
  load(): ErrandDraft | null {
    const raw = read(DRAFT_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as ErrandDraft & { pickupAddress?: string; dropoffAddress?: string };
      const { pickupAddress, dropoffAddress, ...draft } = parsed;
      return {
        ...draft,
        pickup: draft.pickup ?? asPlace(pickupAddress),
        dropoff: draft.dropoff ?? asPlace(dropoffAddress),
      };
    } catch {
      return null;
    }
  },
  save: (draft: ErrandDraft) => write(DRAFT_KEY, JSON.stringify(draft)),
  clear: () => write(DRAFT_KEY, null),
  rememberDropoff: (place: Place | null) => place && write(LAST_DROPOFF_KEY, JSON.stringify(place)),
  markResume: () => write(RESUME_KEY, "1"),
  takeResume(): boolean {
    const resume = read(RESUME_KEY) === "1";
    write(RESUME_KEY, null);
    return resume;
  },
};
