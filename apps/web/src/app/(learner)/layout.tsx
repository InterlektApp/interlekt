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
  const isEnrollmentPage = pathname.startsWith("/enroll/");

  useEffect(() => {
    if (isLoading) return;
    if (!me) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    } else if (isCreator && !isEnrollmentPage) {
      router.replace("/studio");
    }
  }, [isCreator, isEnrollmentPage, isLoading, me, pathname, router]);

  if (isLoading || !me || (isCreator && !isEnrollmentPage)) {
    return <main className="p-8 text-sm text-slate-600" role="status">Checking your learner account…</main>;
  }

  if (isCreator) return <>{children}</>;

  return <LearnerShell>{children}</LearnerShell>;
}
