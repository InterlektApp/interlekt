"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* Motion + disclosure primitives. Every one of them respects
   `prefers-reduced-motion` and degrades to fully visible content. */

function usePrefersReducedMotion(): boolean {
  return React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function useInView<T extends HTMLElement>(onEnter: () => void) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      onEnter();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onEnter();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    const fallback = window.setTimeout(onEnter, 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [onEnter]);
  return ref;
}

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = React.useState(reduced);
  const mark = React.useCallback(() => setVisible(true), []);
  const ref = useInView<HTMLDivElement>(mark);
  const Comp = as as "div";
  return (
    <Comp
      ref={ref}
      className={cn("fade-in-up", visible && "visible", className)}
      style={delay && !reduced ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}

export interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
}

export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = React.useState(reduced);
  const mark = React.useCallback(() => setVisible(true), []);
  const ref = useInView<HTMLDivElement>(mark);
  const Comp = as as "div";
  return (
    <Comp ref={ref} className={cn("stagger", visible && "visible", className)}>
      {children}
    </Comp>
  );
}

export interface CollapseProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Collapse({ trigger, children, defaultOpen = false, className, contentClassName }: CollapseProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={className}>
      <button
        type="button"
        className="collapsible-trigger flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
        <ChevronDown className="chevron h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
      </button>
      <div className={cn("collapsible-body", open && "open", contentClassName)}>{children}</div>
    </div>
  );
}
