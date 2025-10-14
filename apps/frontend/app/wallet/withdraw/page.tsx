"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Banknote,
  Shield,
  CheckCircle,
  AlertCircle,
  Minus,
  Clock,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function WithdrawPage() {
  const [amount, setAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [50, 100, 200, 500, 1000];
  const withdrawalMethods = [
    {
      id: "mtn_momo",
      name: "MTN Mobile Money",
      icon: Smartphone,
      color: "bg-yellow-500",
      description: "Withdraw to MTN MoMo",
      fee: "₵2.50",
      time: "Instant",
    },
    {
      id: "vodafone_cash",
      name: "Vodafone Cash",
      icon: Smartphone,
      color: "bg-red-500",
      description: "Withdraw to Vodafone Cash",
      fee: "₵2.50",
      time: "Instant",
    },
    {
      id: "airteltigo_money",
      name: "AirtelTigo Money",
      icon: Smartphone,
      color: "bg-blue-500",
      description: "Withdraw to AirtelTigo Money",
      fee: "₵2.50",
      time: "Instant",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Banknote,
      color: "bg-green-500",
      description: "Transfer to bank account",
      fee: "₵5.00",
      time: "1-2 business days",
    },
  ];

  const handleWithdraw = async () => {
    if (!amount || !selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate withdrawal processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle successful withdrawal
    }, 2000);
  };

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);
  const totalDeduction = amount + (selectedMethodData ? parseFloat(selectedMethodData.fee.replace('₵', '')) : 0);

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
                Withdraw Funds
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Withdraw from your TsumiSafe wallet
              </p>
            </div>
          </div>

          {/* Current Balance */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Balance</p>
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
              Withdrawal Amount
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

          {/* Withdrawal Method Selection */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdrawal Method
            </h3>
            
            <div className="space-y-3">
              {withdrawalMethods.map((method) => {
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
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Fee: {method.fee}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {method.time}
                          </span>
                        </div>
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

          {/* Withdrawal Summary */}
          {amount > 0 && selectedMethod && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Withdrawal Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Withdrawal Amount</span>
                  <span className="text-gray-900 dark:text-white">₵{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                  <span className="text-gray-900 dark:text-white">{selectedMethodData?.fee}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900 dark:text-white">Total Deduction</span>
                    <span className="text-gray-900 dark:text-white">₵{totalDeduction.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100">
                  Withdrawal Notice
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Withdrawals are processed during business hours. Mobile money withdrawals are instant, while bank transfers may take 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={!amount || !selectedMethod || isProcessing || totalDeduction > 245.50}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Minus className="w-5 h-5" />
                Withdraw ₵{amount.toLocaleString()}
              </>
            )}
          </button>

          {totalDeduction > 245.50 && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              Insufficient balance for this withdrawal
            </p>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By proceeding, you agree to our Terms of Service. Withdrawal fees apply and are non-refundable.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
