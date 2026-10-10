"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, LogOut, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeaveCommunity, useMyEnrollments } from "@/hooks/use-enrollments";
import { MoneyAmount } from "@/components/money-amount";

export default function MyCommunitiesPage() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();
  const leave = useLeaveCommunity();
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const active = enrollments.filter((e) => e.status === "active");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[30px] border-white/60" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-eyebrow text-sky-800">Your learning library</p>
            <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">My communities</h1>
            <p className="mt-2 text-sm text-slate-600">A place for your classes, people and progress.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-sm font-medium text-sky-950">
            <UsersRound className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            <span>{active.length} {active.length === 1 ? "community" : "communities"} enrolled</span>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading communities">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />)}
        </div>
      ) : active.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-6 w-6" aria-hidden="true" /></span>
          <p className="mt-4 font-semibold text-slate-950">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-600">Find a community worth learning from.</p>
          <Button className="mt-5" asChild><Link href="/communities">Explore communities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((e) => (
            <article key={e.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <Link href={`/communities/${e.community.slug}`} className="group block rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-inset">
                <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-white">
                  <span className="absolute -right-5 -top-8 h-32 w-32 rounded-full border-[18px] border-white/40" aria-hidden="true" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-200 bg-white/85 font-display text-3xl font-semibold text-sky-800 shadow-sm">{e.community.title.charAt(0)}</span>
                  <span className="absolute left-4 top-4 rounded-full border border-sky-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide text-sky-800">{e.status}</span>
                </div>
                <div className="p-5">
                  <h2 className="line-clamp-1 font-semibold text-slate-950 transition-colors group-hover:text-cyan-800">{e.community.title}</h2>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><BookOpen className="h-3.5 w-3.5 text-cyan-700" aria-hidden="true" />Learning community</span>
                    <MoneyAmount priceAmount={e.community.priceAmount} currency={e.community.priceCurrency} isFree={e.community.isFree} />
                  </div>
                </div>
              </Link>
              <div className="flex gap-2 border-t border-sky-100 bg-sky-50/50 p-3">
                <Button variant="outline" size="sm" className="flex-1 bg-white" asChild>
                  <Link href={`/communities/${e.community.slug}/classroom`}>Classroom <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={leave.isPending && leavingId === e.id}
                  onClick={() => {
                    setLeavingId(e.id);
                    leave.mutate(e.id, { onSettled: () => setLeavingId(null) });
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Leave
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
