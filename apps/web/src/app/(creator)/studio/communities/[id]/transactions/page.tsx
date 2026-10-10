import Link from "next/link";
import { ArrowLeft, CircleDollarSign, ReceiptText, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionsPage({ params }: TransactionsPageProps) {
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

      <section className="mt-5 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)]">
        <div className="grid lg:grid-cols-[.95fr_1.05fr]">
          <div className="bg-gradient-to-br from-sky-50 via-[#f4fbfd] to-cyan-50/80 p-6 sm:p-9 lg:p-11">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-950 shadow-sm">
              <Wallet aria-hidden="true" className="h-7 w-7" />
            </div>
            <p className="label-eyebrow mt-6">Community finances</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Transactions</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Transaction history and payout records are unavailable because the backend does not currently expose a community transactions or payouts endpoint.
            </p>
            <Button asChild className="mt-8">
              <Link href={`/studio/communities/${id}`}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Back to community
              </Link>
            </Button>
          </div>

          <div className="p-6 sm:p-9 lg:p-11">
            <p className="label-eyebrow">Earnings overview</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">No live payment data available</h2>
            <div role="status" className="mt-5 rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 px-5 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-900 shadow-sm">
                <ReceiptText aria-hidden="true" className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">Transactions cannot be loaded yet</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">No payment totals, transaction rows, or payout status are being fabricated or requested from an unsupported endpoint.</p>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-100 bg-white p-4">
              <CircleDollarSign aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-900" />
              <p className="text-xs leading-5 text-slate-500">This screen is read-only and does not modify payments, enrollment, or payout settings.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
