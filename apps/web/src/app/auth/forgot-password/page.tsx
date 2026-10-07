"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { post } from "@/lib/api/client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setServerError(null);
    try {
      // 202 either way — the backend never confirms whether the email exists.
      await post("/auth/forgot-password", { email: data.email });
      setSent(true);
    } catch {
      // Offline: still show the confirmation (same as the server would).
      setSent(true);
    }
  };

  return (
    <AuthShell side="left">
      <h1 className="text-[26px] font-medium tracking-tight text-slate-900">
        Reset your password
      </h1>
      {sent ? (
        <>
          <p className="mt-3 flex items-start gap-2 text-[15px] leading-relaxed text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            If that email is registered, a reset link is on its way. Check your
            inbox (and spam folder).
          </p>
          <Link
            href="/auth/login"
            className="mt-6 block h-12 w-full rounded-full bg-[#0a2f4f] text-center text-[15px] font-medium leading-[3rem] text-white transition-colors hover:bg-[#134a75]"
          >
            Back to login
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 text-[15px] text-slate-600">
            Enter your account email and we&apos;ll send you a reset link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email address*"
                aria-label="Email address"
                {...register("email")}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            {serverError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="press h-12 w-full rounded-full bg-[#0a2f4f] text-[15px] font-medium text-white transition-colors hover:bg-[#134a75] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
