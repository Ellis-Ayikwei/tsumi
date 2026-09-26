"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content:
        "We collect information you provide directly (name, phone, email, Ghana Card details for runners), location data for tracking, payment information, and usage data. We use cookies and similar technologies to improve your experience.",
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content:
        "We use your data to: provide and improve services, match customers with runners, process payments, verify runner identity, send notifications, prevent fraud, comply with legal obligations, and personalize your experience.",
    },
    {
      icon: Lock,
      title: "Data Security",
      content:
        "We implement industry-standard security measures including encryption, secure servers, and regular security audits. Payment data is processed through certified payment processors (Paystack). However, no system is 100% secure—we encourage strong passwords and account protection.",
    },
    {
      icon: UserCheck,
      title: "Data Sharing",
      content:
        "We share limited data with: runners (customer name, phone, delivery location), payment processors, cloud service providers, and law enforcement when required by law. We NEVER sell your personal data to third parties for marketing.",
    },
    {
      icon: Shield,
      title: "Your Rights",
      content:
        "You have the right to: access your data, request corrections, delete your account, opt-out of marketing communications, and withdraw consent. Contact us at privacy@tsumi.gh to exercise these rights.",
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
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Last updated: January 2025
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-6 mb-12">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-green-900 dark:text-green-100 text-sm leading-relaxed">
                    <strong>Your Privacy Matters:</strong> At Tsumi, we take your privacy seriously.
                    This policy explains how we collect, use, and protect your personal information.
                    We&apos;re committed to transparency and giving you control over your data.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Sections */}
            <div className="space-y-6 mb-12">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {section.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Location Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We collect location data to match you with nearby runners and enable real-time
                  tracking. You can disable location access in settings, but this may limit
                  functionality.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We use cookies to remember your preferences, keep you logged in, and improve
                  performance. You can control cookies in your browser settings.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Data Retention</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We retain your data as long as your account is active or as needed for legal
                  compliance. You can request account deletion at any time.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Children&apos;s Privacy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Tsumi is not intended for users under 18. We do not knowingly collect data from
                  children. If you&apos;re a parent and believe your child has provided us data, contact
                  us.
                </p>
              </div>
            </div>

            {/* Ghana GDPR Compliance */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-8 mb-12">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Ghana Data Protection Act (DPA) Compliance
              </h3>
              <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed mb-4">
                Tsumi complies with Ghana&apos;s Data Protection Act, 2012 (Act 843). We are registered
                with the Data Protection Commission and adhere to all local data protection
                requirements.
              </p>
              <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
                For inquiries related to data protection rights under the DPA, contact our Data
                Protection Officer at dpo@tsumi.gh
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-900 dark:bg-white rounded-2xl p-8 text-center">
              <Lock className="w-12 h-12 text-white dark:text-gray-900 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">
                Questions About Your Privacy?
              </h3>
              <p className="text-gray-300 dark:text-gray-600 mb-6">
                Contact our privacy team at privacy@tsumi.gh
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Contact Us
                </Link>
                <Link
                  href="/terms"
                  className="px-6 py-3 bg-transparent text-white dark:text-gray-900 border-2 border-white dark:border-gray-900 rounded-xl font-semibold hover:bg-white/10 dark:hover:bg-gray-900/10 transition-all"
                >
                  View Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

