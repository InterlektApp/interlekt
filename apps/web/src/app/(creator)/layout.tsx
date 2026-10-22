"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreatorNav } from "@/components/creator-nav";
import { useMe } from "@/hooks/use-auth";

export default function CreatorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();
  const isCreator = Boolean(me?.roles.includes("creator"));

  useEffect(() => {
    if (isLoading) return;
    if (!me) {
      router.replace(`/creators/auth/login?next=${encodeURIComponent(pathname)}`);
    } else if (!isCreator) {
      router.replace("/dashboard");
    }
  }, [isCreator, isLoading, me, pathname, router]);

  if (isLoading || !me || !isCreator) {
    return <main className="p-8 text-sm text-slate-600" role="status">Checking your creator account…</main>;
  }

  return (
    <div className="studio-shell">
      <CreatorNav />
      <div className="studio-main">{children}</div>
    </div>
  );
}
