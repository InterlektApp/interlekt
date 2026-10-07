"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, BookOpen, Settings, Users, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { MoneyAmount } from "@/components/money-amount";
import { useMyCommunities } from "@/hooks/use-communities";

interface ManagePageProps {
  params: Promise<{ id: string }>;
}

export default function ManageCommunityPage({ params }: ManagePageProps) {
  const { id } = use(params);
  // Matches by id or slug — manage links use the list item's id.
  const { data: mine = [], isLoading } = useMyCommunities();
  const community = mine.find((c) => c.id === id || c.slug === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-4 py-8">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="mt-6 h-40 rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!community) notFound();

  const links = [
    { href: `/studio/communities/${community.id}/edit`, icon: Settings, label: "Edit community", desc: "Title, description, pricing, access" },
    { href: `/studio/communities/${community.id}/course-builder`, icon: BookOpen, label: "Course builder", desc: "Courses, modules, lessons" },
    { href: `/studio/communities/${community.id}/members`, icon: Users, label: "Members", desc: `${community.memberCount.toLocaleString()} enrolled` },
    { href: `/studio/communities/${community.id}/transactions`, icon: Wallet, label: "Transactions", desc: "Revenue and payouts" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/studio">
          <ArrowLeft className="h-4 w-4" />
          Studio
        </Link>
      </Button>
      <h1 className="mt-2 font-display text-2xl tracking-tight text-slate-900">{community.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        <MoneyAmount
          priceAmount={community.priceAmount}
          currency={community.priceCurrency}
          isFree={community.isFree}
        />{" "}
        · {community.isPublished ? "Published" : "Draft"}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Members" value={community.memberCount.toLocaleString()} />
        <StatCard label="Status" value={community.isPublished ? "Live" : "Draft"} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <Icon className="h-6 w-6 text-blue-600" />
            <p className="mt-2 font-semibold text-slate-900">{label}</p>
            <p className="text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
