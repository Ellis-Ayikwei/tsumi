"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  MapPin,
  User,
  Calendar,
  Eye,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState("active");

  const activeEscrows = [
    {
      id: "ESC-001",
      errandId: "ERR-001",
      amount: 50,
      customer: "Kwame Mensah",
      agent: "Ama Serwaa",
      description: "Pick up documents from Ridge office",
      status: "held",
      createdAt: "2024-01-15T11:15:00Z",
      expectedCompletion: "2024-01-15T16:00:00Z",
      location: "Ridge, Accra",
    },
    {
      id: "ESC-002",
      errandId: "ERR-002",
      amount: 75,
      customer: "Akosua Osei",
      agent: "Kofi Asante",
      description: "Grocery shopping at Shoprite",
      status: "in_progress",
      createdAt: "2024-01-16T09:30:00Z",
      expectedCompletion: "2024-01-16T12:00:00Z",
      location: "Shoprite, Accra Mall",
    },
  ];

  const completedEscrows = [
    {
      id: "ESC-003",
      errandId: "ERR-003",
      amount: 30,
      customer: "Yaw Boateng",
      agent: "Efua Mensah",
      description: "Bank deposit at GCB",
      status: "released",
      createdAt: "2024-01-14T14:00:00Z",
      completedAt: "2024-01-14T15:30:00Z",
      location: "GCB Bank, Osu",
    },
    {
      id: "ESC-004",
      errandId: "ERR-004",
      amount: 100,
      customer: "Adwoa Frimpong",
      agent: "Kwaku Appiah",
      description: "Package delivery to East Legon",
      status: "refunded",
      createdAt: "2024-01-13T10:00:00Z",
      completedAt: "2024-01-13T11:00:00Z",
      location: "East Legon, Accra",
      refundReason: "Customer cancellation",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "held":
        return Clock;
      case "in_progress":
        return Package;
      case "released":
        return CheckCircle;
      case "refunded":
        return AlertCircle;
      default:
        return Shield;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "held":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950";
      case "in_progress":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950";
      case "released":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-100";
      case "refunded":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-950";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "held":
        return "Funds Held";
      case "in_progress":
        return "In Progress";
      case "released":
        return "Released";
      case "refunded":
        return "Refunded";
      default:
        return "Unknown";
    }
  };

  const totalHeld = activeEscrows.reduce((sum, escrow) => sum + escrow.amount, 0);
  const totalReleased = completedEscrows
    .filter(escrow => escrow.status === "released")
    .reduce((sum, escrow) => sum + escrow.amount, 0);
  const totalRefunded = completedEscrows
    .filter(escrow => escrow.status === "refunded")
    .reduce((sum, escrow) => sum + escrow.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/wallet" userName="Kwame Mensah" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/wallet"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Escrow Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your held and released funds
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Currently Held</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₵{totalHeld.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Released</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₵{totalReleased.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Refunded</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₵{totalRefunded.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-950 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "active"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Active Escrows ({activeEscrows.length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "completed"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Completed ({completedEscrows.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "active" ? (
                <div className="space-y-4">
                  {activeEscrows.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Active Escrows
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your active escrow transactions will appear here
                      </p>
                    </div>
                  ) : (
                    activeEscrows.map((escrow) => {
                      const StatusIcon = getStatusIcon(escrow.status);
                      return (
                        <div
                          key={escrow.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${getStatusColor(escrow.status)}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {escrow.description}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {escrow.agent}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {escrow.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(escrow.expectedCompletion).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                ₵{escrow.amount.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(escrow.status)}`}>
                                  {getStatusText(escrow.status)}
                                </span>
                              </div>
                              <Link
                                href={`/errands/${escrow.errandId}`}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {completedEscrows.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Completed Escrows
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your completed escrow transactions will appear here
                      </p>
                    </div>
                  ) : (
                    completedEscrows.map((escrow) => {
                      const StatusIcon = getStatusIcon(escrow.status);
                      return (
                        <div
                          key={escrow.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${getStatusColor(escrow.status)}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {escrow.description}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {escrow.agent}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {escrow.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Completed {new Date(escrow.completedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {escrow.refundReason && (
                                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    Reason: {escrow.refundReason}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                ₵{escrow.amount.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(escrow.status)}`}>
                                  {getStatusText(escrow.status)}
                                </span>
                              </div>
                              <Link
                                href={`/errands/${escrow.errandId}`}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  TsumiSafe Escrow Protection
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your funds are held securely in escrow until errands are completed. This protects both customers and runners, ensuring fair transactions and dispute resolution.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
