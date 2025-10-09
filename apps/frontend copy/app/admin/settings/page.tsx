"use client";

import { motion } from "framer-motion";
import {
  Save,
  Settings as SettingsIcon,
  DollarSign,
  CreditCard,
  Shield,
  Bell,
  Globe,
  MapPin,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "commission", label: "Commission & Fees", icon: DollarSign },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "trust", label: "Trust & Safety", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "regions", label: "Service Areas", icon: MapPin },
    { id: "features", label: "Feature Flags", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure platform-wide settings
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex gap-6">
        {/* Tabs Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  General Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Tsumi"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Currency
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="GHS">GHS (₵)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Language
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="en">English</option>
                    <option value="tw">Twi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="GMT">GMT (Ghana)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@tsumi.gh"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+233 24 000 0000"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "commission" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Commission & Fees
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="15"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Percentage taken from each errand
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Errand Fee (₵)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Errand Fee (₵)
                  </label>
                  <input
                    type="number"
                    defaultValue="5000"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Withdrawal Fee (₵)
                  </label>
                  <input
                    type="number"
                    defaultValue="2"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Tiered Commission (Based on Agent Performance)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="1-10 errands"
                        defaultValue="15"
                        className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">% for 1-10 errands</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="11-50 errands"
                        defaultValue="13"
                        className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">% for 11-50 errands</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="50+ errands"
                        defaultValue="10"
                        className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">% for 50+ errands</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Payment Methods
                  </h3>
                  <div className="space-y-2">
                    {["MTN Mobile Money", "Vodafone Cash", "AirtelTigo Money", "Paystack (Cards)"].map(
                      (method) => (
                        <label key={method} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{method}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto-Release Timing (hours after completion)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    min="1"
                    max="168"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Escrow funds auto-release after this period
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Escrow Hold Period (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue="168"
                    min="1"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maximum time funds can be held in escrow
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    API Keys (Paystack)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Public Key
                      </label>
                      <input
                        type="text"
                        placeholder="pk_test_..."
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk_test_..."
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Feature Flags
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable or disable platform features
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Live GPS Tracking", enabled: true },
                  { name: "In-app Chat", enabled: true },
                  { name: "Voice Calls", enabled: true },
                  { name: "Video Proof Upload", enabled: false },
                  { name: "Tips & Gratuity", enabled: true },
                  { name: "Scheduled Errands", enabled: true },
                  { name: "Recurring Errands", enabled: false },
                  { name: "Business Accounts", enabled: true },
                  { name: "Agent Referrals", enabled: true },
                  { name: "Customer Loyalty Program", enabled: false },
                ].map((feature) => (
                  <label
                    key={feature.name}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        defaultChecked={feature.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add more tabs content as needed */}
          {activeTab === "trust" && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-2" />
                <p>Trust & Safety settings panel</p>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Bell className="w-12 h-12 mx-auto mb-2" />
                <p>Notification settings panel</p>
              </div>
            </div>
          )}

          {activeTab === "regions" && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Service areas configuration</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            <p className="font-medium mb-1">Important:</p>
            <p>
              Changes to commission rates and payment settings will apply to new errands only.
              Existing active errands will use the rates at the time they were created.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

