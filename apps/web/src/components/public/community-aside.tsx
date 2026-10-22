"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Money } from "@/components/ui/data-display";
import { Icon } from "@/components/ui/icon";
import { VerifiedMark } from "@/components/public/verified-mark";
import { timeAgo } from "@/lib/dates";
import type { CommunityDetail, CreatorProfileResponse, EnrollmentResponse } from "@/types/api";

/**
 * The sticky right-hand column of the community detail page: the enrolment
 * card, the creator card, what a membership includes, and the member count.
 *
 * Every claim here is derived from the community or creator payload. There
 * is no billing interval, no money-back window and no payment provider in
 * the API yet, so none of those are promised.
 */

export interface CommunityAsideProps {
  community: CommunityDetail;
  enrollment: EnrollmentResponse | null;
  isOwner: boolean;
  /** Creator accounts manage communities; enrollment is learner-only. */
  isCreator?: boolean;
  /** `GET /creators/{user_id}` — used for the published community count. */
  creator?: CreatorProfileResponse;
  /** Where the primary call to action points. */
  enrollHref: string;
}

export function CommunityAside({
  community,
  enrollment,
  isOwner,
  isCreator = false,
  creator,
  enrollHref,
}: CommunityAsideProps) {
  const isEnrolled = enrollment?.status === "active";

  const included: string[] = [];
  const lessonTotal = community.courses.reduce((sum, course) => sum + course.lessonCount, 0);
  const moduleTotal = community.courses.reduce((sum, course) => sum + course.moduleCount, 0);
  if (lessonTotal > 0) {
    included.push(
      `${lessonTotal} ${lessonTotal === 1 ? "lesson" : "lessons"} across ${moduleTotal} ${
        moduleTotal === 1 ? "module" : "modules"
      }`,
    );
  }
  included.push("Full classroom access to every published course, module and lesson");
  included.push("A community feed with the creator and other members");
  included.push("Progress saved to your account as you complete lessons");

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Enrol */}
      <div className="card">
        <div className="flex items-baseline" style={{ marginBottom: 20 }}>
          <Money
            amount={community.priceAmount}
            currency={community.priceCurrency}
            isFree={community.isFree}
            className="text-32"
          />
        </div>

        {isOwner ? (
          <Link className="btn btn-primary btn-block" href={`/studio/communities/${community.id}`}>
            Manage community
          </Link>
        ) : isCreator ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950" role="status">
            Creator accounts can browse communities, but can&apos;t enroll as learners. Use a learner account to join.
          </div>
        ) : isEnrolled ? (
          <>
            <Link className="btn btn-primary btn-block" href={`/communities/${community.slug}/classroom`}>
              Go to classroom
            </Link>
            <Link
              className="btn btn-ghost btn-block"
              href={`/communities/${community.slug}/feed`}
              style={{ marginTop: 12, fontSize: "var(--fs-14)" }}
            >
              Join the discussion
            </Link>
          </>
        ) : (
          <Link className="btn btn-primary btn-block" href={enrollHref}>
            {community.isFree ? "Join for free" : "Enroll now"}
          </Link>
        )}

        <hr className="divider-soft" />

        <div
          className="flex flex-wrap items-center justify-between"
          style={{ gap: 12, fontSize: "var(--fs-13)", color: "var(--ink-3)" }}
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="users" size={14} />
            <span className="tnum" style={{ color: "var(--ink-2)" }}>
              {community.memberCount.toLocaleString()} enrolled
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="clock" size={14} />
            <span>Updated {timeAgo(community.updatedAt)}</span>
          </span>
        </div>
      </div>

      {/* Creator */}
      <div className="card">
        <p className="text-xs muted" style={{ marginBottom: 14, fontWeight: 500 }}>
          Creator
        </p>
        <div className="flex items-center" style={{ gap: 12, marginBottom: 16 }}>
          <Avatar name={community.creator.displayName} src={community.creator.avatarUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-2" style={{ fontWeight: 600, color: "var(--ink)" }}>
              <span className="truncate">{community.creator.displayName}</span>
              {community.creator.isVerified ? <VerifiedMark size={14} /> : null}
            </p>
            {creator ? (
              <p className="text-xs muted tnum">
                {creator.communityCount.toLocaleString()}{" "}
                {creator.communityCount === 1 ? "community" : "communities"}
              </p>
            ) : null}
          </div>
        </div>
        <Link className="btn btn-secondary btn-block" href={`/creators/${community.creator.userId}`}>
          View profile
        </Link>
      </div>

      {/* What's included */}
      <div className="card">
        <p className="text-xs muted" style={{ marginBottom: 16, fontWeight: 500 }}>
          What&apos;s included
        </p>
        <ul className="flex flex-col" style={{ gap: 12 }}>
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-14" style={{ color: "var(--ink-2)" }}>
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ink" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Members */}
      <div className="card">
        <p className="text-xs muted" style={{ marginBottom: 16, fontWeight: 500 }}>
          Members
        </p>
        <p className="text-sm" style={{ color: "var(--ink-2)" }}>
          <span className="tnum" style={{ color: "var(--ink)", fontWeight: 500 }}>
            {community.memberCount.toLocaleString()}
          </span>{" "}
          {community.memberCount === 1 ? "person has" : "people have"} joined this community.
        </p>
        <p className="text-xs muted" style={{ marginTop: 8 }}>
          Member lists aren&apos;t published on community pages.
        </p>
      </div>
    </div>
  );
}
