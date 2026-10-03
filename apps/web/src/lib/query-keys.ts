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
    detail: (slug: string) => ["communities", "detail", slug] as const,
    categories: () => ["communities", "categories"] as const,
    enrollment: (communityId: string) =>
      ["communities", "enrollment", communityId] as const,
    members: (communityId: string, params?: Record<string, unknown>) =>
      ["communities", "members", communityId, params ?? {}] as const,
    transactions: (communityId: string, params?: Record<string, unknown>) =>
      ["communities", "transactions", communityId, params ?? {}] as const,
  },
  courses: {
    all: ["courses"] as const,
    list: (communityId: string) => ["courses", "list", communityId] as const,
    detail: (courseId: string) => ["courses", "detail", courseId] as const,
  },
  lessons: {
    detail: (lessonId: string) => ["lessons", "detail", lessonId] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (communityId: string, params?: Record<string, unknown>) =>
      ["posts", "list", communityId, params ?? {}] as const,
    detail: (postId: string) => ["posts", "detail", postId] as const,
    comments: (postId: string, params?: Record<string, unknown>) =>
      ["posts", "comments", postId, params ?? {}] as const,
  },
  creators: {
    all: ["creators"] as const,
    detail: (slug: string) => ["creators", "detail", slug] as const,
  },
  enrollments: {
    mine: () => ["enrollments", "mine"] as const,
  },
  payments: {
    status: (reference: string) => ["payments", "status", reference] as const,
  },
  dashboard: {
    creator: () => ["dashboard", "creator"] as const,
  },
  auth: {
    me: () => ["auth", "me"] as const,
  },
} as const;
