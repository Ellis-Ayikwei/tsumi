"use client";

import { motion } from "framer-motion";
import {
  Search,
  Download,
  MoreVertical,
  Shield,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKYC, setFilterKYC] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const agents = [
    {
      id: "1",
      name: "Ama Serwaa",
      phone: "+233 24 234 5678",
      kycStatus: "approved",
      status: "active",
      rating: 4.9,
      totalErrands: 245,
      earnings: 12450,
      badges: ["verified_id", "reliable_runner", "great_communicator"],
      joinedDate: "2023-11-20",
      completionRate: 98,
      responseTime: "3 min",
    },
    {
      id: "2",
      name: "Kofi Asante",
      phone: "+233 24 345 6789",
      kycStatus: "pending",
      status: "inactive",
      rating: 0,
      totalErrands: 0,
      earnings: 0,
      badges: [],
      joinedDate: "2024-06-15",
      completionRate: 0,
      responseTime: "-",
    },
    {
      id: "3",
      name: "Akua Osei",
      phone: "+233 24 456 7890",
      kycStatus: "approved",
      status: "active",
      rating: 4.8,
      totalErrands: 198,
      earnings: 10100,
      badges: ["verified_id", "reliable_runner"],
      joinedDate: "2023-12-05",
      completionRate: 95,
      responseTime: "5 min",
    },
    {
      id: "4",
      name: "Yaw Boateng",
      phone: "+233 24 567 8901",
      kycStatus: "rejected",
      status: "suspended",
      rating: 4.2,
      totalErrands: 45,
      earnings: 2300,
      badges: ["verified_id"],
      joinedDate: "2024-03-10",
      completionRate: 78,
      responseTime: "12 min",
    },
    {
      id: "5",
      name: "Abena Mensah",
      phone: "+233 24 678 9012",
      kycStatus: "approved",
      status: "active",
      rating: 4.7,
      totalErrands: 167,
      earnings: 8900,
      badges: ["verified_id", "pro_runner"],
      joinedDate: "2024-01-22",
      completionRate: 92,
      responseTime: "4 min",
    },
  ];

  const stats = [
    { label: "Total Agents", value: "1,234", color: "text-blue-600" },
    { label: "Active Today", value: "567", color: "text-green-600" },
    { label: "Pending KYC", value: "15", color: "text-yellow-600" },
    { label: "Suspended", value: "23", color: "text-red-600" },
  ];

  const getKYCBadge = (status: string) => {
    const styles = {
      approved: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
      pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
      rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
      inactive: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      suspended: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agent Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Tsumi Agents and KYC approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/agents?kyc=pending"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Review KYC (15)
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
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
                placeholder="Search by name, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* KYC Status Filter */}
          <select
            value={filterKYC}
            onChange={(e) => setFilterKYC(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All KYC Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Errands
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Badges
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {agents.map((agent) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <Link
                          href={`/admin/agents/${agent.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600"
                        >
                          {agent.name}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {agent.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium uppercase ${getKYCBadge(
                        agent.kycStatus
                      )}`}
                    >
                      {agent.kycStatus}
                    </span>
                    {agent.kycStatus === "pending" && (
                      <Link
                        href={`/admin/agents/${agent.id}/kyc`}
                        className="ml-2 text-xs text-purple-600 hover:underline"
                      >
                        Review
                      </Link>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium uppercase ${getStatusBadge(
                        agent.status
                      )}`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.rating > 0 ? agent.rating.toFixed(1) : "-"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {agent.completionRate}% complete • {agent.responseTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {agent.totalErrands}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₵{agent.earnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {agent.badges.length > 0 ? (
                        <>
                          {agent.badges.slice(0, 2).map((badge) => (
                            <div
                              key={badge}
                              className="w-6 h-6 bg-blue-100 dark:bg-blue-950 flex items-center justify-center"
                              title={badge}
                            >
                              <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                          ))}
                          {agent.badges.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{agent.badges.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">No badges</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1 to {agents.length} of 1,234 agents
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

