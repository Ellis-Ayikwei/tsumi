"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Wallet,
  Star,
  Package,
  Ban,
  CheckCircle,
  Edit,
  MoreVertical,
  Clock,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  User,
} from "lucide-react";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  // Mock data - will be replaced with API call
  const user = {
    id: params.id,
    name: "Kwame Mensah",
    email: "kwame@example.com",
    phone: "+233 24 123 4567",
    role: "customer",
    status: "active",
    verified: {
      email: true,
      phone: true,
      id: false,
    },
    avatar: null,
    trustScore: 0.92,
    totalErrands: 45,
    walletBalance: 2500,
    joinedDate: "2024-01-15",
    lastActive: "2 hours ago",
    address: "East Legon, Accra, Ghana",
    badges: ["Verified Email", "Verified Phone", "Regular User"],
    stats: {
      completed: 42,
      cancelled: 3,
      disputed: 0,
      avgRating: 4.8,
      totalSpent: 3450,
    },
  };

  const recentErrands = [
    {
      id: "ERR-12345",
      title: "Pick up documents from Ridge office",
      status: "completed",
      amount: 45,
      agent: "Ama Serwaa",
      date: "2024-06-15",
    },
    {
      id: "ERR-12344",
      title: "Grocery shopping at MaxMart",
      status: "completed",
      amount: 120,
      agent: "Kofi Asante",
      date: "2024-06-14",
    },
    {
      id: "ERR-12343",
      title: "Deliver package to Tema",
      status: "cancelled",
      amount: 80,
      agent: "Abena Mensah",
      date: "2024-06-13",
    },
  ];

  const transactions = [
    { id: "1", type: "deposit", amount: 500, date: "2024-06-15", status: "completed" },
    { id: "2", type: "payment", amount: -45, date: "2024-06-15", status: "completed" },
    { id: "3", type: "payment", amount: -120, date: "2024-06-14", status: "completed" },
    { id: "4", type: "deposit", amount: 2000, date: "2024-06-10", status: "completed" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
      suspended: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
      banned: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors">
            <Ban className="w-4 h-4" />
            Suspend User
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-medium uppercase ${getStatusBadge(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
                    {user.role}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                    {user.verified.email && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                    {user.verified.phone && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {user.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {user.joinedDate} • Last active {user.lastActive}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trust Score
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(user.trustScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                  style={{ width: `${user.trustScore * 100}%` }}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {user.stats.completed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {user.stats.cancelled}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Cancelled</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {user.stats.disputed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Disputed</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {user.stats.avgRating}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
          </div>

          {/* Recent Errands */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Errands
              </h3>
              <Link href={`/admin/errands?user=${user.id}`} className="text-sm text-purple-600 hover:text-purple-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentErrands.map((errand) => (
                <Link
                  key={errand.id}
                  href={`/admin/errands/${errand.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-medium text-purple-600">
                        {errand.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium uppercase ${
                          errand.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                        }`}
                      >
                        {errand.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {errand.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Agent: {errand.agent} • {errand.date}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₵{errand.amount}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Wallet */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wallet</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ₵{user.walletBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Total Spent: ₵{user.stats.totalSpent.toLocaleString()}
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm">
                Adjust Balance
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                View Transactions
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {txn.type}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{txn.date}</div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      txn.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.amount > 0 ? "+" : ""}₵{Math.abs(txn.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                Reset Password
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                View Login History
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                Export User Data
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm text-left">
                Ban User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


