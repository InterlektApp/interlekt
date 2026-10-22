/**
 * API client — the single place that talks to the backend.
 *
 * Same-origin via Next.js rewrites (see next.config.ts): the browser only
 * ever sees `/api/v1/*`; the rewrite proxies to FastAPI. Auth rides on
 * `Authorization: Bearer <access_token>` (see session.ts). On a 401 with a
 * stored refresh token the client rotates the pair ONCE via
 * POST /auth/refresh and retries the original request.
 */

import { clearTokens, getAccessToken, getRefreshToken, storeTokens } from "./session";
import type { TokenResponse } from "@/types/api";

const API_BASE = "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Skip the Authorization header (public endpoints work either way). */
  anonymous?: boolean;
  /** Skip the refresh-and-retry cycle (used by the refresh call itself). */
  noRefresh?: boolean;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      // Reuse (401 refresh_token_reuse) or expiry — session is dead.
      clearTokens();
      return false;
    }
    const data = (await res.json()) as TokenResponse;
    storeTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, anonymous = false, noRefresh = false } = options;

  const send = async (): Promise<Response> => {
    const headers: Record<string, string> = {};
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";
    if (!anonymous) {
      const token = getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const requestBody: BodyInit | undefined = body === undefined
      ? undefined
      : isFormData
        ? body as FormData
        : JSON.stringify(body);
    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: requestBody,
    });
  };

  let res: Response;
  try {
    res = await send();
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server. Check your connection.");
  }

  if (res.status === 401 && !anonymous && !noRefresh && getRefreshToken()) {
    const rotated = await tryRefresh();
    if (rotated) {
      try {
        res = await send();
      } catch {
        throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server. Check your connection.");
      }
    }
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = data?.error ?? data;
    throw new ApiError(
      res.status,
      typeof err?.code === "string" ? err.code : "UNKNOWN_ERROR",
      typeof err?.message === "string" ? err.message : `Request failed (${res.status})`,
      err?.details,
    );
  }

  return data as T;
}

/** Convenience wrappers */
export const get = <T>(path: string, opts?: RequestOptions) => api<T>(path, { ...opts, method: "GET" });
export const post = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  api<T>(path, { ...opts, method: "POST", body });
export const patch = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  api<T>(path, { ...opts, method: "PATCH", body });
/** `PUT` is used by `PUT /creators/me`. */
export const put = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  api<T>(path, { ...opts, method: "PUT", body });
export const del = <T>(path: string, opts?: RequestOptions) => api<T>(path, { ...opts, method: "DELETE" });
