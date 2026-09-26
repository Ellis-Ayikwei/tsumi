"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  const user = {
    first_name: "Kwame",
    last_name: "Mensah",
    email: "kwame.mensah@example.com",
    phone: "+233 24 123 4567",
    address: "123 Oxford St, Osu, Accra",
    user_type: "customer",
    trust_score: 0.92,
    total_errands: 12,
    member_since: "2024-06-15",
    badges: ["Verified Sender"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/wallet" className="text-gray-400 hover:text-white">
                Wallet
              </Link>
              <Link href="/history" className="text-gray-400 hover:text-white">
                History
              </Link>
              <Link href="/profile" className="text-white font-semibold">
                Profile
              </Link>
            </nav>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-blue to-gold-warm flex items-center justify-center font-bold">
                {user.first_name.charAt(0)}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-electric-blue to-gold-warm flex items-center justify-center text-4xl font-bold mb-4">
                    {user.first_name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-space rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Trust Score</div>
                    <div className="text-2xl font-bold text-green-400">
                      {(user.trust_score * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="p-4 bg-space rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Errands Completed</div>
                    <div className="text-2xl font-bold text-electric-blue">
                      {user.total_errands}
                    </div>
                  </div>

                  <div className="p-4 bg-space rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Member Since</div>
                    <div className="font-semibold">{user.member_since}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-400">My Badges</h3>
                  <div className="space-y-2">
                    {user.badges.map((badge, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gold-warm/10 border border-gold-warm/30 rounded-lg flex items-center gap-2"
                      >
                        <span className="text-xl">✅</span>
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg">
                  Log Out
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2">
              <div className="bg-space/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-800">
                  {[
                    { id: "profile", label: "Profile Settings" },
                    { id: "security", label: "Security" },
                    { id: "notifications", label: "Notifications" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 px-4 transition-all ${
                        activeTab === tab.id
                          ? "text-electric-blue border-b-2 border-electric-blue font-semibold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-300">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.first_name}
                          className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-300">Last Name</label>
                        <input
                          type="text"
                          defaultValue={user.last_name}
                          className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Address</label>
                      <textarea
                        defaultValue={user.address}
                        rows={3}
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Language Preference
                      </label>
                      <select className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none">
                        <option value="en">English</option>
                        <option value="tw">Twi</option>
                      </select>
                    </div>

                    <button className="px-6 py-3 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold">
                      Save Changes
                    </button>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Security Settings</h3>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    <button className="px-6 py-3 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold">
                      Update Password
                    </button>

                    <div className="border-t border-gray-800 pt-6 mt-8">
                      <h4 className="font-semibold mb-4">Two-Factor Authentication</h4>
                      <div className="flex items-center justify-between p-4 bg-space rounded-lg">
                        <div>
                          <div className="font-semibold mb-1">SMS Authentication</div>
                          <div className="text-sm text-gray-400">
                            Secure your account with OTP codes
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-electric-blue hover:bg-blue-600 rounded-lg">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>

                    {[
                      {
                        title: "Errand Updates",
                        description: "Notifications about your active errands",
                        checked: true,
                      },
                      {
                        title: "Payment Notifications",
                        description: "Wallet and transaction updates",
                        checked: true,
                      },
                      {
                        title: "Promotional Offers",
                        description: "Discounts and special promotions",
                        checked: false,
                      },
                      {
                        title: "Runner Messages",
                        description: "Chat messages from Tsumi Runners",
                        checked: true,
                      },
                      {
                        title: "Email Notifications",
                        description: "Receive updates via email",
                        checked: true,
                      },
                    ].map((setting, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-space rounded-lg"
                      >
                        <div>
                          <div className="font-semibold mb-1">{setting.title}</div>
                          <div className="text-sm text-gray-400">{setting.description}</div>
                        </div>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            defaultChecked={setting.checked}
                            className="sr-only peer"
                          />
                          <div className="w-full h-full bg-gray-700 rounded-full peer-checked:bg-electric-blue transition-all"></div>
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

