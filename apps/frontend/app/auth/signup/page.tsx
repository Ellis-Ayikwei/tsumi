"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { AuthAPI } from "@/lib/api";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Tsumi account to request errands and track deliveries.",
  alternates: { canonical: "/auth/signup" },
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthAPI.register({
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
        user_type: "customer",
      });
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="w-full max-w-md border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">First name</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Last name</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-900 dark:bg.white text-white dark:text-gray-900"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account? <Link href="/auth/login" className="underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [userType, setUserType] = useState<"customer" | "agent">("customer");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup API call
    console.log("Signup:", { ...formData, user_type: userType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
              Tsumi
            </h1>
          </Link>

          <div className="bg-space/50 backdrop-blur-sm rounded-xl p-8 border border-electric-blue/20">
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>

            {/* User Type Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUserType("customer")}
                className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                  userType === "customer"
                    ? "bg-electric-blue text-white"
                    : "bg-space text-gray-400 hover:text-white"
                }`}
              >
                I need errands done
              </button>
              <button
                onClick={() => setUserType("agent")}
                className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                  userType === "agent"
                    ? "bg-gold-warm text-space-black font-semibold"
                    : "bg-space text-gray-400 hover:text-white"
                }`}
              >
                I want to earn
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 24 813 8722"
                  className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.password_confirm}
                  onChange={(e) =>
                    setFormData({ ...formData, password_confirm: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold transition-all glow-blue"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-electric-blue hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

