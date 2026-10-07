/**
 * Query-key factory — one place that owns every TanStack Query key.
 *
 * Centralising keys means invalidation is predictable: invalidate
 * ["communities"] and every community list/detail refetches, without
 * having to remember which keys a mutation touched.
 */

export const qk = {
  communities: {
    all: ["communities"] as const,
    list: (params?: Record<string, unknown>) =>
      ["communities", "list", params ?? {}] as const,
    mine: (params?: Record<string, unknown>) =>
      ["communities", "mine", params ?? {}] as const,
    detail: (slug: string) => ["communities", "detail", slug] as const,
    members: (slug: string, params?: Record<string, unknown>) =>
      ["communities", "members", slug, params ?? {}] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  creators: {
    all: ["creators"] as const,
    detail: (userId: string) => ["creators", "detail", userId] as const,
    me: () => ["creators", "me"] as const,
  },
  enrollments: {
    mine: (params?: Record<string, unknown>) =>
      ["enrollments", "mine", params ?? {}] as const,
  },
  users: {
    me: () => ["users", "me"] as const,
  },
  auth: {
    me: () => ["auth", "me"] as const,
  },
} as const;
