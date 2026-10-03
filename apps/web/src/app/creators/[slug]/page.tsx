import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { VerificationBadge } from "@/components/verification-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MOCK_COMMUNITIES, MOCK_CREATORS } from "@/lib/mocks";

interface CreatorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { slug } = await params;
  // Mock: slug is the user_id. Real app: GET /creators/{slug}.
  const creator = MOCK_CREATORS.find((c) => c.user_id === slug);
  if (!creator) notFound();

  const communities = MOCK_COMMUNITIES.filter(
    (c) => c.creator.display_name === creator.display_name,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white">
              {creator.display_name.charAt(0)}
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                {creator.display_name}
                <VerificationBadge status={creator.verification_status} size="md" />
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {creator.member_count.toLocaleString()} members across {creator.community_count}{" "}
                {creator.community_count === 1 ? "community" : "communities"}
              </p>
            </div>
          </div>

          {creator.bio && (
            <p className="mt-5 max-w-2xl leading-relaxed text-slate-700">{creator.bio}</p>
          )}

          {creator.expertise.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {creator.expertise.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">
          Communities by {creator.display_name.split(" ")[0]}
        </h2>
        {communities.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No published communities yet.</p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
