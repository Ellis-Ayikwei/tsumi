"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type RequestItem = {
  id: string;
  tracking_number?: string;
  status: string;
  base_price?: number;
  estimated_distance?: number;
  contact_name?: string;
};

export default function DriverDashboard() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadPending() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/requests/?status=pending`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setRequests(data);
    } catch (e: any) {
      setMessage(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest(id: string) {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/requests/${id}/update_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to accept");
      }
      setMessage("Accepted.");
      await loadPending();
    } catch (e: any) {
      setMessage(e.message || "Failed to accept");
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Driver Dashboard</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={loadPending}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>

      <div className="grid gap-3">
        {requests.length === 0 && !loading && (
          <div className="text-sm text-gray-600">No pending requests.</div>
        )}
        {requests.map((r) => (
          <div
            key={r.id}
            className="border rounded p-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                {r.tracking_number || r.id}
              </div>
              <div className="font-medium">Status: {r.status}</div>
              {r.base_price !== undefined && <div>Fare: {r.base_price}</div>}
              {r.estimated_distance !== undefined && (
                <div>Distance: {r.estimated_distance} km</div>
              )}
            </div>
            <button
              onClick={() => acceptRequest(r.id)}
              className="px-3 py-2 rounded bg-green-600 text-white"
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
