"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import type {
  Category,
  CommunityDetail,
  CommunityListItem,
  Paginated,
} from "@/types/api";

export interface CommunityFilters {
  category?: string;
  search?: string;
  sort?: "newest" | "most_members" | "alphabetical";
  page?: number;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 20;

/** GET /communities — data is always from the backend; errors remain visible. */
export function useCommunities(filters: CommunityFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);

  return useQuery({
    queryKey: qk.communities.list(Object.fromEntries(params)),
    queryFn: () => get<Paginated<CommunityListItem>>(`/communities?${params}`),
  });
}

/** GET /communities/{slug} — returns only the backend response. */
export function useCommunity(slug: string) {
  return useQuery({
    queryKey: qk.communities.detail(slug),
    queryFn: () => get<CommunityDetail>(`/communities/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });
}

/** GET /categories — an empty list means the backend has not seeded categories. */
export function useCategories() {
  return useQuery({
    queryKey: qk.categories.all,
    queryFn: () => get<Category[]>("/categories"),
    staleTime: 300_000,
  });
}

/** GET /communities/mine — creator-owned communities from the backend. */
export function useMyCommunities() {
  return useQuery({
    queryKey: qk.communities.mine(),
    queryFn: async () => {
      const data = await get<Paginated<CommunityListItem>>("/communities/mine?page=1&pageSize=50");
      return data.items;
    },
  });
}
