/** Response shapes of the customer/agent API (apps/Tsumi-BE). Money is always integer pesewas. */

export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type UserType = "customer" | "agent" | "admin";
export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";
export type ErrandType = "pickup" | "delivery" | "shopping" | "custom";
export type ErrandStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";

export interface AgentProfile {
  kyc_status: KycStatus;
  kyc_rejection_reason: string;
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  id_type: string;
  vehicle_type: "walking" | "bicycle" | "motorbike" | "car";
  is_available: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  user_type: UserType;
  is_staff: boolean;
  agent_profile: AgentProfile | null;
}

export interface AgentMe extends AgentProfile {
  stats: { completed_errands: number; ratings_count: number; avg_rating_centi: number };
}

export interface PublicUser {
  id: string;
  display_name: string;
}

export interface ErrandEvent {
  from_status: string;
  to_status: ErrandStatus;
  note: string;
  created_at: string;
}

export type StopKind = "pickup" | "dropoff";

export interface ErrandStop {
  position: number;
  kind: StopKind;
  address: string;
  lat: string | null;
  lng: string | null;
  note: string;
}

export interface Errand {
  id: string;
  title: string;
  description: string;
  errand_type: ErrandType;
  pickup_address: string;
  // Pinned coordinates as 6dp decimal strings; null when the address was typed.
  pickup_lat: string | null;
  pickup_lng: string | null;
  dropoff_address: string;
  dropoff_lat: string | null;
  dropoff_lng: string | null;
  // Every place the runner goes, in order. Empty on errands posted before stops existed.
  stops: ErrandStop[];
  scheduled_for: string | null;
  price_pesewas: number;
  commission_pesewas: number;
  agent_payout_pesewas: number;
  status: ErrandStatus;
  customer: PublicUser;
  agent: PublicUser | null;
  contact_phone: string | null;
  is_rated: boolean;
  created_at: string;
  accepted_at: string | null;
  started_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string;
  events?: ErrandEvent[];
}

export interface WalletSummary {
  id: string;
  currency: string;
  balance_pesewas: number;
  held_in_escrow_pesewas: number;
  pending_withdrawals_pesewas: number;
}

export interface LedgerEntry {
  id: string;
  transfer_id: string;
  entry_type: string;
  amount_pesewas: number;
  balance_after_pesewas: number;
  errand: string | null;
  memo: string;
  created_at: string;
}

export interface Deposit {
  id: string;
  reference: string;
  amount_pesewas: number;
  status: "pending" | "succeeded" | "failed";
  authorization_url: string;
  paid_at: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  amount_pesewas: number;
  network: "mtn" | "telecel" | "airteltigo";
  momo_number: string;
  status: "pending" | "paid" | "rejected";
  rejection_reason: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface AppNotification {
  id: string;
  kind: string;
  title: string;
  body: string;
  errand: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPage extends Page<AppNotification> {
  unread_count: number;
}

export interface UserBadge {
  badge: { code: string; name: string; description: string; icon: string };
  created_at: string;
}

/** Customer-facing and agent-facing names for ledger entry types. */
export const ENTRY_LABELS: Record<string, string> = {
  deposit: "Top up",
  escrow_hold: "Held for errand",
  escrow_release: "Errand payout",
  commission: "Tsumi fee",
  escrow_refund: "Refund",
  withdrawal_hold: "Withdrawal",
  withdrawal_reversal: "Withdrawal returned",
  payout: "Paid out",
  adjustment: "Adjustment",
};
