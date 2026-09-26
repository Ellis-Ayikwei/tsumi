"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const field =
  "h-14 w-full rounded-xl bg-[var(--field)] px-4 text-[1.0625rem] text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--ink)]";

/**
 * The home page's first action, as on ride apps: say what and where, then
 * finish on /request-errand, which opens with these values filled in.
 */
export function HomeErrandForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", pickup: "", dropoff: "" });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <form
      className="mt-8 max-w-md space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v.trim()));
        router.push(`/request-errand${params.size ? `?${params}` : ""}`);
      }}
    >
      <label className="sr-only" htmlFor="home-title">
        What do you need done?
      </label>
      <input
        id="home-title"
        className={field}
        placeholder="What do you need done?"
        value={form.title}
        onChange={set("title")}
        maxLength={200}
      />
      {/* Route pair: circle for the start, square for the end, joined by a line. */}
      <div className="relative space-y-3">
        <span aria-hidden className="absolute left-[1.3rem] top-7 z-10 h-[calc(100%-3.5rem)] w-px bg-[var(--muted)]" />
        <div className="relative">
          <span aria-hidden className="absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--ink)]" />
          <label className="sr-only" htmlFor="home-pickup">
            Pickup
          </label>
          <input id="home-pickup" className={`${field} pl-10`} placeholder="Pickup" value={form.pickup} onChange={set("pickup")} />
        </div>
        <div className="relative">
          <span aria-hidden className="absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[var(--ink)]" />
          <label className="sr-only" htmlFor="home-dropoff">
            Drop-off
          </label>
          <input id="home-dropoff" className={`${field} pl-10`} placeholder="Drop-off" value={form.dropoff} onChange={set("dropoff")} />
        </div>
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
