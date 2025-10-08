"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  Star,
  Clock,
  MessageCircle,
  MapPin,
  Shield,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function DashboardPage() {
  const user = {
    name: "Kwame Mensah",
    trust_score: 0.92,
    total_errands: 12,
  };

  const activeErrands = [
    {
      id: "1",
      title: "Pick up documents from Ridge office",
      status: "in_progress",
      agent_name: "Ama Serwaa",
      agent_rating: 4.8,
      eta: "15 mins",
    },
  ];

  const recentRunners = [
    { id: "1", name: "Ama Serwaa", rating: 4.8, errands: 156 },
    { id: "2", name: "Kofi Asante", rating: 4.9, errands: 243 },
    { id: "3", name: "Akua Osei", rating: 4.7, errands: 89 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <Navigation currentPage="/dashboard" userName={user.name} currentRole="customer" />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your trust score: {(user.trust_score * 100).toFixed(0)}%
            </p>
          </div>

          {/* Quick Action */}
          <Link href="/request-errand" className="block mb-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-2">
                    Need something done?
                  </h3>
                  <p className="text-gray-300 dark:text-gray-600">
                    Request a Tsumi Agent and track in real-time
                  </p>
                </div>
                <Package className="w-16 h-16 text-white/20 dark:text-gray-900/20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Errands</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.total_errands}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wallet Balance</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">GHS 120.50</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Trust Score</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(user.trust_score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Errands */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Errands</h3>
            {activeErrands.length > 0 ? (
              <div className="space-y-4">
                {activeErrands.map((errand) => (
                  <Link key={errand.id} href={`/errands/${errand.id}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {errand.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {errand.agent_name} • <Star className="w-4 h-4 fill-current text-yellow-500" />{" "}
                            {errand.agent_rating}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          In Progress
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          ETA: {errand.eta}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </button>
                          <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No active errands</p>
                <Link href="/request-errand">
                  <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:scale-105 transition-transform">
                    Create Errand
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Trusted Runners */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Trusted Runners</h3>
              <Link href="/history" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRunners.map((runner) => (
                <div
                  key={runner.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-semibold text-lg">
                      {runner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{runner.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        {runner.rating} • {runner.errands} errands
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm">
                    Request Again
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
