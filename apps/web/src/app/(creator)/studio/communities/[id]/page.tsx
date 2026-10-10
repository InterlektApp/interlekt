"use client";

import Link from "next/link";
import { use } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, BookOpen, Settings, Users, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { MoneyAmount } from "@/components/money-amount";
import { useMyCommunities } from "@/hooks/use-communities";
import { ApiError, post } from "@/lib/api/client";
import type { CommunityDetail } from "@/types/api";

interface ManagePageProps {
  params: Promise<{ id: string }>;
}

export default function ManageCommunityPage({ params }: ManagePageProps) {
  const { id } = use(params);
  // Matches by id or slug — manage links use the list item's id.
  const { data: mine = [], isLoading } = useMyCommunities();
  const community = mine.find((c) => c.id === id || c.slug === id);
  const queryClient = useQueryClient();
  const togglePublish = useMutation({
    mutationFn: () => post<CommunityDetail>(
      `/communities/${encodeURIComponent(community!.slug)}/${community!.isPublished ? "unpublish" : "publish"}`,
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });

  if (isLoading) {
    return (
      <main aria-busy="true" aria-label="Loading community" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-7 w-36 animate-pulse rounded-lg bg-sky-100" />
        <div className="mt-5 h-52 animate-pulse rounded-3xl border border-sky-100 bg-sky-50" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-sky-50" />
          <div className="h-28 animate-pulse rounded-2xl bg-sky-50" />
        </div>
      </main>
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/studio">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Studio
        </Link>
      </Button>

      <section className="mt-4 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/90 via-white to-cyan-50/50 p-6 shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="label-eyebrow">Community workspace</p>
            <h1 className="mt-2 break-words font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {community.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800">
                <MoneyAmount
                  priceAmount={community.priceAmount}
                  currency={community.priceCurrency}
                  isFree={community.isFree}
                />
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${community.isPublished ? "border border-emerald-200 bg-emerald-50 text-emerald-900" : "border border-amber-200 bg-amber-50 text-amber-950"}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${community.isPublished ? "bg-emerald-600" : "bg-amber-600"}`} />
                {community.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-900 shadow-sm">
            <BookOpen aria-hidden="true" className="h-7 w-7" />
          </div>
        </div>
      </section>

      <section aria-label="Community overview" className="mt-5 grid gap-4 sm:grid-cols-2">
        <StatCard label="Members" value={community.memberCount.toLocaleString()} className="min-h-28" />
        <StatCard label="Status" value={community.isPublished ? "Live" : "Draft"} className="min-h-28" />
      </section>

      <section className="mt-5 rounded-2xl border border-sky-100 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-950">Publishing</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {community.isPublished ? "Your community is visible to learners." : "Publish this community to make it visible to learners."}
            </p>
          </div>
          <Button type="button" disabled={togglePublish.isPending} onClick={() => togglePublish.mutate()}>
            {togglePublish.isPending ? "Saving…" : community.isPublished ? "Unpublish community" : "Publish community"}
          </Button>
        </div>
        {togglePublish.isError && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p>{togglePublish.error.message}</p>
            {togglePublish.error instanceof ApiError && togglePublish.error.code === "creator_profile_required" && (
              <p className="mt-2">Complete your creator profile first. <Link href="/onboarding" className="font-semibold underline">Go to creator onboarding</Link>.</p>
            )}
          </div>
        )}
      </section>

      <section className="mt-9" aria-labelledby="manage-tools-heading">
        <div className="mb-4">
          <p className="label-eyebrow">Manage</p>
          <h2 id="manage-tools-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Community tools
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-28 items-start gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_10px_30px_-28px_rgba(8,47,73,.5)] transition-colors hover:border-sky-300 hover:bg-sky-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-950">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-950">{label}</span>
                <span className="mt-1 block text-sm leading-5 text-slate-600">{desc}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-sky-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
