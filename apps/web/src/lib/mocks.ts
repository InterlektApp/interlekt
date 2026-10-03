/**
 * Mock data for frontend development — stands in for the FastAPI backend
 * until the Day-1 contract freeze endpoints are live.
 *
 * Every mock matches the types in @/types/api.ts exactly, so swapping to
 * the real API is a matter of replacing the fetch, not the components.
 */

import type {
  Category,
  Comment,
  Community,
  CommunityListItem,
  Course,
  CreatorProfile,
  Lesson,
  Module,
  PaymentStatus,
  Post,
  Review,
} from "@/types/api";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-tech", name: "Tech & Programming", slug: "tech", icon: "code" },
  { id: "cat-business", name: "Business", slug: "business", icon: "briefcase" },
  { id: "cat-design", name: "Design", slug: "design", icon: "palette" },
  { id: "cat-marketing", name: "Marketing", slug: "marketing", icon: "megaphone" },
  { id: "cat-finance", name: "Finance", slug: "finance", icon: "wallet" },
  { id: "cat-career", name: "Career Growth", slug: "career", icon: "rocket" },
];

export const MOCK_CREATORS: CreatorProfile[] = [
  {
    user_id: "user-ada",
    display_name: "Adaeze Okafor",
    avatar_url: null,
    bio: "Senior software engineer with 8 years building fintech products across Lagos and Nairobi. I teach practical backend engineering — no fluff, just shipping.",
    expertise: ["Python", "FastAPI", "System Design"],
    verification_status: "verified",
    evidence_url: "https://linkedin.com/in/adaeze-okafor",
    community_count: 2,
    member_count: 1240,
  },
  {
    user_id: "user-tunde",
    display_name: "Tunde Bakare",
    avatar_url: null,
    bio: "Growth marketer who scaled three Nigerian startups past ₦100M ARR. I teach marketing that works with small budgets.",
    expertise: ["Growth Marketing", "Content", "SEO"],
    verification_status: "verified",
    evidence_url: "https://tundebakare.com",
    community_count: 1,
    member_count: 860,
  },
  {
    user_id: "user-funmi",
    display_name: "Funmi Adeleke",
    avatar_url: null,
    bio: "Product designer, ex-Paystack. I help designers build portfolios that get them hired.",
    expertise: ["UI Design", "Figma", "Portfolios"],
    verification_status: "verified",
    evidence_url: "https://funmi.design",
    community_count: 1,
    member_count: 512,
  },
  {
    user_id: "user-chidi",
    display_name: "Chidi Eze",
    avatar_url: null,
    bio: "Data analyst turned analytics lead. Learning in public, teaching what I learn.",
    expertise: ["SQL", "Excel", "Dashboards"],
    verification_status: "unverified",
    evidence_url: null,
    community_count: 1,
    member_count: 96,
  },
];

const creatorById = (id: string): CreatorProfile =>
  MOCK_CREATORS.find((c) => c.user_id === id) ?? MOCK_CREATORS[0];

export const MOCK_COMMUNITIES: CommunityListItem[] = [
  {
    id: "comm-api-eng",
    slug: "api-engineering-lagos",
    title: "API Engineering with Adaeze",
    category_id: "cat-tech",
    image_url: null,
    creator: { display_name: "Adaeze Okafor", avatar_url: null, verification_status: "verified" },
    price_kobo: 500000,
    currency: "NGN",
    billing_period: "one_time",
    member_count: 842,
    rating: 4.8,
  },
  {
    id: "comm-growth",
    slug: "growth-marketing-ng",
    title: "Growth Marketing for Nigerian Startups",
    category_id: "cat-marketing",
    image_url: null,
    creator: { display_name: "Tunde Bakare", avatar_url: null, verification_status: "verified" },
    price_kobo: 350000,
    currency: "NGN",
    billing_period: "monthly",
    member_count: 860,
    rating: 4.6,
  },
  {
    id: "comm-design-portfolio",
    slug: "design-portfolios-that-hire",
    title: "Design Portfolios That Get You Hired",
    category_id: "cat-design",
    image_url: null,
    creator: { display_name: "Funmi Adeleke", avatar_url: null, verification_status: "verified" },
    price_kobo: 0,
    currency: "NGN",
    billing_period: "one_time",
    member_count: 512,
    rating: 4.9,
  },
  {
    id: "comm-sql-basics",
    slug: "sql-from-scratch",
    title: "SQL from Scratch",
    category_id: "cat-tech",
    image_url: null,
    creator: { display_name: "Chidi Eze", avatar_url: null, verification_status: "unverified" },
    price_kobo: 150000,
    currency: "NGN",
    billing_period: "one_time",
    member_count: 96,
    rating: null,
  },
];

export function getCommunityDetail(slug: string): Community | null {
  const item = MOCK_COMMUNITIES.find((c) => c.slug === slug);
  if (!item) return null;
  const creatorId =
    MOCK_CREATORS.find((c) => c.display_name === item.creator.display_name)?.user_id ??
    "user-ada";
  return {
    ...item,
    description:
      "A hands-on learning community with structured lessons, weekly discussions, and direct access to the creator. Learn at your own pace, ask questions anytime, and build real projects with feedback.",
    tags: ["beginner-friendly", "projects", "community-support"],
    creator_id: creatorId,
    creator: creatorById(creatorId),
    status: "published",
    review_count: 127,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-09-20T00:00:00Z",
    can_enroll: true,
    enrollment: null,
  };
}

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    community_id: "comm-api-eng",
    title: "REST APIs from Zero",
    description: "Design, build, and document production APIs.",
    position: 0,
    is_published: true,
    module_count: 2,
    lesson_count: 5,
  },
  {
    id: "course-2",
    community_id: "comm-api-eng",
    title: "Auth & Payments",
    description: "JWT, RBAC, and Paystack integration.",
    position: 1,
    is_published: true,
    module_count: 1,
    lesson_count: 3,
  },
];

