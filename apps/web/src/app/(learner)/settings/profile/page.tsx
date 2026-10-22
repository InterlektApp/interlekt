"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { SettingsSidebar } from "@/components/learner/settings-shell";
import { api, get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import type { ProfileResponse } from "@/types/api";

/**
 * B19 — edit profile.
 *
 * `PATCH /users/me` accepts exactly three fields: displayName, avatarUrl and
 * bio. Username, location, pronouns and a cover photo have no field on
 * `ProfileResponse`, so they are rendered disabled and each one names the
 * missing field in its tooltip. The avatar is uploaded with
 * `POST /uploads/images` and persisted with the rest of the form.
 */

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

interface UploadImageResponse {
  url: string;
  publicId: string;
  resourceType: string;
}

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Your name must be at least 2 characters")
    .max(120, "Your name must be under 120 characters"),
  bio: z.string().max(2000, "Your bio must be under 2000 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const MISSING_FIELD_TITLE = {
  username: "Not available yet — ProfileResponse has no username field",
  location: "Not available yet — ProfileResponse has no location field",
  pronouns: "Not available yet — ProfileResponse has no pronouns field",
  cover: "Not available yet — ProfileResponse has no coverUrl field",
};

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const profileQuery = useQuery({
    queryKey: qk.users.me(),
    queryFn: () => get<ProfileResponse>("/users/me"),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", bio: "" },
  });

  const profile = profileQuery.data ?? null;

  useEffect(() => {
    if (profile) {
      reset({ displayName: profile.displayName, bio: profile.bio ?? "" });
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile, reset]);

  const bio = watch("bio") ?? "";

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      return api<UploadImageResponse>("/uploads/images", { method: "POST", body });
    },
    onSuccess: (data) => {
      setAvatarUrl(data.url);
      setUploadError(null);
    },
    onError: (error) => setUploadError(apiErrorMessage(error)),
  });

  const save = useMutation({
    mutationFn: (values: ProfileForm) =>
      api<ProfileResponse>("/users/me", {
        method: "PATCH",
        body: { displayName: values.displayName, bio: values.bio || null, avatarUrl },
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(qk.users.me(), data);
      setSaved(true);
    },
  });

  const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("That image is larger than 4 MB. Please choose a smaller file.");
      return;
    }
    setUploadError(null);
    upload.mutate(file);
  };

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="h1" style={{ marginBottom: 6 }}>
          Settings
        </h1>
        <p className="text-sm muted" style={{ margin: 0 }}>
          Manage your profile, account, and preferences.
        </p>
      </div>

      <div className="settings-shell">
        <SettingsSidebar active="profile" />

        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h2 className="h2" style={{ marginBottom: 6 }}>
              Edit profile
            </h2>
            <p className="text-sm muted" style={{ margin: 0 }}>
              This is how you&apos;ll appear to other learners and creators on Interlekt.
            </p>
          </div>

          {profileQuery.isError ? (
            <div style={{ marginTop: 24 }}>
              <Alert variant="danger" icon="alertCircle" title="Your profile could not be loaded">
                <p style={{ marginBottom: 12 }}>{apiErrorMessage(profileQuery.error)}</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => void profileQuery.refetch()}
                >
                  Try again
                </button>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleSubmit((values) => save.mutate(values))}>
              {/* ============== PROFILE PHOTO ============== */}
              <section className="settings-section">
                <h3 className="settings-section-title">Profile photo</h3>
                <p className="text-sm muted" style={{ margin: "0 0 20px" }}>
                  Recommended 400×400px. PNG, JPG, or WebP up to 4 MB.
                </p>
                <div className="flex flex-wrap items-center" style={{ gap: 20 }}>
                  <Avatar name={watch("displayName") || "You"} src={avatarUrl} size="xl" />
                  <div className="flex flex-wrap" style={{ gap: 8 }}>
                    <input
                      ref={fileInputRef}
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="sr-only"
                      onChange={onPickFile}
                    />
                    <label htmlFor="avatar-upload" className="btn btn-secondary">
                      <Icon name="upload" size={14} />
                      {upload.isPending ? "Uploading…" : "Upload new photo"}
                    </label>
                    {avatarUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setAvatarUrl(null)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
                {uploadError ? (
                  <p role="alert" className="field-error" style={{ marginTop: 8 }}>
                    {uploadError}
                  </p>
                ) : null}
              </section>

              {/* ============== COVER PHOTO ============== */}
              <section className="settings-section">
                <h3 className="settings-section-title">Cover photo</h3>
                <p className="text-sm muted" style={{ margin: "0 0 20px" }}>
                  Recommended 1600×500px. Shown at the top of your public profile.
                </p>
                <div
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r-lg)",
                    overflow: "hidden",
                    background: "var(--paper-2)",
                  }}
                >
                  <div style={{ aspectRatio: "16 / 5" }} />
                </div>
                <div className="flex" style={{ gap: 8, marginTop: 16 }}>
                  <span
                    className="btn btn-secondary"
                    aria-disabled="true"
                    title={MISSING_FIELD_TITLE.cover}
                    style={{ opacity: 0.45, cursor: "not-allowed" }}
                  >
                    <Icon name="upload" size={14} />
                    Upload new cover
                  </span>
                  <span
                    className="btn btn-ghost"
                    aria-disabled="true"
                    title={MISSING_FIELD_TITLE.cover}
                    style={{ opacity: 0.45, cursor: "not-allowed" }}
                  >
                    Remove
                  </span>
                </div>
              </section>

              {/* ============== BASIC INFO ============== */}
              <section className="settings-section">
                <div className="flex flex-col" style={{ gap: 24 }}>
                  <Field
                    label="Display name"
                    htmlFor="display-name"
                    error={errors.displayName?.message}
                    help="Public profile name — shown next to your avatar on posts and comments."
                  >
                    <Input
                      id="display-name"
                      type="text"
                      placeholder="Your name as it appears on Interlekt"
                      {...register("displayName")}
                    />
                  </Field>

                  <Field
                    label="Username"
                    htmlFor="username"
                    help="Your profile URL is built from your display name until usernames ship."
                  >
                    <div className="input-group">
                      <span className="prefix tnum">@</span>
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        disabled
                        title={MISSING_FIELD_TITLE.username}
                        style={{ borderRadius: "0 var(--r-md) var(--r-md) 0", opacity: 0.6 }}
                      />
                    </div>
                  </Field>

                  <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
                    <Textarea
                      id="bio"
                      rows={5}
                      placeholder="A short bio shown on your public profile"
                      {...register("bio")}
                    />
                    <div
                      className="field-help flex items-center justify-between"
                      style={{ gap: 12 }}
                    >
                      <span>Up to 2000 characters shown on your profile.</span>
                      <span className="tnum">{bio.length} / 2000</span>
                    </div>
                  </Field>

                  <div className="grid grid-2" style={{ gap: 20 }}>
                    <Field label="Location" htmlFor="location" help="Shown on your public profile.">
                      <Input
                        id="location"
                        type="text"
                        placeholder="City, country"
                        disabled
                        title={MISSING_FIELD_TITLE.location}
                        style={{ opacity: 0.6 }}
                      />
                    </Field>
                    <Field label="Pronouns" htmlFor="pronouns" help="Displayed next to your name.">
                      <Select
                        id="pronouns"
                        defaultValue=""
                        disabled
                        title={MISSING_FIELD_TITLE.pronouns}
                        style={{ opacity: 0.6 }}
                      >
                        <option value="">Prefer not to say</option>
                        <option value="she/her">she/her</option>
                        <option value="he/him">he/him</option>
                        <option value="they/them">they/them</option>
                      </Select>
                    </Field>
                  </div>
                </div>
              </section>

              {/* ============== SAVE ============== */}
              {save.isError ? (
                <div style={{ marginBottom: 16 }}>
                  <Alert variant="danger" icon="alertCircle" title="Your profile could not be saved">
                    {apiErrorMessage(save.error)}
                  </Alert>
                </div>
              ) : null}

              <section style={{ paddingTop: 24 }}>
                <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
                  <Button type="submit" loading={save.isPending}>
                    Save changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (profile) {
                        reset({ displayName: profile.displayName, bio: profile.bio ?? "" });
                        setAvatarUrl(profile.avatarUrl);
                      }
                      setSaved(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {saved ? (
                    <span role="status" className="text-sm" style={{ color: "var(--success-ink)" }}>
                      Saved
                    </span>
                  ) : null}
                </div>
              </section>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
