"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Package,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Settings,
  Filter,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "errand_assigned",
      title: "New Errand Assigned",
      message: "You've been assigned to pick up documents from Ridge office",
      status: "unread",
      timestamp: "2024-01-16T10:30:00Z",
      errandId: "ERR-001",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      id: "2",
      type: "payment_received",
      title: "Payment Received",
      message: "₵45 has been released to your wallet for completed errand",
      status: "unread",
      timestamp: "2024-01-16T09:15:00Z",
      transactionId: "TXN-001234",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      id: "3",
      type: "errand_update",
      title: "Errand Status Update",
      message: "Your errand 'Grocery shopping at Shoprite' is now in progress",
      status: "read",
      timestamp: "2024-01-16T08:45:00Z",
      errandId: "ERR-002",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      id: "4",
      type: "message_received",
      title: "New Message",
      message: "You have a new message from Ama Serwaa about your errand",
      status: "read",
      timestamp: "2024-01-16T08:30:00Z",
      errandId: "ERR-001",
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-950",
    },
    {
      id: "5",
      type: "location_update",
      title: "Agent Location Update",
      message: "Your agent is now at the pickup location",
      status: "read",
      timestamp: "2024-01-16T08:00:00Z",
      errandId: "ERR-001",
      icon: MapPin,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      id: "6",
      type: "errand_completed",
      title: "Errand Completed",
      message: "Your errand has been completed successfully. Please rate your experience.",
      status: "read",
      timestamp: "2024-01-15T16:30:00Z",
      errandId: "ERR-003",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      id: "7",
      type: "system_alert",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM",
      status: "read",
      timestamp: "2024-01-15T14:00:00Z",
      icon: AlertCircle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
    },
  ];

  const getNotificationTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      errand_assigned: "Errand Assignment",
      payment_received: "Payment",
      errand_update: "Errand Update",
      message_received: "Message",
      location_update: "Location",
      errand_completed: "Completion",
      system_alert: "System",
    };
    return typeLabels[type] || "Other";
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const markAllAsRead = () => {
    // Implement mark all as read functionality
    console.log("Marking all notifications as read");
  };

  const deleteNotification = (id: string) => {
    // Implement delete notification functionality
    console.log("Deleting notification:", id);
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with your errands and account activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/notifications/preferences"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {notifications.filter(n => n.status === "read").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Read</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
              </div>
              
              <div className="flex-1">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="errand_assigned">Errand Assignment</option>
                  <option value="payment_received">Payment</option>
                  <option value="errand_update">Errand Update</option>
                  <option value="message_received">Message</option>
                  <option value="location_update">Location</option>
                  <option value="errand_completed">Completion</option>
                  <option value="system_alert">System</option>
                </select>
              </div>

              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "You're all caught up! New notifications will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        notification.status === "unread" ? "bg-blue-50/30 dark:bg-blue-950/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${notification.bgColor}`}>
                          <Icon className={`w-5 h-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                {notification.status === "unread" && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                  {getNotificationTypeLabel(notification.type)}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>
                                  {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                                  {new Date(notification.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {(notification.errandId || notification.transactionId) && (
                                  <span className="text-blue-600 dark:text-blue-400">
                                    ID: {notification.errandId || notification.transactionId}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {(notification.errandId || notification.transactionId) && (
                                <Link
                                  href={notification.errandId ? `/errands/${notification.errandId}` : `/wallet/transactions`}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  View
                                </Link>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/notifications/preferences"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                Notification Settings
              </Link>
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
