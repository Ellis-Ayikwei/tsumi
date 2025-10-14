"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { ErrandsAPI } from "@/lib/api";


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