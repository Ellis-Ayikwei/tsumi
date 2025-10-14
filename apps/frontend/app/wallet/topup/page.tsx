"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function TopupPage() {
  const [amount, setAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];
  const paymentMethods = [
    {
      id: "mtn_momo",
      name: "MTN Mobile Money",
      icon: Smartphone,
      color: "bg-yellow-500",
      description: "Instant top-up via MTN MoMo",
    },
    {
      id: "vodafone_cash",
      name: "Vodafone Cash",
      icon: Smartphone,
      color: "bg-red-500",
      description: "Instant top-up via Vodafone Cash",
    },
    {
      id: "airteltigo_money",
      name: "AirtelTigo Money",
      icon: Smartphone,
      color: "bg-blue-500",
      description: "Instant top-up via AirtelTigo Money",
    },
    {
      id: "paystack",
      name: "Card Payment",
      icon: CreditCard,
      color: "bg-purple-500",
      description: "Secure card payment via Paystack",
    },
  ];

  const handleTopup = async () => {
    if (!amount || !selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle successful top-up
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/wallet" userName="Kwame Mensah" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/wallet"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Up Wallet
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Add funds to your TsumiSafe wallet
              </p>
            </div>
          </div>

          {/* Current Balance */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₵245.50</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Amount
            </h3>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`p-3 rounded-lg border transition-all ${
                    amount === quickAmount
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  ₵{quickAmount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₵
                </span>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${method.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Secure Payment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  All payments are processed securely. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Top Up Button */}
          <button
            onClick={handleTopup}
            disabled={!amount || !selectedMethod || isProcessing}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Top Up ₵{amount.toLocaleString()}
              </>
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Top-ups are instant and non-refundable.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
