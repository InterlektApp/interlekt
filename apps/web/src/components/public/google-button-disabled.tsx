"use client";

import { GoogleMark } from "@/components/google-mark";

/**
 * "Continue with Google" — rendered DISABLED.
 *
 * The backend exposes no OAuth endpoint yet, so the button ships switched
 * off with a one-line explanation instead of faking a sign-in flow.
 */
export function GoogleButtonDisabled({ label = "Continue with Google" }: { label?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <button
        type="button"
        className="btn btn-secondary btn-block"
        style={{ height: 48, cursor: "not-allowed", opacity: 0.6 }}
        disabled
        aria-disabled="true"
      >
        <GoogleMark />
        {label}
      </button>
      <p className="text-xs muted" style={{ textAlign: "center" }}>
        Google sign-in isn&apos;t available yet — please use your email and password.
      </p>
    </div>
  );
}
