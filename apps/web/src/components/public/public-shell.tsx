"use client";

import * as React from "react";
import { PublicNav } from "@/components/shell/public-nav";
import { SiteFooter } from "@/components/shell/site-footer";
import { useMe } from "@/hooks/use-auth";

/**
 * The public shell: sticky top nav, the page body, and the dark footer.
 *
 * The nav renders the signed-in avatar menu when a session exists, so the
 * shell reads the current account from `GET /auth/me` (null when signed out).
 */

export type PublicNavKey = "explore" | "creators" | "about" | "help";

export interface PublicShellProps {
  active?: PublicNavKey;
  children: React.ReactNode;
}

export function PublicShell({ active, children }: PublicShellProps) {
  const { data: me } = useMe();

  return (
    <div className="page">
      <PublicNav
        active={active}
        signedIn={Boolean(me)}
        isCreator={me?.roles.includes("creator") ?? false}
        user={
          me
            ? { displayName: me.displayName, email: me.email, avatarUrl: me.avatarUrl }
            : undefined
        }
      />
      <main className="page-body">{children}</main>
      <SiteFooter />
    </div>
  );
}
