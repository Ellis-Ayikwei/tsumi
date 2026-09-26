"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShoppingBag,
  Heart,
  Gift,
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
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    pickupLocation: "",
    deliveryLocation: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create URL with pre-filled data
    const params = new URLSearchParams({
      description: formData.description,
      pickup: formData.pickupLocation,
      delivery: formData.deliveryLocation,
      budget: formData.budget,
    });
    
    // Use Next.js router for better navigation
    router.push(`/request-errand?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-black/10 dark:via-transparent dark:to-black/10 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
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
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
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
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-black" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-gray-800/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 dark:bg-gray-800/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-200/20 dark:bg-gray-800/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                   className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full"
                >
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trusted by 10,000+ Ghanaians
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  <span className="text-gray-900 dark:text-white">Send Me.</span>
                  <br />
                  <span className="text-gray-600 dark:text-gray-400">
                    Safely.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
                >
                  Ghana&apos;s premium errand platform. Verified agents, secure payments, real-time tracking. 
                  <span className="font-semibold text-gray-900 dark:text-white">Get it done today.</span>
                </motion.p>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-6 py-6"
              >
                {stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                 <Link
                   href="/become-agent"
                   className="group flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                 >
                  <TrendingUp className="w-4 h-4" />
                  Become an Agent
                </Link>
                <Link
                  href="#how-it-works"
                  className="group flex items-center justify-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  See How It Works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Errand Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
               <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Request an Errand
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get started in under 2 minutes
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What do you need done?
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Pick up documents from Ridge"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        placeholder="From where?"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Delivery Location
                      </label>
                      <input
                        type="text"
                        name="deliveryLocation"
                        value={formData.deliveryLocation}
                        onChange={handleInputChange}
                        placeholder="To where?"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget (GHS)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="50"
                      min="10"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   >
                    {isSubmitting ? "Finding Agents..." : "Find an Agent Now"}
                  </button>
                </form>

                 <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                     <div className="flex items-center gap-2">
                       <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                       <span>Secure Payment</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                       <span>Verified Agents</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                       <span>Live Tracking</span>
                     </div>
                  </div>
                </div>
              </div>

               {/* Floating Elements */}
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-2xl rotate-12 opacity-20" />
               <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-xl -rotate-12 opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

       {/* Recommendations Section */}
       <section className="relative py-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
               Why Ghanaians Choose Tsumi
             </h2>
             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
               Real stories from real people. See how Tsumi is transforming errand services across Ghana.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
             {/* Recommendation Card 1 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-800/20 rounded-full -translate-y-16 translate-x-16" />
               <div className="relative z-10">
                 <div className="flex items-start gap-4 mb-6">
                   <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Users className="w-6 h-6 text-white dark:text-gray-300" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                       Trust & Safety First
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                       Every agent is verified with Ghana Card and background checks
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                   <div className="flex -space-x-2">
                     <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                     <div className="w-8 h-8 bg-gray-500 dark:bg-gray-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                     <div className="w-8 h-8 bg-gray-400 dark:bg-gray-300 rounded-full border-2 border-white dark:border-gray-900"></div>
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">
                     <span className="font-semibold text-gray-900 dark:text-white">500+</span> verified agents
                   </div>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                   <Star className="w-4 h-4 text-gray-600 dark:text-gray-400 fill-current" />
                   <span className="font-semibold">4.9/5</span>
                   <span>average rating</span>
                 </div>
               </div>
             </motion.div>

             {/* Recommendation Card 2 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-800/20 rounded-full -translate-y-16 translate-x-16" />
               <div className="relative z-10">
                 <div className="flex items-start gap-4 mb-6">
                   <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Clock className="w-6 h-6 text-white dark:text-gray-300" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                       Lightning Fast
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                       Average response time under 15 minutes
                     </p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                     <span className="text-sm font-semibold text-gray-900 dark:text-white">15 min</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                     <span className="text-sm font-semibold text-gray-900 dark:text-white">98%</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                     <span className="text-sm font-semibold text-gray-900 dark:text-white">99%</span>
                   </div>
                 </div>
               </div>
             </motion.div>

             {/* Recommendation Card 3 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-800/20 rounded-full -translate-y-16 translate-x-16" />
               <div className="relative z-10">
                 <div className="flex items-start gap-4 mb-6">
                   <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Wallet className="w-6 h-6 text-white dark:text-gray-300" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                       Secure Payments
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                       TsumiSafe escrow protects your money until delivery
                     </p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <div className="w-6 h-4 bg-gray-600 dark:bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">MTN</div>
                     <div className="w-6 h-4 bg-gray-600 dark:bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">VF</div>
                     <div className="w-6 h-4 bg-gray-600 dark:bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">AT</div>
                     <span className="ml-2">Mobile Money</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <CreditCard className="w-4 h-4" />
                     <span>Card payments via Paystack</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                     <span>100% secure escrow</span>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>

       {/* Features Section */}
       <section id="features" className="relative py-20 bg-gray-50 dark:bg-black/50">
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
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-gray-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-blue-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                   <BadgeCheck className="w-7 h-7 text-blue-600 dark:text-gray-300" />
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
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-gray-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                   <Shield className="w-7 h-7 text-gray-600 dark:text-gray-400" />
                 </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  TsumiSafe Escrow
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Your money is held securely until the errand is completed. No disputes, no worries. Payments powered by Paystack and Mobile Money.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    Secure escrow protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    MTN, Vodafone, AirtelTigo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    Instant payouts
                  </li>
                </ul>
              </div>
            </div>

             <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-gray-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                   <MapPin className="w-7 h-7 text-gray-600 dark:text-gray-400" />
                 </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Live GPS Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Know exactly where your agent is, every step of the way. Real-time updates, in-app chat, and instant notifications.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    Real-time location sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ETA updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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

       {/* Testimonials Section */}
       <section className="relative py-20 bg-gray-50 dark:bg-black/50">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
               What Our Users Say
             </h2>
             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
               Real experiences from real Ghanaians who trust Tsumi for their daily errands.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
             {/* Testimonial 1 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-gray-600 dark:bg-gray-400 rounded-t-2xl"></div>
               <div className="flex items-center gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 text-gray-600 dark:text-gray-400 fill-current" />
                 ))}
               </div>
               <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                 &quot;Tsumi saved me so much time! I needed documents picked up from Ridge and delivered to my office in Osu. The agent was professional, tracked the whole journey, and delivered in under 2 hours.&quot;
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center">
                   <span className="text-white font-semibold text-sm">AK</span>
                 </div>
                 <div>
                   <div className="font-semibold text-gray-900 dark:text-white">Ama Kwarteng</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Business Owner, Osu</div>
                 </div>
               </div>
             </motion.div>

             {/* Testimonial 2 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-gray-600 dark:bg-gray-400 rounded-t-2xl"></div>
               <div className="flex items-center gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 text-gray-600 dark:text-gray-400 fill-current" />
                 ))}
               </div>
               <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                 &quot;As a busy professional, I use Tsumi weekly for grocery shopping and pharmacy runs. The agents are always reliable, and the payment system is so secure. I never worry about my money.&quot;
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center">
                   <span className="text-white font-semibold text-sm">KO</span>
                 </div>
                 <div>
                   <div className="font-semibold text-gray-900 dark:text-white">Kwame Osei</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Software Engineer, Accra</div>
                 </div>
               </div>
             </motion.div>

             {/* Testimonial 3 */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-gray-600 dark:bg-gray-400 rounded-t-2xl"></div>
               <div className="flex items-center gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 text-gray-600 dark:text-gray-400 fill-current" />
                 ))}
               </div>
               <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                 &quot;I&apos;ve been using Tsumi for 6 months now. The real-time tracking feature is amazing - I can see exactly where my agent is. The customer service is also top-notch when I have questions.&quot;
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center">
                   <span className="text-white font-semibold text-sm">EM</span>
                 </div>
                 <div>
                   <div className="font-semibold text-gray-900 dark:text-white">Efua Mensah</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager, Tema</div>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>

       {/* Popular Services Section */}
       <section className="relative py-20">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
               Popular Services
             </h2>
             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
               From document delivery to grocery shopping, Tsumi agents handle it all across Ghana.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
             {[
               { icon: Package, title: "Document Delivery", description: "Legal papers, contracts, certificates", color: "bg-gray-800 dark:bg-gray-700" },
               { icon: ShoppingBag, title: "Grocery Shopping", description: "Fresh produce, household items", color: "bg-gray-800 dark:bg-gray-700" },
               { icon: Heart, title: "Pharmacy Runs", description: "Prescriptions, health supplies", color: "bg-gray-800 dark:bg-gray-700" },
               { icon: Gift, title: "Gift Delivery", description: "Surprise deliveries, special occasions", color: "bg-gray-800 dark:bg-gray-700" },
             ].map((service, i) => {
               const Icon = service.icon;
               return (
                <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 40 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 * i }}
                  className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                 >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500 hidden sm:block" />
                   <div className="relative z-10">
                     <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                       <Icon className="w-6 h-6 text-white dark:text-gray-300" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                       {service.title}
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                       {service.description}
                     </p>
                   </div>
                 </motion.div>
               );
             })}
           </div>
         </div>
       </section>

       {/* About Section */}
       <section id="about" className="relative py-20 bg-gray-50 dark:bg-black/50">
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
                   <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                     <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                   </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Local First</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Built by Ghanaians, for Ghanaians</div>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                     <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
           <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Ghanaians who trust Tsumi for their daily errands. Sign up in minutes and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-errand"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:scale-105 transition-transform"
              >
                Request Your First Errand
              </Link>
              <Link
                href="/become-agent"
                className="px-8 py-4 bg-transparent text-white dark:text-white border-2 border-white dark:border-gray-600 font-medium rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all"
              >
                Start Earning as an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tsumi</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Ghana&apos;s trusted errand and delivery platform. Send Me. Safely.
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


