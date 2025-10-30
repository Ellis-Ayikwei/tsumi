"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Campus Ride, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.",
    },
    {
      title: "2. Description of Service",
      content:
        "Campus Ride connects riders (students) with verified campus drivers for on-campus transportation. We are a technology platform and not a transportation carrier. All trips are performed by independent drivers.",
    },
    {
      title: "3. User Accounts",
      content:
        "You must register for an account to use Campus Ride. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.",
    },
    {
      title: "4. KYC Verification for Agents",
      content:
        "All Campus Ride drivers must complete verification including valid campus ID, driver’s license, vehicle documents, and safety checks. Campus Ride reserves the right to reject or suspend any driver who fails verification or violates our standards.",
    },
    {
      title: "5. Payment Terms",
      content:
        "Riders agree to pay all fares associated with trips. Payments are processed securely via supported methods. Platform commission ranges from 15–20% per ride. Drivers receive weekly payouts of completed trip earnings.",
    },
    {
      title: "6. TsumiSafe Escrow",
      content:
        "For certain payment methods, funds may be held until trip completion is confirmed. In case of disputes, Campus Ride may investigate and determine appropriate fund distribution at its discretion.",
    },
    {
      title: "7. Cancellation & Refunds",
      content:
        "Customers may cancel errands before agent acceptance for a full refund. After acceptance, cancellation may incur a fee. Agents may decline errands before acceptance but repeated declines may affect their standing. Refunds are processed to the original payment method within 3-5 business days.",
    },
    {
      title: "8. User Conduct",
      content:
        "Users must not use Campus Ride for illegal activities, harassment, fraud, or any prohibited purposes. Drivers must complete trips professionally and safely. Riders must provide accurate information and treat drivers with respect. Violation may result in account suspension or termination.",
    },
    {
      title: "9. Prohibited Items",
      content:
        "The following activities are prohibited on Campus Ride: transporting illegal substances, weapons, hazardous materials, or engaging in unsafe behavior. Drivers should refuse any ride that violates laws or safety policies.",
    },
    {
      title: "10. Liability & Disclaimers",
      content:
        "Campus Ride is not liable for actions of drivers or riders. We provide the platform but do not guarantee trip outcomes. Users agree to hold Campus Ride harmless from any claims arising from platform use. Service is provided 'as is' without warranties.",
    },
    {
      title: "11. Dispute Resolution",
      content:
        "In case of disputes between riders and drivers, contact Campus Ride support. We will mediate fairly but reserve the right to make final decisions on fund distribution and account status. For legal disputes, parties agree to arbitration in Accra, Ghana.",
    },
    {
      title: "12. Changes to Terms",
      content:
        "Campus Ride reserves the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of new terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Ride</h1>
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
              <div className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
                <FileText className="w-6 h-6 text-white dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Terms of Service
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Last updated: January 2025
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-6 mb-12">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
                    <strong>Important:</strong> Please read these terms carefully before using
                    Campus Ride. By using our platform, you agree to these terms. If you disagree with
                    any part, please do not use our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-12 bg-gray-900 dark:bg-white rounded-2xl p-8 text-center">
              <Shield className="w-12 h-12 text-white dark:text-gray-900 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-gray-300 dark:text-gray-600 mb-6">
                Contact our legal team at legal@campusride.gh
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

