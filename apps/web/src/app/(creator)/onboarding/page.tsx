"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useMyCreatorProfile,
  useUpdateMyCreatorProfile,
} from "@/hooks/use-creator-onboarding";
import { apiErrorMessage } from "@/lib/api/errors";

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const profile = useMyCreatorProfile();
  const updateProfile = useUpdateMyCreatorProfile();
  const [expertiseInput, setExpertiseInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (profile.data?.expertise.length) router.replace("/studio");
  }, [profile.data, router]);

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setServerError(null);

    const expertise = [...new Set(
      expertiseInput
        .split(/[\n,]/)
        .map((tag) => tag.trim().replace(/\s+/g, " "))
        .filter(Boolean),
    )];

    if (expertise.length === 0) {
      setFormError("Add at least one expertise area to continue.");
      return;
    }
    if (expertise.length > 10) {
      setFormError("Add no more than 10 expertise areas.");
      return;
    }
    if (expertise.some((tag) => tag.length > 60)) {
      setFormError("Each expertise area must be 60 characters or fewer.");
      return;
    }

    updateProfile.mutate(
      { expertise },
      {
        onSuccess: () => router.replace("/studio"),
        onError: (error) => setServerError(apiErrorMessage(error)),
      },
    );
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-9">
        <p className="label-eyebrow">Creator setup · Step 1 of 1</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Complete your creator profile
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Tell learners what you teach by adding at least one area of expertise. This profile step is required before you can create a community.
        </p>

        {profile.isPending ? (
          <p role="status" aria-busy="true" className="mt-7 flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your profile…
          </p>
        ) : profile.isError ? (
          <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p role="alert" className="text-sm leading-6 text-amber-950">
              We couldn’t load your creator profile. Please retry before continuing. {apiErrorMessage(profile.error)}
            </p>
            <Button type="button" className="mt-3" onClick={() => void profile.refetch()}>
              Try again
            </Button>
          </div>
        ) : profile.data.expertise.length > 0 ? (
          <p role="status" className="mt-7 text-sm text-slate-600">
            Your creator profile is complete. Opening your studio…
          </p>
        ) : (
          <form onSubmit={submitProfile} className="mt-7 space-y-4">
            <div>
              <label htmlFor="expertise" className="mb-2 block text-sm font-medium text-slate-800">
                Areas of expertise
              </label>
              <textarea
                id="expertise"
                value={expertiseInput}
                onChange={(event) => setExpertiseInput(event.target.value)}
                rows={4}
                maxLength={700}
                placeholder="Enter one topic per line or separate topics with commas"
                aria-describedby="expertise-help"
                className="w-full rounded-xl border border-[#c9d7e1] bg-white px-4 py-3 text-[15px] text-[#102f46] placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              <p id="expertise-help" className="mt-2 text-xs leading-5 text-slate-500">
                Add 1–10 short topics. Each topic can be up to 60 characters.
              </p>
            </div>

            {(formError || serverError) && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
                {formError ?? serverError}
              </p>
            )}

            <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
              {updateProfile.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving profile…
                </span>
              ) : (
                "Save profile and continue"
              )}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
