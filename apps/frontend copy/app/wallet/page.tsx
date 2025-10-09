"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "escrow">("overview");
  const [showDepositModal, setShowDepositModal] = useState(false);

  const walletData = {
    balance: 120.50,
    escrow_held: 85.00,
    total_spent: 450.75,
  };

  const transactions = [
    { id: "1", type: "deposit", amount: 100, status: "completed", date: "2025-10-07", provider: "Paystack" },
    { id: "2", type: "hold", amount: -50, status: "held", date: "2025-10-06", description: "Errand #1234" },
    { id: "3", type: "release", amount: -35, status: "completed", date: "2025-10-05", description: "Errand #1230" },
  ];

  const escrowHoldings = [
    { id: "1", errand_title: "Document pickup from Ridge", amount: 50.00, status: "in_progress" },
    { id: "2", errand_title: "Grocery shopping at MaxMart", amount: 35.00, status: "pending" },
  ];

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
              <Link href="/wallet" className="text-white font-semibold">
                Wallet
              </Link>
              <Link href="/history" className="text-gray-400 hover:text-white">
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
            <h2 className="text-3xl font-bold mb-2">TsumiSafe Wallet 🛡️</h2>
            <p className="text-gray-400">Your secure wallet with escrow protection</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-electric-blue to-blue-600 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10">💰</div>
              <div className="relative z-10">
                <div className="text-blue-100 text-sm mb-2">Available Balance</div>
                <div className="text-4xl font-bold mb-4">GHS {walletData.balance.toFixed(2)}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="px-4 py-2 bg-white text-electric-blue rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    + Deposit
                  </button>
                  <button className="px-4 py-2 bg-electric-blue/30 backdrop-blur-sm rounded-lg hover:bg-electric-blue/40 transition-all">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gold-warm/30">
              <div className="text-gray-400 text-sm mb-2">Held in Escrow</div>
              <div className="text-3xl font-bold text-gold-warm mb-2">
                GHS {walletData.escrow_held.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Protected until completion</p>
            </div>

            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="text-gray-400 text-sm mb-2">Total Spent</div>
              <div className="text-3xl font-bold mb-2">GHS {walletData.total_spent.toFixed(2)}</div>
              <p className="text-sm text-gray-500">Lifetime errands</p>
            </div>
          </div>

          {/* TsumiSafe Explainer */}
          <div className="mb-8 bg-gradient-to-r from-gold-warm/20 to-electric-blue/20 rounded-xl p-6 border border-gold-warm/30">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>🛡️</span>
              What is TsumiSafe Escrow?
            </h3>
            <p className="text-sm text-gray-300">
              Your money is securely held until the errand is completed. Once the agent delivers and you confirm, funds are automatically released. Your protection, guaranteed.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-800">
            {[
              { id: "overview", label: "Overview" },
              { id: "transactions", label: "Transactions" },
              { id: "escrow", label: "Escrow Holdings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 transition-all ${
                  activeTab === tab.id
                    ? "text-electric-blue border-b-2 border-electric-blue font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="text-3xl mb-3">💳</div>
                  <h4 className="font-semibold mb-2">Add Funds</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Deposit via Paystack, MTN MoMo, Vodafone Cash
                  </p>
                  <button onClick={() => setShowDepositModal(true)} className="w-full py-2 bg-electric-blue hover:bg-blue-600 rounded-lg">
                    Deposit Now
                  </button>
                </div>

                <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="text-3xl mb-3">📤</div>
                  <h4 className="font-semibold mb-2">Withdraw Funds</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Transfer to your bank or mobile money
                  </p>
                  <button className="w-full py-2 bg-space border border-gray-700 hover:border-gray-600 rounded-lg">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-space/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === "deposit"
                          ? "bg-green-500/20 text-green-400"
                          : tx.type === "hold"
                          ? "bg-gold-warm/20 text-gold-warm"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {tx.type === "deposit" ? "↓" : tx.type === "hold" ? "🔒" : "↑"}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{tx.type}</div>
                      <div className="text-sm text-gray-400">
                        {tx.description || tx.provider} • {tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        tx.type === "deposit" ? "text-green-400" : "text-white"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}GHS {Math.abs(tx.amount).toFixed(2)}
                    </div>
                    <div
                      className={`text-xs ${
                        tx.status === "completed" ? "text-green-400" : "text-gold-warm"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "escrow" && (
            <div className="space-y-4">
              {escrowHoldings.length > 0 ? (
                escrowHoldings.map((holding) => (
                  <div
                    key={holding.id}
                    className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gold-warm/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold mb-1">{holding.errand_title}</h4>
                        <p className="text-sm text-gray-400">Errand #{holding.id}</p>
                      </div>
                      <span className="px-3 py-1 bg-gold-warm/20 text-gold-warm rounded-full text-sm">
                        {holding.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gold-warm">
                        GHS {holding.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">🔒 Held safely</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🔓</div>
                  <p>No active escrow holdings</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-space rounded-xl p-8 max-w-md w-full border border-electric-blue/30"
          >
            <h3 className="text-2xl font-bold mb-6">Deposit Funds</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Amount (GHS)</label>
                <input
                  type="number"
                  placeholder="50.00"
                  className="w-full px-4 py-3 bg-space-black rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { id: "paystack", name: "Paystack (Card)", icon: "💳" },
                    { id: "momo", name: "MTN Mobile Money", icon: "📱" },
                    { id: "vodafone", name: "Vodafone Cash", icon: "📱" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      className="w-full p-4 bg-space-black border border-gray-700 hover:border-electric-blue rounded-lg text-left flex items-center gap-3 transition-all"
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span>{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-3 bg-space-black border border-gray-700 rounded-lg hover:border-gray-600"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold">
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

