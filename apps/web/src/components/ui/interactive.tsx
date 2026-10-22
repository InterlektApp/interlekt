"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Interactive primitives: tabs, carousel, popover, composer, streak ring. */

export interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
  animated?: boolean;
  className?: string;
}

export function Tabs({ tabs, value, onChange, animated, className }: TabsProps) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(value)}"]`);
    if (!active) return;
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, tabs]);

  return (
    <div className={cn("tabs", animated && "tabs-animated", className)} ref={listRef} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          data-tab-id={tab.id}
          aria-selected={tab.id === value}
          className={cn("tab", tab.id === value && "active")}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {typeof tab.count === "number" ? <span className="tab-count">{tab.count}</span> : null}
        </button>
      ))}
      {animated && indicator ? (
        <span
          className="tab-indicator"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

export function Carousel({ children, ariaLabel }: { children: React.ReactNode; ariaLabel?: string }) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const sync = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(240, track.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="carousel-wrap">
      <div className="carousel" ref={trackRef} role="group" aria-label={ariaLabel}>
        {children}
      </div>
      <div className="carousel-arrows" aria-hidden="true">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          tabIndex={-1}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          tabIndex={-1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export interface PopoverProps {
  trigger: React.ReactNode;
  items?: { label: string; value?: string; selected?: boolean; onSelect?: () => void }[];
  children?: React.ReactNode;
  align?: "left" | "right";
  label?: string;
}

export function Popover({ trigger, items, children, align = "right", label }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
      </button>
      <div
        className={cn("popover", open && "open", align === "right" ? "right-0" : "left-0")}
        role="menu"
      >
        {items?.map((item) => (
          <button
            key={`${item.label}-${item.value ?? ""}`}
            type="button"
            role="menuitemradio"
            aria-checked={item.selected}
            className={cn("popover-item w-full", item.selected && "selected")}
            onClick={() => {
              item.onSelect?.();
              setOpen(false);
            }}
          >
            {item.label}
            {item.selected ? <Check className="check h-3.5 w-3.5" strokeWidth={2.5} /> : null}
          </button>
        ))}
        {children}
      </div>
    </div>
  );
}

export interface FloatingComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
  author?: { name: string; avatarUrl?: string | null };
}

export function FloatingComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Share something with the community…",
  submitLabel = "Post",
  disabled,
  author,
}: FloatingComposerProps) {
  return (
    <form
      className="floating-composer"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {author ? (
        <span className="avatar avatar-sm shrink-0" aria-hidden="true">
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt="" />
          ) : (
            author.name.charAt(0).toUpperCase()
          )}
        </span>
      ) : null}
      <input
        className="floating-composer-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={5000}
        disabled={disabled}
        aria-label={placeholder}
      />
      <button type="submit" className="btn btn-primary btn-sm" disabled={disabled || !value.trim()}>
        {submitLabel}
      </button>
    </form>
  );
}

export function StreakRing({
  value,
  max,
  size = 64,
  label,
}: {
  value: number;
  max: number;
  size?: number;
  label?: string;
}) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <span className="streak-ring" style={{ width: size, height: size }} role="img" aria-label={label ?? `${value} of ${max}`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          className="streak-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="streak-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <span className="streak-ring-value">{value}</span>
    </span>
  );
}
