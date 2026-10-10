import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}

/** Community members rising from an open book—the Interlekt brand mark. */
export function Logo({ className, markClassName, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/interlekt-mark.png"
        alt=""
        aria-hidden="true"
        width={142}
        height={90}
        className={cn("h-10 w-16 shrink-0 object-contain", markClassName)}
      />
      {showWordmark && (
        <span className="font-sans text-[21px] font-semibold tracking-[-0.055em] text-[#073451]">Interlekt</span>
      )}
    </span>
  );
}
