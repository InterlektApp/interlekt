"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowLeft, ArrowUp, FileText, LoaderCircle, Plus, Save, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyCommunities } from "@/hooks/use-communities";
import { del, get, patch, post } from "@/lib/api/client";
import type { Paginated } from "@/types/api";

type LessonContentType = "text" | "video";
type CourseItem = { id: string; communityId: string; title: string; slug: string; description: string | null; thumbnailUrl: string | null; position: number; isPublished: boolean; publishedAt: string | null; createdAt: string; updatedAt: string };
type ModuleItem = { id: string; courseId: string; title: string; description: string | null; position: number; isPublished: boolean; lessonCount: number; createdAt: string; updatedAt: string };
type LessonItem = { id: string; moduleId: string; title: string; slug: string; summary: string | null; contentType: LessonContentType; content: string | null; videoUrl: string | null; durationSeconds: number | null; thumbnailUrl: string | null; position: number; isPublished: boolean; publishedAt: string | null; createdAt: string; updatedAt: string };
type LessonEditorPageProps = { params: Promise<{ id: string }> };

const inputClass = "mt-2 h-11 w-full rounded-xl border border-sky-200 px-3.5 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";
const textareaClass = "mt-2 w-full rounded-xl border border-sky-200 px-3.5 py-3 font-normal leading-6 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";
const fieldLabel = "block text-sm font-semibold text-slate-800";

