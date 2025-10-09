"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  Search,
  Navigation as NavigationIcon,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Truck,
  ShoppingBag,
  Clipboard,
  Heart,
} from "lucide-react";

export default function AgentJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("distance");

  // Mock data
  const availableJobs = [
    {
      id: "JOB-001",
      title: "Pickup documents from Ridge office",
      type: "document_pickup",
      priority: "normal",
      distance: 2.5,
      payment: 35,
      tip: 5,
      total: 40,
      pickup: "Ridge Office Complex, Accra",
      dropoff: "East Legon Residential Area",
      customer: {
        name: "Kwame Mensah",
        rating: 4.7,
        totalOrders: 23,
        phone: "+233 24 123 4567",
      },
      description: "Need someone to pick up important business documents from my office in Ridge and deliver to my home in East Legon. Documents are in a sealed envelope at reception.",
      instructions: "Ask for envelope at reception desk, mention my name",
      estimatedTime: "45 mins",
      createdAt: "2024-06-15 10:30 AM",
      expiresAt: "2024-06-15 12:30 PM",
      images: [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
      ],
    },
    {
      id: "JOB-002",
      title: "Grocery delivery to Osu",
      type: "grocery_delivery",
      priority: "urgent",
      distance: 4.2,
      payment: 50,
      tip: 10,
      total: 60,
      pickup: "Shoprite, Osu",
      dropoff: "Osu Oxford Street, Accra",
      customer: {
        name: "Grace Addo",
        rating: 4.9,
        totalOrders: 45,
        phone: "+233 24 234 5678",
      },
      description: "Need groceries delivered from Shoprite Osu to my home. I'll provide the shopping list and payment method.",
      instructions: "Call me when you arrive at Shoprite, I'll send the list",
      estimatedTime: "1h 15mins",
      createdAt: "2024-06-15 10:15 AM",
      expiresAt: "2024-06-15 11:15 AM",
      images: [],
    },
    {
      id: "JOB-003",
      title: "Food pickup from KFC",
      type: "food_delivery",
      priority: "normal",
      distance: 1.8,
      payment: 25,
      tip: 3,
      total: 28,
      pickup: "KFC Accra Mall",
      dropoff: "Community 18, Tema",
      customer: {
        name: "Kofi Darko",
        rating: 4.6,
        totalOrders: 12,
        phone: "+233 24 345 6789",
      },
      description: "Pick up my KFC order and deliver to Community 18. Order is already paid for.",
      instructions: "Order name: Kofi Darko, ask for receipt",
      estimatedTime: "30 mins",
      createdAt: "2024-06-15 10:45 AM",
      expiresAt: "2024-06-15 12:45 PM",
      images: [],
    },
    {
      id: "JOB-004",
      title: "Custom task: Assemble IKEA furniture",
      type: "custom_task",
      priority: "high",
      distance: 3.1,
      payment: 150,
      tip: 20,
      total: 170,
      pickup: "IKEA Store, Accra",
      dropoff: "Labone Residential Area",
      customer: {
        name: "Abena Mensah",
        rating: 4.8,
        totalOrders: 67,
        phone: "+233 24 456 7890",
      },
      description: "Need someone to pick up IKEA furniture and assemble it at my home. Must have experience with furniture assembly.",
      instructions: "Bring basic tools, I'll provide the assembly manual",
      estimatedTime: "2h 30mins",
      createdAt: "2024-06-15 09:30 AM",
      expiresAt: "2024-06-15 14:30 PM",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      ],
    },
    {
      id: "JOB-005",
      title: "Medical prescription pickup",
      type: "medical_delivery",
      priority: "urgent",
      distance: 2.8,
      payment: 40,
      tip: 8,
      total: 48,
      pickup: "Korle Bu Teaching Hospital",
      dropoff: "Cantonments",
      customer: {
        name: "Yaw Osei",
        rating: 4.9,
        totalOrders: 34,
        phone: "+233 24 567 8901",
      },
      description: "Urgent medical prescription pickup from Korle Bu Hospital pharmacy. Prescription is ready for collection.",
      instructions: "Go to pharmacy, mention patient name: Yaw Osei",
      estimatedTime: "50 mins",
      createdAt: "2024-06-15 10:00 AM",
      expiresAt: "2024-06-15 11:00 AM",
      images: [],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document_pickup":
        return <Clipboard className="w-4 h-4" />;
      case "grocery_delivery":
        return <ShoppingBag className="w-4 h-4" />;
      case "food_delivery":
        return <Package className="w-4 h-4" />;
      case "custom_task":
        return <Truck className="w-4 h-4" />;
      case "medical_delivery":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
      case "high":
        return "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
      case "normal":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const filteredJobs = availableJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.dropoff.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "urgent") return matchesSearch && job.priority === "urgent";
    if (selectedFilter === "high_pay") return matchesSearch && job.payment >= 50;
    if (selectedFilter === "nearby") return matchesSearch && job.distance <= 3;
    
    return matchesSearch;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (selectedSort) {
      case "distance":
        return a.distance - b.distance;
      case "payment":
        return b.payment - a.payment;
      case "priority":
        const priorityOrder = { urgent: 3, high: 2, normal: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case "time":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredJobs.length} jobs available near you
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Update Location
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
          >
            <option value="all">All Jobs</option>
            <option value="urgent">Urgent Only</option>
            <option value="high_pay">High Pay (₵50+)</option>
            <option value="nearby">Nearby (≤3km)</option>
          </select>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
          >
            <option value="distance">Sort by Distance</option>
            <option value="payment">Sort by Payment</option>
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Time</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" />
            Favorites
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-6">
        {sortedJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium uppercase rounded-full ${getPriorityBadge(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {job.description}
                  </p>
                  
                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Pickup:</span> {job.pickup}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Dropoff:</span> {job.dropoff}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <NavigationIcon className="w-4 h-4" />
                        <span className="font-medium">Distance:</span> {job.distance} km
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Est. Time:</span> {job.estimatedTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Posted:</span> {job.createdAt}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Expires:</span> {job.expiresAt}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 font-semibold">
                          {job.customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {job.customer.name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Star className="w-4 h-4 text-gray-500" />
                            {job.customer.rating} ({job.customer.totalOrders} orders)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {job.instructions && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            Special Instructions
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {job.instructions}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {job.images.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reference Images
                      </div>
                      <div className="flex gap-2">
                        {job.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Reference ${imgIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment & Actions */}
                <div className="ml-6 text-right">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">You Earn</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      ₵{job.total}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ₵{job.payment} + ₵{job.tip} tip
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Accept Job
                    </button>
                    <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" />
                      Save for Later
                    </button>
                    <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Not Interested
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedJobs.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Refresh Jobs
          </button>
        </div>
      )}
    </div>
  );
}
