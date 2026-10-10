"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { useMembers } from "@/hooks/use-enrollments";

interface MembersPageProps {
  params: Promise<{ id: string }>;
}

export default function MembersPage({ params }: MembersPageProps) {
  const { id } = use(params);
  const { data: mine = [] } = useMyCommunities();
  const community = mine.find((c) => c.id === id || c.slug === id);
  const { data } = useMembers(community?.slug ?? "");
  const members = community ? (data?.members ?? []) : [];
  const error = community ? data?.error : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href={community ? `/studio/communities/${community.id}` : "/studio"}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {community ? community.title : "Studio"}
        </Link>
      </Button>

      <header className="mt-4 flex flex-col gap-5 border-b border-sky-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-eyebrow">Community directory</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-950">
              <UsersRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Members</h1>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">Meet your community members and see their enrollment status.</p>
        </div>
        <div className="min-w-40 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Members enrolled</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{members.length.toLocaleString()}</p>
        </div>
      </header>

      {!community ? (
        <div role="status" className="mt-6 rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-[0_12px_36px_-32px_rgba(8,47,73,.5)]">
          <p className="font-semibold text-slate-950">Community not found</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Sign in with the creator account that owns this community.</p>
          <Button className="mt-4" asChild>
            <Link href="/studio">Back to studio</Link>
          </Button>
        </div>
      ) : error ? (
        <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
          <p className="font-semibold text-slate-950">Couldn&apos;t load members</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/80 to-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-900 shadow-sm">
            <UsersRound aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold text-slate-950">No members yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">Share your community link to get your first enrollments.</p>
        </div>
      ) : (
        <section className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_16px_48px_-42px_rgba(8,47,73,.5)]" aria-label="Community members">
          <div className="border-b border-sky-100 bg-sky-50/60 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-slate-900">All members <span className="ml-1 text-slate-500">({members.length})</span></h2>
          </div>
          <ul className="divide-y divide-sky-100">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
                <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-gradient-to-br from-sky-100 to-cyan-50 text-sm font-bold text-sky-950">
                  {m.displayName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">{m.displayName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Enrollment status</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-700" />
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
