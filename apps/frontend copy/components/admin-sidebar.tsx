"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  AlertCircle,
  Settings,
  BarChart3,
  Shield,
  Bell,
  FileText,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Agents", href: "/admin/agents", icon: Package },
    { name: "Errands", href: "/admin/errands", icon: FileText },
    { name: "Escrow", href: "/admin/escrow", icon: Wallet },
    { name: "Disputes", href: "/admin/disputes", icon: AlertCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-gray-900 dark:bg-black border-r border-gray-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            <span className="text-lg font-bold text-white">Tsumi Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title={collapsed ? "Profile" : undefined}
        >
          <UserCog className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Profile</span>}
        </Link>
        <button
          onClick={() => {
            // TODO: Implement logout
            console.log("Logging out...");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