export const MOCK_MODULES: Record<string, Module[]> = {
  "course-1": [
    {
      id: "mod-1",
      course_id: "course-1",
      title: "Foundations",
      position: 0,
      lessons: [
        {
          id: "les-1",
          module_id: "mod-1",
          title: "What makes a good API?",
          content: "Good APIs are predictable, documented, and boring in the best way...",
          video_url: null,
          position: 0,
          is_published: true,
          is_completed: true,
        },
        {
          id: "les-2",
          module_id: "mod-1",
          title: "HTTP methods & status codes",
          content: "GET retrieves, POST creates...",
          video_url: null,
          position: 1,
          is_published: true,
          is_completed: true,
        },
        {
          id: "les-3",
          module_id: "mod-1",
          title: "Your first FastAPI app",
          content: "Install FastAPI, write your first endpoint...",
          video_url: null,
          position: 2,
          is_published: true,
          is_completed: false,
        },
      ],
    },
    {
      id: "mod-2",
      course_id: "course-1",
      title: "Going deeper",
      position: 1,
      lessons: [
        {
          id: "les-4",
          module_id: "mod-2",
          title: "Validation with Pydantic",
          content: "Never trust the client...",
          video_url: null,
          position: 0,
          is_published: true,
          is_completed: false,
        },
        {
          id: "les-5",
          module_id: "mod-2",
          title: "Pagination & filtering",
          content: "Every list endpoint paginates...",
          video_url: null,
          position: 1,
          is_published: true,
          is_completed: false,
        },
      ],
    },
  ],
};

export function getLesson(lessonId: string): (Lesson & { courseTitle: string }) | null {
  for (const modules of Object.values(MOCK_MODULES)) {
    for (const mod of modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        const course = MOCK_COURSES.find((c) => c.id === mod.course_id);
        return { ...lesson, courseTitle: course?.title ?? "Course" };
      }
    }
  }
  return null;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    community_id: "comm-api-eng",
    author_id: "user-ada",
    author: { display_name: "Adaeze Okafor", avatar_url: null },
    content:
      "Welcome to the community! Introduce yourself below: what are you building, and what do you want to learn first?",
    is_pinned: true,
    is_announcement: true,
    like_count: 214,
    comment_count: 89,
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "post-2",
    community_id: "comm-api-eng",
    author_id: "user-learner-1",
    author: { display_name: "Blessing N.", avatar_url: null },
    content:
      "Just finished the Pydantic lesson — the `field_validator` example finally made validation click for me. For anyone stuck: the key insight is validators run before the model is constructed.",
    is_pinned: false,
    is_announcement: false,
    like_count: 42,
    comment_count: 7,
    created_at: "2026-09-28T14:30:00Z",
  },
  {
    id: "post-3",
    community_id: "comm-api-eng",
    author_id: "user-learner-2",
    author: { display_name: "Ibrahim S.", avatar_url: null },
    content:
      "Question: for the Paystack webhook, do we verify the signature before or after parsing the body? Worried about timing attacks.",
    is_pinned: false,
    is_announcement: false,
    like_count: 18,
    comment_count: 12,
    created_at: "2026-09-29T09:15:00Z",
  },
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  "post-1": [
    {
      id: "c-1",
      post_id: "post-1",
      author_id: "user-learner-1",
      author: { display_name: "Blessing N.", avatar_url: null },
      content: "Hi everyone! Backend dev in Abuja, here to level up my API design skills.",
      created_at: "2026-09-01T11:00:00Z",
    },
    {
      id: "c-2",
      post_id: "post-1",
      author_id: "user-learner-2",
      author: { display_name: "Ibrahim S.", avatar_url: null },
      content: "Ibrahim here from Kano — building a school fees payment product.",
      created_at: "2026-09-01T12:30:00Z",
    },
  ],
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    community_id: "comm-api-eng",
    user_id: "user-learner-1",
    author: { display_name: "Blessing N.", avatar_url: null },
    rating: 5,
    content: "Worth every kobo. The payments module alone saved me weeks on my project.",
    created_at: "2026-09-15T00:00:00Z",
  },
  {
    id: "rev-2",
    community_id: "comm-api-eng",
    user_id: "user-learner-2",
    author: { display_name: "Ibrahim S.", avatar_url: null },
    rating: 5,
    content: "Adaeze actually answers questions. That alone is worth the price.",
    created_at: "2026-09-18T00:00:00Z",
  },
  {
    id: "rev-3",
    community_id: "comm-api-eng",
    user_id: "user-learner-3",
    author: { display_name: "Chiamaka O.", avatar_url: null },
    rating: 4,
    content: "Great content, wish there were more advanced system design lessons.",
    created_at: "2026-09-22T00:00:00Z",
  },
];

/** Simulates GET /payments/{reference}/status — pending 3x, then success. */
const pollCounts = new Map<string, number>();

export function mockPaymentStatus(reference: string): {
  status: PaymentStatus;
  enrollment_id: string | null;
} {
  const n = (pollCounts.get(reference) ?? 0) + 1;
  pollCounts.set(reference, n);
  if (n >= 4) {
    return { status: "success", enrollment_id: "enr-mock-1" };
  }
  return { status: "pending", enrollment_id: null };
}

export function resetMockPolls() {
  pollCounts.clear();
}
