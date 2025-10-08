"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, DollarSign, TrendingUp, Shield, Zap } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Pay As You Go",
      icon: DollarSign,
      price: "Free",
      description: "Perfect for occasional errands",
      features: [
        "15% platform fee per errand",
        "Standard matching speed",
        "Basic support",
        "TsumiSafe Escrow included",
        "Live tracking",
        "In-app chat",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Tsumi Plus",
      icon: Zap,
      price: "GHS 29",
      period: "/month",
      description: "For regular users who want more",
      features: [
        "10% platform fee (save 5%)",
        "Priority matching",
        "24/7 premium support",
        "TsumiSafe Escrow included",
        "Live tracking",
        "In-app chat",
        "Exclusive offers & discounts",
        "Repeat errand templates",
      ],
      cta: "Subscribe Now",
      popular: true,
    },
    {
      name: "Business",
      icon: TrendingUp,
      price: "Custom",
      description: "For businesses with regular needs",
      features: [
        "Custom platform fee rates",
        "Dedicated account manager",
        "API access",
        "Bulk errand scheduling",
        "Invoice & reporting",
        "Multiple team members",
        "Priority support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const agentEarnings = [
    { errands: "1-10", percentage: "85%", fee: "15% platform fee" },
    { errands: "11-50", percentage: "87%", fee: "13% platform fee" },
    { errands: "51-100", percentage: "90%", fee: "10% platform fee" },
    { errands: "100+", percentage: "92%", fee: "8% platform fee" },
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
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works for you. No hidden fees, ever.
            </p>
          </div>

          {/* Customer Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <div
                  key={i}
                  className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 ${
                    plan.popular
                      ? "border-gray-900 dark:border-white shadow-2xl scale-105"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.price}
                      {plan.period && (
                        <span className="text-lg text-gray-600 dark:text-gray-400">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold mb-8 transition-all ${
                      plan.popular
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Agent Earnings */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-12 border border-gray-200 dark:border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950 rounded-full mb-4">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  For Tsumi Agents
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Agent Earnings Tiers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The more errands you complete, the more you earn. Performance-based rewards.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Errands Completed
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      You Keep
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Platform Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {agentEarnings.map((tier, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {tier.errands}
                      </td>
                      <td className="px-6 py-4 text-green-600 dark:text-green-400 font-bold text-lg">
                        {tier.percentage}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{tier.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/become-agent"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Become a Tsumi Agent
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mt-20">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Pricing FAQs
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Are there any hidden fees?",
                  a: "No. The platform fee shown is the only fee you pay. What you see is what you get.",
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, you can cancel Tsumi Plus at any time. No questions asked.",
                },
                {
                  q: "How do agent payouts work?",
                  a: "Agents receive their earnings immediately after each errand completion. You can withdraw to your bank or Mobile Money wallet instantly.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

