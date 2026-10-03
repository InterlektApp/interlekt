import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaceholderProps {
  title: string;
  description: string;
  /** Optional CTA link */
  ctaHref?: string;
  ctaLabel?: string;
  /** Visual variant */
  variant?: "default" | "learner" | "creator" | "admin";
}

const variantStyles: Record<string, string> = {
  default: "from-blue-50 to-sky-50 border-blue-200",
  learner: "from-emerald-50 to-teal-50 border-emerald-200",
  creator: "from-violet-50 to-purple-50 border-violet-200",
  admin: "from-amber-50 to-orange-50 border-amber-200",
};

export function Placeholder({
  title,
  description,
  ctaHref,
  ctaLabel,
  variant = "default",
}: PlaceholderProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div
        className={cn(
          "max-w-lg w-full rounded-2xl border bg-gradient-to-br p-8 text-center shadow-sm",
          variantStyles[variant],
        )}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          <span className="text-2xl font-bold text-slate-400">?</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
        {ctaHref && ctaLabel && (
          <Button className="mt-6" asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
