import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Compass,
  MessagesSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { HeroIconPattern } from "@/components/hero-icon-pattern";
import { StarRating } from "@/components/star-rating";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MOCK_COMMUNITIES, MOCK_REVIEWS } from "@/lib/mocks";

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    text: "Browse communities by topic and find a creator worth learning from. Verified profiles, real reviews, transparent pricing.",
  },
  {
    icon: Wallet,
    title: "Enroll",
    text: "Join free communities instantly, or pay securely with Paystack — card, transfer, or USSD. One-time or monthly, the creator decides.",
  },
  {
    icon: BookOpenCheck,
    title: "Learn together",
    text: "Structured lessons plus a living discussion feed. Ask questions, share wins, and learn with people on the same path.",
  },
];

const PROOF = [
  { value: "2,700+", label: "learners" },
  { value: "5", label: "verified creators" },
  { value: "₦", label: "priced in naira, paid local" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7fafc]">
      <SiteHeader />

      <main>
        {/* ── Hero: asymmetric 7/5, left-anchored ─────────────────── */}
        <section className="relative overflow-hidden">
          {/* Faded icon field behind the right half (Figma hero) */}
          <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block [mask-image:linear-gradient(to_right,transparent,black_35%)]">
            <HeroIconPattern />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-12 md:pt-20">
            <div className="md:col-span-7" style={{ animation: "rise-in 500ms var(--ease-out) both" }}>
              <p className="label-eyebrow">Learning communities · Nigeria first</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.04] tracking-tight text-slate-900 md:text-6xl">
                Learn from people worth learning from.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Interlekt is where African creators turn what they know into learning
                communities — structured lessons, honest discussion, and pricing in
                naira. Find your people. Build real skill.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="press" asChild>
                  <Link href="/communities">
                    Explore communities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="press" asChild>
                  <Link href="/auth/register">
                    <PlayCircle className="h-4 w-4" />
                    Start teaching
                  </Link>
                </Button>
              </div>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                {PROOF.map((p) => (
                  <div key={p.label}>
                    <dt className="sr-only">{p.label}</dt>
                    <dd className="font-display text-3xl text-slate-900">{p.value}</dd>
                    <dd className="mt-1 text-sm text-slate-500">{p.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Proof panel: featured community, breaks the column */}
            <div
              className="md:col-span-5"
              style={{ animation: "rise-in 500ms var(--ease-out) 90ms both" }}
            >
              <div className="lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="label-eyebrow">Featured this week</p>
                <div className="mt-3 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 font-display text-5xl text-white/90">
                  A
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  API Engineering with Adaeze
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  Adaeze Okafor
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                  <span aria-label="verified creator">· Verified</span>
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <StarRating rating={4.8} reviewCount={127} />
                  <span className="text-sm text-slate-500">842 members</span>
                </div>
                <Button className="press mt-4 w-full" asChild>
                  <Link href="/communities/api-engineering-lagos">View community</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust strip ─────────────────────────────────────────── */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-3 px-4 py-5">
            <p className="label-eyebrow">Why learners trust Interlekt</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-medium text-slate-600">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Verified creators
              </li>
              <li className="inline-flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-blue-600" />
                Reviews from real enrollments
              </li>
              <li className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Paystack-secured payments
              </li>
            </ul>
          </div>
        </section>

        {/* ── Communities ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-eyebrow">Start here</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
                Communities open now
              </h2>
            </div>
            <Button variant="outline" className="press" asChild>
              <Link href="/communities">
                Browse all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_COMMUNITIES.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────── */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <p className="label-eyebrow">How it works</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
              Three steps between you and the skill you want.
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative">
                  <span
                    aria-hidden="true"
                    className="font-display text-6xl text-slate-100"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <s.icon className="mt-2 h-6 w-6 text-blue-600" />
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Creator band ────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid overflow-hidden rounded-2xl bg-slate-900 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sky-300">
                For creators
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-white md:text-4xl">
                Your knowledge is a business waiting to happen.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-slate-300">
                Package what you know into a community, charge in naira, and watch
                revenue land in your dashboard. No website to build, no payment
                plumbing to wrestle.
              </p>
              <Button size="lg" variant="secondary" className="press mt-8" asChild>
                <Link href="/auth/register">
                  Become a creator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col justify-center gap-4 bg-slate-800/50 p-8 md:p-12">
              {[
                ["Set your price", "One-time or monthly — you decide, per community."],
                ["See every kobo", "Members, transactions, and your share, live."],
                ["Get discovered", "Verified badge, reviews, and a public profile."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl bg-slate-800 p-4 ring-1 ring-white/10">
                  <p className="font-semibold text-white">{t}</p>
                  <p className="mt-1 text-sm text-slate-300">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
          <p className="label-eyebrow">Wall of love</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
            Learners say it better.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {MOCK_REVIEWS.map((r) => (
              <figure key={r.id} className="lift rounded-2xl border border-slate-200 bg-white p-6">
                <StarRating rating={r.rating} />
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
                  “{r.content}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {r.author.display_name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {r.author.display_name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-14 text-center md:py-16">
            <h2 className="mx-auto max-w-xl font-display text-3xl tracking-tight text-white md:text-4xl">
              Stop scrolling past the skill you want.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Join a community today — free or paid, always taught by someone
              who&apos;s done the work.
            </p>
            <Button size="lg" variant="secondary" className="press mt-8" asChild>
              <Link href="/communities">
                Find your community
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
