/**
 * Legacy import path. The redesigned stat primitives live in
 * `@/components/ui/data-display`.
 */
import type { StatProps } from "@/components/ui/data-display";
import { Stat } from "@/components/ui/data-display";

export function StatCard({ className, ...props }: StatProps) {
  return <Stat className={className} {...props} />;
}
