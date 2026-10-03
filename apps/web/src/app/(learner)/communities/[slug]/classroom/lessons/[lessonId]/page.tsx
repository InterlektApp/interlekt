"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
  const allLessons = Object.values(MOCK_MODULES).flatMap((mods) =>
    mods.flatMap((m) => m.lessons),
  );
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const markComplete = () => {
    // Real app: POST /lessons/{id}/complete, then invalidate lesson + course keys.
    setCompleted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-sm text-slate-500">
        <Link
          href={`/communities/${slug}/classroom`}
          className="hover:text-blue-600"
        >
          {lesson.courseTitle}
        </Link>{" "}
        / {lesson.title}
      </p>

      <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{lesson.title}</h1>

      {/* Video placeholder — MVP supports embedded/external video */}
      <div className="mt-6 flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-slate-400">
        {lesson.video_url ? (
          <video src={lesson.video_url} controls className="h-full w-full rounded-xl" />
        ) : (
          <p className="text-sm">No video for this lesson — read on below.</p>
        )}
      </div>

      {lesson.content && (
        <article className="prose prose-slate mt-6 max-w-none">
          <p className="leading-relaxed text-slate-700">{lesson.content}</p>
          <p className="leading-relaxed text-slate-700">
            Take your time with this one. The best way to learn is to try it yourself —
            open a terminal, write the code, break it, fix it. When you&apos;re done,
            mark the lesson complete and move on.
          </p>
        </article>
      )}

      <div className="mt-8 rounded-xl border bg-white p-4">
        {completed ? (
          <p className="flex items-center gap-2 font-medium text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            Completed — nice work.
          </p>
        ) : (
          <Button onClick={markComplete} className="w-full sm:w-auto">
            <CheckCircle2 className="h-4 w-4" />
            Mark as complete
          </Button>
        )}
      </div>

      <nav className="mt-6 flex items-center justify-between gap-4">
        {prev ? (
          <Button variant="outline" asChild>
            <Link href={`/communities/${slug}/classroom/lessons/${prev.id}`}>
              <ArrowLeft className="h-4 w-4" />
              {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild>
            <Link href={`/communities/${slug}/classroom/lessons/${next.id}`}>
              {next.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </nav>
    </div>
  );
}
