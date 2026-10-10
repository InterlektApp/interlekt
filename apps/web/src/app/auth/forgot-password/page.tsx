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
    <AuthShell side="center">
      <h1 className="text-center text-[26px] font-semibold tracking-[-0.035em] text-[#092d49] sm:text-[28px]">
        Forgot your password?
      </h1>
      {sent ? (
        <>
          <p role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-[15px] leading-relaxed text-[#19394f]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
            If that email is registered, a reset link is on its way. Check your
            inbox (and spam folder).
          </p>
          <Link
            href="/auth/login"
            className="press mt-6 block h-[52px] w-full rounded-full bg-[#073653] text-center text-[15px] font-semibold leading-[52px] text-white shadow-sm transition-colors hover:bg-[#0b496f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
          >
            Back to login
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 text-center text-[15px] leading-6 text-slate-600">
            Enter your account email and we&apos;ll send you a reset link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email address*"
                aria-label="Email address"
                {...register("email")}
                className="h-[52px] w-full rounded-xl border border-[#c9d7e1] bg-white px-4 text-[15px] text-[#102f46] placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            {serverError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{serverError}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="press mx-auto h-[52px] w-full max-w-[476px] rounded-full bg-[#073653] text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0b496f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
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
