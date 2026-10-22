import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: "avatar-sm",
  md: "",
  lg: "avatar-lg",
  xl: "avatar-xl",
  "2xl": "avatar-2xl",
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  verified?: boolean;
  className?: string;
}

export function Avatar({ name, src, size = "md", verified, className }: AvatarProps) {
  return (
    <span className={cn("avatar", SIZE_CLASS[size], verified && "avatar-verified", className)}>
      {src ? (
        <img src={src} alt="" loading="lazy" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
      {verified ? <span className="sr-only">Verified</span> : null}
    </span>
  );
}

export interface AvatarStackProps {
  people: { name: string; avatarUrl?: string | null }[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarStack({ people, max = 4, size = "sm", className }: AvatarStackProps) {
  if (people.length === 0) return null;
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;
  return (
    <span className={cn("avatar-stack", className)}>
      {shown.map((person) => (
        <Avatar key={person.name} name={person.name} src={person.avatarUrl} size={size} />
      ))}
      {overflow > 0 ? (
        <span
          className="avatar flex items-center justify-center text-[11px] font-semibold text-ink-2"
          title={`${overflow} more`}
        >
          +{overflow}
        </span>
      ) : null}
    </span>
  );
}
