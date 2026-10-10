"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { BookOpen, Star, Users } from "lucide-react";
import { EnrollCard } from "@/components/enroll-card";
import { MoneyAmount } from "@/components/money-amount";
import { VerificationBadge } from "@/components/verification-badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApiError } from "@/lib/api/client";
import { useMe } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-communities";
import { useMyEnrollments } from "@/hooks/use-enrollments";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = use(params);
  const { data: community, isLoading, isError, error, refetch } = useCommunity(slug);
  const { data: me } = useMe();
  const { data: enrollments = [] } = useMyEnrollments();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fbfd]">
        <SiteHeader />
        <main className="mx-auto max-w-6xl animate-pulse px-5 py-8 md:px-8 md:py-12">
          <div className="h-56 rounded-[28px] border border-sky-100 bg-sky-100/70 md:h-80" />
          <div className="mt-8 h-8 w-2/3 rounded bg-sky-100" />
          <div className="mt-3 h-4 w-1/3 rounded bg-sky-100" />
          <div className="mt-8 h-48 rounded-2xl bg-white" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (isError && error instanceof ApiError && error.status === 404) notFound();

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f7fbfd] text-[#102f45]">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h1 className="text-xl font-semibold">Community details are unavailable</h1>
            <p className="mt-2 text-sm leading-6">We could not load this community from the backend. Please check your connection and try again.</p>
            <Button type="button" onClick={() => void refetch()} className="mt-5">Retry</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!community) notFound();

  // The backend detail contract includes the aggregate but does not expose
  // individual reviews to anonymous visitors (its review-list route is auth-gated).
  const ratingSummary = community as typeof community & { rating?: number | null; reviewCount?: number };
  const rating = ratingSummary.rating ?? null;
  const reviewCount = ratingSummary.reviewCount ?? 0;

  const enrollment =
    enrollments.find((e) => e.community.id === community.id && e.status === "active") ?? null;
  const isOwner = !!me && me.id === community.creator.userId;

  return (
    <div className="min-h-screen bg-[#f7fbfd] text-[#102f45]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-white p-2 shadow-[0_14px_45px_-34px_rgba(9,51,76,.35)]">
          <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#dff4fa] via-[#eaf8fc] to-[#c8eaf4] md:h-72 lg:h-[360px]">
            {community.imageUrl ? (
              <Image
                src={community.imageUrl}
                alt={community.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
              />
            ) : (
              <span className="font-display text-7xl font-semibold text-[#1c7092]/30 md:text-8xl" aria-hidden="true">
                {community.title.charAt(0)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="min-w-0">
            <header>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Community</p>
              <h1 className="mt-2 font-display text-3xl tracking-tight text-[#092d46] md:text-4xl">
                {community.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-800" aria-hidden="true" />
                  {community.memberCount.toLocaleString()} members
                </span>
                <span className="inline-flex items-center gap-2">
                  <MoneyAmount
                    priceAmount={community.priceAmount}
                    currency={community.priceCurrency}
                    isFree={community.isFree}
                  />
                </span>
                <span
                  className="inline-flex items-center gap-1.5"
                  aria-label={reviewCount > 0 && rating !== null ? `${rating.toFixed(1)} out of 5 from ${reviewCount} ${reviewCount === 1 ? "rating" : "ratings"}` : "No ratings yet"}
                >
                  <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  {reviewCount > 0 && rating !== null ? `${rating.toFixed(1)} · ${reviewCount} ${reviewCount === 1 ? "rating" : "ratings"}` : "No ratings yet"}
                </span>
                {community.categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/communities?category=${c.slug}`}
                    className="rounded-full border border-sky-100 bg-[#f1fbfe] px-3 py-1 text-xs font-semibold text-sky-900 transition-colors hover:border-sky-300 hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">{community.description}</p>
            </header>

            <section className="mt-8 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm md:p-6" aria-labelledby="mentor-title">
              <h2 id="mentor-title" className="font-display text-xl font-semibold text-[#092d46]">Your mentor</h2>
              <Link
                href={`/creators/${community.creator.userId}`}
                className="group mt-4 flex items-center gap-4 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-[#e1f5fb] text-xl font-semibold text-[#0c5878]">
                  {community.creator.displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-[#092d46] group-hover:text-sky-800">
                    {community.creator.displayName}
                    <VerificationBadge status={community.creator.verificationStatus} />
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Meet the creator behind this community</p>
                </div>
              </Link>
            </section>

            <section className="mt-9" aria-labelledby="learning-title">
              <div className="flex items-end justify-between gap-4 border-b border-sky-100 pb-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">Curriculum</p>
                  <h2 id="learning-title" className="mt-1 font-display text-xl font-semibold text-[#092d46]">What you&apos;ll learn</h2>
                </div>
                {community.courses.length > 0 && (
                  <span className="text-sm text-slate-500">{community.courses.length} {community.courses.length === 1 ? "course" : "courses"}</span>
                )}
              </div>
              {community.courses.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-sky-200 bg-white p-5 text-sm leading-6 text-slate-600">
                  Curriculum is being prepared — check back soon.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {community.courses.map((course, i) => (
                    <div key={course.id} className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm transition-colors hover:border-sky-200 md:p-5">
                      <p className="flex items-center gap-3 font-medium text-[#092d46]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5f6fb] text-sm font-semibold text-sky-900">
                          {i + 1}
                        </span>
                        {course.title}
                      </p>
                      <p className="mt-2 flex items-center gap-2 pl-11 text-xs font-medium text-slate-500">
                        <BookOpen className="h-3.5 w-3.5 text-sky-700" aria-hidden="true" />
                        {course.lessonCount} lessons · {course.moduleCount} modules
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <EnrollCard community={community} enrollment={enrollment} isOwner={isOwner} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
