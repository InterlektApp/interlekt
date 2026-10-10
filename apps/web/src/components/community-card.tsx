import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";
import { MoneyAmount } from "@/components/money-amount";
import { VerificationBadge } from "@/components/verification-badge";
import type { CommunityListItem } from "@/types/api";

interface CommunityCardProps {
  community: CommunityListItem;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/communities/${community.slug}`}
      className="lift group overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_10px_28px_-24px_rgba(7,52,81,.42)]"
    >
      <div className="relative aspect-[16/9] bg-slate-100">
        {community.imageUrl ? (
          <Image
            src={community.imageUrl}
            alt={community.title}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100 text-4xl font-bold text-blue-300">
            {community.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-sky-800">
          {community.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <span className="truncate">{community.creator.displayName}</span>
          <VerificationBadge status={community.creator.verificationStatus} size="sm" />
        </p>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{community.excerpt}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5" />
            {community.memberCount.toLocaleString()}
          </span>
          <MoneyAmount
            priceAmount={community.priceAmount}
            currency={community.priceCurrency}
            isFree={community.isFree}
          />
        </div>
      </div>
    </Link>
  );
}
