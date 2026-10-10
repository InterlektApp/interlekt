"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLesson, MOCK_MODULES } from "@/lib/mocks";
import { notFound } from "next/navigation";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = use(params);
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const [completed, setCompleted] = useState(lesson.is_completed);

  // Prev/next within the same module
  const allLessons = Object.values(MOCK_MODULES).flatMap((mods) => mods.flatMap((m) => m.lessons));
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const markComplete = () => {
    // Real app: POST /lessons/{id}/complete, then invalidate lesson + course keys.
    setCompleted(true);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link href={`/communities/${slug}/classroom`} className="rounded-sm font-medium text-sky-800 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">{lesson.courseTitle}</Link>
        <span aria-hidden="true" className="text-slate-400">/</span><span aria-current="page" className="text-slate-600">{lesson.title}</span>
      </nav>

      <header className="mt-5 flex flex-col gap-3 border-b border-sky-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="label-eyebrow text-sky-800">Lesson</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">{lesson.title}</h1>
        </div>
        {completed && <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Completed</span>}
      </header>

      <section aria-label="Lesson video" className="mt-6 overflow-hidden rounded-2xl border border-sky-900/20 bg-slate-950 shadow-sm">
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-300">
          {lesson.video_url ? (
            <video src={lesson.video_url} controls aria-label={`${lesson.title} video`} className="h-full w-full rounded-2xl" />
          ) : (
            <div className="flex flex-col items-center px-5 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200"><PlayCircle className="h-7 w-7" aria-hidden="true" /></span>
              <p className="mt-4 text-sm font-medium text-white">No video for this lesson</p>
              <p className="mt-1 text-xs text-slate-400">Read on below to continue.</p>
            </div>
          )}
        </div>
      </section>

      {lesson.content && (
        <article className="mt-7 rounded-2xl border border-sky-200 bg-white p-5 sm:p-7">
          <p className="text-base leading-8 text-slate-700">{lesson.content}</p>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Take your time with this one. The best way to learn is to try it yourself —
            open a terminal, write the code, break it, fix it. When you&apos;re done,
            mark the lesson complete and move on.
          </p>
        </article>
      )}

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold text-slate-950">Your progress</p>
          <p className="mt-1 text-xs text-slate-600">Mark this lesson complete when you&apos;re ready to move on.</p>
        </div>
        {completed ? (
          <p role="status" className="flex items-center gap-2 font-medium text-emerald-700"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />Completed — nice work.</p>
        ) : (
          <Button onClick={markComplete} className="w-full sm:w-auto"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Mark as complete</Button>
        )}
      </section>

      <nav aria-label="Lesson navigation" className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
        {prev ? (
          <Button variant="outline" asChild className="max-w-full justify-start sm:max-w-[48%]">
            <Link href={`/communities/${slug}/classroom/lessons/${prev.id}`}><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="truncate">{prev.title}</span></Link>
          </Button>
        ) : <span />}
        {next && (
          <Button asChild className="max-w-full justify-end sm:ml-auto sm:max-w-[48%]">
            <Link href={`/communities/${slug}/classroom/lessons/${next.id}`}><span className="truncate">{next.title}</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </Button>
        )}
      </nav>
    </main>
  );
}
