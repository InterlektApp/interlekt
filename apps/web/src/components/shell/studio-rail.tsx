"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";
import { useMe } from "@/hooks/use-auth";
import { useMyCommunities } from "@/hooks/use-communities";

export interface StudioRailProps {
  active?: "home" | "new" | "transactions" | "settings" | "profile";
  /** Real communities the creator owns. Rendered as the "Communities" group. */
  communities?: { id: string; title: string; memberCount: number }[];
  className?: string;
}

export function StudioRail({ active, communities, className }: StudioRailProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: me } = useMe();
  const { data: ownedCommunities = [] } = useMyCommunities();
  const communityLinks = communities ?? ownedCommunities;

  const contents = (
    <>
      <div className="studio-rail-section">
        <Link href="/" className="brand px-2" aria-label="Interlekt home" onClick={() => setMobileOpen(false)}>
          <BrandMark />
          <BrandWordmark />
        </Link>
      </div>

      <div className="studio-rail-section">
        <p className="studio-rail-label">Studio</p>
        <Link
          className={cn("rail-item", active === "home" && "active")}
          href="/studio"
          onClick={() => setMobileOpen(false)}
          aria-current={active === "home" ? "page" : undefined}
        >
          <Icon name="home" />
          <span>Home</span>
        </Link>
        <Link
          className={cn("rail-item", active === "new" && "active")}
          href="/studio/communities/new"
          onClick={() => setMobileOpen(false)}
          aria-current={active === "new" ? "page" : undefined}
        >
          <Icon name="plus" />
          <span>New community</span>
        </Link>
      </div>

      {communityLinks.length > 0 ? (
        <div className="studio-rail-section">
          <p className="studio-rail-label">Communities</p>
          {communityLinks.map((community) => (
            <Link
              key={community.id}
              className="rail-item"
              href={`/studio/communities/${community.id}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon name="layers" />
              <span className="truncate">{community.title}</span>
              <span className="count">{community.memberCount.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="studio-rail-section">
        <p className="studio-rail-label">Money</p>
        <div className="rail-item cursor-not-allowed opacity-60" aria-label="Transactions coming soon">
          <Icon name="receipt" />
          <span>Transactions</span>
          <span className="count">Soon</span>
        </div>
      </div>

      <div className="studio-rail-section">
        <p className="studio-rail-label">Account</p>
        <Link
          className={cn("rail-item", active === "profile" && "active")}
          href={me ? `/creators/${encodeURIComponent(me.id)}` : "/onboarding"}
          onClick={() => setMobileOpen(false)}
        >
          <Icon name="user" />
          <span>Public profile</span>
        </Link>
        <Link
          className={cn("rail-item", active === "settings" && "active")}
          href="/onboarding"
          onClick={() => setMobileOpen(false)}
          aria-current={active === "settings" ? "page" : undefined}
        >
          <Icon name="settings" />
          <span>Edit profile</span>
        </Link>
      </div>
      <div className="studio-rail-footer">
        <Link className="rail-item rail-signout" href="/logout" onClick={() => setMobileOpen(false)}>
          <Icon name="logOut" />
          <span>Sign out</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className={cn("studio-rail", className)} aria-label="Creator studio">
        {contents}
      </aside>
      <div className="studio-mobile-bar">
        <Link href="/studio" className="brand" aria-label="Interlekt studio home">
          <BrandMark />
          <BrandWordmark />
        </Link>
        <button
          type="button"
          className="studio-mobile-trigger"
          aria-label={mobileOpen ? "Close studio navigation" : "Open studio navigation"}
          aria-expanded={mobileOpen}
          aria-controls="studio-mobile-drawer"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Icon name={mobileOpen ? "x" : "menu"} />
        </button>
      </div>
      {mobileOpen ? (
        <div className="studio-mobile-overlay">
          <button className="studio-mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside id="studio-mobile-drawer" className="studio-mobile-drawer" aria-label="Creator studio navigation">
            {contents}
          </aside>
        </div>
      ) : null}
    </>
  );
}
