"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
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
  "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-900 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "learner" },
  });
  const role = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      // Real app: POST /auth/register with display_name = first + last.
      await new Promise((r) => setTimeout(r, 800));
      console.log("register", data.email, data.role);
      router.push(data.role === "creator" ? "/studio" : "/dashboard");
    } catch {
      setServerError("Could not create your account. Try again.");
    }
  };

  return (
    <AuthShell side="right">
      <h1 className="text-[26px] font-medium tracking-tight text-slate-900">
        Create your own Account
      </h1>
      <p className="mt-3 text-[15px] text-slate-900">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-sky-700 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* Role: learner or creator */}
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="I want to">
          <button
            type="button"
            role="radio"
            aria-checked={role === "learner"}
            onClick={() => setValue("role", "learner")}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
              role === "learner"
                ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                : "border-slate-200 hover:border-slate-300",
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
              "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
              role === "creator"
                ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                : "border-slate-200 hover:border-slate-300",
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

        <p className="text-center text-[13px] text-slate-500">
          By signing up, you accept our{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            privacy policy
          </Link>
        </p>

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
