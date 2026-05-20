import Cookies from "js-cookie";

import type {
  ApiBid,
  ApiCategory,
  ApiJob,
  ApiUser,
  DashboardStats,
  JobFilters,
  Paginated,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;
  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { sameSite: "lax", expires: 30 });
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY);
}

type RequestOptions = RequestInit & { token?: string; query?: Record<string, unknown> };

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(path.startsWith("http") ? path : `${API_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { token, query, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const auth = token ?? getToken();

  const res = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const body = text ? safeJson(text) : null;

  if (!res.ok) {
    const message = (body as { message?: string } | null)?.message ?? `Request failed (${res.status})`;
    const errors = (body as { errors?: Record<string, string[]> } | null)?.errors ?? {};
    throw new ApiError(message, res.status, errors);
  }

  return body as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ---------- Auth ----------

export const authApi = {
  register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    headline?: string;
  }) {
    return apiFetch<{ user: ApiUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload: { email: string; password: string }) {
    return apiFetch<{ user: ApiUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logout(token?: string) {
    return apiFetch<{ message: string }>("/auth/logout", {
      method: "POST",
      token,
    });
  },
  me(token?: string) {
    return apiFetch<{ user: ApiUser }>("/auth/me", { token });
  },
};

// ---------- Jobs ----------

export const jobsApi = {
  list(filters: JobFilters = {}) {
    return apiFetch<Paginated<ApiJob>>("/jobs", { query: filters });
  },
  get(slug: string, token?: string) {
    return apiFetch<{ data: ApiJob }>(`/jobs/${slug}`, { token });
  },
};

export const categoriesApi = {
  list() {
    return apiFetch<{ data: ApiCategory[] }>("/categories");
  },
};

// ---------- Bids ----------

export const bidsApi = {
  submit(
    slug: string,
    payload: {
      proposed_price: number;
      delivery_days: number;
      cover_letter: string;
      experience_summary?: string;
    },
    token?: string,
  ) {
    return apiFetch<{ message: string; bid: ApiBid }>(`/jobs/${slug}/bids`, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },
  myBids(query: { page?: number; per_page?: number } = {}, token?: string) {
    return apiFetch<Paginated<ApiBid>>("/me/bids", { query, token });
  },
  withdraw(bidId: number, token?: string) {
    return apiFetch<{ message: string; bid: ApiBid }>(`/me/bids/${bidId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const dashboardApi = {
  stats(token?: string) {
    return apiFetch<{ stats: DashboardStats }>("/me/dashboard", { token });
  },
};
