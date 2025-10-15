"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, User, Package, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Navigation as NavigationIcon, Image as ImageIcon, FileText, Star, Ban, RefreshCw } from "lucide-react";

interface ErrandDetailClientProps {
  id: string;
}

export default function ErrandDetailClient({ id }: ErrandDetailClientProps) {
  // Mock data
  const errand = {
    id: id,
    title: "Pick up documents from Ridge office",
    description: "Need someone to pick up important business documents from my office in Ridge and deliver to my home in East Legon. Documents are in a sealed envelope at reception.",
    status: "completed",
    priority: "high",
    amount: 45,
    commission: 4.5,
    agentPayout: 40.5,
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-06-15T15:30:00Z",
    assignedAt: "2024-06-15T09:15:00Z",
    startedAt: "2024-06-15T10:00:00Z",
    completedAt: "2024-06-15T15:30:00Z",
    customer: {
      id: "CUST-001",
      name: "Kwame Mensah",
      email: "kwame@example.com",
      phone: "+233 24 123 4567",
      rating: 4.8,
    },
    agent: {
      id: "AGENT-002",
      name: "Ama Serwaa",
      email: "ama@example.com",
      phone: "+233 24 234 5678",
      rating: 4.9,
    },
    pickup: {
      address: "Ridge Office Complex, Ridge, Accra",
      latitude: 5.6037,
      longitude: -0.1870,
      notes: "Documents are at reception desk in a sealed envelope",
    },
    delivery: {
      address: "East Legon, Accra",
      latitude: 5.6500,
      longitude: -0.1500,
      notes: "Leave with security guard if not home",
    },
    timeline: [
      {
        id: "1",
        status: "created",
        timestamp: "2024-06-15T09:00:00Z",
        description: "Errand created by customer",
      },
      {
        id: "2",
        status: "assigned",
        timestamp: "2024-06-15T09:15:00Z",
        description: "Assigned to Ama Serwaa",
      },
      {
        id: "3",
        status: "started",
        timestamp: "2024-06-15T10:00:00Z",
        description: "Agent started the errand",
      },
      {
        id: "4",
        status: "completed",
        timestamp: "2024-06-15T15:30:00Z",
        description: "Errand completed successfully",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/errands"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Errand Details</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {errand.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Contact Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors">
            <Ban className="w-4 h-4" />
            Cancel Errand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Errand Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {errand.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{errand.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Priority: {errand.priority}</span>
                  <span>Created: {new Date(errand.createdAt).toLocaleDateString()}</span>
                  <span>Amount: ₵{errand.amount}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium uppercase ${
                errand.status === "completed" 
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : errand.status === "in_progress"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
              }`}>
                {errand.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
            <div className="space-y-4">
              {errand.timeline.map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {event.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="text-gray-900 dark:text-white">{errand.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{errand.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="text-gray-900 dark:text-white">{errand.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <span className="text-gray-900 dark:text-white">{errand.customer.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Agent */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agent</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="text-gray-900 dark:text-white">{errand.agent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{errand.agent.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="text-gray-900 dark:text-white">{errand.agent.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <span className="text-gray-900 dark:text-white">{errand.agent.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="text-gray-900 dark:text-white">₵{errand.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Commission:</span>
                <span className="text-gray-900 dark:text-white">₵{errand.commission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Agent Payout:</span>
                <span className="text-gray-900 dark:text-white">₵{errand.agentPayout}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

