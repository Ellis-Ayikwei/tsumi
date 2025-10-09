"use client";

import { motion } from "framer-motion";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // Mock data - will be replaced with real API calls
  const stats = [
    {
      title: "Total Users",
      value: "12,453",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Active Agents",
      value: "1,234",
      change: "+8.3%",
      trend: "up",
      icon: Package,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Errands Today",
      value: "456",
      change: "+23.1%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Revenue Today",
      value: "₵45,230",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Escrow Holdings",
      value: "₵234,500",
      change: "+5.2%",
      trend: "up",
      icon: Shield,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
    {
      title: "Open Disputes",
      value: "23",
      change: "-12.5%",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
  ];

  const quickActions = [
    {
      title: "Pending KYC",
      count: 15,
      href: "/admin/agents?kyc=pending",
      icon: Shield,
      color: "bg-purple-600",
    },
    {
      title: "Urgent Disputes",
      count: 5,
      href: "/admin/disputes?priority=urgent",
      icon: AlertCircle,
      color: "bg-red-600",
    },
    {
      title: "Stuck Escrow",
      count: 8,
      href: "/admin/escrow?status=stuck",
      icon: Clock,
      color: "bg-yellow-600",
    },
  ];

  const recentActivity = [
    {
      type: "errand_completed",
      title: "Errand completed",
      description: "ERR-12345 • Kwame → Ama",
      time: "2 min ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      type: "user_signup",
      title: "New user registered",
      description: "Abena Osei from Accra",
      time: "5 min ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      type: "dispute_filed",
      title: "Dispute filed",
      description: "ERR-12340 • Payment issue",
      time: "12 min ago",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      type: "kyc_submitted",
      title: "KYC submitted",
      description: "Agent: Kofi Asante",
      time: "18 min ago",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      type: "errand_completed",
      title: "Errand completed",
      description: "ERR-12339 • Yaw → Grace",
      time: "25 min ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  const topAgents = [
    { name: "Ama Serwaa", errands: 245, rating: 4.9, earnings: "₵12,450" },
    { name: "Kofi Asante", errands: 232, rating: 4.8, earnings: "₵11,230" },
    { name: "Akua Osei", errands: 198, rating: 4.9, earnings: "₵10,100" },
    { name: "Kwame Mensah", errands: 187, rating: 4.7, earnings: "₵9,850" },
    { name: "Yaw Boateng", errands: 176, rating: 4.8, earnings: "₵9,320" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {action.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {action.title}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              href="/admin/activity"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Agents This Month
            </h2>
            <Link
              href="/admin/agents"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topAgents.map((agent, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {agent.errands} errands • ⭐ {agent.rating}
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {agent.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

