"use client";

import * as React from "react";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { AmbientIcons } from "@/components/shell/ambient-icons";
import { Reveal } from "@/components/ui/motion";

/**
 * The naked auth layout used by every sign-in / sign-up / reset screen.
 *
 * Auth screens carry no nav and no footer — a single centred column on pure
 * white, exactly as the v3.1 design specifies. `ambient` adds the
 * decorative, aria-hidden icon field behind the card.
 */

export interface AuthCardProps {
  children?: React.ReactNode;
  /** Small muted line above the heading — "Learner sign in", "Creator sign in". */
  microLabel?: string;
  title: string;
  lead?: string;
  ambient?: boolean;
  maxWidth?: number;
}

export function AuthCard({
  children,
  microLabel,
  title,
  lead,
  ambient = false,
  maxWidth = 440,
}: AuthCardProps) {
  return (
    <div
      className="page"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {ambient ? <AmbientIcons layout="minimal" /> : null}

      <Reveal className="relative z-[1] w-full">
        <div style={{ maxWidth, margin: "0 auto" }}>
          <Link
            href="/"
            className="brand"
            aria-label="Interlekt home"
            style={{ justifyContent: "center", marginBottom: "32px" }}
          >
            <BrandMark />
            <BrandWordmark />
          </Link>

          {microLabel ? (
            <p
              className="text-center text-13 text-ink-3"
              style={{ marginBottom: "6px" }}
            >
              {microLabel}
            </p>
          ) : null}

          <div className="text-center" style={{ marginBottom: "32px" }}>
            <h1 className="h2" style={{ marginBottom: "10px" }}>
              {title}
            </h1>
            {lead ? (
              <p className="text-lead" style={{ color: "var(--ink-3)", margin: 0 }}>
                {lead}
              </p>
            ) : null}
          </div>

          {children}
        </div>
      </Reveal>
    </div>
  );
}
