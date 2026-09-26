import type { SessionUser } from "./types";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/tsumi/api/v1`;
const ACCESS_KEY = "tsumi_admin_access";
const REFRESH_KEY = "tsumi_admin_refresh";
const BASE_PATH = "/admin"; // must match basePath in next.config.ts

/** Mirrors the backend error envelope: {success: false, error: {code, message, details, meta}}. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: { field: string; issue: string }[] = [],
    public meta: Record<string, unknown> = {}
  ) {
    super(message);
  }
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export const tokens = {
  access: () => storage()?.getItem(ACCESS_KEY) ?? null,
  refresh: () => storage()?.getItem(REFRESH_KEY) ?? null,
  set(access: string, refresh?: string) {
    storage()?.setItem(ACCESS_KEY, access);
    if (refresh) storage()?.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    storage()?.removeItem(ACCESS_KEY);
    storage()?.removeItem(REFRESH_KEY);
  },
};

async function toApiError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    const err = body?.error;
    if (err?.code) return new ApiError(res.status, err.code, err.message, err.details, err.meta);
  } catch {
    // Non-JSON body (proxy error page): fall through to a generic error.
  }
  return new ApiError(res.status, "network_error", `Request failed (${res.status}). Try again.`);
}

// One in-flight refresh shared by every request that hit a 401 at the same time.
let refreshing: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  const refresh = tokens.refresh();
  if (!refresh) return Promise.resolve(false);
  refreshing ??= fetch(`${API_BASE}/auth/refresh_token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })
    .then(async (res) => {
      if (!res.ok) return false;
      const data = (await res.json()) as { access: string; refresh?: string };
      tokens.set(data.access, data.refresh);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function send(path: string, init: RequestInit, retry = true): Promise<Response> {
  const headers = new Headers(init.headers);
  const access = tokens.access();
  if (access) headers.set("Authorization", `Bearer ${access}`);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "network_error", "Cannot reach the Tsumi API. Check your connection.");
  }
  if (res.status === 401 && retry && (await refreshAccessToken())) {
    return send(path, init, false);
  }
  if (res.status === 401) {
    tokens.clear();
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
      window.location.assign(`${BASE_PATH}/login`);
    }
  }
  if (!res.ok) throw await toApiError(res);
  return res;
}

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await send(path, {
    method: options.method ?? "GET",
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiBlob(path: string): Promise<Blob> {
  return (await send(path, { method: "GET" })).blob();
}

export async function login(email: string, password: string): Promise<SessionUser> {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => {
    throw new ApiError(0, "network_error", "Cannot reach the Tsumi API. Check your connection.");
  });
  if (!res.ok) throw await toApiError(res);
  const data = (await res.json()) as { access: string; refresh: string; user: SessionUser };
  if (!data.user.is_staff) {
    throw new ApiError(403, "permission_denied", "This account is not a Tsumi admin.");
  }
  tokens.set(data.access, data.refresh);
  return data.user;
}

export async function logout() {
  const refresh = tokens.refresh();
  if (refresh) await api("/auth/logout/", { method: "POST", body: { refresh } }).catch(() => undefined);
  tokens.clear();
}

/** Build a query string, dropping empty values. */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}
