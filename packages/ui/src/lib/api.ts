/** API client shared by the customer and agent apps. Each app gets its own token storage. */

import type { SessionUser } from "./types";

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

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_type: "customer" | "agent";
}

async function toApiError(res: Response): Promise<ApiError> {
  try {
    const err = (await res.json())?.error;
    if (err?.code) return new ApiError(res.status, err.code, err.message, err.details, err.meta);
  } catch {
    // Non-JSON body (proxy error page): fall through to a generic error.
  }
  return new ApiError(res.status, "api_error", `Request failed (${res.status}). Try again.`);
}

const NETWORK_ERROR = () =>
  new ApiError(0, "network_error", "You seem to be offline. Check your connection and try again.");

export function qs(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export function createApiClient({ baseUrl, storagePrefix }: { baseUrl: string; storagePrefix: string }) {
  const API_BASE = `${baseUrl}/tsumi/api/v1`;
  const ACCESS_KEY = `${storagePrefix}_access`;
  const REFRESH_KEY = `${storagePrefix}_refresh`;

  const storage = (): Storage | null => {
    try {
      return typeof window === "undefined" ? null : window.localStorage;
    } catch {
      return null;
    }
  };

  const tokens = {
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

  // One in-flight refresh shared by every request that hit a 401 at the same time.
  let refreshing: Promise<boolean> | null = null;
  const refreshAccessToken = (): Promise<boolean> => {
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
  };

  async function send(path: string, init: RequestInit, retry = true): Promise<Response> {
    const headers = new Headers(init.headers);
    const access = tokens.access();
    if (access) headers.set("Authorization", `Bearer ${access}`);
    let res: Response;
    try {
      res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    } catch {
      throw NETWORK_ERROR();
    }
    if (res.status === 401 && retry && (await refreshAccessToken())) return send(path, init, false);
    if (res.status === 401) tokens.clear();
    if (!res.ok) throw await toApiError(res);
    return res;
  }

  async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    const res = await send(path, {
      method: options.method ?? "GET",
      headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  }

  /** multipart/form-data upload; the browser sets the boundary header. */
  async function apiForm<T>(path: string, form: FormData): Promise<T> {
    return (await (await send(path, { method: "POST", body: form })).json()) as T;
  }

  async function authenticate(path: string, body: unknown): Promise<SessionUser> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw NETWORK_ERROR();
    }
    if (!res.ok) throw await toApiError(res);
    const data = (await res.json()) as { access: string; refresh: string; user: SessionUser };
    tokens.set(data.access, data.refresh);
    return data.user;
  }

  return {
    api,
    apiForm,
    tokens,
    login: (email: string, password: string) => authenticate("/auth/login/", { email, password }),
    register: (payload: RegisterPayload) => authenticate("/auth/register/", payload),
    async logout() {
      const refresh = tokens.refresh();
      if (refresh) await api("/auth/logout/", { method: "POST", body: { refresh } }).catch(() => undefined);
      tokens.clear();
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
