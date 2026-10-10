"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Settings, Tag, Type, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories, useCommunity, useMyCommunities } from "@/hooks/use-communities";
import { ApiError, patch, post } from "@/lib/api/client";
import type { CommunityDetail } from "@/types/api";

type EditCommunityPageProps = {
  params: Promise<{ id: string }>;
};

type CommunityUpdateBody = {
  title?: string;
  description?: string;
  categoryIds?: string[];
  imageUrl?: string | null;
  priceAmount?: string;
};

type UpdateCommunityVariables = {
  slug: string;
  body: CommunityUpdateBody;
  coverFile?: File;
};

type UploadImageResponse = { url: string; publicId: string; resourceType: string };

export default function EditCommunityPage({ params }: EditCommunityPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: mine, isLoading: communitiesLoading, isError: communitiesError } = useMyCommunities();
  const communityRef = mine?.find((item) => item.id === id || item.slug === id);
  const slug = communityRef?.slug ?? "";
  const { data: community, isLoading: communityLoading, isError: communityError, error: loadError } = useCommunity(slug);
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const [initializedFor, setInitializedFor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [imageUrl, setImageUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [coverError, setCoverError] = useState("");
  const [submitNotice, setSubmitNotice] = useState("");

  useEffect(() => {
    if (!community || initializedFor === community.id) return;
    setTitle(community.title);
    setDescription(community.description);
    setPrice(community.priceAmount);
    setImageUrl(community.imageUrl ?? "");
    setCategoryIds(community.categories.map((category) => category.id));
    setInitializedFor(community.id);
  }, [community, initializedFor]);

  const updateCommunity = useMutation({
    mutationFn: async ({ slug: communitySlug, body, coverFile: selectedFile }: UpdateCommunityVariables) => {
      let updatedBody = body;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploaded = await post<UploadImageResponse>("/uploads/images", formData);
        updatedBody = { ...body, imageUrl: uploaded.url };
      }
      return patch<CommunityDetail>(`/communities/${encodeURIComponent(communitySlug)}`, updatedBody);
    },
    onSuccess: async (savedCommunity) => {
      await queryClient.invalidateQueries({ queryKey: ["communities"] });
      router.push(`/studio/communities/${savedCommunity.id}`);
    },
  });

  function toggleCategory(categoryId: string) {
    setCategoryIds((selected) => selected.includes(categoryId)
      ? selected.filter((item) => item !== categoryId)
      : selected.length < 5 ? [...selected, categoryId] : selected);
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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitNotice("");
    if (!community || !slug) return;

    const body: CommunityUpdateBody = {};
    const nextTitle = title.trim();
    const nextDescription = description.trim();
    if (nextTitle !== community.title) body.title = nextTitle;
    if (nextDescription !== community.description) body.description = nextDescription;

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 99_999_999.99) {
      setSubmitNotice("Enter a valid price between 0 and 99,999,999.99 NGN.");
      return;
    }
    const formattedPrice = numericPrice.toFixed(2);
    if (formattedPrice !== Number(community.priceAmount).toFixed(2)) body.priceAmount = formattedPrice;

    if (!coverFile && imageUrl.trim() !== (community.imageUrl ?? "")) {
      body.imageUrl = imageUrl.trim() || null;
    }

    const existingCategoryIds = community.categories.map((category) => category.id).sort();
    const nextCategoryIds = [...categoryIds].sort();
    if (existingCategoryIds.join(",") !== nextCategoryIds.join(",")) {
      if (nextCategoryIds.length === 0 || nextCategoryIds.length > 5) {
        setSubmitNotice("Select at least one and no more than five backend categories.");
        return;
      }
      body.categoryIds = categoryIds;
    }

    if (Object.keys(body).length === 0 && !coverFile) {
      setSubmitNotice("There are no changes to save.");
      return;
    }

    updateCommunity.mutate({ slug, body, coverFile });
  }

  const loading = communitiesLoading || (Boolean(slug) && communityLoading);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={`/studio/communities/${id}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to community
      </Link>

      {loading ? (
        <p role="status" aria-busy="true" className="mt-6 flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin" />Loading community settings…</p>
      ) : communitiesError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">Could not load your communities from the backend.</div>
      ) : !communityRef ? (
        <div role="status" className="mt-6 rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-700">Community not found in your creator account.</div>
      ) : communityError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">Could not load this community. {loadError instanceof Error ? loadError.message : "Please try again."}</div>
      ) : community ? (
        <>
          <header className="mt-5 max-w-3xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-900"><Settings aria-hidden="true" className="h-6 w-6" /></span>
            <p className="label-eyebrow mt-5">Community settings</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Edit community</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">Changes are saved to the backend community record.</p>
          </header>

          <form onSubmit={submit} className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.8fr)]">
            <section className="space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_52px_-42px_rgba(8,47,73,.45)] sm:p-8">
              <label className="block text-sm font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><Type className="h-4 w-4" /> Community name</span>
                <input required minLength={3} maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-sky-200 px-4 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">Description
                <textarea required minLength={10} maxLength={5000} rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-xl border border-sky-200 px-4 py-3 font-normal leading-6 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" />
              </label>
              <div className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <label htmlFor="community-cover" className="block text-sm font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><ImagePlus className="h-4 w-4" aria-hidden="true" /> Cover image <span className="font-normal text-slate-500">(optional)</span></span></label>
                <input id="community-cover" type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={selectCover} className="block w-full cursor-pointer rounded-xl border border-sky-200 bg-white text-sm text-slate-700 file:mr-4 file:min-h-11 file:cursor-pointer file:border-0 file:bg-sky-100 file:px-4 file:font-semibold file:text-sky-950 hover:file:bg-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700" />
                <p className="text-xs leading-5 text-slate-600">PNG, JPEG, GIF or WebP, up to 5 MB. A selected image is uploaded through the backend before saving.</p>
                {coverFile && <p className="text-xs font-medium text-sky-900">Selected: {coverFile.name}</p>}
                {coverError && <p role="alert" className="text-sm text-red-700">{coverError}</p>}
                <label htmlFor="community-cover-url" className="block text-xs font-medium text-slate-600">Or use an existing image URL</label>
                <input id="community-cover-url" type="url" value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); if (event.target.value) setCoverFile(undefined); }} className="h-11 w-full rounded-xl border border-sky-200 bg-white px-4 text-sm font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" placeholder="https://…" />
              </div>
              <label className="block max-w-sm text-sm font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4" /> One-time price (NGN)</span>
                <input type="number" min="0" max="99999999.99" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-sky-200 px-4 font-normal outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100" />
              </label>
              {updateCommunity.isError && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <p>{updateCommunity.error.message}</p>
                  {updateCommunity.error instanceof ApiError && updateCommunity.error.code === "creator_profile_required" && <p className="mt-2">Complete your creator profile first. <Link href="/onboarding" className="font-semibold underline">Go to creator onboarding</Link>.</p>}
                </div>
              )}
              {submitNotice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">{submitNotice}</p>}
              <div className="flex flex-wrap gap-3 border-t border-sky-100 pt-5">
                <Button type="submit" disabled={updateCommunity.isPending}>
                  {updateCommunity.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {updateCommunity.isPending ? "Saving…" : "Save changes"}
                </Button>
                <Button type="button" variant="outline" asChild><Link href={`/studio/communities/${id}`}>Cancel</Link></Button>
              </div>
            </section>

            <aside className="h-fit rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/70 p-5 sm:p-7">
              <p className="label-eyebrow inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Categories</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">Choose up to five</h2>
              {categoriesLoading ? <p className="mt-4 text-sm text-slate-600">Loading backend categories…</p>
                : categoriesError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">Could not load categories. Existing category assignments will be left unchanged.</p>
                : categories.length === 0 ? <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">The backend currently has no categories. Category changes are unavailable; existing assignments will be preserved while other fields can still be updated.</p>
                : <div className="mt-4 space-y-2">{categories.map((category) => <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-sky-100 bg-white p-3 text-sm text-slate-800"><input type="checkbox" checked={categoryIds.includes(category.id)} onChange={() => toggleCategory(category.id)} disabled={!categoryIds.includes(category.id) && categoryIds.length >= 5} className="h-4 w-4 accent-sky-800" />{category.name}</label>)}</div>}
              {!categoriesLoading && !categoriesError && categories.length > 0 && <p className="mt-4 text-xs text-slate-500">{categoryIds.length}/5 selected. Only categories returned by the backend are offered.</p>}
            </aside>
          </form>
        </>
      ) : null}
    </main>
  );
}
