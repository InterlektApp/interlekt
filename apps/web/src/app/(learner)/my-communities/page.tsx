"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeaveCommunity, useMyEnrollments } from "@/hooks/use-enrollments";
import { MoneyAmount } from "@/components/money-amount";

export default function MyCommunitiesPage() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();
  const leave = useLeaveCommunity();
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const active = enrollments.filter((e) => e.status === "active");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="label-eyebrow">Library</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900">
        My communities
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {active.length} {active.length === 1 ? "community" : "communities"} enrolled
      </p>
      {isLoading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-slate-200/70" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-12 text-center">
          <p className="font-medium text-slate-900">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Find a community worth learning from.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/communities">Explore communities</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <Link href={`/communities/${e.community.slug}`} className="block">
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100 font-display text-4xl text-blue-300">
                  {e.community.title.charAt(0)}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">
                    {e.community.title}
                  </h3>
                  <div className="mt-1">
                    <MoneyAmount
                      priceAmount={e.community.priceAmount}
                      currency={e.community.priceCurrency}
                      isFree={e.community.isFree}
                    />
                  </div>
                </div>
              </Link>
              <div className="flex gap-2 border-t p-3">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/communities/${e.community.slug}/classroom`}>Classroom</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={leave.isPending && leavingId === e.id}
                  onClick={() => {
                    setLeavingId(e.id);
                    leave.mutate(e.id, { onSettled: () => setLeavingId(null) });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Leave
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
