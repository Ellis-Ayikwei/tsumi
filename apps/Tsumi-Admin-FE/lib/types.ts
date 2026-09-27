export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type UserType = "customer" | "agent" | "admin";
export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";
export type ErrandStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  is_staff: boolean;
}

export interface AgentProfile {
  kyc_status: KycStatus;
  kyc_rejection_reason: string;
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  id_type: string;
  id_number: string;
  vehicle_type: string;
  is_available: boolean;
  has_id_document: boolean;
  has_selfie: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  user_type: UserType;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
  agent_profile: AgentProfile | null;
  balance_pesewas: number | null;
  completed_errands: number;
  avg_rating_centi: number | null;
}

export interface AdminUserDetail extends AdminUser {
  badges: string[];
  stats?: { completed_errands: number; ratings_count: number; avg_rating_centi: number };
}

export interface UserRef {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  user_type: UserType;
}

export interface AdminErrand {
  id: string;
  title: string;
  errand_type: string;
  status: ErrandStatus;
  price_pesewas: number;
  commission_pesewas: number;
  agent_payout_pesewas: number;
  commission_bps: number;
  customer: UserRef;
  agent: UserRef | null;
  escrow_status: "held" | "released" | "refunded" | null;
  pickup_address: string;
  dropoff_address: string;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface LedgerEntry {
  id: string;
  transfer_id: string;
  entry_type: string;
  amount_pesewas: number;
  balance_after_pesewas: number;
  wallet_kind: string;
  wallet_owner_email: string | null;
  errand: string | null;
  memo: string;
  created_at: string;
}

export interface AdminErrandDetail extends AdminErrand {
  description: string;
  events: { from_status: string; to_status: string; note: string; actor_email: string | null; created_at: string }[];
  escrow: { amount_pesewas: number; status: string; settled_at: string | null } | null;
  ledger: LedgerEntry[];
  dispute_id: string | null;
}

export interface AdminDispute {
  id: string;
  errand: AdminErrand;
  opened_by: UserRef;
  reason: string;
  description: string;
  status: "open" | "resolved";
  resolution: "" | "refund_customer" | "release_agent";
  resolution_note: string;
  created_at: string;
  resolved_at: string | null;
}

export interface AdminWithdrawal {
  id: string;
  user: UserRef;
  balance_pesewas: number;
  amount_pesewas: number;
  network: string;
  momo_number: string;
  status: "pending" | "paid" | "rejected";
  payout_reference: string;
  rejection_reason: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface TrustBadge {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  is_manual: boolean;
}

export interface AdminStats {
  users: { customers: number; agents: number; suspended: number; new_last_30d: number };
  agents_pending_kyc: number;
  errands_by_status: Partial<Record<ErrandStatus, number>>;
  last_30_days: { completed_errands: number; gmv_pesewas: number; commission_pesewas: number };
  escrow_held_pesewas: number;
  platform_balance_pesewas: number;
  payout_clearing_pesewas: number;
  open_disputes: number;
  pending_withdrawals: { count: number; total_pesewas: number };
  pending_deposits: number;
}

export type ServiceAreaKind = "region" | "city" | "zone";
export type ServiceAreaStatus = "active" | "inactive" | "no_service";

export interface ServiceArea {
  id: string;
  name: string;
  kind: ServiceAreaKind;
  status: ServiceAreaStatus;
  note: string;
  // GeoJSON MultiPolygon, simplified to 5 decimal places (about 1 m).
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] } | null;
  created_at: string;
  updated_at: string;
}
