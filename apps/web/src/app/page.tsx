"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { SearchField } from "@/components/public/search-field";
import { CommunityCard } from "@/components/ui/content-cards";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { AmbientIcons } from "@/components/shell/ambient-icons";
import { useCategories, useCommunities } from "@/hooks/use-communities";

/**
 * A1 — the landing page.
 *
 * Every number on this page comes from the API: the community total from
 * `GET /communities` and the category list from `GET /categories`. There is
 * no platform-stats endpoint yet, so no learner count, earnings figure or
 * mentor count is shown.
 */

const STEPS = [
  {
    title: "Discover",
    text: "Search by skill, category or creator. Every listing shows the member count, the rating and the price in naira before you commit to anything.",
  },
  {
    title: "Join a community",
    text: "Open a community to read exactly what is inside. Free communities can be joined straight away; paid ones show their price up front.",
  },
  {
    title: "Learn & engage",
    text: "Work through structured courses and modules, mark lessons complete, and ask questions in the community feed alongside the creator and other members.",
  },
];

const CREATOR_POINTS = [
  {
    title: "Publish a curriculum",
    text: "Build courses, modules and lessons in Creator Studio. Your learners see exactly what they will work through before they join.",
  },
  {
    title: "Set the price in naira",
    text: "Every community carries a price in ₦ alongside its member count and rating, so learners can compare before they enrol.",
  },
  {
    title: "Run the classroom",
    text: "Published lessons, tracked progress and a community feed give you somewhere to teach properly instead of shipping a folder of PDFs.",
  },
];

