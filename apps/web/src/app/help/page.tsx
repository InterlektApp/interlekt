"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PublicShell } from "@/components/public/public-shell";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { HELP_ARTICLES, HELP_TOPICS } from "@/content/help";

/**
 * A16 — the help centre.
 *
 * The articles live in the repo (`src/content/help.ts`) and are searched in
 * the browser. There is no help API yet, so nothing here is fetched.
 */

const POPULAR_LIMIT = 6;

function HelpInner() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") ?? "";
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return HELP_ARTICLES.filter((article) => {
      if (topic && article.topic !== topic) return false;
      if (!needle) return true;
      return (
        article.title.toLowerCase().includes(needle) ||
        article.summary.toLowerCase().includes(needle) ||
        article.body.some((paragraph) => paragraph.toLowerCase().includes(needle))
      );
    });
  }, [query, topic]);

  const activeTopic = HELP_TOPICS.find((entry) => entry.id === topic);
  const showPopular = !query.trim() && !topic;
  const visible = showPopular ? matches.slice(0, POPULAR_LIMIT) : matches;

  return (
    <PublicShell active="help">
      {/* Hero */}
      <Reveal as="section" className="pt-20 pb-12">
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <h1 className="h1" style={{ marginBottom: 16 }}>
            Help centre
          </h1>
          <p className="text-lead" style={{ color: "var(--ink-3)", marginBottom: 40 }}>
            Answers to the questions we get most often about joining, learning and teaching on Interlekt.
          </p>

          <div
            className="input-group"
            style={{
              height: 56,
              borderRadius: "var(--r-md)",
              background: "var(--paper)",
              border: "1px solid var(--line-2)",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
            }}
          >
            <span
              className="prefix"
              style={{ border: "none", background: "transparent", paddingLeft: 20, paddingRight: 8, display: "flex", alignItems: "center" }}
              aria-hidden="true"
            >
              <Icon name="search" size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help articles…"
              aria-label="Search help articles"
              className="min-w-0 flex-1 focus-visible:shadow-focus focus-visible:outline-none"
              style={{
                border: "none",
                height: 56,
                fontSize: 16,
                paddingLeft: 8,
                background: "transparent",
              }}
            />
          </div>
        </div>
      </Reveal>

      {/* Articles */}
      <Reveal as="section" className="pb-24">
        <div className="container">
          {activeTopic ? (
            <div className="row-between" style={{ marginBottom: 32, flexWrap: "wrap" }}>
              <div>
                <h2 className="h3">{activeTopic.label}</h2>
                <p className="text-sm muted" style={{ color: "var(--ink-3)" }}>
                  {activeTopic.description}
                </p>
              </div>
              <Link href="/help" className="btn btn-secondary btn-sm">
                Clear topic
              </Link>
            </div>
          ) : showPopular ? (
            <h2 className="h3" style={{ marginBottom: 32 }}>
              Popular articles
            </h2>
          ) : null}

          {visible.length === 0 ? (
            <EmptyState
              icon="search"
              title="No articles matched"
              description={
                query.trim()
                  ? `We couldn't find an article matching “${query.trim()}”. Try a different phrase, or email support@interlekt.com.`
                  : "There are no articles in this topic yet. Email support@interlekt.com and we'll help you directly."
              }
              action={{ label: "Browse all topics", href: "/help" }}
            />
          ) : (
            <div className="grid grid-3" style={{ gap: 24 }}>
              {visible.map((article) => (
                <article key={article.slug} className="card card-hover flex flex-col">
                  <p className="text-xs muted" style={{ marginBottom: 8 }}>
                    {HELP_TOPICS.find((entry) => entry.id === article.topic)?.label}
                  </p>
                  <h3 className="h5" style={{ marginBottom: 8 }}>
                    {article.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--ink-2)", marginBottom: 20, flex: 1 }}>
                    {article.summary}
                  </p>
                  <Link
                    href={`/help/${article.slug}`}
                    className="inline-flex items-center gap-2 text-15"
                    style={{ color: "var(--accent)", fontWeight: 500 }}
                  >
                    Read more
                    <Icon name="arrowRight" size={15} />
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Topics */}
          <div style={{ marginTop: 96 }}>
            <h2 className="h3" style={{ marginBottom: 8 }}>
              Browse by topic
            </h2>
            <p className="text-sm muted" style={{ color: "var(--ink-3)", marginBottom: 32 }}>
              Every article lives under one of these topics.
            </p>
            <div className="grid grid-3" style={{ gap: 24 }}>
              {HELP_TOPICS.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/help?topic=${entry.id}`}
                  className="card card-hover flex items-center justify-between gap-4"
                >
                  <span>
                    <span className="h5" style={{ display: "block", marginBottom: 6 }}>
                      {entry.label}
                    </span>
                    <span className="text-sm" style={{ color: "var(--ink-3)" }}>
                      {entry.description}
                    </span>
                  </span>
                  <Icon name="chevronRight" size={18} className="shrink-0 text-ink-3" />
                </Link>
              ))}
            </div>
          </div>

          {/* Still need help */}
          <div style={{ marginTop: 96 }}>
            <h2 className="h3" style={{ marginBottom: 8 }}>
              Still need help?
            </h2>
            <p className="text-sm muted" style={{ color: "var(--ink-3)", marginBottom: 32 }}>
              We read every message. If the answer isn&apos;t here, ask us directly.
            </p>
            <div className="grid grid-2" style={{ gap: 24 }}>
              <a href="mailto:support@interlekt.com" className="card card-hover">
                <p className="h5" style={{ marginBottom: 6 }}>
                  Contact support
                </p>
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                  support@interlekt.com — we usually reply within one working day.
                </p>
              </a>
              <Link href="/trust" className="card card-hover">
                <p className="h5" style={{ marginBottom: 6 }}>
                  Trust &amp; safety
                </p>
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                  How we verify creators, what we don&apos;t allow, and how to report a problem.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </PublicShell>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<div className="page" aria-busy="true" />}>
      <HelpInner />
    </Suspense>
  );
}
