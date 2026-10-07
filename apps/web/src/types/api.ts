/**
 * API types — mirror of the Interlekt-backend contract
 * (InterlektApp/Interlekt-backend, camelCase JSON).
 *
 * Do not invent fields here. If the backend adds a field, add it here
 * with the exact wire name. If the backend lacks it, it doesn't exist.
 */

// ── Auth ───────────────────────────────────────────────────────────────────

export type Role = "learner" | "creator" | "admin";

export interface AccountResponse {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AccountResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  role?: "learner" | "creator";
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Users ──────────────────────────────────────────────────────────────────

export interface ProfileResponse {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: Role[];
  isCreator: boolean;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

// ── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

// ── Creators ───────────────────────────────────────────────────────────────

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface CreatorSummary {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
}

export interface CreatorProfileResponse {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  expertise: string[];
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  memberCount: number;
  communityCount: number;
  createdAt: string;
}

// ── Communities ────────────────────────────────────────────────────────────

export interface CommunityListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  /** Decimal-string major units, e.g. "5000.00". Never a JSON number. */
  priceAmount: string;
  priceCurrency: string;
  isFree: boolean;
  memberCount: number;
  isPublished: boolean;
  categories: Category[];
  creator: CreatorSummary;
  createdAt: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  position: number;
  moduleCount: number;
  lessonCount: number;
  isPublished: boolean;
}

export interface CommunityDetail extends Omit<CommunityListItem, "excerpt"> {
  description: string;
  courses: CourseSummary[];
  updatedAt: string;
}

export interface CommunityCreateRequest {
  title: string;
  description: string;
  categoryIds: string[];
  imageUrl?: string | null;
  priceAmount?: string;
}

// ── Enrollments & members ──────────────────────────────────────────────────

export type EnrollmentStatus = "pending" | "active" | "cancelled";

export interface CommunityRef {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  priceAmount: string;
  priceCurrency: string;
  isFree: boolean;
}

export interface EnrollmentResponse {
  id: string;
  community: CommunityRef;
  status: EnrollmentStatus;
  createdAt: string;
  cancelledAt: string | null;
}

export interface MemberResponse {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  status: EnrollmentStatus;
  joinedAt: string;
}

// ── Pagination & errors ────────────────────────────────────────────────────

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ── Local-only shapes (no backend endpoint yet) ────────────────────────────
// Feed posts/comments, lesson bodies, and reviews are rendered from mocks
// until the backend ships those domains. These types describe the mock
// content only.

export interface PostAuthor {
  display_name: string;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  author: PostAuthor;
  content: string;
  is_pinned: boolean;
  is_announcement: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author: PostAuthor;
  content: string;
  created_at: string;
}

export interface Review {
  id: string;
  community_id: string;
  user_id: string;
  author: PostAuthor;
  rating: number;
  content: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  position: number;
  is_published: boolean;
  is_completed: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  position: number;
  is_published: boolean;
  module_count: number;
  lesson_count: number;
}
