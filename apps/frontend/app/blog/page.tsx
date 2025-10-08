"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, TrendingUp, Sparkles } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      category: "Company News",
      title: "Introducing Tsumi: Ghana's Trusted Errand Platform",
      excerpt:
        "Today we're excited to launch Tsumi to the public. Learn about our mission and why we built this platform.",
      date: "Jan 15, 2025",
      readTime: "3 min read",
      featured: true,
    },
    {
      id: 2,
      category: "Agent Stories",
      title: "How Kwame Earns GHS 4,000/Month as a Tsumi Agent",
      excerpt:
        "Meet Kwame, one of our top-rated agents, and learn how he built a steady income stream through Tsumi.",
      date: "Jan 10, 2025",
      readTime: "5 min read",
      featured: false,
    },
    {
      id: 3,
      category: "Tips & Guides",
      title: "5 Tips for Getting the Most Out of Tsumi",
      excerpt:
        "Whether you're new to Tsumi or a regular user, these tips will help you have the best experience.",
      date: "Jan 5, 2025",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 4,
      category: "Product Updates",
      title: "Introducing TsumiSafe Escrow: Your Money, Protected",
      excerpt:
        "Learn how our escrow system keeps your payments safe until your errand is completed.",
      date: "Dec 28, 2024",
      readTime: "3 min read",
      featured: false,
    },
    {
      id: 5,
      category: "Behind the Scenes",
      title: "How We Verify Every Tsumi Agent",
      excerpt:
        "A deep dive into our KYC process and how we ensure only trustworthy agents join the platform.",
      date: "Dec 20, 2024",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 6,
      category: "Community",
      title: "Meet Our First 100 Agents",
      excerpt:
        "Celebrating the incredible people who make Tsumi possible—our verified agents across Accra.",
      date: "Dec 15, 2024",
      readTime: "4 min read",
      featured: false,
    },
  ];

  const categories = ["All", "Company News", "Agent Stories", "Tips & Guides", "Product Updates"];

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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Tsumi Blog
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              News & Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Updates, guides, and stories from the Tsumi community
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  i === 0
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {posts
            .filter((p) => p.featured)
            .map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-12 hover:shadow-xl transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-video flex items-center justify-center">
                    <TrendingUp className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                  </div>
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                      Featured
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts
              .filter((p) => !p.featured)
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-video flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium mb-3">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Load More Posts
            </button>
          </div>

          {/* Newsletter */}
          <div className="max-w-4xl mx-auto mt-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h3>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Get the latest Tsumi updates, agent stories, and tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

