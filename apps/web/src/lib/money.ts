/**
 * Money formatting — the frontend renders, never calculates.
 *
 * The backend sends amounts as decimal MAJOR-unit strings ("5000.00" =
 * ₦5,000) in `priceAmount`, with `priceCurrency` ("NGN") and an `isFree`
 * flag. Internally we convert to integer minor units (kobo) once, at the
 * boundary, so everything downstream stays integer math.
 */

const LOCALE_BY_CURRENCY: Record<string, string> = {
  NGN: "en-NG",
  KES: "en-KE",
  GHS: "en-GH",
  ZAR: "en-ZA",
  USD: "en-US",
};

/** "5000.00" → 500000. Tolerates null/undefined/empty → 0. */
export function priceStringToKobo(amount: string | null | undefined): number {
  if (!amount) return 0;
  const major = Number.parseFloat(amount);
  if (!Number.isFinite(major) || major < 0) return 0;
  return Math.round(major * 100);
}

export function formatMoney(minorUnits: number, currency = "NGN"): string {
  const locale = LOCALE_BY_CURRENCY[currency] ?? "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

/** Display helper straight from the wire shape. */
export function formatPriceAmount(
  priceAmount: string | null | undefined,
  currency = "NGN",
  isFree = false,
): string {
  if (isFree || priceStringToKobo(priceAmount) === 0) return "Free";
  return formatMoney(priceStringToKobo(priceAmount), currency);
}

/** Compact form for tight UI: ₦5,000 -> "₦5k", ₦1,500,000 -> "₦1.5M" */
export function formatMoneyCompact(minorUnits: number, currency = "NGN"): string {
  const major = minorUnits / 100;
  const symbol = currency === "NGN" ? "₦" : currency === "KES" ? "KSh" : currency === "GHS" ? "GH₵" : currency === "ZAR" ? "R" : "$";
  if (major >= 1_000_000) return `${symbol}${(major / 1_000_000).toFixed(1)}M`;
  if (major >= 1_000) return `${symbol}${(major / 1_000).toFixed(0)}k`;
  return `${symbol}${major.toFixed(0)}`;
}
