import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}

/**
 * Interlekt mark: an open book whose pages rise into three figures —
 * the learner, the creator, and the community. One colour, geometric,
 * legible at 16px.
 */
export function Logo({ className, markClassName, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className={cn("h-8 w-8", markClassName)}
      >
        <rect x="1.5" y="1.5" width="29" height="29" rx="8" className="fill-blue-600" />
        {/* open book */}
        <path
          d="M8 20.5c2.6-1.2 5.2-1.8 8-1.8s5.4.6 8 1.8v-8c-2.6-1.2-5.2-1.8-8-1.8s-5.4.6-8 1.8v8Z"
          className="fill-sky-300"
        />
        <path
          d="M16 10.7v8"
          stroke="#1d4ed8"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* three rising figures */}
        <circle cx="11.4" cy="8.6" r="1.7" className="fill-white" />
        <circle cx="16" cy="7.2" r="2.1" className="fill-white" />
        <circle cx="20.6" cy="8.6" r="1.7" className="fill-white" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl tracking-tight text-slate-900">Interlekt</span>
      )}
    </span>
  );
}
