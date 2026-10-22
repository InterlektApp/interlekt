"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCard } from "@/components/public/auth-card";
import { TextField } from "@/components/public/text-field";
import { Icon } from "@/components/ui/icon";
import { useForgotPassword } from "@/hooks/use-public-auth";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";

/**
 * A7 — request a password reset link.
 *
 * `POST /auth/forgot-password` answers 202 whether or not the address is
 * registered, so the page never claims that an account exists. The backend
 * does not publish a reset-link expiry, so none is quoted here.
 */

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const request = (email: string) => {
    setServerError(null);
    forgot.mutate(
      { email },
      {
        onSuccess: () => {
          setSentTo(email);
          setCooldown(RESEND_COOLDOWN_SECONDS);
        },
        onError: (error) => {
          // A network failure tells us nothing about the account either, so
          // the same neutral confirmation is shown.
          if (error instanceof ApiError && error.status === 0) {
            setSentTo(email);
            setCooldown(RESEND_COOLDOWN_SECONDS);
            return;
          }
          setServerError(apiErrorMessage(error));
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => request(values.email);

  return (
    <AuthCard
      title={sentTo ? "Check your email" : "Reset your password"}
      lead={
        sentTo
          ? "We've sent a reset link to your inbox."
          : "Enter your email and we'll send you a reset link."
      }
    >
      {sentTo ? (
        <>
          <div className="alert alert-success" style={{ marginBottom: 24 }}>
            <Icon name="checkCircle" size={18} />
            <div className="min-w-0">
              If an account exists for <strong style={{ color: "var(--ink)" }}>{sentTo}</strong>, we&apos;ve
              sent it a reset link. Open the email and follow the link to choose a new password.
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 12 }}>
            <a className="btn btn-secondary btn-block" href={`mailto:${sentTo}`} style={{ height: 48 }}>
              Open email app
            </a>
            <p className="text-sm muted" style={{ textAlign: "center" }}>
              Didn&apos;t get it?{" "}
              {cooldown > 0 ? (
                <span style={{ color: "var(--ink-3)" }}>
                  Resend available in {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => request(sentTo)}
                  disabled={forgot.isPending}
                  style={{ color: "var(--accent)" }}
                >
                  {forgot.isPending ? "Resending…" : "Resend"}
                </button>
              )}{" "}
              ·{" "}
              <button
                type="button"
                onClick={() => {
                  setSentTo(null);
                  setCooldown(0);
                }}
                style={{ color: "var(--accent)" }}
              >
                Try a different email
              </button>
            </p>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 20 }} noValidate>
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

          {serverError ? (
            <p role="alert" className="alert alert-danger">
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ height: 48 }}
            disabled={forgot.isPending}
          >
            {forgot.isPending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <div className="text-center" style={{ marginTop: 32 }}>
        <p className="text-sm muted">
          <Link
            href="/auth/login"
            style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Icon name="chevronLeft" size={14} />
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
