"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Target,
  Users,
  Shield,
  TrendingUp,
  Award,
  MapPin,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust First",
      description: "Every feature we build starts with trust and safety at its core",
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "We design for real people solving real problems in Ghana",
    },
    {
      icon: TrendingUp,
      title: "Empower Agents",
      description: "We help everyday Ghanaians earn dignified income on their terms",
    },
    {
      icon: Star,
      title: "Simple & Beautiful",
      description: "World-class technology that feels intuitive and delightful",
    },
  ];

  const team = [
    { name: "Kwame Mensah", role: "CEO & Co-Founder", location: "Accra" },
    { name: "Ama Osei", role: "CTO & Co-Founder", location: "Kumasi" },
    { name: "Kofi Asante", role: "Head of Operations", location: "Accra" },
    { name: "Abena Boateng", role: "Head of Trust & Safety", location: "Tema" },
  ];

  const milestones = [
    { year: "2024", title: "Founded", description: "Tsumi is born in Accra" },
    { year: "2024", title: "Beta Launch", description: "First 100 errands completed" },
    { year: "2025", title: "Public Launch", description: "Available across Greater Accra" },
    { year: "2025", title: "Expansion", description: "Coming to Kumasi and Takoradi" },
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
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 mb-6">
              <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Built by Ghanaians,<br />For Ghana
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tsumi started from a simple problem: finding someone trustworthy to run errands in
              Accra. We built the platform we wished existed—one that prioritizes trust, safety,
              and empowering everyday Ghanaians.
            </p>
          </div>

          {/* Mission */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-gray-900 dark:text-white" />
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  To become Africa&apos;s most trusted errand and delivery platform—where customers get
                  peace of mind and agents earn dignified income.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We believe technology should empower people, not replace them. Every feature we
                  build is designed to create trust, save time, and improve lives.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl aspect-video flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Mission Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Our Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-gray-900 dark:text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Meet the Team
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
              A passionate team of builders, operators, and dreamers committed to transforming
              errands in Ghana.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.role}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {member.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Our Journey
            </h3>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block" />

                <div className="space-y-8">
                  {milestones.map((milestone, i) => (
                    <div key={i} className="relative flex items-start gap-6">
                      <div className="hidden md:flex w-16 h-16 rounded-full bg-gray-900 dark:bg-white items-center justify-center text-white dark:text-gray-900 font-bold flex-shrink-0 relative z-10">
                        {milestone.year}
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {milestone.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 dark:bg-white rounded-3xl p-12 mb-20">
            <h3 className="text-3xl font-bold text-white dark:text-gray-900 text-center mb-12">
              Our Impact So Far
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10,000+", label: "Errands Completed" },
                { value: "500+", label: "Active Agents" },
                { value: "GHS 500K+", label: "Earned by Agents" },
                { value: "4.9/5", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white dark:text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 dark:text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-16 h-16 text-gray-900 dark:text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Join Us on This Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a customer looking for reliable errand services or someone looking to
              earn as a Tsumi Agent, we&apos;d love to have you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-errand"
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Request an Errand
              </Link>
              <Link
                href="/become-agent"
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 rounded-xl font-semibold hover:border-gray-900 dark:hover:border-white transition-all"
              >
                Become an Agent
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

