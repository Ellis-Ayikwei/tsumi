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
  Star,
  Package,
  Ban,
  CheckCircle,
  Award,
  Clock,
  TrendingUp,
  DollarSign,
  MessageSquare,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState } from "react";

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [agentId, setAgentId] = useState<string>("");

  // Resolve params when component mounts
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setAgentId(resolvedParams.id);
    });
  }, [params]);

  // Mock data
  const agent = {
    id: agentId,
    name: "Ama Serwaa",
    email: "ama@example.com",
    phone: "+233 24 234 5678",
    kycStatus: "approved",
    status: "active",
    rating: 4.9,
    totalErrands: 245,
    earnings: 12450,
    currentBalance: 3200,
    joinedDate: "2023-11-20",
    lastActive: "5 min ago",
    address: "Osu, Accra, Ghana",
    ghanaCardNumber: "GHA-123456789-0",
    badges: ["Verified ID", "Reliable Runner", "Great Communicator", "Pro Runner"],
    stats: {
      completed: 240,
      cancelled: 3,
      disputed: 2,
      completionRate: 98,
      responseTime: "3 min",
      repeatCustomers: 85,
    },
    documents: {
      idFront: "/images/id-front.jpg",
      idBack: "/images/id-back.jpg",
      selfie: "/images/selfie.jpg",
    },
  };

  const recentErrands = [
    {
      id: "ERR-12345",
      title: "Pick up documents from Ridge",
      customer: "Kwame Mensah",
      status: "completed",
      earnings: 45,
      rating: 5,
      date: "2024-06-15",
    },
    {
      id: "ERR-12344",
      title: "Grocery shopping",
      customer: "Akua Osei",
      status: "completed",
      earnings: 120,
      rating: 5,
      date: "2024-06-14",
    },
    {
      id: "ERR-12343",
      title: "Deliver package",
      customer: "Yaw Boateng",
      status: "cancelled",
      earnings: 0,
      rating: 0,
      date: "2024-06-13",
    },
  ];

  const reviews = [
    {
      id: "1",
      customer: "Kwame Mensah",
      rating: 5,
      comment: "Very professional and quick!",
      date: "2024-06-15",
    },
    {
      id: "2",
      customer: "Akua Osei",
      rating: 5,
      comment: "Great service, will use again",
      date: "2024-06-14",
    },
    {
      id: "3",
      customer: "Grace Addo",
      rating: 4,
      comment: "Good but arrived a bit late",
      date: "2024-06-12",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/agents"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agent Details</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {agent.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {agent.kycStatus === "pending" && (
            <Link
              href={`/admin/agents/${agent.id}/kyc`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Review KYC
            </Link>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors">
            <Ban className="w-4 h-4" />
            Suspend Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {agent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agent.name}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-medium uppercase ${
                      agent.kycStatus === "approved"
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                    }`}
                  >
                    KYC {agent.kycStatus}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium uppercase ${
                      agent.status === "active"
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {agent.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {agent.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Ghana Card: {agent.ghanaCardNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {agent.joinedDate} • Last active {agent.lastActive}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {agent.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {agent.totalErrands} errands
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {agent.stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${agent.stats.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Badges</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700">
                  Manage Badges
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {agent.badges.map((badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-medium"
                  >
                    <Award className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {agent.stats.completed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {agent.stats.cancelled}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Cancelled</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {agent.stats.responseTime}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {agent.stats.repeatCustomers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Repeat Customers</div>
            </div>
          </div>

          {/* Recent Errands */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Errands
            </h3>
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
                      Customer: {errand.customer} • {errand.date}
                      {errand.rating > 0 && (
                        <>
                          {" • "}
                          <Star className="w-3 h-3 inline text-yellow-500 fill-yellow-500" />
                          {errand.rating}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₵{errand.earnings}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Reviews
            </h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.customer}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {review.comment}
                  </p>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Earnings */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Earnings
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₵{agent.earnings.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Current Balance
                </div>
                <div className="text-xl font-semibold text-green-600">
                  ₵{agent.currentBalance.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm">
                Process Payout
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                View Payout History
              </button>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                KYC Documents
              </h3>
              <Link
                href={`/admin/agents/${agent.id}/kyc`}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Review
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Ghana Card (Front)</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Ghana Card (Back)</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Selfie Photo</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
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
                Assign Badge
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                View GPS History
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-left">
                Export Agent Data
              </button>
              <button className="w-full px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors text-sm text-left">
                Suspend Agent
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

