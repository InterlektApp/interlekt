"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { ApiError, get } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import type {
  CommentResponse,
  CourseDetail,
  CourseProgressResponse,
  CourseResponse,
  EnrollmentResponse,
  LearningCommunityItem,
  LearningCourseItem,
  LessonResponse,
  Paginated,
  PostResponse,
  ReviewResponse,
} from "@/types/api";

/**
 * Learner data hooks.
 *
 * Every value these hooks return comes straight from the backend. Derived
 * numbers (progress, remaining time, the next incomplete lesson) are computed
 * here from real records — never invented.
 */

/** GET /users/me/learning — the learner's active communities + course progress. */
export function useMyLearning() {
  return useQuery({
    queryKey: qk.users.learning(),
    queryFn: () =>
      get<Paginated<LearningCommunityItem>>("/users/me/learning?page=1&pageSize=50"),
  });
}

/** GET /enrollments/mine — every enrollment, including pending and cancelled. */
export function useEnrollmentList() {
  return useQuery({
    queryKey: qk.enrollments.mine(),
    queryFn: async () => {
      const data = await get<Paginated<EnrollmentResponse>>(
        "/enrollments/mine?page=1&pageSize=100",
      );
      return data.items;
    },
  });
}

/** GET /communities/{slug}/courses — the published course list. */
export function useCommunityCourseList(slug: string) {
  return useQuery({
    queryKey: qk.communities.courses(slug),
    queryFn: () =>
      get<Paginated<CourseResponse>>(
        `/communities/${encodeURIComponent(slug)}/courses?page=1&pageSize=50`,
      ),
    enabled: Boolean(slug),
  });
}

/* ------------------------------------------------------------------ */
/* Lesson tree                                                        */
/* ------------------------------------------------------------------ */

export type LessonState = "done" | "current" | "todo";

export interface LessonNode {
  id: string;
  title: string;
  position: number;
  durationSeconds: number | null;
  state: LessonState;
}

export interface ModuleNode {
  id: string;
  title: string;
  position: number;
  lessonCount: number;
  completedCount: number;
  isComplete: boolean;
  percentComplete: number;
  lessons: LessonNode[];
}

export interface CourseNode {
  id: string;
  title: string;
  description: string | null;
  moduleCount: number;
  lessonCount: number;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  totalDurationSeconds: number;
  remainingDurationSeconds: number;
  /** False when the learner is not enrolled (progress could not be read). */
  hasProgress: boolean;
  modules: ModuleNode[];
}

