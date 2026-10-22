"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/use-auth";
import { LearnerNav } from "@/components/shell/learner-nav";

export interface LearnerShellProps {
  active?: "dashboard" | "explore" | "learning" | "classroom";
  children: React.ReactNode;
}

/**
 * The learner shell: signed-in top nav, no footer (per the design). The nav
 * reads the current account from `GET /auth/me`, so the avatar menu is always
 * accurate.
 */
export function LearnerShell({ active, children }: LearnerShellProps) {
  const { data: me } = useMe();
  const pathname = usePathname();
  const current = active ?? (
    pathname.startsWith("/dashboard") ? "dashboard" :
    pathname.startsWith("/my-communities") ? "learning" :
    pathname.includes("/classroom") ? "classroom" :
    pathname.startsWith("/communities") ? "explore" : undefined
  );

  return (
    <div className="page">
      <LearnerNav
        active={current}
        user={
          me ? { displayName: me.displayName, email: me.email, avatarUrl: me.avatarUrl } : undefined
        }
      />
      <main className="page-body">{children}</main>
    </div>
  );
}

/** A skeleton block shaped like the content it replaces. */
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton h-5 w-full", className)} aria-hidden="true" />;
}

export interface LessonTreeEntry {
  lessonId: string;
  title: string;
  durationSeconds: number | null;
  completed: boolean;
}

/**
 * Builds the ordered lesson list for a course and marks the first
 * incomplete lesson as "current". Lock states are NOT modelled — the backend
 * has no lock state, so nothing is ever rendered as locked.
 */
export function buildLessonTree(
  modules: { id: string; title: string; position: number; lessons: LessonTreeEntry[] }[],
  currentLessonId?: string,
) {
  const ordered = [...modules].sort((a, b) => a.position - b.position);
  let currentAssigned = false;
  return ordered.map((module, index) => {
    const lessons = module.lessons.map((lesson) => {
      const status = lesson.completed
        ? ("done" as const)
        : currentLessonId === lesson.lessonId || (!currentAssigned && !lesson.completed)
          ? (currentAssigned = true, ("current" as const))
          : ("todo" as const);
      return { ...lesson, status };
    });
    return { ...module, number: index + 1, lessons };
  });
}
