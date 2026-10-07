"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import { MOCK_CREATOR_PROFILES } from "@/lib/mocks";
import type { CreatorProfileResponse, ProfileResponse, ProfileUpdateRequest } from "@/types/api";

/** GET /creators/{userId} — falls back to mocks on any failure. */
export function useCreator(userId: string) {
  return useQuery({
    queryKey: qk.creators.detail(userId),
    queryFn: async (): Promise<CreatorProfileResponse | null> => {
      try {
        return await get<CreatorProfileResponse>(`/creators/${encodeURIComponent(userId)}`);
      } catch {
        return MOCK_CREATOR_PROFILES[userId] ?? null;
      }
    },
  });
}

/** GET /users/me — null when signed out or unreachable. */
export function useProfile() {
  return useQuery({
    queryKey: qk.users.me(),
    queryFn: async (): Promise<ProfileResponse | null> => {
      try {
        return await get<ProfileResponse>("/users/me");
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

/** PATCH /users/me — displayName, avatarUrl, bio. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProfileUpdateRequest) => patch<ProfileResponse>("/users/me", body),
    onSuccess: (profile) => {
      queryClient.setQueryData(qk.users.me(), profile);
    },
  });
}
