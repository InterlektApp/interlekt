"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import { MOCK_CATEGORIES, MOCK_COMMUNITIES, getCommunityDetail } from "@/lib/mocks";
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

function mockCommunityList(filters: Required<Pick<CommunityFilters, "page" | "pageSize">> & CommunityFilters): Paginated<CommunityListItem> {
  const category = filters.category ?? "all";
  const search = (filters.search ?? "").toLowerCase();
  let filtered = MOCK_COMMUNITIES;
  if (category !== "all") {
    filtered = filtered.filter((c) => c.categories.some((cat) => cat.slug === category));
  }
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.creator.displayName.toLowerCase().includes(search),
    );
  }
  const total = filtered.length;
  return {
    items: filtered.slice((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
  };
}

/** GET /communities — falls back to mocks on any failure. */
export function useCommunities(filters: CommunityFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);

  return useQuery({
    queryKey: qk.communities.list(Object.fromEntries(params)),
    queryFn: async (): Promise<Paginated<CommunityListItem>> => {
      try {
        return await get<Paginated<CommunityListItem>>(`/communities?${params}`);
      } catch {
        return mockCommunityList({ ...filters, page, pageSize });
      }
    },
  });
}

/** GET /communities/{slug} — falls back to mocks on any failure. */
export function useCommunity(slug: string) {
  return useQuery({
    queryKey: qk.communities.detail(slug),
    queryFn: async (): Promise<CommunityDetail | null> => {
      try {
        return await get<CommunityDetail>(`/communities/${encodeURIComponent(slug)}`);
      } catch {
        return getCommunityDetail(slug);
      }
    },
  });
}

/** GET /categories — falls back to mocks on any failure. */
export function useCategories() {
  return useQuery({
    queryKey: qk.categories.all,
    queryFn: async (): Promise<Category[]> => {
      try {
        return await get<Category[]>("/categories");
      } catch {
        return MOCK_CATEGORIES;
      }
    },
    staleTime: 300_000,
  });
}

/** GET /communities/mine — creator's own communities (empty when signed out). */
export function useMyCommunities() {
  return useQuery({
    queryKey: qk.communities.mine(),
    queryFn: async (): Promise<CommunityListItem[]> => {
      try {
        const data = await get<Paginated<CommunityListItem>>("/communities/mine?page=1&pageSize=50");
        return data.items;
      } catch {
        return [];
      }
    },
  });
}
