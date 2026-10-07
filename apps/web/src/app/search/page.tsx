"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCommunities } from "@/hooks/use-communities";

function SearchInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  // Backend search runs server-side (?search=); empty query shows nothing
  // rather than everything — search is for finding, explore is for browsing.
  const { data, isLoading } = useCommunities({ search: q, pageSize: 20 });
  const results = q.trim() ? (data?.items ?? []) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="label-eyebrow">Search</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900">
          Find your thing
        </h1>
        <form action="/search" method="get" className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search communities, topics, creators…"
              className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {q.trim() && (
          <p className="mt-4 text-sm text-slate-500">
            {isLoading
              ? "Searching…"
              : `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”`}
          </p>
        )}

        {!isLoading && q.trim() && results.length > 0 && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}

        {!isLoading && q.trim() && results.length === 0 && (
          <div className="mt-6 rounded-xl border bg-white p-12 text-center">
            <p className="font-medium text-slate-900">Nothing matched “{q}”</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/communities">Browse everything instead</Link>
            </Button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
