"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { AmbientIcons } from "@/components/shell/ambient-icons";
import { useCategories, useCommunities } from "@/hooks/use-communities";

/**
 * A14 — about Interlekt.
 *
 * The only numbers on this page are the live community total and the
 * category count, both read from the API. There is no platform-stats
 * endpoint, so no learner count, earnings figure or mentor count appears.
 */

const VALUES = [
  {
    title: "Learners first",
    text: "Every decision starts with what is better for the learner: clear pricing, real ratings, working teachers, and a curriculum you can read before you commit.",
  },
  {
    title: "Naira-native always",
    text: "Prices are set and shown in naira. Nothing is quoted in dollars and nothing asks a learner to work around a foreign payment rail.",
  },
  {
    title: "Working professionals only",
    text: "To teach on Interlekt you have to be doing the work. We check identity and proof of work before a creator earns the verification check.",
  },
  {
    title: "Calm, not cluttered",
    text: "The product is quiet. No streaks, no confetti, no upsell modals — lessons, classroom, feed and progress, in the order you need them.",
  },
];

export default function AboutPage() {
  const { data: communityData, isLoading } = useCommunities({ pageSize: 1 });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const totalCommunities = communityData?.total ?? 0;

  return (
    <PublicShell active="about">
      {/* Hero */}
      <Reveal as="section" className="relative overflow-hidden pt-32 pb-24">
        <AmbientIcons layout="hero" />
        <div className="container" style={{ maxWidth: 920, position: "relative", zIndex: 1 }}>
          <h1 className="t-display" style={{ fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.022em", marginBottom: 32 }}>
            We&apos;re building the learning platform African creators deserve.
          </h1>
          <p className="text-lead" style={{ fontSize: 21, maxWidth: 720, color: "var(--ink-2)", lineHeight: 1.5 }}>
            Interlekt is a learning community platform built so that working professionals can teach what
            they know, and learners can pay for it in naira. Every community is a real curriculum, a real
            classroom and a real price — nothing more.
          </p>
        </div>
      </Reveal>

      {/* Mission */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="h2" style={{ marginBottom: 32 }}>
            Our mission
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              The best people to teach a skill are usually the ones doing it for a living. Engineers teach
              engineering. Designers teach design. Analysts teach analysis. Not influencers — practitioners.
            </p>
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              We also believe naira-native commerce is not negotiable. Asking a learner in Ibadan to fight
              with a foreign card and a dollar-denominated subscription to study something is disrespectful.
              Interlekt prices every community in naira and shows that price in full before anyone joins.
            </p>
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              And we believe in paying working professionals properly for the knowledge they spent years
              building. Creators set their own price, publish a real curriculum, and teach inside a
              classroom and a feed built for exactly that — not a folder of slides.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Live stats */}
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
                {isLoading ? "—" : totalCommunities.toLocaleString()}
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

      {/* How we started */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="h2" style={{ marginBottom: 32 }}>
            How we started
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              Interlekt started in Lagos with a handful of communities and one conviction: the people
              doing the work are the best people to teach it, and they need a platform that treats them
              like professionals rather than content creators.
            </p>
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              The first version was deliberately small — a handful of teachers, real curricula, and a
              directory where every listing showed exactly what you would get before you joined. We
              shipped the classroom and the feed before we shipped anything else, because a course
              without a place to ask questions is just a file.
            </p>
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              We are still early, and we still build in the open: no locked pricing, no invented
              statistics, no features promised before the backend can deliver them. What you see on
              Interlekt is what actually works today.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Values */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container" style={{ maxWidth: 920 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>
            Values
          </h2>
          <p className="text-body muted" style={{ color: "var(--ink-3)", marginBottom: 48 }}>
            Four rules we won&apos;t bend on.
          </p>
          <div className="grid grid-2" style={{ gap: 24 }}>
            {VALUES.map((value) => (
              <div key={value.title} className="card">
                <h3 className="h4" style={{ marginBottom: 12 }}>
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--ink-2)", lineHeight: 1.55 }}>
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Team */}
      <Reveal as="section" className="pt-8 pb-24">
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>
            The team
          </h2>
          <p className="text-body muted" style={{ color: "var(--ink-3)", marginBottom: 32 }}>
            Small, and still teaching.
          </p>
          <div className="flex flex-col gap-6">
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              Interlekt is built by a small team based in Lagos, Nigeria. We work with working
              professionals to publish the communities we wished existed when we were learning — the ones
              that assume you already know what a curriculum is.
            </p>
            <p className="text-body" style={{ lineHeight: 1.6 }}>
              If you teach something you know well and want a proper home for it,{" "}
              <Link href="/auth/register" style={{ color: "var(--accent)" }}>
                start a creator account
              </Link>
              . If you want to learn something,{" "}
              <Link href="/communities" style={{ color: "var(--accent)" }}>
                browse the directory
              </Link>
              .
            </p>
          </div>
        </div>
      </Reveal>

      {/* Final CTA */}
      <Reveal as="section" className="pt-16 pb-32">
        <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
          <h2 className="h1" style={{ marginBottom: 20 }}>
            Come build with us
          </h2>
          <p className="text-lead" style={{ color: "var(--ink-3)", marginBottom: 40 }}>
            Learn from someone who has done the work — or teach the work you know.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
            <Link className="btn btn-primary btn-pill btn-lg" href="/auth/register">
              Get started — free
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link className="btn btn-secondary btn-pill btn-lg" href="/onboarding">
              Become a creator
            </Link>
          </div>
        </div>
      </Reveal>
    </PublicShell>
  );
}
