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
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { PageNav } from "@/components/page-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCategories, useCommunities } from "@/hooks/use-communities";
import { CATEGORY_ICONS } from "@/lib/mocks";

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

function ExploreInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const search = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useCommunities({ category, search, page });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const baseHref = `/communities?${new URLSearchParams({
    ...(category !== "all" ? { category } : {}),
    ...(search ? { q: search } : {}),
  }).toString()}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="label-eyebrow">Explore</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
          Find your community
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Learning communities led by people worth learning from — verified,
          reviewed, and priced in naira.
        </p>

        <form action="/communities" method="get" className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Search by topic, skill, or creator…"
              className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button type="submit" size="lg">
            Search
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/communities"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            All
          </Link>
          {categories.map((c) => {
            const Icon = ICONS[CATEGORY_ICONS[c.slug] ?? ""] ?? Search;
            return (
              <Link
                key={c.id}
                href={`/communities?category=${c.slug}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c.slug
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.name}
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200/70" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-xl border bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-900">No communities found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or browse another category.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
            <PageNav page={page} pages={totalPages} total={total} baseHref={baseHref || "/communities"} />
          </>
        )}
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
