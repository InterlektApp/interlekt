import { cn } from "@/lib/utils";

interface AuthWatermarkProps {
  className?: string;
}

/**
 * Oversized faded Interlekt emblem for auth pages — the reference mark,
 * wordmark and tagline. Pure decoration: pointer-events-none and aria-hidden.
 */
export function AuthWatermark({ className }: AuthWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none overflow-hidden", className)}
    >
      <svg viewBox="0 0 640 520" fill="none" className="h-full w-full">
        <image
          href="/brand/interlekt-mark.png"
          x="105"
          y="72"
          width="430"
          height="272"
          opacity="0.18"
          preserveAspectRatio="xMidYMid meet"
        />
        {/* wordmark */}
        <text
          x="320"
          y="430"
          textAnchor="middle"
          className="fill-slate-300/80"
          fontSize="72"
          fontWeight="800"
          letterSpacing="4"
          fontFamily="Inter, system-ui, sans-serif"
        >
          INTERLEKT
        </text>
        <text
          x="320"
          y="470"
          textAnchor="middle"
          className="fill-sky-200/90"
          fontSize="26"
          fontWeight="500"
          letterSpacing="10"
          fontFamily="Inter, system-ui, sans-serif"
        >
          LEARN • CONNECT • GROW
        </text>
      </svg>
    </div>
  );
}
