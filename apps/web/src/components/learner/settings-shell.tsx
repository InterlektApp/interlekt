import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/**
 * The shared settings shell.
 *
 * B10 (`/settings`), B19 (`/settings/profile`) and B20 (`/settings/account`)
 * are one settings area, so they share one sidebar. Only routes that exist
 * are links; the sections whose backend has not shipped are rendered as
 * disabled rows whose `title` names the endpoint they are waiting on.
 */

export type SettingsSectionId = "profile" | "account" | "notifications" | "privacy";

interface SettingsNavItem {
  id: SettingsSectionId;
  label: string;
  href: string | null;
  icon: string;
  /** The endpoint this section needs before it can be enabled. */
  missing: string | null;
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  {
    id: "profile",
    label: "Profile",
    href: "/settings/profile",
    icon: "user",
    missing: null,
  },
  {
    id: "account",
    label: "Account",
    href: "/settings/account",
    icon: "mail",
    missing: null,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: null,
    icon: "bell",
    missing: "GET/PUT /notification-preferences",
  },
  {
    id: "privacy",
    label: "Privacy",
    href: null,
    icon: "shield",
    missing: "GET/PUT /privacy-settings",
  },
];

export interface SettingsSidebarProps {
  /** The open sub-page. The hub (`/settings`) leaves it unset. */
  active?: SettingsSectionId;
}

export function SettingsSidebar({ active }: SettingsSidebarProps) {
  return (
    <aside className="settings-sidebar">
      <nav aria-label="Settings" className="flex flex-col" style={{ gap: 2 }}>
        {SETTINGS_NAV.map((item) => {
          const isActive = item.id === active;
          const classes = [
            "flex items-center rounded-md px-3 py-2 text-14 no-underline",
            isActive
              ? "bg-accent-soft text-accent-ink font-medium"
              : item.href
                ? "text-ink-2 hover:bg-paper-2 hover:text-ink"
                : "text-ink-3 opacity-60 cursor-not-allowed",
          ].join(" ");

          if (!item.href) {
            return (
              <span
                key={item.id}
                className={classes}
                aria-disabled="true"
                title={`Not available yet — waiting for ${item.missing}`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={classes}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
