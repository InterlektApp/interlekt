import { cn } from "@/lib/utils";

interface AuthWatermarkProps {
  className?: string;
}

/**
 * Oversized faded Interlekt emblem for auth pages — three figures rising
 * over an open book, with wordmark and tagline. Pure decoration:
 * pointer-events-none, aria-hidden, slate tones only.
 */
export function AuthWatermark({ className }: AuthWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none overflow-hidden", className)}
    >
      <svg viewBox="0 0 640 520" fill="none" className="h-full w-full">
        {/* figures */}
        <circle cx="230" cy="150" r="52" className="fill-slate-300/70" />
        <circle cx="330" cy="110" r="66" className="fill-sky-200/80" />
        <circle cx="430" cy="150" r="52" className="fill-slate-300/70" />
        {/* shoulders */}
        <path
          d="M150 250c20-34 48-52 80-52s60 18 80 52l-80 30-80-30Z"
          className="fill-slate-300/60"
        />
        <path
          d="M232 260c26-44 60-66 98-66s72 22 98 66l-98 38-98-38Z"
          className="fill-sky-200/70"
        />
        <path
          d="M350 250c20-34 48-52 80-52s60 18 80 52l-80 30-80-30Z"
          className="fill-slate-300/60"
        />
        {/* open book */}
        <path
          d="M120 260c70-26 140-36 210-30v110c-70-6-140 4-210 30V260Z"
          className="fill-slate-300/50"
        />
        <path
          d="M540 260c-70-26-140-36-210-30v110c70-6 140 4 210 30V260Z"
          className="fill-slate-300/50"
        />
        <path
          d="M120 285c70-26 140-36 210-30v10c-70-6-140 4-210 30v-10Z"
          className="fill-sky-200/60"
        />
        <path
          d="M540 285c-70-26-140-36-210-30v10c70-6 140 4 210 30v-10Z"
          className="fill-sky-200/60"
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
