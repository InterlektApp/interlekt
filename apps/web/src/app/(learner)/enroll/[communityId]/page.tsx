"use client";

import Link from "next/link";
import { use } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, LogIn, ShieldCheck, UsersRound } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoneyAmount } from "@/components/money-amount";
import { useMe } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-communities";
import { enrollErrorMessage, useEnrollFree } from "@/hooks/use-enrollments";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { CommunityDetail } from "@/types/api";

interface EnrollPageProps {
  params: Promise<{ communityId: string }>;
}

export default function EnrollPage({ params }: EnrollPageProps) {
  // Enrollment links pass the community slug, which is also the detail API key.
  const { communityId: slug } = use(params);
  const { data: community, isLoading, isError, error } = useCommunity(slug);
  const { data: me } = useMe();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl animate-pulse px-4 py-8 sm:py-10" aria-label="Loading enrollment">
        <div className="h-8 w-2/3 rounded-lg bg-sky-100" />
        <div className="mt-6 h-80 rounded-3xl border border-sky-100 bg-sky-50" />
      </main>
    );
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10"><div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">Community details could not be loaded. {apiErrorMessage(error)}</div><Link className="mt-4 inline-block text-sm font-semibold text-sky-800 underline" href="/communities">Back to Explore</Link></main>;
  }

  if (!community) notFound();

  return <EnrollFlow community={community} signedIn={!!me} />;
}

function EnrollFlow({ community, signedIn }: { community: CommunityDetail; signedIn: boolean }) {
  const enroll = useEnrollFree();
  const error = enroll.error;
  const paidBlocked = error instanceof ApiError && error.code === "payment_required";
  const succeeded = enroll.isSuccess;

  const start = () => {
    enroll.reset();
    enroll.mutate(community.slug);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-7 sm:py-10">
      <Link href={`/communities/${community.slug}`} className="inline-flex min-h-9 items-center gap-2 rounded-lg text-sm font-medium text-sky-800 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{community.title}
      </Link>
      <header className="mt-5 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:p-8">
        <p className="label-eyebrow text-sky-800">Community enrollment</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">{community.isFree ? "Join this community" : "Complete your enrollment"}</h1>
        <p className="mt-2 text-sm text-slate-600">{community.title}</p>
      </header>

      <section className="mt-5 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-sky-100 bg-sky-50/70 px-5 py-4 sm:px-6">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><UsersRound className="h-4 w-4 text-cyan-700" aria-hidden="true" />Enrollment total</span>
          <MoneyAmount priceAmount={community.priceAmount} currency={community.priceCurrency} isFree={community.isFree} className="text-2xl font-semibold text-slate-950" />
        </div>

        <div className="p-5 sm:p-6">
          {succeeded ? (
            <div className="flex flex-col items-center rounded-2xl bg-emerald-50/70 px-5 py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-700"><CheckCircle2 className="h-8 w-8" aria-hidden="true" /></span>
              <p className="mt-4 text-lg font-semibold text-slate-950">You&apos;re in! Welcome aboard.</p>
              <Button className="mt-5" asChild><Link href={`/communities/${community.slug}/classroom`}>Go to classroom now</Link></Button>
            </div>
          ) : paidBlocked ? (
            <div className="flex flex-col items-center rounded-2xl bg-amber-50 px-5 py-8 text-center">
              <AlertCircle className="h-10 w-10 text-amber-700" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-950">Online payment isn&apos;t live yet</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{enrollErrorMessage(error)}</p>
              <Button variant="outline" className="mt-5 bg-white" asChild><Link href="/communities">Browse free communities</Link></Button>
            </div>
          ) : !signedIn ? (
            <div className="flex flex-col items-center rounded-2xl bg-sky-50/70 px-5 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-white text-sky-800"><LogIn className="h-6 w-6" aria-hidden="true" /></span>
              <p className="mt-3 font-semibold text-slate-950">Sign in to enroll</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">
                {community.isFree ? "Joining is free — you just need an account." : "You'll be able to complete enrollment right after signing in."}
              </p>
              <Button className="mt-5 w-full sm:w-auto" size="lg" asChild><Link href={`/auth/login?next=/enroll/${community.slug}`}>Sign in to continue</Link></Button>
            </div>
          ) : (
            <>
              <Button size="lg" className="w-full" onClick={start} disabled={enroll.isPending}>
                {enroll.isPending ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Enrolling…</span> : community.isFree ? "Join for free" : "Enroll now"}
              </Button>
              {error && !paidBlocked && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-center text-sm text-red-800">{enrollErrorMessage(error)}</p>}
              {!community.isFree && <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />Secured by Paystack · Card, transfer & USSD accepted</p>}
            </>
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        By enrolling you agree to the community guidelines and our terms of use.
      </p>
    </main>
  );
}
