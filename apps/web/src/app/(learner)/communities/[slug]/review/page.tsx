"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { useCommunityReviews } from "@/hooks/use-learner-data";
import { useCommunity } from "@/hooks/use-communities";
import { useMe } from "@/hooks/use-auth";
import { ApiError, patch, post } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";

/**
 * B17 — write a review.
 *
 * `POST /communities/{slug}/reviews` takes a rating and a body; an existing
 * review is updated with `PATCH /reviews/{id}`. The design's "would you
 * recommend" radio and "show your name publicly" toggle have no fields in
 * `ReviewCreateRequest`, so they are not rendered.
 */

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const reviewSchema = z.object({
  rating: z.number().min(1, "Pick a rating before you submit"),
  content: z.string().max(2000, "Keep your review under 2000 characters"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export default function WriteReviewPage({ params }: ReviewPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: community } = useCommunity(slug);
  const { data: account } = useMe();
  const reviews = useCommunityReviews(slug);
  const [saved, setSaved] = useState(false);

  const existing = (reviews.data ?? []).find((review) => review.authorId === account?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, content: "" },
  });

  useEffect(() => {
    if (existing) {
      reset({ rating: existing.rating, content: existing.content ?? "" });
    }
  }, [existing, reset]);

  const rating = watch("rating");
  const content = watch("content") ?? "";

  const submit = useMutation({
    mutationFn: async (values: ReviewForm) => {
      const body = { rating: values.rating, content: values.content.trim() || null };
      if (existing) {
        return patch(`/reviews/${encodeURIComponent(existing.id)}`, body);
      }
      return post(`/communities/${encodeURIComponent(slug)}/reviews`, body);
    },
    onSuccess: () => {
      setSaved(true);
      router.push(`/communities/${encodeURIComponent(slug)}`);
    },
  });

  const gated =
    submit.error instanceof ApiError && (submit.error.status === 401 || submit.error.status === 403);

  return (
    <div className="container" style={{ maxWidth: 720, paddingTop: 56, paddingBottom: 96 }}>
      {/* ============== BREADCRUMB ============== */}
      <nav className="breadcrumb" style={{ marginBottom: 32 }} aria-label="Breadcrumb">
        <Link href="/my-communities">My communities</Link>
        <span className="sep">›</span>
        <Link href={`/communities/${encodeURIComponent(slug)}`}>{community?.title ?? slug}</Link>
        <span className="sep">›</span>
        <span className="current">Write review</span>
      </nav>

      {/* ============== PAGE HEADER ============== */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="h1" style={{ margin: "0 0 12px" }}>
          Review {community?.title ?? "this community"}
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-2)", margin: 0 }}>
          Your honest feedback helps other learners decide
          {community?.creator.displayName ? `, and helps ${community.creator.displayName} improve` : ""}.
        </p>
      </div>

      {gated ? (
        <div style={{ marginBottom: 24 }}>
          <Alert variant="warning" icon="info" title="This review can't be submitted yet">
            Only members who can access this community can review it. If you haven&apos;t joined,{" "}
            <Link href={`/enroll/${encodeURIComponent(slug)}`} style={{ color: "var(--accent-ink)" }}>
              join the community
            </Link>{" "}
            first.
          </Alert>
        </div>
      ) : null}

      <form onSubmit={handleSubmit((values) => submit.mutate(values))}>
        {/* ============== STAR RATING ============== */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <p className="field-label" style={{ display: "block", marginBottom: 16 }}>
            Your rating
          </p>
          <div className="flex" style={{ gap: 8, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                type="button"
                aria-label={`${step} star${step > 1 ? "s" : ""}`}
                aria-pressed={rating === step}
                onClick={() => setValue("rating", step, { shouldValidate: true })}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <Star
                  width={32}
                  height={32}
                  fill={step <= rating ? "#F59E0B" : "none"}
                  stroke={step <= rating ? "#F59E0B" : "var(--ink-5)"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          {errors.rating ? (
            <p className="field-error" role="alert">
              {errors.rating.message}
            </p>
          ) : (
            <p className="text-sm" style={{ color: "var(--ink-2)", margin: 0 }}>
              <span style={{ fontWeight: 500, color: "var(--ink)" }}>{rating || "—"} out of 5</span>
              {rating ? ` — ${RATING_LABELS[rating]}` : ""}
            </p>
          )}
        </div>

        {/* ============== YOUR REVIEW ============== */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <Field
            label="Your review"
            htmlFor="review-content"
            error={errors.content?.message}
          >
            <Textarea
              id="review-content"
              rows={6}
              placeholder="What did you love? What could be better? Be specific and constructive."
              {...register("content")}
            />
          </Field>
          <div
            className="field-help flex flex-wrap items-center justify-between"
            style={{ gap: 12 }}
          >
            <span>Mention: content quality, mentor engagement, community vibe, value for money.</span>
            <span className="tnum">{content.length} / 2000</span>
          </div>
        </div>

        {/* ============== SUBMIT ============== */}
        {submit.isError && !gated ? (
          <div style={{ marginBottom: 16 }}>
            <Alert variant="danger" icon="alertCircle" title="Your review could not be saved">
              {apiErrorMessage(submit.error)}
            </Alert>
          </div>
        ) : null}

        <div className="flex flex-col" style={{ gap: 12 }}>
          <Button type="submit" size="lg" loading={submit.isPending}>
            {existing ? "Update review" : "Submit review"}
          </Button>
        </div>

        <p className="text-xs muted" style={{ textAlign: "center", marginTop: 16 }}>
          {existing
            ? "You can update your review from this page at any time."
            : "You can edit your review from this page once it is submitted."}
        </p>
      </form>

      {saved ? <p className="sr-only">Review saved</p> : null}
    </div>
  );
}
