"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { useRegister } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { apiErrorMessage, apiErrorToFormErrors } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["learner", "creator"]),
  });

type RegisterForm = z.infer<typeof registerSchema>;

const inputClass =
  "h-[52px] w-full rounded-xl border border-[#c9d7e1] bg-white px-4 text-[15px] text-[#102f46] placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "learner" },
  });
  const role = watch("role");

  const onSubmit = (data: RegisterForm) => {
    setServerError(null);
    // POST /auth/register with displayName = first + last.
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        displayName: `${data.first_name.trim()} ${data.last_name.trim()}`,
        role: data.role,
      },
      {
        onSuccess: (user) =>
          router.replace(user.roles.includes("creator") ? "/onboarding" : "/dashboard"),
        onError: (err) => {
          if (err instanceof ApiError && err.code === "email_taken") {
            setError("email", { message: "An account with this email already exists." });
            return;
          }
          const fieldErrors = apiErrorToFormErrors(err);
          if (fieldErrors) {
            for (const [field, message] of Object.entries(fieldErrors)) {
              setError(field as keyof RegisterForm, { message });
            }
            return;
          }
          setServerError(apiErrorMessage(err));
        },
      },
    );
  };

  return (
    <AuthShell side="right">
      <h1 className="text-center text-[26px] font-semibold tracking-[-0.035em] text-[#092d49] sm:text-[28px]">
        Create your own Account
      </h1>
      <p className="mt-3 text-center text-[15px] leading-6 text-slate-700">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-sky-800 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        {/* Role: learner or creator */}
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="I want to">
          <button
            type="button"
            role="radio"
            aria-checked={role === "learner"}
            onClick={() => setValue("role", "learner")}
            className={cn(
              "flex min-h-[66px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
              role === "learner"
                ? "border-sky-500 bg-[#eef9fd] ring-1 ring-sky-500"
                : "border-[#d6e1e8] bg-white hover:border-sky-300",
            )}
          >
            <GraduationCap className="h-5 w-5 text-sky-700" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Learner</span>
              <span className="block text-xs text-slate-500">Join & learn</span>
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={role === "creator"}
            onClick={() => setValue("role", "creator")}
            className={cn(
              "flex min-h-[66px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
              role === "creator"
                ? "border-sky-500 bg-[#eef9fd] ring-1 ring-sky-500"
                : "border-[#d6e1e8] bg-white hover:border-sky-300",
            )}
          >
            <Presentation className="h-5 w-5 text-sky-700" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Creator</span>
              <span className="block text-xs text-slate-500">Teach & earn</span>
            </span>
          </button>
        </div>

        <div>
          <input placeholder="First name" aria-label="First name" {...register("first_name")} className={inputClass} />
          {errors.first_name && (
            <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <input placeholder="Last name" aria-label="Last name" {...register("last_name")} className={inputClass} />
          {errors.last_name && (
            <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            aria-label="Email address"
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            aria-label="Password"
            {...register("password")}
            className={inputClass}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <p className="px-1 text-center text-[13px] leading-5 text-slate-600">
          By signing up, you accept our{" "}
            <Link href="/terms" className="text-sky-800 underline underline-offset-2 hover:text-sky-950 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
            terms
          </Link>{" "}
          and{" "}
            <Link href="/privacy" className="text-sky-800 underline underline-offset-2 hover:text-sky-950 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
            privacy policy
          </Link>
        </p>

        {serverError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="press h-[52px] w-full rounded-full bg-[#073653] text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0b496f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
