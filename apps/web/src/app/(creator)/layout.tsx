import type { ReactNode } from "react";
import { CreatorNav } from "@/components/creator-nav";

export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CreatorNav />
      {children}
    </>
  );
}
