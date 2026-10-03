/**
 * API type stubs — hand-written for the Day-1 contract freeze.
 *
 * These mirror the backend's Pydantic schemas. When the real
 * `/openapi.json` is available, regenerate with `pnpm gen:api` and
 * replace this file. Until then, `tsc` passes with no backend.
 */

// ── Enums ──────────────────────────────────────────────────────────────────

export type Role = "learner" | "creator" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type BillingPeriod = "one_time" | "monthly";
export type CommunityStatus = "draft" | "published" | "archived";
export type EnrollmentStatus = "active" | "expired" | "cancelled";
export type PaymentStatus = "pending" | "success" | "failed";

// ── Auth ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: Role;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Profiles ───────────────────────────────────────────────────────────────

export interface Profile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  interests: string[];
}

export interface CreatorProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  expertise: string[];
  verification_status: VerificationStatus;
  evidence_url: string | null;
  community_count: number;
  member_count: number;
}

// ── Communities ────────────────────────────────────────────────────────────

export interface Community {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  tags: string[];
  image_url: string | null;
  creator_id: string;
  creator: CreatorProfile;
  price_kobo: number;
  currency: string;
  billing_period: BillingPeriod;
  status: CommunityStatus;
  member_count: number;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
  can_enroll: boolean;
  enrollment: Enrollment | null;
}

export interface CommunityListItem {
  id: string;
  slug: string;
  title: string;
  category_id: string;
  image_url: string | null;
  creator: Pick<CreatorProfile, "display_name" | "avatar_url" | "verification_status">;
  price_kobo: number;
  currency: string;
  billing_period: BillingPeriod;
  member_count: number;
  rating: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

// ── Enrollment ─────────────────────────────────────────────────────────────

export interface Enrollment {
  id: string;
  user_id: string;
  community_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  expires_at: string | null;
}

// ── Courses & Lessons ──────────────────────────────────────────────────────

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

export interface Module {
  id: string;
  course_id: string;
  title: string;
  position: number;
  lessons: Lesson[];
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

// ── Feed ───────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  author: Pick<User, "display_name" | "avatar_url">;
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
  author: Pick<User, "display_name" | "avatar_url">;
  content: string;
  created_at: string;
}

// ── Payments ───────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  reference: string;
  community_id: string;
  user_id: string;
  amount_kobo: number;
  currency: string;
  platform_fee_kobo: number;
  creator_amount_kobo: number;
  status: PaymentStatus;
  provider: "paystack";
  provider_reference: string | null;
  created_at: string;
}

export interface PaymentInitializeRequest {
  community_id: string;
}

export interface PaymentInitializeResponse {
  reference: string;
  authorization_url: string;
  amount_kobo: number;
  currency: string;
}

// ── Reviews ────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  community_id: string;
  user_id: string;
  author: Pick<User, "display_name" | "avatar_url">;
  rating: number;
  content: string | null;
  created_at: string;
}

// ── Pagination ─────────────────────────────────────────────────────────────

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ── Error envelope ─────────────────────────────────────────────────────────

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
