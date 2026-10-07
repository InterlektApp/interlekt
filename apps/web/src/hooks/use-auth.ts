"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import { loginRequest, logoutRequest, registerRequest } from "@/lib/api/session";
import type { AccountResponse, LoginRequest, RegisterRequest } from "@/types/api";

/** GET /auth/me — null when signed out or unreachable. */
export function useMe() {
  return useQuery({
    queryKey: qk.auth.me(),
    queryFn: async (): Promise<AccountResponse | null> => {
      try {
        return await get<AccountResponse>("/auth/me");
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => loginRequest(body),
    onSuccess: (user) => {
      queryClient.setQueryData(qk.auth.me(), user);
    },
  });
}

export interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
  role: "learner" | "creator";
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterBody) => {
      const payload: RegisterRequest = {
        email: body.email,
        password: body.password,
        displayName: body.displayName,
        role: body.role,
      };
      return registerRequest(payload);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(qk.auth.me(), user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
