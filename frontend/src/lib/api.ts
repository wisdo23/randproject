import { getStoredToken } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

type HttpMethod = "GET" | "POST" | "PATCH";

async function request<T>(path: string, options?: { method?: HttpMethod; body?: unknown }): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Do not send Authorization header for /auth/google
  if (!path.startsWith("/auth/google")) {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options?.method || "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// API types from backend
export interface ApiGame {
  id: number;
  name: string;
  description?: string | null;
}

export interface ApiDraw {
  id: number;
  game_id: number;
  draw_datetime: string;
}

export interface ApiResult {
  id: number;
  draw_id: number;
  winning_numbers: string;
  machine_numbers?: string | null;
  share_copy: string;
  share_hashtags: string[];
  share_targets: string[];
  status: string;
  verified: boolean;
  verified_at?: string | null;
  submitted_by_id?: number | null;
  approvals: ApiResultApproval[];
  draw: ApiResultDraw;
  created_at: string;
}

export interface ApiResultApproval {
  id: number;
  manager_id: number;
  decision: string;
  note?: string | null;
  created_at: string;
}

export interface ApiResultDraw {
  id: number;
  draw_datetime: string;
  game_id: number;
  game: ApiGame;
}

export interface CreateResultPayload {
  draw_id: number;
  winning_numbers: number[];
  machine_numbers?: number[];
  share_copy?: string;
  share_hashtags?: string[];
  share_targets?: string[];
}

export interface ReviewResultPayload {
  decision: "approved" | "rejected";
  note?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export const api = {
  getGames: () => request<ApiGame[]>("/games/"),
  createGame: (data: { name: string; description?: string }) =>
    request<ApiGame>("/games/", { method: "POST", body: data }),

  getDraws: () => request<ApiDraw[]>("/draws/"),
  createDraw: (data: { game_id: number; draw_datetime: string }) =>
    request<ApiDraw>("/draws/", { method: "POST", body: data }),

  getResults: () => request<ApiResult[]>("/results"),
  createResult: (data: CreateResultPayload) =>
    request<ApiResult>("/results", { method: "POST", body: data }),
  reviewResult: (id: number, payload: ReviewResultPayload) =>
    request<ApiResult>(`/results/${id}/verify`, { method: "PATCH", body: payload }),

  signup: (payload: { email: string; password: string; phone?: string }) =>
    request<AuthToken>("/auth/signup", { method: "POST", body: payload }),
  login: (payload: { email: string; password: string }) =>
    request<AuthToken>("/auth/login", { method: "POST", body: payload }),
  googleLogin: (payload: { idToken: string }) =>
    request<AuthToken>("/auth/google", { method: "POST", body: { id_token: payload.idToken } }),
};
