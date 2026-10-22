"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Tabs } from "@/components/ui/interactive";
import { LearnerCommunityCard } from "@/components/learner/learner-community-card";
import { useEnrollmentList, useMyLearning } from "@/hooks/use-learner-data";
import { get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import type {
  CommunityDetail,
  CommunityRef,
  EnrollmentResponse,
  EnrollmentStatus,
  LearningCourseItem,
} from "@/types/api";

/**
 * B2 — the learner's communities.
 *
 * The list is the merge of `GET /users/me/learning` (courses + progress) and
 * `GET /enrollments/mine` (enrollment state). The backend only knows
 * `pending | active | cancelled`, so there is no "Completed" or "Archived"
 * tab — those states have no source and are not invented here.
 */

type SortKey = "recent" | "progress" | "alphabetical";
type ViewKey = "grid" | "list";
type TabKey = "all" | "active" | "pending" | "cancelled";

interface CommunityRow {
  community: CommunityRef;
  courses: LearningCourseItem[];
  status: EnrollmentStatus | null;
  enrolledAt: string | null;
  completed: number;
  total: number;
  percent: number;
}

function buildRows(
  learning: { community: CommunityRef; courses: LearningCourseItem[] }[],
  enrollments: EnrollmentResponse[],
): CommunityRow[] {
  const byId = new Map<string, CommunityRow>();

  for (const item of learning) {
    const completed = item.courses.reduce((sum, course) => sum + course.completedLessons, 0);
    const total = item.courses.reduce((sum, course) => sum + course.totalLessons, 0);
    byId.set(item.community.id, {
      community: item.community,
      courses: item.courses,
      status: null,
      enrolledAt: null,
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  for (const enrollment of enrollments) {
    const existing = byId.get(enrollment.community.id);
    if (existing) {
      existing.status = enrollment.status;
      existing.enrolledAt = enrollment.createdAt;
      continue;
    }
    byId.set(enrollment.community.id, {
      community: enrollment.community,
      courses: [],
      status: enrollment.status,
      enrolledAt: enrollment.createdAt,
      completed: 0,
      total: 0,
      percent: 0,
    });
  }

  return [...byId.values()];
}

const STATUS_BADGE: Record<EnrollmentStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "badge badge-success" },
  pending: { label: "Pending", className: "badge badge-warning" },
  cancelled: { label: "Cancelled", className: "badge badge-neutral" },
};

export default function MyCommunitiesPage() {
  const learning = useMyLearning();
  const enrollments = useEnrollmentList();
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewKey>("grid");
  const [tab, setTab] = useState<TabKey>("all");

  const rows = useMemo(
    () => buildRows(learning.data?.items ?? [], enrollments.data ?? []),
    [learning.data?.items, enrollments.data],
  );

  const details = useQueries({
    queries: rows.map((row) => ({
      queryKey: qk.communities.detail(row.community.slug),
      queryFn: () => get<CommunityDetail>(`/communities/${encodeURIComponent(row.community.slug)}`),
    })),
  });

  const counts = {
    all: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    pending: rows.filter((row) => row.status === "pending").length,
    cancelled: rows.filter((row) => row.status === "cancelled").length,
  };

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "pending", label: "Pending", count: counts.pending },
    ...(counts.cancelled > 0
      ? [{ id: "cancelled", label: "Cancelled", count: counts.cancelled }]
      : []),
  ];

  const visible = rows
    .filter((row) => {
      if (tab === "all") return true;
      return row.status === tab;
    })
    .sort((a, b) => {
      if (sort === "progress") return b.percent - a.percent;
      if (sort === "alphabetical") return a.community.title.localeCompare(b.community.title);
      const aDate = a.enrolledAt ? Date.parse(a.enrolledAt) : 0;
      const bDate = b.enrolledAt ? Date.parse(b.enrolledAt) : 0;
      return bDate - aDate;
    });

  const isLoading = learning.isLoading || enrollments.isLoading;
  const failed = learning.isError || enrollments.isError;

  const detailById = new Map(
    rows.map((row, index) => [row.community.id, details[index]?.data] as const),
  );

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      {/* ============== PAGE HEADER ============== */}
      <div
        className="flex flex-wrap items-end justify-between"
        style={{ gap: 24, marginBottom: 32 }}
      >
        <div>
          <h1 className="h1" style={{ marginBottom: 8 }}>
            My communities
          </h1>
          <p className="text-sm muted tnum" style={{ margin: 0 }}>
            {isLoading
              ? "Loading your communities…"
              : `${counts.active} active · ${counts.pending} pending · ${counts.all} joined`}
          </p>
        </div>

        <div className="flex items-center" style={{ gap: 24 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="text-xs muted">Sort by</span>
            <select
              className="select"
              aria-label="Sort communities"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              style={{ height: 36, fontSize: 14 }}
            >
              <option value="recent">Recent</option>
              <option value="progress">Progress</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="text-xs muted">View</span>
            <button
              type="button"
              className="text-sm"
              onClick={() => setView("grid")}
              style={{
                color: view === "grid" ? "var(--ink)" : "var(--ink-3)",
                fontWeight: view === "grid" ? 500 : 400,
              }}
            >
              Grid
            </button>
            <span style={{ color: "var(--ink-4)" }}>·</span>
            <button
              type="button"
              className="text-sm"
              onClick={() => setView("list")}
              style={{
                color: view === "list" ? "var(--ink)" : "var(--ink-3)",
                fontWeight: view === "list" ? 500 : 400,
              }}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* ============== TABS ============== */}
      <div style={{ marginBottom: 32 }}>
        <Tabs tabs={tabs} value={tab} onChange={(id) => setTab(id as TabKey)} animated />
      </div>

      {failed ? (
        <Alert variant="danger" icon="alertCircle" title="Your communities could not be loaded">
          <p style={{ marginBottom: 12 }}>
            {apiErrorMessage(learning.error ?? enrollments.error)}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              void learning.refetch();
              void enrollments.refetch();
            }}
          >
            Try again
          </Button>
        </Alert>
      ) : null}

      {/* ============== COMMUNITY GRID ============== */}
      {isLoading ? (
        <div className="grid grid-auto-lg" style={{ gap: 24 }} aria-label="Loading communities">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton" style={{ height: 320 }} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon="users"
          title="No communities yet"
          description="Browse communities led by working Nigerian engineers, designers, founders, and creatives. Pay in naira, learn at your pace."
          action={{ label: "Browse communities", href: "/communities" }}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="bookOpen"
          title="Nothing in this tab"
          description="Switch to another tab to see the rest of your communities."
          action={{ label: "Show all", onClick: () => setTab("all") }}
        />
      ) : (
        <div
          className="grid"
          style={{
            gap: 24,
            gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
          }}
        >
          {visible.map((row) => (
            <LearnerCommunityCard
              key={row.community.id}
              community={row.community}
              detail={detailById.get(row.community.id)}
              completedLessons={row.completed}
              totalLessons={row.total}
              percentComplete={row.percent}
              actionLabel={row.percent < 100 ? "Continue" : undefined}
              badge={
                row.status && row.status !== "active" ? (
                  <span className={STATUS_BADGE[row.status].className}>
                    {STATUS_BADGE[row.status].label}
                  </span>
                ) : null
              }
            />
          ))}
        </div>
      )}

      {rows.length > 0 ? (
        <p className="text-xs muted" style={{ marginTop: 24 }}>
          Looking for something new?{" "}
          <Link href="/communities" style={{ color: "var(--accent)" }}>
            Explore communities
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
