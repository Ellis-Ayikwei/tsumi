export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  user_type: "customer" | "agent" | "admin";
  is_verified: boolean;
  trust_score: number;
  created_at: string;
}

export interface Errand {
  id: string;
  customer_id: string;
  agent_id?: string;
  title: string;
  description: string;
  errand_type: "pickup" | "delivery" | "custom";
  pickup_address?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_address?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  amount: number;
  commission: number;
  agent_payout: number;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  payment_status: "pending" | "held" | "released" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "verification" | "experience" | "performance" | "elite";
  min_errands: number;
  min_rating: number;
  requires_kyc: boolean;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: "deposit" | "withdrawal" | "hold" | "release" | "commission" | "refund";
  status: "pending" | "completed" | "failed" | "reversed";
  reference: string;
  provider?: string;
  created_at: string;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  user_type: "customer" | "agent" | "admin";
  exp: number;
  iat: number;
}


