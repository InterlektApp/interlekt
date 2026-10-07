"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { MoneyAmount } from "@/components/money-amount";
import { useMyEnrollments } from "@/hooks/use-enrollments";
import type { EnrollmentResponse } from "@/types/api";

function EnrolledCard({ enrollment }: { enrollment: EnrollmentResponse }) {
  const c = enrollment.community;
  return (
    <Link
      href={`/communities/${c.slug}`}
      className="lift group overflow-hidden rounded-xl border bg-white shadow-sm"
    >
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100 font-display text-4xl text-blue-300">
        {c.title.charAt(0)}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600">
          {c.title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs capitalize text-emerald-600">
            {enrollment.status}
          </span>
          <MoneyAmount priceAmount={c.priceAmount} currency={c.priceCurrency} isFree={c.isFree} />
        </div>
      </div>
    </Link>
  );
}

export default function LearnerDashboard() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();
  const active = enrollments.filter((e) => e.status === "active");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="label-eyebrow">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900">
        Good evening
      </h1>
      <p className="mt-1 text-sm text-slate-500">Pick up where you left off.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Communities" value={active.length} />
        <StatCard label="Lessons completed" value={2} hint="Keep the streak going" />
        <StatCard label="Learning streak" value="3 days" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Continue learning</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-communities">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-slate-200/70" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="mt-4 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">You haven&apos;t joined anything yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Enrollments show up here once you join a community.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/communities">Explore communities</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((e) => (
            <EnrolledCard key={e.id} enrollment={e} />
          ))}
        </div>
      )}
    </div>
  );
}
