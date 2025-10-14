"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { useState } from "react";

export default function ErrandsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const user = {
    name: "Kwame Mensah",
    trust_score: 0.92,
    total_errands: 12,
  };

  // Mock data - will be replaced with API call
  const errands = [
    {
      id: "ERR-12345",
      title: "Pick up documents from Ridge office",
      type: "pickup",
      status: "completed",
      agent: "Ama Serwaa",
      agentRating: 4.9,
      amount: 45,
      pickup: "Ridge, Accra",
      dropoff: "East Legon, Accra",
      createdAt: "2024-06-15 10:30 AM",
      completedAt: "2024-06-15 11:15 AM",
      duration: "45 min",
    },
    {
      id: "ERR-12346",
      title: "Grocery shopping at MaxMart",
      type: "shopping",
      status: "in_progress",
      agent: "Kofi Asante",
      agentRating: 4.8,
      amount: 120,
      pickup: "MaxMart, Osu",
      dropoff: "Labone, Accra",
      createdAt: "2024-06-15 11:00 AM",
      completedAt: null,
      duration: "-",
    },
    {
      id: "ERR-12347",
      title: "Deliver package to Tema",
      type: "delivery",
      status: "cancelled",
      agent: "Abena Mensah",
      agentRating: 4.7,
      amount: 80,
      pickup: "Accra Mall",
      dropoff: "Community 25, Tema",
      createdAt: "2024-06-15 09:00 AM",
      completedAt: "2024-06-15 09:30 AM",
      duration: "-",
    },
    {
      id: "ERR-12348",
      title: "Pay utility bill at ECG office",
      type: "custom",
      status: "pending",
      agent: null,
      agentRating: 0,
      amount: 35,
      pickup: "ECG Office, Accra",
      dropoff: "Dansoman, Accra",
      createdAt: "2024-06-15 11:30 AM",
      completedAt: null,
      duration: "-",
    },
    {
      id: "ERR-12344",
      title: "Food pickup from KFC",
      type: "pickup",
      status: "completed",
      agent: "Yaw Boateng",
      agentRating: 4.6,
      amount: 55,
      pickup: "KFC, Tema",
      dropoff: "Community 2, Tema",
      createdAt: "2024-06-14 12:00 PM",
      completedAt: "2024-06-14 12:40 PM",
      duration: "40 min",
    },
    {
      id: "ERR-12343",
      title: "Document printing at shop",
      type: "custom",
      status: "completed",
      agent: "Grace Addo",
      agentRating: 4.9,
      amount: 25,
      pickup: "Print Shop, Osu",
      dropoff: "Labadi, Accra",
      createdAt: "2024-06-13 02:00 PM",
      completedAt: "2024-06-13 02:30 PM",
      duration: "30 min",
    },
  ];

  const stats = [
    { label: "Total Errands", value: errands.length, icon: Package, color: "text-blue-600" },
    {
      label: "Completed",
      value: errands.filter((e) => e.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "In Progress",
      value: errands.filter((e) => e.status === "in_progress").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Cancelled",
      value: errands.filter((e) => e.status === "cancelled").length,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        icon: Clock,
        iconColor: "text-gray-500",
      },
      in_progress: {
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        icon: Package,
        iconColor: "text-blue-600",
      },
      completed: {
        badge: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
        icon: CheckCircle,
        iconColor: "text-green-600",
      },
      cancelled: {
        badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        icon: XCircle,
        iconColor: "text-red-600",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const filteredErrands = errands.filter((errand) => {
    const matchesSearch =
      errand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      errand.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || errand.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <Navigation currentPage="/errands" userName={user.name} currentRole="customer" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Errands</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage all your errands
            </p>
          </div>
          <Link
            href="/request-errand"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Errand
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search errands by title or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Errands List */}
        {filteredErrands.length > 0 ? (
          <div className="space-y-4">
            {filteredErrands.map((errand) => {
              const statusConfig = getStatusConfig(errand.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={errand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <Link href={`/errands/${errand.id}`} className="block p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono font-medium text-blue-600 dark:text-blue-400">
                            {errand.id}
                          </span>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${statusConfig.badge}`}
                            >
                              {errand.status.replace("_", " ")}
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium uppercase">
                            {errand.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {errand.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">
                                Pickup
                              </div>
                              <div>{errand.pickup}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">
                                Dropoff
                              </div>
                              <div>{errand.dropoff}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          ₵{errand.amount}
                        </div>
                        {errand.duration !== "-" && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {errand.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {errand.createdAt}
                        </div>
                        {errand.agent && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {errand.agent}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View Details →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No errands found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "You haven't created any errands yet"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Link
                href="/request-errand"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Errand
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


