"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Filter,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const transactions = [
    {
      id: "1",
      type: "deposit",
      amount: 100,
      description: "Wallet top-up via MTN MoMo",
      status: "completed",
      date: "2024-01-15T10:30:00Z",
      reference: "TXN-001234",
      provider: "mtn_momo",
    },
    {
      id: "2",
      type: "hold",
      amount: -50,
      description: "Errand payment held in escrow",
      status: "completed",
      date: "2024-01-15T11:15:00Z",
      reference: "TXN-001235",
      errandId: "ERR-001",
    },
    {
      id: "3",
      type: "release",
      amount: 45,
      description: "Errand payment released to agent",
      status: "completed",
      date: "2024-01-15T14:30:00Z",
      reference: "TXN-001236",
      errandId: "ERR-001",
    },
    {
      id: "4",
      type: "commission",
      amount: -5,
      description: "Platform commission",
      status: "completed",
      date: "2024-01-15T14:30:00Z",
      reference: "TXN-001237",
      errandId: "ERR-001",
    },
    {
      id: "5",
      type: "withdrawal",
      amount: -200,
      description: "Withdrawal to Vodafone Cash",
      status: "pending",
      date: "2024-01-16T09:00:00Z",
      reference: "TXN-001238",
      provider: "vodafone_cash",
    },
    {
      id: "6",
      type: "refund",
      amount: 25,
      description: "Errand cancellation refund",
      status: "completed",
      date: "2024-01-16T12:00:00Z",
      reference: "TXN-001239",
      errandId: "ERR-002",
    },
  ];

  const getTransactionIcon = (type: string, provider?: string) => {
    switch (type) {
      case "deposit":
        return provider === "mtn_momo" || provider === "vodafone_cash" || provider === "airteltigo_money" 
          ? Smartphone 
          : CreditCard;
      case "withdrawal":
        return provider === "mtn_momo" || provider === "vodafone_cash" || provider === "airteltigo_money" 
          ? Smartphone 
          : CreditCard;
      case "hold":
      case "release":
      case "commission":
      case "refund":
        return Package;
      default:
        return CreditCard;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportTransactions = () => {
    // Implement CSV export functionality
    console.log("Exporting transactions...");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/wallet" userName="Kwame Mensah" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/wallet"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Transaction History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View all your wallet transactions
                </p>
              </div>
            </div>
            <button
              onClick={exportTransactions}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="md:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="hold">Escrow Holds</option>
                  <option value="release">Escrow Releases</option>
                  <option value="commission">Commissions</option>
                  <option value="refund">Refunds</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Your transaction history will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type, transaction.provider);
                  const StatusIcon = getStatusIcon(transaction.status);
                  const isPositive = transaction.amount > 0;
                  
                  return (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            isPositive 
                              ? "bg-green-100 dark:bg-green-950" 
                              : "bg-red-100 dark:bg-red-950"
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isPositive 
                                ? "text-green-600 dark:text-green-400" 
                                : "text-red-600 dark:text-red-400"
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {transaction.description}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.reference}
                              </span>
                              {transaction.errandId && (
                                <Link
                                  href={`/errands/${transaction.errandId}`}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {transaction.errandId}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            isPositive 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {isPositive ? "+" : ""}₵{Math.abs(transaction.amount).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(transaction.status)}`} />
                            <span className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Transaction Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₵{transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₵{Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {transactions.filter(t => t.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
