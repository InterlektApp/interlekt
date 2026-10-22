"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";

/**
 * The search bar used across the public shell.
 *
 * A plain GET form — no JavaScript needed to submit it — that posts to
 * `action` with the `name` field. Any trailing controls (a submit button,
 * a clear link) are rendered inside the field.
 */

export interface SearchFieldProps {
  action: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  label: string;
  height?: number;
  /** Extra controls rendered inside the field, after the input. */
  trailing?: React.ReactNode;
  className?: string;
}

export function SearchField({
  action,
  name = "q",
  defaultValue,
  placeholder,
  label,
  height = 56,
  trailing,
  className,
}: SearchFieldProps) {
  return (
    <form action={action} method="get" role="search" className={className}>
      <div
        className="input-group"
        style={{
          height,
          borderRadius: "var(--r-md)",
          background: "var(--paper)",
          border: "1px solid var(--line-2)",
          overflow: "hidden",
        }}
      >
        <span
          className="prefix"
          style={{
            border: "none",
            background: "transparent",
            paddingLeft: 20,
            paddingRight: 8,
            display: "flex",
            alignItems: "center",
          }}
          aria-hidden="true"
        >
          <Icon name="search" size={18} />
        </span>

        <input
          type="search"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label={label}
          className="min-w-0 flex-1 focus-visible:shadow-focus focus-visible:outline-none"
          style={{
            border: "none",
            height,
            fontSize: 16,
            paddingLeft: 8,
            background: "transparent",
          }}
        />

        {trailing}
      </div>
    </form>
  );
}
