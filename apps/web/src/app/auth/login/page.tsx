"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/public/auth-card";
import { SignInForm } from "@/components/public/sign-in-form";

/**
 * A5 — sign in.
 *
 * Posts to `POST /auth/login`. A `?next=` path is honoured so a visitor
 * interrupted by the enrolment flow lands back where they were.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCard title="Welcome back" lead="Sign in to continue learning" />}>
      <LoginScreen />
    </Suspense>
  );
}

function LoginScreen() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  return (
    <AuthCard title="Welcome back" lead="Sign in to continue learning">
      <SignInForm role="any" nextHref={next} />

      <div className="text-center" style={{ marginTop: 32 }}>
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

/** Only same-site paths are accepted as a post-login destination. */
function safeNext(value: string | null): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}
