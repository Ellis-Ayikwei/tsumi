const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("campusride_access_token");
}

export function setAuthTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("campusride_access_token", access);
  if (refresh) localStorage.setItem("campusride_refresh_token", refresh);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("campusride_access_token");
  localStorage.removeItem("campusride_refresh_token");
}

export async function apiFetch<T = any>(
  path: string,
  options: { method?: HttpMethod; body?: any; auth?: boolean; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, auth = false, headers = {} } = options;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : (await res.text());

  if (!res.ok) {
    const message = (data as any)?.message || (data as any)?.detail || res.statusText;
    throw new Error(message);
  }

  return data as T;
}

export const AuthAPI = {
  login: (email: string, password: string) =>
    apiFetch<{ access: string; refresh?: string; user?: any }>(
      "/api/auth/login/",
      { method: "POST", body: { email, password } }
    ),

  register: (payload: any) => apiFetch("/api/auth/register/", { method: "POST", body: payload }),
};

export const ErrandsAPI = {
  create: (payload: any) => apiFetch("/api/errands/", { method: "POST", body: payload, auth: true }),
};


