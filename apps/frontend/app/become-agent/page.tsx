"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function BecomeAgentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    id_number: "",
    address: "",
    vehicle_type: "" as "" | "bicycle" | "motorbike" | "car" | "foot",
    bank_account: "",
    bank_code: "",
  });

  const benefits = [
    {
      icon: "💰",
      title: "Earn up to GHS 5,000/month",
      description: "Top agents make great money on flexible schedules",
    },
    {
      icon: "⚡",
      title: "Instant Payouts",
      description: "Access your earnings immediately after each errand",
    },
    {
      icon: "🛡️",
      title: "TsumiSafe Protection",
      description: "Insurance coverage and verified user safety",
    },
    {
      icon: "🏆",
      title: "Earn Trust Badges",
      description: "Build reputation and unlock premium earnings",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement agent signup API call
    console.log("Agent Signup:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center py-16"
          >
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>

            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-warm via-white to-electric-blue">
              Become a Tsumi Agent
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join Ghana&apos;s most trusted errand platform. Earn money on your own schedule while helping your community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-space/50 backdrop-blur-sm rounded-xl border border-gold-warm/20"
                >
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-12 py-5 bg-gold-warm hover:bg-yellow-500 text-space-black rounded-lg font-bold text-lg transition-all glow-gold"
            >
              Start Application
            </button>

            <p className="mt-6 text-gray-400">
              Already applied?{" "}
              <Link href="/auth/login" className="text-electric-blue hover:underline">
                Check Application Status
              </Link>
            </p>
          </motion.div>
        )}

        {/* Application Form */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-gold-warm">
                Tsumi
              </h1>
            </Link>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Application Progress</span>
                <span className="font-semibold">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="h-2 bg-space rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-electric-blue to-gold-warm transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-space/50 backdrop-blur-sm rounded-xl p-8 border border-gold-warm/20">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">📋 Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-300">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({ ...formData, first_name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-300">Last Name</label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({ ...formData, last_name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 24 813 8722"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                        minLength={8}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Residential Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Verification */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">🪪 Verification & KYC</h3>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Ghana Card / Voter ID Number
                      </label>
                      <input
                        type="text"
                        value={formData.id_number}
                        onChange={(e) =>
                          setFormData({ ...formData, id_number: e.target.value })
                        }
                        placeholder="GHA-XXXXXXXXX-X"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Upload ID Photo (Front)
                      </label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gold-warm transition-all cursor-pointer">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Upload Selfie Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gold-warm transition-all cursor-pointer">
                        <div className="text-4xl mb-2">🤳</div>
                        <p className="text-gray-400">Clear selfie holding your ID</p>
                        <p className="text-sm text-gray-500 mt-2">For identity verification</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Transportation Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "foot", name: "Walking", icon: "🚶" },
                          { id: "bicycle", name: "Bicycle", icon: "🚲" },
                          { id: "motorbike", name: "Motorbike", icon: "🏍️" },
                          { id: "car", name: "Car", icon: "🚗" },
                        ].map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                vehicle_type: vehicle.id as any,
                              })
                            }
                            className={`p-4 rounded-lg transition-all ${
                              formData.vehicle_type === vehicle.id
                                ? "bg-gold-warm text-space-black"
                                : "bg-space border border-gray-700 hover:border-gray-600"
                            }`}
                          >
                            <div className="text-2xl mb-1">{vehicle.icon}</div>
                            <div className="text-sm font-semibold">{vehicle.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payout Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">💳 Payout Information</h3>

                    <div className="p-4 bg-gold-warm/10 border border-gold-warm/30 rounded-lg">
                      <p className="text-sm text-gray-300">
                        💡 Your earnings will be deposited to this account. You can also use Mobile Money.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.bank_account}
                        onChange={(e) =>
                          setFormData({ ...formData, bank_account: e.target.value })
                        }
                        placeholder="Account number"
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">Bank Name</label>
                      <select
                        value={formData.bank_code}
                        onChange={(e) =>
                          setFormData({ ...formData, bank_code: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-space rounded-lg border border-gray-700 focus:border-gold-warm focus:outline-none"
                        required
                      >
                        <option value="">Select your bank</option>
                        <option value="gcb">GCB Bank</option>
                        <option value="ecobank">Ecobank Ghana</option>
                        <option value="absa">Absa Bank Ghana</option>
                        <option value="stanbic">Stanbic Bank</option>
                        <option value="zenith">Zenith Bank</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="airteltigo">AirtelTigo Money</option>
                      </select>
                    </div>

                    <div className="p-6 bg-space rounded-lg border border-gold-warm/30">
                      <h4 className="font-semibold mb-4">✅ Application Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span>{formData.first_name} {formData.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span>{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transportation:</span>
                          <span className="capitalize">{formData.vehicle_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-gold-warm">Pending Review</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                      <input type="checkbox" className="mt-1" required />
                      <p className="text-sm text-gray-300">
                        I agree to Tsumi&apos;s Terms of Service and confirm that all information provided is accurate. I understand my application will be reviewed within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-4 bg-space border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="flex-1 py-4 bg-gold-warm hover:bg-yellow-500 text-space-black rounded-lg font-semibold transition-all glow-gold"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-gold-warm hover:bg-yellow-500 text-space-black rounded-lg font-semibold transition-all glow-gold"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

