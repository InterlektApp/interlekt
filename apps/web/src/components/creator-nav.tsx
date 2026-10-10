"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-auth";

export function CreatorNav() {
  const router = useRouter();
  const logout = useLogout();

  const signOut = () => {
    logout.mutate(undefined, { onSettled: () => router.replace("/") });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/studio"
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-1 py-1 font-display text-lg text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
          aria-label="Interlekt Creator Studio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-800 text-white" aria-hidden="true">
            <BookOpen className="h-4 w-4" />
          </span>
          <span>Interlekt</span>
          <span className="hidden rounded-full bg-sky-50 px-2.5 py-1 font-sans text-xs font-semibold text-sky-800 sm:inline">Creator</span>
        </Link>

        <nav aria-label="Creator navigation" className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/studio"
            className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
          >
            Studio
          </Link>
          <Link
            href="/communities"
            className="hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 sm:inline-flex"
          >
            Explore
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={logout.isPending}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-3 text-sm font-semibold text-sky-950 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 disabled:cursor-wait disabled:opacity-60 sm:px-4"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>{logout.isPending ? "Signing out…" : "Sign out"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
