"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";

export interface AvatarMenuProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  userId?: string;
  isCreator?: boolean;
  /** Extra links that are only rendered when the route exists. */
  notificationsHref?: string;
}

export function AvatarMenu({ name, email, avatarUrl, userId, isCreator, notificationsHref }: AvatarMenuProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="avatar-wrap" ref={wrapRef}>
      <button
        type="button"
        className={cn("avatar-trigger", open && "open")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={name} src={avatarUrl} size="sm" />
        <Icon name="chevronDown" size={14} className="chevron" />
      </button>
      <div className={cn("avatar-menu", open && "open")} role="menu">
        <div className="avatar-menu-header">
          <div className="avatar-menu-name">{name}</div>
          <div className="avatar-menu-email">{email}</div>
        </div>
        {isCreator ? (
          <>
            <Link className="avatar-menu-item" href="/studio" role="menuitem">
              <Icon name="home" size={16} /> <span>Creator Studio</span>
            </Link>
            <Link className="avatar-menu-item" href="/onboarding" role="menuitem">
              <Icon name="user" size={16} /> <span>Edit creator profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link className="avatar-menu-item" href="/profile" role="menuitem">
              <Icon name="user" size={16} /> <span>Profile</span>
            </Link>
            <Link className="avatar-menu-item" href="/settings" role="menuitem">
              <Icon name="settings" size={16} /> <span>Settings</span>
            </Link>
          </>
        )}
        {notificationsHref ? (
          <Link className="avatar-menu-item" href={notificationsHref} role="menuitem">
            <Icon name="bell" size={16} /> <span>Notifications</span>
          </Link>
        ) : null}
        <div className="avatar-menu-divider" />
        <Link className="avatar-menu-item danger" href="/logout" role="menuitem">
          <Icon name="logOut" size={16} /> <span>Sign out</span>
        </Link>
      </div>
    </div>
  );
}
