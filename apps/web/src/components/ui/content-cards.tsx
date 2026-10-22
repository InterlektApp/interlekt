import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/dates";
import { Avatar } from "@/components/ui/avatar";
import { Stars } from "@/components/ui/feedback";
import { Money } from "@/components/ui/data-display";
import { CommunityCover } from "@/components/ui/community-cover";
import type { CommunityListItem, PostResponse } from "@/types/api";

/* Content cards — community, post, lesson and reply. */

export interface CommunityCardProps {
  community: CommunityListItem;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const title = community.title.trim();
  return (
    <Link
      href={`/communities/${encodeURIComponent(community.slug)}`}
      className={cn("community-card group", className)}
      aria-label={title}
    >
      <div className="community-card-cover overflow-hidden">
        <CommunityCover
          src={community.imageUrl}
          title={title}
          category={community.categories?.[0]?.name}
        />
      </div>
      <div className="community-card-body">
        <h3 className="community-card-title">{title}</h3>
        <p className="community-card-creator">
          <Avatar name={community.creator.displayName} src={community.creator.avatarUrl} size="sm" />
          <span className="truncate">{community.creator.displayName}</span>
          {community.creator.isVerified ? (
            <span className="avatar-verified relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-verify text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">Verified creator</span>
            </span>
          ) : null}
        </p>
        <div className="community-card-footer">
          <span className="tnum">
            {community.memberCount.toLocaleString()}{" "}
            {community.memberCount === 1 ? "member" : "members"}
          </span>
          {community.reviewCount && community.reviewCount > 0 ? (
            <Stars rating={community.rating} count={community.reviewCount} showCount={false} />
          ) : null}
          <Money
            amount={community.priceAmount}
            currency={community.priceCurrency}
            isFree={community.isFree}
            className="community-card-price"
          />
        </div>
      </div>
    </Link>
  );
}

export interface PostCardProps {
  post: PostResponse;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article className={cn("post-card", post.isAnnouncement && "post-announcement", className)}>
      <header className="post-header">
        <Avatar name={post.author.displayName} src={post.author.avatarUrl} size="md" />
        <div className="min-w-0">
          <p className="post-author truncate">{post.author.displayName}</p>
          <p className="post-meta">{timeAgo(post.createdAt)}</p>
        </div>
        {post.isPinned ? (
          <span className="ml-auto inline-flex items-center gap-1.5 text-13 text-ink-3">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 0 1-1 1 1 0 0 0 0-4H8a1 1 0 0 0 0 4 1 1 0 0 1 1 1z" />
            </svg>
            Pinned
          </span>
        ) : null}
      </header>
      {post.isAnnouncement ? (
        <p className="mb-2 inline-flex items-center gap-1.5 text-13 font-medium text-accent-ink">
          Announcement
        </p>
      ) : null}
      <div className="post-body whitespace-pre-wrap">{post.content}</div>
      <footer className="post-footer">
        <span className="post-action">
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </span>
      </footer>
    </article>
  );
}

export type LessonStatus = "done" | "current" | "locked" | "todo";

export interface LessonRowProps {
  title: string;
  status: LessonStatus;
  durationSeconds?: number | null;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function LessonRow({ title, status, durationSeconds, href, onClick, className }: LessonRowProps) {
  const duration = formatDuration(durationSeconds);
  const body = (
    <>
      <span className={cn("lesson-status", status !== "todo" && status)} aria-hidden="true">
        {status === "done" ? <Check /> : status === "current" ? <Play /> : status === "locked" ? <Lock /> : null}
      </span>
      <span className="lesson-title truncate">{title}</span>
      {duration ? <span className="lesson-meta">{duration}</span> : null}
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className={cn("lesson-row", status === "current" && "active", className)}
        aria-current={status === "current" ? "true" : undefined}
      >
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("lesson-row w-full text-left", status === "current" && "active", className)}
    >
      {body}
    </button>
  );
}

export interface ReplyItemProps {
  authorName: string;
  avatarUrl?: string | null;
  body: string;
  createdAt?: string | null;
  isAccepted?: boolean;
  children?: React.ReactNode;
}

export function ReplyItem({ authorName, avatarUrl, body, createdAt, isAccepted, children }: ReplyItemProps) {
  return (
    <div className={cn("reply-item", isAccepted && "reply-marked")}>
      <div className="flex items-start gap-3">
        <Avatar name={authorName} src={avatarUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-15 font-medium text-ink">
            {authorName}
            {createdAt ? <span className="ml-2 text-13 text-ink-3">{timeAgo(createdAt)}</span> : null}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-15 leading-[1.55] text-ink-2">{body}</p>
          {isAccepted ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-13 font-medium text-accent-ink">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Accepted answer
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
