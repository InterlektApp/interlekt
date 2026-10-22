"use client";

import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api/client";
import type { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest } from "@/types/api";

/**
 * The two password-recovery mutations that have no hook of their own yet.
 *
 * `POST /auth/forgot-password` answers 202 whether or not the address
 * exists, so the UI must never treat a success as proof of an account.
 */

/** POST /auth/forgot-password — always 202, never reveals account existence. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) =>
      post<ForgotPasswordResponse>("/auth/forgot-password", body),
    mutationKey: ["auth", "forgot-password"],
  });
}

/** POST /auth/reset-password — body is `{ token, newPassword }`. */
export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) =>
      post<{ message: string }>("/auth/reset-password", body),
    mutationKey: ["auth", "reset-password"],
  });
}
