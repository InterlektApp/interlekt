"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { CommunityCard } from "@/components/community-card";
import { VerificationBadge } from "@/components/verification-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCommunities } from "@/hooks/use-communities";
import { useCreator } from "@/hooks/use-users";

interface CreatorPageProps {
  params: Promise<{ slug: string }>;
}

export default function CreatorPage({ params }: CreatorPageProps) {
  // Route param carries the backend user UUID (see CommunityCard links).
  const { slug: userId } = use(params);
  const { data: creator, isLoading } = useCreator(userId);
  const { data: list } = useCommunities({ pageSize: 50 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fbfd]">
        <SiteHeader />
        <main className="mx-auto max-w-6xl animate-pulse px-5 py-8 md:px-8 md:py-12">
          <div className="h-64 rounded-[28px] border border-sky-100 bg-white" />
          <div className="mt-9 h-8 w-1/3 rounded bg-sky-100" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!creator) notFound();

  const communities = (list?.items ?? []).filter((c) => c.creator.userId === creator.userId);

  return (
    <div className="min-h-screen bg-[#f7fbfd] text-[#102f45]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-white to-[#eaf8fc] p-6 shadow-[0_14px_45px_-34px_rgba(9,51,76,.35)] md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[36px] border-sky-100/60" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#c6ebf4] to-[#e7f8fc] text-3xl font-semibold text-[#0c5878] shadow-sm ring-1 ring-sky-100 md:h-24 md:w-24 md:text-4xl">
              {creator.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Creator profile</p>
              <h1 className="mt-2 flex flex-wrap items-center gap-2 font-display text-2xl tracking-tight text-[#092d46] md:text-3xl">
                {creator.displayName}
                <VerificationBadge status={creator.verificationStatus} size="md" />
              </h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-sky-800" aria-hidden="true" />
                {creator.memberCount.toLocaleString()} members across {creator.communityCount}{" "}
                {creator.communityCount === 1 ? "community" : "communities"}
              </p>
            </div>
          </div>

          {creator.bio && (
            <p className="relative mt-6 max-w-3xl text-base leading-8 text-slate-700">{creator.bio}</p>
          )}

          {creator.expertise.length > 0 && (
            <div className="relative mt-5 flex flex-wrap gap-2" aria-label="Creator expertise">
              {creator.expertise.map((e) => (
                <span
                  key={e}
                  className="rounded-full border border-sky-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-900"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10" aria-labelledby="creator-communities-title">
          <div className="flex flex-col gap-3 border-b border-sky-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Learn from {creator.displayName.split(" ")[0]}</p>
              <h2 id="creator-communities-title" className="mt-1 font-display text-xl font-semibold text-[#092d46] md:text-2xl">
                Communities by {creator.displayName.split(" ")[0]}
              </h2>
            </div>
            {communities.length > 0 && (
              <span className="text-sm text-slate-500">{communities.length} {communities.length === 1 ? "community" : "communities"}</span>
            )}
          </div>
          {communities.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-sky-200 bg-white px-6 py-12 text-center">
              <p className="font-medium text-[#092d46]">No published communities yet.</p>
              <p className="mt-2 text-sm text-slate-600">Check back later to see what this creator is sharing.</p>
              <Link href="/communities" className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-sky-900 underline decoration-sky-300 underline-offset-4 hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700">
                Browse all communities
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
