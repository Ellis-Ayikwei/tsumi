"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  User,
  Package,
  DollarSign,
  Clock,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  Scale,
  Send,
} from "lucide-react";
import React, { useState } from "react";

export default function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolution, setResolution] = useState("");
  const [message, setMessage] = useState("");
  const [disputeId, setDisputeId] = useState<string>("");

  // Resolve params when component mounts
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setDisputeId(resolvedParams.id);
    });
  }, [params]);

  // Mock data - will be replaced with API call
  const dispute = {
    id: disputeId,
    errandId: "ERR-12349",
    title: "Payment not received",
    category: "payment",
    status: "investigating",
    priority: "high",
    filedBy: {
      role: "agent",
      name: "Kweku Darko",
      id: "5",
      phone: "+233 24 789 0123",
      email: "kweku@example.com",
    },
    filedAgainst: {
      role: "customer",
      name: "Grace Addo",
      id: "6",
      phone: "+233 24 890 1234",
      email: "grace@example.com",
    },
    amount: 55,
    description: "I completed the delivery successfully and customer confirmed receipt, but payment was not released from escrow. It's been 48 hours since completion.",
    evidence: {
      agentSubmission: {
        description: "Completed delivery on time with photo proof. Customer confirmed delivery via OTP but payment still held in escrow.",
        photos: [
          "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400",
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
        ],
        timestamp: "2024-06-15 03:00 PM",
      },
      customerResponse: {
        description: "I did receive the package but it was damaged upon arrival. I tried to contact agent but got no response.",
        photos: [
          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
        ],
        timestamp: "2024-06-15 05:30 PM",
      },
    },
    timeline: [
      { action: "Dispute Filed", by: "Kweku Darko", timestamp: "2024-06-15 03:00 PM" },
      { action: "Customer Responded", by: "Grace Addo", timestamp: "2024-06-15 05:30 PM" },
      { action: "Admin Review Started", by: "System", timestamp: "2024-06-15 06:00 PM" },
      { action: "Status Changed to Investigating", by: "Admin", timestamp: "2024-06-15 06:15 PM" },
    ],
    messages: [
      {
        id: "1",
        from: "Admin",
        to: "Kweku Darko",
        message: "We are reviewing your case. Can you provide more details about the delivery condition?",
        timestamp: "2024-06-15 06:20 PM",
      },
      {
        id: "2",
        from: "Kweku Darko",
        to: "Admin",
        message: "Package was intact when I delivered. Customer signed for it without mentioning any damage.",
        timestamp: "2024-06-15 07:00 PM",
      },
    ],
    errandDetails: {
      title: "Food pickup from restaurant",
      type: "pickup",
      status: "completed",
      completedAt: "2024-06-15 12:40 PM",
      pickup: "KFC, Tema",
      dropoff: "Community 2, Tema",
    },
    createdAt: "2024-06-15 03:00 PM",
    lastUpdated: "2024-06-15 07:00 PM",
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      urgent: { badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", dot: "bg-red-600" },
      high: { badge: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400", dot: "bg-orange-600" },
      medium: { badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400", dot: "bg-yellow-600" },
      low: { badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", dot: "bg-gray-600" },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      open: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
      investigating: { badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" },
      resolved: { badge: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
      closed: { badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  const priorityConfig = getPriorityConfig(dispute.priority);
  const statusConfig = getStatusConfig(dispute.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/disputes"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dispute Details</h1>
            <p className="text-gray-600 dark:text-gray-400">Dispute ID: {dispute.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />
          <span className={`px-3 py-1 text-sm font-medium uppercase ${priorityConfig.badge}`}>
            {dispute.priority}
          </span>
          <span className={`px-3 py-1 text-sm font-medium uppercase ${statusConfig.badge}`}>
            {dispute.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dispute.title}
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
                    {dispute.category}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount in Question: <strong className="text-gray-900 dark:text-white">₵{dispute.amount}</strong>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dispute.description}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>Filed: {dispute.createdAt}</div>
              <div>Last Updated: {dispute.lastUpdated}</div>
              <Link href={`/admin/errands/${dispute.errandId}`} className="text-purple-600 hover:underline">
                View Errand →
              </Link>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filed By */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Filed By ({dispute.filedBy.role})
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/admin/${dispute.filedBy.role === "agent" ? "agents" : "users"}/${dispute.filedBy.id}`}
                  className="block font-semibold text-gray-900 dark:text-white hover:text-purple-600"
                >
                  {dispute.filedBy.name}
                </Link>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dispute.filedBy.phone}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dispute.filedBy.email}
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>

            {/* Filed Against */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Filed Against ({dispute.filedAgainst.role})
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/admin/${dispute.filedAgainst.role === "agent" ? "agents" : "users"}/${dispute.filedAgainst.id}`}
                  className="block font-semibold text-gray-900 dark:text-white hover:text-purple-600"
                >
                  {dispute.filedAgainst.name}
                </Link>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dispute.filedAgainst.phone}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dispute.filedAgainst.email}
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Evidence Submitted
            </h2>
            
            {/* Agent Submission */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Agent Submission
                </h3>
                <span className="text-xs text-gray-500">{dispute.evidence.agentSubmission.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {dispute.evidence.agentSubmission.description}
              </p>
              {dispute.evidence.agentSubmission.photos && (
                <div className="grid grid-cols-2 gap-3">
                  {dispute.evidence.agentSubmission.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Agent evidence ${index + 1}`}
                      className="w-full h-32 object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Customer Response */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Customer Response
                </h3>
                <span className="text-xs text-gray-500">{dispute.evidence.customerResponse.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {dispute.evidence.customerResponse.description}
              </p>
              {dispute.evidence.customerResponse.photos && (
                <div className="grid grid-cols-2 gap-3">
                  {dispute.evidence.customerResponse.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Customer evidence ${index + 1}`}
                      className="w-full h-32 object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Communication Thread */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Messages
            </h2>
            <div className="space-y-4 mb-4">
              {dispute.messages.map((msg) => (
                <div key={msg.id} className="bg-gray-50 dark:bg-gray-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {msg.from} → {msg.to}
                    </span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Send Message */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Send a message to parties..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="mt-2 w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline
            </h2>
            <div className="space-y-3">
              {dispute.timeline.map((event, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{event.action}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {event.by} • {event.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Related Errand */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related Errand
            </h3>
            <div className="space-y-3">
              <Link
                href={`/admin/errands/${dispute.errandId}`}
                className="text-sm font-mono font-medium text-purple-600 hover:underline"
              >
                {dispute.errandId}
              </Link>
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  {dispute.errandDetails.title}
                </div>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {dispute.errandDetails.pickup}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {dispute.errandDetails.dropoff}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Completed: {dispute.errandDetails.completedAt}
                  </div>
                </div>
              </div>
              <Link
                href={`/admin/errands/${dispute.errandId}`}
                className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                View Full Errand
              </Link>
            </div>
          </div>

          {/* Resolution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Resolution
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium text-left flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resolve in Favor of Agent
              </button>
              <button className="w-full px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium text-left flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resolve in Favor of Customer
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium text-left flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Partial Resolution (Split)
              </button>
              <button className="w-full px-4 py-3 bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm font-medium text-left flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Close Without Resolution
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                placeholder="Add resolution details and reasoning..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Notes (Internal)
            </h3>
            <textarea
              rows={4}
              placeholder="Add internal notes visible only to admins..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="mt-2 w-full px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

