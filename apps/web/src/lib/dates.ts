/**
 * Date helpers — the frontend renders dates, it never invents them.
 *
 * The backend sends ISO-8601 UTC strings. The product is Nigeria-first, so
 * relative time and calendar dates render in `Africa/Lagos` (WAT, UTC+1).
 */

const LAGOS = "Africa/Lagos";

/** "2h ago" · "3d ago" · "just now" */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 45) return "just now";
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes}m ago`;
  }
  if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return `${hours}h ago`;
  }
  if (seconds < 604800) {
    const days = Math.round(seconds / 86400);
    return `${days}d ago`;
  }
  if (seconds < 2629800) {
    const weeks = Math.round(seconds / 604800);
    return `${weeks}w ago`;
  }
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

/** "12 Aug 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/** "12 Aug 2026, 14:03" in Africa/Lagos */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: LAGOS,
  }).format(date);
}

/** "March 2024" — used for "member since" and statement months. */
export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(date);
}

/** "14:03" in Africa/Lagos */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: LAGOS,
  }).format(date);
}

/** Seconds → "8:24" or "1:02:11" for lesson durations. */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/** "3 months" · "2 years" — membership tenure. */
export function formatDurationSince(iso: string | null | undefined): string {
  if (!iso) return "";
  const start = new Date(iso).getTime();
  if (!Number.isFinite(start)) return "";
  const days = Math.floor((Date.now() - start) / 86_400_000);
  if (days < 1) return "today";
  if (days < 31) return `${days} ${days === 1 ? "day" : "days"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

/** The timezone label shown in the UI. */
export const DISPLAY_TIME_ZONE = "Africa/Lagos (GMT+1)";
