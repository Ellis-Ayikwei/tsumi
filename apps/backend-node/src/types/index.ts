export interface User {
  id: string;
  email: string;
  user_type: "customer" | "agent" | "admin";
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  errand_id: string;
  agent_id: string;
  updated_at: string;
}

export interface ChatMessage {
  sender_id: string;
  sender_email: string;
  message: string;
  timestamp: string;
}

export interface ErrandStatus {
  errand_id: string;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  updated_at: string;
}


