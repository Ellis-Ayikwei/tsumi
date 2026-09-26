"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  User,
  Star,
  Award,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Camera,
  Upload,
  Download,
  Share,
  Settings,
  Bell,
  CreditCard,
  FileText,
  Calendar,
  TrendingUp,
  Target,
  Zap,
  Heart,
  MessageSquare,
} from "lucide-react";

export default function AgentProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const agentProfile = {
    id: "AGENT-001",
    name: "Ama Serwaa",
    email: "ama.serwaa@example.com",
    phone: "+233 24 234 5678",
    location: "Accra, Ghana",
    joinDate: "2024-01-15",
    status: "active",
    rating: 4.9,
    totalReviews: 245,
    totalJobs: 624,
    totalEarnings: 45600,
    completionRate: 98.5,
    responseTime: "2 mins",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    kycStatus: "verified",
    bankDetails: {
      bankName: "GCB Bank",
      accountNumber: "****1234",
      accountName: "Ama Serwaa",
    },
  };

  const badges = [
    {
      id: "verified_id",
      name: "Verified ID",
      description: "Government ID verified",
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950",
      earned: true,
      earnedDate: "2024-01-20",
    },
    {
      id: "reliable_runner",
      name: "Reliable Runner",
      description: "10+ errands with 4.5⭐+ rating",
      icon: Star,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-950",
      earned: true,
      earnedDate: "2024-02-15",
    },
    {
      id: "great_communicator",
      name: "Great Communicator",
      description: "5+ positive chat feedback",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-950",
      earned: true,
      earnedDate: "2024-03-10",
    },
    {
      id: "pro_runner",
      name: "Pro Runner",
      description: "Admin-verified & trained",
      icon: Award,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-950",
      earned: true,
      earnedDate: "2024-04-05",
    },
    {
      id: "community_favorite",
      name: "Community Favorite",
      description: "10+ returning clients",
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-950",
      earned: true,
      earnedDate: "2024-05-20",
    },
    {
      id: "elite_agent",
      name: "Elite Tsumi Runner",
      description: "Top-tier performer",
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-950",
      earned: true,
      earnedDate: "2024-06-01",
    },
  ];

  const recentReviews = [
    {
      id: "review-1",
      customer: "Kwame Mensah",
      rating: 5,
      comment: "Excellent service! Ama was very professional and delivered on time. Highly recommended!",
      date: "2024-06-14",
      job: "Document pickup",
    },
    {
      id: "review-2",
      customer: "Grace Addo",
      rating: 5,
      comment: "Very reliable and communicative. Will definitely use her services again.",
      date: "2024-06-13",
      job: "Grocery delivery",
    },
    {
      id: "review-3",
      customer: "Kofi Darko",
      rating: 4,
      comment: "Good service overall. Minor delay but handled professionally.",
      date: "2024-06-12",
      job: "Food delivery",
    },
  ];

  const stats = [
    {
      label: "Total Jobs",
      value: agentProfile.totalJobs,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Completion Rate",
      value: `${agentProfile.completionRate}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Average Rating",
      value: agentProfile.rating,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      label: "Response Time",
      value: agentProfile.responseTime,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-950",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "badges", label: "Badges", icon: Award },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile, badges, and account settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Share className="w-4 h-4" />
            Share Profile
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={agentProfile.profileImage}
              alt={agentProfile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {agentProfile.name}
              </h2>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full">
                {agentProfile.status}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full">
                {agentProfile.kycStatus}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{agentProfile.rating}</span>
                <span>({agentProfile.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{agentProfile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(agentProfile.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-6 h-6 text-gray-700 dark:text-gray-300`} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-8">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agentProfile.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agentProfile.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Bank Details
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {agentProfile.bankDetails.bankName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {agentProfile.bankDetails.accountNumber} • {agentProfile.bankDetails.accountName}
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₵{agentProfile.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {agentProfile.totalJobs}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Completed</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {agentProfile.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "badges" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trust Badges ({badges.filter(b => b.earned).length}/{badges.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border border-gray-200 dark:border-gray-800 rounded-xl ${
                        badge.earned ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-gray-700 dark:text-gray-300`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {badge.name}
                          </div>
                          {badge.earned && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Earned {new Date(badge.earnedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </div>
                      {badge.earned && (
                        <div className="mt-3 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Verified
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Reviews ({agentProfile.totalReviews})
              </h3>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {review.customer}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {review.job} • {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Receive job alerts and updates
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        SMS Notifications
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Get text messages for urgent jobs
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Location Sharing
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Share location with customers during jobs
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Profile Visibility
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Make profile visible to customers
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Earnings Privacy
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hide earnings from other runners
                      </div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
