import Link from "next/link";
import { Logo } from "@/components/logo";
import { Activity, ArrowRight, BadgeCheck, Flag, LayoutDashboard, UsersRound, WalletCards } from "lucide-react";

const adminLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: UsersRound },
  { href: "/verification", label: "Verification", icon: BadgeCheck },
  { href: "/reports", label: "Reports", icon: Flag },
  { href: "/transactions", label: "Transactions", icon: WalletCards },
];
const metrics = [
  { label: "Users", detail: "All platform accounts", icon: UsersRound },
  { label: "Communities", detail: "Learning spaces", icon: Activity },
  { label: "Enrollments", detail: "Learner registrations", icon: BadgeCheck },
  { label: "Transactions", detail: "Payment activity", icon: WalletCards },
];
const tools = [
  { href: "/verification", label: "Creator verification", detail: "Review evidence and build trust", icon: BadgeCheck },
  { href: "/reports", label: "Report queue", detail: "Triage reports from the community", icon: Flag },
  { href: "/transactions", label: "Transactions", detail: "Review platform payment activity", icon: WalletCards },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_#e7f8fc_0%,_transparent_42%),linear-gradient(180deg,_#f5fbfd_0%,_#f8fbfd_100%)] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <aside className="rounded-3xl bg-[#062f4f] p-4 text-white shadow-[0_14px_32px_-22px_rgba(3,35,59,0.65)] sm:p-5 lg:sticky lg:top-6 lg:h-fit">
          <div className="flex items-center gap-3 border-b border-white/15 px-2 pb-5"><span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1"><Logo className="justify-center" showWordmark={false} markClassName="h-8 w-12" /></span><div><p className="text-sm font-semibold tracking-wide">Interlekt</p><p className="mt-0.5 text-xs text-sky-200">Platform admin</p></div></div>
          <p className="mb-2 mt-5 px-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-sky-200/80">Workspace</p>
          <nav aria-label="Admin workspace" className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {adminLinks.map(({ href, label, icon: Icon }) => { const active = href === "/overview"; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${active ? "bg-[#c7f3fb] text-[#07334f] shadow-sm" : "text-sky-50 hover:bg-white/10 hover:text-white"}`}><Icon aria-hidden="true" className="h-[18px] w-[18px]" />{label}</Link>; })}
          </nav>
          <div className="mt-5 hidden rounded-2xl border border-white/15 bg-white/[0.06] p-3.5 lg:block"><p className="text-xs font-semibold text-white">Operations console</p><p className="mt-1 text-xs leading-5 text-sky-100/75">A clear view of the learning community, all in one place.</p></div>
        </aside>
        <div className="min-w-0 space-y-6 sm:space-y-7">
          <header className="flex flex-col gap-4 border-b border-sky-100 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6"><div className="max-w-2xl"><p className="label-eyebrow">Admin workspace / Overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Platform overview</h1><p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">Platform health at a glance: users, communities, enrollments, and transactions.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Platform operations</span></header>
          <section aria-label="Platform totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, detail, icon: Icon }) => <article key={label} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_8px_24px_-22px_rgba(8,47,73,0.45)] sm:p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-600">{label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-100"><Icon aria-hidden="true" className="h-[18px] w-[18px]" /></span></div><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950" aria-label={`${label} total not available`}>—</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>)}
          </section>
          <section aria-labelledby="activity-heading" className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_12px_32px_-26px_rgba(8,47,73,0.5)]"><div className="flex flex-col gap-3 border-b border-sky-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="label-eyebrow">At a glance</p><h2 id="activity-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Platform activity</h2></div><span className="inline-flex w-fit items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-slate-600">Live reporting</span></div><div className="px-5 py-8 sm:px-6 sm:py-10"><div className="mx-auto flex max-w-lg flex-col items-center text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-sky-800 ring-1 ring-inset ring-cyan-100"><Activity aria-hidden="true" className="h-6 w-6" /></span><h3 className="mt-4 text-base font-semibold text-slate-900">Activity insights will appear here</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">No platform activity summary is available yet. This overview is ready for live account, enrollment, and payment reporting.</p></div></div></section>
          <section aria-labelledby="tools-heading"><div className="mb-3"><p className="label-eyebrow">Platform tools</p><h2 id="tools-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Continue to a workspace</h2></div><div className="grid gap-3 md:grid-cols-3">{tools.map(({ href, label, detail, icon: Icon }) => <Link key={href} href={href} className="group rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-100"><Icon aria-hidden="true" className="h-5 w-5" /></span><span className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-slate-900">{label}<ArrowRight aria-hidden="true" className="h-4 w-4 text-sky-700 transition-transform group-hover:translate-x-0.5" /></span><span className="mt-1 block text-sm leading-5 text-slate-600">{detail}</span></Link>)}</div></section>
        </div>
      </div>
    </main>
  );
}
