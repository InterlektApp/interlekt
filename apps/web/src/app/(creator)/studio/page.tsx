import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { CommunityCard } from "@/components/community-card";
import { MOCK_COMMUNITIES } from "@/lib/mocks";
import { formatMoney } from "@/lib/money";

export default function StudioPage() {
  // Mock creator dashboard — real app: GET /creator/dashboard.
  const totalMembers = MOCK_COMMUNITIES.reduce((n, c) => n + c.member_count, 0);
  const totalRevenueKobo = 1_875_000; // ₦18,750 attributed revenue (mock)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Creator studio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your communities, content, and earnings.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio/communities/new">
            <Plus className="h-4 w-4" />
            New community
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={totalMembers.toLocaleString()} />
        <StatCard
          label="Attributed revenue"
          value={formatMoney(totalRevenueKobo)}
          hint="Payouts coming soon"
        />
        <StatCard label="Communities" value={MOCK_COMMUNITIES.length} />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Your communities</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_COMMUNITIES.slice(0, 2).map((c) => (
          <CommunityCard key={c.id} community={c} />
        ))}
      </div>
    </div>
  );
}
