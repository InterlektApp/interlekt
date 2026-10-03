import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Interlekt home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <Link
            href="/communities"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Explore
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            My learning
          </Link>
          <Link
            href="/studio"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Teach
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="press" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" className="press" asChild>
            <Link href="/auth/register">Sign up free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
