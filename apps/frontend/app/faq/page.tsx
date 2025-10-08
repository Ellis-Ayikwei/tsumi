"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      name: "Getting Started",
      faqs: [
        {
          q: "How do I create an errand?",
          a: "Click 'Request Errand' from the dashboard or homepage. Fill in the errand details including title, type (pickup/delivery/shopping/custom), pickup and delivery locations, budget, and any special instructions. Review the estimated fee and confirm payment method. Once submitted, you'll be matched with a nearby verified Tsumi Agent.",
        },
        {
          q: "How long does it take to get matched with an agent?",
          a: "Most errands are matched within 2-5 minutes. During peak hours, it may take up to 15 minutes. You'll receive a notification as soon as an agent accepts your errand.",
        },
        {
          q: "What areas do you cover in Ghana?",
          a: "We currently cover all of Greater Accra including Accra Central, Tema, Osu, Ridge, East Legon, Cantonments, Airport Residential Area, Madina, Adenta, and surrounding areas. We're expanding to Kumasi and other regions soon.",
        },
        {
          q: "What types of errands can I request?",
          a: "You can request pickups, deliveries, shopping, document collection, pharmacy runs, food pickup, and custom tasks. Anything legal and safe that you'd trust someone to do for you!",
        },
      ],
    },
    {
      name: "Payments & Wallet",
      faqs: [
        {
          q: "How does TsumiSafe Escrow work?",
          a: "TsumiSafe holds your payment securely until the errand is completed. Once the agent delivers and you confirm, funds are automatically released. If there's an issue, you can dispute and get a full refund. Your money is always protected.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept MTN Mobile Money, Vodafone Cash, AirtelTigo Money, bank cards via Paystack, and wallet balance. All payments are secure and instant.",
        },
        {
          q: "How do I add money to my Tsumi Wallet?",
          a: "Go to Wallet > Deposit, choose your payment method (MoMo or card), enter the amount, and complete the payment. Funds appear in your wallet instantly.",
        },
        {
          q: "What are the platform fees?",
          a: "Standard users pay 15% platform fee. Tsumi Plus members pay 10%. Business accounts have custom rates. There are no hidden fees.",
        },
        {
          q: "Can I get a refund?",
          a: "Yes. If an agent doesn't complete your errand or there's an issue, contact support for a full refund. TsumiSafe protects your money at all times.",
        },
      ],
    },
    {
      name: "For Agents",
      faqs: [
        {
          q: "How do I become a Tsumi Agent?",
          a: "Click 'Become an Agent', fill in your details, upload your Ghana Card and selfie, provide your bank or MoMo details, and submit. Our team reviews applications within 24-48 hours. Once approved, you can start accepting errands immediately.",
        },
        {
          q: "What are the requirements to be an agent?",
          a: "You must be 18+, have a valid Ghana Card, own a smartphone with GPS, have a reliable mode of transportation (foot, bicycle, motorbike, or car), and pass our background check.",
        },
        {
          q: "How much can I earn as an agent?",
          a: "Top agents earn GHS 3,000-5,000+ per month. Earnings depend on errands completed, time spent, and performance. You keep 85-92% of each errand fee depending on your tier.",
        },
        {
          q: "When do I get paid?",
          a: "You're paid immediately after each errand completion. Funds go to your Tsumi Wallet and you can withdraw instantly to your bank or MoMo account.",
        },
        {
          q: "How do Trust Badges work?",
          a: "Trust Badges are earned based on performance, KYC verification, ratings, and completed errands. Badges help customers trust you and can lead to more errand requests and better tips.",
        },
      ],
    },
    {
      name: "Safety & Trust",
      faqs: [
        {
          q: "How do you verify agents?",
          a: "All agents undergo KYC verification including Ghana Card check, selfie matching, background screening, and phone verification. We continuously monitor performance and user feedback.",
        },
        {
          q: "What if something goes wrong during an errand?",
          a: "Contact support immediately via in-app chat, phone, or email. We have a 24/7 response team. You can also cancel the errand and request a full refund if needed.",
        },
        {
          q: "Can I track my errand in real-time?",
          a: "Yes! Once an agent accepts your errand, you can track their live location on the map, see ETA updates, and chat with them directly.",
        },
        {
          q: "What if I'm not satisfied with the agent?",
          a: "You can rate and review the agent after completion. If there's a serious issue, report it to support. We take all complaints seriously and may suspend or remove agents who violate our standards.",
        },
      ],
    },
    {
      name: "Technical Issues",
      faqs: [
        {
          q: "The app isn't loading. What should I do?",
          a: "Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection or try a different browser. Contact support if the problem continues.",
        },
        {
          q: "I didn't receive my OTP code.",
          a: "Check your SMS inbox and spam folder. If you still don't see it after 2 minutes, click 'Resend Code'. Make sure your phone number is correct.",
        },
        {
          q: "My payment failed. What now?",
          a: "Check your account balance and try again. If the issue persists, try a different payment method or contact support. No money will be deducted until payment is successful.",
        },
      ],
    },
  ];

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

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
              href="/support"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Need More Help?
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Find answers to common questions about Tsumi
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const index = catIndex * 100 + faqIndex;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={faqIndex}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No FAQs found matching your search.
                </p>
                <Link
                  href="/support"
                  className="text-gray-900 dark:text-white hover:underline font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-16 bg-gray-900 dark:bg-white rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white dark:text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 dark:text-gray-600 mb-8">
              Our support team is here to help 24/7
            </p>
            <Link
              href="/support"
              className="inline-block px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

