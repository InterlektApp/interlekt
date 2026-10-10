import Link from "next/link";
import { ArrowLeft, BookOpen, Layers3, ListOrdered, PlaySquare } from "lucide-react";

type CourseBuilderPageProps = {
  params: Promise<{ id: string }>;
};

const courseParts = [
  { icon: BookOpen, label: "Courses", detail: "Organise a learning path" },
  { icon: Layers3, label: "Modules", detail: "Group related lessons" },
  { icon: ListOrdered, label: "Lessons", detail: "Set a clear sequence" },
];

export default async function CourseBuilderPage({ params }: CourseBuilderPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={`/studio/communities/${id}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to community
      </Link>

      <header className="mt-4 border-b border-sky-100 pb-6">
        <p className="label-eyebrow">Community learning</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Course builder
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Create courses, organise modules, and order lessons. Publish when ready.
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(250px,.72fr)_minmax(0,1.28fr)]">
        <aside className="rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50 to-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-950 shadow-sm">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">Course outline</p>
              <p className="mt-0.5 text-xs text-slate-500">Builder workspace</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-dashed border-sky-200 bg-white/80 px-4 py-7 text-center">
            <p className="text-sm font-semibold text-slate-800">Your outline will appear here</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Courses, modules, and lessons can be arranged in this panel once builder tools are available.</p>
          </div>
        </aside>

        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_16px_48px_-42px_rgba(8,47,73,.5)] sm:p-8" aria-labelledby="course-tools-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="label-eyebrow">Course workspace</p>
              <h2 id="course-tools-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Build your learning path</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-950">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-700" />
              Tools coming soon
            </span>
          </div>

          <div className="mt-6 divide-y divide-sky-100 rounded-xl border border-sky-100">
            {courseParts.map(({ icon: Icon, label, detail }, index) => (
              <div key={label} className="flex items-center gap-4 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-900">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">{label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
                </span>
                <span aria-label={`Step ${index + 1}`} className="text-xs font-semibold tabular-nums text-slate-400">0{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-sky-50/80 p-4 text-sm leading-6 text-slate-600">
            <PlaySquare aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-900" />
            <p>Builder controls and publishing are not active on this page yet. No course content has been changed.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
