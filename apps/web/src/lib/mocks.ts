/**
 * Mock data — fallback when the backend is unreachable, and stand-in
 * content for domains the backend hasn't shipped yet (feed, lessons,
 * reviews, payments).
 *
 * Backend-served shapes (categories, communities, creators) mirror the
 * backend seed script so fallback content looks like the real thing.
 * Local-only shapes (posts, lessons, reviews) are marked as such in
 * types/api.ts.
 */

import type {
  Category,
  Comment,
  CommunityDetail,
  CommunityListItem,
  Course,
  CreatorProfileResponse,
  Lesson,
  Module,
  Post,
  Review,
} from "@/types/api";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-technology-programming", name: "Technology & Programming", slug: "technology-programming" },
  { id: "cat-business", name: "Business & Entrepreneurship", slug: "business-entrepreneurship" },
  { id: "cat-design", name: "Design & Creative", slug: "design-creative" },
  { id: "cat-finance", name: "Finance & Investing", slug: "finance-investing" },
  { id: "cat-health", name: "Health & Wellness", slug: "health-wellness" },
  { id: "cat-language", name: "Language & Communication", slug: "language-communication" },
  { id: "cat-agriculture", name: "Agriculture & Sustainability", slug: "agriculture-sustainability" },
  { id: "cat-education", name: "Education & Teaching", slug: "education-teaching" },
];

/** Slug → Lucide icon key for the explore filter pills. */
export const CATEGORY_ICONS: Record<string, string> = {
  "technology-programming": "code",
  "business-entrepreneurship": "briefcase",
  "design-creative": "palette",
  "finance-investing": "wallet",
  "health-wellness": "heart",
  "language-communication": "megaphone",
  "agriculture-sustainability": "sprout",
  "education-teaching": "graduation-cap",
};

const AMARA = {
  userId: "creator-amara",
  displayName: "Amara Okafor",
  avatarUrl: null,
  verificationStatus: "verified" as const,
  isVerified: true,
};

export const MOCK_CREATOR_PROFILES: Record<string, CreatorProfileResponse> = {
  "creator-amara": {
    ...AMARA,
    bio: "Python developer and teacher. I turn complete beginners into confident builders, one project at a time.",
    expertise: ["Python", "Web development", "Teaching"],
    memberCount: 3,
    communityCount: 3,
    createdAt: "2026-01-01T00:00:00Z",
  },
};

export const MOCK_COMMUNITIES: CommunityListItem[] = [
  {
    id: "comm-python",
    title: "Python for Absolute Beginners",
    slug: "python-for-absolute-beginners",
    excerpt: "A gentle, project-driven introduction to Python. No experience needed.",
    imageUrl: null,
    priceAmount: "0.00",
    priceCurrency: "NGN",
    isFree: true,
    memberCount: 3,
    isPublished: true,
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[7]],
    creator: AMARA,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "comm-launch",
    title: "Launch Your First Product in 30 Days",
    slug: "launch-your-first-product-in-30-days",
    excerpt: "A 30-day guided sprint from idea to launched product, with daily accountability.",
    imageUrl: null,
    priceAmount: "5000.00",
    priceCurrency: "NGN",
    isFree: false,
    memberCount: 1,
    isPublished: true,
    categories: [MOCK_CATEGORIES[1], MOCK_CATEGORIES[3]],
    creator: AMARA,
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "comm-textiles",
    title: "African Textiles Design Foundations",
    slug: "african-textiles-design-foundations",
    excerpt: "Patterns, colour, and craft — the foundations of African textile design.",
    imageUrl: null,
    priceAmount: "2500.00",
    priceCurrency: "NGN",
    isFree: false,
    memberCount: 0,
    isPublished: true,
    categories: [MOCK_CATEGORIES[2]],
    creator: AMARA,
    createdAt: "2026-01-03T00:00:00Z",
  },
];