export default function LessonEditorPage({ params }: LessonEditorPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: communities = [], isLoading: communitiesLoading, isError: communitiesError, error: communitiesQueryError } = useMyCommunities();
  const community = communities.find((item) => item.id === id || item.slug === id);
  const coursesKey = ["community-courses", community?.slug];
  const coursesQuery = useQuery({
    queryKey: coursesKey,
    queryFn: () => get<Paginated<CourseItem>>(`/communities/${encodeURIComponent(community!.slug)}/courses?page=1&pageSize=100`),
    enabled: Boolean(community?.slug),
  });

  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get("courseId") ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState(searchParams.get("moduleId") ?? "");
  const [selectedLessonId, setSelectedLessonId] = useState(searchParams.get("lessonId") ?? "");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentType, setContentType] = useState<LessonContentType>("text");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const modulesQuery = useQuery({
    queryKey: ["course-modules", selectedCourseId],
    queryFn: () => get<ModuleItem[]>(`/courses/${encodeURIComponent(selectedCourseId)}/modules`),
    enabled: Boolean(selectedCourseId),
  });
  useEffect(() => {
    if (!modulesQuery.data) return;
    if (!modulesQuery.data.some((module) => module.id === selectedModuleId)) {
      setSelectedModuleId(modulesQuery.data[0]?.id ?? "");
      setSelectedLessonId("");
    }
  }, [modulesQuery.data, selectedModuleId]);
  const lessonsKey = ["module-lessons", selectedModuleId];
  const lessonsQuery = useQuery({
    queryKey: lessonsKey,
    queryFn: () => get<LessonItem[]>(`/modules/${encodeURIComponent(selectedModuleId)}/lessons`),
    enabled: Boolean(selectedModuleId && modulesQuery.data?.some((module) => module.id === selectedModuleId)),
  });
  useEffect(() => {
    if (!lessonsQuery.data) return;
    if (selectedLessonId && !lessonsQuery.data.some((lesson) => lesson.id === selectedLessonId)) setSelectedLessonId("");
  }, [lessonsQuery.data, selectedLessonId]);
  const lessonExistsInModule = Boolean(lessonsQuery.data?.some((lesson) => lesson.id === selectedLessonId));
  const lessonQuery = useQuery({
    queryKey: ["lesson-detail", selectedLessonId],
    queryFn: () => get<LessonItem>(`/lessons/${encodeURIComponent(selectedLessonId)}`),
    enabled: Boolean(selectedLessonId && lessonExistsInModule),
  });
  useEffect(() => {
    const lesson = lessonQuery.data;
    if (lesson && lesson.id === selectedLessonId) {
      setTitle(lesson.title);
      setSummary(lesson.summary ?? "");
      setContentType(lesson.contentType);
      setContent(lesson.content ?? "");
      setVideoUrl(lesson.videoUrl ?? "");
      setDurationSeconds(lesson.durationSeconds == null ? "" : String(lesson.durationSeconds));
      setThumbnailUrl(lesson.thumbnailUrl ?? "");
      setIsPublished(lesson.isPublished);
    } else if (!selectedLessonId) {
      setTitle("");
      setSummary("");
      setContentType("text");
      setContent("");
      setVideoUrl("");
      setDurationSeconds("");
      setThumbnailUrl("");
      setIsPublished(false);
    }
  }, [lessonQuery.data, selectedLessonId]);

  const invalidateLessons = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: lessonsKey }),
      queryClient.invalidateQueries({ queryKey: ["course-modules", selectedCourseId] }),
      queryClient.invalidateQueries({ queryKey: ["course-detail", selectedCourseId] }),
    ]);
  };
  const body = () => ({
    title: title.trim(),
    summary: summary.trim() || null,
    contentType,
    content: content.trim() || null,
    videoUrl: videoUrl.trim() || null,
    durationSeconds: durationSeconds === "" ? null : Number(durationSeconds),
    thumbnailUrl: thumbnailUrl.trim() || null,
    isPublished,
  });
  const createLesson = useMutation({
    mutationFn: () => post<LessonItem>(`/modules/${encodeURIComponent(selectedModuleId)}/lessons`, body()),
    onSuccess: async (lesson) => {
      setSelectedLessonId(lesson.id);
      await invalidateLessons();
    },
  });
  const updateLesson = useMutation({
    mutationFn: () => patch<LessonItem>(`/lessons/${encodeURIComponent(selectedLessonId)}`, body()),
    onSuccess: invalidateLessons,
  });
  const deleteLesson = useMutation({
    mutationFn: () => del<void>(`/lessons/${encodeURIComponent(selectedLessonId)}`),
    onSuccess: async () => {
      setSelectedLessonId("");
      await invalidateLessons();
    },
  });
  const reorderLessons = useMutation({
    mutationFn: (lessonIds: string[]) => post<LessonItem[]>(`/modules/${encodeURIComponent(selectedModuleId)}/lessons/reorder`, { lessonIds }),
    onSuccess: invalidateLessons,
  });

  function submitLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedLessonId) updateLesson.mutate();
    else createLesson.mutate();
  }
  function moveLesson(index: number, offset: -1 | 1) {
    const lessons = lessonsQuery.data ?? [];
    const target = index + offset;
    if (target < 0 || target >= lessons.length) return;
    const reordered = [...lessons];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    reorderLessons.mutate(reordered.map((lesson) => lesson.id));
  }

  const selectedCourse = coursesQuery.data?.items.find((course) => course.id === selectedCourseId);
  const selectedModule = modulesQuery.data?.find((module) => module.id === selectedModuleId);
  const isSaving = createLesson.isPending || updateLesson.isPending;
  const canEdit = Boolean(selectedModuleId && selectedModule && (!selectedLessonId || lessonQuery.data?.id === selectedLessonId));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href={`/studio/communities/${id}/course-builder`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to course builder
      </Link>
      <header className="mt-4 border-b border-sky-100 pb-6">
        <p className="label-eyebrow">Course content</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Lesson editor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Create and edit real text or video lessons. Changes are sent to the lesson API; no local placeholder content is used.</p>
      </header>

      {communitiesLoading ? <p className="mt-6 text-sm text-slate-600">Loading your community…</p>
        : communitiesError ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{communitiesQueryError instanceof Error ? communitiesQueryError.message : "Could not load your communities."}</p>
        : !community ? <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">This community was not found in your creator account.</p>
        : <div className="mt-6 space-y-6">
          <section className="grid gap-4 rounded-2xl border border-sky-100 bg-white p-5 sm:grid-cols-2 sm:p-6" aria-label="Choose course and module">
            <label className={fieldLabel}>Course
              <select value={selectedCourseId} onChange={(event) => { setSelectedCourseId(event.target.value); setSelectedModuleId(""); setSelectedLessonId(""); }} className={inputClass}>
                <option value="">Select a course</option>
                {coursesQuery.data?.items.map((course) => <option key={course.id} value={course.id}>{course.title}{course.isPublished ? "" : " (draft)"}</option>)}
              </select>
            </label>
            <label className={fieldLabel}>Module
              <select value={selectedModuleId} onChange={(event) => { setSelectedModuleId(event.target.value); setSelectedLessonId(""); }} disabled={!selectedCourseId || modulesQuery.isLoading || !modulesQuery.data?.length} className={inputClass}>
                <option value="">Select a module</option>
                {modulesQuery.data?.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}
              </select>
            </label>
            <div className="sm:col-span-2">
              {coursesQuery.isLoading && <p className="text-sm text-slate-600">Loading courses…</p>}
              {coursesQuery.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{coursesQuery.error instanceof Error ? coursesQuery.error.message : "Could not load courses."}</p>}
              {!coursesQuery.isLoading && !coursesQuery.isError && coursesQuery.data?.items.length === 0 && <p className="rounded-xl border border-dashed border-sky-200 bg-sky-50/60 p-4 text-sm text-slate-700">No courses exist for this community yet. Create one in the <Link className="font-semibold text-sky-900 underline" href={`/studio/communities/${id}/course-builder`}>course builder</Link>.</p>}
              {selectedCourseId && modulesQuery.isLoading && <p className="text-sm text-slate-600">Loading modules…</p>}
              {selectedCourseId && modulesQuery.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{modulesQuery.error instanceof Error ? modulesQuery.error.message : "Could not load modules for this course."}</p>}
              {selectedCourse && !modulesQuery.isLoading && !modulesQuery.isError && modulesQuery.data?.length === 0 && <p className="rounded-xl border border-dashed border-sky-200 bg-sky-50/60 p-4 text-sm text-slate-700">This course has no modules. Add one in the <Link className="font-semibold text-sky-900 underline" href={`/studio/communities/${id}/course-builder`}>course builder</Link>.</p>}
            </div>
          </section>

          {selectedModule && <div className="grid gap-5 lg:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)]">
            <section className="h-fit rounded-2xl border border-sky-100 bg-white p-5 sm:p-6" aria-labelledby="lesson-list-title">
              <div className="flex items-start justify-between gap-3"><div><p className="label-eyebrow">{selectedCourse?.title ?? "Course"}</p><h2 id="lesson-list-title" className="mt-1 text-lg font-semibold text-slate-950">{selectedModule.title}</h2></div><Button type="button" size="sm" onClick={() => setSelectedLessonId("")}><Plus className="h-4 w-4" />New</Button></div>
              {lessonsQuery.isLoading ? <p className="py-6 text-sm text-slate-600">Loading lessons…</p>
                : lessonsQuery.isError ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{lessonsQuery.error instanceof Error ? lessonsQuery.error.message : "Could not load lessons for this module."}</p>
                : lessonsQuery.data?.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-5 text-center"><FileText className="mx-auto h-6 w-6 text-sky-800" /><p className="mt-2 text-sm font-semibold text-slate-900">No lessons yet</p><p className="mt-1 text-xs text-slate-600">Create the first lesson in this module.</p></div>
                : <>
                  {reorderLessons.isError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{reorderLessons.error.message}</p>}
                  {reorderLessons.isSuccess && <p role="status" className="mt-3 text-xs text-emerald-800">Lesson order saved.</p>}
                  <ul className="mt-4 space-y-2">{lessonsQuery.data?.map((lesson, index) => <li key={lesson.id} className="flex items-center gap-1">
                    <button type="button" onClick={() => setSelectedLessonId(lesson.id)} aria-current={selectedLessonId === lesson.id ? "true" : undefined} className={`flex min-w-0 flex-1 items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${selectedLessonId === lesson.id ? "border-sky-400 bg-sky-50" : "border-sky-100 hover:bg-sky-50/60"}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-sky-800">{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{lesson.title}</span><span className="mt-1 block text-xs text-slate-500">{lesson.contentType} · {lesson.isPublished ? "Published" : "Draft"}</span></span></button>
                    <button type="button" onClick={() => moveLesson(index, -1)} disabled={index === 0 || reorderLessons.isPending} aria-label={`Move ${lesson.title} up`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp aria-hidden="true" className="h-4 w-4" /></button>
                    <button type="button" onClick={() => moveLesson(index, 1)} disabled={index === (lessonsQuery.data?.length ?? 0) - 1 || reorderLessons.isPending} aria-label={`Move ${lesson.title} down`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
                  </li>)}</ul>
                </>}
            </section>

            <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_16px_48px_-42px_rgba(8,47,73,.5)]" aria-labelledby="lesson-editor-title">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-950 shadow-sm">{contentType === "video" ? <Video aria-hidden="true" className="h-5 w-5" /> : <FileText aria-hidden="true" className="h-5 w-5" />}</span><div><h2 id="lesson-editor-title" className="text-sm font-semibold text-slate-950">{selectedLessonId ? "Edit lesson" : "Create lesson"}</h2><p className="mt-0.5 text-xs text-slate-500">{selectedLessonId ? "Load and update the selected backend lesson" : "Save a new lesson to the selected module"}</p></div></div>{selectedLessonId && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${lessonQuery.data?.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{lessonQuery.data?.isPublished ? "Published" : "Draft"}</span>}</div>
              <div className="p-5 sm:p-7">
                {selectedLessonId && lessonQuery.isLoading ? <p className="py-8 text-sm text-slate-600">Loading lesson content…</p>
                  : selectedLessonId && lessonQuery.isError ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{lessonQuery.error instanceof Error ? lessonQuery.error.message : "Could not load lesson content."}</p>
                  : !selectedModuleId ? <p className="py-8 text-sm text-slate-600">Select a course and module to start editing lessons.</p>
                  : <form onSubmit={submitLesson} className="space-y-4">
                    <label className={fieldLabel}>Lesson title
                      <input required minLength={3} maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} placeholder="e.g. Introduction to research plans" />
                    </label>
                    <label className={fieldLabel}>Summary <span className="font-normal text-slate-500">(optional · up to 5,000 characters)</span>
                      <textarea maxLength={5000} rows={2} value={summary} onChange={(event) => setSummary(event.target.value)} className={textareaClass} placeholder="A short overview shown in the course outline" />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={fieldLabel}>Content type
                        <select value={contentType} onChange={(event) => setContentType(event.target.value as LessonContentType)} className={inputClass}><option value="text">Text</option><option value="video">Video</option></select>
                      </label>
                      <label className={fieldLabel}>Duration in seconds <span className="font-normal text-slate-500">(optional)</span>
                        <input type="number" min={0} max={86400} step={1} value={durationSeconds} onChange={(event) => setDurationSeconds(event.target.value)} className={inputClass} placeholder="0–86400" />
                      </label>
                    </div>
                    {contentType === "video" && <label className={fieldLabel}>Video URL <span className="font-normal text-slate-500">(optional; must be HTTP or HTTPS)</span>
                      <input type="url" maxLength={500} value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} className={inputClass} placeholder="https://…" />
                    </label>}
                    <label className={fieldLabel}>{contentType === "video" ? "Lesson notes or transcript" : "Lesson content"} <span className="font-normal text-slate-500">(optional · up to 100,000 characters)</span>
                      <textarea maxLength={100000} rows={12} value={content} onChange={(event) => setContent(event.target.value)} className={`${textareaClass} min-h-56`} placeholder={contentType === "video" ? "Add notes or a transcript for this video lesson" : "Write the lesson content…"} />
                    </label>
                    <label className={fieldLabel}>Thumbnail URL <span className="font-normal text-slate-500">(optional; HTTP or HTTPS)</span>
                      <input type="url" maxLength={500} value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} className={inputClass} placeholder="https://…" />
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-sm font-medium text-slate-800"><input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} className="h-4 w-4 accent-sky-800" />Publish this lesson</label>
                    {createLesson.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{createLesson.error.message}</p>}
                    {updateLesson.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{updateLesson.error.message}</p>}
                    {deleteLesson.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{deleteLesson.error.message}</p>}
                    {createLesson.isSuccess && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Lesson created and saved by the backend.</p>}
                    {updateLesson.isSuccess && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Lesson changes saved by the backend.</p>}
                    {deleteLesson.isSuccess && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Lesson deleted by the backend.</p>}
                    <div className="flex flex-wrap gap-3 pt-1"><Button type="submit" disabled={!canEdit || isSaving || deleteLesson.isPending}>{isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSaving ? "Saving…" : selectedLessonId ? "Save lesson" : "Create lesson"}</Button>
                      {selectedLessonId && <Button type="button" variant="outline" disabled={deleteLesson.isPending || isSaving} onClick={() => { if (window.confirm(`Delete “${title || "this lesson"}”?`)) deleteLesson.mutate(); }}>{deleteLesson.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}{deleteLesson.isPending ? "Deleting…" : "Delete lesson"}</Button>}
                    </div>
                  </form>}
              </div>
            </section>
          </div>}
        </div>}
    </main>
  );
}
