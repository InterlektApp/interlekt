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
    courses: (slug: string) => ["communities", "courses", slug] as const,
    posts: (slug: string, params?: Record<string, unknown>) =>
      ["communities", "posts", slug, params ?? {}] as const,
    reviews: (slug: string, params?: Record<string, unknown>) =>
      ["communities", "reviews", slug, params ?? {}] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  creators: {
    all: ["creators"] as const,
    detail: (userId: string) => ["creators", "detail", userId] as const,
    me: () => ["creators", "me"] as const,
    courses: () => ["creators", "me", "courses"] as const,
  },
  enrollments: {
    all: ["enrollments"] as const,
    mine: (params?: Record<string, unknown>) =>
      ["enrollments", "mine", params ?? {}] as const,
    detail: (communityId: string) => ["enrollments", "community", communityId] as const,
  },
  users: {
    all: ["users"] as const,
    me: () => ["users", "me"] as const,
    learning: () => ["users", "me", "learning"] as const,
  },
  auth: {
    me: () => ["auth", "me"] as const,
  },
  courses: {
    all: ["courses"] as const,
    detail: (courseId: string) => ["courses", "detail", courseId] as const,
    progress: (courseId: string) => ["courses", "progress", courseId] as const,
    modules: (courseId: string) => ["courses", "modules", courseId] as const,
  },
  lessons: {
    all: ["lessons"] as const,
    detail: (lessonId: string) => ["lessons", "detail", lessonId] as const,
    list: (moduleId: string) => ["lessons", "list", moduleId] as const,
  },
  posts: {
    detail: (postId: string) => ["posts", "detail", postId] as const,
    comments: (postId: string, params?: Record<string, unknown>) =>
      ["posts", "comments", postId, params ?? {}] as const,
  },
  reviews: {
    detail: (reviewId: string) => ["reviews", "detail", reviewId] as const,
  },
  admin: {
    all: ["admin"] as const,
    verification: (params?: Record<string, unknown>) =>
      ["admin", "verification", params ?? {}] as const,
    users: (params?: Record<string, unknown>) =>
      ["admin", "users", params ?? {}] as const,
    stats: () => ["admin", "stats"] as const,
    reports: (params?: Record<string, unknown>) =>
      ["admin", "reports", params ?? {}] as const,
    transactions: (params?: Record<string, unknown>) =>
      ["admin", "transactions", params ?? {}] as const,
    auditLog: (params?: Record<string, unknown>) =>
      ["admin", "audit-log", params ?? {}] as const,
  },
  settings: {
    all: ["settings"] as const,
    notificationPreferences: () => ["settings", "notification-preferences"] as const,
    privacy: () => ["settings", "privacy"] as const,
    sessions: () => ["settings", "sessions"] as const,
    connectedAccounts: () => ["settings", "connected-accounts"] as const,
    payments: () => ["settings", "payment-methods"] as const,
    orders: (params?: Record<string, unknown>) =>
      ["settings", "orders", params ?? {}] as const,
  },
  platform: {
    stats: () => ["platform", "stats"] as const,
    fees: () => ["platform", "fees"] as const,
    publicConfig: () => ["platform", "public-config"] as const,
  },
} as const;
