"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoneyAmount } from "@/components/money-amount";
import type { CommunityDetail, EnrollmentResponse } from "@/types/api";

interface EnrollCardProps {
  community: CommunityDetail;
  /** The viewer's enrollment for this community, if any (from /enrollments/mine). */
  enrollment?: EnrollmentResponse | null;
  /** True when a signed-in user owns this community. */
  isOwner?: boolean;
}

/**
 * The single most reused component in the product.
 * anonymous → sign-in CTA · not-enrolled → enroll CTA ·
 * already-enrolled → go-to-classroom · owner → manage CTA.
 */
export function EnrollCard({ community, enrollment, isOwner = false }: EnrollCardProps) {
  if (isOwner) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">You own this community</p>
        <Button className="mt-4 w-full" asChild>
          <Link href={`/studio/communities/${community.id}`}>Manage community</Link>
        </Button>
      </div>
    );
  }

  if (enrollment?.status === "active") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="flex items-center gap-2 font-medium text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          You&apos;re enrolled
        </p>
        <Button className="mt-4 w-full" asChild>
          <Link href={`/communities/${community.slug}/classroom`}>Go to classroom</Link>
        </Button>
        <Button variant="outline" className="mt-2 w-full" asChild>
          <Link href={`/communities/${community.slug}/feed`}>Join the discussion</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <MoneyAmount
          priceAmount={community.priceAmount}
          currency={community.priceCurrency}
          isFree={community.isFree}
          className="text-2xl"
        />
      </div>
      <Button className="mt-4 w-full" size="lg" asChild>
        <Link href={`/enroll/${community.slug}`}>
          {community.isFree ? "Join for free" : "Enroll now"}
        </Link>
      </Button>
      {!community.isFree && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Secure payment via Paystack
        </p>
      )}
      <ul className="mt-4 space-y-2 border-t pt-4 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Full classroom access
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Community discussions
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Direct access to the creator
        </li>
      </ul>
    </div>
  );
}
