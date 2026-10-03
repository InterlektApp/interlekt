"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoneyAmount } from "@/components/money-amount";
import { mockPaymentStatus, getCommunityDetail, MOCK_COMMUNITIES } from "@/lib/mocks";
import { usePaymentFlowStore } from "@/stores/payment-flow";
import { notFound } from "next/navigation";
import type { Community } from "@/types/api";

const MAX_POLLS = 20;
const POLL_INTERVAL_MS = 3000;

interface EnrollPageProps {
  params: Promise<{ communityId: string }>;
}

function lookupById(id: string) {
  // Mock lookup — the real page calls GET /communities/{id}.
  const item = MOCK_COMMUNITIES.find((c) => c.id === id);
  return item ? getCommunityDetail(item.slug) : null;
}

export default function EnrollPage({ params }: EnrollPageProps) {
  const { communityId } = use(params);
  const community = lookupById(communityId);
  if (!community) notFound();

  return <EnrollFlow community={community} />;
}

function EnrollFlow({ community }: { community: Community }) {
  const router = useRouter();
  const { phase, reference, error, pollCount, start, setPhase, incrementPoll, reset } =
    usePaymentFlowStore();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset flow state when the page mounts.
  useEffect(() => {
    reset();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFree = community.price_kobo === 0;

  const startFreeEnroll = () => {
    // Real app: POST /communities/{id}/enrollments, then route to classroom.
    setPhase("success");
  };

  const startPaidEnroll = () => {
    // Real app: POST /communities/{id}/payments → { reference, authorization_url }.
    // Then redirect to Paystack; Paystack returns to /enroll/{id}?reference=...
    const mockRef = `mock-ref-${Date.now()}`;
    start(mockRef, `https://paystack.mock/pay/${mockRef}`);
    setPhase("polling");
  };

  // Poll GET /payments/{reference}/status until settled.
  useEffect(() => {
    if (phase !== "polling" || !reference) return;

    const tick = () => {
      incrementPoll();
      const { status } = mockPaymentStatus(reference);
      if (status === "success") {
        if (timer.current) clearInterval(timer.current);
        setPhase("success");
      } else if (status === "failed") {
        if (timer.current) clearInterval(timer.current);
        setPhase("failed", "The payment did not go through. You were not charged.");
      } else if (usePaymentFlowStore.getState().pollCount >= MAX_POLLS) {
        // Webhook may still land later — tell the user to check back,
        // don't declare failure. This is the demo's safety net.
        if (timer.current) clearInterval(timer.current);
        setPhase("timeout");
      }
    };

    timer.current = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reference]);

  useEffect(() => {
    if (phase === "success") {
      const t = setTimeout(() => {
        router.push(`/communities/${community.slug}/classroom`);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase, router, community.slug]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm text-slate-500">
        <Link href={`/communities/${community.slug}`} className="hover:text-blue-600">
          {community.title}
        </Link>{" "}
        / Enroll
      </p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {isFree ? "Join this community" : "Complete your enrollment"}
      </h1>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">Total due</span>
          <MoneyAmount
            kobo={community.price_kobo}
            currency={community.currency}
            billingPeriod={community.billing_period}
            className="text-2xl"
          />
        </div>
        {community.billing_period === "monthly" && !isFree && (
          <p className="mt-1 text-right text-xs text-slate-500">
            Recurring monthly subscription · cancel anytime
          </p>
        )}

        <div className="mt-6">
          {phase === "idle" && (
            <>
              {isFree ? (
                <Button size="lg" className="w-full" onClick={startFreeEnroll}>
                  Join for free
                </Button>
              ) : (
                <Button size="lg" className="w-full" onClick={startPaidEnroll}>
                  Pay with Paystack
                </Button>
              )}
              {!isFree && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured by Paystack · Card, transfer & USSD accepted
                </p>
              )}
            </>
          )}

          {(phase === "initializing" || phase === "redirecting") && (
            <div className="flex flex-col items-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-3 text-sm text-slate-600">Preparing your payment…</p>
            </div>
          )}

          {phase === "polling" && (
            <div className="flex flex-col items-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-3 font-medium text-slate-900">Confirming your payment…</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                We&apos;re verifying with Paystack. Don&apos;t close this page — this
                usually takes a few seconds.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Check {pollCount} of {MAX_POLLS}
              </p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="mt-3 text-lg font-semibold text-slate-900">
                You&apos;re in! Welcome aboard.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Taking you to the classroom…
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/communities/${community.slug}/classroom`}>
                  Go to classroom now
                </Link>
              </Button>
            </div>
          )}

          {phase === "failed" && (
            <div className="flex flex-col items-center py-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="mt-3 font-semibold text-slate-900">Payment didn&apos;t go through</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">{error}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  reset();
                }}
              >
                Try again
              </Button>
            </div>
          )}

          {phase === "timeout" && (
            <div className="flex flex-col items-center py-6 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500" />
              <p className="mt-3 font-semibold text-slate-900">Still confirming…</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                This is taking longer than usual. Your payment may still succeed — check
                My Communities in a minute, or contact support with reference{" "}
                <code className="rounded bg-slate-100 px-1 text-xs">{reference}</code>.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/my-communities">Check My Communities</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        By enrolling you agree to the community guidelines and our terms of use.
      </p>
    </div>
  );
}
