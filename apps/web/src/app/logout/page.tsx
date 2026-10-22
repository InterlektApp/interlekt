"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/public/auth-card";
import { Icon } from "@/components/ui/icon";
import { useLogout, useMe } from "@/hooks/use-auth";

/**
 * A9 — sign out.
 *
 * `POST /auth/logout` revokes the refresh token server-side; the local
 * tokens are cleared either way, so the user is signed out locally even if
 * the request fails.
 */
export default function LogoutPage() {
  const router = useRouter();
  const logout = useLogout();
  const { data: me } = useMe();

  const signOut = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        router.replace("/");
        router.refresh();
      },
    });
  };

  const cancel = () => {
    if (window.history.length > 1) router.back();
    else router.replace(me?.roles.includes("creator") ? "/studio" : "/dashboard");
  };

  return (
    <AuthCard
      title="Sign out?"
      lead={
        me
          ? `${me.displayName}, you'll need to sign in again to continue learning.`
          : "You'll need to sign in again to continue learning."
      }
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        <button
          type="button"
          className="btn btn-danger btn-block"
          style={{ height: 48 }}
          onClick={signOut}
          disabled={logout.isPending}
        >
          <Icon name="logOut" size={18} />
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
        <button type="button" className="btn btn-secondary btn-block" style={{ height: 48 }} onClick={cancel}>
          Cancel
        </button>
      </div>

      {logout.isError ? (
        <p role="alert" className="alert alert-warning" style={{ marginTop: 20 }}>
          We couldn&apos;t reach the server, but you&apos;ve been signed out on this device.
        </p>
      ) : null}

      <p
        className="text-sm muted"
        style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        <Icon name="check" size={14} />
        Your progress is saved automatically.
      </p>
    </AuthCard>
  );
}
