"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Flame, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/lib/api/errors";
import { get } from "@/lib/api/client";
import type { Paginated } from "@/types/api";

type LearningCourse = {
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
};

type LearningCommunity = {
  community: { id: string; title: string; slug: string };
  courses: LearningCourse[];
};

export default function LearnerDashboard() {
  const learning = useQuery({
    queryKey: ["learner-learning"],
    queryFn: () => get<Paginated<LearningCommunity>>("/users/me/learning?page=1&pageSize=50"),
  });
  const communities = learning.data?.items ?? [];
  const completedLessons = communities.reduce(
    (communityTotal, item) => communityTotal + item.courses.reduce((courseTotal, course) => courseTotal + course.completedLessons, 0),
    0,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[30px] border-white/60" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="label-eyebrow text-sky-800">Your learning space</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Your dashboard</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Pick up where you left off.</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-sky-900">
            <BookOpen className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            A little progress adds up
          </div>
        </div>
      </section>

      {learning.isError && (
        <p role="alert" className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Learning data could not be loaded. {apiErrorMessage(learning.error)} Sign in with your learner account and try again.
        </p>
      )}

      <section aria-label="Learning overview" className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-cyan-800"><UsersRound className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="text-sm text-slate-600">Communities</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{learning.isLoading ? "—" : learning.isError ? "Unavailable" : communities.length}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-cyan-800"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="text-sm text-slate-600">Lessons completed</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{learning.isLoading ? "—" : learning.isError ? "Unavailable" : completedLessons}</p><p className="text-xs text-slate-500">From your course progress</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-cyan-800"><Flame className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="text-sm text-slate-600">Learning streak</p><p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-950">Unavailable</p><p className="text-xs text-slate-500">Streak data is not provided by the backend.</p></div>
        </div>
      </section>

      <section className="mt-9 sm:mt-11">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-eyebrow">Your next step</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight text-slate-950">Continue learning</h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-communities">View all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </Button>
        </div>
        {learning.isLoading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading communities">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-60 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />)}
          </div>
        ) : learning.isError ? null : communities.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-10 text-center sm:py-12">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-6 w-6" aria-hidden="true" /></span>
            <p className="mt-4 font-semibold text-slate-950">You haven&apos;t joined anything yet</p>
            <p className="mt-1 text-sm text-slate-600">Enrollments show up here once you join a community.</p>
            <Button className="mt-5" asChild><Link href="/communities">Explore communities</Link></Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map(({ community }) => (
              <Link key={community.id} href={`/communities/${encodeURIComponent(community.slug)}`} className="group rounded-2xl border border-sky-200 bg-white p-5 shadow-sm transition hover:border-cyan-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 font-display text-2xl font-semibold text-sky-800" aria-hidden="true">{community.title.charAt(0)}</span>
                <h3 className="mt-4 font-semibold text-slate-950 group-hover:text-cyan-800">{community.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-800">Open community <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
