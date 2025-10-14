"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  History,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Package,
  ShoppingBag,
  Clipboard,
  Truck,
  FileText,
} from "lucide-react";

export default function AgentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data
  const jobHistory = [
    {
      id: "ERR-001",
      title: "Document pickup from Ridge office",
      type: "document_pickup",
      status: "completed",
      customer: {
        name: "Kwame Mensah",
        phone: "+233 24 123 4567",
        rating: 4.7,
      },
      pickup: "Ridge Office Complex, Accra",
      dropoff: "East Legon Residential Area",
      payment: {
        amount: 35,
        tip: 5,
        total: 40,
        commission: 5.25,
        netEarnings: 34.75,
      },
      timeline: {
        accepted: "2024-06-15 10:33 AM",
        started: "2024-06-15 10:40 AM",
        pickedUp: "2024-06-15 10:55 AM",
        delivered: "2024-06-15 11:12 AM",
        completed: "2024-06-15 11:15 AM",
      },
      duration: "42 minutes",
      distance: "8.5 km",
      rating: 5,
      review: "Excellent service! Very professional and delivered on time.",
      createdAt: "2024-06-15",
    },
    {
      id: "ERR-002",
      title: "Grocery delivery to Osu",
      type: "grocery_delivery",
      status: "completed",
      customer: {
        name: "Grace Addo",
        phone: "+233 24 234 5678",
        rating: 4.9,
      },
      pickup: "Shoprite, Osu",
      dropoff: "Osu Oxford Street, Accra",
      payment: {
        amount: 50,
        tip: 10,
        total: 60,
        commission: 7.5,
        netEarnings: 52.5,
      },
      timeline: {
        accepted: "2024-06-15 09:15 AM",
        started: "2024-06-15 09:20 AM",
        pickedUp: "2024-06-15 09:45 AM",
        delivered: "2024-06-15 10:05 AM",
        completed: "2024-06-15 10:08 AM",
      },
      duration: "53 minutes",
      distance: "4.2 km",
      rating: 5,
      review: "Very reliable and communicative. Will definitely use her services again.",
      createdAt: "2024-06-15",
    },
    {
      id: "ERR-003",
      title: "Food pickup from KFC",
      type: "food_delivery",
      status: "completed",
      customer: {
        name: "Kofi Darko",
        phone: "+233 24 345 6789",
        rating: 4.6,
      },
      pickup: "KFC Accra Mall",
      dropoff: "Community 18, Tema",
      payment: {
        amount: 25,
        tip: 3,
        total: 28,
        commission: 3.75,
        netEarnings: 24.25,
      },
      timeline: {
        accepted: "2024-06-14 04:20 PM",
        started: "2024-06-14 04:25 PM",
        pickedUp: "2024-06-14 04:35 PM",
        delivered: "2024-06-14 04:50 PM",
        completed: "2024-06-14 04:52 PM",
      },
      duration: "32 minutes",
      distance: "1.8 km",
      rating: 4,
      review: "Good service overall. Minor delay but handled professionally.",
      createdAt: "2024-06-14",
    },
    {
      id: "ERR-004",
      title: "Custom task: Assemble IKEA furniture",
      type: "custom_task",
      status: "completed",
      customer: {
        name: "Abena Mensah",
        phone: "+233 24 456 7890",
        rating: 4.8,
      },
      pickup: "IKEA Store, Accra",
      dropoff: "Labone Residential Area",
      payment: {
        amount: 150,
        tip: 20,
        total: 170,
        commission: 22.5,
        netEarnings: 147.5,
      },
      timeline: {
        accepted: "2024-06-14 01:30 PM",
        started: "2024-06-14 01:35 PM",
        pickedUp: "2024-06-14 02:00 PM",
        delivered: "2024-06-14 04:00 PM",
        completed: "2024-06-14 04:05 PM",
      },
      duration: "2h 35mins",
      distance: "3.1 km",
      rating: 5,
      review: "Amazing work! Furniture assembled perfectly and very professional.",
      createdAt: "2024-06-14",
    },
    {
      id: "ERR-005",
      title: "Medical prescription pickup",
      type: "medical_delivery",
      status: "cancelled",
      customer: {
        name: "Yaw Osei",
        phone: "+233 24 567 8901",
        rating: 4.9,
      },
      pickup: "Korle Bu Teaching Hospital",
      dropoff: "Cantonments",
      payment: {
        amount: 40,
        tip: 0,
        total: 0,
        commission: 0,
        netEarnings: 0,
      },
      timeline: {
        accepted: "2024-06-13 10:00 AM",
        started: "2024-06-13 10:05 AM",
        pickedUp: null,
        delivered: null,
        completed: null,
        cancelled: "2024-06-13 10:30 AM",
      },
      duration: "25 minutes",
      distance: "2.8 km",
      rating: null,
      review: null,
      cancellationReason: "Customer cancelled - prescription not ready",
      createdAt: "2024-06-13",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "disputed":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
      case "disputed":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const filteredJobs = jobHistory.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && job.status === selectedFilter;
  });

  const totalEarnings = jobHistory
    .filter(job => job.status === "completed")
    .reduce((sum, job) => sum + job.payment.netEarnings, 0);

  const totalJobs = jobHistory.filter(job => job.status === "completed").length;
  const averageRating = jobHistory
    .filter(job => job.rating)
    .reduce((sum, job) => sum + (job.rating || 0), 0) / jobHistory.filter(job => job.rating).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Job History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your completed jobs and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalJobs}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">₵{totalEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-950 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">47m</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Duration</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Job History */}
      <div className="space-y-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {getTypeIcon(job.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-mono">{job.id}</span>
                        <span>•</span>
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {job.customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {job.customer.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {job.customer.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Pickup</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{job.pickup}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Dropoff</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{job.dropoff}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {job.status === "completed" && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Timeline</div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Accepted</div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.timeline.accepted}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Started</div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.timeline.started}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Picked Up</div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.timeline.pickedUp}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Delivered</div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.timeline.delivered}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Completed</div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.timeline.completed}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Review */}
                  {job.review && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Customer Review ({job.rating}/5)
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{job.review}</p>
                    </div>
                  )}

                  {/* Cancellation Reason */}
                  {job.cancellationReason && (
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Cancellation Reason
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{job.cancellationReason}</p>
                    </div>
                  )}
                </div>

                {/* Payment & Status */}
                <div className="ml-6 text-right">
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(job.status)}
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  {job.status === "completed" && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-4 rounded-xl mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">You Earned</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        ₵{job.payment.netEarnings}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>Base: ₵{job.payment.amount}</div>
                        <div>Tip: ₵{job.payment.tip}</div>
                        <div>Commission: -₵{job.payment.commission}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
}

