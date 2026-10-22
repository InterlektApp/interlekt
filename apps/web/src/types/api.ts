/**
 * API types — mirror of the live Interlekt backend contract
 * (https://interlekt-backend.onrender.com/openapi.json, camelCase JSON).
 *
 * Generated against the live OpenAPI spec on 2026-10-22 and verified with
 * live probes. Rules for this file:
 *
 *  1. A field exists here only if the backend returns it. Wire names are
 *     exact — do not "fix" casing.
 *  2. Money is a DECIMAL STRING in major units ("5000.00"), never a number.
 *     Use `lib/money.ts` to display it.
 *  3. Pagination envelope is FLAT: { items, total, page, pageSize, totalPages }.
 *  4. Fields marked `@pending` are in the agreed backend contract but have
 *     not landed yet. They are OPTIONAL so the app compiles and runs today;
 *     components read them defensively and gate the block on their presence.
 *     Never fabricate a value for them.
 */

// ── Auth ────────────────────────────────────────────────────────────────────

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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ── Users ───────────────────────────────────────────────────────────────────

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
  /** @pending `PATCH /users/me` — location. */
  location?: string | null;
  /** @pending `PATCH /users/me` — pronouns. */
  pronouns?: string | null;
  /** @pending `PATCH /users/me` — cover banner. */
  coverUrl?: string | null;
}

// ── Categories ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  /** @pending `GET /categories` — number of published communities. */
  communityCount?: number;
}

// ── Creators ────────────────────────────────────────────────────────────────

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
  /** Aggregate active members across the creator's published communities. */
  memberCount: number;
  communityCount: number;
  createdAt: string;
  /** `GET /creators/{userId}` and `GET/PUT /creators/me`. */
  headline?: string | null;
  /** `GET /creators/{userId}` and `GET/PUT /creators/me`. */
  coverUrl?: string | null;
  /** `GET /creators/{userId}` and `GET/PUT /creators/me`. */
  socialLinks?: Record<string, string> | null;
  /** @pending verification resource — when the creator was approved. */
  verifiedAt?: string | null;
}

export interface CreatorProfileUpdateRequest {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  expertise?: string[];
  /** @pending — currently silently dropped by the backend. */
  headline?: string | null;
  /** @pending — currently silently dropped by the backend. */
  socialLinks?: Record<string, string> | null;
  /** @pending — currently silently dropped by the backend. */
  coverUrl?: string | null;
}

// ── Communities ─────────────────────────────────────────────────────────────

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
  /** Returned by the live API. */
  rating?: number | null;
  /** Returned by the live API. */
  reviewCount?: number;
  /** @pending community field — secondary topics. */
  tags?: string[];
  /** @pending community field — what members will be able to do. */
  learningOutcomes?: string[];
  /** @pending community field — billing cadence. There is NO cadence today. */
  billingInterval?: "one_time" | "monthly" | null;
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
  /**
   * The live backend returns an EMPTY array here even for communities with
   * published courses. Fetch the course list separately.
   */
  courses: CourseSummary[];
  updatedAt: string;
}

export interface CommunityCreateRequest {
  title: string;
  description: string;
  categoryIds: string[];
  imageUrl?: string | null;
  priceAmount?: string;
  /** @pending community field. */
  tags?: string[];
  /** @pending community field. */
  learningOutcomes?: string[];
  /** @pending community field. */
  pricingModel?: "free" | "one_time" | "monthly";
}

export interface CommunityUpdateRequest {
  title?: string;
  description?: string;
  categoryIds?: string[];
  imageUrl?: string | null;
  priceAmount?: string;
  /** @pending community field. */
  tags?: string[];
  /** @pending community field. */
  learningOutcomes?: string[];
}

// ── Enrollments & members ───────────────────────────────────────────────────

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
  /** @pending — plan the learner bought (monthly / one_time). */
  plan?: string | null;
  /** @pending — amount actually paid, decimal string. */
  amountPaid?: string | null;
}

