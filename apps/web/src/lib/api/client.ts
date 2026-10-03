/**
 * API client — the single place that talks to the backend.
 *
 * Same-origin via Next.js rewrites (see next.config.ts), so cookies flow
 * automatically and CORS never comes up. The browser only ever sees
 * `/api/v1/*`; the rewrite proxies to FastAPI.
 */

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
  /** Set false for endpoints that must not send credentials (e.g. public pages). */
  credentials?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, credentials = true } = options;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: credentials ? "include" : "omit",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server. Check your connection.");
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
export const del = <T>(path: string, opts?: RequestOptions) => api<T>(path, { ...opts, method: "DELETE" });
