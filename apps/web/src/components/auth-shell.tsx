import Link from "next/link";
import { AuthWatermark } from "@/components/auth-watermark";
import { Logo } from "@/components/logo";

interface AuthShellProps {
  children: React.ReactNode;
  /** Which side the card sits on — login left, register right (per Figma). */
  side?: "left" | "right";
}

/**
 * Auth layout: white ground, oversized faded emblem watermark bleeding
 * off the opposite side, single centered card.
 */
export function AuthShell({ children, side = "left" }: AuthShellProps) {
  const left = side === "left";
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 py-10">
      <AuthWatermark
        className={
          left
            ? "-right-40 top-1/2 hidden w-[720px] -translate-y-1/2 md:block"
            : "-left-40 top-1/2 hidden w-[720px] -translate-y-1/2 md:block"
        }
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className={`flex ${left ? "justify-start md:pl-16" : "justify-end md:pr-16"}`}>
          <div className="w-full max-w-md">
            <Link href="/" aria-label="Interlekt home" className="mb-6 inline-block md:hidden">
              <Logo />
            </Link>
            <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-[0_8px_40px_-16px_rgb(11_47_79/0.18)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
