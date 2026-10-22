"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError, get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import { timeAgo } from "@/lib/dates";
import { EmptyState, Stars } from "@/components/ui/feedback";
import { PostCard } from "@/components/ui/content-cards";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import type {
  MemberResponse,
  ModuleWithLessons,
  Paginated,
  PostResponse,
  ReviewResponse,
} from "@/types/api";

/**
 * The tabbed body of the community detail page.
 *
 * Curriculum, reviews, members and the feed are all enrolled-only (or
 * creator-only) on the backend, so each section falls back to an honest
 * gated state instead of rendering an empty tab.
 */

/** The course fields the curriculum UI needs. */
export interface CourseOutline {
  id: string;
  title: string;
  moduleCount?: number;
  lessonCount?: number;
  slug?: string;
  position?: number;
  isPublished?: boolean;
}

type CommunityCourse = CourseOutline;

function isGated(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

function useCommunityCourses(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.communities.courses(slug),
    queryFn: async (): Promise<{ courses: CommunityCourse[]; gated: boolean }> => {
      try {
        const data = await get<Paginated<CommunityCourse>>(
          `/communities/${encodeURIComponent(slug)}/courses`,
        );
        return { courses: data.items, gated: false };
      } catch (error) {
        if (isGated(error)) return { courses: [], gated: true };
        throw error;
      }
    },
    enabled: enabled && Boolean(slug),
  });
}

function useCourseModules(courseId: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.courses.modules(courseId),
    queryFn: async (): Promise<ModuleWithLessons[]> => {
      const raw = await get<Paginated<ModuleWithLessons> | ModuleWithLessons[]>(
        `/courses/${encodeURIComponent(courseId)}/modules`,
      );
      return Array.isArray(raw) ? raw : raw.items;
    },
    enabled: enabled && Boolean(courseId),
  });
}

