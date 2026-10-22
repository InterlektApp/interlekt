"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Tabs } from "@/components/ui/interactive";
import { Icon } from "@/components/ui/icon";
import { FeedComposer } from "@/components/learner/feed-composer";
import { FeedPost } from "@/components/learner/feed-post";
import { useCommunityPosts } from "@/hooks/use-learner-data";
import { useCommunity } from "@/hooks/use-communities";
import { useMe } from "@/hooks/use-auth";
import { post } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import type { PostResponse } from "@/types/api";

/**
 * B5 — the community feed.
 *
 * `GET /communities/{slug}/posts` is 403 for learners who have not joined, so
 * the page shows a "join to participate" state instead of an empty feed.
 * The API supports posts, announcements, pinning and comments — there is no
 * like entity, Q&A flag, rules list, contributor ranking or online count, so
 * those blocks from the design are omitted.
 */

interface FeedPageProps {
  params: Promise<{ slug: string }>;
}

type FeedTab = "feed" | "announcements";

export default function CommunityFeedPage({ params }: FeedPageProps) {
  const { slug } = use(params);
  const queryClient = useQueryClient();
  const { data: community } = useCommunity(slug);
  const { data: me } = useMe();
  const feed = useCommunityPosts(slug);
  const [tab, setTab] = useState<FeedTab>("feed");
  const [draft, setDraft] = useState("");

  const createPost = useMutation({
    mutationFn: (content: string) =>
      post<PostResponse>(`/communities/${encodeURIComponent(slug)}/posts`, { content }),
    onSuccess: async () => {
      setDraft("");
      await queryClient.invalidateQueries({ queryKey: qk.communities.posts(slug) });
    },
  });

  const posts = feed.data?.posts ?? [];
  const announcements = posts.filter((item) => item.isAnnouncement);
  const visible = tab === "announcements" ? announcements : posts;

  const tabs = [
    { id: "feed", label: "Feed", count: posts.length },
    { id: "announcements", label: "Announcements", count: announcements.length },
  ];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 96 }}>
      {/* ============== BREADCRUMB ============== */}
      <nav className="breadcrumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
        <Link href="/my-communities">My communities</Link>
        <span className="sep">/</span>
        <Link href={`/communities/${encodeURIComponent(slug)}`}>{community?.title ?? slug}</Link>
        <span className="sep">/</span>
        <span className="current">Feed</span>
      </nav>

      {/* ============== PAGE HEADER ============== */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="h2" style={{ marginBottom: 6 }}>
          Community feed
        </h1>
        <p className="text-sm muted" style={{ margin: 0 }}>
          Posts, questions and announcements from {community?.title ?? slug}
          {community ? ` · ${community.memberCount.toLocaleString()} members` : ""}
        </p>
      </div>

      <div
        className="grid items-start"
        style={{ gridTemplateColumns: "minmax(0, 1.6fr) 320px", gap: 48 }}
      >
        {/* ====== MAIN ====== */}
        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <Tabs tabs={tabs} value={tab} onChange={(id) => setTab(id as FeedTab)} animated />
          </div>

          {feed.isLoading ? (
            <div className="flex flex-col" style={{ gap: 16 }} aria-label="Loading the feed">
              {[0, 1, 2].map((index) => (
                <div key={index} className="skeleton" style={{ height: 160 }} />
              ))}
            </div>
          ) : feed.data?.gated ? (
            <EmptyState
              icon="message"
              title="Join this community to see the feed"
              description="Posts, questions and announcements from the creator and other members are only visible to members."
              action={{ label: "Join the community", href: `/enroll/${encodeURIComponent(slug)}` }}
            />
          ) : feed.isError ? (
            <Alert variant="danger" icon="alertCircle" title="The feed could not be loaded">
              <p style={{ marginBottom: 12 }}>{apiErrorMessage(feed.error)}</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => void feed.refetch()}>
                Try again
              </button>
            </Alert>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <FeedComposer
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => {
                    const content = draft.trim();
                    if (content) createPost.mutate(content);
                  }}
                  author={me ? { name: me.displayName, avatarUrl: me.avatarUrl } : undefined}
                  error={createPost.isError ? apiErrorMessage(createPost.error) : null}
                />
              </div>

              {visible.length === 0 ? (
                <EmptyState
                  icon="message"
                  title={tab === "announcements" ? "No announcements yet" : "No posts yet"}
                  description={
                    tab === "announcements"
                      ? "Announcements from the creator will show up here."
                      : "Start the first conversation in this community."
                  }
                />
              ) : (
                <div className="flex flex-col" style={{ gap: 16 }}>
                  {visible.map((item) => (
                    <FeedPost
                      key={item.id}
                      post={item}
                      onPosted={() => void feed.refetch()}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ====== RIGHT RAIL ====== */}
        <aside
          className="flex flex-col"
          style={{ gap: 24, minWidth: 0, position: "sticky", top: 80 }}
        >
          <div className="card card-sm">
            {community?.imageUrl ? (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 16,
                  background: "var(--paper-2)",
                }}
              >
                <img
                  src={community.imageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : null}
            <h3 className="h6" style={{ marginBottom: 8 }}>
              {community?.title ?? "Community"}
            </h3>
            {community ? (
              <p className="text-xs muted tnum" style={{ marginBottom: 12 }}>
                {community.memberCount.toLocaleString()} members
              </p>
            ) : null}
            <div className="flex" style={{ gap: 8 }}>
              <Link
                href={`/communities/${encodeURIComponent(slug)}/classroom`}
                className="btn btn-secondary btn-sm btn-block"
              >
                Classroom
              </Link>
              <span
                className="btn btn-secondary btn-sm"
                title="You are a member of this community"
                aria-label="You are a member of this community"
              >
                <Icon name="check" size={14} />
              </span>
            </div>
          </div>

          <div className="card card-sm">
            <h3 className="h6" style={{ marginBottom: 8 }}>
              Joined
            </h3>
            <p className="text-sm muted" style={{ margin: 0 }}>
              You&apos;re a member of this community, so you can post and reply here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
