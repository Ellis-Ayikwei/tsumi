export const TRUST_BADGES = {
  VERIFIED_ID: {
    name: "Verified ID",
    icon: "🪪",
    category: "verification",
  },
  RELIABLE_RUNNER: {
    name: "Reliable Runner",
    icon: "🚗",
    category: "experience",
  },
  GREAT_COMMUNICATOR: {
    name: "Great Communicator",
    icon: "💬",
    category: "performance",
  },
  PRO_RUNNER: {
    name: "Pro Runner",
    icon: "🧾",
    category: "experience",
  },
  COMMUNITY_FAVORITE: {
    name: "Community Favorite",
    icon: "🛡️",
    category: "performance",
  },
  ELITE_AGENT: {
    name: "Elite Tsumi Agent",
    icon: "👑",
    category: "elite",
  },
} as const;

export const ERRAND_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  HELD: "held",
  RELEASED: "released",
  REFUNDED: "refunded",
} as const;

export const USER_TYPES = {
  CUSTOMER: "customer",
  AGENT: "agent",
  ADMIN: "admin",
} as const;

export const GHANA_PAYMENT_PROVIDERS = {
  PAYSTACK: "paystack",
  MTN_MOMO: "mtn_momo",
  VODAFONE_CASH: "vodafone_cash",
  AIRTELTIGO_MONEY: "airteltigo_money",
} as const;

export const DEFAULT_CURRENCY = "GHS";
export const DEFAULT_COMMISSION_RATE = 0.15;


