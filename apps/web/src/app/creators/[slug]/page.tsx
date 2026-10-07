"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CommunityCard } from "@/components/community-card";
import { VerificationBadge } from "@/components/verification-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCommunities } from "@/hooks/use-communities";
import { useCreator } from "@/hooks/use-users";
import { MOCK_COMMUNITIES } from "@/lib/mocks";

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
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="mx-auto max-w-6xl animate-pulse px-4 py-8">
          <div className="h-40 rounded-2xl bg-slate-200" />
        </main>
      </div>
    );
  }

  if (!creator) notFound();

  const apiCommunities = (list?.items ?? []).filter((c) => c.creator.userId === creator.userId);
  const communities =
    apiCommunities.length > 0
      ? apiCommunities
      : MOCK_COMMUNITIES.filter((c) => c.creator.userId === creator.userId);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white">
              {creator.displayName.charAt(0)}
            </div>
            <div>
              <h1 className="flex items-center gap-2 font-display text-2xl tracking-tight text-slate-900 md:text-3xl">
                {creator.displayName}
                <VerificationBadge status={creator.verificationStatus} size="md" />
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {creator.memberCount.toLocaleString()} members across {creator.communityCount}{" "}
                {creator.communityCount === 1 ? "community" : "communities"}
              </p>
            </div>
          </div>

          {creator.bio && (
            <p className="mt-5 max-w-2xl leading-relaxed text-slate-700">{creator.bio}</p>
          )}

          {creator.expertise.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {creator.expertise.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">
          Communities by {creator.displayName.split(" ")[0]}
        </h2>
        {communities.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No published communities yet.</p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
