"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, LayoutDashboard, UserRound, UsersRound } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/communities", label: "Explore", icon: Compass },
  { href: "/my-communities", label: "My Communities", icon: UsersRound },
  { href: "/classroom", label: "Classroom", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/communities") {
    return pathname === href || (pathname.startsWith("/communities/") && !pathname.includes("/classroom"));
  }
  if (href === "/classroom") {
    return pathname === href || pathname.includes("/classroom/") || pathname.endsWith("/classroom");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LearnerNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-3 py-2 sm:px-5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-3">
        <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 rounded-md px-1 py-1 font-display text-lg text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-800 text-white" aria-hidden="true"><BookOpen className="h-4 w-4" /></span>
          Interlekt
        </Link>
        <nav aria-label="Learner navigation" className="w-full overflow-x-auto md:w-auto">
          <ul className="flex min-w-max items-center gap-1 pb-0.5 md:gap-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 sm:text-sm ${active ? "bg-sky-100 text-sky-950" : "text-slate-600 hover:bg-sky-50 hover:text-sky-900"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
