"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";
import { AvatarMenu } from "@/components/shell/avatar-menu";

export interface LearnerNavProps {
  active?: "dashboard" | "explore" | "learning" | "classroom";
  user?: { displayName: string; email: string; avatarUrl: string | null };
}

const LINKS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "explore", label: "Explore", href: "/communities" },
  { id: "learning", label: "My learning", href: "/my-communities" },
] as const;

export function LearnerNav({ active, user }: LearnerNavProps) {
  return (
    <header className="nav-top">
      <div className="nav-top-inner">
        <Link href="/" className="brand" aria-label="Interlekt home">
          <BrandMark />
          <BrandWordmark />
        </Link>
        <nav className="nav-links" aria-label="Learner">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn("nav-link", active === link.id && "active")}
              aria-current={active === link.id ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <form action="/search" className="nav-search" role="search">
            <Icon name="search" size={14} />
            <input type="search" name="q" placeholder="Search communities…" aria-label="Search" />
          </form>
          {user ? (
            <AvatarMenu name={user.displayName} email={user.email} avatarUrl={user.avatarUrl} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
