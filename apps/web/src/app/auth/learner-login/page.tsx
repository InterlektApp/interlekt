"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/public/auth-card";
import { SignInForm } from "@/components/public/sign-in-form";
import { Icon } from "@/components/ui/icon";

/**
 * A22 — learner sign-in.
 *
 * The same `POST /auth/login` as A5, framed for learners. If the account
 * turns out to be a creator, the role is asserted client-side from
 * `user.roles[]` and the visitor is pointed at Creator Studio.
 */
export default function LearnerLoginPage() {
  return (
    <Suspense fallback={<AuthCard microLabel="Learner sign in" title="Welcome back" />}>
      <LearnerLoginScreen />
    </Suspense>
  );
}

function LearnerLoginScreen() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  return (
    <AuthCard
      ambient
      microLabel="Learner sign in"
      title="Welcome back"
      lead="Sign in to continue learning"
    >
      <SignInForm role="learner" nextHref={next} />

      <div className="alert alert-info" style={{ marginTop: 24 }}>
        <Icon name="briefcase" size={18} />
        <div className="min-w-0">
          <p>
            Are you a creator?{" "}
            <Link
              href="/creators/auth/login"
              style={{ color: "var(--accent-ink)", fontWeight: 500, textDecoration: "underline" }}
            >
              Sign in to Creator Studio →
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center" style={{ marginTop: 28 }}>
        <p className="text-sm muted">
          New to Interlekt?{" "}
          <Link href="/auth/register" style={{ color: "var(--accent)" }}>
            Create an account
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
