"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";

export interface AdminRailProps {
  active?: "overview" | "users" | "verification" | "reports" | "transactions";
  /** Real pending counts, when the backend supplies them. */
  counts?: { verification?: number; reports?: number };
  className?: string;
}

const ITEMS = [
  { id: "overview", label: "Overview", href: "/overview", icon: "layout" },
  { id: "users", label: "Users", href: "/users", icon: "users" },
  { id: "verification", label: "Verification", href: "/verification", icon: "badgeCheck" },
  { id: "reports", label: "Reports", href: "/reports", icon: "alertTriangle" },
  { id: "transactions", label: "Transactions", href: "/transactions", icon: "receipt" },
] as const;

export function AdminRail({ active, counts, className }: AdminRailProps) {
  return (
    <aside className={cn("admin-rail", className)} aria-label="Admin operations">
      <div className="admin-rail-section">
        <Link href="/" className="brand" aria-label="Interlekt home">
          <BrandMark />
          <BrandWordmark />
        </Link>
        <span className="badge mt-2 border-transparent bg-white/10 text-white">Admin · Operations</span>
      </div>
      <div className="admin-rail-section">
        <p className="admin-rail-label">Operations</p>
        <nav className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const count = item.id === "verification" ? counts?.verification : item.id === "reports" ? counts?.reports : undefined;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn("admin-rail-item", active === item.id && "active")}
                aria-current={active === item.id ? "page" : undefined}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {count ? <span className="count">{count}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
