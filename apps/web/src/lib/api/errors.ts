import { ApiError } from "./client";

/**
 * Maps an ApiError to a form-field error map for React Hook Form.
 *
 * The backend returns 422 with `details` as [{ field, message }] — we
 * translate that into { fieldName: "message" } so `setError` can attach
 * messages to the right inputs. (Also tolerates FastAPI-style {loc, msg}.)
 */
export function apiErrorToFormErrors(
  err: unknown,
): Record<string, string> | undefined {
  if (!(err instanceof ApiError)) return undefined;
  if (err.status !== 422 || !Array.isArray(err.details)) return undefined;

  const out: Record<string, string> = {};
  for (const item of err.details as Array<{
    field?: string;
    message?: string;
    loc?: Array<string | number>;
    msg?: string;
  }>) {
    const field =
      item.field ?? (Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : undefined);
    // Backend uses camelCase fields; form fields are snake_case.
    const key =
      typeof field === "string" ? field.replace(/([A-Z])/g, "_$1").toLowerCase() : undefined;
    const message = item.message ?? item.msg;
    if (key && message) out[key] = message;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Human-readable message for toast/inline display. */
export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
