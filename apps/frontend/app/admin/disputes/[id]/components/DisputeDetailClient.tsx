"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, User, Package, DollarSign, Clock, FileText, MessageSquare, CheckCircle, XCircle, Scale, Send } from "lucide-react";

interface DisputeDetailClientProps {
  id: string;
}

export default function DisputeDetailClient({ id }: DisputeDetailClientProps) {
  const [resolution, setResolution] = useState("");
  const [message, setMessage] = useState("");

  // Mock data
  const dispute = {
    id: id,
    errandId: "ERR-12349",
    title: "Payment not received",
    category: "payment",
    status: "investigating",
    priority: "high",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T14:20:00Z",
    customer: {
      id: "CUST-001",
      name: "Kwame Mensah",
      email: "kwame@example.com",
      phone: "+233 24 123 4567",
    },
    agent: {
      id: "AGENT-002",
      name: "Ama Serwaa",
      email: "ama@example.com",
      phone: "+233 24 234 5678",
    },
    errand: {
      id: "ERR-12349",
      title: "Pick up documents from Ridge",
      amount: 45,
      status: "completed",
    },
    description: "The agent completed the errand but I haven't received my payment back. The errand was marked as completed but the money is still held in escrow.",
    evidence: [
      {
        id: "1",
        type: "image",
        url: "/images/dispute-evidence-1.jpg",
        description: "Screenshot of completion notification",
        uploadedBy: "customer",
        uploadedAt: "2024-06-15T10:45:00Z",
      },
      {
        id: "2",
        type: "message",
        content: "I completed the errand at 2:30 PM as requested",
        sentBy: "agent",
        sentAt: "2024-06-15T14:30:00Z",
      },
    ],
    messages: [
      {
        id: "1",
        sender: "customer",
        message: "I haven't received my payment back yet. Can you help?",
        timestamp: "2024-06-15T10:30:00Z",
      },
      {
        id: "2",
        sender: "agent",
        message: "I completed the errand successfully. The payment should be released automatically.",
        timestamp: "2024-06-15T10:35:00Z",
      },
      {
        id: "3",
        sender: "admin",
        message: "We're investigating this issue. Please provide any evidence you have.",
        timestamp: "2024-06-15T11:00:00Z",
      },
    ],
  };

  const handleSubmitResolution = () => {
    // TODO: Submit resolution to backend
    console.log("Resolution:", resolution);
    console.log("Message:", message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/disputes"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dispute Details</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {dispute.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Resolve in Favor of Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Resolve in Favor of Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dispute.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Category: {dispute.category}</span>
                  <span>Priority: {dispute.priority}</span>
                  <span>Created: {new Date(dispute.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium uppercase ${
                dispute.status === "investigating" 
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                  : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              }`}>
                {dispute.status}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{dispute.description}</p>
          </div>

          {/* Messages */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dispute.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-center' : msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'admin' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                      : msg.sender === 'customer'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parties */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Parties</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{dispute.customer.name}</p>
                  <p>{dispute.customer.email}</p>
                  <p>{dispute.customer.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Agent</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{dispute.agent.name}</p>
                  <p>{dispute.agent.email}</p>
                  <p>{dispute.agent.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Errand Details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Errand Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-white">{dispute.errand.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Title:</span>
                <span className="text-gray-900 dark:text-white">{dispute.errand.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="text-gray-900 dark:text-white">₵{dispute.errand.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="text-gray-900 dark:text-white">{dispute.errand.status}</span>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolution</h3>
            <div className="space-y-4">
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter resolution details..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg"
              />
              <button
                onClick={handleSubmitResolution}
                className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-lg"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
