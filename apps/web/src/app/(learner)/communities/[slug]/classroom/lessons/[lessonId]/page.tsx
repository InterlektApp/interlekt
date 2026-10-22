"use client";

import { use } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { Alert, Progress } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/interactive";
import { LearnerShell, SkeletonBlock } from "@/components/learner/learner-shell";
import { useCommunity, useCommunityCourses, useLesson, useSetLessonComplete } from "@/hooks/use-learning";
import { get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { formatDuration } from "@/lib/dates";
import type { CourseDetail, CourseProgressResponse } from "@/types/api";

type LessonPageProps = { params: Promise<{ slug: string; lessonId: string }> };

export default function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = use(params);
  const community = useCommunity(slug);
  const courses = useCommunityCourses(slug);
  const lesson = useLesson(lessonId);
  const setComplete = useSetLessonComplete(lessonId);

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

  const progressItems = progress.flatMap((query) => query.data?.lessons ?? []);
  const current = progressItems.find((item) => item.lessonId === lessonId);
  const isCompleted = current?.completed ?? false;

  const flatLessons = details.flatMap((query) =>
    (query.data?.modules ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .flatMap((module) =>
        module.lessons
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((lessonItem) => ({
            id: lessonItem.id,
            title: lessonItem.title,
            durationSeconds: lessonItem.durationSeconds,
            moduleTitle: module.title,
          })),
      ),
  );
  const index = flatLessons.findIndex((item) => item.id === lessonId);
  const previous = index > 0 ? flatLessons[index - 1] : null;
  const next = index >= 0 && index < flatLessons.length - 1 ? flatLessons[index + 1] : null;

  if (lesson.isError) {
    return (
      <LearnerShell active="classroom">
        <main className="container py-10">
          <Alert variant="danger" title="This lesson could not be loaded">
            {apiErrorMessage(lesson.error)}{" "}
            <button type="button" className="font-semibold underline" onClick={() => void lesson.refetch()}>
              Try again
            </button>
          </Alert>
          <Link href={`/communities/${slug}/classroom`} className="mt-4 inline-block text-15 font-medium text-accent">
            Back to classroom
          </Link>
        </main>
      </LearnerShell>
    );
  }

  return (
    <LearnerShell active="classroom">
      <main className="container py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href={`/communities/${slug}`}>{community.data?.title ?? "Community"}</Link>
          <span className="sep" aria-hidden="true">/</span>
          <Link href={`/communities/${slug}/classroom`}>Classroom</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span className="current">{lesson.data?.title ?? "Lesson"}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_320px]">
          <div className="min-w-0">
            {lesson.isLoading ? (
              <div className="skeleton aspect-video w-full" aria-label="Loading lesson" />
            ) : lesson.data?.videoUrl ? (
              <video
                src={lesson.data.videoUrl}
                controls
                className="aspect-video w-full rounded-lg bg-ink"
                aria-label={`${lesson.data.title} video`}
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg bg-ink text-white">
                <p className="text-17 font-medium">No video for this lesson</p>
                <p className="text-15 text-white/60">Read the lesson below to continue.</p>
              </div>
            )}

            <div className="mt-6">
              <Tabs
                tabs={[
                  { id: "overview", label: "Overview" },
                  { id: "resources", label: "Resources" },
                  { id: "discussion", label: "Discussion" },
                ]}
                value="overview"
                onChange={() => undefined}
              />
            </div>

            <article className="mt-6">
              <h1 className="h2">{lesson.data?.title ?? "Lesson"}</h1>
              {lesson.data?.summary ? (
                <p className="mt-3 text-body text-ink-2">{lesson.data.summary}</p>
              ) : null}

              {lesson.data?.content ? (
                <LessonContent content={lesson.data.content} />
              ) : lesson.isLoading ? (
                <div className="mt-4 space-y-2">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-5/6" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              ) : null}

              {lesson.data ? (
                <div className="alert alert-info mt-6">
                  <div>
                    <p className="font-semibold">Mark it as done</p>
                    <p className="mt-1 text-15 text-ink-2">
                      Your progress is saved to your account and updates your course completion.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button
                        onClick={() => setComplete.mutate(!isCompleted)}
                        disabled={setComplete.isPending}
                        variant={isCompleted ? "secondary" : "primary"}
                      >
                        {isCompleted ? "Mark as not done" : "Mark as complete"}
                      </Button>
                      {lesson.data.durationSeconds ? (
                        <span className="text-sm text-ink-3">{formatDuration(lesson.data.durationSeconds)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <nav aria-label="Lesson navigation" className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              {previous ? (
                <Button asChild variant="secondary">
                  <Link href={`/communities/${slug}/classroom/lessons/${previous.id}`}>
                    <span className="text-ink-3">Previous</span>
                    <span className="truncate">{previous.title}</span>
                  </Link>
                </Button>
              ) : (
                <span />
              )}
              {next ? (
                <Button asChild size="lg">
                  <Link href={`/communities/${slug}/classroom/lessons/${next.id}`}>
                    <span>Next lesson</span>
                    <span className="truncate">{next.title}</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="secondary">
                  <Link href={`/communities/${slug}/classroom`}>Back to classroom</Link>
                </Button>
              )}
            </nav>
          </div>

          <aside className="space-y-4">
            <div className="card card-sm">
              <h4 className="h6">Up next</h4>
              {flatLessons.length === 0 ? (
                <p className="mt-2 text-xs text-ink-3">The course outline appears here.</p>
              ) : (
                <div className="mt-2">
                  {flatLessons.map((item) => {
                    const done = progressItems.find((p) => p.lessonId === item.id)?.completed ?? false;
                    return (
                      <Link
                        key={item.id}
                        href={`/communities/${slug}/classroom/lessons/${item.id}`}
                        className={`lesson-row ${item.id === lessonId ? "active" : ""}`}
                        aria-current={item.id === lessonId ? "true" : undefined}
                      >
                        <span className={`lesson-status ${done ? "done" : ""}`} aria-hidden="true" />
                        <span className="lesson-title">{item.title}</span>
                        <span className="lesson-meta">{formatDuration(item.durationSeconds)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {community.data ? (
              <div className="card card-sm">
                <h4 className="h6">Your progress</h4>
                <div className="progress mt-3">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        progressItems.length
                          ? Math.round(
                              (progressItems.filter((item) => item.completed).length / progressItems.length) * 100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-ink-2">
                  {progressItems.filter((item) => item.completed).length} of {progressItems.length} lessons complete
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
    </LearnerShell>
  );
}

/**
 * Renders the lesson body. The API stores the body as one opaque string, so
 * fenced code blocks are parsed out and rendered with the design's
 * `.code-block` style. Everything else renders as paragraphs.
 */
function LessonContent({ content }: { content: string }) {
  const blocks = content.split(/```/);
  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          const code = block.replace(/^[a-zA-Z0-9+#-]*\n/, "");
          return (
            <pre key={index} className="code-block">
              <code>{code.trim()}</code>
            </pre>
          );
        }
        const trimmed = block.trim();
        if (!trimmed) return null;
        return (
          <p key={index} className="text-body whitespace-pre-wrap text-ink-2">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
