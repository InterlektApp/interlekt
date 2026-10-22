"use client";

import * as React from "react";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Icon } from "@/components/ui/icon";

/**
 * A13 — the route-level error boundary.
 *
 * `error.digest` is the server-generated correlation id for a server
 * error; when the failure happened in the browser we mint a local one so
 * support always has something to quote.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [incidentId, setIncidentId] = React.useState<string>("");

  const is504 =
    Boolean(error?.message && /504|timeout|timed out|gateway/i.test(error.message)) ||
    Boolean(error?.digest && /504/i.test(error.digest));

  React.useEffect(() => {
    setIncidentId(
      error.digest ??
        (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "unavailable"),
    );
    console.error(error);
  }, [error]);

  return (
    <div
      className="page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <Link
          href="/"
          className="brand"
          aria-label="Interlekt home"
          style={{ justifyContent: "center", marginBottom: 40 }}
        >
          <BrandMark />
          <BrandWordmark />
        </Link>

        <div
          className="t-display"
          style={{ fontSize: 120, lineHeight: 1, color: "var(--ink-5)", letterSpacing: "-0.04em", marginBottom: 24 }}
        >
          {is504 ? "504" : "500"}
        </div>

        <h1 className="h2" style={{ marginBottom: 12 }}>
          {is504 ? "Gateway timeout" : "Something went wrong"}
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-3)", margin: "0 auto 36px", maxWidth: 480 }}>
          {is504
            ? "The server took too long to respond. The backend may be spinning up from idle. Please refresh and try again."
            : "We're working on it. Please try again in a moment."}
        </p>

        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 40 }}>
          <button type="button" className="btn btn-primary" style={{ height: 48, padding: "0 28px" }} onClick={reset}>
            <Icon name="refresh" size={18} />
            Try again
          </button>
          <Link className="btn btn-secondary" href="/" style={{ height: 48, padding: "0 28px" }}>
            Go home
          </Link>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, maxWidth: 420, margin: "0 auto" }}>
          <p className="text-sm" style={{ color: "var(--ink-3)", marginBottom: 8 }}>
            If this keeps happening, contact{" "}
            <a href="mailto:support@interlekt.com" style={{ color: "var(--accent)" }}>
              support@interlekt.com
            </a>
          </p>
          <p className="text-xs muted">
            Incident ID <span className="tnum">{incidentId || "…"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
