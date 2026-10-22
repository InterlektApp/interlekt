"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReplyItem } from "@/components/ui/content-cards";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/form";
import { usePostComments } from "@/hooks/use-learner-data";
import { timeAgo } from "@/lib/dates";
import { post as postRequest } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import { qk } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import type { PostResponse } from "@/types/api";

/**
 * A feed post with its real comment thread.
 *
 * The backend has no like entity, so there is no like button. Pinned and
 * announcement states come from the post itself (`isPinned` / `isAnnouncement`).
 */

export interface FeedPostProps {
  post: PostResponse;
  onPosted?: () => void;
}

export function FeedPost({ post, onPosted }: FeedPostProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");

  const comments = usePostComments(post.id, open);

  const createComment = useMutation({
    mutationFn: (content: string) =>
      postRequest(`/posts/${encodeURIComponent(post.id)}/comments`, { content }),
    onSuccess: async () => {
      setReply("");
      await queryClient.invalidateQueries({ queryKey: qk.posts.comments(post.id) });
      onPosted?.();
    },
  });

  return (
    <article className={cn("post-card", post.isAnnouncement && "post-announcement")}>
      <header className="post-header">
        <Avatar name={post.author.displayName} src={post.author.avatarUrl} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center" style={{ gap: 6 }}>
            <p className="post-author truncate">{post.author.displayName}</p>
            {post.isPinned ? <span className="badge badge-fill-accent">Pinned</span> : null}
            {post.isAnnouncement ? <span className="badge badge-info">Announcement</span> : null}
          </div>
          <p className="post-meta">{timeAgo(post.createdAt)}</p>
        </div>
      </header>

      <div className="post-body whitespace-pre-wrap">{post.content}</div>

      <footer className="post-footer">
        <button
          type="button"
          className="post-action"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name="message" size={15} />
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </button>
      </footer>

      {open ? (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          {comments.isLoading ? (
            <div className="flex flex-col" style={{ gap: 12 }} aria-label="Loading comments">
              <div className="skeleton" style={{ height: 48 }} />
              <div className="skeleton" style={{ height: 48 }} />
            </div>
          ) : comments.isError ? (
            <p role="alert" className="text-sm" style={{ color: "var(--danger-ink)" }}>
              {apiErrorMessage(comments.error)}
            </p>
          ) : (comments.data?.items.length ?? 0) === 0 ? (
            <p className="text-sm muted" style={{ marginBottom: 12 }}>
              No comments yet — be the first to reply.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: 12, marginBottom: 16 }}>
              {comments.data?.items.map((comment) => (
                <ReplyItem
                  key={comment.id}
                  authorName={comment.author.displayName}
                  avatarUrl={comment.author.avatarUrl}
                  body={comment.content}
                  createdAt={comment.createdAt}
                />
              ))}
            </div>
          )}

          <form
            className="flex items-center"
            style={{ gap: 8 }}
            onSubmit={(event) => {
              event.preventDefault();
              const content = reply.trim();
              if (content) createComment.mutate(content);
            }}
          >
            <label htmlFor={`reply-${post.id}`} className="sr-only">
              Reply to this post
            </label>
            <Input
              id={`reply-${post.id}`}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Add a reply…"
              maxLength={2000}
            />
            <Button
              type="submit"
              size="sm"
              loading={createComment.isPending}
              disabled={!reply.trim()}
            >
              Reply
            </Button>
          </form>

          {createComment.isError ? (
            <p role="alert" className="text-sm" style={{ color: "var(--danger-ink)", marginTop: 8 }}>
              {apiErrorMessage(createComment.error)}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
