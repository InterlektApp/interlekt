"use client";

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
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="mx-auto max-w-6xl animate-pulse px-4 py-8">
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="mt-6 h-8 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />
        </main>
      </div>
    );
  }

  if (!community) notFound();

  const enrollment =
    enrollments.find((e) => e.community.id === community.id && e.status === "active") ?? null;
  const isOwner = !!me && me.id === community.creator.userId;
  const reviews = MOCK_REVIEWS.filter((r) => r.community_id === community.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 font-display text-6xl text-blue-300">
              {community.title.charAt(0)}
            </div>

            <h1 className="mt-6 font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
              {community.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {community.memberCount.toLocaleString()} members
              </span>
              <MoneyAmount
                priceAmount={community.priceAmount}
                currency={community.priceCurrency}
                isFree={community.isFree}
              />
              {community.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/communities?category=${c.slug}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <p className="mt-4 leading-relaxed text-slate-700">{community.description}</p>

            <section className="mt-8 rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Your mentor</h2>
              <Link
                href={`/creators/${community.creator.userId}`}
                className="mt-3 flex items-start gap-4"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white">
                  {community.creator.displayName.charAt(0)}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-900 hover:text-blue-600">
                    {community.creator.displayName}
                    <VerificationBadge status={community.creator.verificationStatus} />
                  </p>
                </div>
              </Link>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">What you&apos;ll learn</h2>
              {community.courses.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Curriculum is being prepared — check back soon.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {community.courses.map((course, i) => (
                    <div key={course.id} className="rounded-xl border bg-white p-4">
                      <p className="flex items-center gap-2 font-medium text-slate-900">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                          {i + 1}
                        </span>
                        {course.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1 pl-9 text-xs text-slate-400">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.lessonCount} lessons · {course.moduleCount} modules
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">What members say</h2>
              {reviews.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No reviews yet — be the first.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{r.author.display_name}</p>
                        <StarRating rating={r.rating} />
                      </div>
                      {r.content && (
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.content}</p>
                      )}
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
