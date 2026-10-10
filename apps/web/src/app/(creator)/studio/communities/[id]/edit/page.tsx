import Link from "next/link";
import { ArrowLeft, ImagePlus, LockKeyhole, Settings, Tag, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditCommunityPageProps = {
  params: Promise<{ id: string }>;
};

const editAreas = [
  { icon: Type, label: "Title and description" },
  { icon: Tag, label: "Category" },
  { icon: ImagePlus, label: "Community image" },
  { icon: LockKeyhole, label: "Pricing and access rules" },
];

export default async function EditCommunityPage({ params }: EditCommunityPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={`/studio/communities/${id}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to community
      </Link>

      <section className="mt-5 grid overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] lg:grid-cols-[.9fr_1.1fr]">
        <div className="bg-gradient-to-br from-sky-50 via-[#f5fbfd] to-cyan-50/80 p-6 sm:p-9 lg:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-900 shadow-sm">
            <Settings aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="label-eyebrow mt-6">Community settings</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Edit community
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Editing controls are not available on this page yet. Community settings will cover the details, pricing, and access options for your learning space.
          </p>
          <Button asChild className="mt-7">
            <Link href={`/studio/communities/${id}`}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to community
            </Link>
          </Button>
        </div>

        <div className="p-6 sm:p-9 lg:p-10">
          <p className="label-eyebrow">Available settings</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">What you&apos;ll be able to manage</h2>
          <ul className="mt-5 divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white">
            {editAreas.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-900">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Pricing options include one-time or monthly access. No changes are made from this screen yet.
          </p>
        </div>
      </section>
    </main>
  );
}
