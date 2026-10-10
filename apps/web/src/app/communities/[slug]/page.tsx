"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { BookOpen, Users } from "lucide-react";
import { EnrollCard } from "@/components/enroll-card";
import { MoneyAmount } from "@/components/money-amount";
import { StarRating } from "@/components/star-rating";
import { VerificationBadge } from "@/components/verification-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useMe } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-communities";
import { useMyEnrollments } from "@/hooks/use-enrollments";
import { MOCK_REVIEWS } from "@/lib/mocks";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = use(params);
  const { data: community, isLoading } = useCommunity(slug);
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

  if (!community) notFound();

  const enrollment =
    enrollments.find((e) => e.community.id === community.id && e.status === "active") ?? null;
  const isOwner = !!me && me.id === community.creator.userId;
  const reviews = MOCK_REVIEWS.filter((r) => r.community_id === community.id);

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

            <section className="mt-9" aria-labelledby="reviews-title">
              <div className="border-b border-sky-100 pb-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">From the community</p>
                <h2 id="reviews-title" className="mt-1 font-display text-xl font-semibold text-[#092d46]">What members say</h2>
              </div>
              {reviews.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-sky-200 bg-white p-5 text-sm text-slate-600">No reviews yet — be the first.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {reviews.map((r) => (
                    <article key={r.id} className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-medium text-[#092d46]">{r.author.display_name}</p>
                        <StarRating rating={r.rating} />
                      </div>
                      {r.content && (
                        <p className="mt-3 text-sm leading-7 text-slate-600">{r.content}</p>
                      )}
                    </article>
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
