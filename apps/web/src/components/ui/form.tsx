import * as React from "react";
import { cn } from "@/lib/utils";

/* Form controls — the design system's `.field` / `.input` patterns. */

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, help, error, required, className, children }: FieldProps) {
  return (
    <div className={cn("field", className)}>
      {label ? (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-ink-3"> *</span> : null}
        </label>
      ) : null}
      {children}
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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("input", error && "input-error", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("textarea", error && "input-error", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("select", error && "input-error", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cn("toggle", checked && "on", disabled && "opacity-40", className)}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
    />
  );
}
