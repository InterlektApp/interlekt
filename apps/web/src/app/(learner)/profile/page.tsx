"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
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
      <div className="mx-auto max-w-2xl animate-pulse px-4 py-8">
        <div className="h-8 w-1/3 rounded bg-slate-200" />
        <div className="mt-6 h-64 rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-2xl tracking-tight text-slate-900">Profile</h1>
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-slate-900">You&apos;re signed out</p>
          <p className="mt-1 text-sm text-slate-500">Sign in to see and edit your profile.</p>
          <Button className="mt-4" asChild>
            <Link href="/auth/login?next=/profile">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="label-eyebrow">Account</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900">Profile</h1>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white">
            {profile.displayName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{profile.displayName}</p>
            <p className="text-sm capitalize text-slate-500">
              {me?.email ?? ""} · {profile.roles.join(", ")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="text-sm font-medium text-slate-700">
              Display name
            </label>
            <input
              id="displayName"
              {...register("displayName")}
              className="mt-1 h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="bio" className="text-sm font-medium text-slate-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              {...register("bio")}
              className="mt-1 w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
          </div>
          {update.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {apiErrorMessage(update.error)}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={update.isPending || !isDirty}>
              {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </form>

        <div className="mt-6 border-t pt-4">
          <Button variant="ghost" size="sm" onClick={signOut} disabled={logout.isPending}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
