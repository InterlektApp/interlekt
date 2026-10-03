import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { CommunityCard } from "@/components/community-card";
import { MOCK_COMMUNITIES } from "@/lib/mocks";

export default function LearnerDashboard() {
  // Mock — real app: GET /enrollments/me + progress summary.
  const enrolled = MOCK_COMMUNITIES.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Good evening</h1>
      <p className="mt-1 text-sm text-slate-500">Pick up where you left off.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Communities" value={enrolled.length} />
        <StatCard label="Lessons completed" value={2} hint="Keep the streak going" />
        <StatCard label="Learning streak" value="3 days" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Continue learning</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-communities">View all</Link>
        </Button>
      </div>
      {enrolled.length === 0 ? (
        <div className="mt-4 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">You haven&apos;t joined anything yet</p>
          <Button className="mt-4" asChild>
            <Link href="/communities">Explore communities</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrolled.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
