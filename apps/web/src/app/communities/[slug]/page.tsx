"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { CommunityAside } from "@/components/public/community-aside";
import {
  CommunityCurriculum,
  CommunityFeed,
  CommunityMembers,
  CommunityReviews,
} from "@/components/public/community-sections";
import { VerifiedMark } from "@/components/public/verified-mark";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Stars } from "@/components/ui/feedback";
import { Tabs } from "@/components/ui/interactive";
import { Icon } from "@/components/ui/icon";
import { CommunityCover } from "@/components/ui/community-cover";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { useMe } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-communities";
import { useMyEnrollments } from "@/hooks/use-enrollments";
import { useCreator } from "@/hooks/use-users";

/**
 * A3 — the community detail page. The trust page of the funnel.
 *
 * Renders exactly what `GET /communities/{slug}` returns. The curriculum,
 * reviews, members and feed tabs are enrolled-only on the backend, so each
 * one shows a gated state for visitors who can't open it yet.
 */

type TabId = "overview" | "curriculum" | "reviews" | "members" | "feed";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = use(params);
  const [tab, setTab] = useState<TabId>("overview");

  const { data: community, isLoading, isError, error, refetch } = useCommunity(slug);
  const { data: me } = useMe();
  const { data: enrollments = [] } = useMyEnrollments();

  const creatorUserId = community?.creator.userId ?? "";
  const { data: creator } = useCreator(creatorUserId);

  if (isLoading) {
    return (
      <PublicShell active="explore">
        <div className="container" style={{ paddingTop: 32, paddingBottom: 96 }}>
          <div className="skeleton" style={{ height: 40, width: 220, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 320, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 48, width: "60%", marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 20, width: "40%" }} />
        </div>
      </PublicShell>
    );
  }

  if (isError && error instanceof ApiError && error.status === 404) notFound();

  if (isError || !community) {
    return (
      <PublicShell active="explore">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 96 }}>
          <div className="alert alert-danger" role="alert">
            <Icon name="alertCircle" size={18} />
            <div className="min-w-0">
              <p className="font-semibold">Community details are unavailable</p>
              <p className="mt-1 text-15">
                {apiErrorMessage(error)} Please check your connection and try again.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-4"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </PublicShell>
    );
  }

  const enrollment =
    enrollments.find((item) => item.community.id === community.id && item.status === "active") ?? null;
  const isOwner = Boolean(me && me.id === community.creator.userId);
  const isEnrolled = enrollment !== null;
  const enrollHref = me ? `/enroll/${community.slug}` : `/auth/login?next=/enroll/${community.slug}`;
  const rating = community.rating ?? null;
  const reviewCount = community.reviewCount ?? 0;
  const primaryCategory = community.categories[0];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "reviews", label: "Reviews", count: reviewCount },
    { id: "members", label: "Members", count: community.memberCount },
    { id: "feed", label: "Feed" },
  ];

  return (
    <PublicShell active="explore">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 96 }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
          <Link href="/communities">Explore</Link>
          <span className="sep">/</span>
          {primaryCategory ? (
            <Link href={`/communities?category=${encodeURIComponent(primaryCategory.slug)}`}>
              {primaryCategory.name}
            </Link>
          ) : (
            <span className="sep">/</span>
          )}
          {primaryCategory ? <span className="sep">/</span> : null}
          <span className="current">{community.title}</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* ---------------- LEFT ---------------- */}
          <div className="min-w-0">
            <div
              className="overflow-hidden"
              style={{ height: 320, borderRadius: "var(--r-lg)", marginBottom: 32 }}
            >
              <CommunityCover
                src={community.imageUrl}
                title={community.title}
                category={primaryCategory?.name}
              />
            </div>

            <div className="flex flex-wrap items-center" style={{ gap: 10, marginBottom: 12 }}>
              {community.categories.map((category) => (
                <span key={category.id} className="tag">
                  {category.name}
                </span>
              ))}
              <Badge variant={community.isPublished ? "success" : "neutral"}>
                {community.isPublished ? "Active" : "Unpublished"}
              </Badge>
            </div>

            <h1 className="h1" style={{ marginBottom: 24, fontSize: 36 }}>
              {community.title}
            </h1>

            {/* Creator row */}
            <div className="flex flex-wrap items-center" style={{ gap: 14, marginBottom: 40 }}>
              <Link
                href={`/creators/${community.creator.userId}`}
                className="flex items-center"
                style={{ gap: 14 }}
              >
                <Avatar
                  name={community.creator.displayName}
                  src={community.creator.avatarUrl}
                  size="lg"
                />
                <span>
                  <span
                    className="flex items-center"
                    style={{ gap: 6, fontSize: "var(--fs-17)", fontWeight: 600, color: "var(--ink)" }}
                  >
                    {community.creator.displayName}
                    {community.creator.isVerified ? <VerifiedMark size={14} /> : null}
                  </span>
                  <span className="text-sm muted" style={{ display: "block" }}>
                    {creator
                      ? `${creator.communityCount} ${
                          creator.communityCount === 1 ? "community" : "communities"
                        }`
                      : "Community creator"}
                  </span>
                </span>
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: 32 }}>
              <Tabs tabs={tabs} value={tab} onChange={(value) => setTab(value as TabId)} />
            </div>

            {tab === "overview" ? (
              <section aria-label="Community overview">
                <div className="flex flex-col gap-4">
                  {community.description.split(/\n{2,}/).map((paragraph, index) => (
                    <p key={index} className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div
                  className="flex flex-wrap items-center"
                  style={{ gap: 20, marginTop: 32, fontSize: "var(--fs-14)", color: "var(--ink-3)" }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon name="users" size={16} />
                    <span className="tnum" style={{ color: "var(--ink-2)" }}>
                      {community.memberCount.toLocaleString()} members
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="star" size={16} />
                    {reviewCount > 0 && rating !== null ? (
                      <Stars rating={rating} count={reviewCount} />
                    ) : (
                      <span>No ratings yet</span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="bookOpen" size={16} />
                    <span className="tnum" style={{ color: "var(--ink-2)" }}>
                      {community.courses.length} {community.courses.length === 1 ? "course" : "courses"}
                    </span>
                  </span>
                </div>
              </section>
            ) : null}

            {tab === "curriculum" ? (
              <section aria-label="Curriculum">
                <CommunityCurriculum
                  slug={community.slug}
                  summaryCourses={community.courses}
                  isEnrolled={isEnrolled}
                  enrollHref={enrollHref}
                />
              </section>
            ) : null}

            {tab === "reviews" ? (
              <section aria-label="Reviews">
                <CommunityReviews
                  slug={community.slug}
                  rating={rating}
                  reviewCount={reviewCount}
                  isEnrolled={isEnrolled}
                  enrollHref={enrollHref}
                />
              </section>
            ) : null}

            {tab === "members" ? (
              <section aria-label="Members">
                <CommunityMembers
                  slug={community.slug}
                  memberCount={community.memberCount}
                  canReadMembers={isOwner}
                  enrollHref={enrollHref}
                />
              </section>
            ) : null}

            {tab === "feed" ? (
              <section aria-label="Community feed">
                <CommunityFeed slug={community.slug} isEnrolled={isEnrolled} enrollHref={enrollHref} />
              </section>
            ) : null}
          </div>

          {/* ---------------- RIGHT ---------------- */}
          <aside className="lg:sticky lg:top-20">
            <CommunityAside
              community={community}
              enrollment={enrollment}
              isOwner={isOwner}
              creator={creator}
              enrollHref={enrollHref}
            />
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
