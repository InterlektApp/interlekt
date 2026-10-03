import Link from "next/link";
import { BookOpen, CheckCircle2, Circle, PlayCircle } from "lucide-react";
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
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-sm text-slate-500">
        <Link href={`/communities/${slug}`} className="hover:text-blue-600">
          {community.title}
        </Link>{" "}
        / Classroom
      </p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Classroom</h1>

      {courses.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-900">No courses yet</p>
          <p className="mt-1 text-sm text-slate-500">
            The creator hasn&apos;t published any courses in this community.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {courses.map((course) => {
            const modules = MOCK_MODULES[course.id] ?? [];
            const total = modules.reduce((n, m) => n + m.lessons.length, 0);
            const done = modules.reduce(
              (n, m) => n + m.lessons.filter((l) => l.is_completed).length,
              0,
            );
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);

            return (
              <section key={course.id} className="overflow-hidden rounded-xl border bg-white">
                <div className="border-b bg-slate-50/50 p-5">
                  <h2 className="font-semibold text-slate-900">{course.title}</h2>
                  {course.description && (
                    <p className="mt-1 text-sm text-slate-600">{course.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {done}/{total} · {pct}%
                    </span>
                  </div>
                </div>
                {modules.map((mod) => (
                  <div key={mod.id} className="border-b p-5 last:border-0">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {mod.title}
                    </h3>
                    <ul className="mt-2 divide-y">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/communities/${slug}/classroom/lessons/${lesson.id}`}
                            className="flex items-center gap-3 py-2.5 transition-colors hover:bg-slate-50"
                          >
                            {lesson.is_completed ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                            )}
                            <span className="flex-1 text-sm font-medium text-slate-800">
                              {lesson.title}
                            </span>
                            <PlayCircle className="h-4 w-4 text-slate-400" />
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
    </div>
  );
}