export interface MemberResponse {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  status: EnrollmentStatus;
  joinedAt: string;
  /** @pending — the backend never exposes member email. */
  email?: string | null;
  /** @pending — plan the member is on. */
  plan?: string | null;
  /** @pending — amount paid, decimal string. */
  amountPaid?: string | null;
  /** @pending — 0–100. */
  progressPercent?: number | null;
}

// ── Courses, modules, lessons ───────────────────────────────────────────────

export type LessonContentType = "text" | "video";

export interface LessonOutline {
  id: string;
  title: string;
  position: number;
  durationSeconds: number | null;
  isPublished: boolean;
}

export interface LessonResponse {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  summary: string | null;
  contentType: LessonContentType;
  content: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  position: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** @pending — downloadable files attached to the lesson. */
  resources?: LessonResource[];
  /** @pending — free-to-preview flag. */
  isFreePreview?: boolean;
  /** @pending — locked until this date. */
  lockedUntil?: string | null;
  /** @pending — required lesson id. */
  prerequisiteLessonId?: string | null;
}

export interface LessonResource {
  id: string;
  fileName: string;
  fileSize: number | null;
  fileType: string | null;
  downloadUrl: string;
  uploadedAt: string | null;
}

export interface LessonCreateRequest {
  title: string;
  summary?: string | null;
  contentType?: LessonContentType;
  content?: string | null;
  videoUrl?: string | null;
  durationSeconds?: number | null;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
}

export interface LessonUpdateRequest extends LessonCreateRequest {}

export interface ModuleResponse {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleWithLessons extends ModuleResponse {
  lessons: LessonOutline[];
}

export interface ModuleCreateRequest {
  title: string;
  description?: string | null;
  isPublished?: boolean | null;
}

export interface ModuleUpdateRequest {
  title?: string;
  description?: string | null;
  isPublished?: boolean | null;
  position?: number;
}

export interface CourseResponse {
  id: string;
  communityId: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  position: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail extends CourseResponse {
  moduleCount: number;
  lessonCount: number;
  modules: ModuleWithLessons[];
}

export interface CourseCreateRequest {
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  position?: number;
}

// ── Progress ────────────────────────────────────────────────────────────────

export interface LessonProgressItem {
  lessonId: string;
  moduleId: string;
  title: string;
  position: number;
  durationSeconds: number | null;
  completed: boolean;
  completedAt: string | null;
}

export interface ModuleProgressItem {
  moduleId: string;
  title: string;
  position: number;
  lessonCount: number;
  completedCount: number;
  isComplete: boolean;
}

export interface CourseProgressResponse {
  courseId: string;
  title: string;
  slug: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  modules: ModuleProgressItem[];
  lessons: LessonProgressItem[];
}

export interface LessonProgressResponse {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface LearningCourseItem {
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
}

export interface LearningCommunityItem {
  community: CommunityRef;
  courses: LearningCourseItem[];
}

export interface CreatorCourseItem extends CourseResponse {
  community: CommunityRef;
}

// ── Posts, comments, reviews ────────────────────────────────────────────────

export interface AuthorSummary {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PostResponse {
  id: string;
  communityId: string;
  authorId: string;
  author: AuthorSummary;
  content: string;
  isPinned: boolean;
  isAnnouncement: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateRequest {
  content: string;
  title?: string | null;
  kind?: "post" | "announcement";
}

export interface PostUpdateRequest {
  content?: string;
  title?: string | null;
}

export interface CommentResponse {
  id: string;
  postId: string;
  authorId: string;
  author: AuthorSummary;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateRequest {
  content: string;
}

export interface ReviewResponse {
  id: string;
  communityId: string;
  authorId: string;
  author: AuthorSummary;
  rating: number;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateRequest {
  rating: number;
  content?: string | null;
}

export interface ReviewUpdateRequest {
  rating?: number;
  content?: string | null;
}

// ── Admin ───────────────────────────────────────────────────────────────────

export interface VerificationStatusUpdateRequest {
  status: VerificationStatus;
  /** @pending — the live endpoint accepts `status` only. */
  note?: string | null;
  /** @pending — the live endpoint accepts `status` only. */
  reason?: string | null;
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
