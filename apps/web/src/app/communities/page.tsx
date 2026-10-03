import Link from "next/link";
import { Briefcase, Code2, Megaphone, Palette, Rocket, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { PageNav } from "@/components/page-nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MOCK_CATEGORIES, MOCK_COMMUNITIES } from "@/lib/mocks";

const PAGE_SIZE = 20;

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  code: Code2,
  briefcase: Briefcase,
  palette: Palette,
  megaphone: Megaphone,
  wallet: Wallet,
  rocket: Rocket,
};

interface ExplorePageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase();
  const category = params.category ?? "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  // Mock filtering — the real page calls GET /communities with the same params.
  let filtered = MOCK_COMMUNITIES;
  if (category !== "all") {
    filtered = filtered.filter((c) => c.category_id === category);
  }
  if (q) {
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.creator.display_name.toLowerCase().includes(q),
    );
  }

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="label-eyebrow">Explore</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900 md:text-4xl">
          Find your community
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Learning communities led by people worth learning from — verified,
          reviewed, and priced in naira.
        </p>

        {/* Search */}
        <form action="/communities" method="get" className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search by topic, skill, or creator…"
              className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button type="submit" size="lg">
            Search
          </Button>
        </form>

        {/* Category filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/communities"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            All
          </Link>
          {MOCK_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.icon ?? ""] ?? Search;
            return (
              <Link
                key={c.id}
                href={`/communities?category=${c.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.name}
              </Link>
            );
          })}
        </div>

        {/* Results */}
        {items.length === 0 ? (
          <div className="mt-12 rounded-xl border bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-900">No communities found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or browse another category.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
            <PageNav page={page} pages={pages} total={total} baseHref="/communities" />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
