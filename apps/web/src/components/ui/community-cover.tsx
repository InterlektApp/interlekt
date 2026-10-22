"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CommunityCoverProps {
  src?: string | null;
  alt?: string;
  title: string;
  category?: string;
  className?: string;
  aspectRatio?: string;
}

// 6 sleek, minimalist, design-forward aesthetic presets (inspired by Linear / Skool / Apple)
const PRESETS = [
  {
    bg: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 60%), radial-gradient(at 100% 100%, #0284c7 0px, transparent 60%), #090d16",
    accent: "#38bdf8",
    tag: "Tech & Architecture",
  },
  {
    bg: "radial-gradient(at 0% 100%, #312e81 0px, transparent 60%), radial-gradient(at 100% 0%, #6366f1 0px, transparent 60%), #0b0c16",
    accent: "#818cf8",
    tag: "Design Systems",
  },
  {
    bg: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 60%), radial-gradient(at 100% 100%, #0d9488 0px, transparent 60%), #06110f",
    accent: "#2dd4bf",
    tag: "Business & Growth",
  },
  {
    bg: "radial-gradient(at 100% 0%, #7c2d12 0px, transparent 60%), radial-gradient(at 0% 100%, #d97706 0px, transparent 60%), #140d09",
    accent: "#fbbf24",
    tag: "Creative Studio",
  },
  {
    bg: "radial-gradient(at 100% 100%, #0e7490 0px, transparent 60%), radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 60%), #080c14",
    accent: "#22d3ee",
    tag: "Engineering",
  },
  {
    bg: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 60%), radial-gradient(at 100% 100%, #be185d 0px, transparent 60%), #110918",
    accent: "#f472b6",
    tag: "Masterclass",
  },
];

function getPresetIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % PRESETS.length;
}

export function CommunityCover({
  src,
  alt = "",
  title,
  category,
  className,
  aspectRatio,
}: CommunityCoverProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  // Check if image is obviously a placeholder mock or example domain
  const isInvalidUrl = !src || src.includes("example.com") || src.includes("undefined") || loadFailed;
  const preset = PRESETS[getPresetIndex(title || "community")];

  if (!isInvalidUrl) {
    return (
      <div
        className={cn("relative overflow-hidden w-full h-full bg-[#090d16]", className)}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <img
          src={src}
          alt={alt || title}
          loading="lazy"
          onError={() => setLoadFailed(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full flex flex-col justify-between p-4 sm:p-5 select-none",
        className,
      )}
      style={{
        background: preset.bg,
        aspectRatio: aspectRatio || undefined,
      }}
      aria-hidden="true"
    >
      {/* Subtle architectural dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top subtle glow edge */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${preset.accent}40, transparent)`,
        }}
      />

      {/* Top tag */}
      <div className="relative z-10">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase text-white/75 bg-white/10 backdrop-blur-sm border border-white/10"
        >
          {category || preset.tag}
        </span>
      </div>

      {/* Bottom title & monogram */}
      <div className="relative z-10 flex items-end justify-between gap-3">
        <p className="font-sans text-sm font-semibold tracking-tight text-white/90 line-clamp-1">
          {title}
        </p>
        <span
          className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-white/90 bg-white/10 border border-white/10"
          style={{ borderColor: `${preset.accent}40` }}
        >
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
