import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageNavProps {
  page: number;
  pages: number;
  total: number;
  baseHref: string;
  className?: string;
}

export function PageNav({ page, pages, total, baseHref, className }: PageNavProps) {
  if (pages <= 1) return null;
  const href = (p: number) => `${baseHref}${baseHref.includes("?") ? "&" : "?"}page=${p}`;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-4 py-4", className)}
    >
      <p className="text-sm text-slate-500">
        Page {page} of {pages} · {total} total
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
          {page > 1 ? (
            <Link href={href(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Link>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              Prev
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pages} asChild={page < pages}>
          {page < pages ? (
            <Link href={href(page + 1)}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </nav>
  );
}
