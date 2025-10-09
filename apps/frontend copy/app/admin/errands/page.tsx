"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ErrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const errands = [
    {
      id: "ERR-12345",
      title: "Pick up documents from Ridge office",
      type: "pickup",
      customer: "Kwame Mensah",
      agent: "Ama Serwaa",
      status: "completed",
      amount: 45,
      commission: 6.75,
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
      customer: "Akua Osei",
      agent: "Kofi Asante",
      status: "in_progress",
      amount: 120,
      commission: 18,
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
      customer: "Yaw Boateng",
      agent: "Abena Mensah",
      status: "cancelled",
      amount: 80,
      commission: 0,
      pickup: "Accra Mall",
      dropoff: "Community 25, Tema",
      createdAt: "2024-06-15 09:00 AM",
      completedAt: "2024-06-15 09:30 AM",
      duration: "-",
    },
    {
      id: "ERR-12348",
      title: "Pay utility bill at branch",
      type: "custom",
      customer: "Ama Serwaa",
      agent: null,
      status: "pending",
      amount: 35,
      commission: 5.25,
      pickup: "ECG Office, Accra",
      dropoff: "Dansoman, Accra",
      createdAt: "2024-06-15 11:30 AM",
      completedAt: null,
      duration: "-",
    },
    {
      id: "ERR-12349",
      title: "Food pickup from restaurant",
      type: "pickup",
      customer: "Grace Addo",
      agent: "Kweku Darko",
      status: "disputed",
      amount: 55,
      commission: 8.25,
      pickup: "KFC, Tema",
      dropoff: "Community 2, Tema",
      createdAt: "2024-06-15 12:00 PM",
      completedAt: "2024-06-15 12:40 PM",
      duration: "40 min",
    },
  ];

  const stats = [
    { label: "Today's Errands", value: "456", color: "text-blue-600" },
    { label: "In Progress", value: "89", color: "text-yellow-600" },
    { label: "Completed", value: "345", color: "text-green-600" },
    { label: "Cancelled", value: "12", color: "text-red-600" },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        badge: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        icon: Clock,
        iconColor: "text-gray-500",
      },
      in_progress: {
        badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        icon: Package,
        iconColor: "text-blue-600",
      },
      completed: {
        badge: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
        icon: CheckCircle,
        iconColor: "text-green-600",
      },
      cancelled: {
        badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        icon: XCircle,
        iconColor: "text-red-600",
      },
      disputed: {
        badge: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
        icon: AlertCircle,
        iconColor: "text-yellow-600",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Errand Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor all platform errands</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800"
          >
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, customer, agent, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>

          {/* Type Filter */}
          <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">All Types</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
            <option value="shopping">Shopping</option>
            <option value="custom">Custom</option>
          </select>

          {/* Date Range */}
          <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Errands Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Errand ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {errands.map((errand) => {
                const statusConfig = getStatusConfig(errand.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.tr
                    key={errand.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/errands/${errand.id}`}
                        className="text-sm font-mono font-medium text-purple-600 hover:text-purple-700"
                      >
                        {errand.id}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {errand.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {errand.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 uppercase">
                          {errand.type}
                        </span>
                        {errand.duration !== "-" && (
                          <span className="ml-2">• {errand.duration}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">{errand.customer}</span>
                        </div>
                        {errand.agent ? (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Package className="w-3 h-3 text-gray-400" />
                            <span>{errand.agent}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">No agent assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-start gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{errand.pickup}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{errand.dropoff}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                        <span
                          className={`px-2 py-1 text-xs font-medium uppercase ${statusConfig.badge}`}
                        >
                          {errand.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₵{errand.amount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fee: ₵{errand.commission}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1 to {errands.length} of 456 errands
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white">1</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

