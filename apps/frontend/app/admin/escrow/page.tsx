"use client";

import { motion } from "framer-motion";
import {
  Search,
  Download,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EscrowPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const transactions = [
    {
      id: "TXN-45678",
      errandId: "ERR-12345",
      type: "escrow_hold",
      amount: 45,
      status: "completed",
      from: "Kwame Mensah",
      to: "Ama Serwaa",
      createdAt: "2024-06-15 10:30 AM",
      releasedAt: "2024-06-15 11:20 AM",
      holdDuration: "50 min",
    },
    {
      id: "TXN-45679",
      errandId: "ERR-12346",
      type: "escrow_hold",
      amount: 120,
      status: "holding",
      from: "Akua Osei",
      to: "Kofi Asante",
      createdAt: "2024-06-15 11:00 AM",
      releasedAt: null,
      holdDuration: "15 min",
    },
    {
      id: "TXN-45680",
      errandId: "ERR-12347",
      type: "refund",
      amount: 80,
      status: "completed",
      from: "Escrow",
      to: "Yaw Boateng",
      createdAt: "2024-06-15 09:00 AM",
      releasedAt: "2024-06-15 09:35 AM",
      holdDuration: "35 min",
    },
    {
      id: "TXN-45681",
      errandId: "ERR-12349",
      type: "escrow_hold",
      amount: 55,
      status: "disputed",
      from: "Grace Addo",
      to: "Kweku Darko",
      createdAt: "2024-06-15 12:00 PM",
      releasedAt: null,
      holdDuration: "45 min",
    },
    {
      id: "TXN-45682",
      errandId: "ERR-12350",
      type: "release",
      amount: 95,
      status: "completed",
      from: "Escrow",
      to: "Abena Mensah",
      createdAt: "2024-06-15 10:00 AM",
      releasedAt: "2024-06-15 11:00 AM",
      holdDuration: "60 min",
    },
  ];

  const stats = [
    {
      label: "Total in Escrow",
      value: "₵234,500",
      change: "+5.2%",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      label: "Pending Releases",
      value: "89",
      change: "+12%",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Released Today",
      value: "₵45,230",
      change: "+18%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Stuck/Disputed",
      value: "8",
      change: "-15%",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      holding: {
        badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        icon: Shield,
      },
      completed: {
        badge: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
        icon: CheckCircle,
      },
      disputed: {
        badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        icon: AlertCircle,
      },
      failed: {
        badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        icon: XCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.holding;
  };

  const getTypeIcon = (type: string) => {
    if (type === "escrow_hold") return Shield;
    if (type === "release") return ArrowUpRight;
    if (type === "refund") return ArrowDownLeft;
    return DollarSign;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Escrow Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor TsumiSafe escrow transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors">
            <Clock className="w-4 h-4" />
            Review Stuck (8)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-green-600">{stat.change}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          );
        })}
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
                placeholder="Search by transaction ID, errand ID, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="escrow_hold">Escrow Hold</option>
            <option value="release">Release</option>
            <option value="refund">Refund</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="holding">Holding</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hold Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {transactions.map((txn) => {
                const statusConfig = getStatusConfig(txn.status);
                const StatusIcon = statusConfig.icon;
                const TypeIcon = getTypeIcon(txn.type);

                return (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {txn.id}
                      </div>
                      <Link
                        href={`/admin/errands/${txn.errandId}`}
                        className="text-xs text-purple-600 hover:underline"
                      >
                        {txn.errandId}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {txn.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {txn.type.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">From:</span> {txn.from}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-gray-500">To:</span> {txn.to}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <span
                          className={`px-2 py-1 text-xs font-medium uppercase ${statusConfig.badge}`}
                        >
                          {txn.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        ₵{txn.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {txn.holdDuration}
                      </div>
                      {txn.releasedAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Released {txn.releasedAt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {txn.status === "holding" && (
                        <div className="flex gap-2 justify-end">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs hover:bg-green-700 transition-colors">
                            Release
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors">
                            Refund
                          </button>
                        </div>
                      )}
                      {txn.status === "disputed" && (
                        <button className="px-3 py-1 bg-yellow-600 text-white text-xs hover:bg-yellow-700 transition-colors">
                          Review Dispute
                        </button>
                      )}
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
            Showing 1 to {transactions.length} of 1,234 transactions
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

