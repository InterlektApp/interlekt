import { BadgeCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types/api";

interface VerificationBadgeProps {
  status: VerificationStatus | null | undefined;
  size?: "sm" | "md";
  className?: string;
}

export function VerificationBadge({ status, size = "sm", className }: VerificationBadgeProps) {
  if (!status) return null;
  if (status === "verified") {
    return (
      <span
        title="Verified creator"
        className={cn("inline-flex items-center text-blue-500", className)}
      >
        <BadgeCheck className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
        {size === "md" && <span className="ml-1 text-sm font-medium">Verified</span>}
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        title="Verification pending"
        className={cn("inline-flex items-center text-amber-500", className)}
      >
        <Clock className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
        {size === "md" && <span className="ml-1 text-sm font-medium">Pending review</span>}
      </span>
    );
  }
  return null;
}
