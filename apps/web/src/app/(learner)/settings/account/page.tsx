"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { SettingsSidebar } from "@/components/learner/settings-shell";
import { useMe } from "@/hooks/use-auth";

/**
 * B20 — email & password.
 *
 * The email address is read from `GET /auth/me`. There is no change-password
 * endpoint — only `POST /auth/forgot-password` and `POST /auth/reset-password`
 * — so "change password" sends the learner to the reset flow. There is no
 * 2FA, no login history and no sessions list, so those rows are disabled and
 * name the endpoint they are waiting on.
 */

export default function AccountSettingsPage() {
  const { data: account, isLoading } = useMe();

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
        <SettingsSidebar active="account" />

        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h2 className="h2" style={{ marginBottom: 6 }}>
              Email &amp; password
            </h2>
            <p className="text-sm muted" style={{ margin: 0 }}>
              Manage how you sign in and keep your account secure.
            </p>
          </div>

          {/* ============== EMAIL ADDRESS ============== */}
          <section className="settings-section">
            <div
              className="flex flex-wrap items-start justify-between"
              style={{ gap: 16 }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 className="settings-section-title">Email address</h3>
                <p className="text-sm muted" style={{ margin: 0 }}>
                  Used to sign in and receive notifications.
                </p>
              </div>
              <span
                className="btn btn-secondary btn-sm"
                aria-disabled="true"
                title="Not available yet — waiting for PATCH /users/me/email"
                style={{ opacity: 0.45, cursor: "not-allowed" }}
              >
                Change email
              </span>
            </div>

            <div style={{ padding: "16px 0" }}>
              <div className="flex items-center" style={{ gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "var(--r-md)",
                    background: "var(--paper-2)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="mail" size={18} className="text-ink-3" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-sm" style={{ fontWeight: 500, margin: 0 }}>
                    {isLoading ? "Loading…" : (account?.email ?? "—")}
                  </p>
                  <p className="text-xs muted" style={{ margin: "2px 0 0" }}>
                    Your sign-in address. The account API has no verified-email flag yet.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============== PASSWORD ============== */}
          <section className="settings-section">
            <div
              className="flex flex-wrap items-start justify-between"
              style={{ gap: 16 }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 className="settings-section-title">Password</h3>
                <p className="text-sm muted" style={{ margin: 0 }}>
                  Passwords are never stored in readable form, so this page can&apos;t show one.
                </p>
              </div>
              <Link href="/auth/forgot-password" className="btn btn-secondary btn-sm">
                Reset password
              </Link>
            </div>

            <div style={{ padding: "16px 0" }}>
              <div className="flex items-center" style={{ gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "var(--r-md)",
                    background: "var(--paper-2)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="lock" size={18} className="text-ink-3" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-sm" style={{ fontWeight: 500, margin: 0 }}>
                    ••••••••••
                  </p>
                  <p className="text-xs muted" style={{ margin: "2px 0 0" }}>
                    Changing it sends a reset link to your email address — there is no inline change
                    form in the API yet.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============== TWO-FACTOR AUTHENTICATION ============== */}
          <section className="settings-section">
            <div
              className="flex flex-wrap items-start justify-between"
              style={{ gap: 16, marginBottom: 16 }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 className="settings-section-title">Two-factor authentication</h3>
                <p className="text-sm muted" style={{ margin: 0 }}>
                  Add an extra layer of security when you sign in.
                </p>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span className="badge badge-neutral">Not enabled</span>
                <span
                  className="btn btn-secondary btn-sm"
                  aria-disabled="true"
                  title="Not available yet — waiting for POST /auth/2fa/setup"
                  style={{ opacity: 0.45, cursor: "not-allowed" }}
                >
                  Set up
                </span>
              </div>
            </div>

            <Alert variant="info" icon="info" title="Two-factor authentication isn&apos;t available yet">
              The account API has no 2FA setup endpoint, so there is no QR code or recovery code to
              show here. It will appear once <code>POST /auth/2fa/setup</code> ships.
            </Alert>
          </section>

          {/* ============== LOGIN HISTORY ============== */}
          <section className="settings-section" style={{ borderBottom: "none" }}>
            <h3 className="settings-section-title" style={{ marginBottom: 4 }}>
              Login history
            </h3>
            <p className="text-sm muted" style={{ margin: "0 0 20px" }}>
              Recent sign-ins to your account.
            </p>

            <div
              className="settings-row"
              style={{ opacity: 0.6, cursor: "not-allowed" }}
              title="Not available yet — waiting for GET /auth/login-history"
            >
              <div>
                <p className="settings-label">Sign-in history</p>
                <p className="settings-help">Waiting for GET /auth/login-history</p>
              </div>
              <span className="btn btn-secondary btn-sm">View</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
