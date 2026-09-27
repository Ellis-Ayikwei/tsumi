"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PinsMap } from "@/components/pins-map";
import { PlaceField } from "@/components/place-field";
import { ApiError, ErrandsAPI } from "@/lib/api";
import { clearDraft, type DraftStop, type ErrandDraft, loadDraft, MAX_STOPS, newStop, saveDraft } from "@/lib/errand-draft";
import { formatGhs, parseGhsToPesewas } from "@/lib/money";

const PRESETS_PESEWAS = [2000, 3000, 5000, 8000];

const input =
  "h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-white";

/**
 * Finishes the errand started in the home page box: the title and stops come
 * from the shared draft, so this page mostly asks for the price. If the
 * customer isn't signed in, the draft waits while they sign in and they land
 * back here with everything still filled in.
 */
export default function RequestErrandPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ErrandDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shortfall, setShortfall] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Which stop an error belongs to, so it shows under that stop.
  const [stopError, setStopError] = useState<{ index: number; text: string } | null>(null);
  const [noteOpen, setNoteOpen] = useState<Set<string>>(new Set());

  // Read after mount: storage only exists in the browser.
  useEffect(() => setDraft(loadDraft()), []);
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const update = (patch: Partial<ErrandDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const setStops = (change: (stops: DraftStop[]) => DraftStop[]) => {
    setStopError(null);
    setDraft((d) => (d ? { ...d, stops: change(d.stops) } : d));
  };
  const editStop = (index: number, patch: Partial<DraftStop>) =>
    setStops((stops) => stops.map((st, i) => (i === index ? { ...st, ...patch } : st)));
  const moveStop = (index: number, by: -1 | 1) =>
    setStops((stops) => {
      const next = [...stops];
      [next[index], next[index + by]] = [next[index + by], next[index]];
      return next;
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError(null);
    setShortfall(null);
    setStopError(null);
    const empty = draft.stops.findIndex((st) => !st.place?.address.trim());
    if (empty >= 0) {
      setStopError({ index: empty, text: "This stop has no address. Add one or remove the stop." });
      return;
    }
    const pricePesewas = parseGhsToPesewas(draft.amount);
    if (!pricePesewas || pricePesewas <= 0) {
      setError("Enter what you'll pay in GHS, like 25 or 25.50, or tap an amount.");
      return;
    }
    setSubmitting(true);
    try {
      await ErrandsAPI.create({
        title: draft.title.trim(),
        description: draft.description.trim(),
        stops: draft.stops.map((st) => ({
          kind: st.kind,
          address: st.place?.address.trim() ?? "",
          lat: st.place?.coords?.lat.toFixed(6) ?? null,
          lng: st.place?.coords?.lng.toFixed(6) ?? null,
          note: st.note.trim(),
        })),
        price_pesewas: pricePesewas,
        errand_type: "custom",
        client_request_id: draft.clientRequestId,
      });
      clearDraft();
      router.push("/errands");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // The draft is already saved; sign-in brings the customer straight back here.
        router.push("/auth/login?next=/request-errand");
        return;
      }
      if (err instanceof ApiError && err.code === "insufficient_funds") {
        setShortfall(Number(err.meta.shortfall_pesewas));
      }
      // "stops.2.lat" belongs to the third stop: show it there, without the field path.
      const onStop = err instanceof ApiError ? /^stops\.(\d+)\./.exec(err.details[0]?.field ?? "") : null;
      if (onStop && err instanceof ApiError) {
        setStopError({ index: Number(onStop[1]), text: err.details[0].issue });
        return;
      }
      setError(err instanceof ApiError ? err.message : "Could not post the errand. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const pricePesewas = draft ? parseGhsToPesewas(draft.amount) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tsumi</h1>
            </Link>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Post your errand</h1>
          {draft && (
            <form onSubmit={onSubmit} className="space-y-6 text-gray-900 dark:text-white">
              <div>
                <label htmlFor="errand-title" className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">
                  What do you need done?
                </label>
                <input
                  id="errand-title"
                  className={input}
                  required
                  maxLength={200}
                  placeholder="e.g. Pick up documents from Ridge"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="mb-1.5 text-sm text-gray-600 dark:text-gray-400">Stops, in the order your runner goes</legend>
                <ol className="space-y-4">
                  {draft.stops.map((stop, i) => (
                    <li key={stop.id} className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-gray-900" aria-hidden>
                          {i + 1}
                        </span>
                        <div role="radiogroup" aria-label={`Stop ${i + 1} type`} className="flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700">
                          {(["pickup", "dropoff"] as const).map((kind) => (
                            <button
                              key={kind}
                              type="button"
                              role="radio"
                              aria-checked={stop.kind === kind}
                              onClick={() => editStop(i, { kind })}
                              className={`h-9 rounded-md px-3 text-sm font-medium ${
                                stop.kind === kind ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {kind === "pickup" ? "Pickup" : "Drop-off"}
                            </button>
                          ))}
                        </div>
                        <div className="ml-auto flex items-center">
                          <button type="button" onClick={() => moveStop(i, -1)} disabled={i === 0} aria-label={`Move stop ${i + 1} earlier`} className="flex h-11 w-11 items-center justify-center rounded-lg text-lg disabled:opacity-30">
                            &uarr;
                          </button>
                          <button type="button" onClick={() => moveStop(i, 1)} disabled={i === draft.stops.length - 1} aria-label={`Move stop ${i + 1} later`} className="flex h-11 w-11 items-center justify-center rounded-lg text-lg disabled:opacity-30">
                            &darr;
                          </button>
                          <button
                            type="button"
                            onClick={() => setStops((stops) => stops.filter((_, j) => j !== i))}
                            disabled={draft.stops.length === 1}
                            aria-label={`Remove stop ${i + 1}`}
                            className="flex h-11 items-center rounded-lg px-2 text-sm text-gray-600 hover:text-red-600 disabled:opacity-30 dark:text-gray-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <PlaceField
                        id={`errand-stop-${stop.id}`}
                        label={`Stop ${i + 1}`}
                        placeholder={stop.kind === "pickup" ? "Where to pick up" : "Where to drop off"}
                        marker={stop.kind === "pickup" ? "circle" : "square"}
                        locate={i === 0}
                        value={stop.place}
                        onChange={(place) => editStop(i, { place })}
                        inputClassName={input}
                      />
                      {stop.note || noteOpen.has(stop.id) ? (
                        <input
                          aria-label={`Note for stop ${i + 1}`}
                          className={input}
                          maxLength={255}
                          autoFocus={!stop.note}
                          placeholder="Who to ask for, gate colour, what to collect"
                          value={stop.note}
                          onChange={(e) => editStop(i, { note: e.target.value })}
                        />
                      ) : (
                        <button type="button" onClick={() => setNoteOpen(new Set(noteOpen).add(stop.id))} className="min-h-11 text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400">
                          + Add a note for this stop
                        </button>
                      )}
                      {stopError?.index === i && (
                        <p role="alert" className="text-sm text-red-600 dark:text-red-400">{stopError.text}</p>
                      )}
                    </li>
                  ))}
                </ol>
                {draft.stops.length < MAX_STOPS ? (
                  <button
                    type="button"
                    // A new stop goes before the final destination, like adding a stop on the way.
                    onClick={() => setStops((stops) => [...stops.slice(0, -1), newStop("dropoff"), ...stops.slice(-1)])}
                    className="flex h-11 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    + Add a stop
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">That&apos;s the most stops one errand can have ({MAX_STOPS}).</p>
                )}
                <PinsMap stops={draft.stops} onMove={(index, place) => editStop(index, { place })} />
              </fieldset>

              <div>
                <label htmlFor="errand-amount" className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">
                  Your price (GHS)
                </label>
                <input
                  id="errand-amount"
                  className={input}
                  inputMode="decimal"
                  placeholder="25.00"
                  value={draft.amount}
                  onChange={(e) => update({ amount: e.target.value })}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESETS_PESEWAS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update({ amount: String(p / 100) })}
                      aria-pressed={pricePesewas === p}
                      className={`h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                        pricePesewas === p
                          ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                          : "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                      }`}
                    >
                      {formatGhs(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="errand-notes" className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">
                  Details for your runner (optional)
                </label>
                <textarea
                  id="errand-notes"
                  rows={3}
                  placeholder="Item list, who to ask for, gate colour..."
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-white"
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your payment is held in TsumiSafe and only released to the runner when you confirm the errand is done.
              </p>
              {error && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {error}
                  {shortfall !== null && shortfall > 0 && (
                    <>
                      {" "}
                      <Link href="/wallet/topup" className="underline">
                        Top up {formatGhs(shortfall)}
                      </Link>
                    </>
                  )}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="h-14 w-full rounded-xl bg-gray-900 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-gray-900"
              >
                {submitting ? "Posting..." : pricePesewas ? `Post errand for ${formatGhs(pricePesewas)}` : "Post errand"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
