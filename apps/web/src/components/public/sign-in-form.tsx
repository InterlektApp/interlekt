"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordField } from "@/components/public/password-field";
import { TextField } from "@/components/public/text-field";
import { GoogleButtonDisabled } from "@/components/public/google-button-disabled";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage, apiErrorToFormErrors } from "@/lib/api/errors";

/**
 * The shared sign-in form behind A5, A22 and A23.
 *
 * All three post to the same `POST /auth/login`. The learner and creator
 * variants assert the role from `user.roles[]` in the response — the
 * backend has no role-scoped login endpoint, and none is invented here.
 */

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

/** Mirrors `lib/api/session.ts` — the refresh token's localStorage key. */
const REFRESH_TOKEN_KEY = "interlekt.refresh_token";

/**
 * "Keep me signed in" off ⇒ the refresh token is dropped from persistent
 * storage, so the session ends with the tab. The access token already
 * lives in memory only.
 */
function forgetRefreshToken(): void {
  try {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Private mode — the in-memory session is unaffected.
  }
}

export type SignInRole = "any" | "learner" | "creator";

export interface SignInFormProps {
  /** Which account type this page accepts. */
  role?: SignInRole;
  /** Where to land after signing in. Defaults to the role-aware home. */
  nextHref?: string;
}

export function SignInForm({ role = "any", nextHref }: SignInFormProps) {
  const router = useRouter();
  const login = useLogin();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = React.useState<"creator" | "learner" | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = (values: SignInValues) => {
    setServerError(null);
    setRoleMismatch(null);

    login.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (user) => {
          const isCreator = user.roles.includes("creator");

          if (role === "learner" && isCreator) {
            setRoleMismatch("creator");
            return;
          }
          if (role === "creator" && !isCreator) {
            setRoleMismatch("learner");
            return;
          }
          if (values.remember === false) forgetRefreshToken();

          router.replace(nextHref ?? (isCreator ? "/onboarding" : "/dashboard"));
        },
        onError: (error) => {
          const fieldErrors = apiErrorToFormErrors(error);
          if (fieldErrors) {
            if (fieldErrors.email) setError("email", { message: fieldErrors.email });
            if (fieldErrors.password) setError("password", { message: fieldErrors.password });
          }
          setServerError(
            error instanceof ApiError && error.status === 401
              ? "Those details don't match an account. Check your email and password, or reset your password."
              : apiErrorMessage(error),
          );
        },
      },
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col"
        style={{ gap: 18 }}
        noValidate
      >
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon="mail"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div
          className="flex flex-wrap items-center justify-between"
          style={{ gap: 16 }}
        >
          <label className="checkbox-row text-14" style={{ color: "var(--ink-2)", alignItems: "center" }}>
            <input type="checkbox" {...register("remember")} />
            Keep me signed in on this device
          </label>
          <Link href="/auth/forgot-password" className="text-14" style={{ color: "var(--accent)" }}>
            Forgot password?
          </Link>
        </div>

        {roleMismatch === "creator" ? (
          <div className="alert alert-info" role="status">
            <div className="min-w-0">
              <p>This is a creator account.{" "}
                <Link href="/creators/auth/login" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
                  Sign in to Creator Studio →
                </Link>
              </p>
            </div>
          </div>
        ) : null}

        {roleMismatch === "learner" ? (
          <div className="alert alert-info" role="status">
            <div className="min-w-0">
              <p>This is a learner account.{" "}
                <Link href="/auth/learner-login" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
                  Sign in as a learner →
                </Link>
              </p>
            </div>
          </div>
        ) : null}

        {serverError ? (
          <p role="alert" className="alert alert-danger">
            {serverError}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={{ height: 48, marginTop: 4 }}
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
}
