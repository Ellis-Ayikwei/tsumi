"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  MapPin,
  CheckCircle,
  ArrowRight,
  Users,
  Wallet,
  Clock,
  Star,
  Package,
  Phone,
  Mail,
  MapPinned,
  Twitter,
  Facebook,
  Instagram,
  TrendingUp,
  Award,
  Smartphone,
  CreditCard,
  BadgeCheck,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";



function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tsumi",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    logo: "/favicon.ico",
    sameAs: [
      "https://twitter.com/tsumi",
      "https://facebook.com/tsumi",
      "https://instagram.com/tsumi",
    ],
    description:
      "Premium errand and delivery platform in Ghana. Verified agents, escrow payments, live tracking.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@tsumi.gh",
      telephone: "+233248138722",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  const steps = [
    {
      icon: Smartphone,
      title: "Create Your Request",
      description: "Tell us what you need done with a few simple details",
    },
    {
      icon: Users,
      title: "Get Matched",
      description: "We connect you with verified, trusted Tsumi Agents nearby",
    },
    {
      icon: MapPin,
      title: "Track Live",
      description: "Watch your errand in real-time with GPS tracking",
    },
    {
      icon: CheckCircle,
      title: "Done & Delivered",
      description: "Confirm completion and rate your experience",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Errands Completed" },
    { value: "500+", label: "Verified Agents" },
    { value: "4.9", label: "Average Rating" },
    { value: "15min", label: "Avg Response Time" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tsumi</h1>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                How It Works
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                About
              </a>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}

              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 mb-6">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Trusted by thousands in Ghana
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Send Me. <br />
              <span className="text-gray-600 dark:text-gray-400">Safely.</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Ghana's premium errand and delivery platform. Get things done with verified runners, secure escrow payments, and real-time tracking.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/request-errand"
              className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              Request Errand
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/become-agent"
              className="group flex px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 font-medium rounded-xl transition-all duration-200 hover:border-gray-900 dark:hover:border-white hover:scale-105"
            >
              Become an Agent
              <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-y-[-2px] transition-transform" />
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative overflow-hidden aspect-video max-w-4xl mx-auto border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
              alt="Tsumi Platform - Delivery and Errand Services in Ghana"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
              <div className="p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-medium">Trusted Platform</span>
                </div>
                <p className="text-lg font-semibold">Real-time tracking, verified agents, secure payments</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Tsumi?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for trust, designed for speed. Experience the safest way to get errands done in Ghana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-950/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-6">
                  <BadgeCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Verified Agents Only
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Every Tsumi Agent goes through rigorous KYC verification. ID checks, background screening, and trust badges you can rely on.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Ghana Card verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Photo & selfie matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Performance-based trust scores
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-950/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  TsumiSafe Escrow
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Your money is held securely until the errand is completed. No disputes, no worries. Payments powered by Paystack and Mobile Money.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Secure escrow protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    MTN, Vodafone, AirtelTigo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Instant payouts
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-950/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Live GPS Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Know exactly where your agent is, every step of the way. Real-time updates, in-app chat, and instant notifications.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Real-time location sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    ETA updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Direct messaging
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How Tsumi Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Getting errands done has never been easier. Four simple steps to peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white dark:text-gray-900" />
                    </div>
                    <div className="text-sm font-bold text-gray-400 mb-2">STEP {i + 1}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Built for Ghana, Trusted by Thousands
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Tsumi was born from a simple need: a reliable, trustworthy way to get errands done in Accra and beyond. We understand the importance of trust in Ghana, which is why every feature is designed with safety and transparency in mind.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                From document pickups in Ridge to grocery deliveries in Osu, Tsumi Agents are ready to help. Our platform combines world-class technology with local understanding.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Local First</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Built by Ghanaians, for Ghanaians</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">MoMo Ready</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">MTN, Vodafone, AirtelTigo supported</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden aspect-square border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  alt="Tsumi Team - Building trust in Ghana's delivery ecosystem"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 dark:text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Ghanaians who trust Tsumi for their daily errands. Sign up in minutes and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-errand"
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-xl hover:scale-105 transition-transform"
              >
                Request Your First Errand
              </Link>
              <Link
                href="/become-agent"
                className="px-8 py-4 bg-transparent text-white dark:text-gray-900 border-2 border-white dark:border-gray-900 font-medium rounded-xl hover:bg-white/10 dark:hover:bg-gray-900/10 transition-all"
              >
                Start Earning as an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tsumi</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Ghana's trusted errand and delivery platform. Send Me. Safely.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#features" className="hover:text-gray-900 dark:hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link href="/wallet" className="hover:text-gray-900 dark:hover:text-white">
                    TsumiSafe Wallet
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#about" className="hover:text-gray-900 dark:hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <Link href="/become-agent" className="hover:text-gray-900 dark:hover:text-white">
                    Become an Agent
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@tsumi.gh
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +233 24 813 8722
                </li>
                <li className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  Accra, Ghana
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Tsumi. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
{/* JSON-LD */}
    <JsonLd />
    </div>
  );
}


