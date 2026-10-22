"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/**
 * A single-line text field in the design system's `.input-group` pattern:
 * the border lives on the group, the icon sits inside it, and the control
 * itself is transparent.
 *
 * The focus ring comes from the design system (`--shadow-focus`) via
 * `focus-visible`, so keyboard users always see where they are.
 */

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  /** Name of a design-system icon rendered inside the field, on the left. */
  icon?: string;
  error?: string;
  help?: string;
  /** Extra control rendered inside the field, on the right. */
  trailing?: React.ReactNode;
}

export function TextField({
  id,
  label,
  icon,
  error,
  help,
  trailing,
  className,
  ...props
}: TextFieldProps) {
  return (
    <div className="field">
      {label ? (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div
        className="input-group"
        style={{
          height: 48,
          borderRadius: "var(--r-md)",
          background: "var(--paper)",
          border: `1px solid ${error ? "var(--danger)" : "var(--line-2)"}`,
          overflow: "hidden",
        }}
      >
        {icon ? (
          <span
            className="prefix"
            style={{
              border: "none",
              background: "transparent",
              paddingLeft: 16,
              paddingRight: 6,
              display: "flex",
              alignItems: "center",
            }}
            aria-hidden="true"
          >
            <Icon name={icon} size={18} />
          </span>
        ) : null}

        <input
          id={id}
          className={cn(
            "min-w-0 flex-1 focus-visible:shadow-focus focus-visible:outline-none",
            className,
          )}
          style={{
            border: "none",
            height: 48,
            fontSize: "var(--fs-15)",
            paddingLeft: icon ? 6 : 16,
            background: "transparent",
          }}
          aria-invalid={error ? true : undefined}
          {...props}
        />

        {trailing}
      </div>

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="field-help">{help}</p>
      ) : null}
    </div>
  );
}
