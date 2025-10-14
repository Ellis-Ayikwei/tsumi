"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Package,
  DollarSign,
  MapPin,
  Shield,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Push Notifications
    pushNotifications: {
      enabled: true,
      errandAssigned: true,
      errandUpdate: true,
      errandCompleted: true,
      paymentReceived: true,
      messageReceived: true,
      locationUpdate: true,
      systemAlerts: true,
    },
    // Email Notifications
    emailNotifications: {
      enabled: true,
      errandAssigned: true,
      errandUpdate: false,
      errandCompleted: true,
      paymentReceived: true,
      messageReceived: false,
      locationUpdate: false,
      systemAlerts: true,
      weeklySummary: true,
      marketingEmails: false,
    },
    // SMS Notifications
    smsNotifications: {
      enabled: false,
      errandAssigned: true,
      errandUpdate: false,
      errandCompleted: true,
      paymentReceived: true,
      messageReceived: false,
      locationUpdate: false,
      systemAlerts: true,
    },
    // Quiet Hours
    quietHours: {
      enabled: true,
      startTime: "22:00",
      endTime: "07:00",
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const notificationTypes = [
    {
      id: "errandAssigned",
      label: "Errand Assignment",
      description: "When you're assigned to a new errand",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "errandUpdate",
      label: "Errand Updates",
      description: "Status changes and progress updates",
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "errandCompleted",
      label: "Errand Completion",
      description: "When an errand is completed",
      icon: Package,
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "paymentReceived",
      label: "Payment Notifications",
      description: "When payments are received or processed",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "messageReceived",
      label: "Messages",
      description: "New messages from customers or agents",
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "locationUpdate",
      label: "Location Updates",
      description: "Real-time location tracking updates",
      icon: MapPin,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      id: "systemAlerts",
      label: "System Alerts",
      description: "Important system notifications and maintenance",
      icon: Shield,
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  const updatePreference = (category: string, key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const updateQuietHours = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Handle successful save
    }, 2000);
  };

  const ToggleButton = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => {
    return (
      <button
        onClick={onChange}
        className="transition-colors"
      >
        {enabled ? (
          <ToggleRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        ) : (
          <ToggleLeft className="w-6 h-6 text-gray-400" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/notifications" userName="Kwame Mensah" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/notifications"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notification Preferences
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customize how and when you receive notifications
              </p>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Push Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications on your device
                </p>
              </div>
              <div className="ml-auto">
                <ToggleButton
                  enabled={preferences.pushNotifications.enabled}
                  onChange={() => updatePreference("pushNotifications", "enabled", !preferences.pushNotifications.enabled)}
                />
              </div>
            </div>

            {preferences.pushNotifications.enabled && (
              <div className="space-y-4">
                {notificationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      <ToggleButton
                        enabled={preferences.pushNotifications[type.id as keyof typeof preferences.pushNotifications] as boolean}
                        onChange={() => updatePreference("pushNotifications", type.id, !preferences.pushNotifications[type.id as keyof typeof preferences.pushNotifications])}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <div className="ml-auto">
                <ToggleButton
                  enabled={preferences.emailNotifications.enabled}
                  onChange={() => updatePreference("emailNotifications", "enabled", !preferences.emailNotifications.enabled)}
                />
              </div>
            </div>

            {preferences.emailNotifications.enabled && (
              <div className="space-y-4">
                {notificationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      <ToggleButton
                        enabled={preferences.emailNotifications[type.id as keyof typeof preferences.emailNotifications] as boolean}
                        onChange={() => updatePreference("emailNotifications", type.id, !preferences.emailNotifications[type.id as keyof typeof preferences.emailNotifications])}
                      />
                    </div>
                  );
                })}
                
                {/* Additional email preferences */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Weekly Summary
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Weekly summary of your activity
                        </p>
                      </div>
                      <ToggleButton
                        enabled={preferences.emailNotifications.weeklySummary}
                        onChange={() => updatePreference("emailNotifications", "weeklySummary", !preferences.emailNotifications.weeklySummary)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Marketing Emails
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Promotional offers and platform updates
                        </p>
                      </div>
                      <ToggleButton
                        enabled={preferences.emailNotifications.marketingEmails}
                        onChange={() => updatePreference("emailNotifications", "marketingEmails", !preferences.emailNotifications.marketingEmails)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  SMS Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via SMS (standard rates apply)
                </p>
              </div>
              <div className="ml-auto">
                <ToggleButton
                  enabled={preferences.smsNotifications.enabled}
                  onChange={() => updatePreference("smsNotifications", "enabled", !preferences.smsNotifications.enabled)}
                />
              </div>
            </div>

            {preferences.smsNotifications.enabled && (
              <div className="space-y-4">
                {notificationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      <ToggleButton
                        enabled={preferences.smsNotifications[type.id as keyof typeof preferences.smsNotifications] as boolean}
                        onChange={() => updatePreference("smsNotifications", type.id, !preferences.smsNotifications[type.id as keyof typeof preferences.smsNotifications])}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiet Hours */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quiet Hours
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set times when you don't want to receive notifications
                </p>
              </div>
              <div className="ml-auto">
                <ToggleButton
                  enabled={preferences.quietHours.enabled}
                  onChange={() => updatePreference("quietHours", "enabled", !preferences.quietHours.enabled)}
                />
              </div>
            </div>

            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.startTime}
                    onChange={(e) => updateQuietHours("startTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.endTime}
                    onChange={(e) => updateQuietHours("endTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Preferences
                </>
              )}
            </button>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Notification Settings
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your notification preferences are saved automatically. You can change these settings at any time. 
                  System alerts and critical notifications may still be sent regardless of your preferences.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
