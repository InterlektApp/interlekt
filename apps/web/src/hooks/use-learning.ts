"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { del, get, post } from "@/lib/api/client";
import { qk } from "@/lib/query-keys";
import type {
  CommentResponse,
  CommunityDetail,
  CourseDetail,
  CourseProgressResponse,
  CourseSummary,
  LearningCommunityItem,
  LessonResponse,
  Paginated,
  PostResponse,
  ReviewResponse,
} from "@/types/api";

/**
 * Learner data hooks.
 *
 * Every hook here maps to a real endpoint. There is no mock layer: a hook
 * either returns backend data or an error the screen renders honestly.
 */

/** GET /communities/{slug} — community detail */
export function useCommunity(slug: string) {
  return useQuery({
    queryKey: qk.communities.detail(slug),
    queryFn: () => get<CommunityDetail>(`/communities/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });
}

/** GET /users/me/learning — the communities and courses the learner is in. */
export function useLearning() {
  return useQuery({
    queryKey: qk.users.learning(),
    queryFn: async () => {
      const data = await get<Paginated<LearningCommunityItem>>(
        "/users/me/learning?page=1&pageSize=50",
      );
      return data.items;
    },
  });
}

/** GET /communities/{slug}/courses — the course list (the detail call returns an empty array). */
export function useCommunityCourses(slug: string) {
  return useQuery({
    queryKey: qk.communities.courses(slug),
    queryFn: async () => {
      const data = await get<Paginated<CourseSummary>>(
        `/communities/${encodeURIComponent(slug)}/courses?page=1&pageSize=50`,
      );
      return data.items;
    },
    enabled: Boolean(slug),
  });
}

/** GET /courses/{courseId} — modules with their lesson outlines. */
export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: qk.courses.detail(courseId),
    queryFn: () => get<CourseDetail>(`/courses/${encodeURIComponent(courseId)}`),
    enabled: Boolean(courseId),
  });
}

/** GET /courses/{courseId}/progress — which lessons the learner completed. */
export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: qk.courses.progress(courseId),
    queryFn: () => get<CourseProgressResponse>(`/courses/${encodeURIComponent(courseId)}/progress`),
    enabled: Boolean(courseId),
  });
}

/** GET /lessons/{lessonId} */
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: qk.lessons.detail(lessonId),
    queryFn: () => get<LessonResponse>(`/lessons/${encodeURIComponent(lessonId)}`),
    enabled: Boolean(lessonId),
  });
}

/** POST /lessons/{lessonId}/complete and DELETE …/complete — idempotent upsert. */
export function useSetLessonComplete(lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (completed: boolean) =>
      completed
        ? post<void>(`/lessons/${encodeURIComponent(lessonId)}/complete`)
        : del<void>(`/lessons/${encodeURIComponent(lessonId)}/complete`),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.courses.all }),
        queryClient.invalidateQueries({ queryKey: qk.lessons.all }),
        queryClient.invalidateQueries({ queryKey: qk.users.learning() }),
      ]);
    },
  });
}


/** GET /communities/{slug}/posts — 403 for anyone who is not enrolled. */
export function useCommunityPosts(slug: string) {
  return useQuery({
    queryKey: qk.communities.posts(slug),
    queryFn: () =>
      get<Paginated<PostResponse>>(`/communities/${encodeURIComponent(slug)}/posts?page=1&pageSize=50`),
    enabled: Boolean(slug),
    retry: false,
  });
}

/** POST /communities/{slug}/posts */
export function useCreatePost(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      post<PostResponse>(`/communities/${encodeURIComponent(slug)}/posts`, { content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: qk.communities.posts(slug) });
    },
  });
}

/** GET /posts/{postId}/comments */
export function usePostComments(postId: string) {
  return useQuery({
    queryKey: qk.posts.comments(postId),
    queryFn: () => get<Paginated<CommentResponse>>(`/posts/${encodeURIComponent(postId)}/comments?page=1&pageSize=50`),
    enabled: Boolean(postId),
    retry: false,
  });
}

/** POST /posts/{postId}/comments */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      post<CommentResponse>(`/posts/${encodeURIComponent(postId)}/comments`, { content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: qk.posts.comments(postId) });
      await queryClient.invalidateQueries({ queryKey: qk.communities.all });
    },
  });
}

/** GET /communities/{slug}/reviews */
export function useCommunityReviews(slug: string) {
  return useQuery({
    queryKey: qk.communities.reviews(slug),
    queryFn: () =>
      get<Paginated<ReviewResponse>>(`/communities/${encodeURIComponent(slug)}/reviews?page=1&pageSize=50`),
    enabled: Boolean(slug),
    retry: false,
  });
}

/** POST /communities/{slug}/reviews — body is { rating, content }. */
export function useCreateReview(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; content?: string | null }) =>
      post<ReviewResponse>(`/communities/${encodeURIComponent(slug)}/reviews`, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.communities.reviews(slug) }),
        queryClient.invalidateQueries({ queryKey: qk.communities.all }),
      ]);
    },
  });
}
