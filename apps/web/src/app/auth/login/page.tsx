"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { GoogleMark } from "@/components/google-mark";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const inputClass =
  "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      // Real app: POST /auth/login (cookie set by server), then router.push(next).
      await new Promise((r) => setTimeout(r, 800));
      console.log("login", data.email, data.remember ? "(remember me)" : "");
      router.push(next);
    } catch {
      setServerError("Could not sign you in. Check your connection and try again.");
    }
  };

  const continueWithGoogle = async () => {
    setGoogleBusy(true);
    try {
      // Real app: redirect to GET /auth/oauth/google (server starts the OAuth
      // flow with NEXT_PUBLIC_GOOGLE_CLIENT_ID). Mock: brief pause, then home.
      await new Promise((r) => setTimeout(r, 900));
      router.push(next);
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-[26px] font-medium tracking-tight text-slate-900">
        Sign in to your account
      </h1>
      <p className="mt-3 text-[15px] text-slate-900">
        New to InterLEKT ?{" "}
        <Link href="/auth/register" className="font-normal text-sky-700 hover:underline">
          Sign up here
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <input
            type="email"
            autoComplete="email"
            placeholder="Email address*"
            aria-label="Email address"
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password*"
            aria-label="Password"
            {...register("password")}
            className={inputClass}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-[15px]">
          <label className="inline-flex cursor-pointer items-center gap-2 text-slate-900">
            <input
              type="checkbox"
              {...register("remember")}
              className="h-4 w-4 rounded border-slate-300 accent-sky-700"
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-sky-800 hover:underline">
            Forgot password
          </Link>
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
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-sm text-slate-900">OR</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>

      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={googleBusy}
        className="press mx-auto flex h-11 w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-[15px] text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
      >
        {googleBusy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleMark />
        )}
        Continue with Google
      </button>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell side="left">
      <Suspense>
        <LoginFormInner />
      </Suspense>
    </AuthShell>
  );
}