export function getCommunityDetail(slug: string): CommunityDetail | null {
  const item = MOCK_COMMUNITIES.find((c) => c.slug === slug);
  if (!item) return null;
  const { excerpt: _excerpt, ...rest } = item;
  return {
    ...rest,
    description:
      "A hands-on learning community with structured lessons, weekly discussions, and direct access to the creator. Learn at your own pace, ask questions anytime, and build real projects with feedback.",
    courses:
      slug === "python-for-absolute-beginners"
        ? [
            { id: "course-1", title: "Getting Started", position: 1, moduleCount: 2, lessonCount: 4, isPublished: true },
            { id: "course-2", title: "Control Flow", position: 2, moduleCount: 2, lessonCount: 4, isPublished: true },
          ]
        : [],
    updatedAt: "2026-09-20T00:00:00Z",
  };
}

// ── Local-only mocks (no backend endpoint yet) ─────────────────────────────

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    community_id: "comm-python",
    title: "Getting Started",
    description: "Install Python, write your first programs.",
    position: 1,
    is_published: true,
    module_count: 2,
    lesson_count: 4,
  },
  {
    id: "course-2",
    community_id: "comm-python",
    title: "Control Flow",
    description: "Conditionals, loops, and thinking like a programmer.",
    position: 2,
    is_published: true,
    module_count: 2,
    lesson_count: 4,
  },
];

export const MOCK_MODULES: Record<string, Module[]> = {
  "course-1": [
    {
      id: "mod-1",
      course_id: "course-1",
      title: "Setup & First Steps",
      position: 1,
      lessons: [
        {
          id: "les-1",
          module_id: "mod-1",
          title: "Installing Python",
          content: "Download Python, verify the install, and run your first line of code...",
          video_url: null,
          position: 1,
          is_published: true,
          is_completed: true,
        },
        {
          id: "les-2",
          module_id: "mod-1",
          title: "Variables & Types",
          content: "Numbers, strings, and naming things well...",
          video_url: null,
          position: 2,
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
    community_id: "comm-python",
    author_id: "creator-amara",
    author: { display_name: "Amara Okafor", avatar_url: null },
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
    community_id: "comm-python",
    author_id: "user-kwame",
    author: { display_name: "Kwame Mensah", avatar_url: null },
    content:
      "Just finished the setup lesson — Python 3.12 installed and my first print() works. Small win, but it feels big.",
    is_pinned: false,
    is_announcement: false,
    like_count: 42,
    comment_count: 7,
    created_at: "2026-09-28T14:30:00Z",
  },
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  "post-1": [
    {
      id: "c-1",
      post_id: "post-1",
      author_id: "user-kwame",
      author: { display_name: "Kwame Mensah", avatar_url: null },
      content: "Hi everyone! Kwame from Accra, here to finally learn Python properly.",
      created_at: "2026-09-01T11:00:00Z",
    },
    {
      id: "c-2",
      post_id: "post-1",
      author_id: "user-ada",
      author: { display_name: "Ada Nwosu", avatar_url: null },
      content: "Ada here from Enugu — excited to build my first project.",
      created_at: "2026-09-01T12:30:00Z",
    },
  ],
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    community_id: "comm-python",
    user_id: "user-kwame",
    author: { display_name: "Kwame Mensah", avatar_url: null },
    rating: 5,
    content: "Went from zero to writing my own scripts in three weeks. Amara actually answers questions.",
    created_at: "2026-09-15T00:00:00Z",
  },
  {
    id: "rev-2",
    community_id: "comm-python",
    user_id: "user-ada",
    author: { display_name: "Ada Nwosu", avatar_url: null },
    rating: 5,
    content: "The projects make all the difference — you're building from day one.",
    created_at: "2026-09-18T00:00:00Z",
  },
  {
    id: "rev-3",
    community_id: "comm-python",
    user_id: "user-zainab",
    author: { display_name: "Zainab Ali", avatar_url: null },
    rating: 4,
    content: "Great pace for beginners. Would love more weekend practice sessions.",
    created_at: "2026-09-22T00:00:00Z",
  },
];
