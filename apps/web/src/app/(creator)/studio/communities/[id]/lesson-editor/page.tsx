import Link from "next/link";
import { ArrowLeft, FileText, Link2, PlaySquare, Video } from "lucide-react";

type LessonEditorPageProps = {
  params: Promise<{ id: string }>;
};

const lessonTools = [
  { icon: FileText, label: "Lesson content", detail: "Shape the written part of a lesson" },
  { icon: Video, label: "Video", detail: "Embed or link hosted video" },
  { icon: Link2, label: "External resources", detail: "Connect learners to supporting material" },
];

export default async function LessonEditorPage({ params }: LessonEditorPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={`/studio/communities/${id}/course-builder`}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to course builder
      </Link>

      <header className="mt-4 border-b border-sky-100 pb-6">
        <p className="label-eyebrow">Course content</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Lesson editor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Write lesson content and attach embedded or externally hosted video.
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.6fr)]">
        <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_16px_48px_-42px_rgba(8,47,73,.5)]" aria-labelledby="lesson-canvas-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-950 shadow-sm">
                <FileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 id="lesson-canvas-title" className="text-sm font-semibold text-slate-950">Lesson content</h2>
                <p className="mt-0.5 text-xs text-slate-500">Editor workspace</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-950">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-700" />
              Tools coming soon
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <div className="min-h-64 rounded-xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/50 p-6 sm:p-10">
              <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-900 shadow-sm">
                  <PlaySquare aria-hidden="true" className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">Your lesson workspace</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The lesson editor is not active on this page yet. Content and video controls will be available here when the creator tools are ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-sky-100 bg-white p-5 sm:p-6">
          <p className="label-eyebrow">Lesson tools</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">A focused place to teach</h2>
          <ul className="mt-5 space-y-3">
            {lessonTools.map(({ icon: Icon, label, detail }) => (
              <li key={label} className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-900">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
