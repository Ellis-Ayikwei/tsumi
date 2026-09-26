"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Wallet, History, Bell, User as UserIcon, ChevronDown, Users, Package, Shield, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface NavigationProps {
  currentPage?: string;
  userName?: string;
  currentRole?: "customer" | "agent" | "admin";
}

export function Navigation({ currentPage, userName = "User", currentRole = "customer" }: NavigationProps) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/errands", label: "My Errands", icon: Package },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/history", label: "History", icon: History },
  ];

  const roles = [
    {
      value: "customer",
      label: "Customer",
      icon: Users,
      description: "Request errands",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      value: "agent",
      label: "Tsumi Runner",
      icon: Package,
      description: "Complete errands",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  const currentRoleInfo = roles.find((r) => r.value === currentRole) || roles[0];
  const CurrentRoleIcon = currentRoleInfo.icon;

  const handleRoleSwitch = (role: string) => {
    setIsRoleDropdownOpen(false);
    
    // Navigate to the appropriate dashboard based on role
    switch (role) {
      case "customer":
        router.push("/dashboard");
        break;
      case "agent":
        router.push("/agent");
        break;
      default:
        router.push("/dashboard");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
                Tsumi
              </h1>
            </Link>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all rounded-lg"
              >
                <CurrentRoleIcon className={`w-4 h-4 ${currentRoleInfo.color}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentRoleInfo.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isRoleDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isRoleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden z-20 rounded-lg">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Switch Role
                      </div>
                      {roles.map((role) => {
                        const Icon = role.icon;
                        const isActive = role.value === currentRole;

                        return (
                          <button
                            key={role.value}
                            onClick={() => handleRoleSwitch(role.value)}
                            className={`w-full flex items-start gap-3 px-3 py-3 transition-all rounded-md ${
                              isActive
                                ? "bg-gray-100 dark:bg-gray-800"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0 ${
                                isActive ? "ring-2 ring-gray-900 dark:ring-white" : ""
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${role.color}`} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                {role.label}
                                {isActive && (
                                  <span className="px-2 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-full">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {role.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 font-medium transition-all rounded-lg ${
                    isActive
                      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
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

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors rounded-lg">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-semibold hover:opacity-90 transition-opacity">
                {userName.charAt(0)}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

