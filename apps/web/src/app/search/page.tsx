import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { MOCK_COMMUNITIES } from "@/lib/mocks";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.toLowerCase().trim();

  const results = query
    ? MOCK_COMMUNITIES.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.creator.display_name.toLowerCase().includes(query),
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Search</h1>
      <form action="/search" method="get" className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search communities, topics, creators…"
            className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {query && (
        <p className="mt-4 text-sm text-slate-500">
          {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
        </p>
      )}

      {query && results.length > 0 && (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-12 text-center">
          <p className="font-medium text-slate-900">Nothing matched “{q}”</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/communities">Browse everything instead</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
