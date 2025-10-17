"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Palette,
  DollarSign,
  Bell,
  MapPin,
  Clock,
  Moon,
  Sun,
  Monitor,
  Save,
  RotateCcw,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Appearance
    theme: "system", // light, dark, system
    language: "en",
    currency: "GHS",
    timezone: "Africa/Accra",
    
    // Location
    defaultLocation: {
      address: "Accra, Ghana",
      latitude: 5.6037,
      longitude: -0.1870,
    },
    
    // Privacy
    profileVisibility: "public",
    locationSharing: true,
    activityStatus: true,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Errand Preferences
    autoAccept: false,
    maxDistance: 10, // km
    preferredErrandTypes: ["pickup", "delivery"],
    workingHours: {
      start: "08:00",
      end: "18:00",
    },
    
    // Display
    showDistance: true,
    showRatings: true,
    showPricing: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "tw", name: "Twi", flag: "🇬🇭" },
    { code: "ga", name: "Ga", flag: "🇬🇭" },
    { code: "ha", name: "Hausa", flag: "🇬🇭" },
  ];

  const currencies = [
    { code: "GHS", name: "Ghana Cedi", symbol: "₵" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
  ];

  const timezones = [
    { code: "Africa/Accra", name: "Accra (GMT+0)" },
    { code: "Africa/Lagos", name: "Lagos (GMT+1)" },
    { code: "Europe/London", name: "London (GMT+0)" },
  ];

  const errandTypes = [
    { id: "pickup", name: "Pickup", description: "Pick up items from locations" },
    { id: "delivery", name: "Delivery", description: "Deliver items to destinations" },
    { id: "custom", name: "Custom", description: "Custom errand requests" },
  ];

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedPreference = (parentKey: string, childKey: string, value: any) => {
    setPreferences((prev) => {
      const parent: any = (prev as any)[parentKey] ?? {};
      return {
        ...prev,
        [parentKey]: {
          ...parent,
          [childKey]: value,
        },
      };
    });
  };

  const toggleErrandType = (typeId: string) => {
    const currentTypes = preferences.preferredErrandTypes;
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(id => id !== typeId)
      : [...currentTypes, typeId];
    updatePreference("preferredErrandTypes", newTypes);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Handle successful save
    }, 2000);
  };

  const resetToDefaults = () => {
    // Reset to default preferences
    setPreferences({
      theme: "system",
      language: "en",
      currency: "GHS",
      timezone: "Africa/Accra",
      defaultLocation: {
        address: "Accra, Ghana",
        latitude: 5.6037,
        longitude: -0.1870,
      },
      profileVisibility: "public",
      locationSharing: true,
      activityStatus: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      autoAccept: false,
      maxDistance: 10,
      preferredErrandTypes: ["pickup", "delivery"],
      workingHours: {
        start: "08:00",
        end: "18:00",
      },
      showDistance: true,
      showRatings: true,
      showPricing: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/settings" userName="Kwame Mensah" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/settings"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Preferences
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customize your Tsumi experience
              </p>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize the look and feel of the app
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => updatePreference("theme", theme.value)}
                        className={`p-3 rounded-lg border transition-all ${
                          preferences.theme === theme.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{theme.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreference("language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Currency & Timezone */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Currency & Timezone
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your preferred currency and timezone
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => updatePreference("currency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => updatePreference("timezone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timezones.map((tz) => (
                    <option key={tz.code} value={tz.code}>
                      {tz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Location
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your default location and sharing preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Location
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={preferences.defaultLocation.address}
                    onChange={(e) => updateNestedPreference("defaultLocation", "address", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your default location"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Location Sharing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow Tsumi to access your location for better service
                  </p>
                </div>
                <button
                  onClick={() => updatePreference("locationSharing", !preferences.locationSharing)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.locationSharing ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.locationSharing ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Errand Preferences */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Errand Preferences
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your errand experience
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Distance (km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={preferences.maxDistance}
                  onChange={(e) => updatePreference("maxDistance", parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>1 km</span>
                  <span className="font-medium">{preferences.maxDistance} km</span>
                  <span>50 km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preferred Errand Types
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {errandTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleErrandType(type.id)}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        preferences.preferredErrandTypes.includes(type.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {type.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours Start
                  </label>
                  <input
                    type="time"
                    value={preferences.workingHours.start}
                    onChange={(e) => updateNestedPreference("workingHours", "start", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours End
                  </label>
                  <input
                    type="time"
                    value={preferences.workingHours.end}
                    onChange={(e) => updateNestedPreference("workingHours", "end", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-950 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Display Options
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose what information to display
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "showDistance", label: "Show Distance", description: "Display distance to errands" },
                { key: "showRatings", label: "Show Ratings", description: "Display customer ratings" },
                { key: "showPricing", label: "Show Pricing", description: "Display errand pricing" },
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{option.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                  <button
                    onClick={() => updatePreference(option.key, !preferences[option.key as keyof typeof preferences])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences[option.key as keyof typeof preferences] ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences[option.key as keyof typeof preferences] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
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
        </motion.div>
      </div>
    </div>
  );
}
