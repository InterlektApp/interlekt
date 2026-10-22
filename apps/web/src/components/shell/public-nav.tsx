"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";
import { AvatarMenu } from "@/components/shell/avatar-menu";

export interface PublicNavProps {
  active?: "explore" | "creators" | "about" | "help";
  signedIn?: boolean;
  isCreator?: boolean;
  user?: { displayName: string; email: string; avatarUrl: string | null };
}

const LINKS = [
  { id: "explore", label: "Explore", href: "/communities" },
  { id: "creators", label: "For creators", href: "/auth/register" },
  { id: "about", label: "About", href: "/about" },
  { id: "help", label: "Help", href: "/help" },
] as const;

export function PublicNav({ active, signedIn, isCreator, user }: PublicNavProps) {
  return (
    <header className="nav-top">
      <div className="nav-top-inner">
        <Link href="/" className="brand" aria-label="Interlekt home">
          <BrandMark />
          <BrandWordmark />
        </Link>
        <nav className="nav-links" aria-label="Primary">
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
          {signedIn && user ? (
            <>
              <form action="/search" className="nav-search" role="search">
                <Icon name="search" size={14} />
                <input type="search" name="q" placeholder="Search communities, creators…" aria-label="Search" />
              </form>
              <AvatarMenu
                name={user.displayName}
                email={user.email}
                avatarUrl={user.avatarUrl}
                isCreator={isCreator}
              />
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" href="/auth/login">
                Sign in
              </Link>
              <Link className="btn btn-primary btn-pill" href="/auth/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
