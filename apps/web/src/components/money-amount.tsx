import { formatPriceAmount } from "@/lib/money";
import { cn } from "@/lib/utils";

interface MoneyAmountProps {
  priceAmount: string | null | undefined;
  currency?: string;
  isFree?: boolean;
  className?: string;
}

/**
 * Renders a price the way every price in the product should read:
 * "Free" or "₦5,000". Amounts arrive as decimal major-unit strings.
 */
export function MoneyAmount({ priceAmount, currency = "NGN", isFree = false, className }: MoneyAmountProps) {
  const free = isFree || priceAmount === "0.00" || !priceAmount;
  if (free) {
    return <span className={cn("font-semibold text-emerald-600", className)}>Free</span>;
  }
  return (
    <span className={cn("font-semibold text-slate-900", className)}>
      {formatPriceAmount(priceAmount, currency, false)}
    </span>
  );
}
