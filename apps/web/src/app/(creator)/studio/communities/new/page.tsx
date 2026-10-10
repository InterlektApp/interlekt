"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, ImagePlus, LoaderCircle, Plus, Tag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-communities";
import { post } from "@/lib/api/client";
import type { CommunityCreateRequest, CommunityDetail } from "@/types/api";

type UploadImageResponse = { url: string; publicId: string; resourceType: string };
type CommunityFormMutation = Omit<CommunityCreateRequest, "imageUrl"> & {
  imageUrl: string | null;
  coverFile?: File;
};

export default function NewCommunityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverError, setCoverError] = useState("");
  const [submitNotice, setSubmitNotice] = useState("");
  const [price, setPrice] = useState("0");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const createCommunity = useMutation({
    mutationFn: async ({ coverFile: selectedFile, ...body }: CommunityFormMutation) => {
      let uploadedImageUrl = body.imageUrl;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploaded = await post<UploadImageResponse>("/uploads/images", formData);
        uploadedImageUrl = uploaded.url;
      }
      return post<CommunityDetail>("/communities", { ...body, imageUrl: uploadedImageUrl });
    },
    onSuccess: async (community) => {
      await queryClient.invalidateQueries({ queryKey: ["communities"] });
      router.push(`/studio/communities/${community.id}`);
    },
  });

  function toggleCategory(id: string) {
    setCategoryIds((selected) => selected.includes(id)
      ? selected.filter((item) => item !== id)
      : selected.length < 5 ? [...selected, id] : selected);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitNotice("");
    if (noCategories) {
      setSubmitNotice("This backend has no categories yet. Ask its admin to seed categories, then select at least one here.");
      return;
    }
    if (categoryIds.length === 0) {
      setSubmitNotice("Select at least one backend category before creating the community.");
      return;
    }
    createCommunity.mutate({
      title: title.trim(),
      description: description.trim(),
      categoryIds,
      imageUrl: imageUrl.trim() || null,
      priceAmount: (Number(price) || 0).toFixed(2),
      coverFile,
    });
  }

  function selectCover(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    setCoverError("");
    if (!selectedFile) {
      setCoverFile(undefined);
      return;
    }
    const supportedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!supportedTypes.includes(selectedFile.type)) {
      setCoverError("Choose a PNG, JPEG, GIF, or WebP image.");
      event.target.value = "";
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setCoverError("The image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setCoverFile(selectedFile);
    setImageUrl("");
  }

  const noCategories = !categoriesLoading && !categoriesError && categories.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/studio" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to studio
      </Link>

      <header className="mt-5 max-w-3xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-900"><BookOpen aria-hidden="true" className="h-6 w-6" /></span>
        <p className="label-eyebrow mt-5">Creator studio / communities</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Create a community</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Set up your real community profile. It will be created on the Interlekt backend.</p>
      </header>

      <form onSubmit={submit} className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.8fr)]">
        <section className="space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] sm:p-8">
          <label className="block text-sm font-semibold text-slate-800">Community name
            <input required minLength={3} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-sky-200 px-4 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="e.g. Product Design Circle" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">Description
            <textarea required minLength={10} maxLength={5000} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded-xl border border-sky-200 px-4 py-3 font-normal leading-6 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="What will members learn and do together?" />
          </label>
          <div className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
            <label htmlFor="community-cover" className="block text-sm font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><ImagePlus className="h-4 w-4" aria-hidden="true" /> Cover image <span className="font-normal text-slate-500">(optional)</span></span></label>
            <input id="community-cover" type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={selectCover} className="block w-full cursor-pointer rounded-xl border border-sky-200 bg-white text-sm text-slate-700 file:mr-4 file:min-h-11 file:cursor-pointer file:border-0 file:bg-sky-100 file:px-4 file:font-semibold file:text-sky-950 hover:file:bg-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700" />
            <p className="text-xs leading-5 text-slate-600">PNG, JPEG, GIF or WebP, up to 5 MB. The image is uploaded to the backend when you create the community.</p>
            {coverFile && <p className="text-xs font-medium text-sky-900">Selected: {coverFile.name}</p>}
            {coverError && <p role="alert" className="text-sm text-red-700">{coverError}</p>}
            <label htmlFor="community-cover-url" className="block text-xs font-medium text-slate-600">Or use an existing image URL</label>
            <input id="community-cover-url" type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setCoverFile(undefined); }} className="h-11 w-full rounded-xl border border-sky-200 bg-white px-4 text-sm font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="https://…" />
          </div>
          <label className="block max-w-sm text-sm font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4" /> One-time price (NGN)</span>
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-sky-200 px-4 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" />
            <span className="mt-1 block text-xs font-normal text-slate-500">Enter 0 for a free community.</span>
          </label>
          {createCommunity.isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{createCommunity.error.message}</p>}
          {submitNotice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">{submitNotice}</p>}
          <div className="flex flex-wrap gap-3 border-t border-sky-100 pt-5">
            <Button type="submit" disabled={createCommunity.isPending || categoriesLoading || categoriesError}>
              {createCommunity.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {createCommunity.isPending ? "Creating…" : "Create community"}
            </Button>
            <Button type="button" variant="outline" asChild><Link href="/studio">Cancel</Link></Button>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/70 p-5 sm:p-7">
          <p className="label-eyebrow inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Categories</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">Choose up to five</h2>
          {categoriesLoading ? <p className="mt-4 text-sm text-slate-600">Loading backend categories…</p>
            : categoriesError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">Could not load categories from the backend.</p>
            : noCategories ? <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">The backend currently has no categories seeded. A backend admin must seed real categories before a community can be created. No demo categories are being used.</p>
            : <div className="mt-4 space-y-2">{categories.map((category) => <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-sky-100 bg-white p-3 text-sm text-slate-800"><input type="checkbox" checked={categoryIds.includes(category.id)} onChange={() => toggleCategory(category.id)} disabled={!categoryIds.includes(category.id) && categoryIds.length >= 5} className="h-4 w-4 accent-sky-800" />{category.name}</label>)}</div>}
          {!noCategories && !categoriesError && <p className="mt-4 text-xs text-slate-500">{categoryIds.length}/5 selected. Categories are loaded live from the backend.</p>}
        </aside>
      </form>
    </main>
  );
}
