"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#f7fbfd] text-[#102f45]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <section className="mx-auto max-w-5xl rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-white to-[#eaf8fc] px-6 py-9 shadow-[0_16px_50px_-40px_rgba(9,51,76,.3)] md:px-10 md:py-12">
          <div className="mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Search Interlekt
            </p>
            <h1 className="mt-4 font-display text-3xl tracking-tight text-[#092d46] md:text-5xl">
              Find your thing
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Search skills, interests, and creators to find a community where you can keep growing.
            </p>
            <form action="/search" method="get" role="search" className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-800" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search communities, topics, creators…"
                  aria-label="Search communities, topics, and creators"
                  className="h-12 w-full rounded-xl border border-sky-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-sky-300 focus-visible:border-sky-600 focus-visible:ring-4 focus-visible:ring-sky-100"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
                Search
              </Button>
            </form>
          </div>
        </section>

        <section className="mx-auto mt-9 max-w-5xl" aria-labelledby="search-results-title">
          {q.trim() ? (
            <>
              <div className="flex flex-col gap-2 border-b border-sky-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Search results</p>
                  <h2 id="search-results-title" className="mt-1 text-xl font-semibold tracking-tight text-[#092d46] md:text-2xl">
                    Results for “{q}”
                  </h2>
                </div>
                <p className="text-sm text-slate-500" aria-live="polite">
                  {isLoading
                    ? "Searching…"
                    : `${results.length} ${results.length === 1 ? "result" : "results"}`}
                </p>
              </div>

              {isLoading ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-2xl border border-sky-100 bg-white" />
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((c) => (
                    <CommunityCard key={c.id} community={c} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-sky-100 bg-white px-6 py-14 text-center shadow-sm md:px-12">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f6fb] text-sky-800">
                    <Search className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-lg font-semibold text-[#092d46]">Nothing matched “{q}”</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Try another phrase or browse all communities to discover something new.
                  </p>
                  <Button variant="outline" className="mt-5 rounded-full border-sky-200 text-sky-900 hover:bg-sky-50" asChild>
                    <Link href="/communities">
                      Browse communities <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-sky-100 bg-white px-6 py-10 text-center shadow-sm md:px-10">
              <p id="search-results-title" className="text-lg font-semibold text-[#092d46]">Start with a topic you care about</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Enter a skill, interest, or creator above — or explore the full community directory.
              </p>
              <Button variant="outline" className="mt-5 rounded-full border-sky-200 text-sky-900 hover:bg-sky-50" asChild>
                <Link href="/communities">
                  Explore communities <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </section>
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
