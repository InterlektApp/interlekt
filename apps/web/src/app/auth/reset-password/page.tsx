"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCard } from "@/components/public/auth-card";
import { PasswordField } from "@/components/public/password-field";
import { PasswordStrength } from "@/components/public/password-strength";
import { Icon } from "@/components/ui/icon";
import { useResetPassword } from "@/hooks/use-public-auth";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";

/**
 * A11 — set a new password from a reset link.
 *
 * `POST /auth/reset-password` takes `{ token, newPassword }`. The token
 * comes from the URL; the confirm field and the strength score are
 * client-side only.
 */

const schema = z
  .object({
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "The two passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthCard title="Set a new password" />}>
      <ResetPasswordScreen />
    </Suspense>
  );
}

function ResetPasswordScreen() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();
  const [done, setDone] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const newPassword = watch("newPassword") ?? "";

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    reset.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () => setDone(true),
        onError: (error) => {
          setServerError(
            error instanceof ApiError && (error.status === 400 || error.status === 422)
              ? "This reset link has expired or is no longer valid. Request a new one and try again."
              : apiErrorMessage(error),
          );
        },
      },
    );
  };

  if (!token) {
    return (
      <AuthCard
        title="Reset link missing"
        lead="This page needs a reset link from your email."
      >
        <div className="alert alert-warning" role="status">
          <Icon name="alertTriangle" size={18} />
          <div className="min-w-0">
            <p>Open the reset link in your email, or request a new one.</p>
          </div>
        </div>
        <Link className="btn btn-primary btn-block" href="/auth/forgot-password" style={{ height: 48 }}>
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Password reset" lead="Your password has been reset.">
        <div className="alert alert-success" style={{ marginBottom: 28 }}>
          <Icon name="checkCircle" size={24} />
          <div className="min-w-0">
            <p className="font-semibold" style={{ color: "var(--ink)" }}>
              Password reset
            </p>
            <p className="text-15" style={{ color: "var(--success-ink)", margin: 0 }}>
              Your password has been reset. Sign in with your new password.
            </p>
          </div>
        </div>
        <Link className="btn btn-primary btn-block" href="/auth/login" style={{ height: 48 }}>
          Sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      lead="Choose a strong password for your Interlekt account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: 18 }} noValidate>
        <div>
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
        </div>

        <PasswordStrength value={newPassword} />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {serverError ? (
          <p role="alert" className="alert alert-danger">
            {serverError}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={{ height: 48, marginTop: 4 }}
          disabled={reset.isPending}
        >
          {reset.isPending ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="text-xs muted" style={{ maxWidth: 360, margin: "24px auto 0", lineHeight: 1.5, textAlign: "center" }}>
        Use at least 8 characters with a mix of letters, numbers and symbols.
      </p>
    </AuthCard>
  );
}
