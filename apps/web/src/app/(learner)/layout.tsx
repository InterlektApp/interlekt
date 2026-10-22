"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LearnerShell } from "@/components/learner/learner-shell";
import { useMe } from "@/hooks/use-auth";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();
  const isCreator = Boolean(me?.roles.includes("creator"));

  useEffect(() => {
    if (isLoading) return;
    if (!me) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    } else if (isCreator) {
      router.replace("/studio");
    }
  }, [isCreator, isLoading, me, pathname, router]);

  if (isLoading || !me || isCreator) {
    return <main className="p-8 text-sm text-slate-600" role="status">Checking your learner account…</main>;
  }

  return <LearnerShell>{children}</LearnerShell>;
}
