"use client";

import Link from "next/link";
import { use } from "react";
import { AlertCircle, CheckCircle2, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoneyAmount } from "@/components/money-amount";
import { useMe } from "@/hooks/use-auth";
import { useCommunity } from "@/hooks/use-communities";
import { enrollErrorMessage, useEnrollFree } from "@/hooks/use-enrollments";
import { ApiError } from "@/lib/api/client";
import type { CommunityDetail } from "@/types/api";

interface EnrollPageProps {
  params: Promise<{ communityId: string }>;
}

export default function EnrollPage({ params }: EnrollPageProps) {
  // EnrollCard links /enroll/{slug}; older links may pass an id — the
  // detail hook falls back to mocks for either.
  const { communityId: slug } = use(params);
  const { data: community, isLoading } = useCommunity(slug);
  const { data: me } = useMe();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg animate-pulse px-4 py-10">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="mt-6 h-64 rounded-xl bg-slate-200" />
      </div>
    );
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
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm text-slate-500">
        <Link href={`/communities/${community.slug}`} className="hover:text-blue-600">
          {community.title}
        </Link>{" "}
        / Enroll
      </p>
      <h1 className="mt-1 font-display text-2xl tracking-tight text-slate-900 md:text-3xl">
        {community.isFree ? "Join this community" : "Complete your enrollment"}
      </h1>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">Total due</span>
          <MoneyAmount
            priceAmount={community.priceAmount}
            currency={community.priceCurrency}
            isFree={community.isFree}
            className="text-2xl"
          />
        </div>

        <div className="mt-6">
          {succeeded ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="mt-3 text-lg font-semibold text-slate-900">
                You&apos;re in! Welcome aboard.
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/communities/${community.slug}/classroom`}>
                  Go to classroom now
                </Link>
              </Button>
            </div>
          ) : paidBlocked ? (
            <div className="flex flex-col items-center py-6 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500" />
              <p className="mt-3 font-semibold text-slate-900">Online payment isn&apos;t live yet</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                {enrollErrorMessage(error)}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/communities">Browse free communities</Link>
              </Button>
            </div>
          ) : !signedIn ? (
            <div className="flex flex-col items-center py-6 text-center">
              <LogIn className="h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-900">Sign in to enroll</p>
              <p className="mt-1 text-sm text-slate-500">
                {community.isFree
                  ? "Joining is free — you just need an account."
                  : "You'll be able to complete enrollment right after signing in."}
              </p>
              <Button className="mt-4 w-full" size="lg" asChild>
                <Link href={`/auth/login?next=/enroll/${community.slug}`}>Sign in to continue</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="lg"
                className="w-full"
                onClick={start}
                disabled={enroll.isPending}
              >
                {enroll.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enrolling…
                  </span>
                ) : community.isFree ? (
                  "Join for free"
                ) : (
                  "Enroll now"
                )}
              </Button>
              {error && !paidBlocked && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                  {enrollErrorMessage(error)}
                </p>
              )}
              {!community.isFree && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured by Paystack · Card, transfer & USSD accepted
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        By enrolling you agree to the community guidelines and our terms of use.
      </p>
    </div>
  );
}
