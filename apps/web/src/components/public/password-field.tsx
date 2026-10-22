"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/**
 * A password input with the design system's icon prefix and an eye toggle.
 *
 * The toggle is client-side only — it never changes what the server receives.
 */

export interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label?: string;
  error?: string;
  help?: string;
  /** Marks the control invalid when the message lives outside the field. */
  invalid?: boolean;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, label, error, help, invalid, className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const flagged = Boolean(error || invalid);

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
            border: `1px solid ${flagged ? "var(--danger)" : "var(--line-2)"}`,
            overflow: "hidden",
          }}
        >
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
            <Icon name="lock" size={18} />
          </span>

          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={cn(
              "min-w-0 flex-1 focus-visible:shadow-focus focus-visible:outline-none",
              className,
            )}
            style={{
              border: "none",
              height: 48,
              fontSize: "var(--fs-15)",
              paddingLeft: 6,
              background: "transparent",
            }}
            aria-invalid={flagged ? true : undefined}
            {...props}
          />

          <button
            type="button"
            className="suffix"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            style={{
              border: "none",
              background: "transparent",
              padding: "0 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon name={visible ? "eyeOff" : "eye"} size={18} />
          </button>
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
  },
);
PasswordField.displayName = "PasswordField";
