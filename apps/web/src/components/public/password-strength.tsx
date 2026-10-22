"use client";

import { cn } from "@/lib/utils";

/**
 * Password strength — four monochrome pills plus a plain label.
 *
 * The score is computed in the browser: the backend only enforces a minimum
 * length, so no strength data ever comes over the wire. Ink only — never
 * green or amber, which the design system reserves for status.
 */

const LABELS = ["Weak", "Fair", "Strong", "Very strong"] as const;

export function passwordScore(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, LABELS.length);
}

export function passwordStrengthLabel(value: string): string {
  const score = passwordScore(value);
  return score === 0 ? "" : LABELS[score - 1];
}

export interface PasswordStrengthProps {
  value: string;
  className?: string;
}

export function PasswordStrength({ value, className }: PasswordStrengthProps) {
  const score = passwordScore(value);
  const label = score === 0 ? "" : LABELS[score - 1];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className="flex-1"
            style={{
              height: "4px",
              borderRadius: "var(--r-pill)",
              background: index < score ? "var(--ink)" : "var(--paper-2)",
              border: index < score ? "none" : "1px solid var(--line)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs muted">Password strength</span>
        <span className="text-xs" style={{ color: "var(--ink-2)", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {label ? `Password strength: ${label}` : "Password strength: empty"}
      </p>
    </div>
  );
}
