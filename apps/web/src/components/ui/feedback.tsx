import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/* Status + label primitives. The dot is CSS-driven (`.badge::before`), so it is
   never rendered as a second element. */

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "fill"
  | "fill-accent";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", size = "md", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variant !== "neutral" && `badge-${variant}`,
        variant === "fill" && "badge-fill",
        variant === "fill-accent" && "badge-fill-accent",
        size === "sm" && "text-[11px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface ChipProps {
  active?: boolean;
  href?: string;
  icon?: string;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Chip({ active, href, icon, size = "md", className, children, onClick }: ChipProps) {
  const classes = cn("chip", active && "active", size === "sm" && "chip-sm", className);
  const inner = (
    <>
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} aria-current={active ? "page" : undefined}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
      {inner}
    </button>
  );
}

export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("tag", className)}>{children}</span>;
}

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Alert({ variant = "info", title, icon, className, children }: AlertProps) {
  return (
    <div className={cn("alert", `alert-${variant}`, className)} role={variant === "danger" ? "alert" : "status"}>
      {icon ? <Icon name={icon} /> : null}
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-[15px] leading-[1.47]">{children}</div> : null}
      </div>
    </div>
  );
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("empty", className)}>
      <span className="empty-icon">
        <Icon name={icon} size={24} />
      </span>
      <p className="empty-title">{title}</p>
      {description ? <p className="empty-text">{description}</p> : null}
      {action ? (
        action.href ? (
          <a className="btn btn-primary btn-pill mt-2" href={action.href}>
            {action.label}
          </a>
        ) : (
          <button type="button" className="btn btn-primary btn-pill mt-2" onClick={action.onClick}>
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}

export interface ProgressProps {
  value: number;
  tone?: "accent" | "success" | "ink";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Progress({ value, tone = "accent", size = "md", label, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "progress",
        size === "lg" && "progress-lg",
        size === "sm" && "progress-sm",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span
        className={cn(
          "progress-bar block h-full",
          tone === "success" && "progress-bar-success",
          tone === "ink" && "progress-bar-ink",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export interface StarsProps {
  rating?: number | null;
  count?: number | null;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function Stars({ rating, count, size = "sm", showCount = true, className }: StarsProps) {
  if (rating == null) return null;
  const px = size === "lg" ? 16 : size === "md" ? 14 : 12;
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <Star
            key={step}
            width={px}
            height={px}
            style={{ opacity: rounded >= step ? 1 : rounded >= step - 0.5 ? 0.5 : 0.2 }}
          />
        ))}
      </span>
      <span className="sr-only">
        {rating.toFixed(1)} out of 5{count ? ` from ${count} ratings` : ""}
      </span>
      {showCount ? (
        <span className="rating-text" aria-hidden="true">
          {rating.toFixed(1)}
          {count ? ` (${count})` : ""}
        </span>
      ) : null}
    </span>
  );
}
