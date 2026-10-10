"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Compass,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { HeroIconPattern } from "@/components/hero-icon-pattern";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCommunities } from "@/hooks/use-communities";

const STEPS = [
  {
    icon: Compass,
    title: "Find your people",
    text: "Explore welcoming communities led by people who have done the work. Real reviews and clear pricing help you choose with confidence.",
  },
  {
    icon: Wallet,
    title: "Join with ease",
    text: "Learn for free or pay securely in naira. Choose a one-time payment or a monthly membership—each creator sets the terms.",
  },
  {
    icon: BookOpenCheck,
    title: "Grow together",
    text: "Follow practical lessons, ask questions, share your progress, and learn alongside people working toward the same goals.",
  },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified creators" },
  { icon: MessagesSquare, label: "Reviews from real learners" },
  { icon: Sparkles, label: "Secure local payments" },
];

export default function LandingPage() {
  const { data: communityData, isLoading: communitiesLoading, isError: communitiesError } = useCommunities({ pageSize: 4 });
  const communities = communityData?.items ?? [];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-950">
      <SiteHeader />
      <main>
        <section className="relative isolate flex min-h-[760px] items-center justify-center overflow-hidden px-5 pb-24 pt-20 md:min-h-[820px] md:pb-28 md:pt-16">
          <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[62%] opacity-75 md:block [mask-image:linear-gradient(to_right,transparent,black_27%,black_100%)]">
            <HeroIconPattern />
          </div>
          <div className="pointer-events-none absolute -right-32 top-[42%] -z-10 h-[440px] w-[440px] rounded-full bg-sky-50/70 blur-3xl md:hidden" />
          <div className="relative mx-auto w-full max-w-[1100px] text-center" style={{ animation: "rise-in 550ms var(--ease-out) both" }}>
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-800 shadow-sm shadow-sky-900/[0.03] md:mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              Learn · Connect · Grow
            </p>
            <h1 className="mx-auto max-w-[1060px] text-balance font-sans text-[clamp(2.75rem,6vw,5.35rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#07111d]">
              Get in with communities around what you know.
            </h1>
            <p className="mx-auto mt-7 max-w-[790px] text-pretty text-base leading-8 text-slate-600 md:mt-8 md:text-[20px] md:leading-[1.65]">
              Learn new skills, connect with like-minded people, and create spaces where knowledge can be shared, communities can grow, and opportunities can begin.
            </p>
            <div className="mt-9 flex justify-center md:mt-11">
              <Link
                href="/communities"
                className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#b5e5f1] px-9 text-[17px] font-semibold text-[#073451] shadow-[0_10px_28px_-16px_rgba(7,52,81,.48)] transition-colors hover:bg-[#a6dff0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
              >
                Explore communities
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-500">Find a community. Learn something real.</p>
          </div>
        </section>

        <section className="border-y border-sky-100/80 bg-[#f7fcfe]" aria-label="What makes Interlekt different">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 py-6 md:py-7">
            <p className="w-full text-center font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:w-auto">A better way to learn, together</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-700">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2.5">
                  <Icon className="h-[17px] w-[17px] text-sky-700" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="communities" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="label-eyebrow">Explore what’s possible</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-950 md:text-4xl">Communities to grow with</h2>
              <p className="mt-3 max-w-xl text-slate-600">Find practical lessons, honest conversation, and people who want to see you thrive.</p>
            </div>
            <Button variant="outline" className="press rounded-full border-sky-200 text-sky-900 hover:bg-sky-50" asChild>
              <Link href="/communities">Browse all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {communitiesLoading ? (
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading live communities">
              {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />)}
            </div>
          ) : communitiesError ? (
            <p role="alert" className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">Communities could not be loaded from the backend right now. Please try again shortly.</p>
          ) : communities.length ? (
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {communities.map((community) => <CommunityCard key={community.id} community={community} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 px-6 py-10 text-center">
              <p className="font-semibold text-slate-900">No published communities yet</p>
              <p className="mt-2 text-sm text-slate-600">New communities will appear here once creators publish them.</p>
            </div>
          )}
        </section>

        <section id="how-it-works" className="scroll-mt-24 border-y border-sky-100/80 bg-[#f7fcfe]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
            <p className="label-eyebrow">Your next step starts here</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-slate-950 md:text-4xl">From curious to confident—together.</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="lift rounded-2xl border border-sky-100 bg-white p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e4f7fc] text-sky-800"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="font-mono text-xs font-medium tracking-wider text-slate-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="creators" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="grid overflow-hidden rounded-[28px] bg-[#082f4a] md:grid-cols-[1.08fr_.92fr]">
            <div className="p-8 md:p-12 lg:p-14">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[#a9e4f2]">For the ones who teach</p>
              <h2 className="mt-4 max-w-xl font-display text-3xl tracking-tight text-white md:text-4xl">Turn what you know into a community that grows.</h2>
              <p className="mt-4 max-w-lg leading-7 text-sky-100/80">Share your experience, build a home for your learners, and earn from your knowledge—with local pricing and payments built in.</p>
              <Button size="lg" className="press mt-8 rounded-full bg-[#b5e5f1] px-6 text-[#073451] hover:bg-[#d1f0f7]" asChild>
                <Link href="/auth/register">Start teaching <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-white/[0.045] p-7 md:p-10">
              {[
                ["Set your price", "One-time or monthly—you decide."],
                ["See your progress", "Members and revenue in one clear view."],
                ["Get discovered", "Build trust with verified profiles and learner reviews."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-sky-100/70">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="rounded-[28px] border border-sky-100 bg-[#eaf8fc] px-6 py-12 text-center md:px-12 md:py-16">
            <p className="label-eyebrow">Your people are out there</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl tracking-tight text-slate-950 md:text-4xl">Make room for what you want to learn next.</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">Join a community led by someone who’s been where you want to go.</p>
            <Link href="/communities" className="press mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b5e5f1] px-7 font-semibold text-[#073451] hover:bg-[#a6dff0]">
              Find your community <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
