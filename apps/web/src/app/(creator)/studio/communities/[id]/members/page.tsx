"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { useMembers } from "@/hooks/use-enrollments";

interface MembersPageProps {
  params: Promise<{ id: string }>;
}

export default function MembersPage({ params }: MembersPageProps) {
  const { id } = use(params);
  const { data: mine = [] } = useMyCommunities();
  const community = mine.find((c) => c.id === id || c.slug === id);
  const { data } = useMembers(community?.slug ?? "");
  const members = community ? (data?.members ?? []) : [];
  const error = community ? data?.error : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href={community ? `/studio/communities/${community.id}` : "/studio"}>
          <ArrowLeft className="h-4 w-4" />
          {community ? community.title : "Studio"}
        </Link>
      </Button>
      <h1 className="mt-2 font-display text-2xl tracking-tight text-slate-900">Members</h1>
      <p className="mt-1 text-sm text-slate-500">
        {members.length} {members.length === 1 ? "member" : "members"} enrolled
      </p>

      {!community ? (
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">Community not found</p>
          <p className="mt-1 text-sm text-slate-500">
            Sign in with the creator account that owns this community.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/studio">Back to studio</Link>
          </Button>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">Couldn&apos;t load members</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">No members yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Share your community link to get your first enrollments.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y rounded-xl border bg-white">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {m.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{m.displayName}</p>
                <p className="text-xs capitalize text-slate-500">{m.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
