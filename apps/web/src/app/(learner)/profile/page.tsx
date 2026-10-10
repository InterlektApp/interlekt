"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/hooks/use-users";
import { apiErrorMessage } from "@/lib/api/errors";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(120),
  bio: z.string().max(2000).optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const logout = useLogout();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) {
      reset({ displayName: profile.displayName, bio: profile.bio ?? "" });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileForm) => {
    setSaved(false);
    update.mutate(
      { displayName: data.displayName, bio: data.bio || null },
      { onSuccess: () => setSaved(true) },
    );
  };

  const signOut = () => {
    logout.mutate(undefined, { onSettled: () => router.push("/") });
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl animate-pulse px-4 py-8 sm:py-10" aria-label="Loading profile">
        <div className="h-8 w-1/3 rounded-lg bg-sky-100" />
        <div className="mt-6 h-80 rounded-3xl border border-sky-100 bg-sky-50" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <p className="label-eyebrow">Account</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950">Profile</h1>
        <div className="mt-6 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 to-white px-6 py-12 text-center sm:px-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-white text-cyan-800"><UserRound className="h-7 w-7" aria-hidden="true" /></span>
          <p className="mt-4 font-semibold text-slate-950">You&apos;re signed out</p>
          <p className="mt-1 text-sm text-slate-600">Sign in to see and edit your profile.</p>
          <Button className="mt-5" asChild><Link href="/auth/login?next=/profile">Sign in</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header>
        <p className="label-eyebrow text-sky-800">Account</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Manage the details people see when they learn with you.</p>
      </header>

      <section className="mt-6 overflow-hidden rounded-3xl border border-sky-200 bg-sky-100/80 p-4 sm:p-6">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-sky-100 pb-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-500 to-sky-800 text-2xl font-bold text-white shadow-sm ring-1 ring-sky-200" aria-hidden="true">
              {profile.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-950">{profile.displayName}</p>
              <p className="mt-0.5 break-words text-sm text-slate-600">{me?.email ?? ""}</p>
              <p className="mt-1 text-xs capitalize text-sky-800">{profile.roles.join(", ")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label htmlFor="displayName" className="text-sm font-semibold text-slate-800">Display name</label>
              <input
                id="displayName"
                {...register("displayName")}
                className="mt-1.5 h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
              {errors.displayName && <p className="mt-1.5 text-xs font-medium text-red-700">{errors.displayName.message}</p>}
            </div>
            <div>
              <label htmlFor="bio" className="text-sm font-semibold text-slate-800">Bio</label>
              <textarea
                id="bio"
                rows={4}
                {...register("bio")}
                className="mt-1.5 w-full resize-y rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
              {errors.bio && <p className="mt-1.5 text-xs font-medium text-red-700">{errors.bio.message}</p>}
            </div>
            {update.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{apiErrorMessage(update.error)}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={update.isPending || !isDirty}>
                {update.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Save changes
              </Button>
              {saved && <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Saved</span>}
            </div>
          </form>

          <div className="mt-7 border-t border-sky-100 pt-4">
            <Button variant="ghost" size="sm" onClick={signOut} disabled={logout.isPending}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
