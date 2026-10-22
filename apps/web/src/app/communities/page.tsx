"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PublicShell } from "@/components/public/public-shell";
import { SearchField } from "@/components/public/search-field";
import { FilterSidebar, type CommunitySort } from "@/components/public/filter-sidebar";
import { CommunityCard } from "@/components/ui/content-cards";
import { Pagination } from "@/components/ui/data-display";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Reveal } from "@/components/ui/motion";
import { useCategories, useCommunities } from "@/hooks/use-communities";

/**
 * A2 — the community directory.
 *
 * Reads `category`, `q`, `page` and `sort` from the URL and forwards them to
 * `GET /communities`, so every filter is a shareable link. Filters the
 * backend cannot honour (price, rating) are shown disabled in the rail.
 */

const SORT_VALUES: CommunitySort[] = ["newest", "most_members", "alphabetical"];

function parseSort(value: string | null): CommunitySort {
  return SORT_VALUES.includes(value as CommunitySort) ? (value as CommunitySort) : "most_members";
}

function ExploreInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const query = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const sort = parseSort(searchParams.get("sort"));

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data, isLoading, isError, refetch } = useCommunities({
    category,
    search: query,
    sort,
    page,
    pageSize: 12,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const preserved: Record<string, string | undefined> = {
    q: query || undefined,
    sort: sort !== "most_members" ? sort : undefined,
  };

  return (
    <PublicShell active="explore">
      {/* ==================== PAGE HEADER ==================== */}
      <Reveal as="section" className="relative overflow-hidden pt-16 pb-8">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="h1" style={{ marginBottom: 12 }}>
            Explore communities
          </h1>
          <p className="text-lead" style={{ color: "var(--ink-3)", maxWidth: 620, marginBottom: 40 }}>
            {isLoading
              ? "Loading the live directory…"
              : `${total.toLocaleString()} live ${total === 1 ? "community" : "communities"} led by working professionals. Filter by what you want to learn.`}
          </p>

          <SearchField
            action="/communities"
            label="Search communities"
            defaultValue={query}
            placeholder="Search community titles and descriptions…"
            trailing={
              <>
                {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
                {sort !== "most_members" ? <input type="hidden" name="sort" value={sort} /> : null}
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ margin: 8, height: 40, borderRadius: "var(--r-sm)" }}
                >
                  Search
                </button>
              </>
            }
          />
        </div>
      </Reveal>

      {/* ==================== SIDEBAR + GRID ==================== */}
      <Reveal as="section" className="pt-4 pb-24">
        <div className="container">
          <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <FilterSidebar
              categories={categories}
              activeCategory={category}
              total={total}
              sort={sort}
              basePath="/communities"
              preserve={preserved}
              className="lg:sticky lg:top-20"
            />

            <div className="min-w-0">
              <div
                className="flex flex-wrap items-center justify-between"
                style={{ gap: 16, marginBottom: 24 }}
              >
                <p className="text-sm muted" aria-live="polite">
                  {isLoading
                    ? "Finding communities…"
                    : `Showing ${items.length} of ${total.toLocaleString()} ${total === 1 ? "community" : "communities"}`}
                </p>

                <div className="flex items-center gap-2">
                  <label htmlFor="top-sort" className="text-xs muted whitespace-nowrap">
                    Sort by
                  </label>
                  <select
                    id="top-sort"
                    className="select"
                    style={{ height: 36, width: "auto", minWidth: 140, fontSize: "var(--fs-13)" }}
                    value={sort}
                    onChange={(e) => {
                      const next = new URLSearchParams(searchParams.toString());
                      if (e.target.value === "most_members") {
                        next.delete("sort");
                      } else {
                        next.set("sort", e.target.value);
                      }
                      next.delete("page");
                      router.push(`/communities?${next.toString()}`);
                    }}
                  >
                    <option value="most_members">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="alphabetical">A–Z</option>
                  </select>
                </div>
              </div>

              {isError ? (
                <Alert variant="danger" icon="alertCircle" title="Communities could not be loaded">
                  <p style={{ marginBottom: 12 }}>
                    The community service didn&apos;t respond. Please try again.
                  </p>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => void refetch()}>
                    Retry community list
                  </button>
                </Alert>
              ) : isLoading ? (
                <div className="grid grid-3" style={{ gap: 24 }} aria-label="Loading communities">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="skeleton" style={{ height: 320 }} />
                  ))}
                </div>
              ) : items.length === 0 && total > 0 ? (
                <div className="card">
                  <p className="text-body" style={{ color: "var(--ink-2)" }}>
                    There are no communities on page {page}.
                  </p>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    baseHref="/communities"
                    query={{
                      category: category !== "all" ? category : undefined,
                      q: query || undefined,
                      sort: sort !== "most_members" ? sort : undefined,
                    }}
                    className="mt-6"
                  />
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  icon="search"
                  title="No communities match your filters"
                  description={
                    query
                      ? `Nothing in the directory matches “${query}”. Try a different phrase or clear the filters.`
                      : "There are no published communities in this category yet. Try another category or clear the filters."
                  }
                  action={{ label: "Reset all filters", href: "/communities" }}
                />
              ) : (
                <>
                  <div className="grid grid-3" style={{ gap: 24 }}>
                    {items.map((community) => (
                      <CommunityCard key={community.id} community={community} />
                    ))}
                  </div>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    baseHref="/communities"
                    query={{
                      category: category !== "all" ? category : undefined,
                      q: query || undefined,
                      sort: sort !== "most_members" ? sort : undefined,
                    }}
                    className="mt-16"
                  />
                </>
              )}

              <p className="text-xs muted" style={{ marginTop: 24 }}>
                Looking for something specific?{" "}
                <Link href="/search" style={{ color: "var(--accent)" }}>
                  Search the full directory
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </PublicShell>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="page" aria-busy="true" />}>
      <ExploreInner />
    </Suspense>
  );
}
