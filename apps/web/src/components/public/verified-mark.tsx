import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The verification check — the one place teal is allowed.
 *
 * `creator.isVerified` is a real field on the API, so this mark is only
 * rendered when the backend says the creator is verified.
 */
export interface VerifiedMarkProps {
  size?: number;
  className?: string;
}

export function VerifiedMark({ size = 14, className }: VerifiedMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-verify text-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Check style={{ width: size * 0.68, height: size * 0.68 }} strokeWidth={3} aria-hidden="true" />
      <span className="sr-only">Verified creator</span>
    </span>
  );
}
