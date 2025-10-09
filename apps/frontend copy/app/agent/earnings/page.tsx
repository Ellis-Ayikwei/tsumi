"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useState } from "react";

export default function AgentEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data
  const earningsData = {
    week: {
      total: 1245,
      completed: 18,
      pending: 2,
      average: 69.17,
      change: "+12.5%",
    },
    month: {
      total: 4890,
      completed: 67,
      pending: 3,
      average: 72.99,
      change: "+8.3%",
    },
    year: {
      total: 45600,
      completed: 624,
      pending: 5,
      average: 73.08,
      change: "+15.2%",
    },
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  const transactions = [
    {
      id: "TXN-001",
      date: "2024-06-15",
      time: "11:30 AM",
      type: "job_completion",
      description: "Document pickup - Ridge to East Legon",
      amount: 35,
      status: "completed",
      customer: "Kwame Mensah",
      jobId: "ERR-12345",
    },
    {
      id: "TXN-002",
      date: "2024-06-15",
      time: "09:15 AM",
      type: "job_completion",
      description: "Grocery delivery - Shoprite to Osu",
      amount: 50,
      status: "completed",
      customer: "Grace Addo",
      jobId: "ERR-12344",
    },
    {
      id: "TXN-003",
      date: "2024-06-14",
      time: "04:20 PM",
      type: "job_completion",
      description: "Food pickup - KFC to Community 18",
      amount: 25,
      status: "completed",
      customer: "Kofi Darko",
      jobId: "ERR-12343",
    },
    {
      id: "TXN-004",
      date: "2024-06-14",
      time: "02:45 PM",
      type: "withdrawal",
      description: "Bank transfer to GCB Bank",
      amount: -500,
      status: "processing",
      customer: null,
      jobId: null,
    },
    {
      id: "TXN-005",
      date: "2024-06-14",
      time: "01:30 PM",
      type: "job_completion",
      description: "Medical prescription delivery",
      amount: 40,
      status: "completed",
      customer: "Abena Mensah",
      jobId: "ERR-12342",
    },
    {
      id: "TXN-006",
      date: "2024-06-13",
      time: "06:00 PM",
      type: "bonus",
      description: "Weekly performance bonus",
      amount: 100,
      status: "completed",
      customer: null,
      jobId: null,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job_completion":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "withdrawal":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "bonus":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "earnings") return txn.amount > 0;
    if (selectedFilter === "withdrawals") return txn.amount < 0;
    return txn.status === selectedFilter;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Earnings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your earnings, withdrawals, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
        {["week", "month", "year"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPeriod === period
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {currentData.change}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">vs last {selectedPeriod}</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            ₵{currentData.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {currentData.completed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">completed</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {currentData.completed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                ₵{currentData.average}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">per job</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            ₵{currentData.average}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average per Job</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="text-right">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                {currentData.pending}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">pending</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {currentData.pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Trend</h3>
            <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings by Type</h3>
            <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Pie chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Transactions</option>
                <option value="earnings">Earnings Only</option>
                <option value="withdrawals">Withdrawals Only</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.date} at {transaction.time}
                      {transaction.customer && ` • ${transaction.customer}`}
                      {transaction.jobId && ` • ${transaction.jobId}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.amount > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₵{Math.abs(transaction.amount)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
