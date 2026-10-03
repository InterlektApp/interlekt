import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollCard } from "@/components/enroll-card";
import { MoneyAmount } from "@/components/money-amount";
import { StarRating } from "@/components/star-rating";
import { VerificationBadge } from "@/components/verification-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCommunityDetail, MOCK_COURSES, MOCK_REVIEWS } from "@/lib/mocks";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = await params;
  const community = getCommunityDetail(slug);
  if (!community) notFound();

  const courses = MOCK_COURSES.filter((c) => c.community_id === community.id);
  const reviews = MOCK_REVIEWS.filter((r) => r.community_id === community.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div>
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 text-6xl font-bold text-blue-300">
              {community.title.charAt(0)}
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">{community.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <StarRating
                rating={community.rating}
                reviewCount={community.review_count}
                size="md"
              />
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {community.member_count.toLocaleString()} members
              </span>
              <MoneyAmount
                kobo={community.price_kobo}
                currency={community.currency}
                billingPeriod={community.billing_period}
              />
            </div>

            <p className="mt-4 leading-relaxed text-slate-700">{community.description}</p>

            {community.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {community.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Creator */}
            <section className="mt-8 rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Your mentor</h2>
              <Link
                href={`/creators/${community.creator.user_id}`}
                className="mt-3 flex items-start gap-4"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white">
                  {community.creator.display_name.charAt(0)}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-900 hover:text-blue-600">
                    {community.creator.display_name}
                    <VerificationBadge status={community.creator.verification_status} />
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {community.creator.bio}
                  </p>
                  {community.creator.expertise.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {community.creator.expertise.map((e) => (
                        <span
                          key={e}
                          className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </section>

            {/* Curriculum */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">What you&apos;ll learn</h2>
              {courses.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Curriculum is being prepared — check back soon.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {courses.map((course, i) => (
                    <div key={course.id} className="rounded-xl border bg-white p-4">
                      <p className="flex items-center gap-2 font-medium text-slate-900">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                          {i + 1}
                        </span>
                        {course.title}
                      </p>
                      {course.description && (
                        <p className="mt-1 pl-9 text-sm text-slate-600">{course.description}</p>
                      )}
                      <p className="mt-1 flex items-center gap-1 pl-9 text-xs text-slate-400">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.lesson_count} lessons · {course.module_count} modules
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">
                What members say
              </h2>
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

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <EnrollCard community={community} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
