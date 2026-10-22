# Interlekt Next-Agent Engineering & Implementation Guide

> **Notice for the Next Agent**: Read this document first before taking any action. It is the single source of truth for the project state, architectural rules, backend contract, and implementation roadmap. Follow this to ensure zero drift.

---

## 1. Current State (Live & Operational)

### Infrastructure & Backend Connection
- **Live Backend URL**: `https://interlekt-backend.onrender.com`
- **Frontend Framework**: Next.js 15 (App Router, React 19, Tailwind CSS, TypeScript, TanStack React Query v5).
- **Zero Mock Policy**: **Strictly enforced**. No fabricated mock objects, fake counters, or synthetic API delays. Every active component reads from the live Render API.
- **Brand Identity**:
  - Authentic Interlekt Crest vector mark (`#073B63` deep navy + `#18A9E2` cyan).
  - Located in `apps/web/src/app/icon.svg` (browser favicon), `apps/web/src/components/brand.tsx`, and `apps/web/src/components/logo.tsx`.
  - Typography: Clean Inter font hierarchy throughout. No custom decorative fonts.
- **Universal Architectural Covers**:
  - `apps/web/src/components/ui/community-cover.tsx`: Deterministic minimalist dark-mesh/grid covers with tag chips for communities without custom cover images or invalid external URLs (`images.example.com`).
  - No stereotypical or generic imagery.
- **Copy & UX Standards**:
  - Calm, premium, Skool/Linear-grade UX.
  - No developer-speak, raw technical toasts, or apologetic copy (e.g. removed "Payments in naira via Paystack" or raw 402 payment errors; now surfaces calm "Cohort Enrollment Opening Soon").
  - `Sort by` dropdown is anchored in the top grid toolbar on `/communities` and `/search` (not buried at the bottom).

---

## 2. Active Implemented Screens (43+ Routes)

The following route groups are fully implemented, typed, and wired to live backend endpoints:
1. **Public Marketing & Discovery**:
   - `/` - Landing page with live featured communities and categories.
   - `/communities` - Directory with live category filter chips, search, and top-toolbar sorting.
   - `/communities/[slug]` - Public community landing with pricing card, curriculum outline, live reviews summary, and enrollment CTA.
   - `/search` - Unified search across communities.
   - `/creators/[slug]` - Public creator profile with authored communities.
   - `/about`, `/privacy`, `/terms`, `/cookies`, `/refunds`, `/trust`, `/help` - Static informational pages.
2. **Authentication**:
   - `/auth/login` - Unified credential sign-in (email/password).
   - `/auth/register` - Clean registration flow with role selection.
   - `/auth/forgot-password` & `/auth/reset-password` - Password recovery flows.
   - `/logout` - Session invalidation and cache clear.
3. **Learner Portal**:
   - `/dashboard` - Overview of enrolled communities, quick stats, and continue learning.
   - `/my-communities` - Grid of enrolled spaces.
   - `/profile` - Learner bio, details, and activity.
   - `/settings` - Notification and account preferences.
   - `/enroll/[communityId]` - Enrollment and checkout handling.
   - `/communities/[slug]/feed` - Member discussion feed.
   - `/communities/[slug]/classroom` - Course modules and lessons list.
   - `/communities/[slug]/classroom/lessons/[lessonId]` - Interactive video player, lesson content, and navigation.

---

## 3. What the Backend Engineer Is Building

The document [`docs/redesign/BACKEND-DEVELOPER-HANDOFF.md`](file:///C:/Users/Owner/Documents/interlekt/docs/redesign/BACKEND-DEVELOPER-HANDOFF.md) was created in founder voice and shared with the backend developer. It outlines the missing API capabilities required for the remaining 39 screens:

1. **Tag System**:
   - `tags: string[]` on `Community` model.
   - `GET /api/v1/tags/trending` for dynamic tag pills.
2. **Profile Banners & Avatars**:
   - `bannerUrl: string | null` and `avatarUrl: string | null` on `User` and `CreatorProfile`.
   - `POST /api/v1/users/me/avatar` and `POST /api/v1/users/me/banner` (multipart upload).
3. **Creator Studio Management**:
   - `GET /api/v1/creator/analytics` (MRR, active learners, churn rate, retention).
   - `GET /api/v1/creator/payouts` & `POST /api/v1/creator/payouts/request`.
   - `GET /api/v1/creator/communities/[id]/members` (member management, ban, role update).
   - `POST /api/v1/creator/communities/[id]/curriculum` (full module/lesson builder CRUD).
4. **Interactive Features**:
   - Gamification: `GET /api/v1/communities/[id]/leaderboard` (levels, XP, streaks).
   - Calendar/Events: `GET /api/v1/communities/[id]/events` (live community calls, calendar integration).
   - Direct Messaging: `GET /api/v1/messages/threads` & `POST /api/v1/messages`.
   - Reviews CRUD: `POST /api/v1/communities/[id]/reviews`.

---

## 4. Next Agent Action Plan (When Backend Endpoints Are Ready)

When the backend developer confirms new endpoints are deployed to `https://interlekt-backend.onrender.com`:

### Step 1: Update TypeScript Types & Client
- Update `apps/web/src/types/api.ts` with new interfaces:
  - `LeaderboardEntry`, `CommunityEvent`, `CreatorAnalytics`, `PayoutRecord`, `DirectMessageThread`.
- Add endpoint wrapper functions in `apps/web/src/lib/api/client.ts`.
- Add query keys in `apps/web/src/lib/query-keys.ts`.

### Step 2: Implement Remaining Held Screens (Reference: `docs/redesign/`)
Implement the 39 held screens step-by-step:
1. **Gamification & Leaderboard**:
   - `apps/web/src/app/(learner)/communities/[slug]/leaderboard/page.tsx`
   - Wire to `GET /api/v1/communities/[id]/leaderboard`.
2. **Community Events & Calendar**:
   - `apps/web/src/app/(learner)/communities/[slug]/calendar/page.tsx`
   - Wire to `GET /api/v1/communities/[id]/events`.
3. **Creator Studio Full Suite**:
   - `/studio/analytics` - MRR charts, engagement graphs.
   - `/studio/members` - Member directory, search, tier filters.
   - `/studio/payouts` - Bank account linking, withdrawal history.
   - `/studio/communities/[slug]/curriculum` - Drag-and-drop course builder.
4. **Direct Messaging & Notifications**:
   - `/messages` - Chat inbox and real-time thread viewer.
   - `/notifications` - Actionable activity feed.

### Step 3: Strict Rules for the Next Agent
1. **NEVER introduce mock data**: If an endpoint is missing, do NOT fabricate data; show a clean, typed empty/loading state or calm fallback.
2. **Preserve Authentic Branding**: Always use the official Interlekt crest SVG. Never generate random logo icons or replace the favicon.
3. **Verify Build**: Always run `pnpm --filter web build` before finishing to guarantee zero TypeScript or Next.js route errors.
4. **Consistent Components**: Reuse `apps/web/src/components/ui/` primitives (`CommunityCover`, `Button`, `Badge`, `Card`, `Avatar`).
