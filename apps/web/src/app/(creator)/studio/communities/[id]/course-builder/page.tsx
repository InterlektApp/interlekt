"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowLeft, ArrowUp, BookOpen, LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { del, get, patch, post } from "@/lib/api/client";
import type { Paginated } from "@/types/api";

type CourseItem = {
  id: string;
  communityId: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  position: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
type LessonOutline = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  contentType: "text" | "video";
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  position: number;
  isPublished: boolean;
};
type ModuleResponse = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
};
type ModuleItem = ModuleResponse & {
  lessons: LessonOutline[];
};
type CourseDetail = CourseItem & { moduleCount: number; lessonCount: number; modules: ModuleItem[] };
type CourseBuilderPageProps = { params: Promise<{ id: string }> };

const inputClass = "mt-2 h-11 w-full rounded-xl border border-sky-200 px-3.5 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";
const textareaClass = "mt-2 w-full rounded-xl border border-sky-200 px-3.5 py-3 font-normal leading-6 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";
const actionClass = "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-sky-900 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700";

export default function CourseBuilderPage({ params }: CourseBuilderPageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: communities = [], isLoading: communitiesLoading, isError: communitiesError, error: communitiesQueryError } = useMyCommunities();
  const community = communities.find((item) => item.id === id || item.slug === id);
  const courseKey = ["community-courses", community?.slug];
  const { data: coursesPage, isLoading: coursesLoading, isError: coursesError, error: coursesQueryError } = useQuery({
    queryKey: courseKey,
    queryFn: () => get<Paginated<CourseItem>>(`/communities/${encodeURIComponent(community!.slug)}/courses?page=1&pageSize=100`),
    enabled: Boolean(community?.slug),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [editingModuleId, setEditingModuleId] = useState("");
  const [editingModuleTitle, setEditingModuleTitle] = useState("");
  const [editingModuleDescription, setEditingModuleDescription] = useState("");

  const detailQuery = useQuery({
    queryKey: ["course-detail", selectedCourseId],
    queryFn: () => get<CourseDetail>(`/courses/${encodeURIComponent(selectedCourseId)}`),
    enabled: Boolean(selectedCourseId),
  });
  useEffect(() => {
    if (detailQuery.data) {
      setCourseTitle(detailQuery.data.title);
      setCourseDescription(detailQuery.data.description ?? "");
    }
  }, [detailQuery.data]);

  const refreshCourses = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: courseKey }),
      queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] }),
      queryClient.invalidateQueries({ queryKey: ["courses"] }),
    ]);
  };
  const createCourse = useMutation({
    mutationFn: (body: { title: string; description: string | null }) =>
      post<CourseDetail>(`/communities/${encodeURIComponent(community!.slug)}/courses`, body),
    onSuccess: async (created) => {
      setTitle("");
      setDescription("");
      setSelectedCourseId(created.id);
      await queryClient.invalidateQueries({ queryKey: courseKey });
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
  const updateCourse = useMutation({
    mutationFn: (body: { title: string; description: string | null }) =>
      patch<CourseDetail>(`/courses/${encodeURIComponent(selectedCourseId)}`, body),
    onSuccess: refreshCourses,
  });
  const changeCoursePublication = useMutation({
    mutationFn: (published: boolean) => post<CourseDetail>(`/courses/${encodeURIComponent(selectedCourseId)}/${published ? "publish" : "unpublish"}`),
    onSuccess: refreshCourses,
  });
  const createModule = useMutation({
    mutationFn: (body: { title: string; description: string | null }) =>
      post<ModuleResponse>(`/courses/${encodeURIComponent(selectedCourseId)}/modules`, body),
    onSuccess: async () => {
      setModuleTitle("");
      setModuleDescription("");
      await queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] });
    },
  });
  const updateModule = useMutation({
    mutationFn: ({ moduleId, body }: { moduleId: string; body: { title: string; description: string | null } }) =>
      patch<ModuleResponse>(`/modules/${encodeURIComponent(moduleId)}`, body),
    onSuccess: async () => {
      setEditingModuleId("");
      await queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] });
    },
  });
  const deleteModule = useMutation({
    mutationFn: (moduleId: string) => del<void>(`/modules/${encodeURIComponent(moduleId)}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] });
    },
  });
  const reorderModules = useMutation({
    mutationFn: (moduleIds: string[]) => patch<ModuleItem[]>(`/courses/${encodeURIComponent(selectedCourseId)}/modules/reorder`, { moduleIds }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] });
    },
  });

  function submitCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCourse.mutate({ title: title.trim(), description: description.trim() || null });
  }
  function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateCourse.mutate({ title: courseTitle.trim(), description: courseDescription.trim() || null });
  }
  function submitModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createModule.mutate({ title: moduleTitle.trim(), description: moduleDescription.trim() || null });
  }
  function moveModule(index: number, offset: -1 | 1) {
    const modules = detailQuery.data?.modules ?? [];
    const target = index + offset;
    if (target < 0 || target >= modules.length) return;
    const reordered = [...modules];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    reorderModules.mutate(reordered.map((module) => module.id));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={`/studio/communities/${id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to community
      </Link>
      <header className="mt-4 border-b border-sky-100 pb-6">
        <p className="label-eyebrow">Community learning</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Course builder</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Create and maintain courses and their module structure using the creator API.</p>
      </header>

      {communitiesLoading ? <p className="mt-6 text-sm text-slate-600">Loading your community…</p>
        : communitiesError ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{communitiesQueryError instanceof Error ? communitiesQueryError.message : "Could not load your communities from the backend."}</p>
        : !community ? <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">This community was not found in your creator account.</p>
        : <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <section className="h-fit rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-900"><BookOpen aria-hidden="true" className="h-5 w-5" /></span>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">Add a course</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">The API requires a 3–160 character title; description is optional and may be up to 5,000 characters.</p>
              <form onSubmit={submitCourse} className="mt-5 space-y-4">
                <label className="block text-sm font-semibold text-slate-800">Course title
                  <input required minLength={3} maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} placeholder="e.g. UX Research Foundations" />
                </label>
                <label className="block text-sm font-semibold text-slate-800">Description <span className="font-normal text-slate-500">(optional)</span>
                  <textarea maxLength={5000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className={textareaClass} placeholder="What will learners be able to do?" />
                </label>
                {createCourse.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{createCourse.error.message}</p>}
                {createCourse.isSuccess && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Course created and saved by the backend.</p>}
                <Button type="submit" disabled={createCourse.isPending} className="w-full">
                  {createCourse.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {createCourse.isPending ? "Creating…" : "Create course"}
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-sky-100 bg-white p-5 sm:p-7" aria-labelledby="course-list-title">
              <div className="flex items-end justify-between gap-3 border-b border-sky-100 pb-4">
                <div><p className="label-eyebrow">{community.title}</p><h2 id="course-list-title" className="mt-1 text-xl font-semibold text-slate-950">Your courses</h2></div>
                <span className="text-sm text-slate-500">{coursesPage?.total ?? 0} total</span>
              </div>
              {coursesLoading ? <p className="py-8 text-sm text-slate-600">Loading courses…</p>
                : coursesError ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{coursesQueryError instanceof Error ? coursesQueryError.message : "Could not load courses from the backend."}</p>
                : !coursesPage?.items.length ? <div className="mt-5 rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 px-5 py-10 text-center"><BookOpen className="mx-auto h-8 w-8 text-sky-800" /><p className="mt-3 font-semibold text-slate-900">No courses yet</p><p className="mt-1 text-sm text-slate-600">Create the first course for this community.</p></div>
                : <ul className="mt-4 space-y-3">{coursesPage.items.map((course) => <li key={course.id} className={`rounded-2xl border p-4 ${selectedCourseId === course.id ? "border-sky-400 bg-sky-50/70" : "border-sky-100 bg-white"}`}>
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold text-slate-950">{course.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{course.description || "No description yet."}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${course.isPublished ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{course.isPublished ? "Published" : "Draft"}</span></div>
                    <button type="button" onClick={() => setSelectedCourseId(course.id)} className={`${actionClass} mt-3`} aria-pressed={selectedCourseId === course.id}><Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Manage course</button>
                  </li>)}</ul>}
            </section>
          </div>

          <div className="space-y-6">
            {!selectedCourseId ? <section className="rounded-3xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/50 p-8 text-center"><BookOpen className="mx-auto h-8 w-8 text-sky-800" /><h2 className="mt-3 text-lg font-semibold text-slate-950">Choose a course to manage</h2><p className="mt-1 text-sm text-slate-600">Select one from the list to edit its details and curriculum.</p></section>
              : detailQuery.isLoading ? <p className="rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600">Loading course and curriculum…</p>
              : detailQuery.isError ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{detailQuery.error instanceof Error ? detailQuery.error.message : "Could not load course details."}</p>
              : detailQuery.data && <>
                <section className="rounded-3xl border border-sky-100 bg-white p-5 sm:p-7" aria-labelledby="edit-course-title">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="label-eyebrow">Course details</p><h2 id="edit-course-title" className="mt-1 text-xl font-semibold text-slate-950">Edit course</h2></div><Button type="button" variant="outline" disabled={changeCoursePublication.isPending} onClick={() => changeCoursePublication.mutate(!detailQuery.data!.isPublished)}>{changeCoursePublication.isPending ? "Saving…" : detailQuery.data.isPublished ? "Unpublish course" : "Publish course"}</Button></div>
                  <form onSubmit={saveCourse} className="mt-5 space-y-4">
                    <label className="block text-sm font-semibold text-slate-800">Title
                      <input required minLength={3} maxLength={160} value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} className={inputClass} />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Description
                      <textarea maxLength={5000} rows={3} value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} className={textareaClass} />
                    </label>
                    {updateCourse.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{updateCourse.error.message}</p>}
                    {changeCoursePublication.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{changeCoursePublication.error.message}</p>}
                    {updateCourse.isSuccess && <p role="status" className="text-sm text-emerald-800">Course details saved.</p>}
                    {changeCoursePublication.isSuccess && <p role="status" className="text-sm text-emerald-800">Course publication updated.</p>}
                    <Button type="submit" disabled={updateCourse.isPending}><Save aria-hidden="true" className="h-4 w-4" />{updateCourse.isPending ? "Saving…" : "Save course details"}</Button>
                  </form>
                </section>

                <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/40 p-5 sm:p-7" aria-labelledby="modules-title">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sky-100 pb-4"><div><p className="label-eyebrow">{detailQuery.data.moduleCount} modules · {detailQuery.data.lessonCount} lessons</p><h2 id="modules-title" className="mt-1 text-xl font-semibold text-slate-950">Curriculum modules</h2></div></div>
                  <form onSubmit={submitModule} className="mt-5 grid gap-3 rounded-2xl border border-sky-100 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <label className="block text-sm font-semibold text-slate-800">Module title
                      <input required minLength={3} maxLength={160} value={moduleTitle} onChange={(event) => setModuleTitle(event.target.value)} className={inputClass} placeholder="e.g. Getting started" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Description <span className="font-normal text-slate-500">(optional)</span>
                      <input maxLength={5000} value={moduleDescription} onChange={(event) => setModuleDescription(event.target.value)} className={inputClass} placeholder="Module overview" />
                    </label>
                    <Button type="submit" disabled={createModule.isPending}>{createModule.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Add module</Button>
                  </form>
                  {createModule.isError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{createModule.error.message}</p>}
                  {updateModule.isError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{updateModule.error.message}</p>}
                  {deleteModule.isError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{deleteModule.error.message}</p>}
                  {reorderModules.isError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{reorderModules.error.message}</p>}
                  {createModule.isSuccess && <p role="status" className="mt-3 text-sm text-emerald-800">Module created and saved.</p>}
                  {detailQuery.data.modules.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-sky-200 bg-white/80 px-5 py-8 text-center"><p className="font-semibold text-slate-900">No modules yet</p><p className="mt-1 text-sm text-slate-600">Add a module to start arranging lessons.</p></div>
                    : <ol className="mt-5 space-y-3">{detailQuery.data.modules.map((module, index) => <li key={module.id} className="rounded-2xl border border-sky-100 bg-white p-4">
                      {editingModuleId === module.id ? <form onSubmit={(event) => { event.preventDefault(); updateModule.mutate({ moduleId: module.id, body: { title: editingModuleTitle.trim(), description: editingModuleDescription.trim() || null } }); }} className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-800">Title<input required minLength={3} maxLength={160} value={editingModuleTitle} onChange={(event) => setEditingModuleTitle(event.target.value)} className={inputClass} /></label>
                        <label className="block text-sm font-semibold text-slate-800">Description<textarea maxLength={5000} value={editingModuleDescription} onChange={(event) => setEditingModuleDescription(event.target.value)} className={textareaClass} rows={2} /></label>
                        <div className="flex gap-2"><Button type="submit" size="sm" disabled={updateModule.isPending}><Save className="h-4 w-4" />Save module</Button><Button type="button" size="sm" variant="outline" onClick={() => setEditingModuleId("")}><X className="h-4 w-4" />Cancel</Button></div>
                      </form> : <>
                        <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-semibold text-sky-800">{String(index + 1).padStart(2, "0")}</span><div><h3 className="font-semibold text-slate-950">{module.title}</h3><p className="mt-1 text-sm text-slate-600">{module.description || "No description"} · {module.lessonCount} {module.lessonCount === 1 ? "lesson" : "lessons"}</p></div></div>
                          <div className="flex flex-wrap items-center gap-1"><button type="button" className={actionClass} onClick={() => moveModule(index, -1)} disabled={index === 0 || reorderModules.isPending} aria-label={`Move ${module.title} up`}><ArrowUp className="h-4 w-4" /></button><button type="button" className={actionClass} onClick={() => moveModule(index, 1)} disabled={index === detailQuery.data!.modules.length - 1 || reorderModules.isPending} aria-label={`Move ${module.title} down`}><ArrowDown className="h-4 w-4" /></button><button type="button" className={actionClass} onClick={() => { setEditingModuleId(module.id); setEditingModuleTitle(module.title); setEditingModuleDescription(module.description ?? ""); }}><Pencil className="h-3.5 w-3.5" />Edit</button></div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sky-50 pt-3"><span className="text-xs text-slate-500">{module.isPublished ? "Module active" : "Module draft"}</span><div className="flex flex-wrap gap-2"><Link className={actionClass} href={`/studio/communities/${id}/lesson-editor?courseId=${encodeURIComponent(detailQuery.data.id)}&moduleId=${encodeURIComponent(module.id)}`}>Manage lessons</Link><button type="button" className={`${actionClass} text-red-700 hover:bg-red-50`} disabled={deleteModule.isPending} onClick={() => { if (window.confirm(`Delete “${module.title}” and all of its lessons?`)) deleteModule.mutate(module.id); }}>Delete module</button></div></div>
                      </>}
                    </li>)}</ol>}
                </section>
              </>}
          </div>
        </div>}
    </main>
  );
}
