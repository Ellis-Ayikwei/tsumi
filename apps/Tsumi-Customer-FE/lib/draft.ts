import type { ErrandType } from "@tsumi/ui/lib/types";

/** The errand being written survives reloads and the Paystack top-up redirect. */
export interface ErrandDraft {
  clientRequestId: string;
  errandType: ErrandType;
  title: string;
  description: string;
  pickupAddress: string;
  dropoffAddress: string;
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

export function newDraft(errandType: ErrandType): ErrandDraft {
  return {
    clientRequestId: crypto.randomUUID(),
    errandType,
    title: "",
    description: "",
    pickupAddress: "",
    dropoffAddress: read(LAST_DROPOFF_KEY) ?? "",
    price: String(SUGGESTED_PRICE_PESEWAS[errandType] / 100),
  };
}

export const drafts = {
  load(): ErrandDraft | null {
    const raw = read(DRAFT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ErrandDraft;
    } catch {
      return null;
    }
  },
  save: (draft: ErrandDraft) => write(DRAFT_KEY, JSON.stringify(draft)),
  clear: () => write(DRAFT_KEY, null),
  rememberDropoff: (address: string) => address && write(LAST_DROPOFF_KEY, address),
  markResume: () => write(RESUME_KEY, "1"),
  takeResume(): boolean {
    const resume = read(RESUME_KEY) === "1";
    write(RESUME_KEY, null);
    return resume;
  },
};
