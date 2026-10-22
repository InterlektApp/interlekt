import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { SearchField } from "@/components/public/search-field";
import { Icon } from "@/components/ui/icon";

/**
 * A12 — the 404 page.
 *
 * A calm, full-page error state: a whispered "404", two clear actions and
 * a quiet search helper that posts to the live `/search` route.
 */
export default function NotFound() {
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
          404
        </div>

        <h1 className="h2" style={{ marginBottom: 12 }}>
          Page not found
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-3)", margin: "0 auto 36px", maxWidth: 480 }}>
          The page you&apos;re looking for may have been moved or doesn&apos;t exist.
        </p>

        <div
          className="flex flex-wrap justify-center"
          style={{ gap: 12, marginBottom: 40 }}
        >
          <Link className="btn btn-primary" href="/" style={{ height: 48, padding: "0 28px" }}>
            Go home
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link className="btn btn-secondary" href="/communities" style={{ height: 48, padding: "0 28px" }}>
            Browse communities
          </Link>
        </div>

        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <p className="text-xs muted" style={{ marginBottom: 12 }}>
            Or try searching:
          </p>
          <SearchField
            action="/search"
            label="Search communities"
            placeholder="Search communities, creators…"
            height={48}
            trailing={
              <button
                type="submit"
                className="btn btn-ghost"
                style={{ margin: 6, height: 36, padding: "0 16px" }}
              >
                Search
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
