"use client";

import { use, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Megaphone, Pin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunity } from "@/hooks/use-communities";
import { get, post } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { Paginated } from "@/types/api";

type PostItem = {
  id: string;
  communityId: string;
  authorId: string;
  author: { displayName: string; avatarUrl: string | null };
  content: string;
  isPinned: boolean;
  isAnnouncement: boolean;
  commentCount: number;
  createdAt: string;
};

type FeedPageProps = { params: Promise<{ slug: string }> };

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function FeedPage({ params }: FeedPageProps) {
  const { slug } = use(params);
  const queryClient = useQueryClient();
  const { data: community } = useCommunity(slug);
  const [content, setContent] = useState("");
  const feedKey = ["community-feed", slug];
  const { data, isLoading, isError, error: feedError } = useQuery({
    queryKey: feedKey,
    queryFn: () => get<Paginated<PostItem>>(`/communities/${encodeURIComponent(slug)}/posts?page=1&pageSize=50`),
  });
  const createPost = useMutation({
    mutationFn: (body: { content: string }) => post<PostItem>(`/communities/${encodeURIComponent(slug)}/posts`, body),
    onSuccess: async () => {
      setContent("");
      await queryClient.invalidateQueries({ queryKey: feedKey });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (trimmed) createPost.mutate({ content: trimmed });
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-sky-200 pb-5">
        <div>
          <p className="label-eyebrow text-sky-800">Community</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-950">{community?.title ?? "Community feed"}</h1>
          <p className="mt-1 text-sm text-slate-600">Updates and conversations from this community.</p>
        </div>
        <Button variant="outline" size="sm" asChild><Link href={`/communities/${slug}`}>Community page <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
      </header>

      <div className="mx-auto max-w-3xl">
        <form onSubmit={submit} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 shadow-sm sm:p-5">
          <label htmlFor="new-post" className="mb-2 block text-sm font-semibold text-slate-900">Start a conversation</label>
          <textarea id="new-post" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share something with the community…" rows={3} maxLength={5000} className="w-full resize-y rounded-xl border border-sky-200 bg-white p-3.5 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />
          {createPost.isError && <p role="alert" className="mt-3 text-sm text-red-700">{createPost.error.message}</p>}
          <div className="mt-3 flex justify-end"><Button type="submit" disabled={!content.trim() || createPost.isPending}>{createPost.isPending ? "Posting…" : <><Send className="h-4 w-4" aria-hidden="true" />Post</>}</Button></div>
        </form>

        <section aria-label="Community posts" className="mt-5 space-y-4">
          {isLoading ? <div className="h-40 animate-pulse rounded-2xl border border-sky-100 bg-sky-50" />
            : isError ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">The feed could not be loaded. {apiErrorMessage(feedError)} Sign in to an enrolled account and try again.</div>
            : !data?.items.length ? <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center"><p className="font-semibold text-slate-900">No posts yet</p><p className="mt-2 text-sm text-slate-600">Start the first conversation in this community.</p></div>
            : data.items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
              {item.isAnnouncement && <div className="border-b border-cyan-100 bg-cyan-50 px-5 py-2.5"><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-900"><Megaphone className="h-3.5 w-3.5" aria-hidden="true" />Announcement</p></div>}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-sky-800 text-sm font-bold text-white ring-2 ring-sky-100" aria-hidden="true">{item.author.displayName.charAt(0)}</div>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-950">{item.author.displayName}</p><p className="mt-0.5 text-xs text-slate-500">{timeAgo(item.createdAt)}</p></div>
                  {item.isPinned && <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800"><Pin className="h-3.5 w-3.5" aria-hidden="true" />Pinned</span>}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.content}</p>
                <p className="mt-5 border-t border-sky-100 pt-3 text-xs text-slate-500">{item.commentCount} comments</p>
              </div>
            </article>)}
        </section>
      </div>
    </main>
  );
}
