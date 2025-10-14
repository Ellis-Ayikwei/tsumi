"use client";

import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Package, 
  AlertTriangle, 
  Shield, 
  BarChart3,
  Settings,
  LogIn
} from "lucide-react";

export default function AdminHome() {
  const adminFeatures = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage users, agents, and customer accounts",
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      icon: UserCheck,
      title: "Agent Management",
      description: "Verify agents, manage KYC, and monitor performance",
      href: "/admin/agents",
      color: "bg-green-500"
    },
    {
      icon: Package,
      title: "Errand Management",
      description: "Monitor errands, track deliveries, and handle issues",
      href: "/admin/errands",
      color: "bg-purple-500"
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      description: "Handle disputes, refunds, and customer complaints",
      href: "/admin/disputes",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Escrow Management",
      description: "Monitor payments, escrow funds, and transactions",
      href: "/admin/escrow",
      color: "bg-red-500"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "View platform metrics, revenue, and performance data",
      href: "/admin/reports",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tsumi Admin
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                Platform Management
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/settings"
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Tsumi Admin
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your platform operations, users, and business metrics from this centralized dashboard.
          </p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.href}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,234</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">456</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">789</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Errands Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Disputes</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}