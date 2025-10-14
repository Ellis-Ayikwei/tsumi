"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ErrandsAPI } from "@/lib/api";

export const metadata: Metadata = {
  title: "Request an Errand",
  description: "Create a new errand request with pickup and delivery details.",
  alternates: { canonical: "/request-errand" },
};

export default function RequestErrandPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    pickup_address: "",
    delivery_address: "",
    amount: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await ErrandsAPI.create({
      title: form.title,
      description: form.description,
      pickup_address: form.pickup_address,
      delivery_address: form.delivery_address,
      amount: Number(form.amount || 0),
      errand_type: "custom",
    });
    alert("Errand created");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Request an Errand</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Pickup address</label>
              <input
                value={form.pickup_address}
                onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Delivery address</label>
              <input
                value={form.delivery_address}
                onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Amount (GHS)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          >
            Create Errand
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type ErrandType = "pickup" | "delivery" | "shopping" | "custom";

export default function RequestErrandPage() {
  const [step, setStep] = useState(1);
  const [errandType, setErrandType] = useState<ErrandType>("delivery");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickup_address: "",
    delivery_address: "",
    budget: "",
    priority: "normal" as "normal" | "express",
    payment_method: "tsumisafe" as "tsumisafe" | "wallet" | "direct",
  });

  const errandTypes = [
    { id: "delivery", name: "Delivery", icon: "🚚", description: "Send items from A to B" },
    { id: "pickup", name: "Pickup", icon: "📦", description: "Pick up and bring to me" },
    { id: "shopping", name: "Shopping", icon: "🛒", description: "Buy items for me" },
    { id: "custom", name: "Custom Task", icon: "✨", description: "Other errands" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement errand creation API call
    console.log("Create Errand:", { ...formData, errand_type: errandType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2 bg-space border border-electric-blue/30 rounded-lg hover:border-electric-blue transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? "bg-electric-blue text-white"
                      : "bg-space text-gray-500 border border-gray-700"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? "bg-electric-blue" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-space/50 backdrop-blur-sm rounded-xl p-8 border border-electric-blue/20">
            <h2 className="text-3xl font-bold mb-2">Request an Errand</h2>
            <p className="text-gray-400 mb-8">
              Tell us what you need done, and we&apos;ll connect you with a verified Tsumi Agent
            </p>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Errand Type */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold mb-4">What type of errand?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {errandTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setErrandType(type.id as ErrandType)}
                        className={`p-6 rounded-xl text-left transition-all ${
                          errandType === type.id
                            ? "bg-electric-blue border-2 border-electric-blue"
                            : "bg-space border-2 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <h4 className="font-semibold text-lg mb-1">{type.name}</h4>
                        <p className="text-sm text-gray-400">{type.description}</p>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Errand Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Pick up documents from office"
                      className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Description & Details
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Provide any specific instructions, item details, or special requirements..."
                      rows={4}
                      className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold mb-4">Where should we go?</h3>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      📍 Pickup Location
                    </label>
                    <input
                      type="text"
                      value={formData.pickup_address}
                      onChange={(e) =>
                        setFormData({ ...formData, pickup_address: e.target.value })
                      }
                      placeholder="Enter pickup address or search on map..."
                      className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      className="mt-2 text-electric-blue text-sm hover:underline"
                    >
                      📌 Use current location
                    </button>
                  </div>

                  <div className="h-48 bg-space rounded-lg border border-gray-700 flex items-center justify-center">
                    <p className="text-gray-500">🗺️ Map View (Google Maps integration)</p>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      📍 Delivery Location
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_address}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_address: e.target.value })
                      }
                      placeholder="Enter delivery address..."
                      className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      required
                    />
                  </div>

                  <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Estimated Distance:</span>
                      <span className="font-semibold">~5.2 km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-300">Estimated Time:</span>
                      <span className="font-semibold">~25 mins</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment & Confirmation */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold mb-4">Budget & Payment</h3>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Your Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        GHS
                      </span>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="50"
                        className="w-full pl-16 pr-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                        required
                        min="1"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      💡 Suggested: GHS 45 - 65 based on distance
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Priority</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: "normal" })}
                        className={`p-4 rounded-lg transition-all ${
                          formData.priority === "normal"
                            ? "bg-electric-blue border-2 border-electric-blue"
                            : "bg-space border-2 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="font-semibold">Normal</div>
                        <div className="text-sm text-gray-400">Standard delivery</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: "express" })}
                        className={`p-4 rounded-lg transition-all ${
                          formData.priority === "express"
                            ? "bg-gold-warm text-space-black border-2 border-gold-warm"
                            : "bg-space border-2 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="font-semibold">⚡ Express</div>
                        <div className="text-sm opacity-70">Priority handling</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, payment_method: "tsumisafe" })
                        }
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          formData.payment_method === "tsumisafe"
                            ? "bg-electric-blue/20 border-2 border-electric-blue"
                            : "bg-space border-2 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">🛡️ TsumiSafe Escrow</div>
                            <div className="text-sm text-gray-400">
                              Recommended • Money held until completion
                            </div>
                          </div>
                          {formData.payment_method === "tsumisafe" && (
                            <span className="text-electric-blue">✓</span>
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_method: "wallet" })}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          formData.payment_method === "wallet"
                            ? "bg-electric-blue/20 border-2 border-electric-blue"
                            : "bg-space border-2 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">💰 Wallet Balance</div>
                            <div className="text-sm text-gray-400">GHS 120.50 available</div>
                          </div>
                          {formData.payment_method === "wallet" && (
                            <span className="text-electric-blue">✓</span>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-space rounded-lg border border-gold-warm/30">
                    <h4 className="font-semibold mb-4">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Errand Fee</span>
                        <span>GHS {formData.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span>GHS {(parseFloat(formData.budget || "0") * 0.15).toFixed(2)}</span>
                      </div>
                      {formData.priority === "express" && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Express Fee</span>
                          <span>GHS 10.00</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-gold-warm">
                            GHS{" "}
                            {(
                              parseFloat(formData.budget || "0") * 1.15 +
                              (formData.priority === "express" ? 10 : 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-4 bg-space border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex-1 py-4 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold transition-all glow-blue"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gold-warm hover:bg-yellow-500 text-space-black rounded-lg font-semibold transition-all glow-gold"
                  >
                    Request Tsumi Agent
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

