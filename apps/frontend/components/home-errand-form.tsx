"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type ErrandDraft, loadDraft, saveDraft } from "@/lib/errand-draft";

import { PlaceField } from "./place-field";

const field =
  "h-14 w-full rounded-xl bg-[var(--field)] px-4 text-[1.0625rem] text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--ink)]";

/**
 * The start of the errand, as on ride apps: what, from where, to where. It
 * writes the shared draft, so /request-errand opens with all of it filled in
 * and only asks for the price.
 */
export function HomeErrandForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<ErrandDraft | null>(null);

  // Read after mount: storage only exists in the browser, and server and client must render the same first.
  useEffect(() => setDraft(loadDraft()), []);
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const update = (patch: Partial<ErrandDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return (
    <form
      className="mt-8 max-w-md space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/request-errand");
      }}
    >
      <label className="sr-only" htmlFor="home-title">
        What do you need done?
      </label>
      <input
        id="home-title"
        className={field}
        placeholder="What do you need done?"
        value={draft?.title ?? ""}
        onChange={(e) => update({ title: e.target.value })}
        maxLength={200}
      />
      {/* Route pair: circle for the start, square for the end, joined by a line. */}
      <div className="relative space-y-3">
        <span aria-hidden className="absolute left-[1.3rem] top-7 z-10 h-[calc(100%-3.5rem)] w-px bg-[var(--muted)]" />
        <PlaceField
          id="home-pickup"
          label="Pickup"
          placeholder="Pickup"
          marker="circle"
          locate
          value={draft?.pickup ?? null}
          onChange={(pickup) => update({ pickup })}
          inputClassName={field}
        />
        <PlaceField
          id="home-dropoff"
          label="Drop-off"
          placeholder="Drop-off"
          marker="square"
          value={draft?.dropoff ?? null}
          onChange={(dropoff) => update({ dropoff })}
          inputClassName={field}
        />
      </div>
      <button
        type="submit"
        className="h-14 w-full rounded-xl bg-[var(--brand)] text-[1.0625rem] font-semibold text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-ink)] sm:w-auto sm:px-8"
      >
        Continue
      </button>
    </form>
  );
}
