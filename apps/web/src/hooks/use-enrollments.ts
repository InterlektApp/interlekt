"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, del, get, post } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import type {
  EnrollmentResponse,
  MemberResponse,
  Paginated,
} from "@/types/api";

/** GET /enrollments/mine — empty when signed out or unreachable. */
export function useMyEnrollments(enabled = true) {
  return useQuery({
    queryKey: qk.enrollments.mine(),
    queryFn: async (): Promise<EnrollmentResponse[]> => {
      try {
        const data = await get<Paginated<EnrollmentResponse>>("/enrollments/mine?page=1&pageSize=50");
        return data.items;
      } catch {
        return [];
      }
    },
    enabled,
  });
}

/** POST /communities/{slug}/enroll — free join. Paid → 402 payment_required. */
export function useEnrollFree() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) =>
      post<EnrollmentResponse>(`/communities/${encodeURIComponent(slug)}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.enrollments.mine() });
      queryClient.invalidateQueries({ queryKey: qk.communities.all });
    },
  });
}

/** Friendly message for enroll failures (402 paid, 409 already enrolled). */
export function enrollErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "payment_required") {
      return "Enrollments for this cohort will open shortly. You will be notified when spots become available.";
    }
    if (err.code === "already_enrolled") return "You're already enrolled in this community.";
    if (err.code === "own_community") return "You can't enroll in your own community.";
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Enrollment failed. Please try again.";
}

/** GET /communities/{slug}/members — creator only; surfaces the 403 message. */
export function useMembers(slug: string) {
  return useQuery({
    queryKey: qk.communities.members(slug),
    queryFn: async (): Promise<{ members: MemberResponse[]; error: string | null }> => {
      try {
        const data = await get<Paginated<MemberResponse>>(
          `/communities/${encodeURIComponent(slug)}/members?page=1&pageSize=50`,
        );
        return { members: data.items, error: null };
      } catch (err) {
        return {
          members: [],
          error:
            err instanceof ApiError
              ? err.message
              : "Could not load members.",
        };
      }
    },
  });
}

/** DELETE /enrollments/{id} — leave a community. */
export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) => del<EnrollmentResponse>(`/enrollments/${enrollmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.enrollments.mine() });
      queryClient.invalidateQueries({ queryKey: qk.communities.all });
    },
  });
}
