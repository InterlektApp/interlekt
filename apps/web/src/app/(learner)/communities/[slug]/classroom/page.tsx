"use client";

import { use } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { useCommunity } from "@/hooks/use-communities";
import { get } from "@/lib/api/client";

type LessonOutline = { id: string; title: string; position: number; isPublished: boolean };
type ModuleDetail = { id: string; title: string; position: number; lessons: LessonOutline[] };
type CourseDetail = { id: string; title: string; description: string | null; modules: ModuleDetail[]; moduleCount: number; lessonCount: number };
type ClassroomPageProps = { params: Promise<{ slug: string }> };

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const { slug } = use(params);
  const { data: community, isLoading: communityLoading, isError: communityError } = useCommunity(slug);
  const courseQueries = useQueries({
    queries: (community?.courses ?? []).map((course) => ({
      queryKey: ["course-detail", course.id],
      queryFn: () => get<CourseDetail>(`/courses/${encodeURIComponent(course.id)}`),
    })),
  });
  const courseLoading = courseQueries.some((query) => query.isLoading);
  const courseError = courseQueries.some((query) => query.isError);
  const courses = courseQueries.flatMap((query) => query.data ? [query.data] : []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href={`/communities/${slug}`} className="rounded-sm font-medium text-sky-800 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">{community?.title ?? "Community"}</Link>
        <span className="mx-2 text-slate-400">/</span><span aria-current="page">Classroom</span>
      </nav>
      <header className="mt-5 flex flex-col gap-4 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="label-eyebrow text-sky-800">Learn at your pace</p><h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Classroom</h1><p className="mt-2 text-sm text-slate-600">{community?.title ?? "Your community courses"}</p></div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-3.5 py-2 text-sm font-medium text-sky-900"><BookOpen className="h-4 w-4 text-cyan-700" aria-hidden="true" />{community?.courses.length ?? 0} {(community?.courses.length ?? 0) === 1 ? "course" : "courses"}</span>
      </header>

      {communityLoading || courseLoading ? <div className="mt-6 h-36 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" aria-label="Loading backend courses" />
        : communityError ? <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">Could not load this community from the backend.</div>
        : courseError ? <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">Course details could not be loaded. Sign in with an enrolled learner account and try again.</div>
        : !community?.courses.length ? <section className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-12 text-center sm:py-14"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-7 w-7" aria-hidden="true" /></span><p className="mt-4 font-semibold text-slate-950">No published courses yet</p><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">Courses published by the creator will appear here.</p></section>
        : <div className="mt-6 space-y-5">{courses.map((course) => <section key={course.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
          <header className="border-b border-sky-100 bg-sky-50/70 p-5 sm:p-6"><span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-800"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />Course</span><h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{course.title}</h2>{course.description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{course.description}</p>}<p className="mt-3 text-xs font-semibold text-slate-600">{course.moduleCount} modules · {course.lessonCount} lessons</p></header>
          {!course.modules.length ? <p className="p-5 text-sm text-slate-600">No modules have been added to this course yet.</p> : course.modules.map((module, index) => <div key={module.id} className="border-b border-sky-100 p-5 last:border-0 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-semibold text-sky-800">{String(index + 1).padStart(2, "0")}</span><h3 className="text-sm font-semibold text-slate-800">{module.title}</h3></div><ul className="mt-3 divide-y divide-sky-100">{module.lessons.map((lesson) => <li key={lesson.id}><Link href={`/communities/${slug}/classroom/lessons/${lesson.id}`} className="group flex min-h-12 items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"><span className="min-w-0 flex-1 text-sm font-medium text-slate-800 group-hover:text-sky-900">{lesson.title}</span><PlayCircle className="h-4 w-4 shrink-0 text-cyan-700" aria-hidden="true" /><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link></li>)}</ul></div>)}
        </section>)}</div>}
    </main>
  );
}
