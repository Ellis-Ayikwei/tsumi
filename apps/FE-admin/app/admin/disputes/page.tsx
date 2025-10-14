"use client";

import { motion } from "framer-motion";
import {
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DisputesPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Mock data
  const disputes = [
    {
      id: "DIS-001",
      errandId: "ERR-12349",
      title: "Payment not received",
      filedBy: "agent",
      filedByName: "Kweku Darko",
      against: "Grace Addo",
      status: "open",
      priority: "high",
      amount: 55,
      createdAt: "2024-06-15 12:45 PM",
      lastUpdate: "5 min ago",
      category: "payment",
      messages: 3,
    },
    {
      id: "DIS-002",
      errandId: "ERR-12347",
      title: "Item not delivered",
      filedBy: "customer",
      filedByName: "Yaw Boateng",
      against: "Abena Mensah",
      status: "investigating",
      priority: "urgent",
      amount: 80,
      createdAt: "2024-06-15 09:15 AM",
      lastUpdate: "2 hours ago",
      category: "delivery",
      messages: 12,
    },
    {
      id: "DIS-003",
      errandId: "ERR-12330",
      title: "Wrong item received",
      filedBy: "customer",
      filedByName: "Akua Osei",
      against: "Kofi Asante",
      status: "resolved",
      priority: "medium",
      amount: 120,
      createdAt: "2024-06-14 03:00 PM",
      lastUpdate: "1 day ago",
      category: "quality",
      messages: 8,
    },
    {
      id: "DIS-004",
      errandId: "ERR-12325",
      title: "Agent was rude",
      filedBy: "customer",
      filedByName: "Kwame Mensah",
      against: "Yaw Boateng",
      status: "closed",
      priority: "low",
      amount: 45,
      createdAt: "2024-06-13 11:00 AM",
      lastUpdate: "2 days ago",
      category: "behavior",
      messages: 5,
    },
    {
      id: "DIS-005",
      errandId: "ERR-12342",
      title: "Customer cancelled after pickup",
      filedBy: "agent",
      filedByName: "Ama Serwaa",
      against: "Grace Addo",
      status: "open",
      priority: "medium",
      amount: 65,
      createdAt: "2024-06-15 01:30 PM",
      lastUpdate: "30 min ago",
      category: "cancellation",
      messages: 2,
    },
  ];

  const stats = [
    { label: "Open Disputes", value: "23", color: "text-yellow-600" },
    { label: "Investigating", value: "15", color: "text-blue-600" },
    { label: "Resolved Today", value: "8", color: "text-green-600" },
    { label: "Avg Resolution Time", value: "2.5h", color: "text-purple-600" },
  ];

  const getPriorityConfig = (priority: string) => {
    const configs = {
      urgent: { badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", dot: "bg-red-600" },
      high: { badge: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400", dot: "bg-orange-600" },
      medium: { badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400", dot: "bg-yellow-600" },
      low: { badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", dot: "bg-gray-600" },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      open: { badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: AlertCircle },
      investigating: { badge: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400", icon: Clock },
      resolved: { badge: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400", icon: CheckCircle },
      closed: { badge: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dispute Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Handle platform disputes and resolutions
          </p>
        </div>
        <Link
          href="/admin/disputes?status=urgent"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <AlertCircle className="w-4 h-4" />
          Urgent (5)
        </Link>
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
                placeholder="Search by dispute ID, errand ID, or user..."
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
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category Filter */}
          <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">All Categories</option>
            <option value="payment">Payment</option>
            <option value="delivery">Delivery</option>
            <option value="quality">Quality</option>
            <option value="behavior">Behavior</option>
            <option value="cancellation">Cancellation</option>
          </select>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((dispute) => {
          const statusConfig = getStatusConfig(dispute.status);
          const priorityConfig = getPriorityConfig(dispute.priority);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-600 dark:hover:border-purple-400 transition-all"
            >
              <Link href={`/admin/disputes/${dispute.id}`} className="block p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono font-medium text-purple-600">
                        {dispute.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />
                        <span
                          className={`px-2 py-0.5 text-xs font-medium uppercase ${priorityConfig.badge}`}
                        >
                          {dispute.priority}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium uppercase ${statusConfig.badge}`}
                      >
                        {dispute.status}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
                        {dispute.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {dispute.title}
                    </h3>

                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div>
                        <span className="font-medium">Filed by:</span>{" "}
                        <span className="text-gray-900 dark:text-white">
                          {dispute.filedByName}
                        </span>{" "}
                        ({dispute.filedBy})
                      </div>
                      <div>
                        <span className="font-medium">Against:</span>{" "}
                        <span className="text-gray-900 dark:text-white">{dispute.against}</span>
                      </div>
                      <div>
                        <span className="font-medium">Errand:</span>{" "}
                        <span className="text-purple-600">{dispute.errandId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>{" "}
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ₵{dispute.amount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Filed {dispute.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {dispute.messages} messages
                      </div>
                      <div>Last updated: {dispute.lastUpdate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {dispute.status === "open" && (
                      <button className="px-4 py-2 bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                        Start Investigation
                      </button>
                    )}
                    {dispute.status === "investigating" && (
                      <button className="px-4 py-2 bg-green-600 text-white text-sm hover:bg-green-700 transition-colors">
                        Resolve
                      </button>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing 1 to {disputes.length} of 23 disputes
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
  );
}

