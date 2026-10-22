"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, Flame, UsersRound } from "lucide-react";
import { Alert } from "@/components/ui/feedback";
import { Stat } from "@/components/ui/data-display";
import { Progress } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { LearnerShell, SkeletonBlock } from "@/components/learner/learner-shell";
import { useLearning } from "@/hooks/use-learning";
import { useMyEnrollments } from "@/hooks/use-enrollments";
import { useMe } from "@/hooks/use-auth";
import { apiErrorMessage } from "@/lib/api/errors";
import type { LearningCommunityItem } from "@/types/api";

interface ContinueItem {
  communityId: string;
  communitySlug: string;
  communityTitle: string;
  courseId: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  nextLessonTitle: string | null;
}

export default function LearnerDashboardPage() {
  const { data: me } = useMe();
  const learning = useLearning();
  const enrollments = useMyEnrollments();

  const items: LearningCommunityItem[] = learning.data ?? [];
  const lessonsCompleted = useMemo(
    () => items.reduce((total, item) => total + item.courses.reduce((sum, course) => sum + course.completedLessons, 0), 0),
    [items],
  );

  const continueItem: ContinueItem | null = useMemo(() => {
    for (const item of items) {
      for (const course of item.courses) {
        if (course.totalLessons > 0 && course.completedLessons < course.totalLessons) {
          return {
            communityId: item.community.id,
            communitySlug: item.community.slug,
            communityTitle: item.community.title,
            courseId: course.courseId,
            courseTitle: course.title,
            completedLessons: course.completedLessons,
            totalLessons: course.totalLessons,
            percentComplete: course.percentComplete,
            nextLessonTitle: null,
          };
        }
      }
    }
    return null;
  }, [items]);

  const activeEnrollments = (enrollments.data ?? []).filter((item) => item.status === "active").length;

  return (
    <LearnerShell active="dashboard">
      <div className="mx-auto w-full max-w-content px-5 py-8 sm:px-8 sm:py-12">
        <header className="border-b border-line pb-6">
          <h1 className="text-32 font-semibold tracking-[-0.022em] text-ink sm:text-40">
            {me ? `Welcome back, ${me.displayName.split(" ")[0]}` : "Welcome back"}
          </h1>
          <p className="mt-2 max-w-2xl text-17 text-ink-2">
            {continueItem
              ? `You are ${continueItem.totalLessons - continueItem.completedLessons} lessons from finishing ${continueItem.courseTitle}.`
              : "Pick up where you left off, or find a new community to join."}
          </p>
        </header>

        {learning.isError ? (
          <Alert variant="danger" title="We couldn't load your learning" className="mt-6">
            {apiErrorMessage(learning.error)}{" "}
            <button type="button" className="font-semibold underline" onClick={() => void learning.refetch()}>
              Try again
            </button>
          </Alert>
        ) : null}

        <section aria-label="Learning overview" className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="card card-sm">
            <Stat label="Lessons completed" value={learning.isLoading ? "—" : lessonsCompleted} />
          </div>
          <div className="card card-sm">
            <Stat label="Communities joined" value={learning.isLoading ? "—" : items.length} />
          </div>
          <div className="card card-sm">
            <Stat
              label="Active enrollments"
              value={enrollments.isLoading ? "—" : activeEnrollments}
              meta="Across every community you're in"
            />
          </div>
        </section>

        <section aria-labelledby="continue-heading" className="mt-10">
          <h2 id="continue-heading" className="text-22 font-semibold tracking-[-0.014em] text-ink">
            Continue learning
          </h2>
          {learning.isLoading ? (
            <div className="card mt-4">
              <SkeletonBlock className="h-6 w-1/2" />
              <SkeletonBlock className="mt-3 h-4 w-1/3" />
              <SkeletonBlock className="mt-6 h-2 w-full" />
            </div>
          ) : continueItem ? (
            <article className="card mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-13 text-ink-3">{continueItem.communityTitle}</p>
                <h3 className="mt-1 text-19 font-semibold text-ink">{continueItem.courseTitle}</h3>
                <p className="mt-2 text-15 text-ink-2">
                  {continueItem.completedLessons} of {continueItem.totalLessons} lessons complete
                </p>
                <div className="mt-3 max-w-md">
                  <Progress
                    value={continueItem.percentComplete}
                    label={`${continueItem.courseTitle} progress`}
                  />
                </div>
              </div>
              <Button asChild className="shrink-0">
                <Link href={`/communities/${continueItem.communitySlug}/classroom`}>
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Continue
                </Link>
              </Button>
            </article>
          ) : (
            <div className="card mt-4 flex flex-col items-center gap-3 py-12 text-center">
              <span className="empty-icon">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-17 font-semibold text-ink">You have not started a course yet</p>
              <p className="max-w-md text-15 text-ink-3">
                Join a community to unlock its classroom, lessons and discussion room.
              </p>
              <Button asChild>
                <Link href="/communities">Explore communities</Link>
              </Button>
            </div>
          )}
        </section>

        <section aria-labelledby="communities-heading" className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <h2 id="communities-heading" className="text-22 font-semibold tracking-[-0.014em] text-ink">
              Your communities
            </h2>
            <Link href="/my-communities" className="text-15 font-medium text-accent">
              View all
            </Link>
          </div>
          {learning.isLoading ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="card">
                  <SkeletonBlock className="h-40 w-full" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="card mt-4 flex flex-col items-center gap-3 py-12 text-center">
              <span className="empty-icon">
                <UsersRound className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-17 font-semibold text-ink">No communities yet</p>
              <p className="max-w-md text-15 text-ink-3">
                Enrollments show up here as soon as you join a community.
              </p>
              <Button asChild>
                <Link href="/communities">Explore communities</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const percent = item.courses.length
                  ? Math.round(
                      item.courses.reduce((sum, course) => sum + course.percentComplete, 0) / item.courses.length,
                    )
                  : 0;
                return (
                  <Link
                    key={item.community.id}
                    href={`/communities/${item.community.slug}`}
                    className="card card-hover block"
                  >
                    <p className="text-15 font-semibold text-ink">{item.community.title}</p>
                    <p className="mt-1 text-13 text-ink-3">
                      {item.courses.length} {item.courses.length === 1 ? "course" : "courses"}
                    </p>
                    <div className="mt-4">
                      <Progress value={percent} label={`${item.community.title} progress`} />
                    </div>
                    <p className="mt-2 text-13 text-ink-3">{percent}% complete</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section aria-labelledby="next-heading" className="mt-10">
          <h2 id="next-heading" className="text-22 font-semibold tracking-[-0.014em] text-ink">
            Keep the momentum
          </h2>
          <div className="card mt-4 flex items-start gap-4">
            <span className="icon-box icon-box-accent">
              <Flame className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-15 font-medium text-ink">One lesson is enough today</p>
              <p className="mt-1 text-15 text-ink-3">
                Lesson progress is saved to your account, so you can stop mid-course and pick it up later.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LearnerShell>
  );
}
