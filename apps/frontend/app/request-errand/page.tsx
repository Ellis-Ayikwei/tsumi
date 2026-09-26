"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, ErrandsAPI } from "@/lib/api";
import { formatGhs, parseGhsToPesewas } from "@/lib/money";

export default function RequestErrandPage() {
  const router = useRouter();
  // One id per form: a double-click or retry returns the same errand and charges once.
  const [clientRequestId] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [shortfall, setShortfall] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pickup_address: "",
    delivery_address: "",
    amount: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortfall(null);
    const pricePesewas = parseGhsToPesewas(form.amount);
    if (!pricePesewas || pricePesewas <= 0) {
      setError("Enter the amount you will pay in GHS, like 25 or 25.50.");
      return;
    }
    setSubmitting(true);
    try {
      await ErrandsAPI.create({
        title: form.title,
        description: form.description,
        pickup_address: form.pickup_address,
        dropoff_address: form.delivery_address,
        price_pesewas: pricePesewas,
        errand_type: "custom",
        client_request_id: clientRequestId,
      });
      router.push("/errands");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/auth/login");
        return;
      }
      if (err instanceof ApiError && err.code === "insufficient_funds") {
        setShortfall(Number(err.meta.shortfall_pesewas));
      }
      setError(err instanceof ApiError ? err.message : "Could not create the errand. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* Request Errand Form */}
      <div className="px-4 py-10">
        <div className="max-w-2xl mx-auto border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Request an Errand</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Pickup address</label>
              <input
                value={form.pickup_address}
                onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Delivery address</label>
              <input
                value={form.delivery_address}
                onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Amount (GHS)</label>
            <input
              inputMode="decimal"
              required
              placeholder="25.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The amount is held safely in TsumiSafe escrow and only released to the agent when you confirm the errand is done.
          </p>
          {error && (
            <p className="text-sm text-red-600">
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
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Errand"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}