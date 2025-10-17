"use client";
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle,
  Star,
  Navigation as NavigationIcon,
  AlertCircle,
  Calendar,
  Wallet,
} from "lucide-react";

export default function AgentDashboard() {
  // Mock data
  const stats = [
    {
      label: "Available Jobs",
      value: "12",
      change: "+3 new",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Active Errands",
      value: "2",
      change: "In progress",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Today's Earnings",
      value: "₵245",
      change: "+₵45",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Rating",
      value: "4.9",
      change: "128 reviews",
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-950",
    },
  ];

  const availableJobs = [
    {
      id: "1",
      title: "Pickup documents from Ridge",
      type: "Document Pickup",
      distance: "2.5 km",
      payment: 35,
      pickup: "Ridge Office Complex",
      dropoff: "East Legon",
      priority: "normal",
      customer: "Kwame M.",
      customerRating: 4.7,
    },
    {
      id: "2",
      title: "Grocery delivery to Osu",
      type: "Grocery Delivery",
      distance: "4.2 km",
      payment: 50,
      pickup: "Shoprite, Osu",
      dropoff: "Osu Oxford Street",
      priority: "urgent",
      customer: "Grace A.",
      customerRating: 4.9,
    },
    {
      id: "3",
      title: "Food pickup from KFC",
      type: "Food Delivery",
      distance: "1.8 km",
      payment: 25,
      pickup: "KFC Accra Mall",
      dropoff: "Community 18",
      priority: "normal",
      customer: "Kofi D.",
      customerRating: 4.6,
    },
  ];

  const activeErrands = [
    {
      id: "ERR-001",
      title: "Medical prescription delivery",
      status: "picked_up",
      customer: "Abena Mensah",
      dropoff: "Labone",
      eta: "12 mins",
      payment: 40,
    },
    {
      id: "ERR-002",
      title: "Document signing errand",
      status: "in_transit",
      customer: "Yaw Osei",
      dropoff: "Cantonments",
      eta: "25 mins",
      payment: 55,
    },
  ];

  const getPriorityBadge = (priority: string) => {
    if (priority === "urgent") {
      return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
    }
    return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, Ama! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You have 12 available jobs nearby. Let's make today count!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-gray-700 dark:text-gray-300`} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Active Errands */}
          {activeErrands.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Active Errands
              </h2>
              <div className="space-y-4">
                {activeErrands.map((errand) => (
                  <div
                    key={errand.id}
                    className="bg-gray-900 dark:bg-gray-100 rounded-2xl p-6 text-white dark:text-gray-900"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm opacity-80 mb-1">{errand.id}</div>
                        <h3 className="text-xl font-semibold mb-2">{errand.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {errand.dropoff}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ETA: {errand.eta}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₵{errand.payment}</div>
                        <div className="text-sm opacity-80">Earnings</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <NavigationIcon className="w-4 h-4" />
                        Navigate
                      </button>
                      <button className="flex-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-3 rounded-xl font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors">
                        Call Customer
                      </button>
                      <button className="flex-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-3 rounded-xl font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors">
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Available Jobs Near You
              </h2>
              <button className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs uppercase font-medium rounded-full ${getPriorityBadge(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {job.pickup} → {job.dropoff}
                        </div>
                        <div className="flex items-center gap-2">
                          <NavigationIcon className="w-4 h-4 text-gray-500" />
                          {job.distance} away
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          Customer: {job.customer} ({job.customerRating})
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        ₵{job.payment}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">You earn</div>
                      <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                        Accept Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link
              href="/agent/earnings"
              className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all group"
            >
              <Wallet className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                My Earnings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View earnings, withdrawals & payouts
              </p>
            </Link>

            <Link
              href="/agent/schedule"
              className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all group"
            >
              <Calendar className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                My Schedule
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set availability & manage shifts
              </p>
            </Link>

            <Link
              href="/profile"
              className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all group"
            >
              <Star className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                My Profile & Badges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View trust badges & ratings
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

