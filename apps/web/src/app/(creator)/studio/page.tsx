"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { CommunityCard } from "@/components/community-card";
import { useMyCommunities } from "@/hooks/use-communities";

export default function StudioPage() {
  // GET /communities/mine — empty when signed out or unreachable.
  const { data: mine = [], isLoading } = useMyCommunities();
  const totalMembers = mine.reduce((n, c) => n + c.memberCount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow">Studio</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900">
            Creator studio
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your communities, content, and earnings.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio/communities/new">
            <Plus className="h-4 w-4" />
            New community
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={totalMembers.toLocaleString()} />
        <StatCard
          label="Attributed revenue"
          value="—"
          hint="Shows once payments go live"
        />
        <StatCard label="Communities" value={mine.length} />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Your communities</h2>
      {isLoading ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200/70" />
          ))}
        </div>
      ) : mine.length === 0 ? (
        <div className="mt-4 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">No communities yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create one to start teaching — or sign in with a creator account.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/studio/communities/new">Create a community</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
