const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/tsumi/api/v1`;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Mirrors the backend error envelope: {success: false, error: {code, message, details, meta}}. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: { field: string; issue: string }[] = [],
    public meta: Record<string, number | string> = {}
  ) {
    super(message);
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tsumi_access_token");
}

export function setAuthTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tsumi_access_token", access);
  if (refresh) localStorage.setItem("tsumi_refresh_token", refresh);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tsumi_access_token");
  localStorage.removeItem("tsumi_refresh_token");
}

export async function apiFetch<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; auth?: boolean; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, auth = false, headers = {} } = options;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const finalHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };
  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "network_error", "Cannot reach Tsumi. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const err = data?.error;
    throw new ApiError(
      res.status,
      err?.code ?? "api_error",
      err?.message ?? `Request failed (${res.status}). Try again.`,
      err?.details ?? [],
      err?.meta ?? {}
    );
  }
  return data as T;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  user_type: "customer" | "agent" | "admin";
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_type: "customer" | "agent";
}

export const AuthAPI = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login/", { method: "POST", body: { email, password } }),

  register: (payload: RegisterPayload) =>
    apiFetch<AuthResponse>("/auth/register/", { method: "POST", body: payload }),
};

export interface CreateErrandPayload {
  title: string;
  description?: string;
  errand_type: "pickup" | "delivery" | "shopping" | "custom";
  pickup_address?: string;
  // Pinned coordinates as 6dp decimal strings; null when the address was typed.
  pickup_lat?: string | null;
  pickup_lng?: string | null;
  dropoff_address?: string;
  dropoff_lat?: string | null;
  dropoff_lng?: string | null;
  price_pesewas: number;
  client_request_id: string;
}

export interface Errand {
  id: string;
  title: string;
  status: string;
  price_pesewas: number;
}

export const ErrandsAPI = {
  create: (payload: CreateErrandPayload) =>
    apiFetch<Errand>("/errands/", { method: "POST", body: payload, auth: true }),
};
