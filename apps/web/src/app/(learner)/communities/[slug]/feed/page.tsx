"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, Megaphone, Pin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_COMMENTS, MOCK_POSTS } from "@/lib/mocks";
import type { Post } from "@/types/api";

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState(MOCK_COMMENTS[post.id] ?? []);

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    // Optimistic append — the real app POSTs to /posts/{id}/comments.
    setLocalComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        post_id: post.id,
        author_id: "me",
        author: { display_name: "You", avatar_url: null },
        content: comment.trim(),
        created_at: new Date().toISOString(),
      },
    ]);
    setComment("");
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
      {post.is_announcement && (
        <div className="border-b border-cyan-100 bg-cyan-50 px-5 py-2.5">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-900">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />Announcement
          </p>
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-sky-800 text-sm font-bold text-white ring-2 ring-sky-100" aria-hidden="true">
            {post.author.display_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{post.author.display_name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{timeAgo(post.created_at)}</p>
          </div>
          {post.is_pinned && <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800"><Pin className="h-3.5 w-3.5" aria-hidden="true" />Pinned</span>}
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.content}</p>

        <div className="mt-5 flex items-center gap-2 border-t border-sky-100 pt-3">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={`${liked ? "Unlike" : "Like"} post`}
            onClick={() => setLiked((v) => !v)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 ${liked ? "bg-rose-50 text-rose-700" : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-rose-600" : ""}`} aria-hidden="true" />
            {post.like_count + (liked ? 1 : 0)}
          </button>
          <button
            type="button"
            aria-expanded={showComments}
            aria-label={`${showComments ? "Hide" : "Show"} comments`}
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {post.comment_count + localComments.length}
          </button>
        </div>

        {showComments && (
          <div className="mt-3 space-y-3 border-t border-sky-100 pt-4">
            {localComments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-900" aria-hidden="true">{c.author.display_name.charAt(0)}</div>
                <div className="min-w-0 flex-1 rounded-xl border border-sky-100 bg-sky-50/70 px-3.5 py-2.5">
                  <p className="text-xs font-semibold text-slate-950">{c.author.display_name}</p>
                  <p className="mt-0.5 break-words text-sm leading-6 text-slate-700">{c.content}</p>
                </div>
              </div>
            ))}
            <form onSubmit={submitComment} className="flex flex-col gap-2 sm:flex-row">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                aria-label="Write a comment"
                className="h-10 min-w-0 flex-1 rounded-xl border border-sky-200 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
              <Button type="submit" size="sm" disabled={!comment.trim()}><Send className="h-3.5 w-3.5" aria-hidden="true" />Post</Button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [newPost, setNewPost] = useState("");
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLocalPosts((prev) => [
      {
        id: `local-${Date.now()}`,
        community_id: "current",
        author_id: "me",
        author: { display_name: "You", avatar_url: null },
        content: newPost.trim(),
        is_pinned: false,
        is_announcement: false,
        like_count: 0,
        comment_count: 0,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewPost("");
  };

  const all = [...localPosts, ...MOCK_POSTS];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-sky-200 pb-5">
        <div>
          <p className="label-eyebrow text-sky-800">Community</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950">Community feed</h1>
          <p className="mt-1 text-sm text-slate-600">Ideas, updates and conversations from your community.</p>
        </div>
        <Button variant="outline" size="sm" asChild><Link href="/communities">All communities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
      </header>

      <div className="mx-auto max-w-3xl">
        <form onSubmit={submitPost} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 shadow-sm sm:p-5">
          <label htmlFor="new-post" className="mb-2 block text-sm font-semibold text-slate-900">Start a conversation</label>
          <textarea
            id="new-post"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something with the community…"
            rows={3}
            className="w-full resize-y rounded-xl border border-sky-200 bg-white p-3.5 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
          <div className="mt-3 flex justify-end"><Button type="submit" disabled={!newPost.trim()}><Send className="h-4 w-4" aria-hidden="true" />Post</Button></div>
        </form>

        <section aria-label="Community posts" className="mt-5 space-y-4">
          {all.map((p) => <PostCard key={p.id} post={p} />)}
        </section>
      </div>
    </main>
  );
}
