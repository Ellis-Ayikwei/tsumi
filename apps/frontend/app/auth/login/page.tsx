"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { AuthAPI, setAuthTokens } from "@/lib/api";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Tsumi account to manage errands and payments.",
  alternates: { canonical: "/auth/login" },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login(email, password);
      if (res.access) setAuthTokens(res.access, (res as any).refresh);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="w-full max-w-md border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          No account? <Link href="/auth/signup" className="underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login API call
    console.log("Login:", formData);
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
            <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

            {/* Login Method Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  loginMethod === "phone"
                    ? "bg-electric-blue text-white"
                    : "bg-space text-gray-400 hover:text-white"
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  loginMethod === "email"
                    ? "bg-electric-blue text-white"
                    : "bg-space text-gray-400 hover:text-white"
                }`}
              >
                Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  {loginMethod === "phone" ? "Phone Number" : "Email Address"}
                </label>
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  placeholder={
                    loginMethod === "phone" ? "+233 24 813 8722" : "you@example.com"
                  }
                  className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  required
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
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-electric-blue hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-electric-blue hover:bg-blue-600 rounded-lg font-semibold transition-all glow-blue"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-space text-gray-400">Or continue with</span>
                </div>
              </div>

              <button className="mt-4 w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>

            <p className="mt-6 text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-electric-blue hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

