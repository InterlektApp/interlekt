import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { BillingPeriod } from "@/types/api";

interface MoneyAmountProps {
  kobo: number;
  currency?: string;
  billingPeriod?: BillingPeriod;
  className?: string;
}

/**
 * Renders a price the way every price in the product should read:
 * "Free", "₦5,000" (one-time), or "₦5,000/mo" (subscription).
 */
export function MoneyAmount({ kobo, currency = "NGN", billingPeriod, className }: MoneyAmountProps) {
  if (kobo === 0) {
    return <span className={cn("font-semibold text-emerald-600", className)}>Free</span>;
  }
  return (
    <span className={cn("font-semibold text-slate-900", className)}>
      {formatMoney(kobo, currency)}
      {billingPeriod === "monthly" && <span className="font-normal text-slate-500">/mo</span>}
    </span>
  );
}
