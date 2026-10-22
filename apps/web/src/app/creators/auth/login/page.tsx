"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/public/auth-card";
import { SignInForm } from "@/components/public/sign-in-form";
import { Icon } from "@/components/ui/icon";

/**
 * A23 — creator sign-in.
 *
 * The same `POST /auth/login` as A5, framed for creators. The design's
 * `POST /api/creators/auth/login` endpoint does not exist, so the role is
 * asserted client-side from `user.roles[]` instead.
 */
export default function CreatorLoginPage() {
  return (
    <Suspense fallback={<AuthCard microLabel="Creator sign in" title="Welcome back, creator" />}>
      <CreatorLoginScreen />
    </Suspense>
  );
}

function CreatorLoginScreen() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  return (
    <AuthCard
      ambient
      microLabel="Creator sign in"
      title="Welcome back, creator"
      lead="Sign in to your Creator Studio"
    >
      <SignInForm role="creator" nextHref={next} />

      <div className="alert alert-info" style={{ marginTop: 24 }}>
        <Icon name="user" size={18} />
        <div className="min-w-0">
          <p>
            Not a creator?{" "}
            <Link
              href="/auth/learner-login"
              style={{ color: "var(--accent-ink)", fontWeight: 500, textDecoration: "underline" }}
            >
              Sign in as a learner →
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center" style={{ marginTop: 28 }}>
        <p className="text-sm muted">
          Want to become a creator?{" "}
          <Link href="/onboarding" style={{ color: "var(--accent)" }}>
            Apply here
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

function safeNext(value: string | null): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}
