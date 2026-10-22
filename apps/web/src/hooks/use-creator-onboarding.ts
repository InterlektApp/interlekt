"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import type { CreatorProfileResponse } from "@/types/api";

export type { CreatorProfileResponse };

export interface CreatorProfileUpdate {
  expertise: string[];
}

export function useMyCreatorProfile() {
  return useQuery({
    queryKey: qk.creators.me(),
    queryFn: () => get<CreatorProfileResponse>("/creators/me"),
    retry: false,
  });
}

export function useUpdateMyCreatorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatorProfileUpdate) =>
      api<CreatorProfileResponse>("/creators/me", { method: "PUT", body }),
    onSuccess: (profile) => {
      queryClient.setQueryData(qk.creators.me(), profile);
    },
  });
}
