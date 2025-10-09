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

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "verification" | "experience" | "performance" | "elite";
}

export interface Errand {
  id: string;
  customer_id: string;
  agent_id?: string;
  title: string;
  description: string;
  errand_type: "pickup" | "delivery" | "custom";
  pickup_location?: Location;
  delivery_location?: Location;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  amount: number;
  commission: number;
  payment_status: "pending" | "held" | "released" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  is_active: boolean;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: "deposit" | "withdrawal" | "hold" | "release" | "commission";
  status: "pending" | "completed" | "failed";
  reference: string;
  created_at: string;
}