export default function LandingPage() {
  const {
    data: communityData,
    isLoading: communitiesLoading,
    isError: communitiesError,
    refetch,
  } = useCommunities({ pageSize: 6, sort: "most_members" });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const communities = communityData?.items ?? [];
  const totalCommunities = communityData?.total ?? 0;

  return (
    <PublicShell active="explore">
      {/* ==================== HERO ==================== */}
      <Reveal as="section" className="relative overflow-hidden pt-32 pb-24">
        <AmbientIcons layout="hero" />
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: 880, position: "relative", zIndex: 1 }}
        >
          <h1 className="t-display" style={{ marginBottom: "28px" }}>
            Learn with people
            <br />
            who&apos;ve done it.
          </h1>
          <p
            className="text-lead"
            style={{ fontSize: 21, maxWidth: 620, margin: "0 auto 40px", color: "var(--ink-2)" }}
          >
            Join real learning communities led by working Nigerian engineers, founders and creatives.
            Learn in a structured classroom, ask questions in the feed, and ship work that matters.
          </p>

          <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
            <Link className="btn btn-primary btn-pill btn-lg" href="/auth/register">
              Get started — free
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link className="btn btn-secondary btn-pill btn-lg" href="/communities">
              Browse communities
            </Link>
          </div>

          {/* Search — a real GET form against /search */}
          <div style={{ maxWidth: 560, margin: "64px auto 0" }}>
            <SearchField
              action="/search"
              label="Search communities"
              placeholder="Search communities, mentors, skills…"
              trailing={
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ margin: 8, height: 40, borderRadius: "var(--r-sm)" }}
                >
                  Search
                </button>
              }
            />

            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: 8, marginTop: 16 }}
            >
              <span className="text-xs muted">Popular:</span>
              {categoriesLoading
                ? Array.from({ length: 4 }, (_, index) => (
                    <span key={index} className="skeleton" style={{ width: 110, height: 28 }} />
                  ))
                : categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      className="chip chip-sm"
                      href={`/communities?category=${encodeURIComponent(category.slug)}`}
                    >
                      {category.name}
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ==================== TRUST STRIP ==================== */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
              textAlign: "center",
              padding: "32px 0",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div
                className="text-money"
                style={{ fontSize: 36, color: "var(--ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {communitiesLoading || communitiesError ? "—" : totalCommunities.toLocaleString()}
              </div>
              <div className="text-sm muted" style={{ marginTop: 4 }}>
                Live communities
              </div>
            </div>
            <div>
              <div
                className="text-money"
                style={{ fontSize: 36, color: "var(--ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {categoriesLoading ? "—" : categories.length.toLocaleString()}
              </div>
              <div className="text-sm muted" style={{ marginTop: 4 }}>
                Learning categories
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ==================== COMMUNITIES ==================== */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container">
          <div
            className="flex flex-wrap items-end justify-between"
            style={{ gap: 24, marginBottom: 48 }}
          >
            <div>
              <h2 className="h2" style={{ marginBottom: 8 }}>
                Popular communities
              </h2>
              <p className="text-body muted" style={{ color: "var(--ink-3)" }}>
                Real communities led by working professionals. Pricing in naira.
              </p>
            </div>
            <Link className="btn btn-secondary btn-pill" href="/communities">
              Explore all
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          {communitiesLoading ? (
            <div className="grid grid-3" style={{ gap: 24 }} aria-label="Loading communities">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="skeleton" style={{ height: 320 }} />
              ))}
            </div>
          ) : communitiesError ? (
            <Alert variant="danger" icon="alertCircle" title="Communities could not be loaded">
              <p style={{ marginBottom: 12 }}>
                We couldn&apos;t reach the community service. Check your connection and try again.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => void refetch()}
              >
                Retry community list
              </button>
            </Alert>
          ) : communities.length === 0 ? (
            <EmptyState
              icon="users"
              title="No published communities yet"
              description="New communities appear here as soon as creators publish them. Check back soon."
              action={{ label: "Browse all communities", href: "/communities" }}
            />
          ) : (
            <div className="grid grid-3" style={{ gap: 24 }}>
              {communities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* ==================== CATEGORIES ==================== */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 8, textAlign: "center" }}>
            Browse by what you want to learn
          </h2>
          <p className="text-body muted" style={{ color: "var(--ink-3)", marginBottom: 40, textAlign: "center" }}>
            Every category is a real filter over the live directory.
          </p>
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: 10, maxWidth: 920, margin: "0 auto" }}
          >
            {categoriesLoading
              ? Array.from({ length: 8 }, (_, index) => (
                  <span key={index} className="skeleton" style={{ width: 160, height: 36 }} />
                ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    className="chip"
                    href={`/communities?category=${encodeURIComponent(category.slug)}`}
                  >
                    {category.name}
                  </Link>
                ))}
          </div>
        </div>
      </Reveal>

      {/* ==================== CREATOR PITCH (the one dark band) ==================== */}
      <Reveal as="section" className="section-dark py-32">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 80px" }}>
            <h2 className="t-display-sm" style={{ marginBottom: 24 }}>
              Teach what you know.
              <br />
              Build a room around it.
            </h2>
            <p className="text-lead" style={{ maxWidth: 580, margin: "0 auto 40px" }}>
              Turn what you know into a structured learning community: a curriculum, a classroom, a feed,
              and a price in naira that learners can see before they join.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
              <Link
                className="btn btn-lg btn-pill bg-warning text-ink hover:opacity-90"
                href="/auth/register"
              >
                Become a creator
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link className="btn btn-inverse btn-pill btn-lg" href="/communities">
                See live communities
              </Link>
            </div>
          </div>

          <div
            className="grid grid-3"
            style={{
              gap: 24,
              maxWidth: 880,
              margin: "0 auto",
              padding: "48px 0",
              borderTop: "1px solid var(--line-dark)",
              borderBottom: "1px solid var(--line-dark)",
            }}
          >
            {CREATOR_POINTS.map((point) => (
              <div key={point.title} style={{ textAlign: "center" }}>
                <p
                  className="text-money"
                  style={{ fontSize: 19, color: "#fff", fontWeight: 600, marginBottom: 8 }}
                >
                  {point.title}
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ==================== HOW IT WORKS ==================== */}
      <Reveal as="section" className="pt-32 pb-24">
        <div className="container">
          <h2 className="h2" style={{ textAlign: "center", marginBottom: 8 }}>
            How it works
          </h2>
          <p className="text-body muted" style={{ color: "var(--ink-3)", textAlign: "center", marginBottom: 64 }}>
            Three steps. No friction.
          </p>

          <div className="grid grid-3" style={{ gap: 32 }}>
            {STEPS.map((step, index) => (
              <div key={step.title} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 600,
                    color: "var(--ink-3)",
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                    lineHeight: 1,
                  }}
                >
                  {index + 1}
                </div>
                <h3 className="h4" style={{ marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p className="text-sm muted" style={{ color: "var(--ink-3)", maxWidth: 280, margin: "0 auto" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ==================== FINAL CTA ==================== */}
      <Reveal as="section" className="pt-16 pb-32">
        <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
          <h2 className="h1" style={{ marginBottom: 20 }}>
            Start learning from people who&apos;ve done it.
          </h2>
          <p className="text-lead" style={{ color: "var(--ink-3)", marginBottom: 40 }}>
            Create an account to join communities, work through lessons and keep your progress on your
            own dashboard.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
            <Link className="btn btn-primary btn-pill btn-lg" href="/auth/register">
              Get started — free
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link className="btn btn-secondary btn-pill btn-lg" href="/communities">
              Browse communities
            </Link>
          </div>
        </div>
      </Reveal>
    </PublicShell>
  );
}
