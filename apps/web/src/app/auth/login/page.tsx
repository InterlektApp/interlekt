"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { GoogleMark } from "@/components/google-mark";
import { useLogin } from "@/hooks/use-auth";
import { apiErrorMessage } from "@/lib/api/errors";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const inputClass =
  "h-[52px] w-full rounded-xl border border-[#c9d7e1] bg-white px-4 text-[15px] text-[#102f46] placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

function LoginFormInner() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => {
    setServerError(null);
    // POST /auth/login → tokens stored by session.ts, then route.
    login.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (user) =>
          router.replace(user.roles.includes("creator") ? "/onboarding" : "/dashboard"),
        onError: (err) => setServerError(apiErrorMessage(err)),
      },
    );
  };

  const continueWithGoogle = () => {
    // No backend OAuth endpoint yet — this stays honest: disabled with context.
    setServerError(
      "Google sign-in opens with the backend OAuth release. Please use email for now.",
    );
  };

  return (
    <>
      <h1 className="text-center text-[26px] font-semibold tracking-[-0.035em] text-[#092d49] sm:text-[28px]">
        Sign in to your account
      </h1>
      <p className="mt-3 text-center text-[15px] leading-6 text-slate-700">
        New to InterLEKT ?{" "}
        <Link href="/auth/register" className="font-medium text-sky-800 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          Sign up here
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
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
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#19394f] sm:text-[15px]">
            <input
              type="checkbox"
              {...register("remember")}
              className="h-4 w-4 rounded border-slate-300 accent-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="font-medium text-sky-800 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
            Forgot password
          </Link>
        </div>

        {serverError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="press h-[52px] w-full rounded-full bg-[#073653] text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0b496f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {login.isPending ? (
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
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold tracking-[0.12em] text-slate-500">OR</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={continueWithGoogle}
        className="press mx-auto flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full border border-[#cad9e3] bg-white text-[15px] font-medium text-[#17364c] transition-colors hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
      >
        <GoogleMark />
        Continue with Google
      </button>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell side="left">
      <LoginFormInner />
    </AuthShell>
  );
}
