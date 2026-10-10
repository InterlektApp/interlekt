import Link from "next/link";
import { ArrowLeft, BookOpen, ImagePlus, Tag, Type, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const setupDetails = [
  { icon: Type, label: "A clear title and description" },
  { icon: Tag, label: "Up to five categories" },
  { icon: ImagePlus, label: "A cover image" },
  { icon: Wallet, label: "Free or one-time NGN pricing" },
];

export default function NewCommunityPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href="/studio"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to studio
      </Link>

      <section className="mt-5 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)]">
        <div className="grid lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-6 sm:p-9 lg:p-11">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-900">
              <BookOpen aria-hidden="true" className="h-6 w-6" />
            </div>
            <p className="label-eyebrow mt-6">Creator studio / communities</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              New community
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              The community setup flow is not available yet. When it is ready, you&apos;ll be able to add a title, description, categories, cover image, and choose free or one-time pricing in NGN.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-950">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-600" />
              Setup tools are in progress
            </div>
            <div className="mt-8">
              <Button asChild>
                <Link href="/studio">
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to studio
                </Link>
              </Button>
            </div>
          </div>

          <aside className="border-t border-sky-100 bg-gradient-to-br from-sky-50 via-[#f5fbfd] to-cyan-50/70 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
            <p className="label-eyebrow">Community setup</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">A home for your learning community</h2>
            <ul className="mt-6 space-y-3">
              {setupDetails.map(({ icon: Icon, label }, index) => (
                <li key={label} className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white/90 p-3.5 text-sm text-slate-700">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-900">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{label}</span>
                  <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-sky-800">0{index + 1}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              This overview is informational; community creation is not enabled on this page yet.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
