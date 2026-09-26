"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Badge,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Camera,
  FileText,
  Award,
  TrendingUp,
  Users,
  Target,
  Lock,
  Eye,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function TrustPage() {
  const [activeTab, setActiveTab] = useState("badges");

  const userTrustData = {
    trustScore: 0.92,
    level: "Elite",
    totalErrands: 156,
    averageRating: 4.9,
    badges: [
      {
        id: "verified_id",
        name: "Verified ID",
        description: "Ghana Card verification completed",
        icon: "🪪",
        category: "verification",
        earned: true,
        earnedAt: "2024-01-10T10:00:00Z",
        progress: 100,
      },
      {
        id: "reliable_runner",
        name: "Reliable Runner",
        description: "Complete 50+ errands with 4.5+ rating",
        icon: "🚗",
        category: "experience",
        earned: true,
        earnedAt: "2024-01-15T14:30:00Z",
        progress: 100,
      },
      {
        id: "great_communicator",
        name: "Great Communicator",
        description: "Maintain 4.8+ communication rating",
        icon: "💬",
        category: "performance",
        earned: true,
        earnedAt: "2024-01-12T16:45:00Z",
        progress: 100,
      },
      {
        id: "pro_runner",
        name: "Pro Runner",
        description: "Complete 100+ errands",
        icon: "🧾",
        category: "experience",
        earned: true,
        earnedAt: "2024-01-14T11:20:00Z",
        progress: 100,
      },
      {
        id: "community_favorite",
        name: "Community Favorite",
        description: "Top 10% rated runner in your area",
        icon: "🛡️",
        category: "performance",
        earned: false,
        progress: 85,
        requirements: "Be in top 10% of runners in Accra",
      },
      {
        id: "elite_agent",
        name: "Elite Tsumi Runner",
        description: "Achieve all other badges + 200+ errands",
        icon: "👑",
        category: "elite",
        earned: false,
        progress: 78,
        requirements: "Complete 200+ errands and earn all other badges",
      },
    ],
    kycStatus: {
      ghanaCard: "verified",
      phoneNumber: "verified",
      bankAccount: "pending",
      address: "verified",
    },
    verificationSteps: [
      {
        id: "ghana_card",
        title: "Ghana Card Verification",
        description: "Upload and verify your Ghana Card",
        status: "completed",
        icon: FileText,
        completedAt: "2024-01-10T10:00:00Z",
      },
      {
        id: "phone_verification",
        title: "Phone Number Verification",
        description: "Verify your phone number via SMS",
        status: "completed",
        icon: FileText,
        completedAt: "2024-01-10T10:15:00Z",
      },
      {
        id: "address_verification",
        title: "Address Verification",
        description: "Verify your residential address",
        status: "completed",
        icon: FileText,
        completedAt: "2024-01-10T10:30:00Z",
      },
      {
        id: "bank_account",
        title: "Bank Account Verification",
        description: "Link and verify your bank account",
        status: "pending",
        icon: FileText,
      },
      {
        id: "selfie_verification",
        title: "Selfie Verification",
        description: "Take a selfie to match with your ID",
        status: "pending",
        icon: Camera,
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950";
      case "failed":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-950";
    }
  };

  const getBadgeCategoryColor = (category: string) => {
    switch (category) {
      case "verification":
        return "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400";
      case "experience":
        return "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400";
      case "performance":
        return "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400";
      case "elite":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400";
    }
  };

  const earnedBadges = userTrustData.badges.filter(badge => badge.earned);
  const pendingBadges = userTrustData.badges.filter(badge => !badge.earned);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/trust" userName="Ama Serwaa" currentRole="agent" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trust & Verification
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Build trust and earn badges to stand out
              </p>
            </div>
          </div>

          {/* Trust Score Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Trust Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Trust score: {userTrustData.trustScore * 100}% • {userTrustData.level} Level
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {userTrustData.trustScore * 100}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Trust Score
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userTrustData.totalErrands}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Errands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userTrustData.averageRating}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {earnedBadges.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("badges")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "badges"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Trust Badges ({earnedBadges.length}/{userTrustData.badges.length})
                </button>
                <button
                  onClick={() => setActiveTab("verification")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "verification"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  KYC Verification
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "badges" ? (
                <div className="space-y-6">
                  {/* Earned Badges */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Earned Badges ({earnedBadges.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {earnedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{badge.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {badge.name}
                                </h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeCategoryColor(badge.category)}`}>
                                  {badge.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {badge.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                Earned {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Recently'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Badges */}
                  {pendingBadges.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Work in Progress ({pendingBadges.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-3xl opacity-50">{badge.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {badge.name}
                                  </h5>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeCategoryColor(badge.category)}`}>
                                    {badge.category}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {badge.description}
                                </p>
                                {badge.requirements && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    {badge.requirements}
                                  </p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                    <span className="text-gray-500 dark:text-gray-400">{badge.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all"
                                      style={{ width: `${badge.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        KYC Verification Steps
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Complete verification to increase your trust score
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userTrustData.verificationSteps.filter(step => step.status === "completed").length}/{userTrustData.verificationSteps.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userTrustData.verificationSteps.map((step, index) => {
                      const Icon = step.icon;
                      const StatusIcon = getStatusIcon(step.status);
                      return (
                        <div
                          key={step.id}
                          className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className={`p-3 rounded-lg ${getStatusColor(step.status)}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {step.title}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {step.description}
                            </p>
                            {step.completedAt && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Completed {new Date(step.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {step.status === "pending" && (
                              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                <Upload className="w-4 h-4" />
                                Start
                              </button>
                            )}
                            {step.status === "completed" && (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Verified
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Benefits of High Trust Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Priority Matching</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get matched with errands faster
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Customer Trust</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customers prefer verified runners
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Higher Rates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access to premium errands
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Recognition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stand out with trust badges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
