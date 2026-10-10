"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Briefcase,
  Code2,
  GraduationCap,
  Heart,
  Megaphone,
  Palette,
  Search,
  Sprout,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { PageNav } from "@/components/page-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCategories, useCommunities } from "@/hooks/use-communities";

const ICONS: Record<string, typeof Code2> = {
  code: Code2,
  briefcase: Briefcase,
  palette: Palette,
  megaphone: Megaphone,
  wallet: Wallet,
  heart: Heart,
  "graduation-cap": GraduationCap,
  sprout: Sprout,
};

const CATEGORY_ICONS: Record<string, string> = {
  "technology-programming": "code",
  "business-entrepreneurship": "briefcase",
  "design-creative": "palette",
  "finance-investing": "wallet",
  "health-wellness": "heart",
  "language-communication": "megaphone",
  "agriculture-sustainability": "sprout",
  "education-teaching": "graduation-cap",
};

function ExploreInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const search = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { data: categories = [], isError: categoriesError } = useCategories();
  const { data, isLoading, isError } = useCommunities({ category, search, page });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const baseHref = `/communities?${new URLSearchParams({
    ...(category !== "all" ? { category } : {}),
    ...(search ? { q: search } : {}),
  }).toString()}`;

  return (
    <div className="min-h-screen bg-[#f7fbfd] text-[#102f45]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-white to-[#eaf8fc] px-6 py-8 shadow-[0_16px_50px_-40px_rgba(9,51,76,.3)] md:px-10 md:py-10">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
              Explore Interlekt
            </p>
            <h1 className="mt-4 font-display text-3xl tracking-tight text-[#092d46] md:text-5xl">
              Find your community
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Learning communities led by people worth learning from — verified,
              reviewed, and priced in naira.
            </p>

            <form action="/communities" method="get" className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-800" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Search by topic, skill, or creator…"
                  aria-label="Search communities by topic, skill, or creator"
                  className="h-12 w-full rounded-xl border border-sky-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-sky-300 focus-visible:border-sky-600 focus-visible:ring-4 focus-visible:ring-sky-100"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
                Search
              </Button>
            </form>
          </div>
        </section>

        <nav className="mt-7" aria-label="Filter communities by category">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/communities"
              aria-current={category === "all" ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                category === "all"
                  ? "bg-[#073451] text-white shadow-sm"
                  : "border border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              All communities
            </Link>
            {categories.map((c) => {
              const Icon = ICONS[CATEGORY_ICONS[c.slug] ?? ""] ?? Search;
              return (
                <Link
                  key={c.id}
                  href={`/communities?category=${c.slug}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                  aria-current={category === c.slug ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                    category === c.slug
                      ? "bg-[#073451] text-white shadow-sm"
                      : "border border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {c.name}
                </Link>
              );
            })}
          </div>
          {categoriesError && <p role="alert" className="mt-3 text-sm text-red-700">Categories could not be loaded from the backend.</p>}
          {!categoriesError && categories.length === 0 && <p className="mt-3 text-xs text-slate-500">No categories are configured on the backend yet.</p>}
        </nav>

        <section className="mt-10" aria-labelledby="community-results-title">
          <div className="mb-5 flex flex-col gap-2 border-b border-sky-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Learn together</p>
              <h2 id="community-results-title" className="mt-1 text-xl font-semibold tracking-tight text-[#092d46] md:text-2xl">
                {category === "all" ? "Communities to explore" : "Explore this category"}
              </h2>
            </div>
            <p className="text-sm text-slate-500" aria-live="polite">
              {isLoading
                ? "Finding communities…"
                : `${total.toLocaleString()} ${total === 1 ? "community" : "communities"}`}
            </p>
          </div>

          {isError ? (
            <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center text-sm text-amber-950">
              Communities could not be loaded from the backend. Please try again shortly.
            </div>
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl border border-sky-100 bg-white" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-sky-100 bg-white px-6 py-14 text-center shadow-sm md:px-12">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f6fb] text-sky-800">
                <Users className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-lg font-semibold text-[#092d46]">No communities found</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Try a different search term or browse another category to find a space that fits.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
              <PageNav page={page} pages={totalPages} total={total} baseHref={baseHref || "/communities"} className="mt-4 border-t border-sky-100" />
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreInner />
    </Suspense>
  );
}
