import Link from "next/link";
import { AuthWatermark } from "@/components/auth-watermark";
import { Logo } from "@/components/logo";

interface AuthShellProps {
  children: React.ReactNode;
  /** Login left, register right, password recovery centered (per references). */
  side?: "left" | "right" | "center";
}

/**
 * Auth layout: white ground, oversized faded emblem watermark bleeding
 * off the opposite side, single centered card.
 */
export function AuthShell({ children, side = "left" }: AuthShellProps) {
  const left = side === "left";
  const centered = side === "center";
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 py-10">
      <AuthWatermark
        className={
          centered
            ? "left-1/2 top-1/2 hidden w-[980px] -translate-x-1/2 -translate-y-1/2 md:block"
            : left
              ? "-right-40 top-1/2 hidden w-[720px] -translate-y-1/2 md:block"
              : "-left-40 top-1/2 hidden w-[720px] -translate-y-1/2 md:block"
        }
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className={`flex ${centered ? "justify-center" : left ? "justify-start md:pl-9" : "justify-end md:pr-16"}`}>
          <div className={`w-full ${centered ? "max-w-[760px]" : "max-w-[620px]"}`}>
            <Link href="/" aria-label="Interlekt home" className="mb-6 inline-block md:hidden">
              <Logo />
            </Link>
            <div className={`rounded-2xl border border-sky-100 bg-white shadow-[0_8px_40px_-16px_rgb(11_47_79/0.18)] ${centered ? "flex min-h-[420px] flex-col justify-center p-8 sm:p-12" : "p-8"}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
