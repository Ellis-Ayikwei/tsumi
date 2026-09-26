"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PinsMap } from "@/components/pins-map";
import { PlaceField } from "@/components/place-field";
import { ApiError, ErrandsAPI } from "@/lib/api";
import { clearDraft, type ErrandDraft, loadDraft, saveDraft } from "@/lib/errand-draft";
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

  // Read after mount: storage only exists in the browser.
  useEffect(() => setDraft(loadDraft()), []);
  useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  const update = (patch: Partial<ErrandDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError(null);
    setShortfall(null);
    if (!draft.pickup && !draft.dropoff) {
      setError("Add a pickup or drop-off so your runner knows where to go.");
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
        pickup_address: draft.pickup?.address ?? "",
        pickup_lat: draft.pickup?.coords?.lat.toFixed(6) ?? null,
        pickup_lng: draft.pickup?.coords?.lng.toFixed(6) ?? null,
        dropoff_address: draft.dropoff?.address ?? "",
        dropoff_lat: draft.dropoff?.coords?.lat.toFixed(6) ?? null,
        dropoff_lng: draft.dropoff?.coords?.lng.toFixed(6) ?? null,
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
                <legend className="mb-1.5 text-sm text-gray-600 dark:text-gray-400">Where</legend>
                <div className="relative space-y-3">
                  <span aria-hidden className="absolute left-[1.3rem] top-7 z-10 h-[calc(100%-3.5rem)] w-px bg-gray-400" />
                  <PlaceField
                    id="errand-pickup"
                    label="Pickup"
                    placeholder="Pickup"
                    marker="circle"
                    locate
                    value={draft.pickup}
                    onChange={(pickup) => update({ pickup })}
                    inputClassName={input}
                  />
                  <PlaceField
                    id="errand-dropoff"
                    label="Drop-off"
                    placeholder="Drop-off"
                    marker="square"
                    value={draft.dropoff}
                    onChange={(dropoff) => update({ dropoff })}
                    inputClassName={input}
                  />
                </div>
                <PinsMap
                  pickup={draft.pickup}
                  dropoff={draft.dropoff}
                  onMove={(stop, place) => update(stop === "pickup" ? { pickup: place } : { dropoff: place })}
                />
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
