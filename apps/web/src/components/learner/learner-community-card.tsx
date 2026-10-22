import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { VerifiedMark } from "@/components/public/verified-mark";
import { CommunityCover } from "@/components/ui/community-cover";
import type { CommunityDetail, CommunityRef } from "@/types/api";

/**
 * The learner's community card.
 *
 * Cover, title and price come from the enrollment reference; the creator
 * (name, photo, verified mark) comes from `GET /communities/{slug}`. When
 * that request fails the card still renders from the reference alone.
 */

export interface LearnerCommunityCardProps {
  community: CommunityRef;
  detail?: CommunityDetail;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  /** The trailing link label — "Continue" while work remains. */
  actionLabel?: string;
  /** Optional status marker, e.g. an enrollment state. */
  badge?: React.ReactNode;
  className?: string;
}

export function LearnerCommunityCard({
  community,
  detail,
  completedLessons,
  totalLessons,
  percentComplete,
  actionLabel,
  badge,
  className,
}: LearnerCommunityCardProps) {
  const creator = detail?.creator;
  const complete = totalLessons > 0 && completedLessons >= totalLessons;

  return (
    <Link
      href={`/communities/${encodeURIComponent(community.slug)}/classroom`}
      className={cn("community-card card-hover", className)}
    >
      <div className="community-card-cover overflow-hidden">
        <CommunityCover
          src={community.imageUrl}
          title={community.title}
        />
      </div>
      <div className="community-card-body">
        <h3 className="community-card-title">{community.title}</h3>

        {creator ? (
          <p className="community-card-creator">
            <Avatar name={creator.displayName} src={creator.avatarUrl} size="sm" />
            <span className="truncate">{creator.displayName}</span>
            {creator.isVerified ? <VerifiedMark size={13} /> : null}
          </p>
        ) : null}

        {community.isFree ? (
          <span className="badge badge-fill-accent" style={{ alignSelf: "flex-start" }}>
            Free
          </span>
        ) : null}

        {badge ? <span style={{ alignSelf: "flex-start" }}>{badge}</span> : null}

        <div>
          <div className="progress" style={{ marginBottom: 6 }}>
            <div
              className={cn("progress-bar", complete && "progress-bar-ink")}
              style={{ width: `${Math.min(100, Math.max(0, percentComplete))}%` }}
            />
          </div>
          <div className="flex items-center justify-between" style={{ gap: 8 }}>
            <span className="text-xs muted tnum">
              {complete
                ? `${completedLessons} of ${totalLessons} lessons · Complete`
                : `${completedLessons} of ${totalLessons} lessons · ${percentComplete}%`}
            </span>
            {actionLabel ? (
              <span className="text-xs" style={{ color: "var(--accent)", fontWeight: 500 }}>
                {actionLabel} →
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
