"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type DraftStop, type ErrandDraft, loadDraft, newStop, saveDraft } from "@/lib/errand-draft";

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
  useEffect(() => {
    const loaded = loadDraft();
    // The box always shows a start and an end; a one-stop draft gains the missing side.
    if (loaded.stops.length < 2) {
      const only = loaded.stops[0];
      loaded.stops = only?.kind === "pickup" ? [only, newStop("dropoff")] : [newStop("pickup"), ...loaded.stops];
    }
    setDraft(loaded);
  }, []);
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const update = (patch: Partial<ErrandDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const setStopPlace = (index: number, place: DraftStop["place"]) =>
    setDraft((d) => (d ? { ...d, stops: d.stops.map((st, i) => (i === index ? { ...st, place } : st)) } : d));
  const last = (draft?.stops.length ?? 2) - 1;
  const extra = Math.max(0, (draft?.stops.length ?? 0) - 2);

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
          value={draft?.stops[0]?.place ?? null}
          onChange={(place) => setStopPlace(0, place)}
          inputClassName={field}
        />
        <PlaceField
          id="home-dropoff"
          label="Drop-off"
          placeholder="Drop-off"
          marker="square"
          value={draft?.stops[last]?.place ?? null}
          onChange={(place) => setStopPlace(last, place)}
          inputClassName={field}
        />
      </div>
      {extra > 0 && (
        <p className="text-sm text-[var(--muted)]">
          +{extra} more {extra === 1 ? "stop" : "stops"} on the way. You can edit them on the next step.
        </p>
      )}
      <button
        type="submit"
        className="h-14 w-full rounded-xl bg-[var(--brand)] text-[1.0625rem] font-semibold text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-ink)] sm:w-auto sm:px-8"
      >
        Continue
      </button>
    </form>
  );
}
