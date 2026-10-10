"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { useMembers } from "@/hooks/use-enrollments";
import type { CommunityListItem } from "@/types/api";

interface MembersPageProps {
  params: Promise<{ id: string }>;
}

function CommunityMembers({ community }: { community: CommunityListItem }) {
  const { data, isLoading, isError } = useMembers(community.slug);
  const members = data?.members ?? [];
  const error = data?.error;

  return (
    <>
      <header className="mt-4 flex flex-col gap-5 border-b border-sky-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-eyebrow">Community directory</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-950">
              <UsersRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Members</h1>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">Live enrollments returned by the backend for {community.title}.</p>
        </div>
        <div className="min-w-40 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Members enrolled</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{isLoading ? "…" : isError || error ? "—" : members.length.toLocaleString()}</p>
        </div>
      </header>

      {isLoading ? (
        <p role="status" aria-busy="true" className="mt-6 rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600">Loading members from the backend…</p>
      ) : isError || error ? (
        <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
          <p className="font-semibold text-slate-950">Couldn&apos;t load members</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{error ?? "The member request failed. Please try again."}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/80 to-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-900 shadow-sm">
            <UsersRound aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold text-slate-950">No members returned</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">The backend currently reports no enrollments for this community.</p>
        </div>
      ) : (
        <section className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_16px_48px_-42px_rgba(8,47,73,.5)]" aria-label="Community members">
          <div className="border-b border-sky-100 bg-sky-50/60 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-slate-900">All members <span className="ml-1 text-slate-500">({members.length})</span></h2>
          </div>
          <ul className="divide-y divide-sky-100">
            {members.map((member) => (
              <li key={member.userId} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
                <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-gradient-to-br from-sky-100 to-cyan-50 text-sm font-bold text-sky-950">
                  {member.displayName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">{member.displayName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Enrollment status</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-700" />
                  {member.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default function MembersPage({ params }: MembersPageProps) {
  const { id } = use(params);
  const { data: mine, isLoading, isError, error } = useMyCommunities();
  const community = mine?.find((item) => item.id === id || item.slug === id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href={community ? `/studio/communities/${community.id}` : "/studio"}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {community ? community.title : "Studio"}
        </Link>
      </Button>

      {isLoading ? (
        <p role="status" aria-busy="true" className="mt-6 rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600">Loading your communities…</p>
      ) : isError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">Could not load your communities. {error instanceof Error ? error.message : "Please try again."}</div>
      ) : !community ? (
        <div role="status" className="mt-6 rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-[0_12px_36px_-32px_rgba(8,47,73,.5)]">
          <p className="font-semibold text-slate-950">Community not found</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Sign in with the creator account that owns this community.</p>
          <Button className="mt-4" asChild><Link href="/studio">Back to studio</Link></Button>
        </div>
      ) : (
        <CommunityMembers community={community} />
      )}
    </main>
  );
}