function ModuleBlock({ module, index }: { module: ModuleWithLessons; index: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="module-accordion">
      <button
        type="button"
        className="module-header w-full"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="module-title">{module.title}</span>
        <span className="module-meta">
          {module.lessonCount} {module.lessonCount === 1 ? "lesson" : "lessons"}
        </span>
        <Icon name="chevronDown" size={18} className="shrink-0 text-ink-3" />
      </button>
      {open ? (
        <div className="module-body">
          {module.lessons.length === 0 ? (
            <p className="text-sm muted" style={{ padding: "8px 12px" }}>
              No lessons in this module yet.
            </p>
          ) : (
            module.lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-row" style={{ cursor: "default" }}>
                <span className="lesson-status" aria-hidden="true" />
                <span className="lesson-title truncate">{lesson.title}</span>
                {lesson.durationSeconds ? (
                  <span className="lesson-meta">
                    {Math.round(lesson.durationSeconds / 60)} min
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function CourseBlock({ course, index, canReadModules }: { course: CommunityCourse; index: number; canReadModules: boolean }) {
  const { data: modules, isLoading } = useCourseModules(course.id, canReadModules);
  const moduleCount = course.moduleCount ?? modules?.length;
  const lessonCount = course.lessonCount;

  return (
    <div className="module-accordion">
      <div className="module-header">
        <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="module-title">{course.title}</span>
        <span className="module-meta">
          {typeof moduleCount === "number" ? `${moduleCount} modules` : null}
          {typeof moduleCount === "number" && typeof lessonCount === "number" ? " · " : null}
          {typeof lessonCount === "number" ? `${lessonCount} lessons` : null}
        </span>
      </div>
      {canReadModules ? (
        <div className="module-body">
          {isLoading ? (
            <div className="flex flex-col" style={{ gap: 8, padding: "0 12px 12px" }}>
              {Array.from({ length: 3 }, (_, row) => (
                <div key={row} className="skeleton" style={{ height: 40 }} />
              ))}
            </div>
          ) : modules && modules.length > 0 ? (
            <div className="flex flex-col" style={{ gap: 12 }}>
              {modules.map((module, moduleIndex) => (
                <ModuleBlock key={module.id} module={module} index={moduleIndex} />
              ))}
            </div>
          ) : (
            <p className="text-sm muted" style={{ padding: "0 12px 12px" }}>
              This course has no published modules yet.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export interface CommunityCurriculumProps {
  slug: string;
  /** Course summaries embedded in the community detail response. */
  summaryCourses: CourseOutline[];
  /** True when the viewer has an active enrollment in this community. */
  isEnrolled: boolean;
  enrollHref: string;
}

export function CommunityCurriculum({
  slug,
  summaryCourses,
  isEnrolled,
  enrollHref,
}: CommunityCurriculumProps) {
  const { data, isLoading, isError } = useCommunityCourses(slug, isEnrolled);
  const courses: CommunityCourse[] =
    summaryCourses.length > 0 ? summaryCourses : (data?.courses ?? []);

  if (!isEnrolled && courses.length === 0) {
    return (
      <EmptyState
        icon="bookOpen"
        title="Join to see the full curriculum"
        description="Courses, modules and lessons open up once you are a member of this community."
        action={{ label: "Join the community", href: enrollHref }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col" style={{ gap: 12 }} aria-label="Loading curriculum">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="skeleton" style={{ height: 72 }} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon="alertCircle"
        title="The curriculum could not be loaded"
        description="We couldn't reach the learning service. Please try again in a moment."
      />
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon="bookOpen"
        title="Curriculum is being prepared"
        description="This creator hasn't published their courses yet. Check back soon."
      />
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {courses.map((course, index) => (
        <CourseBlock key={course.id} course={course} index={index} canReadModules={isEnrolled} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                            */
/* ------------------------------------------------------------------ */

function useCommunityReviews(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.communities.reviews(slug),
    queryFn: async (): Promise<{ reviews: ReviewResponse[]; gated: boolean }> => {
      try {
        const data = await get<Paginated<ReviewResponse>>(
          `/communities/${encodeURIComponent(slug)}/reviews?page=1&pageSize=10`,
        );
        return { reviews: data.items, gated: false };
      } catch (error) {
        if (isGated(error)) return { reviews: [], gated: true };
        throw error;
      }
    },
    enabled: enabled && Boolean(slug),
  });
}

export interface CommunityReviewsProps {
  slug: string;
  rating: number | null;
  reviewCount: number;
  isEnrolled: boolean;
  enrollHref: string;
}

export function CommunityReviews({
  slug,
  rating,
  reviewCount,
  isEnrolled,
  enrollHref,
}: CommunityReviewsProps) {
  const { data, isLoading } = useCommunityReviews(slug, isEnrolled);

  if (reviewCount === 0) {
    return (
      <EmptyState
        icon="star"
        title="No reviews yet"
        description="Reviews appear here once members start rating this community."
      />
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="card">
        <div className="flex flex-wrap items-center gap-8">
          <div style={{ textAlign: "center", paddingRight: 32, borderRight: "1px solid var(--line)" }}>
            <div className="h2" style={{ fontSize: 44, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
              {rating?.toFixed(1) ?? "—"}
            </div>
            <Stars rating={rating} showCount={false} size="lg" />
            <div className="text-sm muted" style={{ marginTop: 4 }}>
              {reviewCount.toLocaleString()} {reviewCount === 1 ? "review" : "reviews"}
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--ink-2)", maxWidth: 320 }}>
            Individual reviews are published by members. The star breakdown is not published publicly yet.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col" style={{ gap: 16 }} aria-label="Loading reviews">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      ) : data && data.reviews.length > 0 ? (
        <div className="flex flex-col" style={{ gap: 16 }}>
          {data.reviews.map((review) => (
            <article key={review.id} className="card">
              <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
                <Avatar name={review.author.displayName} src={review.author.avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-15" style={{ fontWeight: 500, color: "var(--ink)" }}>
                    {review.author.displayName}
                  </p>
                  <p className="text-xs muted">{timeAgo(review.createdAt)}</p>
                </div>
                <Stars rating={review.rating} showCount={false} />
              </div>
              {review.content ? (
                <p className="text-body" style={{ color: "var(--ink-2)" }}>
                  {review.content}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="star"
          title="Reviews are members-only"
          description="Join the community to read what other members said about it."
          action={{ label: "Join the community", href: enrollHref }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Members                                                            */
/* ------------------------------------------------------------------ */

function useCommunityMembers(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.communities.members(slug),
    queryFn: async (): Promise<{ members: MemberResponse[]; gated: boolean }> => {
      try {
        const data = await get<Paginated<MemberResponse>>(
          `/communities/${encodeURIComponent(slug)}/members?page=1&pageSize=24`,
        );
        return { members: data.items, gated: false };
      } catch (error) {
        if (isGated(error)) return { members: [], gated: true };
        throw error;
      }
    },
    enabled: enabled && Boolean(slug),
  });
}

export interface CommunityMembersProps {
  slug: string;
  memberCount: number;
  /** Only the community's own creator can read the member list. */
  canReadMembers: boolean;
  enrollHref: string;
}

export function CommunityMembers({
  slug,
  memberCount,
  canReadMembers,
  enrollHref,
}: CommunityMembersProps) {
  const { data } = useCommunityMembers(slug, canReadMembers);

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <p className="text-sm" style={{ color: "var(--ink-2)" }}>
        <span className="tnum" style={{ color: "var(--ink)", fontWeight: 500 }}>
          {memberCount.toLocaleString()}
        </span>{" "}
        {memberCount === 1 ? "member has" : "members have"} joined this community.
      </p>

      {data && data.members.length > 0 ? (
        <div className="card">
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {data.members.map((member) => (
              <li key={member.userId} className="flex items-center gap-3">
                <Avatar name={member.displayName} src={member.avatarUrl} size="sm" />
                <div className="min-w-0">
                  <p className="text-15 truncate" style={{ fontWeight: 500, color: "var(--ink)" }}>
                    {member.displayName}
                  </p>
                  <p className="text-xs muted">Joined {timeAgo(member.joinedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          icon="users"
          title="Member lists aren&apos;t public"
          description="Interlekt doesn't publish member lists on community pages. Join the community to meet everyone in the feed."
          action={{ label: "Join the community", href: enrollHref }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feed                                                               */
/* ------------------------------------------------------------------ */

function useCommunityPosts(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.communities.posts(slug),
    queryFn: async (): Promise<{ posts: PostResponse[]; gated: boolean }> => {
      try {
        const data = await get<Paginated<PostResponse>>(
          `/communities/${encodeURIComponent(slug)}/posts?page=1&pageSize=20`,
        );
        return { posts: data.items, gated: false };
      } catch (error) {
        if (isGated(error)) return { posts: [], gated: true };
        throw error;
      }
    },
    enabled: enabled && Boolean(slug),
  });
}

export interface CommunityFeedProps {
  slug: string;
  isEnrolled: boolean;
  enrollHref: string;
}

export function CommunityFeed({ slug, isEnrolled, enrollHref }: CommunityFeedProps) {
  const { data, isLoading } = useCommunityPosts(slug, isEnrolled);

  if (!isEnrolled) {
    return (
      <EmptyState
        icon="message"
        title="The feed opens once you join"
        description="Questions, answers and announcements from the creator and other members live in the community feed."
        action={{ label: "Join the community", href: enrollHref }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col" style={{ gap: 16 }} aria-label="Loading feed">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="skeleton" style={{ height: 140 }} />
        ))}
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <EmptyState
        icon="message"
        title="No posts yet"
        description="The feed is empty. Once members start posting, their questions and answers show up here."
      />
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
