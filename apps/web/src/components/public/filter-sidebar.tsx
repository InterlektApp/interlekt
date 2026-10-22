"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

/**
 * The hairline filter rail shared by the explore directory (A2) and the
 * search results page (A8).
 *
 * Only filters the backend can actually honour are live:
 *   • category  → `GET /communities?category=<slug>`   ✅
 *   • sort      → `newest | most_members | alphabetical` ✅
 *
 * Price and rating filters are rendered DISABLED, because the list endpoint
 * has no `isFree` or `minRating` parameter. Offering them as working
 * controls would silently filter a single page and lie about the result
 * count, so they are shown greyed out with an explanation instead.
 */

export type CommunitySort = "newest" | "most_members" | "alphabetical";

const SORT_LABELS: Record<CommunitySort, string> = {
  most_members: "Popular",
  newest: "Newest",
  alphabetical: "A–Z",
};

export interface FilterSidebarProps {
  categories: Category[];
  activeCategory: string;
  /** Total published communities — the only count the API exposes. */
  total: number;
  sort: CommunitySort;
  /** Path the filters navigate within, e.g. "/communities" or "/search". */
  basePath: string;
  /** Query params preserved when a filter changes. */
  preserve?: Record<string, string | undefined>;
  className?: string;
  showSort?: boolean;
}

export function FilterSidebar({
  categories,
  activeCategory,
  total,
  sort,
  basePath,
  preserve = {},
  className,
  showSort = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefWith = React.useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      Object.entries(preserve).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      Object.entries(next).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      // Any page beyond the first resets when the filter set changes.
      params.delete("page");
      const qs = params.toString();
      return qs ? `${basePath}?${qs}` : basePath;
    },
    [basePath, preserve],
  );

  const onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as CommunitySort;
    const params = new URLSearchParams(searchParams.toString());
    if (next === "most_members") params.delete("sort");
    else params.set("sort", next);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <aside className={cn("flex flex-col gap-6", className)} aria-label="Filters">
      {/* Category */}
      <div style={{ paddingBottom: "24px", borderBottom: "1px solid var(--line)" }}>
        <p className="h6" style={{ marginBottom: "14px", color: "var(--ink)" }}>
          Category
        </p>
        <ul className="flex flex-col" style={{ gap: "2px" }}>
          <li>
            <Link
              href={hrefWith({ category: undefined })}
              className="flex items-center justify-between gap-3 py-1.5 text-15"
              style={{
                color: activeCategory === "all" ? "var(--ink)" : "var(--ink-2)",
                fontWeight: activeCategory === "all" ? 500 : 400,
              }}
              aria-current={activeCategory === "all" ? "page" : undefined}
            >
              <span>All categories</span>
              <span className="text-xs muted tnum">{total.toLocaleString()}</span>
            </Link>
          </li>
          {categories.map((category) => {
            const active = activeCategory === category.slug;
            return (
              <li key={category.id}>
                <Link
                  href={hrefWith({ category: category.slug })}
                  className="flex items-center justify-between gap-3 py-1.5 text-15"
                  style={{
                    color: active ? "var(--ink)" : "var(--ink-2)",
                    fontWeight: active ? 500 : 400,
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{category.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sort — only shown when explicitly requested */}
      {showSort ? (
        <div>
          <label className="h6" htmlFor="filter-sort" style={{ marginBottom: "14px", color: "var(--ink)", display: "block" }}>
            Sort by
          </label>
          <select
            id="filter-sort"
            className="select"
            style={{ height: "40px" }}
            value={sort}
            onChange={onSortChange}
          >
            {(Object.keys(SORT_LABELS) as CommunitySort[]).map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
            <option value="rating" disabled>
              Top rated — coming soon
            </option>
            <option value="price_asc" disabled>
              Price: low to high — coming soon
            </option>
            <option value="price_desc" disabled>
              Price: high to low — coming soon
            </option>
          </select>
        </div>
      ) : null}
    </aside>
  );
}
