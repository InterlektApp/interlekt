import * as React from "react";

/**
 * Shared reading column for the legal pages (A17–A21).
 *
 * Server-safe: no client hooks, so the legal copy stays out of the client
 * bundle.
 */

export function LegalProse({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="container-narrow"
      style={{ paddingTop: "64px", paddingBottom: "96px" }}
    >
      {children}
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: "40px" }}>
      <h2 className="h3" style={{ marginBottom: "16px" }}>
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function LegalParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

export function LegalUpdated({ date }: { date: string }) {
  return (
    <p className="text-sm muted" style={{ marginBottom: "32px" }}>
      Last updated: {date}
    </p>
  );
}
