"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";

export interface StudioRailProps {
  active?: "home" | "new" | "transactions" | "settings" | "profile";
  /** Real communities the creator owns. Rendered as the "Communities" group. */
  communities?: { id: string; title: string; memberCount: number }[];
  className?: string;
}

export function StudioRail({ active, communities = [], className }: StudioRailProps) {
  return (
    <aside className={cn("studio-rail", className)} aria-label="Creator studio">
      <div className="studio-rail-section">
        <Link href="/" className="brand px-2" aria-label="Interlekt home">
          <BrandMark />
          <BrandWordmark />
        </Link>
      </div>

      <div className="studio-rail-section">
        <p className="studio-rail-label">Studio</p>
        <Link
          className={cn("rail-item", active === "home" && "active")}
          href="/studio"
          aria-current={active === "home" ? "page" : undefined}
        >
          <Icon name="home" />
          <span>Home</span>
        </Link>
        <Link
          className={cn("rail-item", active === "new" && "active")}
          href="/studio/communities/new"
          aria-current={active === "new" ? "page" : undefined}
        >
          <Icon name="plus" />
          <span>New community</span>
        </Link>
      </div>

      {communities.length > 0 ? (
        <div className="studio-rail-section">
          <p className="studio-rail-label">Communities</p>
          {communities.map((community) => (
            <Link
              key={community.id}
              className="rail-item"
              href={`/studio/communities/${community.id}`}
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
        <Link
          className={cn("rail-item", active === "transactions" && "active")}
          href="/studio/communities"
        >
          <Icon name="receipt" />
          <span>Transactions</span>
        </Link>
      </div>

      <div className="studio-rail-section">
        <p className="studio-rail-label">Account</p>
        <Link
          className={cn("rail-item", active === "profile" && "active")}
          href="/studio/settings/public-profile"
        >
          <Icon name="user" />
          <span>Public profile</span>
        </Link>
        <Link
          className={cn("rail-item", active === "settings" && "active")}
          href="/studio/settings"
          aria-current={active === "settings" ? "page" : undefined}
        >
          <Icon name="settings" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
