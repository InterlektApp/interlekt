import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Learn",
    links: [
      { label: "Explore communities", href: "/communities" },
      { label: "Search", href: "/search" },
      { label: "My communities", href: "/my-communities" },
    ],
  },
  {
    heading: "Teach",
    links: [
      { label: "Creator studio", href: "/studio" },
      { label: "Become a creator", href: "/auth/register" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Log in", href: "/auth/login" },
      { label: "Sign up", href: "/auth/register" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Learning communities led by African creators. Learn. Connect. Grow.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="label-eyebrow">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Interlekt. Made for African learners and creators.</p>
          <p className="font-mono">NGN · Paystack secured</p>
        </div>
      </div>
    </footer>
  );
}
