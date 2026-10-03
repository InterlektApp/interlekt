import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | null;
  reviewCount?: number;
  className?: string;
  size?: "sm" | "md";
}

export function StarRating({ rating, reviewCount, className, size = "sm" }: StarRatingProps) {
  if (rating === null) {
    return <span className={cn("text-xs text-slate-400", className)}>No ratings yet</span>;
  }
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) {
            return <Star key={i} className={cn(iconClass, "fill-amber-400 text-amber-400")} />;
          }
          if (i === full && half) {
            return (
              <span key={i} className="relative inline-flex">
                <Star className={cn(iconClass, "text-slate-300")} />
                <StarHalf className={cn(iconClass, "absolute inset-0 fill-amber-400 text-amber-400")} />
              </span>
            );
          }
          return <Star key={i} className={cn(iconClass, "text-slate-300")} />;
        })}
      </span>
      <span className="text-xs font-medium text-slate-600">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </span>
  );
}
