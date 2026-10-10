import Link from "next/link";
import { Logo } from "@/components/logo";
import { BadgeCheck, Flag, LayoutDashboard, ShieldCheck, UsersRound, WalletCards } from "lucide-react";

const adminLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: UsersRound },
  { href: "/verification", label: "Verification", icon: BadgeCheck },
  { href: "/reports", label: "Reports", icon: Flag },
  { href: "/transactions", label: "Transactions", icon: WalletCards },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_#e7f8fc_0%,_transparent_42%),linear-gradient(180deg,_#f5fbfd_0%,_#f8fbfd_100%)] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <aside className="rounded-3xl bg-[#062f4f] p-4 text-white shadow-[0_14px_32px_-22px_rgba(3,35,59,0.65)] sm:p-5 lg:sticky lg:top-6 lg:h-fit">
          <div className="flex items-center gap-3 border-b border-white/15 px-2 pb-5"><span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1"><Logo className="justify-center" showWordmark={false} markClassName="h-8 w-12" /></span><div><p className="text-sm font-semibold tracking-wide">Interlekt</p><p className="mt-0.5 text-xs text-sky-200">Platform admin</p></div></div>
          <p className="mb-2 mt-5 px-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-sky-200/80">Workspace</p>
          <nav aria-label="Admin workspace" className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{adminLinks.map(({ href, label, icon: Icon }) => { const active = href === "/transactions"; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${active ? "bg-[#c7f3fb] text-[#07334f] shadow-sm" : "text-sky-50 hover:bg-white/10 hover:text-white"}`}><Icon aria-hidden="true" className="h-[18px] w-[18px]" />{label}</Link>; })}</nav>
          <div className="mt-5 hidden rounded-2xl border border-white/15 bg-white/[0.06] p-3.5 lg:block"><p className="text-xs font-semibold text-white">Payments</p><p className="mt-1 text-xs leading-5 text-sky-100/75">Payment and payout ledger data are not exposed by the backend.</p></div>
        </aside>
        <div className="min-w-0 space-y-6 sm:space-y-7">
          <header className="flex flex-col gap-4 border-b border-sky-100 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6"><div className="max-w-2xl"><p className="label-eyebrow">Admin workspace / Finance</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Transactions</h1><p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">Transaction, payment, and payout records are unavailable because the backend does not expose a ledger endpoint.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Ledger unavailable</span></header>
          <section aria-label="Transaction totals" className="grid gap-3 sm:grid-cols-3">{[{ label: "Gross volume", detail: "Payments received" }, { label: "Platform fees", detail: "Fees earned" }, { label: "Payouts owed", detail: "Creator balance" }].map((item) => <article key={item.label} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_8px_24px_-22px_rgba(8,47,73,0.45)] sm:p-5"><p className="text-sm font-medium text-slate-600">{item.label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950" aria-label={`${item.label} unavailable`}>Unavailable</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p></article>)}</section>
          <section aria-labelledby="history-heading" className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_12px_32px_-26px_rgba(8,47,73,0.5)]"><div className="flex flex-col gap-3 border-b border-sky-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="label-eyebrow">Payment ledger</p><h2 id="history-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Transaction history</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-slate-600"><WalletCards aria-hidden="true" className="h-3.5 w-3.5 text-sky-800" />Ledger unavailable</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[660px] border-collapse text-left"><thead><tr className="border-b border-sky-100 bg-slate-50/70 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-6 py-3.5">Date</th><th scope="col" className="px-4 py-3.5">Payment</th><th scope="col" className="px-4 py-3.5">Gross</th><th scope="col" className="px-4 py-3.5">Platform fee</th><th scope="col" className="px-6 py-3.5">Payout status</th></tr></thead><tbody><tr><td colSpan={5} className="px-5 py-12 sm:py-16"><div className="mx-auto flex max-w-md flex-col items-center text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-sky-800 ring-1 ring-inset ring-cyan-100"><WalletCards aria-hidden="true" className="h-6 w-6" /></span><h3 className="mt-4 text-base font-semibold text-slate-900">Transaction history unavailable</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">The backend does not currently expose payment, transaction, or payout read endpoints. No totals or history are queried or inferred, and this page offers no payment or payout actions.</p></div></td></tr></tbody></table></div></section>
          <div className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm leading-6 text-slate-700"><ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-800" /><p>No payment or payout endpoint is available to this admin view; no payment or payout action is offered here.</p></div>
        </div>
      </div>
    </main>
  );
}
