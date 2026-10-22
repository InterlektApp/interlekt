/**
 * Duration formatting for the long-form classroom copy.
 *
 * `lib/dates.ts` formats lesson lengths as `8:42`; the classroom headers and
 * the "time remaining" line need the readable `8h 24m` form instead.
 */

/** 30384 → "8h 24m" · 1440 → "24m" · 45 → "45s" */
export function formatDurationLong(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${total}s`;
}

/** "12 of 20 lessons" */
export function lessonCountLabel(completed: number, total: number): string {
  return `${completed} of ${total} ${total === 1 ? "lesson" : "lessons"}`;
}
