"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Alert, EmptyState, Progress } from "@/components/ui/feedback";
import { Stat } from "@/components/ui/data-display";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tabs } from "@/components/ui/interactive";
import { useEnrollmentList, useMyLearning } from "@/hooks/use-learner-data";
import { useMe } from "@/hooks/use-auth";
import { ApiError, get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import { formatDurationSince, formatMonthYear } from "@/lib/dates";
import type { ProfileResponse } from "@/types/api";

/**
 * B7 — the learner's profile.
 *
 * `GET /users/me` for the account, `GET /auth/me` for the email,
 * `GET /users/me/learning` for progress and `GET /enrollments/mine` for the
 * membership count. Everything the design shows that has no source — streak,
 * weekly minutes, achievements, interests, billing, phone/email verification
 * — is omitted rather than faked.
 */

type ProfileTab = "profile" | "learning" | "account";

export default function LearnerProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("profile");

  const profileQuery = useQuery({
    queryKey: qk.users.me(),
    queryFn: () => get<ProfileResponse>("/users/me"),
    retry: false,
  });
  const { data: account } = useMe();
  const learning = useMyLearning();
  const enrollments = useEnrollmentList();

  const profile = profileQuery.data ?? null;
  const items = learning.data?.items ?? [];
  const joinedCount = enrollments.data
    ? enrollments.data.filter((enrollment) => enrollment.status !== "cancelled").length
    : items.length;

  const allCourses = items.flatMap((item) => item.courses);
  const totalCompleted = allCourses.reduce((sum, course) => sum + course.completedLessons, 0);
  const totalLessons = allCourses.reduce((sum, course) => sum + course.totalLessons, 0);
  const coursesCompleted = allCourses.filter(
    (course) => course.totalLessons > 0 && course.percentComplete >= 100,
  ).length;

  const signedOut =
    profileQuery.isError && profileQuery.error instanceof ApiError && profileQuery.error.status === 401;

  if (signedOut) {
    return (
      <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <EmptyState
          icon="user"
          title="You&apos;re signed out"
          description="Sign in to see your profile and learning progress."
          action={{ label: "Sign in", href: "/auth/login?next=/profile" }}
        />
      </div>
    );
  }

  if (profileQuery.isLoading || learning.isLoading) {
    return (
      <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }} aria-label="Loading profile">
        <div className="skeleton" style={{ height: 160, marginBottom: 40 }} />
        <div className="skeleton" style={{ height: 320 }} />
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <Alert variant="danger" icon="alertCircle" title="Your profile could not be loaded">
          <p style={{ marginBottom: 12 }}>{apiErrorMessage(profileQuery.error)}</p>
          <Button variant="secondary" size="sm" onClick={() => void profileQuery.refetch()}>
            Try again
          </Button>
        </Alert>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "learning", label: "Learning", count: items.length },
    { id: "account", label: "Account" },
  ];

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div
        className="grid items-start"
        style={{ gridTemplateColumns: "minmax(0, 1.4fr) 320px", gap: 48 }}
      >
        {/* ====== MAIN ====== */}
        <div style={{ minWidth: 0 }}>
          {/* ============== HEADER CARD ============== */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40, flexWrap: "wrap" }}>
            <Avatar name={profile.displayName} src={profile.avatarUrl} size="xl" />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 className="h2" style={{ margin: "0 0 6px" }}>
                {profile.displayName}
              </h1>
              <p className="text-sm muted" style={{ margin: "0 0 16px" }}>
                {profile.roles.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(" · ")}
              </p>
              <Link href="/settings/profile" className="btn btn-secondary btn-sm">
                <Icon name="edit" size={14} />
                Edit profile
              </Link>
            </div>
          </div>

          {/* ============== TABS ============== */}
          <div style={{ marginBottom: 40 }}>
            <Tabs tabs={tabs} value={tab} onChange={(id) => setTab(id as ProfileTab)} animated />
          </div>

          {tab === "profile" ? (
            <>
              <section style={{ marginBottom: 40 }}>
                <h2 className="h4" style={{ marginBottom: 16 }}>
                  About
                </h2>
                {profile.bio ? (
                  <div className="flex flex-col" style={{ gap: 16, maxWidth: 640 }}>
                    {profile.bio.split(/\n{2,}/).map((paragraph, index) => (
                      <p key={index} className="text-body" style={{ color: "var(--ink-2)" }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-body" style={{ color: "var(--ink-3)" }}>
                    You haven&apos;t added a bio yet.{" "}
                    <Link href="/settings/profile" style={{ color: "var(--accent)" }}>
                      Add one
                    </Link>
                    .
                  </p>
                )}
              </section>

              <section style={{ marginBottom: 40 }}>
                <h2 className="h5" style={{ marginBottom: 16 }}>
                  Learning stats
                </h2>
                <div className="grid grid-2" style={{ gap: 16 }}>
                  <Stat
                    className="card card-sm"
                    label="Lessons completed"
                    value={totalCompleted}
                    meta={`Across ${allCourses.length} ${allCourses.length === 1 ? "course" : "courses"}`}
                  />
                  <Stat
                    className="card card-sm"
                    label="Lessons remaining"
                    value={Math.max(0, totalLessons - totalCompleted)}
                    meta="Left to finish"
                  />
                  <Stat
                    className="card card-sm"
                    label="Communities joined"
                    value={joinedCount}
                    meta={`${items.length} in your learning list`}
                  />
                  <Stat
                    className="card card-sm"
                    label="Courses completed"
                    value={coursesCompleted}
                    meta="Finished every lesson"
                  />
                </div>
              </section>
            </>
          ) : null}

          {tab === "learning" ? (
            <section>
              <h2 className="h4" style={{ marginBottom: 16 }}>
                Enrolled communities
              </h2>
              {learning.isError ? (
                <Alert variant="danger" icon="alertCircle" title="Your learning list could not be loaded">
                  <p style={{ marginBottom: 12 }}>{apiErrorMessage(learning.error)}</p>
                  <Button variant="secondary" size="sm" onClick={() => void learning.refetch()}>
                    Try again
                  </Button>
                </Alert>
              ) : items.length === 0 ? (
                <EmptyState
                  icon="bookOpen"
                  title="You haven&apos;t joined anything yet"
                  description="Communities you join show up here with your progress through every lesson."
                  action={{ label: "Browse communities", href: "/communities" }}
                />
              ) : (
                <div className="flex flex-col" style={{ gap: 12 }}>
                  {items.map((item) => {
                    const completed = item.courses.reduce((sum, course) => sum + course.completedLessons, 0);
                    const total = item.courses.reduce((sum, course) => sum + course.totalLessons, 0);
                    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                    return (
                      <Link
                        key={item.community.id}
                        href={`/communities/${encodeURIComponent(item.community.slug)}/classroom`}
                        className="card card-hover"
                        style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, textDecoration: "none", color: "var(--ink)" }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 10,
                            overflow: "hidden",
                            flexShrink: 0,
                            background: "var(--paper-2)",
                          }}
                        >
                          {item.community.imageUrl ? (
                            <img
                              src={item.community.imageUrl}
                              alt=""
                              loading="lazy"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : null}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="text-sm" style={{ fontWeight: 600, marginBottom: 4 }}>
                            {item.community.title}
                          </p>
                          <Progress value={percent} size="sm" className="mb-1" />
                          <p className="text-xs muted tnum" style={{ margin: 0 }}>
                            {completed} of {total} lessons · {percent}%
                          </p>
                        </div>
                        <Icon name="chevronRight" size={18} className="text-ink-3" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {tab === "account" ? (
            <section className="flex flex-col" style={{ gap: 24 }}>
              <div className="card">
                <h2 className="h5" style={{ marginBottom: 16 }}>
                  Email &amp; password
                </h2>
                <div className="flex flex-col" style={{ gap: 16 }}>
                  <div>
                    <p className="field-label">Email</p>
                    <p className="text-body" style={{ color: "var(--ink-2)" }}>
                      {account?.email ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="field-label">Password</p>
                    <p className="text-body" style={{ color: "var(--ink-2)" }}>
                      Managed by the reset flow.
                    </p>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: 12 }}>
                    <Link href="/settings/account" className="btn btn-secondary btn-sm">
                      Manage email &amp; password
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        {/* ====== RIGHT RAIL ====== */}
        <aside
          className="flex flex-col"
          style={{ gap: 24, minWidth: 0, position: "sticky", top: 80 }}
        >
          <div className="card card-sm">
            <h2 className="h6" style={{ marginBottom: 16 }}>
              Account settings
            </h2>
            <div className="flex flex-col">
              <Link
                href="/settings/profile"
                className="flex items-center justify-between"
                style={{ gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)", color: "var(--ink)", textDecoration: "none" }}
              >
                <span className="text-sm">Edit profile</span>
                <Icon name="chevronRight" size={15} className="text-ink-3" />
              </Link>
              <Link
                href="/settings/account"
                className="flex items-center justify-between"
                style={{ gap: 10, padding: "10px 0", color: "var(--ink)", textDecoration: "none" }}
              >
                <span className="text-sm">Email &amp; password</span>
                <Icon name="chevronRight" size={15} className="text-ink-3" />
              </Link>
            </div>
          </div>

          <div className="card card-sm">
            <h2 className="h6" style={{ marginBottom: 8 }}>
              Member since
            </h2>
            <p className="text-sm" style={{ fontWeight: 500, marginBottom: 2 }}>
              {formatMonthYear(profile.createdAt)}
            </p>
            <p className="text-xs muted tnum" style={{ margin: 0 }}>
              {formatDurationSince(profile.createdAt)} on Interlekt
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
