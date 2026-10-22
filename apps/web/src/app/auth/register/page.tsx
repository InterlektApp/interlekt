"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthCard } from "@/components/public/auth-card";
import { PasswordField } from "@/components/public/password-field";
import { PasswordStrength } from "@/components/public/password-strength";
import { TextField } from "@/components/public/text-field";
import { GoogleButtonDisabled } from "@/components/public/google-button-disabled";
import { Icon } from "@/components/ui/icon";
import { useRegister } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage, apiErrorToFormErrors } from "@/lib/api/errors";

/**
 * A6 — create an account.
 *
 * `POST /auth/register` takes `{ email, password, displayName, role }`. The
 * role chooser maps straight onto that field. There is no email-verification
 * step in the product, so registration lands the learner on the dashboard
 * and the creator on the onboarding flow.
 */

const registerSchema = z.object({
  displayName: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
  terms: z.boolean().refine((accepted) => accepted, {
    message: "Please accept the terms to continue",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<"learner" | "creator">("learner");

  const {
    register: bind,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
    mode: "onBlur",
  });

  const password = watch("password") ?? "";

  const onSubmit = (values: RegisterValues) => {
    setServerError(null);
    register.mutate(
      {
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        role: role,
      },
      {
        onSuccess: (user) => {
          router.replace(user.roles.includes("creator") ? "/onboarding" : "/dashboard");
        },
        onError: (error) => {
          const fieldErrors = apiErrorToFormErrors(error);
          if (fieldErrors) {
            if (fieldErrors.email) setError("email", { message: fieldErrors.email });
            if (fieldErrors.password) setError("password", { message: fieldErrors.password });
            if (fieldErrors.display_name) {
              setError("displayName", { message: fieldErrors.display_name });
            }
          }
          setServerError(
            error instanceof ApiError && error.code === "email_taken"
              ? "That email address is already registered. Try signing in instead."
              : apiErrorMessage(error),
          );
        },
      },
    );
  };

  const roles = [
    {
      id: "learner" as const,
      title: "I'm a learner",
      text: "Discover and join communities.",
      icon: "user",
    },
    {
      id: "creator" as const,
      title: "I'm a creator",
      text: "Teach and earn in naira.",
      icon: "bookOpen",
    },
  ];

  return (
    <AuthCard title="Create your account" lead="Join learners and creators building real skills">
      {/* Step 1 — role */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
          <span className="text-xs" style={{ fontWeight: 500, color: "var(--ink-2)" }}>
            Step 1
          </span>
          <span className="text-xs muted">·</span>
          <span className="text-xs muted">Choose how you&apos;ll use Interlekt</span>
        </div>

        <div className="grid grid-2" style={{ gap: 12 }}>
          {roles.map((option) => {
            const active = role === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                aria-pressed={active}
                className="flex flex-col items-start text-left"
                style={{
                  gap: 12,
                  padding: 24,
                  background: active ? "var(--accent-soft)" : "var(--paper)",
                  border: active ? "2px solid var(--accent)" : "1px solid var(--line-2)",
                  borderRadius: "var(--r-lg)",
                  cursor: "pointer",
                }}
              >
                <Icon
                  name={option.icon}
                  size={24}
                  className={active ? "text-accent" : "text-ink-2"}
                />
                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "var(--fs-17)",
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {option.title}
                  </span>
                  <span className="text-xs" style={{ color: "var(--ink-3)" }}>
                    {option.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 — details */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col"
        style={{ gap: 18 }}
        noValidate
      >
        <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
          <span className="text-xs" style={{ fontWeight: 500, color: "var(--ink-2)" }}>
            Step 2
          </span>
          <span className="text-xs muted">·</span>
          <span className="text-xs muted">Tell us about you</span>
        </div>

        <TextField
          id="fullname"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Ada Okafor"
          error={errors.displayName?.message}
          {...bind("displayName")}
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon="mail"
          error={errors.email?.message}
          {...bind("email")}
        />

        <div>
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...bind("password")}
          />
          <PasswordStrength value={password} className="mt-2" />
        </div>

        <label className="checkbox-row text-14" style={{ color: "var(--ink-2)" }}>
          <input type="checkbox" {...bind("terms")} />
          <span style={{ lineHeight: 1.5 }}>
            I agree to the{" "}
            <Link href="/terms" style={{ color: "var(--accent)" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "var(--accent)" }}>
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms ? (
          <p className="field-error" role="alert">
            {errors.terms.message}
          </p>
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
          disabled={register.isPending}
        >
          {register.isPending ? "Creating your account…" : "Create account"}
        </button>
      </form>

      <div className="text-center" style={{ marginTop: 32 }}>
        <p className="text-sm muted">
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
