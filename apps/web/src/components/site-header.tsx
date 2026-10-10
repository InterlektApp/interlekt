"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { useMe } from "@/hooks/use-auth";

const NAV_ITEMS = [
  { label: "Features", href: "/#how-it-works", dropdown: true },
  { label: "About", href: "/#creators" },
  { label: "Communities", href: "/communities" },
];

export function SiteHeader() {
  const { data: user, isLoading } = useMe();
  const isCreator = user?.roles.includes("creator") ?? false;

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-4 px-5 md:h-[116px] md:px-8">
        <Link href="/" aria-label="Interlekt home" className="shrink-0">
          <Logo showWordmark={false} markClassName="h-[48px] w-[76px] md:h-[78px] md:w-[124px]" />
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-[#f1fafd] p-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map(({ label, href, dropdown }) => (
            <Link key={label} href={href} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-[#073451]">
              {label}{dropdown && <ArrowDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-5">
          {isLoading ? (
            <span aria-hidden="true" className="h-10 w-28 rounded-xl bg-sky-50" />
          ) : user ? (
            <Link
              href={isCreator ? "/studio" : "/dashboard"}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#073653] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0b496f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 md:min-h-11 md:px-5"
            >
              {isCreator ? "Creator Studio" : "My dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-sky-800">Log in</Link>
              <Link href="/auth/register" className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#164a63] px-4 text-sm font-medium text-[#123b53] transition-colors hover:bg-[#f0f9fc] md:min-h-11 md:px-5">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
