"use client";

import { motion } from "framer-motion";
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  BarChart3,
  PieChart,
  Activity,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("overview");

  const quickStats = [
    { label: "Total Revenue", value: "₵1,245,600", change: "+23%", icon: DollarSign },
    { label: "Total Errands", value: "12,453", change: "+18%", icon: Package },
    { label: "Active Users", value: "8,234", change: "+12%", icon: Users },
    { label: "Success Rate", value: "94.5%", change: "+2.3%", icon: TrendingUp },
  ];

  const financialData = [
    { label: "Errand Revenue", value: "₵1,124,320", percentage: "90.3%" },
    { label: "Platform Commission", value: "₵168,648", percentage: "13.5%" },
    { label: "Agent Payouts", value: "₵955,672", percentage: "76.7%" },
    { label: "Refunds Issued", value: "₵12,340", percentage: "1.0%" },
    { label: "Withdrawal Fees", value: "₵8,640", percentage: "0.7%" },
  ];

  const topAgents = [
    { name: "Ama Serwaa", errands: 245, earnings: "₵12,450", rating: 4.9 },
    { name: "Kofi Asante", errands: 232, earnings: "₵11,230", rating: 4.8 },
    { name: "Akua Osei", errands: 198, earnings: "₵10,100", rating: 4.9 },
    { name: "Kwame Mensah", errands: 187, earnings: "₵9,850", rating: 4.7 },
    { name: "Yaw Boateng", errands: 176, earnings: "₵9,320", rating: 4.8 },
  ];

  const errandStats = [
    { status: "Completed", count: 11234, percentage: "90.2%" },
    { status: "Cancelled", count: 789, percentage: "6.3%" },
    { status: "Disputed", count: 234, percentage: "1.9%" },
    { status: "In Progress", count: 196, percentage: "1.6%" },
  ];

  const reportTemplates = [
    {
      name: "Financial Summary",
      description: "Revenue, commissions, payouts breakdown",
      icon: DollarSign,
      format: ["PDF", "Excel"],
    },
    {
      name: "Operational Report",
      description: "Errands, completion rates, agent performance",
      icon: Activity,
      format: ["PDF", "Excel"],
    },
    {
      name: "User Growth Report",
      description: "New signups, active users, retention metrics",
      icon: Users,
      format: ["PDF", "Excel"],
    },
    {
      name: "Geographic Report",
      description: "Errand distribution by location",
      icon: BarChart3,
      format: ["PDF", "CSV"],
    },
    {
      name: "Trust & Safety Report",
      description: "Disputes, KYC approvals, suspensions",
      icon: FileText,
      format: ["PDF"],
    },
    {
      name: "Custom Report",
      description: "Build your own report with custom filters",
      icon: PieChart,
      format: ["PDF", "Excel", "CSV"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform performance insights and data exports
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Breakdown */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Financial Breakdown
            </h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {financialData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    style={{ width: item.percentage }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.percentage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Performing Agents
            </h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topAgents.map((agent, index) => (
              <div
                key={agent.name}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {agent.errands} errands • ⭐ {agent.rating}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {agent.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Errand Statistics */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Errand Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {errandStats.map((stat) => (
            <div key={stat.status} className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {stat.status}
              </div>
              <div className="text-xs font-medium text-purple-600">{stat.percentage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Generate Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.name}
                className="p-4 border border-gray-200 dark:border-gray-800 hover:border-purple-600 dark:hover:border-purple-400 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {template.format.map((format) => (
                    <button
                      key={format}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Scheduled Reports
          </h2>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
            Create Schedule
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Weekly Financial Summary
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Every Monday at 9:00 AM • Email to finance@tsumi.gh
                </div>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Monthly Operations Report
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  1st of every month at 8:00 AM • Email to ops@tsumi.gh
                </div>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

