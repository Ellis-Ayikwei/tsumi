"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  DollarSign,
  Calendar,
  Package,
  User,
  History,
  Settings,
  Bell,
  MapPin,
  TrendingUp,
  Award,
  Clock,
  ChevronDown,
  Users as UsersIcon,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const roles = [
    { value: "customer", label: "Customer", icon: UsersIcon },
    { value: "agent", label: "Tsumi Agent", icon: Package },
    { value: "admin", label: "Admin", icon: Shield },
  ];

  const navItems = [
    { href: "/agent", label: "Dashboard", icon: Home },
    { href: "/agent/jobs", label: "Available Jobs", icon: Package },
    { href: "/agent/earnings", label: "Earnings", icon: DollarSign },
    { href: "/agent/schedule", label: "Schedule", icon: Calendar },
    { href: "/agent/history", label: "History", icon: History },
    { href: "/agent/profile", label: "Profile", icon: User },
    { href: "/agent/settings", label: "Settings", icon: Settings },
  ];

  const quickStats = [
    { label: "Today's Earnings", value: "₵245", icon: DollarSign },
    { label: "Active Jobs", value: "2", icon: Package },
    { label: "Rating", value: "4.9", icon: Award },
    { label: "Online Time", value: "6h 23m", icon: Clock },
  ];

  const handleRoleSwitch = (role: string) => {
    setIsRoleOpen(false);
    if (role === "customer") router.push("/dashboard");
    else if (role === "agent") router.push("/agent");
    else if (role === "admin") router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/agent">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
                  Tsumi Agent
                </h1>
              </Link>

              {/* Role Switcher (compact) */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white transition-colors rounded-lg"
                >
                  <Package className="w-4 h-4 text-gray-600" />
                  <span>Tsumi Agent</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 ${isRoleOpen ? "rotate-180" : ""}`} />
                </button>
                {isRoleOpen && (
                  <div className="absolute mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow z-20">
                    <div className="p-1">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isActive = r.value === "agent";
                        return (
                          <button
                            key={r.value}
                            onClick={() => handleRoleSwitch(r.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors ${
                              isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Icon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900 dark:text-white">{r.label}</span>
                            {isActive && (
                              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900">Active</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Online Status Toggle */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}
                >
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Icon className={`w-4 h-4 text-gray-600 dark:text-gray-400`} />
                      <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors rounded-lg">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <Link href="/agent/profile">
                <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-semibold hover:opacity-90 transition-opacity">
                  AS
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen sticky top-[73px]">
          <nav className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all rounded-xl ${
                      isActive
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Agent Stats Card */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white dark:text-gray-900" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Elite Agent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">4.9 ⭐ • 245 jobs</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="font-medium text-gray-900 dark:text-white">₵1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">This Month</span>
                    <span className="font-medium text-gray-900 dark:text-white">₵4,890</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <button className="w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                Update Location
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
