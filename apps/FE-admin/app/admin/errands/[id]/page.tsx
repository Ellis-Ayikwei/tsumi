"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
  Package,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation as NavigationIcon,
  Image as ImageIcon,
  FileText,
  Star,
  Ban,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";

export default function AdminErrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [errandId, setErrandId] = useState<string>("");

  // Resolve params when component mounts
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setErrandId(resolvedParams.id);
    });
  }, [params]);

  // Mock data - will be replaced with API call
  const errand = {
    id: errandId,
    title: "Pick up documents from Ridge office",
    description: "Need someone to pick up important business documents from my office in Ridge and deliver to my home in East Legon. Documents are in a sealed envelope at reception.",
    type: "pickup",
    status: "completed",
    priority: "normal",
    customer: {
      id: "1",
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      email: "kwame@example.com",
      rating: 4.8,
      totalErrands: 45,
    },
    agent: {
      id: "2",
      name: "Ama Serwaa",
      phone: "+233 24 234 5678",
      email: "ama@example.com",
      rating: 4.9,
      totalErrands: 245,
    },
    pickup: {
      address: "123 Ridge Road, Ridge, Accra",
      coordinates: { lat: 5.6037, lng: -0.1870 },
      instructions: "Ask for envelope at reception desk",
    },
    dropoff: {
      address: "456 East Legon Street, East Legon, Accra",
      coordinates: { lat: 5.6508, lng: -0.1821 },
      instructions: "Ring doorbell, hand to person directly",
    },
    payment: {
      amount: 45,
      commission: 6.75,
      agentEarnings: 38.25,
      tip: 5,
      total: 50,
      method: "TsumiSafe Escrow",
      status: "completed",
    },
    timeline: [
      { status: "created", timestamp: "2024-06-15 10:30 AM", note: "Errand created by customer" },
      { status: "matched", timestamp: "2024-06-15 10:32 AM", note: "Matched with Ama Serwaa" },
      { status: "accepted", timestamp: "2024-06-15 10:33 AM", note: "Agent accepted errand" },
      { status: "started", timestamp: "2024-06-15 10:40 AM", note: "Agent started journey" },
      { status: "picked_up", timestamp: "2024-06-15 10:55 AM", note: "Item picked up" },
      { status: "in_transit", timestamp: "2024-06-15 10:56 AM", note: "In transit to dropoff" },
      { status: "delivered", timestamp: "2024-06-15 11:12 AM", note: "Successfully delivered" },
      { status: "completed", timestamp: "2024-06-15 11:15 AM", note: "Customer confirmed completion" },
    ],
    proofOfDelivery: {
      photos: [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400",
      ],
      signature: true,
      otp: "1234",
      notes: "Delivered to customer at home. Package in good condition.",
    },
    createdAt: "2024-06-15 10:30 AM",
    completedAt: "2024-06-15 11:15 AM",
    duration: "45 minutes",
    distance: "8.5 km",
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Clock },
      matched: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: User },
      accepted: { badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400", icon: CheckCircle },
      in_progress: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: Package },
      completed: { badge: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400", icon: CheckCircle },
      cancelled: { badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", icon: XCircle },
      disputed: { badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400", icon: AlertCircle },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const statusConfig = getStatusConfig(errand.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/errands"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Errand Details</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {errand.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm font-medium uppercase ${statusConfig.badge}`}>
            {errand.status}
          </span>
          <button className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors text-sm">
            Cancel Errand
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm">
            Reassign Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Errand Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Errand Information
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {errand.title}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</div>
                <div className="text-gray-900 dark:text-white">{errand.description}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</div>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase">
                    {errand.type}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Distance</div>
                  <div className="font-medium text-gray-900 dark:text-white">{errand.distance}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</div>
                  <div className="font-medium text-gray-900 dark:text-white">{errand.duration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </h3>
              <div className="space-y-3">
                <Link href={`/admin/users/${errand.customer.id}`} className="block">
                  <div className="font-semibold text-gray-900 dark:text-white hover:text-purple-600">
                    {errand.customer.name}
                  </div>
                </Link>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {errand.customer.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {errand.customer.rating} ({errand.customer.totalErrands} errands)
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Contact Customer
                </button>
              </div>
            </div>

            {/* Agent */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Agent
              </h3>
              <div className="space-y-3">
                <Link href={`/admin/agents/${errand.agent.id}`} className="block">
                  <div className="font-semibold text-gray-900 dark:text-white hover:text-purple-600">
                    {errand.agent.name}
                  </div>
                </Link>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {errand.agent.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {errand.agent.rating} ({errand.agent.totalErrands} errands)
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Route Details</h2>
            <div className="space-y-4">
              {/* Pickup */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Pickup Location
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {errand.pickup.address}
                  </div>
                  {errand.pickup.instructions && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-2">
                      <strong>Instructions:</strong> {errand.pickup.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Dropoff Location
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {errand.dropoff.address}
                  </div>
                  {errand.dropoff.instructions && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-2">
                      <strong>Instructions:</strong> {errand.dropoff.instructions}
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-2">
                <NavigationIcon className="w-4 h-4" />
                View on Map
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              {errand.timeline.map((event, index) => {
                const eventConfig = getStatusConfig(event.status);
                const EventIcon = eventConfig.icon;

                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                        <EventIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      {index < errand.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {event.status.replace("_", " ")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {event.timestamp}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proof of Delivery */}
          {errand.proofOfDelivery && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Proof of Delivery
              </h2>
              <div className="space-y-4">
                {errand.proofOfDelivery.photos && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photos
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {errand.proofOfDelivery.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-48 object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errand.proofOfDelivery.otp && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OTP Verified
                    </div>
                    <div className="px-3 py-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-sm font-mono">
                      {errand.proofOfDelivery.otp}
                    </div>
                  </div>
                )}
                {errand.proofOfDelivery.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Agent Notes
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {errand.proofOfDelivery.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Errand Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₵{errand.payment.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tip</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₵{errand.payment.tip}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  ₵{errand.payment.total}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Platform Commission (15%)</span>
                  <span className="text-gray-900 dark:text-white">₵{errand.payment.commission}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Agent Earnings</span>
                  <span className="text-green-600 font-medium">₵{errand.payment.agentEarnings}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Method</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {errand.payment.method}
                </div>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs">
                  {errand.payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left">
                View GPS Tracking
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left">
                View Chat History
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left">
                Download Receipt
              </button>
              <button className="w-full px-4 py-2 bg-yellow-600 text-white text-sm hover:bg-yellow-700 transition-colors text-left">
                Reassign Agent
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors text-left">
                Cancel Errand
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Metadata
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">{errand.createdAt}</span>
              </div>
              {errand.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-gray-900 dark:text-white">{errand.completedAt}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="text-gray-900 dark:text-white">{errand.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distance</span>
                <span className="text-gray-900 dark:text-white">{errand.distance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

