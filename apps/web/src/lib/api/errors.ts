import { ApiError } from "./client";

/**
 * Maps an ApiError to a form-field error map for React Hook Form.
 *
 * The backend returns 422 with a `details` array of { loc, msg } — we
 * translate that into { fieldName: "message" } so `setError` can attach
 * messages to the right inputs.
 */
export function apiErrorToFormErrors(
  err: unknown,
): Record<string, string> | undefined {
  if (!(err instanceof ApiError)) return undefined;
  if (err.status !== 422 || !Array.isArray(err.details)) return undefined;

  const out: Record<string, string> = {};
  for (const item of err.details as Array<{ loc?: Array<string | number>; msg?: string }>) {
    const field = item.loc?.[item.loc.length - 1];
    if (typeof field === "string" && item.msg) {
      out[field] = item.msg;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Human-readable message for toast/inline display. */
export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
