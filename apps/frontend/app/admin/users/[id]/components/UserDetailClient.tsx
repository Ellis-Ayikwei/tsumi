"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Shield, Wallet, Star, Package, Ban, CheckCircle, Edit, MoreVertical, Clock, TrendingUp, AlertCircle, MessageSquare, User } from "lucide-react";

interface UserDetailClientProps {
  id: string;
}

export default function UserDetailClient({ id }: UserDetailClientProps) {
  // Mock data
  const user = {
    id: id,
    name: "Kwame Mensah",
    email: "kwame@example.com",
    phone: "+233 24 123 4567",
    userType: "customer",
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    kycVerified: true,
    trustScore: 85,
    totalErrands: 12,
    completedErrands: 11,
    averageRating: 4.8,
    joinedDate: "2023-08-15",
    lastActive: "2 hours ago",
    address: "East Legon, Accra, Ghana",
    stats: {
      totalSpent: 540,
      averageOrderValue: 45,
      repeatRate: 75,
      responseTime: "2 min",
    },
    recentErrands: [
      {
        id: "ERR-12345",
        title: "Pick up documents from Ridge",
        status: "completed",
        amount: 45,
        date: "2024-06-15",
      },
      {
        id: "ERR-12344",
        title: "Grocery shopping",
        status: "completed",
        amount: 120,
        date: "2024-06-14",
      },
      {
        id: "ERR-12343",
        title: "Deliver package",
        status: "cancelled",
        amount: 80,
        date: "2024-06-13",
      },
    ],
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                  <span className={`px-3 py-1 text-xs font-medium uppercase ${
                    user.userType === "customer"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                      : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  }`}>
                    {user.userType}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium uppercase ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                    {user.emailVerified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                    {user.phoneVerified && <CheckCircle className="w-4 h-4 text-green-600" />}
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
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.trustScore}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Trust Score
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Rating</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user.averageRating}/5
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(user.averageRating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Errands */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Errands
            </h3>
            <div className="space-y-3">
              {user.recentErrands.map((errand) => (
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
                      <span className={`px-2 py-0.5 text-xs font-medium uppercase ${
                        errand.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}>
                        {errand.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {errand.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {errand.date}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Errands
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.totalErrands}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Completed
                </div>
                <div className="text-xl font-semibold text-green-600">
                  {user.completedErrands}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Spent
                </div>
                <div className="text-xl font-semibold text-blue-600">
                  ₵{user.stats.totalSpent}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Avg Order Value
                </div>
                <div className="text-xl font-semibold text-purple-600">
                  ₵{user.stats.averageOrderValue}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Verification Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                {user.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Phone</span>
                {user.phoneVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">KYC</span>
                {user.kycVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                View Transaction History
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                Export User Data
              </button>
              <button className="w-full px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors text-sm text-left">
                Suspend User
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm text-left">
                Ban Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

