"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import React, { useState } from "react";

export default function KYCReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [agentId, setAgentId] = useState<string>("");

  // Resolve params when component mounts
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setAgentId(resolvedParams.id);
    });
  }, [params]);

  // Mock data
  const agent = {
    id: agentId,
    name: "Ama Serwaa",
    email: "ama@example.com",
    phone: "+233 24 234 5678",
    address: "Osu, Accra, Ghana",
    submittedDate: "2024-06-15 10:30 AM",
    documents: {
      idFront: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
      idBack: "https://images.unsplash.com/photo-1589476578633-abbd82b17bbe?w=800",
      selfie: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800",
    },
    idDetails: {
      fullName: "AMA SERWAA MENSAH",
      cardNumber: "GHA-123456789-0",
      dateOfBirth: "15-03-1992",
      expiryDate: "15-03-2032",
      issueDate: "16-03-2022",
    },
  };

  const checklist = [
    { id: "1", label: "ID document is clear and readable", checked: true },
    { id: "2", label: "Face matches selfie photo", checked: true },
    { id: "3", label: "ID is not expired", checked: true },
    { id: "4", label: "Address is valid and verifiable", checked: true },
    { id: "5", label: "No signs of tampering or forgery", checked: true },
    { id: "6", label: "Name matches application details", checked: true },
  ];

  const rejectionReasons = [
    "Unclear or blurry photos",
    "Face does not match selfie",
    "ID document expired",
    "Document appears tampered",
    "Missing required information",
    "Duplicate account detected",
    "Other (specify in notes)",
  ];

  const handleSubmit = () => {
    if (decision === "approve") {
      console.log("Approving KYC for agent:", agent.id);
      alert("KYC Approved! Agent can now accept errands.");
    } else if (decision === "reject") {
      console.log("Rejecting KYC:", { reason: rejectionReason, notes });
      alert("KYC Rejected. Agent will be notified.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/agents/${agent.id}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KYC Review</h1>
            <p className="text-gray-600 dark:text-gray-400">Agent ID: {agent.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 text-sm font-medium uppercase">
            Pending Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Applicant Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Full Name</div>
                <div className="font-medium text-gray-900 dark:text-white">{agent.name}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Ghana Card Number</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.idDetails.cardNumber}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Email</div>
                <div className="font-medium text-gray-900 dark:text-white">{agent.email}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Phone</div>
                <div className="font-medium text-gray-900 dark:text-white">{agent.phone}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Address</div>
                <div className="font-medium text-gray-900 dark:text-white">{agent.address}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Submitted</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.submittedDate}
                </div>
              </div>
            </div>
          </div>

          {/* ID Details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ghana Card Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Name on Card</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.idDetails.fullName}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Card Number</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.idDetails.cardNumber}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Date of Birth</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.idDetails.dateOfBirth}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Issue Date</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {agent.idDetails.issueDate}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">Expiry Date</div>
                <div className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {agent.idDetails.expiryDate} (Valid)
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Submitted Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ID Front */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghana Card (Front)
                </div>
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage(agent.documents.idFront)}>
                  <img
                    src={agent.documents.idFront}
                    alt="ID Front"
                    className="w-full aspect-[3/2] object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* ID Back */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghana Card (Back)
                </div>
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage(agent.documents.idBack)}>
                  <img
                    src={agent.documents.idBack}
                    alt="ID Back"
                    className="w-full aspect-[3/2] object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Selfie */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selfie Photo
                </div>
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage(agent.documents.selfie)}>
                  <img
                    src={agent.documents.selfie}
                    alt="Selfie"
                    className="w-full aspect-[3/2] object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Lightbox */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <img
                src={selectedImage}
                alt="Document"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Right Column - Review Actions */}
        <div className="space-y-6">
          {/* Verification Checklist */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Verification Checklist
            </h3>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Decision */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review Decision
            </h3>
            <div className="space-y-3 mb-4">
              <button
                onClick={() => setDecision("approve")}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
                  decision === "approve"
                    ? "border-green-600 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Approve KYC
              </button>
              <button
                onClick={() => setDecision("reject")}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
                  decision === "reject"
                    ? "border-red-600 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-red-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <XCircle className="w-5 h-5" />
                Reject KYC
              </button>
            </div>

            {/* Rejection Reason */}
            {decision === "reject" && (
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a reason...</option>
                    {rejectionReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes (Internal)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add any internal notes about this review..."
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!decision || (decision === "reject" && !rejectionReason)}
              className="w-full mt-4 px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Submit Review
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  Your decision will immediately affect the agent's ability to accept errands.
                  Ensure all verification steps are complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

