"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
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

export default function ClassroomIndexPage() {
  const learning = useQuery({
    queryKey: ["learner-learning"],
    queryFn: () => get<Paginated<LearningCommunity>>("/users/me/learning?page=1&pageSize=50"),
  });
  const communities = learning.data?.items ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[30px] border-white/60" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="label-eyebrow text-sky-800">Your courses</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Classroom</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">Courses from communities you are enrolled in.</p>
        </div>
      </header>

      {learning.isLoading ? (
        <div className="mt-6 space-y-4" aria-label="Loading enrolled courses">
          <div className="h-40 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />
          <div className="h-40 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />
        </div>
      ) : learning.isError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Your enrolled courses could not be loaded. {apiErrorMessage(learning.error)} Sign in with your learner account and try again.
        </div>
      ) : communities.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-12 text-center sm:py-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-7 w-7" aria-hidden="true" /></span>
          <p className="mt-4 font-semibold text-slate-950">No enrolled courses yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">Join a community to see its courses and your learning progress here.</p>
          <Button className="mt-5" asChild><Link href="/communities">Explore communities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
        </section>
      ) : (
        <div className="mt-6 space-y-5">
          {communities.map(({ community, courses }) => (
            <section key={community.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
              <header className="flex flex-col gap-3 border-b border-sky-100 bg-sky-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div><p className="label-eyebrow text-sky-800">Enrolled community</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{community.title}</h2><p className="mt-1 text-sm text-slate-600">{courses.length} {courses.length === 1 ? "course" : "courses"}</p></div>
                <Button variant="outline" size="sm" className="w-fit bg-white" asChild><Link href={`/communities/${encodeURIComponent(community.slug)}/classroom`}>Open classroom <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
              </header>
              {courses.length === 0 ? (
                <p className="p-5 text-sm text-slate-600">No courses are available in this community yet.</p>
              ) : (
                <ul className="divide-y divide-sky-100">
                  {courses.map((course) => (
                    <li key={course.courseId}>
                      <Link href={`/communities/${encodeURIComponent(community.slug)}/classroom`} className="group flex flex-col gap-3 p-5 transition-colors hover:bg-sky-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-inset sm:flex-row sm:items-center sm:gap-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-cyan-800"><PlayCircle className="h-5 w-5" aria-hidden="true" /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-950 group-hover:text-sky-900">{course.title}</span><span className="mt-1 block text-xs text-slate-600">{course.completedLessons} of {course.totalLessons} lessons completed</span><span className="mt-2 block h-2 overflow-hidden rounded-full bg-sky-100" aria-label={`${course.percentComplete}% complete`}><span className="block h-full rounded-full bg-cyan-700" style={{ width: `${Math.min(100, Math.max(0, course.percentComplete))}%` }} /></span></span>
                        <span className="shrink-0 text-sm font-semibold text-sky-800">{course.percentComplete}%</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
