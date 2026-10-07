"use client";

/**
 * Bearer-token session for the Interlekt backend.
 *
 * The backend returns tokens in the response BODY (no cookies):
 * login/register/refresh → { accessToken, refreshToken, user }.
 * The access token rides on `Authorization: Bearer <token>`; the refresh
 * token is presented in the JSON body of POST /auth/refresh.
 *
 * Access token lives in memory (fast, per-tab) with a localStorage
 * mirror so a page reload keeps you signed in. Refresh token lives in
 * localStorage only. Both are cleared on logout or unrecoverable 401.
 */

import type { AccountResponse, LoginRequest, RegisterRequest, TokenResponse } from "@/types/api";

const ACCESS_KEY = "interlekt.access_token";
const REFRESH_KEY = "interlekt.refresh_token";

let memoryAccessToken: string | null = null;

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Private mode etc. — memory token still works for the tab session.
  }
}

export function getAccessToken(): string | null {
  if (memoryAccessToken) return memoryAccessToken;
  memoryAccessToken = readStorage(ACCESS_KEY);
  return memoryAccessToken;
}

export function getRefreshToken(): string | null {
  return readStorage(REFRESH_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string) {
  memoryAccessToken = accessToken;
  writeStorage(ACCESS_KEY, accessToken);
  writeStorage(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  memoryAccessToken = null;
  writeStorage(ACCESS_KEY, null);
  writeStorage(REFRESH_KEY, null);
}

const API_BASE = "/api/v1";

async function tokenCall(path: string, body: unknown): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error ?? {};
    throw new Error(
      typeof err.message === "string" ? err.message : `Request failed (${res.status})`,
    );
  }
  return data as TokenResponse;
}

function applySession(data: TokenResponse): AccountResponse {
  storeTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function loginRequest(body: LoginRequest): Promise<AccountResponse> {
  return applySession(await tokenCall("/auth/login", body));
}

export async function registerRequest(body: RegisterRequest): Promise<AccountResponse> {
  return applySession(await tokenCall("/auth/register", body));
}

/** Best-effort logout: revoke server-side, always clear locally. */
export async function logoutRequest(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch {
    // Offline logout still logs you out locally.
  } finally {
    clearTokens();
  }
}
