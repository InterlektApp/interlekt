"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { get, post } from "@/lib/api/client";

type LessonItem = {
  id: string;
  moduleId: string;
  title: string;
  summary: string | null;
  contentType: string;
  content: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  position: number;
  isPublished: boolean;
};

type LessonPageProps = { params: Promise<{ slug: string; lessonId: string }> };

export default function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = use(params);
  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => get<LessonItem>(`/lessons/${encodeURIComponent(lessonId)}`),
  });
  const complete = useMutation({
    mutationFn: () => post<unknown>(`/lessons/${encodeURIComponent(lessonId)}/complete`),
  });

  if (isLoading) return <main className="mx-auto max-w-5xl px-4 py-10"><div className="h-64 animate-pulse rounded-2xl bg-sky-50" /></main>;
  if (isError || !lesson) return <main className="mx-auto max-w-5xl px-4 py-10"><div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">This lesson could not be loaded. Sign in with an enrolled learner account and try again.</div><Link className="mt-4 inline-block text-sm font-semibold text-sky-800 underline" href={`/communities/${slug}/classroom`}>Back to classroom</Link></main>;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600"><Link href={`/communities/${slug}/classroom`} className="rounded-sm font-medium text-sky-800 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">Classroom</Link><span aria-hidden="true" className="text-slate-400">/</span><span aria-current="page" className="text-slate-600">{lesson.title}</span></nav>
      <header className="mt-5 flex flex-col gap-3 border-b border-sky-200 pb-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-3xl"><p className="label-eyebrow text-sky-800">Lesson</p><h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">{lesson.title}</h1>{lesson.summary && <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>}</div>{complete.isSuccess && <span role="status" className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Completed</span>}</header>
      <section aria-label="Lesson video" className="mt-6 overflow-hidden rounded-2xl border border-sky-900/20 bg-slate-950 shadow-sm"><div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-300">{lesson.videoUrl ? <video src={lesson.videoUrl} controls aria-label={`${lesson.title} video`} className="h-full w-full rounded-2xl" /> : <div className="flex flex-col items-center px-5 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200"><PlayCircle className="h-7 w-7" aria-hidden="true" /></span><p className="mt-4 text-sm font-medium text-white">No video for this lesson</p><p className="mt-1 text-xs text-slate-400">Continue with the lesson content below.</p></div>}</div></section>
      {lesson.content && <article className="mt-7 rounded-2xl border border-sky-200 bg-white p-5 sm:p-7"><p className="whitespace-pre-wrap text-base leading-8 text-slate-700">{lesson.content}</p></article>}
      {complete.isError && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{complete.error.message}</p>}
      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><p className="text-sm font-semibold text-slate-950">Your progress</p><p className="mt-1 text-xs text-slate-600">Completion is recorded by the backend.</p></div>{complete.isSuccess ? <p className="flex items-center gap-2 font-medium text-emerald-700"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />Completed — nice work.</p> : <Button onClick={() => complete.mutate()} disabled={complete.isPending} className="w-full sm:w-auto"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{complete.isPending ? "Saving…" : "Mark as complete"}</Button>}</section>
    </main>
  );
}
