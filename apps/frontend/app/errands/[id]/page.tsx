"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ErrandDetailPage() {
  const params = useParams();
  const [showChat, setShowChat] = useState(false);

  // Mock data - will be replaced with API calls
  const errand = {
    id: params.id,
    title: "Pick up documents from Ridge office",
    description: "Need to collect signed contracts from the main office reception",
    status: "in_progress",
    errand_type: "pickup",
    pickup_address: "123 Liberation Rd, Ridge, Accra",
    delivery_address: "456 Oxford St, Osu, Accra",
    amount: 50.00,
    agent: {
      name: "Ama Serwaa",
      rating: 4.8,
      phone: "+233 24 123 4567",
      vehicle: "🏍️ Motorbike",
      badges: ["🪪", "🚗", "💬"],
      location: { lat: 5.6037, lng: -0.1870 },
    },
    timeline: [
      { status: "created", label: "Errand Created", time: "10:30 AM", completed: true },
      { status: "assigned", label: "Agent Assigned", time: "10:35 AM", completed: true },
      { status: "started", label: "En Route to Pickup", time: "10:40 AM", completed: true },
      { status: "pickup", label: "At Pickup Location", time: "11:05 AM", completed: false },
      { status: "delivery", label: "Delivering to You", time: "Pending", completed: false },
      { status: "completed", label: "Completed", time: "Pending", completed: false },
    ],
    created_at: "2025-10-08T10:30:00Z",
    eta: "15 mins",
  };

  const chatMessages = [
    { id: "1", sender: "agent", message: "On my way to the office now!", time: "10:40 AM" },
    { id: "2", sender: "customer", message: "Great! Please ask for Mrs. Addo at reception", time: "10:42 AM" },
    { id: "3", sender: "agent", message: "Will do. Almost there!", time: "10:55 AM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                ← Back
              </button>
            </Link>
            <Link href="/">
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Status Banner */}
          <div className="mb-6 bg-gradient-to-r from-electric-blue to-blue-600 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Status</div>
                <div className="text-2xl font-bold">In Progress</div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm mb-1">ETA</div>
                <div className="text-2xl font-bold">{errand.eta}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map View */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20">
                <h3 className="text-xl font-semibold mb-4">📍 Live Tracking</h3>
                <div className="h-96 bg-space rounded-lg border border-gray-700 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-gray-400">Google Maps Integration</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Live location: {errand.agent.location.lat.toFixed(4)}, {errand.agent.location.lng.toFixed(4)}
                    </p>
                  </div>
                  
                  {/* Animated Pulse */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-electric-blue rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-space rounded-lg">
                    <div className="text-gray-400 mb-1">Pickup</div>
                    <div className="font-semibold">{errand.pickup_address}</div>
                  </div>
                  <div className="p-3 bg-space rounded-lg">
                    <div className="text-gray-400 mb-1">Delivery</div>
                    <div className="font-semibold">{errand.delivery_address}</div>
                  </div>
                </div>
              </div>

              {/* Errand Details */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Errand Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Title</div>
                    <div className="font-semibold">{errand.title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Description</div>
                    <div>{errand.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Type</div>
                      <div className="capitalize">{errand.errand_type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Amount</div>
                      <div className="font-bold text-gold-warm">GHS {errand.amount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-6">Progress Timeline</h3>
                <div className="space-y-4">
                  {errand.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.completed
                          ? "bg-electric-blue text-white"
                          : "bg-space border-2 border-gray-700 text-gray-500"
                      }`}>
                        {item.completed ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${item.completed ? "" : "text-gray-500"}`}>
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-400">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Info */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gold-warm/30">
                <h3 className="text-lg font-semibold mb-4">Your Tsumi Agent</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-warm to-yellow-600 flex items-center justify-center text-2xl font-bold text-space-black">
                    {errand.agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{errand.agent.name}</div>
                    <div className="text-sm text-gray-400">⭐ {errand.agent.rating}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Vehicle:</span>
                    <span>{errand.agent.vehicle}</span>
                  </div>
                  <div className="flex gap-1">
                    {errand.agent.badges.map((badge, i) => (
                      <span key={i} className="text-2xl">{badge}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-3 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
                    📞 Call Agent
                  </button>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="w-full py-3 bg-space border border-gray-700 hover:border-gray-600 rounded-lg flex items-center justify-center gap-2"
                  >
                    💬 Message
                  </button>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Errand Fee</span>
                    <span>GHS {errand.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service Fee</span>
                    <span>GHS {(errand.amount * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-gold-warm">GHS {(errand.amount * 1.15).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gold-warm/10 border border-gold-warm/30 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-gold-warm">
                      <span>🔒</span>
                      <span className="font-semibold">Held in TsumiSafe</span>
                    </div>
                    <p className="text-gray-400 mt-1 text-xs">
                      Funds will release upon completion
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full py-2 bg-space border border-gray-700 hover:border-gray-600 rounded-lg text-sm">
                    📸 Request Photo Update
                  </button>
                  <button className="w-full py-2 bg-space border border-gray-700 hover:border-gray-600 rounded-lg text-sm">
                    🚨 Report Issue
                  </button>
                  <button className="w-full py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-sm">
                    Cancel Errand
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat Overlay */}
      {showChat && (
        <div className="fixed bottom-0 right-0 m-6 w-96 bg-space rounded-xl border border-electric-blue/30 shadow-2xl z-50">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="font-semibold">Chat with {errand.agent.name}</div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "customer"
                      ? "bg-electric-blue"
                      : "bg-space border border-gray-700"
                  }`}
                >
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-space-black rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
              />
              <button className="px-4 py-2 bg-electric-blue hover:bg-blue-600 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

