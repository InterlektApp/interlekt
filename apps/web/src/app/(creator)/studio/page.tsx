"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { CommunityCard } from "@/components/community-card";
import { useMyCommunities } from "@/hooks/use-communities";

export default function StudioPage() {
  // GET /communities/mine — empty when signed out or unreachable.
  const { data: mine = [], isLoading } = useMyCommunities();
  const totalMembers = mine.reduce((n, c) => n + c.memberCount, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="flex flex-col gap-6 border-b border-sky-100 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="label-eyebrow">Creator workspace</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Creator studio
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Manage your communities, content, and earnings.
          </p>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href="/studio/communities/new">
            <Plus aria-hidden="true" className="h-4 w-4" />
            New community
          </Link>
        </Button>
      </section>

      <section aria-label="Studio overview" className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total members"
          value={totalMembers.toLocaleString()}
          className="min-h-28 border-sky-100"
        />
        <StatCard
          label="Attributed revenue"
          value="—"
          hint="Shows once payments go live"
          className="min-h-28 border-sky-100"
        />
        <StatCard
          label="Communities"
          value={mine.length}
          className="min-h-28 border-sky-100"
        />
      </section>

      <section className="mt-9" aria-labelledby="communities-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-eyebrow">Your work</p>
            <h2 id="communities-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Your communities
            </h2>
          </div>
          {!isLoading && mine.length > 0 && (
            <span className="text-sm text-slate-500">
              {mine.length} {mine.length === 1 ? "community" : "communities"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div aria-busy="true" aria-label="Loading your communities" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-sky-100 bg-sky-50/70" />
            ))}
          </div>
        ) : mine.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/90 via-white to-cyan-50/60 px-5 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-800 shadow-sm">
              <BookOpen aria-hidden="true" className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">No communities yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">
              Create one to start teaching — or sign in with a creator account.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/studio/communities/new">
                <Plus aria-hidden="true" className="h-4 w-4" />
                Create a community
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((c) => (
              <div key={c.id} className="relative">
                <CommunityCard community={c} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex items-center gap-2 border-t border-sky-100 pt-5 text-sm text-slate-500">
        <Wallet aria-hidden="true" className="h-4 w-4 text-sky-800" />
        Your earnings summary is available here as payment features go live.
        <ArrowUpRight aria-hidden="true" className="ml-auto hidden h-4 w-4 sm:block" />
      </div>
    </main>
  );
}
