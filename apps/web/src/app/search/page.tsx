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
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { useCategories, useCommunities } from "@/hooks/use-communities";

/**
 * A8 — search results.
 *
 * `GET /communities?search=` is the only search endpoint that exists, so
 * the results are communities only. There is no creator search and no
 * lesson search yet, so those tabs are not shown.
 */

const SORT_VALUES: CommunitySort[] = ["newest", "most_members", "alphabetical"];

function parseSort(value: string | null): CommunitySort {
  return SORT_VALUES.includes(value as CommunitySort) ? (value as CommunitySort) : "most_members";
}

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") ?? "";
  const query = rawQuery.trim();
  const category = searchParams.get("category") ?? "all";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const sort = parseSort(searchParams.get("sort"));

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isError, refetch } = useCommunities({
    search: query,
    category,
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

  const resultQuery: Record<string, string | undefined> = {
    category: category !== "all" ? category : undefined,
    q: query || undefined,
    sort: sort !== "most_members" ? sort : undefined,
  };

  return (
    <PublicShell active="explore">
      {/* Header */}
      <Reveal as="section" className="relative overflow-hidden pt-12 pb-6">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SearchField
            action="/search"
            label="Search communities"
            defaultValue={query}
            placeholder="Search communities, mentors, skills…"
            trailing={
              <>
                {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
                {sort !== "most_members" ? <input type="hidden" name="sort" value={sort} /> : null}
                {query ? (
                  <Link
                    href="/search"
                    className="btn btn-ghost"
                    aria-label="Clear search"
                    style={{ marginRight: 8, height: 40, padding: "0 12px" }}
                  >
                    <Icon name="x" size={16} />
                  </Link>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ margin: 8, height: 40, borderRadius: "var(--r-sm)" }}
                >
                  Search
                </button>
              </>
            }
          />

          <p className="text-sm muted" style={{ marginTop: 16 }} aria-live="polite">
            {isLoading ? (
              "Searching…"
            ) : isError ? (
              "Result count unavailable"
            ) : query ? (
              <>
                <span className="tnum">{total.toLocaleString()}</span>{" "}
                {total === 1 ? "community" : "communities"} for{" "}
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Enter a phrase to search the community directory."
            )}
          </p>
        </div>
      </Reveal>

      {/* Sidebar + results */}
      <Reveal as="section" className="pt-4 pb-24">
        <div className="container">
          <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <FilterSidebar
              categories={categories}
              activeCategory={category}
              total={total}
              sort={sort}
              basePath="/search"
              preserve={preserved}
              className="lg:sticky lg:top-20"
            />

            <div className="min-w-0">
              {query ? (
                <div className="flex flex-wrap items-center justify-between" style={{ gap: 16, marginBottom: 32 }}>
                  <div className="tabs" style={{ marginBottom: 0 }}>
                    <div className="tab active">
                      Communities <span className="tab-count">{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="search-sort" className="text-xs muted whitespace-nowrap">
                      Sort by
                    </label>
                    <select
                      id="search-sort"
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
                        router.push(`/search?${next.toString()}`);
                      }}
                    >
                      <option value="most_members">Popular</option>
                      <option value="newest">Newest</option>
                      <option value="alphabetical">A–Z</option>
                    </select>
                  </div>
                </div>
              ) : null}

              {!query ? (
                <EmptyState
                  icon="search"
                  title="Start with a topic you care about"
                  description="Search community titles and descriptions above — or explore the full community directory."
                  action={{ label: "Explore communities", href: "/communities" }}
                />
              ) : isError ? (
                <Alert variant="danger" icon="alertCircle" title="Search could not be completed">
                  <p style={{ marginBottom: 12 }}>
                    The community service didn&apos;t respond. Please try again.
                  </p>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => void refetch()}>
                    Retry search
                  </button>
                </Alert>
              ) : isLoading ? (
                <div className="grid grid-3" style={{ gap: 24 }} aria-label="Loading results">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="skeleton" style={{ height: 320 }} />
                  ))}
                </div>
              ) : items.length === 0 && total > 0 ? (
                <div className="card">
                  <p className="text-body" style={{ color: "var(--ink-2)" }}>
                    There are no search results on page {page}.
                  </p>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    baseHref="/search"
                    query={resultQuery}
                    className="mt-6"
                  />
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  icon="search"
                  title={`Nothing matched “${query}”`}
                  description="Try another phrase, or browse the full directory to discover something new."
                  action={{ label: "Browse communities", href: "/communities" }}
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
                    baseHref="/search"
                    query={resultQuery}
                    className="mt-16"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </PublicShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page" aria-busy="true" />}>
      <SearchInner />
    </Suspense>
  );
}
