"use client";

import { use, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { get, post } from "@/lib/api/client";
import type { Paginated } from "@/types/api";

type CourseItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  position: number;
  isPublished: boolean;
};

type CourseDetail = CourseItem & {
  communityId: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  moduleCount: number;
  lessonCount: number;
  modules: unknown[];
};

type CourseBuilderPageProps = { params: Promise<{ id: string }> };

export default function CourseBuilderPage({ params }: CourseBuilderPageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: communities = [], isLoading: communitiesLoading, isError: communitiesError } = useMyCommunities();
  const community = communities.find((item) => item.id === id || item.slug === id);
  const courseKey = ["community-courses", community?.slug];
  const { data: coursesPage, isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: courseKey,
    queryFn: () => get<Paginated<CourseItem>>(`/communities/${encodeURIComponent(community!.slug)}/courses?page=1&pageSize=100`),
    enabled: Boolean(community?.slug),
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createCourse = useMutation({
    mutationFn: (body: { title: string; description: string }) =>
      post<CourseDetail>(`/communities/${encodeURIComponent(community!.slug)}/courses`, body),
    onSuccess: async () => {
      setTitle("");
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: courseKey });
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCourse.mutate({ title: title.trim(), description: description.trim() });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={`/studio/communities/${id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to community
      </Link>
      <header className="mt-4 border-b border-sky-100 pb-6">
        <p className="label-eyebrow">Community learning</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Course builder</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Create a real course in this community. Courses are saved through the live Interlekt API.</p>
      </header>

      {communitiesLoading ? <p className="mt-6 text-sm text-slate-600">Loading your community…</p>
        : communitiesError ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load your communities from the backend. Sign in with a creator account and try again.</p>
        : !community ? <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">This community was not found in your creator account.</p>
        : <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)]">
          <section className="h-fit rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] sm:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-900"><BookOpen aria-hidden="true" className="h-5 w-5" /></span>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">Add a course</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Start with the course title and description. You can add modules and lessons after the course is created.</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-800">Course title
                <input required minLength={3} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-sky-200 px-4 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="e.g. UX Research Foundations" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">Description <span className="font-normal text-slate-500">(optional)</span>
                <textarea maxLength={5000} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded-xl border border-sky-200 px-4 py-3 font-normal leading-6 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="What will learners be able to do?" />
              </label>
              {createCourse.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{createCourse.error.message}</p>}
              {createCourse.isSuccess && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Course created and saved to the backend.</p>}
              <Button type="submit" disabled={createCourse.isPending} className="w-full">
                {createCourse.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {createCourse.isPending ? "Creating…" : "Create course"}
              </Button>
            </form>
          </section>

          <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/50 p-5 sm:p-7" aria-labelledby="course-list-title">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sky-100 pb-4">
              <div><p className="label-eyebrow">{community.title}</p><h2 id="course-list-title" className="mt-1 text-xl font-semibold text-slate-950">Your courses</h2></div>
              <span className="text-sm text-slate-500">{coursesPage?.total ?? 0} total</span>
            </div>
            {coursesLoading ? <p className="py-8 text-sm text-slate-600">Loading courses…</p>
              : coursesError ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load courses from the backend.</p>
              : !coursesPage?.items.length ? <div className="mt-5 rounded-2xl border border-dashed border-sky-200 bg-white/80 px-5 py-10 text-center"><BookOpen className="mx-auto h-8 w-8 text-sky-800" /><p className="mt-3 font-semibold text-slate-900">No courses yet</p><p className="mt-1 text-sm text-slate-600">Create the first course for this community.</p></div>
              : <ul className="mt-4 space-y-3">{coursesPage.items.map((course) => <li key={course.id} className="rounded-2xl border border-sky-100 bg-white p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-950">{course.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{course.description || "No description yet."}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${course.isPublished ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{course.isPublished ? "Published" : "Draft"}</span></div></li>)}</ul>}
          </section>
        </div>}
    </main>
  );
}
