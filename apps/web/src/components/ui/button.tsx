"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "inverse"
  | "link"
  /** Alias for `secondary` — kept for the screens that predate the redesign. */
  | "outline"
  /** Alias for `primary`. */
  | "default";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fully rounded, for landing-page CTAs only. */
  pill?: boolean;
  asChild?: boolean;
  loading?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  default: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  inverse: "btn-inverse",
  link: "btn-link",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  icon: "btn-icon",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", pill, asChild = false, loading, children, disabled, ...props },
    ref,
  ) => {
    const classes = cn(
      "btn",
      VARIANT_CLASS[variant],
      SIZE_CLASS[size],
      pill && "btn-pill",
      className,
    );

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span className="sr-only">Working</span>
          </>
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
