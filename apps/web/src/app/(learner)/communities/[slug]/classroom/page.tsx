"use client";

import { use } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { Alert, Progress } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LearnerShell, SkeletonBlock, buildLessonTree } from "@/components/learner/learner-shell";
import { useCommunity, useCommunityCourses } from "@/hooks/use-learning";
import { get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { CourseDetail, CourseProgressResponse, LessonProgressItem } from "@/types/api";

type ClassroomPageProps = { params: Promise<{ slug: string }> };

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const { slug } = use(params);
  const community = useCommunity(slug);
  const courses = useCommunityCourses(slug);

  const courseIds = (courses.data ?? []).map((course) => course.id);
  const details = useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: ["courses", "detail", courseId],
      queryFn: () => get<CourseDetail>(`/courses/${encodeURIComponent(courseId)}`),
      enabled: Boolean(courseId),
    })),
  });
  const progress = useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: ["courses", "progress", courseId],
      queryFn: () => get<CourseProgressResponse>(`/courses/${encodeURIComponent(courseId)}/progress`),
      enabled: Boolean(courseId),
    })),
  });

  const loading = courses.isLoading || details.some((query) => query.isLoading);
  const error = community.error ?? courses.error ?? details.find((query) => query.isError)?.error;

  const totalLessons = details.reduce(
    (sum, query) => sum + (query.data?.lessonCount ?? 0),
    0,
  );
  const completedLessons = progress.reduce(
    (sum, query) => sum + (query.data?.completedLessons ?? 0),
    0,
  );
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <LearnerShell active="classroom">
      <main className="container py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href={`/communities/${slug}`}>Community</Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span className="current">Classroom</span>
        </nav>

        {error ? (
          <Alert variant="danger" title="We couldn't load this classroom" className="mt-6">
            {apiErrorMessage(error)}{" "}
            <button type="button" className="font-semibold underline" onClick={() => void community.refetch()}>
              Try again
            </button>
          </Alert>
        ) : null}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="h1">{community.data?.title ?? "Classroom"}</h1>
                <p className="mt-2 text-sm text-ink-2">
                  {courses.data?.length ?? 0} {(courses.data?.length ?? 0) === 1 ? "course" : "courses"} ·{" "}
                  {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
                </p>
              </div>
              <div className="w-full max-w-[240px]">
                <div className="progress progress-lg">
                  <div className="progress-bar" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-ink-3">Your progress</span>
                  <span className="font-semibold text-ink">{percent}%</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="card">
                    <SkeletonBlock className="h-5 w-1/3" />
                    <SkeletonBlock className="mt-3 h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : details.length === 0 ? (
              <div className="card mt-6 flex flex-col items-center gap-3 py-12 text-center">
                <span className="empty-icon">
                  <BookGlyph />
                </span>
                <p className="text-17 font-semibold text-ink">No published courses yet</p>
                <p className="max-w-md text-15 text-ink-3">
                  Courses published by the creator will appear here as soon as they are live.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {details.map((query, index) => {
                  const course = query.data;
                  if (!course) return null;
                  const courseProgress = progress[index]?.data;
                  const completed = new Set(
                    (courseProgress?.lessons ?? [])
                      .filter((lesson: LessonProgressItem) => lesson.completed)
                      .map((lesson: LessonProgressItem) => lesson.lessonId),
                  );
                  const tree = buildLessonTree(
                    course.modules.map((module) => ({
                      id: module.id,
                      title: module.title,
                      position: module.position,
                      lessons: module.lessons.map((lesson) => ({
                        lessonId: lesson.id,
                        title: lesson.title,
                        durationSeconds: lesson.durationSeconds,
                        completed: completed.has(lesson.id),
                      })),
                    })),
                  );

                  return (
                    <section key={course.id} className="module-accordion">
                      <div className="module-header">
                        <span className="module-number">
                          {String(tree.length ? 1 : 1).padStart(2, "0")}
                        </span>
                        <span className="module-title">{course.title}</span>
                        <span className="module-meta">
                          {course.moduleCount} modules · {course.lessonCount} lessons
                        </span>
                      </div>
                      {tree.map((module) => (
                        <div key={module.id} className="module-accordion" style={{ borderRadius: 0, border: 0, borderTop: "1px solid var(--line)" }}>
                          <div className="module-header">
                            <span className="module-number">
                              {String(module.number).padStart(2, "0")}
                            </span>
                            <span className="module-title">{module.title}</span>
                            <span className="module-meta">
                              {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                            </span>
                          </div>
                          <div className="module-body">
                            {module.lessons.map((lesson) => (
                              <Link
                                key={lesson.lessonId}
                                href={`/communities/${slug}/classroom/lessons/${lesson.lessonId}`}
                                className={`lesson-row ${lesson.status === "current" ? "active" : ""}`}
                                aria-current={lesson.status === "current" ? "true" : undefined}
                              >
                                <span className={`lesson-status ${lesson.status !== "todo" ? lesson.status : ""}`} aria-hidden="true">
                                  {lesson.status === "done" ? <CheckGlyph /> : lesson.status === "current" ? <PlayGlyph /> : null}
                                </span>
                                <span className="lesson-title">{lesson.title}</span>
                                <span className="lesson-meta">{formatDuration(lesson.durationSeconds)}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card card-sm">
              <h4 className="h6">Your instructor</h4>
              {community.data ? (
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={community.data.creator.displayName} src={community.data.creator.avatarUrl} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-15 font-medium text-ink">{community.data.creator.displayName}</p>
                    <p className="text-xs text-ink-3">
                      {community.data.creator.isVerified ? "Verified creator" : "Community creator"}
                    </p>
                  </div>
                </div>
              ) : (
                <SkeletonBlock className="mt-3 h-10 w-full" />
              )}
            </div>

            <div className="card card-sm">
              <h4 className="h6">Your progress</h4>
              <div className="progress mt-3">
                <div className="progress-bar" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-sm text-ink-2">
                {completedLessons} of {totalLessons} lessons complete
              </p>
              <p className="mt-1 text-xs text-ink-3">Progress is saved to your account automatically.</p>
            </div>

            <div className="card card-sm">
              <h4 className="h6">Community</h4>
              <p className="mt-2 text-sm text-ink-2">
                {community.data?.memberCount.toLocaleString() ?? 0} members learning together
              </p>
              <Link href={`/communities/${slug}/feed`} className="mt-3 inline-block text-sm font-medium text-accent">
                Open the feed
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </LearnerShell>
  );
}

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function BookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
