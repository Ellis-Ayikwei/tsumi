"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Phone,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickHelp = [
    {
      icon: AlertCircle,
      title: "Report an Issue",
      description: "Something went wrong? Let us know immediately",
      action: "Report",
      color: "red",
    },
    {
      icon: Clock,
      title: "Track My Errand",
      description: "Check the status of your ongoing errand",
      action: "Track",
      color: "blue",
    },
    {
      icon: CreditCard,
      title: "Payment Help",
      description: "Issues with wallet or payments",
      action: "Get Help",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Safety Concerns",
      description: "Report safety or trust issues",
      action: "Contact",
      color: "orange",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        { q: "How do I create an errand?", a: "Click 'Request Errand' and fill in the details..." },
        { q: "How long does it take to get matched?", a: "Usually under 5 minutes..." },
        { q: "What areas do you cover?", a: "We cover all of Greater Accra..." },
      ],
    },
    {
      category: "Payments & Wallet",
      questions: [
        { q: "How does TsumiSafe Escrow work?", a: "Your money is held securely..." },
        { q: "What payment methods do you accept?", a: "MTN MoMo, Vodafone Cash..." },
        { q: "How do I withdraw from my wallet?", a: "Go to Wallet > Withdraw..." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tsumi</h1>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How Can We Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Get quick answers or reach out to our support team. We&apos;re here 24/7 to help you.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Help */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickHelp.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-950 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                  <button className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                    {item.action} →
                  </button>
                </div>
              );
            })}
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chat with our support team
              </p>
              <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity">
                Start Chat
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                +233 24 813 8722
              </p>
              <button className="px-6 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-900 dark:hover:border-white transition-all">
                Call Now
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                support@tsumi.gh
              </p>
              <button className="px-6 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-900 dark:hover:border-white transition-all">
                Send Email
              </button>
            </div>
          </div>

          {/* Popular FAQs */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Popular Questions
            </h3>

            {faqs.map((category, i) => (
              <div key={i} className="mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{category.category}</h4>
                <div className="space-y-3">
                  {category.questions.map((faq, j) => (
                    <div
                      key={j}
                      className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">{faq.q}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-8">
              <Link
                href="/faq"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                View All FAQs →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

