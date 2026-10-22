"use client";

import { FloatingComposer } from "@/components/ui/interactive";

/**
 * The feed composer.
 *
 * `POST /communities/{slug}/posts` accepts a `content` string and nothing
 * else, so the composer is the single-input `FloatingComposer` primitive —
 * there is no image, code or link attachment to offer.
 */

export interface FeedComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  author?: { name: string; avatarUrl?: string | null };
  disabled?: boolean;
  error?: string | null;
  placeholder?: string;
  submitLabel?: string;
}

export function FeedComposer({
  value,
  onChange,
  onSubmit,
  author,
  disabled,
  error,
  placeholder = "Share something with the community…",
  submitLabel = "Post",
}: FeedComposerProps) {
  return (
    <div>
      <FloatingComposer
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        submitLabel={submitLabel}
        disabled={disabled}
        author={author}
      />
      {error ? (
        <p role="alert" className="alert alert-danger" style={{ marginTop: 12 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
