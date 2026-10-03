import Link from "next/link";
import { ArrowLeft, BookOpen, Settings, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { MOCK_COMMUNITIES } from "@/lib/mocks";
import { notFound } from "next/navigation";

interface ManagePageProps {
  params: Promise<{ id: string }>;
}

export default async function ManageCommunityPage({ params }: ManagePageProps) {
  const { id } = await params;
  const community = MOCK_COMMUNITIES.find((c) => c.id === id);
  if (!community) notFound();

  const links = [
    { href: `/studio/communities/${id}/edit`, icon: Settings, label: "Edit community", desc: "Title, description, pricing, access" },
    { href: `/studio/communities/${id}/course-builder`, icon: BookOpen, label: "Course builder", desc: "Courses, modules, lessons" },
    { href: `/studio/communities/${id}/members`, icon: Users, label: "Members", desc: `${community.member_count.toLocaleString()} enrolled` },
    { href: `/studio/communities/${id}/transactions`, icon: Wallet, label: "Transactions", desc: "Revenue and payouts" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/studio">
          <ArrowLeft className="h-4 w-4" />
          Studio
        </Link>
      </Button>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{community.title}</h1>
      <p className="mt-1 text-sm text-slate-500">Manage everything about this community.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Members" value={community.member_count.toLocaleString()} />
        <StatCard label="Rating" value={community.rating?.toFixed(1) ?? "—"} />
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