export interface CourseTree {
  courses: CourseNode[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  /** Set when only the progress read failed — lesson states are unknown. */
  progressError: unknown;
  refetch: () => void;
}

/**
 * GET /communities/{slug}/courses + GET /courses/{id} + GET /courses/{id}/progress.
 *
 * Lesson state comes from the learner's real progress: a lesson is `done` when
 * the progress record says so, `current` for the first incomplete lesson in
 * course order, and `todo` for everything after it. The backend has no lock
 * state, so no lesson is ever rendered as locked.
 */
export function useCourseTree(slug: string): CourseTree {
  const coursesQuery = useCommunityCourseList(slug);
  const courseIds = (coursesQuery.data?.items ?? []).map((course) => course.id);

  const details = useQueries({
    queries: courseIds.map((id) => ({
      queryKey: qk.courses.detail(id),
      queryFn: () => get<CourseDetail>(`/courses/${encodeURIComponent(id)}`),
    })),
  });

  const progress = useQueries({
    queries: courseIds.map((id) => ({
      queryKey: qk.courses.progress(id),
      queryFn: () => get<CourseProgressResponse>(`/courses/${encodeURIComponent(id)}/progress`),
    })),
  });

  const isLoading =
    coursesQuery.isLoading || details.some((q) => q.isLoading) || progress.some((q) => q.isLoading);
  const failed = details.find((q) => q.isError) ?? progress.find((q) => q.isError);
  const isError = coursesQuery.isError || Boolean(failed);
  const progressError = progress.find((q) => q.isError)?.error ?? null;

  const courses: CourseNode[] = courseIds.map((id, index) => {
    const detail = details[index]?.data;
    const courseProgress = progress[index]?.data;
    const completedIds = new Set(
      (courseProgress?.lessons ?? []).filter((lesson) => lesson.completed).map((lesson) => lesson.lessonId),
    );
    const hasProgress = courseProgress !== undefined;

    let currentTaken = false;
    const modules: ModuleNode[] = [...(detail?.modules ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((module) => {
        const lessons: LessonNode[] = [...module.lessons]
          .sort((a, b) => a.position - b.position)
          .map((lesson) => {
            const done = completedIds.has(lesson.id);
            let state: LessonState = "todo";
            if (hasProgress) {
              if (done) {
                state = "done";
              } else if (!currentTaken) {
                state = "current";
                currentTaken = true;
              }
            }
            return {
              id: lesson.id,
              title: lesson.title,
              position: lesson.position,
              durationSeconds: lesson.durationSeconds,
              state,
            };
          });

        const moduleProgress = courseProgress?.modules.find((item) => item.moduleId === module.id);
        const completedCount = moduleProgress?.completedCount ?? lessons.filter((l) => l.state === "done").length;
        const lessonCount = moduleProgress?.lessonCount ?? lessons.length;

        return {
          id: module.id,
          title: module.title,
          position: module.position,
          lessonCount,
          completedCount,
          isComplete: moduleProgress?.isComplete ?? (completedCount === lessonCount && lessonCount > 0),
          percentComplete: lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0,
          lessons,
        };
      });

    const totalDurationSeconds = modules.reduce(
      (sum, module) =>
        sum + module.lessons.reduce((m, lesson) => m + (lesson.durationSeconds ?? 0), 0),
      0,
    );
    const remainingDurationSeconds = modules.reduce(
      (sum, module) =>
        sum +
        module.lessons.reduce(
          (m, lesson) => m + (lesson.state === "done" ? 0 : (lesson.durationSeconds ?? 0)),
          0,
        ),
      0,
    );

    return {
      id,
      title: detail?.title ?? courseProgress?.title ?? "Course",
      description: detail?.description ?? null,
      moduleCount: detail?.moduleCount ?? modules.length,
      lessonCount: detail?.lessonCount ?? modules.reduce((sum, module) => sum + module.lessons.length, 0),
      completedLessons: courseProgress?.completedLessons ?? 0,
      totalLessons: courseProgress?.totalLessons ?? detail?.lessonCount ?? 0,
      percentComplete: courseProgress?.percentComplete ?? 0,
      totalDurationSeconds,
      remainingDurationSeconds,
      hasProgress: courseProgress !== undefined,
      modules,
    };
  });

  return {
    courses,
    isLoading,
    isError,
    error: failed ?? coursesQuery.error,
    progressError,
    refetch: () => {
      void coursesQuery.refetch();
      void details.forEach((q) => void q.refetch());
      void progress.forEach((q) => void q.refetch());
    },
  };
}

/* ------------------------------------------------------------------ */
/* Continue learning                                                   */
/* ------------------------------------------------------------------ */

export interface ContinueTarget {
  courseId: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
}

/**
 * The next incomplete lesson for each in-progress course.
 *
 * `GET /courses/{id}/progress` already carries the lesson titles, so the
 * dashboard never has to guess what comes next.
 */
export function useContinueTargets(courses: LearningCourseItem[]) {
  const open = courses.filter((course) => course.percentComplete < 100 && course.totalLessons > 0);

  const queries = useQueries({
    queries: open.map((course) => ({
      queryKey: qk.courses.progress(course.courseId),
      queryFn: () => get<CourseProgressResponse>(`/courses/${encodeURIComponent(course.courseId)}/progress`),
    })),
  });

  const targets: ContinueTarget[] = open.map((course, index) => {
    const progress = queries[index]?.data;
    const next = [...(progress?.lessons ?? [])]
      .sort((a, b) => a.position - b.position)
      .find((lesson) => !lesson.completed);
    return {
      courseId: course.courseId,
      title: course.title,
      completedLessons: progress?.completedLessons ?? course.completedLessons,
      totalLessons: progress?.totalLessons ?? course.totalLessons,
      percentComplete: progress?.percentComplete ?? course.percentComplete,
      nextLessonId: next?.lessonId ?? null,
      nextLessonTitle: next?.title ?? null,
    };
  });

  return { targets, isLoading: queries.some((query) => query.isLoading) };
}

/* ------------------------------------------------------------------ */
/* Lessons, feed, comments, reviews                                    */
/* ------------------------------------------------------------------ */

/** GET /lessons/{id} */
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: qk.lessons.detail(lessonId),
    queryFn: () => get<LessonResponse>(`/lessons/${encodeURIComponent(lessonId)}`),
    enabled: Boolean(lessonId),
  });
}

export interface CommunityPostsResult {
  posts: PostResponse[];
  gated: boolean;
}

/**
 * GET /communities/{slug}/posts — 403 for learners who have not joined, so
 * the caller can show an honest "join to participate" state.
 */
export function useCommunityPosts(slug: string) {
  return useQuery({
    queryKey: qk.communities.posts(slug),
    queryFn: async (): Promise<CommunityPostsResult> => {
      try {
        const data = await get<Paginated<PostResponse>>(
          `/communities/${encodeURIComponent(slug)}/posts?page=1&pageSize=50`,
        );
        return { posts: data.items, gated: false };
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          return { posts: [], gated: true };
        }
        throw error;
      }
    },
    enabled: Boolean(slug),
  });
}

/** GET /posts/{id}/comments */
export function usePostComments(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.posts.comments(postId),
    queryFn: () => get<Paginated<CommentResponse>>(`/posts/${encodeURIComponent(postId)}/comments?page=1&pageSize=50`),
    enabled: enabled && Boolean(postId),
  });
}

/** GET /communities/{slug}/reviews — 401 for anonymous visitors. */
export function useCommunityReviews(slug: string) {
  return useQuery({
    queryKey: qk.communities.reviews(slug),
    queryFn: async () => {
      const data = await get<Paginated<ReviewResponse>>(
        `/communities/${encodeURIComponent(slug)}/reviews?page=1&pageSize=100`,
      );
      return data.items;
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
