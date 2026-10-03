/**
 * Money formatting — the frontend renders, never calculates.
 *
 * All amounts arrive from the API as integer minor units (kobo for NGN).
 * The currency code comes from the API too, so multi-currency support is
 * a data change, not a code change.
 */

const LOCALE_BY_CURRENCY: Record<string, string> = {
  NGN: "en-NG",
  KES: "en-KE",
  GHS: "en-GH",
  ZAR: "en-ZA",
  USD: "en-US",
};

export function formatMoney(minorUnits: number, currency = "NGN"): string {
  const locale = LOCALE_BY_CURRENCY[currency] ?? "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

/** Compact form for tight UI: ₦5,000 -> "₦5k", ₦1,500,000 -> "₦1.5M" */
export function formatMoneyCompact(minorUnits: number, currency = "NGN"): string {
  const major = minorUnits / 100;
  const symbol = currency === "NGN" ? "₦" : currency === "KES" ? "KSh" : currency === "GHS" ? "GH₵" : currency === "ZAR" ? "R" : "$";
  if (major >= 1_000_000) return `${symbol}${(major / 1_000_000).toFixed(1)}M`;
  if (major >= 1_000) return `${symbol}${(major / 1_000).toFixed(0)}k`;
  return `${symbol}${major.toFixed(0)}`;
}
