import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPriceAmount } from "@/lib/money";

/* Money, stats, tables and pagination — the data-display primitives. */

export interface MoneyProps {
  amount: string | number | null | undefined;
  currency?: string;
  isFree?: boolean;
  suffix?: string;
  className?: string;
}

export function Money({ amount, currency = "NGN", isFree, suffix, className }: MoneyProps) {
  const wire = typeof amount === "number" ? amount.toFixed(2) : (amount ?? null);
  const text = formatPriceAmount(wire, currency, isFree);
  return (
    <span className={cn("text-money", className)}>
      {text}
      {suffix ? <span className="suffix font-normal text-ink-3">{suffix}</span> : null}
    </span>
  );
}

export interface StatProps {
  label: string;
  value: string | number;
  meta?: string;
  /** Alias for `meta` — kept for the screens that predate the redesign. */
  hint?: string;
  delta?: { value: string; direction: "pos" | "neg" };
  size?: "sm" | "md";
  className?: string;
}

export function Stat({ label, value, meta, hint, delta, size = "md", className }: StatProps) {
  const footnote = meta ?? hint;
  return (
    <div className={cn("stat", className)}>
      <p className="stat-label">{label}</p>
      <p className={cn("stat-value", size === "sm" && "stat-value-sm")}>{value}</p>
      {footnote || delta ? (
        <p className="stat-meta">
          {delta ? (
            <span className={cn("stat-delta", delta.direction === "pos" && "pos", delta.direction === "neg" && "neg")}>
              {delta.value}
            </span>
          ) : null}
          {footnote ? <span>{footnote}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

export function TableWrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("table-wrap", className)}>{children}</div>;
}

export function Table({ children, className }: { className?: string; children: React.ReactNode }) {
  return <table className={cn("table", className)}>{children}</table>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHeadCell({
  children,
  numeric,
  className,
}: {
  children?: React.ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return <th scope="col" className={cn(numeric && "num", className)}>{children}</th>;
}

export function TableCell({
  children,
  numeric,
  money,
  className,
}: {
  children?: React.ReactNode;
  numeric?: boolean;
  money?: boolean;
  className?: string;
}) {
  return <td className={cn(numeric && "num", money && "money", className)}>{children}</td>;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  baseHref: string;
  query?: Record<string, string | undefined>;
  className?: string;
}

function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push("gap");
  pages.push(totalPages);
  return pages;
}

export function Pagination({ page, totalPages, baseHref, query, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  };
  const items = pageWindow(page, totalPages);
  return (
    <nav className={cn("pagination", className)} aria-label="Pagination">
      <Link
        className={cn("page-btn", page <= 1 && "disabled")}
        href={href(Math.max(1, page - 1))}
        aria-label="Previous page"
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
      >
        ‹
      </Link>
      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-13 text-ink-3" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            className={cn("page-btn", item === page && "active")}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Link>
        ),
      )}
      <Link
        className={cn("page-btn", page >= totalPages && "disabled")}
        href={href(Math.min(totalPages, page + 1))}
        aria-label="Next page"
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
      >
        ›
      </Link>
    </nav>
  );
}
