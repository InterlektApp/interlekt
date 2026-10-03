import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { MOCK_COMMUNITIES } from "@/lib/mocks";

export default function MyCommunitiesPage() {
  // Mock — real app: GET /enrollments/me.
  const enrolled = MOCK_COMMUNITIES.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">My communities</h1>
      <p className="mt-1 text-sm text-slate-500">
        {enrolled.length} {enrolled.length === 1 ? "community" : "communities"} enrolled
      </p>
      {enrolled.length === 0 ? (
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
          {enrolled.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
