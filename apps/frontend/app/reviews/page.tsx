"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Package,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [filterRating, setFilterRating] = useState("all");

  const receivedReviews = [
    {
      id: "1",
      errandId: "ERR-001",
      reviewer: "Kwame Mensah",
      reviewerType: "customer",
      rating: 5,
      comment: "Excellent service! Ama was very professional and delivered on time. Highly recommended!",
      date: "2024-01-15T16:30:00Z",
      errandTitle: "Pick up documents from Ridge office",
      tags: ["punctual", "professional", "reliable"],
    },
    {
      id: "2",
      errandId: "ERR-002",
      reviewer: "Akosua Osei",
      reviewerType: "customer",
      rating: 4,
      comment: "Good service overall. Minor delay but communication was excellent throughout.",
      date: "2024-01-14T14:20:00Z",
      errandTitle: "Grocery shopping at Shoprite",
      tags: ["good_communication", "minor_delay"],
    },
    {
      id: "3",
      errandId: "ERR-003",
      reviewer: "Yaw Boateng",
      reviewerType: "customer",
      rating: 5,
      comment: "Perfect! Everything was handled professionally. Will definitely use again.",
      date: "2024-01-13T11:45:00Z",
      errandTitle: "Bank deposit at GCB",
      tags: ["perfect", "professional", "will_repeat"],
    },
  ];

  const givenReviews = [
    {
      id: "4",
      errandId: "ERR-004",
      reviewee: "Kofi Asante",
      revieweeType: "agent",
      rating: 5,
      comment: "Great customer! Clear instructions and quick response. Easy to work with.",
      date: "2024-01-12T15:30:00Z",
      errandTitle: "Package delivery to East Legon",
      tags: ["clear_instructions", "responsive", "easy_to_work_with"],
    },
    {
      id: "5",
      errandId: "ERR-005",
      reviewee: "Efua Mensah",
      revieweeType: "agent",
      rating: 4,
      comment: "Good experience. Customer was understanding when there was a small delay.",
      date: "2024-01-11T12:15:00Z",
      errandTitle: "Document pickup from Airport",
      tags: ["understanding", "good_experience"],
    },
  ];

  const pendingReviews = [
    {
      id: "6",
      errandId: "ERR-006",
      reviewee: "Kwaku Appiah",
      revieweeType: "agent",
      errandTitle: "Grocery delivery from Melcom",
      completedAt: "2024-01-16T10:30:00Z",
    },
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      punctual: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      professional: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      reliable: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
      good_communication: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
      minor_delay: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      perfect: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      will_repeat: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
      clear_instructions: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      responsive: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
      easy_to_work_with: "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-200",
      understanding: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
      good_experience: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    };
    return tagColors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200";
  };

  const receivedFiltered = receivedReviews.filter(
    (review) => filterRating === "all" || review.rating.toString() === filterRating
  );
  const givenFiltered = givenReviews.filter(
    (review) => filterRating === "all" || review.rating.toString() === filterRating
  );

  const averageRating = receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length;
  const totalReviews = receivedReviews.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/reviews" userName="Ama Serwaa" currentRole="agent" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reviews & Ratings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your reviews and ratings
              </p>
            </div>
            {pendingReviews.length > 0 && (
              <Link
                href="/reviews/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Write Review ({pendingReviews.length})
              </Link>
            )}
          </div>

          {/* Rating Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getRatingStars(Math.round(averageRating))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {totalReviews} reviews
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = receivedReviews.filter(r => r.rating === rating).length;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-2">
                          {rating}
                        </span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("received")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "received"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Received Reviews ({receivedReviews.length})
                </button>
                <button
                  onClick={() => setActiveTab("given")}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "given"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Given Reviews ({givenReviews.length})
                </button>
                {pendingReviews.length > 0 && (
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-6 py-4 font-medium text-sm ${
                      activeTab === "pending"
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Pending Reviews ({pendingReviews.length})
                  </button>
                )}
              </nav>
            </div>

            <div className="p-6">
              {/* Filters */}
              {activeTab !== "pending" && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Filter by rating:</span>
                  </div>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {activeTab === "pending" ? (
                  pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {review.errandTitle}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {review.reviewee}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                Completed {new Date(review.completedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/reviews/new?errandId=${review.errandId}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Write Review
                        </Link>
                      </div>
                    </div>
                  ))
                ) : activeTab === "received" ? (
                  receivedFiltered.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {review.reviewer}
                              </h4>
                              <div className="flex items-center gap-1">
                                {getRatingStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {review.errandTitle}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {review.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                                >
                                  {tag.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/errands/${review.errandId}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Errand
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  givenFiltered.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {review.reviewee}
                              </h4>
                              <div className="flex items-center gap-1">
                                {getRatingStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {review.errandTitle}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {review.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                                >
                                  {tag.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/errands/${review.errandId}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Errand
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {(activeTab === "received" ? receivedFiltered.length : givenFiltered.length) === 0 && activeTab !== "pending" && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No reviews found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filterRating !== "all"
                      ? "Try adjusting your rating filter"
                      : "Your reviews will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
