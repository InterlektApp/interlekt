import { Icon } from "@/components/ui/icon";

/**
 * Decorative icon field — the scattered, low-contrast icons that sit behind
 * hero sections. Purely decorative: `aria-hidden`, never interactive, and
 * suppressed on small screens by the design system.
 */

const LAYOUTS: Record<string, { name: string; size: string; style: React.CSSProperties }[]> = {
  hero: [
    { name: "lightbulb", size: "size-lg", style: { top: "15%", left: "5%" } },
    { name: "rocket", size: "size-xl", style: { top: "20%", right: "5%" } },
    { name: "award", size: "size-md", style: { bottom: "16%", left: "8%" } },
    { name: "bookOpen", size: "size-sm", style: { top: "50%", right: "12%" } },
    { name: "brain", size: "size-xl", style: { bottom: "12%", right: "8%" } },
    { name: "sprout", size: "size-md", style: { top: "60%", left: "8%" } },
    { name: "briefcase", size: "size-sm", style: { top: "8%", left: "30%" } },
    { name: "shield", size: "size-md", style: { bottom: "10%", left: "35%" } },
  ],
  default: [
    { name: "lightbulb", size: "size-md", style: { top: "12%", left: "6%" } },
    { name: "rocket", size: "size-lg", style: { top: "18%", right: "8%" } },
    { name: "award", size: "size-md", style: { bottom: "16%", left: "12%" } },
    { name: "bookOpen", size: "size-sm", style: { top: "35%", right: "15%" } },
    { name: "brain", size: "size-lg", style: { bottom: "22%", right: "6%" } },
    { name: "sprout", size: "size-md", style: { top: "60%", left: "8%" } },
    { name: "briefcase", size: "size-sm", style: { top: "8%", left: "30%" } },
    { name: "shield", size: "size-md", style: { bottom: "10%", left: "35%" } },
  ],
  minimal: [
    { name: "lightbulb", size: "size-sm", style: { top: "18%", right: "12%" } },
    { name: "bookOpen", size: "size-sm", style: { bottom: "22%", left: "14%" } },
  ],
};

export function AmbientIcons({ layout = "default" }: { layout?: "hero" | "default" | "minimal" }) {
  const icons = LAYOUTS[layout] ?? LAYOUTS.default;
  return (
    <div className="ambient-icons" aria-hidden="true">
      {icons.map((icon, index) => (
        <span key={`${icon.name}-${index}`} className={`ambient-icon ${icon.size}`} style={icon.style}>
          <Icon name={icon.name} size={64} strokeWidth={1.25} />
        </span>
      ))}
    </div>
  );
}
