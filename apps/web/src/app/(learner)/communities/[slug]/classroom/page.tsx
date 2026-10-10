import Link from "next/link";
import { BookOpen, CheckCircle2, Circle, PlayCircle, ArrowRight } from "lucide-react";
import { MOCK_COURSES, MOCK_MODULES, getCommunityDetail } from "@/lib/mocks";
import { notFound } from "next/navigation";

interface ClassroomPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { slug } = await params;
  const community = getCommunityDetail(slug);
  if (!community) notFound();

  const courses = MOCK_COURSES.filter((c) => c.community_id === community.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href={`/communities/${slug}`} className="rounded-sm font-medium text-sky-800 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">{community.title}</Link>
        <span className="mx-2 text-slate-400">/</span><span aria-current="page">Classroom</span>
      </nav>
      <header className="mt-5 flex flex-col gap-4 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="label-eyebrow text-sky-800">Learn at your pace</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Classroom</h1>
          <p className="mt-2 text-sm text-slate-600">{community.title}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-3.5 py-2 text-sm font-medium text-sky-900"><BookOpen className="h-4 w-4 text-cyan-700" aria-hidden="true" />{courses.length} {courses.length === 1 ? "course" : "courses"}</span>
      </header>

      {courses.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-12 text-center sm:py-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-7 w-7" aria-hidden="true" /></span>
          <p className="mt-4 font-semibold text-slate-950">No courses yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">The creator hasn&apos;t published any courses in this community.</p>
        </section>
      ) : (
        <div className="mt-6 space-y-5">
          {courses.map((course) => {
            const modules = MOCK_MODULES[course.id] ?? [];
            const total = modules.reduce((n, m) => n + m.lessons.length, 0);
            const done = modules.reduce((n, m) => n + m.lessons.filter((l) => l.is_completed).length, 0);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);

            return (
              <section key={course.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
                <div className="border-b border-sky-100 bg-sky-50/70 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-800"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />Course</span>
                      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{course.title}</h2>
                      {course.description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{course.description}</p>}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-600">{done} of {total} lessons · {pct}%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-sky-100" role="progressbar" aria-label={`${course.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                    <div className="h-full rounded-full bg-cyan-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {modules.map((mod, moduleIndex) => (
                  <div key={mod.id} className="border-b border-sky-100 p-5 last:border-0 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-semibold text-sky-800">{String(moduleIndex + 1).padStart(2, "0")}</span>
                      <h3 className="text-sm font-semibold text-slate-800">{mod.title}</h3>
                    </div>
                    <ul className="mt-3 divide-y divide-sky-100">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/communities/${slug}/classroom/lessons/${lesson.id}`}
                            className="group flex min-h-12 items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
                          >
                            {lesson.is_completed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Completed" /> : <Circle className="h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />}
                            <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 group-hover:text-sky-900">{lesson.title}</span>
                            <PlayCircle className="h-4 w-4 shrink-0 text-cyan-700" aria-hidden="true" />
                            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
