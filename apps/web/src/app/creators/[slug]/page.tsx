"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { VerifiedMark } from "@/components/public/verified-mark";
import { CommunityCard } from "@/components/ui/content-cards";
import { Avatar } from "@/components/ui/avatar";
import { Badge, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { AmbientIcons } from "@/components/shell/ambient-icons";
import { get, ApiError } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { formatMonthYear } from "@/lib/dates";
import { useCommunities } from "@/hooks/use-communities";
import { useCreator } from "@/hooks/use-users";
import type { CommunityListItem, Paginated } from "@/types/api";

/**
 * A4 — the creator profile.
 *
 * `GET /creators/{user_id}` is keyed by UUID. The route segment is a slug,
 * so a UUID is used straight away and a display-name slug is resolved
 * against the published communities first.
 *
 * Follow, messaging, work history and earnings have no endpoint yet, so
 * those blocks are omitted rather than faked.
 */

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CreatorPageProps {
  params: Promise<{ slug: string }>;
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const { slug: param } = use(params);
  const isUuid = UUID_PATTERN.test(param);

  // A display-name slug is resolved through the published communities,
  // because the creator endpoint only accepts a user id.
  const { data: resolvedId, isLoading: resolving, isError: lookupFailed } = useQuery({
    queryKey: ["creators", "resolve", param],
    queryFn: async () => {
      const data = await get<Paginated<CommunityListItem>>("/communities?page=1&pageSize=100");
      const match = data.items.find(
        (community) => slugify(community.creator.displayName) === param.toLowerCase(),
      );
      return match?.creator.userId ?? null;
    },
    enabled: !isUuid && Boolean(param),
  });

  const userId = isUuid ? param : (resolvedId ?? "");
  const { data: creator, isLoading, isError, error, refetch } = useCreator(userId);

  const { data: list, isLoading: communitiesLoading, isError: communitiesError } = useCommunities({
    pageSize: 100,
  });

  const communities = (list?.items ?? []).filter(
    (community) => community.creator.userId === creator?.userId,
  );
  const listedMembers = communities.reduce((sum, community) => sum + community.memberCount, 0);

  // The slug lookup has to finish before the creator fetch can start.
  const lookupDone = isUuid || resolvedId !== undefined || lookupFailed;
  const loading = lookupDone ? isLoading : true;

  if (loading) {
    return (
      <PublicShell active="explore">
        <div className="skeleton" style={{ height: 200 }} />
        <div className="container" style={{ paddingTop: 0, paddingBottom: 96 }}>
          <div className="skeleton" style={{ height: 120, width: 240, marginTop: -40, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 40, width: "35%", marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 20, width: "50%" }} />
        </div>
      </PublicShell>
    );
  }

  if (isError && error instanceof ApiError && error.status === 404) notFound();

  if (isError) {
    return (
      <PublicShell active="explore">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 96 }}>
          <div className="alert alert-danger" role="alert">
            <Icon name="alertCircle" size={18} />
            <div className="min-w-0">
              <p className="font-semibold">Creator profile is unavailable</p>
              <p className="mt-1 text-15">{apiErrorMessage(error)}</p>
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

  if (!creator) {
    return (
      <PublicShell active="explore">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 96 }}>
          <EmptyState
            icon="user"
            title="Creator not found"
            description="We couldn't find a creator with that name. Browse the directory to find published communities."
            action={{ label: "Browse communities", href: "/communities" }}
          />
        </div>
      </PublicShell>
    );
  }

  const firstName = creator.displayName.split(" ")[0];
  const bioParagraphs = (creator.bio ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PublicShell active="explore">
      {/* Cover banner */}
      <div style={{ height: 200, background: "var(--ink)", position: "relative", overflow: "hidden" }}>
        <AmbientIcons layout="minimal" />
      </div>

      <div className="container" style={{ paddingTop: 0, paddingBottom: 96 }}>
        {/* Avatar overlapping the band */}
        <div style={{ marginTop: -56, position: "relative", zIndex: 1 }}>
          <span
            className="avatar avatar-xl"
            style={{
              background: "var(--paper)",
              padding: 4,
              borderRadius: "50%",
              display: "inline-flex",
              boxShadow: "0 0 0 4px var(--paper)",
            }}
          >
            <Avatar name={creator.displayName} src={creator.avatarUrl} size="xl" />
          </span>
        </div>

        <div
          className="flex flex-wrap items-end justify-between"
          style={{ gap: 24, marginTop: 20 }}
        >
          <div>
            <h1 className="h2 flex flex-wrap items-center" style={{ gap: 8, margin: 0 }}>
              {creator.displayName}
              {creator.isVerified ? <VerifiedMark size={20} /> : null}
            </h1>
            {creator.headline ? (
              <p className="text-body muted" style={{ color: "var(--ink-3)", marginTop: 8 }}>
                {creator.headline}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center" style={{ gap: 16, marginTop: 10 }}>
              <Badge variant={creator.isVerified ? "success" : "neutral"}>
                {creator.isVerified ? "Verified creator" : "Verification pending"}
              </Badge>
              <span className="text-14 muted">On Interlekt since {formatMonthYear(creator.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats — only values the API actually returns */}
        <div
          className="grid mt-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
        >
          <div className="card">
            <div className="stat-label">Communities</div>
            <div className="stat-value" style={{ fontSize: 28, marginTop: 4 }}>
              {creator.communityCount.toLocaleString()}
            </div>
            <div className="stat-meta">Published on Interlekt</div>
          </div>
          {communities.length > 0 ? (
            <div className="card">
              <div className="stat-label">Members</div>
              <div className="stat-value" style={{ fontSize: 28, marginTop: 4 }}>
                {listedMembers.toLocaleString()}
              </div>
              <div className="stat-meta">
                Across the {communities.length} {communities.length === 1 ? "community" : "communities"} listed
                here
              </div>
            </div>
          ) : null}
        </div>

        <div
          className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
          style={{ marginTop: 48 }}
        >
          {/* Left — about + expertise */}
          <div className="min-w-0">
            {bioParagraphs.length > 0 ? (
              <section aria-labelledby="creator-about">
                <h2 className="h3" id="creator-about" style={{ marginBottom: 20 }}>
                  About
                </h2>
                <div className="flex flex-col gap-4" style={{ marginBottom: 48 }}>
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            {creator.expertise.length > 0 ? (
              <section aria-labelledby="creator-expertise">
                <h3 className="h4" id="creator-expertise" style={{ marginBottom: 16 }}>
                  Expertise
                </h3>
                <div className="flex flex-wrap" style={{ gap: 10 }}>
                  {creator.expertise.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Right — communities */}
          <aside className="lg:sticky lg:top-20">
            <h3 className="h4" style={{ marginBottom: 20 }}>
              Communities by {firstName}
            </h3>

            {communitiesError ? (
              <div className="alert alert-danger" role="alert">
                <Icon name="alertCircle" size={18} />
                <div className="min-w-0">
                  <p>Published communities could not be loaded.</p>
                </div>
              </div>
            ) : communitiesLoading ? (
              <div className="flex flex-col" style={{ gap: 16 }} aria-label="Loading communities">
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className="skeleton" style={{ height: 280 }} />
                ))}
              </div>
            ) : communities.length === 0 ? (
              <EmptyState
                icon="bookOpen"
                title="No published communities yet"
                description={
                  creator.communityCount > 0
                    ? "This creator has published communities, but they aren't in the directory page that loaded. Browse the full directory to find them."
                    : "Check back later to see what this creator is sharing."
                }
                action={{ label: "Browse all communities", href: "/communities" }}
              />
            ) : (
              <div className="flex flex-col" style={{ gap: 16 }}>
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
