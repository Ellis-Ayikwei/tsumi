"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Package,
  User,
  Send,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function NewReviewPage() {
  const searchParams = useSearchParams();
  const errandId = searchParams.get("errandId");
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in real app, this would come from API
  const errandData = {
    id: errandId || "ERR-006",
    title: "Grocery delivery from Melcom",
    agent: "Kwaku Appiah",
    customer: "Ama Serwaa",
    completedAt: "2024-01-16T10:30:00Z",
    amount: 75,
  };

  const availableTags = [
    { id: "punctual", label: "Punctual", icon: Clock },
    { id: "professional", label: "Professional", icon: Shield },
    { id: "reliable", label: "Reliable", icon: ThumbsUp },
    { id: "good_communication", label: "Good Communication", icon: MessageSquare },
    { id: "friendly", label: "Friendly", icon: User },
    { id: "efficient", label: "Efficient", icon: Package },
    { id: "helpful", label: "Helpful", icon: ThumbsUp },
    { id: "clean", label: "Clean & Tidy", icon: Shield },
    { id: "will_repeat", label: "Will Use Again", icon: ThumbsUp },
  ];

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle successful submission
    }, 2000);
  };

  const getRatingStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => setRating(i + 1)}
        className={`w-8 h-8 transition-colors ${
          i < currentRating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
        }`}
      >
        <Star className="w-full h-full" />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentPage="/reviews" userName="Ama Serwaa" currentRole="customer" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/reviews"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Write a Review
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share your experience with this errand
              </p>
            </div>
          </div>

          {/* Errand Details */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Errand Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {errandData.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Errand ID: {errandData.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {errandData.agent}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tsumi Agent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Completed {new Date(errandData.completedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amount: ₵{errandData.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How would you rate this experience?
            </h3>
            <div className="flex items-center gap-2 mb-4">
              {getRatingStars(rating)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rating === 0 && "Select a rating"}
              {rating === 1 && "Poor - Very disappointed"}
              {rating === 2 && "Fair - Below expectations"}
              {rating === 3 && "Good - Met expectations"}
              {rating === 4 && "Very Good - Exceeded expectations"}
              {rating === 5 && "Excellent - Outstanding service"}
            </p>
          </div>

          {/* Comment */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tell us more about your experience
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about what went well or what could be improved..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What stood out? (Optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTags.map((tag) => {
                const Icon = tag.icon;
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${
                        isSelected 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-400"
                      }`} />
                      <span className={`text-sm font-medium ${
                        isSelected 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {tag.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Review Guidelines
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                  <li>• Be honest and constructive in your feedback</li>
                  <li>• Focus on the service quality and experience</li>
                  <li>• Avoid personal attacks or inappropriate language</li>
                  <li>• Your review helps other users make informed decisions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Your review will be visible to other users and helps maintain quality standards on Tsumi.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
