"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Megaphone, Pin } from "lucide-react";
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
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      {post.is_announcement && (
        <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          <Megaphone className="h-3 w-3" />
          Announcement
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-bold text-white">
          {post.author.display_name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{post.author.display_name}</p>
          <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
        </div>
        {post.is_pinned && <Pin className="ml-auto h-4 w-4 text-slate-400" />}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {post.content}
      </p>

      <div className="mt-3 flex items-center gap-4 border-t pt-3">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-rose-500" : ""}`} />
          {post.like_count + (liked ? 1 : 0)}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <MessageCircle className="h-4 w-4" />
          {post.comment_count + localComments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {localComments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                {c.author.display_name.charAt(0)}
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900">{c.author.display_name}</p>
                <p className="text-sm text-slate-700">{c.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              className="h-10 flex-1 rounded-lg border px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <Button type="submit" size="sm" disabled={!comment.trim()}>
              Post
            </Button>
          </form>
        </div>
      )}
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
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Community</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/communities">All communities</Link>
        </Button>
      </div>

      <form onSubmit={submitPost} className="rounded-xl border bg-white p-4 shadow-sm">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with the community…"
          rows={3}
          className="w-full resize-none rounded-lg border p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm" disabled={!newPost.trim()}>
            Post
          </Button>
        </div>
      </form>

      <div className="mt-4 space-y-4">
        {all.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
