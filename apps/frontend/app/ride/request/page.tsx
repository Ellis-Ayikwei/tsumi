"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function RideRequestPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<null | {
    distanceKm?: number;
    duration?: string;
    price?: number;
  }>(null);
  const [message, setMessage] = useState<string>("");

  async function createRequest() {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: "instant",
          contact_name: "Rider",
          journey_stops: [
            { type: "pickup", address: pickup },
            { type: "dropoff", address: dropoff },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create request");
      setMessage(`Request created. Tracking: ${data.tracking_number || "N/A"}`);
    } catch (e: any) {
      setMessage(e.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function getEstimate() {
    setEstimating(true);
    setEstimate(null);
    setMessage("");
    try {
      // Create draft request first to leverage backend distance + pricing
      const res = await fetch(`${API_BASE}/api/requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: "instant",
          contact_name: "Rider",
          journey_stops: [
            { type: "pickup", address: pickup },
            { type: "dropoff", address: dropoff },
          ],
        }),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created?.error || "Failed to draft request");

      // Ask backend for price forecast
      const forecast = await fetch(
        `${API_BASE}/api/requests/${created.request_id}/price_forecast/`,
        { method: "GET" }
      );
      const fjson = await forecast.json();
      if (!forecast.ok) throw new Error(fjson?.error || "Failed to estimate");

      setEstimate({
        distanceKm: Number(created.estimated_distance) || undefined,
        duration: created.estimated_duration || undefined,
        price: fjson?.price_forecast?.total_price,
      });
    } catch (e: any) {
      setMessage(e.message || "Failed to estimate");
    } finally {
      setEstimating(false);
    }
  }

  const disabled = !pickup || !dropoff;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Request a Ride</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Pickup</label>
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. Main Gate"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dropoff</label>
          <input
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="e.g. Library"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={getEstimate}
          disabled={disabled || estimating}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {estimating ? "Estimating..." : "Estimate Fare"}
        </button>
        <button
          onClick={createRequest}
          disabled={disabled || submitting}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>

      {estimate && (
        <div className="rounded border p-4 space-y-1">
          <div className="font-medium">Estimate</div>
          {estimate.distanceKm !== undefined && (
            <div>Distance: {estimate.distanceKm} km</div>
          )}
          {estimate.duration && <div>Duration: {estimate.duration}</div>}
          {estimate.price !== undefined && <div>Fare: {estimate.price}</div>}
        </div>
      )}

      {message && (
        <div className="text-sm text-gray-700 border rounded p-3">{message}</div>
      )}
    </div>
  );
}
