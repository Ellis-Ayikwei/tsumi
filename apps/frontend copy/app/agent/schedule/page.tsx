"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Settings,
  Bell,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";

export default function AgentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [showAddShift, setShowAddShift] = useState(false);

  // Mock data
  const shifts = [
    {
      id: "shift-1",
      date: "2024-06-15",
      startTime: "08:00",
      endTime: "12:00",
      status: "active",
      earnings: 245,
      jobsCompleted: 8,
      location: "Accra Central",
      type: "morning",
    },
    {
      id: "shift-2",
      date: "2024-06-15",
      startTime: "14:00",
      endTime: "18:00",
      status: "scheduled",
      earnings: 0,
      jobsCompleted: 0,
      location: "East Legon",
      type: "afternoon",
    },
    {
      id: "shift-3",
      date: "2024-06-16",
      startTime: "09:00",
      endTime: "17:00",
      status: "scheduled",
      earnings: 0,
      jobsCompleted: 0,
      location: "Osu",
      type: "full_day",
    },
    {
      id: "shift-4",
      date: "2024-06-17",
      startTime: "10:00",
      endTime: "14:00",
      status: "scheduled",
      earnings: 0,
      jobsCompleted: 0,
      location: "Labone",
      type: "morning",
    },
  ];

  const availability = [
    { day: "Monday", available: true, startTime: "08:00", endTime: "18:00" },
    { day: "Tuesday", available: true, startTime: "08:00", endTime: "18:00" },
    { day: "Wednesday", available: false, startTime: "", endTime: "" },
    { day: "Thursday", available: true, startTime: "10:00", endTime: "16:00" },
    { day: "Friday", available: true, startTime: "08:00", endTime: "20:00" },
    { day: "Saturday", available: true, startTime: "09:00", endTime: "17:00" },
    { day: "Sunday", available: false, startTime: "", endTime: "" },
  ];

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case "morning":
        return <Sun className="w-4 h-4 text-yellow-600" />;
      case "afternoon":
        return <Sun className="w-4 h-4 text-orange-600" />;
      case "evening":
        return <Moon className="w-4 h-4 text-blue-600" />;
      case "full_day":
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400";
      case "afternoon":
        return "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
      case "evening":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
      case "full_day":
        return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const todayShifts = shifts.filter(shift => shift.date === selectedDate.toISOString().split('T')[0]);
  const weekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your availability and track your shifts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddShift(true)}
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
        {["day", "week", "month"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === mode
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Schedule View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Shifts */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {viewMode === "day" ? "Today's Shifts" : `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Shifts`}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {viewMode === "day" ? todayShifts.length : weekShifts.length} shifts
              </div>
            </div>

            <div className="space-y-4">
              {(viewMode === "day" ? todayShifts : weekShifts).map((shift) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getShiftTypeColor(shift.type)}`}>
                        {getShiftTypeIcon(shift.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(shift.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(shift.status)}`}>
                        {shift.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{shift.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">₵{shift.earnings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{shift.jobsCompleted} jobs</span>
                    </div>
                  </div>

                  {shift.status === "active" && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Currently active
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {todayShifts.length === 0 && viewMode === "day" && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No shifts scheduled for today</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">32h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₵1,245</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">18</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Availability */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Availability
            </h3>
            <div className="space-y-3">
              {availability.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {day.day}
                  </span>
                  <div className="flex items-center gap-2">
                    {day.available ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {day.startTime} - {day.endTime}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Unavailable
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
              Edit Availability
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Shift reminders (15 min before)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  New job alerts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Weekly earnings summary
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Schedule changes
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm">
                Go Online Now
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                Set Break Time
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                Update Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Shift
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Accra Central"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddShift(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Add Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
