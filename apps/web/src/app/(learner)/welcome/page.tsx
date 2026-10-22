"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { useCategories } from "@/hooks/use-communities";

/**
 * B15 — learner onboarding.
 *
 * The topic list is the real `GET /categories` vocabulary (8 categories, not
 * the 12 in the design). The account endpoint has no `interests` field, so
 * the picks cannot be saved: they stay in local state, the copy says so
 * plainly, and Continue moves the learner to the community directory filtered
 * by the first picked category.
 */

const MIN_PICKS = 3;

export default function LearnerWelcomePage() {
  const router = useRouter();
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) => {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  };

  const continueTo = () => {
    const first = categories.find((category) => selected.includes(category.slug));
    router.push(first ? `/communities?category=${encodeURIComponent(first.slug)}` : "/communities");
  };

  return (
    <div className="page" style={{ background: "var(--paper)" }}>
      {/* ============== BRAND (no nav) ============== */}
      <div style={{ padding: "40px 24px 16px", textAlign: "center" }}>
        <a href="/" className="brand" style={{ display: "inline-flex" }} aria-label="Interlekt home">
          <BrandMark />
          <BrandWordmark />
        </a>
      </div>

      <main className="container" style={{ maxWidth: 720, paddingTop: 32, paddingBottom: 80 }}>
        {/* ============== PROGRESS INDICATOR ============== */}
        <div
          className="flex items-center justify-between"
          style={{ gap: 16, marginBottom: 40 }}
        >
          <span className="text-xs muted">Step 1 of 2</span>
          <div className="flex" style={{ gap: 6 }}>
            <span style={{ width: 32, height: 4, background: "var(--accent)", borderRadius: "var(--r-pill)" }} />
            <span
              style={{
                width: 32,
                height: 4,
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-pill)",
              }}
            />
          </div>
        </div>

        {/* ============== HEADER ============== */}
        <h1 className="h1" style={{ marginBottom: 12 }}>
          What do you want to learn?
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-2)", margin: "0 0 40px" }}>
          Pick {MIN_PICKS} or more topics. We&apos;ll show you communities led by working professionals.
        </p>

        {isLoading ? (
          <div className="flex flex-wrap" style={{ gap: 10 }} aria-label="Loading topics">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="skeleton" style={{ height: 36, width: 160 }} />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="danger" icon="alertCircle" title="The topic list could not be loaded">
            <p style={{ marginBottom: 12 }}>{error instanceof Error ? error.message : "Please try again."}</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void refetch()}>
              Try again
            </button>
          </Alert>
        ) : categories.length === 0 ? (
          <EmptyState
            icon="compass"
            title="No topics to show yet"
            description="We couldn't load the topic list, so we'll personalise recommendations as you explore."
            action={{ label: "Browse communities", href: "/communities" }}
          />
        ) : (
          <>
            {/* ============== TOPIC CHIPS ============== */}
            <div className="flex flex-wrap" style={{ gap: 10, marginBottom: 16 }}>
              {categories.map((category) => {
                const isSelected = selected.includes(category.slug);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className="chip"
                    aria-pressed={isSelected}
                    onClick={() => toggle(category.slug)}
                    style={
                      isSelected
                        ? {
                            background: "var(--accent-soft)",
                            borderColor: "var(--accent)",
                            color: "var(--accent-ink)",
                          }
                        : undefined
                    }
                  >
                    {category.name}
                    {isSelected ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width={14}
                        height={14}
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* ============== SELECTED COUNT ============== */}
            <p className="text-sm muted tnum" style={{ marginBottom: 40 }}>
              Selected:{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{selected.length}</span> of{" "}
              {categories.length} · pick at least {MIN_PICKS} to continue
            </p>
          </>
        )}

        {/* ============== WHY WE ASK ============== */}
        <div className="card card-tinted" style={{ marginBottom: 40 }}>
          <h2 className="h5" style={{ marginBottom: 12 }}>
            Why we ask
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-2)", margin: "0 0 12px", lineHeight: 1.55 }}>
            We use these topics to point you at communities, lessons and creators that match what you
            actually want to learn. The more focused your picks, the less noise you&apos;ll see.
          </p>
          <p className="text-sm" style={{ color: "var(--ink-2)", margin: 0, lineHeight: 1.55 }}>
            Your account has no field for saved interests yet, so these picks are only kept for this
            visit — Continue opens the directory filtered by your first topic. Nothing is stored and
            nothing is shared with creators.
          </p>
        </div>

        {/* ============== FOOTER ============== */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/communities")}>
            Skip for now
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={selected.length < MIN_PICKS}
            onClick={continueTo}
          >
            Continue
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
