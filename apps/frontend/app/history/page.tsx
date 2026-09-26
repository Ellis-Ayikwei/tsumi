"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");

  const errands = [
    {
      id: "1234",
      title: "Document pickup from Ridge",
      status: "completed",
      agent: "Ama Serwaa",
      amount: 50.00,
      date: "2025-10-07",
      rating: 5,
    },
    {
      id: "1233",
      title: "Grocery shopping at MaxMart",
      status: "completed",
      agent: "Kofi Asante",
      amount: 120.00,
      date: "2025-10-05",
      rating: 5,
    },
    {
      id: "1232",
      title: "Pharmacy pickup - Urgent",
      status: "completed",
      agent: "Akua Osei",
      amount: 35.00,
      date: "2025-10-03",
      rating: 4,
    },
    {
      id: "1231",
      title: "Document delivery to Tema",
      status: "cancelled",
      agent: null,
      amount: 85.00,
      date: "2025-10-02",
      rating: null,
    },
  ];

  const filteredErrands = errands.filter((e) => filter === "all" || e.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/wallet" className="text-gray-400 hover:text-white">
                Wallet
              </Link>
              <Link href="/history" className="text-white font-semibold">
                History
              </Link>
              <Link href="/profile" className="text-gray-400 hover:text-white">
                Profile
              </Link>
            </nav>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-blue to-gold-warm flex items-center justify-center font-bold">
                K
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Errand History</h2>
            <p className="text-gray-400">Track all your past errands and receipts</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">Total Errands</div>
              <div className="text-3xl font-bold">{errands.length}</div>
            </div>
            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
              <div className="text-gray-400 text-sm mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">
                {errands.filter((e) => e.status === "completed").length}
              </div>
            </div>
            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gold-warm/20">
              <div className="text-gray-400 text-sm mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-gold-warm">
                GHS {errands.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20">
              <div className="text-gray-400 text-sm mb-1">Avg Rating Given</div>
              <div className="text-3xl font-bold text-electric-blue">4.8</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { id: "all", label: "All Errands" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === f.id
                    ? "bg-electric-blue text-white"
                    : "bg-space border border-gray-700 hover:border-gray-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Errand List */}
          <div className="space-y-4">
            {filteredErrands.map((errand) => (
              <div
                key={errand.id}
                className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{errand.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          errand.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {errand.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>ID: #{errand.id} • {errand.date}</div>
                      {errand.agent && <div>Runner: {errand.agent}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold-warm mb-2">
                      GHS {errand.amount.toFixed(2)}
                    </div>
                    {errand.rating && (
                      <div className="text-sm text-gray-400">
                        {"⭐".repeat(errand.rating)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/errands/${errand.id}`}
                    className="px-4 py-2 bg-space border border-gray-700 hover:border-gray-600 rounded-lg text-sm"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 bg-space border border-gray-700 hover:border-gray-600 rounded-lg text-sm">
                    📄 Download Receipt
                  </button>
                  {errand.status === "completed" && (
                    <button className="px-4 py-2 bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30 rounded-lg text-sm">
                      🔁 Repeat Errand
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredErrands.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p>No errands found with this filter</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

