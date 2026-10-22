"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { SettingsSidebar } from "@/components/learner/settings-shell";
import { useMe } from "@/hooks/use-auth";
import { get } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import { formatMonthYear } from "@/lib/dates";
import type { ProfileResponse } from "@/types/api";

/**
 * B10 — the settings hub.
 *
 * The sidebar lists the settings areas that exist today. Profile and Account
 * are live routes; Notifications and Privacy are shown as disabled rows
 * because the backend has no preference endpoints yet, and each row names the
 * endpoint it is waiting on.
 */

export default function SettingsHubPage() {
  const { data: account } = useMe();
  const profileQuery = useQuery({
    queryKey: qk.users.me(),
    queryFn: () => get<ProfileResponse>("/users/me"),
    retry: false,
  });
  const profile = profileQuery.data ?? null;

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
        <SettingsSidebar />

        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h2 className="h2" style={{ marginBottom: 6 }}>
              Your account
            </h2>
            <p className="text-sm muted" style={{ margin: 0 }}>
              The details Interlekt holds about your account.
            </p>
          </div>

          {profileQuery.isError ? (
            <div style={{ marginTop: 24 }}>
              <Alert variant="danger" icon="alertCircle" title="Your account could not be loaded">
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
            <>
              <section className="settings-section">
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Display name</p>
                    <p className="settings-help">Shown next to your avatar on posts and comments.</p>
                  </div>
                  <Link href="/settings/profile" className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                </div>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Email address</p>
                    <p className="settings-help">Used to sign in and receive notifications.</p>
                  </div>
                  <span className="text-sm">{account?.email ?? "—"}</span>
                </div>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Member since</p>
                    <p className="settings-help">
                      {profile ? formatMonthYear(profile.createdAt) : "—"}
                    </p>
                  </div>
                  <span className="text-sm muted">
                    {profile ? profile.roles.join(", ") : "—"}
                  </span>
                </div>
              </section>

              <section className="settings-section">
                <h3 className="settings-section-title">Preferences</h3>
                <p className="settings-help" style={{ marginBottom: 12 }}>
                  These sections are part of the design but their endpoints have not shipped yet.
                </p>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Notifications</p>
                    <p className="settings-help">Waiting for GET/PUT /notification-preferences</p>
                  </div>
                  <span
                    className="btn btn-secondary btn-sm"
                    aria-disabled="true"
                    title="Not available yet — waiting for GET/PUT /notification-preferences"
                    style={{ opacity: 0.45, cursor: "not-allowed" }}
                  >
                    Not available
                  </span>
                </div>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Privacy</p>
                    <p className="settings-help">Waiting for GET/PUT /privacy-settings</p>
                  </div>
                  <span
                    className="btn btn-secondary btn-sm"
                    aria-disabled="true"
                    title="Not available yet — waiting for GET/PUT /privacy-settings"
                    style={{ opacity: 0.45, cursor: "not-allowed" }}
                  >
                    Not available
                  </span>
                </div>
              </section>

              <section className="settings-section">
                <h3 className="settings-section-title">Shortcuts</h3>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Edit profile</p>
                    <p className="settings-help">Name, bio and profile photo.</p>
                  </div>
                  <Link href="/settings/profile" className="btn btn-secondary btn-sm">
                    Open
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </div>
                <div className="settings-row">
                  <div>
                    <p className="settings-label">Email &amp; password</p>
                    <p className="settings-help">Your sign-in email and password reset.</p>
                  </div>
                  <Link href="/settings/account" className="btn btn-secondary btn-sm">
                    Open
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
