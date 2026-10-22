# Mapping — Creator shell (20 screens)

> Source of truth: `backend-openapi.json` (47 paths) **plus live probes** against
> `https://interlekt-backend.onrender.com/api/v1` on 2026-10-21 (creator account
> registered, community + course + module + lesson created, every creator endpoint read).
> Frontend conventions verified in `apps/web/src/` (Next 15 App Router, React 19, TanStack Query,
> `API_BASE = "/api/v1"` via `next.config.ts` rewrites, `Authorization: Bearer <accessToken>`,
> tokens in `localStorage` — **no cookies**).

## Summary
- Screens mapped: 20
- LIVE: 0 · PARTIAL: 10 · MOCK: 0 · NEEDS-BACKEND: 10
- Backend endpoints used (existing): `GET /api/v1/creators/me` · `PUT /api/v1/creators/me` ·
  `GET /api/v1/creators/me/courses` · `GET /api/v1/users/me` · `PATCH /api/v1/users/me` ·
  `GET /api/v1/categories` · `GET /api/v1/communities/mine` · `GET /api/v1/communities/{slug}` ·
  `PATCH /api/v1/communities/{slug}` · `POST /api/v1/communities` ·
  `POST /api/v1/communities/{slug}/publish` · `POST /api/v1/communities/{slug}/unpublish` ·
  `GET /api/v1/communities/{slug}/members` · `GET /api/v1/communities/{slug}/courses` ·
  `POST /api/v1/communities/{slug}/courses` · `GET|PATCH|DELETE /api/v1/courses/{course_id}` ·
  `POST /api/v1/courses/{course_id}/publish|unpublish` · `GET|POST /api/v1/courses/{course_id}/modules` ·
  `PATCH /api/v1/courses/{course_id}/modules/reorder` · `PATCH|DELETE /api/v1/modules/{module_id}` ·
  `GET|POST /api/v1/modules/{module_id}/lessons` · `POST /api/v1/modules/{module_id}/lessons/reorder` ·
  `GET|PATCH|DELETE /api/v1/lessons/{lesson_id}` · `POST /api/v1/lessons/{lesson_id}/publish|unpublish` ·
  `GET|POST /api/v1/communities/{slug}/posts` · `PATCH|DELETE /api/v1/posts/{post_id}` ·
  `GET /api/v1/posts/{post_id}/comments` · `GET /api/v1/communities/{slug}/reviews` ·
  `POST /api/v1/uploads/images` · (`PATCH /api/v1/admin/creators/{user_id}/verification` — **admin only**,
  unusable by the creator screen)
- Backend endpoints that must be built (NEW) — see *Backend gaps consolidated* for full contracts:
  `GET /api/v1/communities/{slug}/transactions` + `/transactions/summary` ·
  `GET /api/v1/communities/{slug}/payouts` · `GET|POST /api/v1/creators/me/payouts` ·
  `PATCH /api/v1/creators/me/payout-account` · `GET /api/v1/creators/me/revenue` ·
  `GET /api/v1/creators/me/statements` · `GET|PUT /api/v1/creators/me/tax` ·
  `GET|POST|PATCH|DELETE /api/v1/communities/{slug}/discount-codes` ·
  `GET /api/v1/communities/{slug}/discount-codes/summary` ·
  `GET /api/v1/communities/{slug}/analytics` · `GET /api/v1/creators/me/analytics` ·
  `GET /api/v1/notifications` + `/notifications/summary` + `PATCH /api/v1/notifications/{id}/read` +
  `POST /api/v1/notifications/read-all` · `GET|PUT /api/v1/me/notification-preferences` ·
  `GET /api/v1/creators/me/verification` · `POST /api/v1/creators/me/verification` ·
  `GET /api/v1/communities/{slug}/members/{user_id}/progress` ·
  `POST /api/v1/posts/{id}/vote` · `POST /api/v1/posts/{id}/report` · `GET /api/v1/posts/{id}/reports` ·
  `POST /api/v1/communities/{slug}/archive|restore` · `DELETE /api/v1/communities/{slug}`

### Live backend facts that decide this mapping (probed, not assumed)

| Probe | Result |
|---|---|
| `GET /categories` (anon) | 200. **8 categories** (`id,name,slug,description`). **No counts** — C3/C5's "· 184 communities" has no source. The design's 10 categories ≠ the backend's 8. |
| `GET /communities` (anon) | 200. **4 seed communities**; `memberCount` 0–5; `rating` 4.5/5.0 on 2 of them; `reviewCount` 0–2; `priceAmount` `"2500.00"`/`"5000.00"`/`"0.00"`, `priceCurrency:"NGN"`. |
| `GET /transactions` `/payouts` `/payments` `/orders` `/discount-codes` `/notifications` `/analytics` `/stats` `/reports` | **404 on every one.** No money, no analytics, no notifications, no discount codes exist. |
| `GET /creators/me` (creator token) | 200. Live body = `userId,displayName,avatarUrl,bio,expertise[],verificationStatus,isVerified,communityCount,createdAt`. **`memberCount` is declared in OpenAPI but NOT returned live.** No `headline`, no `coverUrl`, no `socialLinks`, no `verifiedAt`. |
| `PUT /creators/me` | 200. **Accepts and persists `expertise` only.** Unknown keys (`headline`, `socialLinks`, `coverUrl`) are silently dropped — no error, no persistence. |
| `POST /communities` | 200 → `CommunityDetail` (`id,title,slug,description,imageUrl,priceAmount:"8500.00",priceCurrency:"NGN",isFree:false,memberCount:0,rating:null,reviewCount:0,isPublished:false,categories[],creator,courses:[],createdAt,updatedAt`). Guards: **422 `creator_profile_required`** if `expertise` is empty; 422 `validation_error` if `description` < 10 chars (`details[].field/message`). |
| `GET /communities/{slug}` | 200. **`courses[]` is ALWAYS `[]`** even for a community that has a published course — the embedded course list is not hydrated. C4's "2 courses · 5 modules · 20 lessons" must come from `GET /communities/{slug}/courses` + `GET /courses/{id}`. |
| `GET /communities/{slug}/courses` | 200 → `Paginated<CourseResponse>`; `CourseResponse` has **no `moduleCount`/`lessonCount`** (only `CourseDetail`/`CourseSummary` do). |
| `POST /communities/{slug}/courses` | 200 → **full `CourseDetail`** (with `modules[]`), not the bare `CourseResponse` the OpenAPI implies. |
| `POST /courses/{id}/modules` | 200 → `ModuleResponse` with **`isPublished:true` by default** (not sent by the client). |
| `POST /modules/{id}/lessons` | 200 → `LessonResponse`; `publishedAt` stays **null** even with `isPublished:true`; `contentType` enum is `text|video` only — **there is no "Both"**. |
| `GET /communities/{slug}/members` | 200 → `Paginated<MemberResponse>` = `{userId,displayName,avatarUrl,status,joinedAt}`. **No email, no plan, no amount, no progress.** `status` ∈ `pending\|active\|cancelled` — no "paused"/"refunded". |
| `GET /communities/{slug}/posts` | 200 → `Paginated<PostResponse>` = `{id,communityId,authorId,author,content,isPinned,isAnnouncement,commentCount,createdAt,updatedAt}`. **No votes, no views, no lock, no report, no tags, no anonymous author.** |
| `GET /communities/{slug}/reviews` | 200 → `Paginated<ReviewResponse>` = `{id,communityId,authorId,author,rating,content,createdAt,updatedAt}`. |
| `POST /communities/{slug}/publish` | 200 → `CommunityDetail` with `isPublished:true`; `updatedAt` moves to the publish moment (no dedicated `publishedAt` field). |
| Error envelope | `{ "error": { "code", "message", "details" } }`. Codes seen: `validation_error`, `creator_profile_required`, `not_found`, `http_error`, `payment_required`, `already_enrolled`, `own_community`. |

### Frontend reality (what exists vs what must be rewritten)

| Design screen | Next.js route | Today | Action |
|---|---|---|---|
| C1 | `/onboarding` | **EXISTS** `app/(creator)/onboarding/page.tsx` — already calls `GET|PUT /creators/me`; one textarea for expertise only | Rewrite to design; add headline/bio/photo fields → needs 2 new backend fields |
| C2 | `/studio` | **EXISTS** `app/(creator)/studio/page.tsx` — `GET /communities/mine` + `GET /creators/me`; "Attributed revenue" card already renders `"—"` with the hint *"Shows once payments go live"* | Rewrite; keep the community grid, add revenue chart |
| C3 | `/studio/communities/new` | **EXISTS** — `POST /communities` + `POST /uploads/images` + `GET /categories`; **already treats the backend's one-price model as "One-time price (NGN)"** | Rewrite to 3-step wizard; needs `tags`, `learningOutcomes`, `pricingModel` |
| C4 | `/studio/communities/[id]` | **EXISTS** — `GET /communities/mine` + publish/unpublish mutation; 2 stat cards only | Rewrite; add readiness, enrollments, top lessons, revenue |
| C5 | `/studio/communities/[id]/edit` | **EXISTS** — `GET /communities/{slug}` + `PATCH /communities/{slug}` + upload; categories rendered as checkboxes | Rewrite to 4 tabs; needs pricing model, discounts, archive/delete |
| C6 | `/studio/communities/[id]/members` | **EXISTS** — `GET /communities/{slug}/members` via `useMembers()`; renders a plain list of displayName + status | Rewrite to table with filters/pagination; needs email/plan/amount/progress |
| C7 | `/studio/communities/[id]/transactions` | **EXISTS** — and it is already an **honest placeholder page** that states *"Transaction history and payout records are unavailable because the backend does not currently expose a community transactions or payouts endpoint"* | Replace wholesale once the money subsystem exists |
| C8 | `/studio/communities/[id]/course-builder` | **EXISTS** — full courses→modules→lessons CRUD, reorder, publish, delete | Rewrite to 2-pane tree; needs prerequisite + lock states + counts on the list endpoint |
| C9 | `/studio/communities/[id]/lesson-editor` | **EXISTS** — full lesson CRUD + reorder + publish via `isPublished` flag | Rewrite to 2-pane; needs resources, preview toggles, prereq, lock date, "Both" type |
| C10 | `/studio/payouts` | **NEW** — no route | Build |
| C11 | `/studio/analytics` | **NEW** — no route | Build (blocked on analytics + money) |
| C12 | `/studio/communities/[id]/discounts` | **NEW** — no route | Build (blocked on discount resource) |
| C13 | `/studio/settings` | **NEW** — no route; the only settings route today is the learner `B10-settings` equivalent | Build settings shell (240px sidebar) + overview |
| C14 | `/studio/notifications` | **NEW** — no route; backend has no notifications at all | Build (blocked on notifications) |
| C15 | `/studio/settings/public-profile` | **NEW** — no route | Build (needs headline/socialLinks/coverUrl) |
| C16 | `/studio/settings/payouts` | **NEW** — no route; duplicates C10 | Build (same data as C10 — pick one, link the other) |
| C17 | `/studio/settings/tax` | **NEW** — no route | Build (blocked on tax profile) |
| C18 | `/studio/settings/revenue` | **NEW** — no route | Build (blocked on revenue) |
| C19 | `/studio/settings/verification` | **NEW** — no route; admin verification route exists but is admin-only | Build (needs verification detail resource) |
| C20 | `/studio/communities/[id]/discussions` | **NEW** — no route | Build on `GET /communities/{slug}/posts`; needs votes/lock/report/tags |

**Shared components already available for the rewrite:** `StatCard`, `CommunityCard`, `MoneyAmount`
(`components/money-amount.tsx`), `Button` (`components/ui/button.tsx`), `useMyCommunities`,
`useCommunity`, `useCategories`, `useMembers`, `useMyCreatorProfile`, `useUpdateMyCreatorProfile`,
`api/get/post/patch/del` (`lib/api/client.ts`), `Paginated<T>` (`types/api.ts`).
**Types still to add** to `src/types/api.ts`: `CreatorProfileResponse` is missing `headline`,
`coverUrl`, `socialLinks`, `verifiedAt`, `verificationId`; `MemberResponse` is missing `email`,
`plan`, `amountPaid`, `progressPercent`; `CommunityListItem`/`CommunityDetail` are missing `tags`,
`learningOutcomes`, `pricingModel`, `lifetimePriceAmount`, `billingInterval`, `publishedAt`.

## Table

| Screen ID | Design file | Next.js route | Status | Backend endpoint(s) | Data fields the screen needs | Notes / gaps |
|---|---|---|---|---|---|---|
| C1 | `creator/C1-onboarding.html` | `/onboarding` | **EXISTING · PARTIAL** | `GET|PUT /creators/me`, `GET|PATCH /users/me`, `POST /uploads/images` | `displayName`, `avatarUrl`, `bio`, `expertise[]`; **headline**, **coverUrl**, step state, 88/10/2 share copy, ₦487,200/mo example | Headline + cover banner have **no field**; wizard steps 3 (Payouts) and 4 (Review) are money screens |
| C2 | `creator/C2-studio-home.html` | `/studio` | **EXISTING · NEEDS-BACKEND** (M) | `GET /creators/me`, `GET /communities/mine` | creator name, verified badge, 3 community tiles (title/image/category/price/memberCount), total members; **monthly revenue +12.4% MoM**, **₦4.1M lifetime**, **8-week revenue series**, **per-community revenue + growth %**, **5-row activity feed** | 2 of 4 stats + the entire centre chart + the activity feed's money row are unbacked |
| C3 | `creator/C3-new-community.html` | `/studio/communities/new` | **EXISTING · PARTIAL** | `POST /communities`, `GET /categories`, `POST /uploads/images` | `title`, `description`, `categoryIds[]`, `imageUrl`; **category counts**, **tags[]**, **learningOutcomes[]**, **pricing model radios (Free/One-time/Monthly/Mixed)**, gallery set, 3 listing tips | Core CRUD is LIVE; the design's wizard Step 2 (Pricing) has no model to write to |
| C4 | `creator/C4-community-manage.html` | `/studio/communities/[id]` | **EXISTING · NEEDS-BACKEND** (M) | `GET /communities/{slug}`, `GET /communities/{slug}/members`, `GET /communities/{slug}/courses`, `GET /courses/{id}`, `GET /communities/{slug}/reviews` | `title`, `isPublished`, `memberCount`, `rating`, `reviewCount`, `categories[]`, `createdAt`; **revenue this month + MoM**, **completion rate 67%**, **"1,184 active"**, **"142 payments"**, **course/module/lesson counts**, **"18 published · 2 drafts"**, **top-lesson completion % + avg time**, **enrollment Amount + Plan** | Readiness checklist & quick links compute client-side; everything counted/monetised needs a new source |
| C5 | `creator/C5-edit-community.html` | `/studio/communities/[id]/edit` | **EXISTING · PARTIAL** | `GET|PATCH /communities/{slug}`, `GET /categories`, `POST /uploads/images`, `POST /communities/{slug}/unpublish` | `title`, `description`, `categoryIds[]`, `imageUrl`, `priceAmount`; **tags[]**, **learningOutcomes[]**, **pricingModel + lifetime price**, **discount-code table (6 cols)**, **archive**, **delete + email confirm** | Details + cover + unpublish are LIVE; 3 of 4 tabs need new resources |
| C6 | `creator/C6-members.html` | `/studio/communities/[id]/members` | **EXISTING · PARTIAL** | `GET /communities/{slug}/members` | `displayName`, `avatarUrl`, `status`, `joinedAt`; **member email**, **plan (Monthly/Lifetime)**, **amount paid (total)**, **progress %**, **statuses Paused/Refunded**, **joined-date filter**, **plan filter**, **minisstats (active / new this month / completed / refunded)**, **CSV export** | 4 of 7 table columns have no source; `MemberResponse` has no email at all |
| C7 | `creator/C7-transactions.html` | `/studio/communities/[id]/transactions` | **EXISTING · NEEDS-BACKEND** (L) | *(none — every column is money)* | `grossAmount`, `platformFeeAmount`, `creatorNetAmount`, `status` (Paid/Pending/Refunded/Failed), `plan`, `discountCode`, `occurredAt`, `member`, `receiptUrl`, **30-day daily net series**, **4 stat cards**, **pending payout ₦48,200**, **fee waiver under ₦500k** | 8/8 table columns + chart + 4 stats are money. Current route is already an honest "not available" page |
| C8 | `creator/C8-course-builder.html` | `/studio/communities/[id]/course-builder` | **EXISTING · PARTIAL** | `GET /communities/{slug}/courses`, `GET /courses/{id}`, `POST /communities/{slug}/courses`, `PATCH /courses/{id}`, `POST|PATCH|DELETE /courses/{id}/modules`, `PATCH /courses/{id}/modules/reorder`, `GET|POST /modules/{id}/lessons`, `POST /modules/{id}/lessons/reorder`, `PATCH|DELETE /lessons/{id}`, `POST /lessons/{id}/publish\|unpublish` | course tree, module title/description/position/isPublished, lesson title/duration/position/isPublished, counts (`moduleCount`,`lessonCount`); **estimated module duration (computable)**, **prerequisite module**, **lesson locked state**, **counts on the courses list endpoint** | All CRUD is LIVE. Only the two new fields + list-endpoint counts are missing |
| C9 | `creator/C9-lesson-editor.html` | `/studio/communities/[id]/lesson-editor` | **EXISTING · PARTIAL** | `GET /courses/{id}/modules`, `GET /modules/{id}/lessons`, `GET|PATCH|DELETE /lessons/{id}`, `POST /modules/{id}/lessons`, `POST /modules/{id}/lessons/reorder`, `POST /lessons/{id}/publish\|unpublish` | `title`, `summary`, `contentType`, `content`, `videoUrl`, `durationSeconds`, `thumbnailUrl`, `isPublished`, `publishedAt`; **"Both" content type**, **resources[] (3 files + size + upload date)**, **free-preview toggle**, **preview-attachment toggle**, **prerequisite lesson**, **lock-until date**, **video processing %**, **lesson-scoped discussion (24 threads)** | Discussion is community-level (`GET /posts`) with **no thread/reply model** — lesson-scoped threads do not exist |
| C10 | `creator/C10-payouts.html` | `/studio/payouts` | **NEW · NEEDS-BACKEND** (L) | *(none)* | available balance, pending payout, lifetime payouts, bank name + account name + masked number, schedule + next payout date/amount, minimum payout, 8-row payout ledger (ID/date/amount/fee/net/status/receipt), footer totals | Entirely money. Also duplicates C16 |
| C11 | `creator/C11-analytics.html` | `/studio/analytics` | **NEW · NEEDS-BACKEND** (L) | *(none)* | 4 stats + deltas, 30-day new-member series, per-lesson completion %, cohort retention table (6 weeks), 30-day revenue trend, top-communities table, 4 engagement metrics | Everything is aggregation the backend never computes |
| C12 | `creator/C12-discount-codes.html` | `/studio/communities/[id]/discounts` | **NEW · NEEDS-BACKEND** (M) | *(none)* | code, type (percentage/fixed), value, redemptionCount, maxRedemptions, status (Active/Expired/Used up), createdAt, 4 stats (active codes, total redeemed, revenue impact, avg discount), create form (code+type+value+limit+unlimited+expiry+scope) | The whole resource is missing; `/discount-codes` is 404 |
| C13 | `creator/C13-creator-settings.html` | `/studio/settings` | **NEW · PARTIAL** | `GET /creators/me` | `verificationStatus`, `isVerified`, `displayName`, `avatarUrl`, `bio`; **verified-since date**, **88/10/2 split**, **10 sidebar destinations (8 of them NEW routes)** | The hub itself is chrome; its only real data is verification status. The 88/10/2 numbers are **policy constants, not backend data** |
| C14 | `creator/C14-creator-notifications.html` | `/studio/notifications` | **NEW · NEEDS-BACKEND** (M) | *(none)* | 12 rows: type, actor, community, amount, relative time, read/unread; 7 tab counts (All 24 / Members 8 / Payments 6 / Reviews 3 / Moderation 2 / Payouts 1 / Verification 1); "Mark all as read" | No notifications table exists. 5 of 12 row types are money events |
| C15 | `creator/C15-creator-public-profile.html` | `/studio/settings/public-profile` | **NEW · PARTIAL** | `GET|PUT /creators/me`, `GET|PATCH /users/me`, `POST /uploads/images` | `displayName`, `avatarUrl`, `bio`, `expertise[]`; **headline**, **cover banner**, **social links (X/LinkedIn/GitHub/website)**, **"Last saved 3 hours ago"** | `PUT /creators/me` silently drops `headline`/`socialLinks`/`coverUrl` today |
| C16 | `creator/C16-creator-payouts.html` | `/studio/settings/payouts` | **NEW · NEEDS-BACKEND** (L) | *(none)* | identical to C10 minus the pending/lifetime stat pair | Same endpoint set as C10 — build once |
| C17 | `creator/C17-creator-tax.html` | `/studio/settings/tax` | **NEW · NEEDS-BACKEND** (M) | *(none)* | TIN, business name, business type, VAT number, country, state, address, 4 monthly statements (gross/platform fee/net/status/PDF) | No creator tax profile and no statement generation exist |
| C18 | `creator/C18-creator-revenue.html` | `/studio/settings/revenue` | **NEW · NEEDS-BACKEND** (L) | *(none)* | lifetime earnings, this month, avg/month, avg/member, 88/10/2 split, 12-month series, 12 monthly statements (ID/gross/fee/net/status/PDF), footer totals | Depends on the same ledger as C7/C10 |
| C19 | `creator/C19-creator-verification.html` | `/studio/settings/verification` | **NEW · PARTIAL** | `GET /creators/me` (+ admin-only `PATCH /admin/creators/{user_id}/verification`) | `verificationStatus`, `isVerified`; **verification ID `ILK-VRF-9281`**, **verified-since date**, **4 verified checks (NIN, proof of work, LinkedIn, email+phone)**, **3-row submission history with reviewer + rejection reason**, **"re-submit evidence"** | Status is LIVE; the evidence detail and history are a new resource |
| C20 | `creator/C20-manage-discussions.html` | `/studio/communities/[id]/discussions` | **NEW · PARTIAL** | `GET /communities/{slug}/posts`, `PATCH|DELETE /posts/{post_id}` | `content`, `author.displayName`, `author.avatarUrl`, `createdAt`, `isPinned`, `isAnnouncement`, `commentCount`; **vote count + my vote**, **view count**, **locked**, **reported (by N members)**, **tags**, **anonymous author**, **4 filter-tab counts**, **sort (most voted / most replied)** | List + pin + edit + delete work; 6 of the 8 thread-card fields and every moderation action except pin/edit/delete do not |

## Per-screen detail

### C1 — Creator onboarding (`creator/C1-onboarding.html` → `/onboarding`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Progress indicator "Step 2 of 4" + 4 pills — client-side state only. But the *declared* steps are Account › Headline & expertise › **Payouts** › **Review**; steps 3 and 4 have no destination (see C10/C16 and the money endpoints). Ship steps 1–2; drop 3–4 or wire them to a real payout-account form.
  2. Headline input — value "Senior Engineer at Paystack, teaching AI engineering". **No field exists.** `CreatorProfileResponse` has no `headline` and `CreatorProfileRequest` only accepts `expertise`. → NEW field.
  3. Expertise chips (LLMs, RAG, Python, Production ML; "Pick at least 2. Up to 8") → `GET /creators/me` → `expertise` (string[]). LIVE. Note the live rule is 1–10 (frontend validates 1–10, max 60 chars each); the design's 2–8 rule is a client-side constraint only.
  4. Bio textarea (234/300) → `GET /creators/me` → `bio` (nullable). LIVE (via `PUT /creators/me`? no — `PUT /creators/me` only writes `expertise`; bio is written by `PATCH /users/me` → `bio`).
  5. Profile photo → `PATCH /users/me` → `avatarUrl` after `POST /uploads/images` → `url`. LIVE.
  6. Cover photo (1920×600) → **no field**. `CreatorProfileResponse` has no `coverUrl`; `PUT /creators/me` ignores it. → NEW field.
  7. Benefits sidebar — "88% revenue share · weekly payouts · Paystack integrated", "Minimum ₦5,000 to withdraw" → **marketing copy about a subsystem that does not exist**; and it contradicts C10/C16's "Minimum payout ₦10,000". Fix the copy to one number and ship it as static text, or gate it behind the money release.
  8. "Realistic example ₦487,200/month" → static illustrative copy; must be labelled as an example, not a live stat.
- **Reusable components:** existing `useMyCreatorProfile` / `useUpdateMyCreatorProfile` hooks; `POST /uploads/images` upload path (5 MB + PNG/JPEG/GIF/WebP validation already in `edit/page.tsx`).
- **Empty/loading/error states needed:** existing profile-load error state is fine; add "expertise must be 2–8" inline validation; keep `creator_profile_required` → redirect-to-onboarding handling.
- **Backend work required:** NEW `headline: string|null` + `coverUrl: string|null` on `CreatorProfileResponse`/`CreatorProfileRequest` (S); optionally `socialLinks` (see C15).

### C2 — Studio home (`creator/C2-studio-home.html` → `/studio`) — EXISTING
- **Verdict:** NEEDS-BACKEND (M)
- **Sections & the data each needs:**
  1. "Welcome back, Tunde" + verified chip → `GET /creators/me` → `displayName`, `isVerified`. LIVE.
  2. Stat "Total members 1,940 / +128 this week" → `GET /communities/mine` → Σ `items[].memberCount`. LIVE (total). The **+128 this week delta has no source** — `MemberResponse.joinedAt` exists but only per-community via `GET /communities/{slug}/members`; a week-window delta needs either a new query param or client-side counting across N member pages.
  3. Stat "Monthly revenue ₦487,200 / +12.4% MoM" → **no endpoint**. The current frontend already renders `"—"` with the hint *"Shows once payments go live"*.
  4. Stat "Active communities 3" → count of `items[].isPublished === true`. LIVE.
  5. Stat "Lifetime earnings ₦4.1M / Since Mar 2024" → **no endpoint** (needs the creator revenue aggregate).
  6. 8-week revenue bar chart (W1 218k … W8 487k, current week accent) + footer "Best week ₦487k / 8-week total ₦2.56M / Weekly average ₦320k" → **no endpoint**; needs a weekly bucket on the revenue series.
  7. 3 community tiles → `GET /communities/mine` → `title`, `imageUrl`, `categories[].name`, `priceAmount`, `memberCount`. LIVE except: the "· ₦8,500/mo" suffix implies a **billing interval** the backend cannot express (one price, no cadence), and "This month ₦320,400" + "Growth +12%" need the ledger.
  8. Recent activity, 5 rows → 4 of 5 are derivable from existing endpoints (`GET /communities/{slug}/members` → `joinedAt`; `GET /communities/{slug}/reviews` → `rating`/`createdAt`/`author.displayName`; `GET /communities/{slug}/posts` → `createdAt`/`author.displayName`); the **"Payment received ₦8,500"** row and the **"12 lessons completed today"** row are not (no money endpoint; no creator-side completion aggregate). The rail is also hardcoded in `icons.js` (AI Engineering 1.2k / Product Design 842 / FinTech Founders 388) and must be driven from `GET /communities/mine`.
- **Reusable components:** `CommunityCard`, `StatCard`, `useMyCommunities`.
- **Empty/loading/error states needed:** "no communities yet" (already exists); "revenue not available yet" (already exists as the `—` card) — keep that state until the money endpoints ship; a chart empty state.
- **Backend work required:** NEW `GET /api/v1/creators/me/revenue/summary` (weekly series + lifetime + MoM) — see C18 contract; NEW `GET /api/v1/communities/{slug}/transactions/summary` (daily net series + 4 stats); NEW activity feed aggregator (or assemble client-side from members/reviews/posts + money summary).

### C3 — New community wizard (`creator/C3-new-community.html` → `/studio/communities/new`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Step indicator 1 Basics / 2 Pricing / 3 Review → client-side wizard state.
  2. Title → `POST /communities` → `title` (min 3, max 160 per the existing frontend). LIVE.
  3. Short description → `description` (**≥10 chars enforced by the backend** — verified 422). LIVE.
  4. Category select, 10 options with counts ("AI & Engineering · 184 communities") → `GET /categories` returns **8** categories with **no counts**, and none named "AI & Engineering". LIVE for the list; **counts and the design's taxonomy are missing** → add `communityCount` to `CategoryResponse`.
  5. Cover image upload → `POST /uploads/images` → `url` → `imageUrl`. LIVE.
  6. "Or choose from gallery" 4 thumbnails → no gallery service; ship as a frontend constant of 4 Cloudinary/Unsplash URLs, or add a `GET /api/v1/uploads/gallery` later. MOCK (static).
  7. Tags chip input (LLMs, Production, Cohort; max 5) → **no field** on `CommunityCreateRequest`/`CommunityUpdateRequest`. → NEW `tags: string[]`.
  8. "What you'll learn" 4–6 outcomes → **no field**. → NEW `learningOutcomes: string[]`.
  9. Step 2 Pricing (not rendered here but implied by the stepper) → Free/One-time/Monthly/Mixed + prices → only `priceAmount` exists. → NEW `pricingModel`, `lifetimePriceAmount`, `billingInterval`.
  10. 3 listing tips → static copy.
- **Reusable components:** existing `useCategories`, `post<UploadImageResponse>("/uploads/images")`, cover validation block (copy from `edit/page.tsx`).
- **Empty/loading/error states needed:** already handles `creator_profile_required` and the "no categories seeded" case — keep both.
- **Backend work required:** NEW fields `tags[]`, `learningOutcomes[]`, `pricingModel`, `lifetimePriceAmount`, `billingInterval` on the community create/update/detail schemas (S–M); NEW `communityCount` on `CategoryResponse` (S).

### C4 — Community manage (`creator/C4-community-manage.html` → `/studio/communities/[id]`) — EXISTING
- **Verdict:** NEEDS-BACKEND (M)
- **Sections & the data each needs:**
  1. Header title + "Published" badge → `GET /communities/{slug}` → `title`, `isPublished`. LIVE. "Published Mar 14, 2024" → closest source is `createdAt`/`updatedAt`; there is **no `publishedAt`** (publishing overwrites `updatedAt`).
  2. Stat "Members 1,240 / +128 this week" → `memberCount` LIVE; delta missing.
  3. Stat "Revenue this month ₦320,400 / +12% MoM" → **no endpoint**.
  4. Stat "Completion rate 67% · across 4 modules · 20 lessons" → **no aggregate endpoint**. `GET /courses/{id}/progress` returns **the calling learner's** progress, not the cohort — it cannot produce a community completion rate.
  5. Stat "Rating 4.9 ★ / 212 reviews" → `rating` + `reviewCount`. LIVE.
  6. Quick links (6) with counts: "1,240 enrolled · 1,184 active" → `memberCount` LIVE; "active" = count of `GET /members` items with `status=active` (client-side, pagination caveat); "₦320,400 this month · 142 payments" → missing; "2 courses · 5 modules · 20 lessons" → `GET /communities/{slug}/courses` → Σ `moduleCount`/`lessonCount` **but `CourseResponse` carries neither** (only `CourseDetail` does) → N× `GET /courses/{id}` or NEW counts on `CourseResponse`; "18 published · 2 drafts" → count `modules[].lessons[].isPublished` (needs the same N calls); "100% ready · published Mar 14, 2024" → computable client-side.
  7. Publish status + 4-item readiness checklist + 100% readiness score → **computable client-side** from `title`, `description`, `courses[].isPublished`, `priceAmount`. LIVE (derived).
  8. Recent enrollments table — Member (name + **email**), Date, **Plan**, **Amount**, Status (Paid/Pending) → `GET /communities/{slug}/members` gives `displayName`, `avatarUrl`, `joinedAt`, `status` (pending/active/cancelled). **Email, Plan, Amount missing**; status vocabulary doesn't match.
  9. Top performing lessons (5 rows: title, module, completion %, avg time) → **no endpoint**; needs the analytics resource.
- **Reusable components:** `StatCard`, `MoneyAmount`, `useMyCommunities`, `useCommunity`.
- **Empty/loading/error states needed:** "no courses yet", "no enrollments yet", "publish first to accept members".
- **Backend work required:** NEW `GET /api/v1/communities/{slug}/analytics` (completion rate, top lessons, member delta) — L for the full shape, S if only the two aggregates; NEW `GET /api/v1/communities/{slug}/transactions/summary`; NEW `moduleCount`/`lessonCount` on `CourseResponse`; NEW `email`/`plan`/`amountPaid` on `MemberResponse`.

### C5 — Edit community (`creator/C5-edit-community.html` → `/studio/communities/[id]/edit`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Tabs: Details / Pricing / Cover & media / Danger zone — client-side.
  2. Details: title → `title` LIVE; description → `description` LIVE; category select → `categories[]` + `GET /categories` LIVE; tags → **missing**; 4 learning outcomes → **missing**.
  3. Readiness checklist (6: Title, Description, Category, Cover image, ≥1 course published, Pricing configured) → computable client-side. LIVE (derived). "Last saved 2 minutes ago" → no `updatedAt` on the creator-profile write path; client-side only.
  4. Pricing card: model radios Free / One-time (₦85,000) / Monthly (₦8,500/mo) / Mixed → backend has **one** `priceAmount` and no cadence → NEW `pricingModel` + `lifetimePriceAmount` + `billingInterval`. "Save 17%" badge → computed client-side; **the design's own numbers give 0%** (₦85,000 = exactly 10 × ₦8,500) — fix the copy or the price.
  5. Discount codes table (Code, Type, Value, Uses, Status) — 2 rows "ADA15 15% off 142/200", "WELCOME100 ₦1,000 off 38/50"; header "2 active codes · 180 total redemptions" → **no resource**; conflicts with C12's numbers for the same codes (ADA15 47/100, WELCOME100 50/50, 6 codes, 248 redemptions). Pick one source of truth.
  6. Cover & media: current cover → `imageUrl` LIVE; Upload new → `POST /uploads/images` LIVE; Remove → `imageUrl: null` via PATCH LIVE; recommended 1920×1080 / 5 MB → static copy.
  7. Danger zone: Unpublish → `POST /communities/{slug}/unpublish` **LIVE**; Archive (30-day reversible) → **NEW**; Delete forever (with automatic refunds + email one-time code) → **NEW** (`DELETE /communities/{slug}` + a confirmation-code endpoint). "Refunds are issued automatically" is currently a lie — there are no refunds.
- **Reusable components:** existing upload + category checkbox block from `edit/page.tsx`; `apiErrorMessage`; `ApiError.code === "creator_profile_required"` handling.
- **Empty/loading/error states needed:** keep existing load/save/error blocks; add a destructive-action confirm dialog with typed confirmation.
- **Backend work required:** NEW community fields (tags, learningOutcomes, pricing model) (S); NEW discount-code resource (M); NEW `POST /communities/{slug}/archive` + `POST /communities/{slug}/restore` + `DELETE /communities/{slug}` + `POST /communities/{slug}/delete-confirmation` (M, and it depends on the refunds subsystem).

### C6 — Members (`creator/C6-members.html` → `/studio/communities/[id]/members`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. "Members · 1,240 total" → `GET /communities/{slug}/members` → `total` (or `CommunityDetail.memberCount`). LIVE.
  2. 4 mini-stats: Active 1,184 (+ % of total) → count `status==="active"` over the member list (needs pagination or an aggregate); New this month 128 (+11.5% MoM) → needs `joinedAt` windowing; Completed 89 → needs per-member course completion; Refunded 12 (0.97% rate) → **no refunds exist**. → NEW aggregate endpoint.
  3. Filters: Search (name/email) → `search` param exists, but **email is not in `MemberResponse`** so email search cannot work; Status (Active/Paused/Refunded) → backend `status` filter accepts `pending|active|cancelled`; Joined date (7d/30d/90d/year) → **no param**; Plan (Monthly/Lifetime) → **no param**. → NEW query params.
  4. Table columns: Member (name + **email**) → `displayName`, `avatarUrl` LIVE, email missing; Joined → `joinedAt` LIVE; Plan → missing; Status → `status` LIVE but wrong vocabulary (needs Paused/Refunded); Progress (bar + %) → **no per-member progress**; Amount paid (total, e.g. ₦25,500 = 3 × ₦8,500) → missing; row kebab (remove/refund/suspend) → no write endpoints for members at all.
  5. Pagination "1–8 of 1,240 · 155 pages" → `page`/`pageSize`/`total`/`totalPages` LIVE — but `pageSize` max is not documented; the design's 155 pages assumes 8/page.
  6. Export CSV → client-side CSV of the loaded page; full export needs a backend export job.
- **Reusable components:** `useMembers()` hook (currently maps to `{members,error}` — extend to keep the pagination envelope), `StatCard`.
- **Empty/loading/error states needed:** the design ships all three as HTML comments — lift them into components: empty "No members match these filters", 8×36px skeleton rows, `alert-danger` "Couldn't load members… Retry".
- **Backend work required:** NEW fields on `MemberResponse`: `email`, `plan`, `amountPaid`, `totalPaidAmount`, `progressPercent`, `lastActiveAt`; NEW `EnrollmentStatus` values `paused`/`refunded`; NEW query params `joinedFrom`/`joinedTo`/`plan` on `GET /communities/{slug}/members`; NEW `GET /communities/{slug}/members/summary` for the 4 mini-stats; NEW `GET /communities/{slug}/members/{user_id}/progress` (M — the per-member progress bar is the hard part).

### C7 — Transactions (`creator/C7-transactions.html` → `/studio/communities/[id]/transactions`) — EXISTING (placeholder)
- **Verdict:** NEEDS-BACKEND (L)
- **Sections & the data each needs:**
  1. Header "Last 30 days" + Export CSV + Payout button → client-side state; Payout needs C10's endpoint.
  2. Stat "Gross volume ₦320,400 / +12% MoM" → new `transactions/summary`.
  3. Stat "Platform fee ₦32,040 · 10% of gross · ₦0 Paystack fee for first ₦500k" → **fee model does not exist**. Note the design's own numbers contradict the 88% promise (see *Design arithmetic* below).
  4. Stat "Your earnings ₦288,360 / +12% MoM" → needs the share model.
  5. Stat "Pending payout ₦48,200 · Available Friday" → needs the payout schedule resource.
  6. 30-day daily net area chart (Y 0–30k, X Apr 19→May 18) → needs a `bucket=day` series.
  7. Filters: Date range (Today/7d/30d/90d/all/custom) → NEW query params; Status (Paid/Pending/Refunded/Failed) → NEW; Plan (Monthly/Lifetime/Discount codes) → NEW; Search by member → NEW.
  8. Table, 8 columns × 12 rows: Date+time, Member (avatar+name), Plan (+ discount code label + "Month 2 of subscription"), Gross, Platform fee, Your net, Status (Paid/Pending/Refunded/Failed), Receipt (View / Retry for failed) → **every column** is a new field. Note "Failed" rows show gross with em-dashes for fee/net and a Retry action → needs a `retry` action on the payment.
  9. Footer "12 transactions · Gross ₦253,725 · Platform fee ₦24,522 · Your net ₦213,053" → computed from the returned page (client-side sum), but note the three printed numbers mix bases (see *Design arithmetic*).
  10. "Reconciled with Paystack · 14:32 today" → needs `reconciledAt` on the summary.
- **Reusable components:** `MoneyAmount`, `StatCard`, table + `.table-wrap` + `.badge` patterns from the design system; `api.get` + TanStack Query `keepPreviousData` for the date-range switch.
- **Empty/loading/error states needed:** "No transactions in this period" (this is the current reality — the existing route already says so), chart empty state, CSV export disabled when the range is empty.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/communities/{slug}/transactions` — query `page`, `pageSize`, `status` ∈ `paid|pending|refunded|failed`, `plan` ∈ `monthly|lifetime|one_time`, `from`, `to`, `search`. Response `Paginated<TransactionItem>`:
    ```
    TransactionItem {
      id: uuid
      communityId: uuid
      member: { userId: uuid, displayName: string, avatarUrl: string|null }
      occurredAt: date-time
      plan: "monthly" | "lifetime" | "one_time"
      isRenewal: boolean
      billingPeriod: string|null            // "Month 2 of subscription"
      discountCode: string|null             // "ADA15"
      discountLabel: string|null            // "15% off"
      grossAmount: string                   // "8500.00"  decimal string, NGN
      discountAmount: string                // "1275.00"
      platformFeeAmount: string             // "850.00"    (10% of gross)
      processorFeeAmount: string            // "170.00"    (~2% of gross)
      creatorNetAmount: string              // "7650.00"
      creatorShareBps: integer              // 8800
      currency: "NGN"
      status: "paid" | "pending" | "refunded" | "failed"
      failureReason: string|null
      provider: "paystack"
      providerReference: string|null        // receipt id
      receiptUrl: string|null
    }
    ```
  - **NEW** `GET /api/v1/communities/{slug}/transactions/summary?from&to&bucket=day|week|month` →
    ```
    TransactionSummary {
      grossAmount, platformFeeAmount, processorFeeAmount, creatorNetAmount,
      refundedAmount, pendingAmount: string
      paymentCount, failedCount: integer
      previousGrossAmount: string
      grossChangePercent: number
      series: [{ periodStart: date, grossAmount, creatorNetAmount, paymentCount }]
      reconciledAt: date-time|null
    }
    ```
  - **NEW** `POST /api/v1/transactions/{id}/retry` (the Retry button on failed rows).
  - Money must stay a **decimal string** and always be labelled `₦` client-side.

### C8 — Course builder (`creator/C8-course-builder.html` → `/studio/communities/[id]/course-builder`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. LEFT tree: Course 1 (expanded) with a filled star icon, "20 lessons" count; Module rows with chevron, "5/6/5/4 lessons", kebab menu; 5 lesson mini-rows with status dot (done/empty) + title + duration `8:24`; Course 2 collapsed "1 module · 3 lessons"; "Add course" / "Add module to Course 1" buttons → `GET /communities/{slug}/courses` → `CourseResponse` (title, position, isPublished) + `GET /courses/{id}` → `CourseDetail.modules[].lessons[]` (`LessonOutline`: title, position, isPublished, durationSeconds). LIVE. **But `CourseResponse` has no `moduleCount`/`lessonCount`**, so the tree's "20 lessons" label needs either the per-course detail fetch or NEW counts on the list endpoint.
  2. Tree footer "Last saved 2 minutes ago · auto-saved" → client-side.
  3. RIGHT header "Module 2: Prompt Engineering · 6 lessons · 81 minutes total · published Apr 12, 2024" → lesson count LIVE; **81 minutes = Σ `durationSeconds`** (client-side, works); "published Apr 12" → `ModuleResponse` has `createdAt` only — **no published date**.
  4. Module form: title → `ModuleResponse.title` LIVE; description → `description` LIVE; **Estimated duration 1.4 hours** → client-side sum of `durationSeconds`; **Prerequisite module select** → **no field**.
  5. Lessons list rows: drag handle, status dot, editable title, editable duration `14:32`, Edit link, delete → `PATCH /lessons/{id}` (`title`, `durationSeconds`) and `DELETE /lessons/{id}` LIVE; `POST /modules/{id}/lessons/reorder` LIVE.
  6. Status dots: done (published) / current (accent) / empty (draft) / **locked (lock glyph)** → published/draft map to `isPublished`; **"locked" has no field**.
  7. "Preview" and "Edit" header buttons, Cancel/Save → local state.
- **Reusable components:** the existing course-builder mutations (createCourse, updateCourse, changeCoursePublication, createModule, updateModule, deleteModule, reorderModules) and the lesson mutations in the lesson editor — **keep the data layer, replace the markup**.
- **Empty/loading/error states needed:** "this community has no courses" (exists in the lesson editor; mirror it here), "no modules yet", "no lessons in this module".
- **Backend work required:** NEW `prerequisiteModuleId` on `ModuleCreateRequest`/`ModuleUpdateRequest`/`ModuleResponse`; NEW `isLocked` on the lesson schema (or reuse `isPublished:false` + a `lockedUntil` date — see C9); NEW `moduleCount`/`lessonCount` on `CourseResponse` (S, avoids N+1); optional NEW `publishedAt` on module/course/lesson.

### C9 — Lesson editor (`creator/C9-lesson-editor.html` → `/studio/communities/[id]/lesson-editor`) — EXISTING
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. LEFT: Course select → `GET /communities/{slug}/courses` LIVE. Module 2 expanded, 6 lesson rows with title + duration + status dot + kebab → `GET /modules/{id}/lessons` → `LessonResponse` LIVE. Status dots published/draft/locked → **locked missing**. "Module navigator" rows with lesson counts → LIVE per module (needs `moduleCount` on courses for the tree, or per-course detail).
  2. RIGHT header "Lesson 3 · Module 2" + title → `LessonResponse.title` LIVE; Preview / Unpublish → `POST /lessons/{id}/unpublish` LIVE.
  3. Status banner "Published on May 10, 2024 · 1,240 members can access this lesson" → `publishedAt` exists on `LessonResponse` (but was **null** on create in the probe — needs a real publish timestamp) and `memberCount` from the community; "View as a member" link.
  4. Tabs Content / Settings / Discussion (24) → tab count from the discussion resource (missing).
  5. Content: Lesson title → LIVE; **Lesson type Video / Text / Both** → `contentType` enum is `text|video` only → NEW enum value `both` (or model "Both" as `videoUrl` + `content` both set); **Video URL** → `videoUrl` LIVE; **"Upload video"** → only `POST /uploads/images` exists (images only — no video upload/transcode); **"Processing 64% complete · 2 min remaining"** → **no video-processing state**; Video duration `14:32` → `durationSeconds` LIVE; **Lesson content** (624/2000 chars, markdown) → `content` LIVE; faux rich-text toolbar → cosmetic.
  6. **Resources**: 3 files with name + size + uploaded date + download + remove → **no resource list on `LessonResponse`**. → NEW `resources: LessonResource[]` + an upload endpoint for non-image files.
  7. **Preview attachment toggle ON** ("non-members preview for 30 seconds") → **no field** → NEW `isPreviewAttachment`.
  8. Settings: **Free preview lesson toggle** → NEW `isFreePreview`; Estimated duration 14 minutes → `durationSeconds` LIVE; **Prerequisite lesson select** → NEW `prerequisiteLessonId`; **Lock until (date)** → NEW `lockedUntil`.
  9. Discussion card: "24 threads · 6 unanswered" + 2 threads (author, replies, relative time, "Answered by Tunde") + "Open all discussions →" → **there is no thread model**. The backend has community-level `PostResponse` + `CommentResponse` (one level of nesting — `CommentResponse` has no `parentId`, so the design's "4 replies / 2 replies" reply tree cannot be represented). Also `GET /posts/{id}/comments` returns only the comments of one post, not a post list scoped to a lesson. → NEW lesson-scoped discussion resource.
  10. Footer "Last saved 2 minutes ago" + Save draft / Publish → `isPublished` flag + `POST /lessons/{id}/publish` LIVE.
- **Reusable components:** the existing lesson editor mutations (createLesson, updateLesson, deleteLesson, reorderLessons) — **keep the data layer, replace the markup**; existing `useMyCommunities`.
- **Empty/loading/error states needed:** "no lessons in this module", "no discussion yet", video-processing placeholder while a URL is pasted but not yet probed.
- **Backend work required:** NEW lesson fields `isFreePreview`, `isPreviewAttachment`, `prerequisiteLessonId`, `lockedUntil`, `resources[]`; NEW `contentType` value `both`; NEW `GET|POST|DELETE /api/v1/lessons/{lesson_id}/resources`; NEW `GET /api/v1/lessons/{lesson_id}/discussions` returning `Paginated<DiscussionThread>` where `DiscussionThread { id, lessonId, author, title, body, replyCount, answeredByUserId|null, createdAt, replies: [{id, author, body, createdAt}] }` (M); NEW threaded comments (`parentId` on `CommentResponse`) if the reply tree is required elsewhere (M); NEW video upload/transcode status endpoint (L, or drop the processing bar).

### C10 — Payouts (`creator/C10-payouts.html` → `/studio/payouts`) — NEW
- **Verdict:** NEEDS-BACKEND (L)
- **Sections & the data each needs:**
  1. 3 stats: Available balance ₦487,200 · Pending payout ₦48,200 (next batch Fri May 25) · Lifetime payouts ₦4.1M (since Mar 2024) → all new.
  2. Payout account card: Bank "Access Bank" · Account name "Tunde Bakare" · Account number "•••• 4821" · "Verified" badge · "Update bank details →" → new, and must be **write-masked** (only the last 4 digits may ever leave the backend).
  3. Payout schedule card: "every Friday at 9:00 AM WAT", next payout date + amount, minimum payout ₦10,000, "below ₦10,000 held until the next Friday batch" → new; the schedule is a **platform policy constant** (weekly/Friday/09:00 Africa/Lagos) and should be a settings row, not hardcoded in the UI.
  4. Payout history table, 7 columns × 8 rows: Payout ID (`ILK-PAY-128`, mono), Date, Amount, Fee (₦0 except ILK-PAY-123 ₦800), Net, Status (Paid), Receipt (View) → new. The ILK-PAY-123 note "Earnings > ₦500k threshold" needs a per-payout `note`.
  5. Footer "8 payouts · Total ₦599,500 · Avg ₦74,937 per week" → client-side sum of the returned page (math checks out: 599,500 / 8 = 74,937.50).
  6. Export button → client-side CSV.
- **Reusable components:** `MoneyAmount`, `StatCard`, `.text-mono` for IDs only (money must stay Inter per the design system).
- **Empty/loading/error states needed:** "no payout account yet — add your bank details" (the real first-run state), "no payouts yet", "below minimum" inline warning on the Request button.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/creators/me/payouts` →
    ```
    CreatorPayoutSummary {
      availableAmount: string        // "487200.00"
      pendingAmount: string          // "48200.00"
      lifetimePaidAmount: string     // "4100000.00"
      currency: "NGN"
      nextPayoutAt: date-time|null
      nextPayoutAmount: string|null
      minimumPayoutAmount: string    // "10000.00"
      schedule: { frequency: "weekly", weekday: "friday", time: "09:00", timezone: "Africa/Lagos", label: string }
      bankAccount: { id, bank, accountName, accountNumberLast4, status: "unverified"|"pending"|"verified"|"rejected", updatedAt } | null
      updatedAt: date-time
    }
    ```
  - **NEW** `GET /api/v1/creators/me/payouts/history?page&pageSize` → `Paginated<PayoutItem>`:
    ```
    PayoutItem {
      id, reference: "ILK-PAY-128", communityId: uuid|null,
      requestedAt, processedAt: date-time|null,
      amount, feeAmount, netAmount, currency,
      status: "requested"|"pending"|"processing"|"paid"|"failed"|"held",
      note: string|null,               // "Earnings > ₦500k threshold"
      failureReason: string|null,
      receiptUrl: string|null,
      periodStart: date, periodEnd: date
    }
    ```
  - **NEW** `POST /api/v1/creators/me/payouts` body `{ amount?: string }` → `PayoutItem` (422 `payout_below_minimum` when under the threshold).
  - **NEW** `PATCH /api/v1/creators/me/payout-account` body `{ bank, accountName, accountNumber, bankCode? }` → bank account (status `pending` until verified).
  - **NEW** `POST /api/v1/creators/me/payout-account/verify` → triggers verification.

### C11 — Analytics (`creator/C11-analytics.html` → `/studio/analytics`) — NEW
- **Verdict:** NEEDS-BACKEND (L)
- **Sections & the data each needs:**
  1. Community selector (3 communities + "All communities combined") → `GET /communities/mine` LIVE; date-range segmented control (7d/30d/90d/All) → client-side.
  2. 4 stats: Active members (30d) 1,184 (+128); Completion rate 67% (+4%); Avg revenue per member ₦4,892 (+₦412); Refund rate 1.2% (+0.3%, warning **on the delta only**) → all new aggregates.
  3. Member growth chart, 30 daily points (0–200/day, a 75-member launch spike annotated) → new daily series.
  4. Lesson completion, 6 horizontal bars (L1 92% → L6 38%) with L3 highlighted → new per-lesson completion aggregate.
  5. Cohort retention table (April cohort, 248 enrollees, W1 100% → W6 67%, drop-off in pts) → new cohort model.
  6. Revenue trend area chart (identical 30 daily points to C7's) + footer "30-day net ₦320,400 · Best day ₦25,500 · vs last 30d +12.4%" → new; **note the footer labels ₦320,400 as "net" while C7 calls ₦320,400 "gross"** — pick one definition.
  7. Top communities table (community, members, revenue 30d) + footer total → needs per-community revenue across the creator's communities.
  8. Engagement 2×2: posts/week 47 (avg 3.4/day), comments/week 124 (avg 8.9/day), live session attendance 78%, avg lesson time 14m 32s → posts/comments are countable from `GET /communities/{slug}/posts` + `GET /posts/{id}/comments` (expensive but real); **live attendance has no source at all** (there are no live sessions); avg lesson time = mean of `durationSeconds` (client-side).
- **Reusable components:** `StatCard`, the SVG chart pattern (static, no animation), `.progress`/`.progress-bar-ink` for completion bars.
- **Empty/loading/error states needed:** "no data for this range", "not enough members for cohort analysis", chart empty states per panel.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/communities/{slug}/analytics?from&to&courseId?` →
    ```
    CommunityAnalytics {
      activeMembers: integer
      newMembers: integer
      newMembersChangePercent: number
      completionRate: number                  // 0-100
      completionRateChangePoints: number
      averageRevenuePerMember: string
      refundRate: number                      // 0-100
      dailyNewMembers: [{ date: date, count: integer }]
      dailyRevenue: [{ date: date, grossAmount, creatorNetAmount, paymentCount }]
      lessonCompletion: [{ lessonId, title, moduleTitle, completionPercent: number, averageTimeSeconds: integer|null }]
      cohortRetention: [{ cohort: "2026-04", week: integer, enrollees: integer, retained: integer, retentionPercent: number }]
      engagement: { postsPerWeek, commentsPerWeek, averageLessonSeconds: integer|null }
    }
    ```
  - **NEW** `GET /api/v1/creators/me/analytics?from&to` → the same shape plus `communities: [{ communityId, title, members, revenue30d }]`.
  - `liveAttendancePercent` must be dropped from the UI until live sessions exist (there is no calendar/live-session model anywhere in the backend).

### C12 — Discount codes (`creator/C12-discount-codes.html` → `/studio/communities/[id]/discounts`) — NEW
- **Verdict:** NEEDS-BACKEND (M)
- **Sections & the data each needs:**
  1. 4 stats: Active codes 4 · Total redeemed 248 · Revenue impact ₦84,200 (discounted gross 30d) · Avg discount 15% (weighted by redemptions) → new aggregate.
  2. Filters: Status (Active/Expired/Used up), Type (Percentage/Fixed), Search by code → new query params.
  3. Table, 8 columns × 6 rows: Code (mono), Type, Value ("15% off" / "₦1,000 off"), Used, Limit, Status, Created, Actions (Edit / Deactivate / View) → new resource. A tiny progress bar under Used/Limit is a client-side render of `redemptionCount / maxRedemptions`.
  4. Create form: Code (suggested "SAVE20" + regenerate), Discount type (percentage/fixed segmented), Value (% or ₦), Usage limit + "No limit" checkbox, Expiry date, Applies to (All my communities (3) / Specific community + select), Cancel/Create → new resource + create endpoint.
- **Reusable components:** `StatCard`, `.chip` segmented control, `.text-mono` for codes only.
- **Empty/loading/error states needed:** "no codes yet — create your first", "code expired" / "limit reached" badges, duplicate-code error (409).
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/communities/{slug}/discount-codes?page&pageSize&status&type&search` → `Paginated<DiscountCode>`:
    ```
    DiscountCode {
      id: uuid
      creatorUserId: uuid
      communityId: uuid|null              // null = applies to all creator communities
      code: string                        // "ADA15" (unique per creator, case-insensitive)
      type: "percentage" | "fixed"
      value: string                       // "15.00" | "1000.00"  decimal string
      maxRedemptions: integer|null        // null = unlimited
      redemptionCount: integer
      expiresAt: date-time|null
      scope: "all_creator_communities" | "specific_community"
      status: "active" | "expired" | "used_up" | "inactive"
      createdAt: date-time
      revenueImpactAmount: string|null    // discounted gross attributable to this code
    }
    ```
  - **NEW** `POST /api/v1/communities/{slug}/discount-codes` body `{ code, type, value, maxRedemptions?, expiresAt?, scope, communityIds?[] }` → `DiscountCode`.
  - **NEW** `PATCH /api/v1/communities/{slug}/discount-codes/{code_id}` body `{ code?, value?, maxRedemptions?, expiresAt?, isActive? }`.
  - **NEW** `DELETE /api/v1/communities/{slug}/discount-codes/{code_id}` (deactivate).
  - **NEW** `GET /api/v1/communities/{slug}/discount-codes/summary` → `{ activeCodes, totalRedeemed, revenueImpactAmount, averageDiscountPercent }`.
  - **NEW** `POST /api/v1/communities/{slug}/enroll` must accept `{ discountCode?: string }` (today the body is empty and the endpoint is free-join only) and **NEW** `GET /api/v1/discount-codes/{code}?communityId=` for pre-check validation.

### C13 — Creator settings (`creator/C13-creator-settings.html` → `/studio/settings`) — NEW
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. 10 sidebar destinations (Overview, Public profile, Payouts, Tax, Revenue, Verification, Notifications, Account, Connected accounts, Sessions, Danger zone) → 8 of the 10 are NEW routes; "Account" points at the learner settings page; **Connected accounts** and **Sessions** have no backend at all (the platform stores tokens in `localStorage` with no server-side session list — see `lib/api/session.ts`).
  2. 4 quick-link cards (Public profile, Payouts & bank, Tax, Verification) + their one-line descriptions → static copy + live verification status.
  3. Revenue share card: **88% creator** (56px), Platform fee 10%, Paystack processing ~2%, plus the explanatory paragraph → **policy constants with no backend source**. The current backend has **no fee model at all** (see *Revenue-share feasibility* below). Ship as static policy text now; once the fee config exists, expose it as `GET /api/v1/platform/fees`.
  4. Verification status card: "Verified creator · Verified since March 14, 2024" + the trust copy + "Re-submit evidence →" → `GET /creators/me` → `verificationStatus`, `isVerified` LIVE; **"Verified since" date missing** (no `verifiedAt` on the creator record).
- **Reusable components:** the `.settings-shell` 240px sidebar pattern (shared with C15/C16/C17/C18/C19/C14) — build it once as a component, not six copies.
- **Empty/loading/error states needed:** each sub-page's own states; the overview degrades gracefully when verification is `pending`.
- **Backend work required:** NEW `verifiedAt` + `verificationId` on `CreatorProfileResponse` (S); NEW `GET /api/v1/platform/fees` once the fee model exists (S).

### C14 — Creator notifications (`creator/C14-creator-notifications.html` → `/studio/notifications`) — NEW
- **Verdict:** NEEDS-BACKEND (M)
- **Sections & the data each needs:**
  1. 7 filter tabs with counts: All 24 · Members 8 · Payments 6 · Reviews 3 · Moderation 2 · Payouts 1 · Verification 1 → new summary endpoint.
  2. 12 rows, each with: unread dot, avatar (photo for people, paper-2 glyph circle for system), headline, sub-line (often a **₦ amount**), relative timestamp, and a target link. Row types present: new member + first payment, payment received, new 5-star review, member reported a post, refund requested (₦6,200 + reason + "14 days within policy"), payout processed (₦487,200 + bank + reference ILK-PAY-128 + "settled in 2 hours"), live session reminder (6:00 PM WAT + 47 RSVPs), verification update (NIN/proof/LinkedIn/email verified), new member (RAG, ₦10,500), 3 members completed Module 1, discount code ADA15 used 5 times today (gross ₦36,125, savings ₦6,375), member posted in feed. → **5 of the 12 rows depend on money**, 1 depends on live sessions (which do not exist), 1 on discount codes.
  3. "Mark all as read" → new mutation.
  4. Settings gear → links to notification preferences (also new).
- **Reusable components:** `nav-top` + avatar dropdown; `.avatar`; `.tabs` with `.tab-count`; `.text-money`.
- **Empty/loading/error states needed:** "You're all caught up", per-tab empty states, "mark all as read" disabled when unread = 0.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/notifications?page&pageSize&type&unreadOnly` → `Paginated<NotificationItem>`:
    ```
    NotificationItem {
      id: uuid
      type: "new_member" | "payment_received" | "review_added" | "post_reported"
          | "refund_requested" | "payout_processed" | "live_session_reminder"
          | "verification_updated" | "module_completed" | "discount_code_used" | "feed_post"
      title: string
      body: string|null
      amount: string|null            // decimal string, NGN
      currency: "NGN"|null
      actor: { userId, displayName, avatarUrl } | null
      communityId: uuid|null
      communityTitle: string|null
      link: string|null               // target route
      createdAt: date-time
      readAt: date-time|null
    }
    ```
  - **NEW** `GET /api/v1/notifications/summary` → `{ all, members, payments, reviews, moderation, payouts, verification, unread }` (integers).
  - **NEW** `PATCH /api/v1/notifications/{notification_id}/read` → `NotificationItem`.
  - **NEW** `POST /api/v1/notifications/read-all`.
  - **NEW** `GET|PUT /api/v1/me/notification-preferences` → per-type `{ inApp: boolean, email: boolean }`.

### C15 — Creator public profile (`creator/C15-creator-public-profile.html` → `/studio/settings/public-profile`) — NEW
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Profile media: profile photo (80px avatar, ≥400×400) → `avatarUrl` via `PATCH /users/me` + `POST /uploads/images` LIVE; **cover banner (16:9, ≥1600×900)** → **no field** → NEW `coverUrl`.
  2. Profile details: **Creator display name** "Tunde Bakare" (separate from account name) → the backend has exactly one name: `CreatorProfileResponse.displayName` mirrors `AccountResponse.displayName`. Either reuse it (and accept that it is not a separate field) or add `creatorDisplayName`. → NEW field (S).
  3. **Headline** "Senior Engineer at Paystack, teaching AI engineering" (max 80 chars) → **no field** → NEW.
  4. Bio (3 paragraphs, 427/600) → `bio` LIVE, but note the live write path is `PATCH /users/me` → `bio` (`PUT /creators/me` ignores `bio`).
  5. Expertise tags (LLMs, RAG, Python, Production ML; max 6 in the design vs 10 live) → `expertise` LIVE via `PUT /creators/me`.
  6. Social links: Twitter/X `tundebakare`, LinkedIn `tunde-bakare`, GitHub `tundebakare`, Website `tundebakare.dev` → **no field**; `PUT /creators/me` silently ignores `socialLinks` → NEW `socialLinks` object.
  7. "Last saved 3 hours ago" → no server-side timestamp on the creator write path; client-side only (or add `updatedAt` to `CreatorProfileResponse`).
- **Reusable components:** the 10-link settings sidebar (shared with C13/C16/C17/C18/C19); the upload block from `edit/page.tsx`.
- **Empty/loading/error states needed:** avatar upload errors, "cover image optional", char counters with the design's 80/600 limits.
- **Backend work required:** NEW fields on `CreatorProfileResponse` + `CreatorProfileRequest`: `headline`, `coverUrl`, `socialLinks { twitter, linkedin, github, website }`, `creatorDisplayName`, `updatedAt` (S).

### C16 — Creator payouts (`creator/C16-creator-payouts.html` → `/studio/settings/payouts`) — NEW
- **Verdict:** NEEDS-BACKEND (L)
- **Sections & the data each needs:**
  1. Large "Available balance ₦487,200 · Ready to withdraw · last updated 2 hours ago" + **Request payout** button → new.
  2. Payout account card (bank / account name / •••• 4821 / Verified / Update bank details) → new, write-masked.
  3. Payout schedule card (Friday 09:00 WAT, next payout Friday May 24 2026 + amount, minimum ₦10,000, threshold note) → new. **Note: C10 says the next batch is "May 25" and the pending amount is ₦48,200; C16 says "May 24" and ₦487,200 — the two screens disagree about the same field.**
  4. Payout history table (7 cols × 8 rows) + footer "8 payouts · Total ₦599,500 · Avg ₦74,937 per week" → new; identical row data to C10.
  5. Everything else in the file is the shared 10-item settings sidebar → chrome.
- **Reusable components:** same as C10. **Recommendation: implement C10 once at `/studio/payouts` and make `/studio/settings/payouts` a redirect (or vice versa) so the two never drift.**
- **Empty/loading/error states needed:** as C10.
- **Backend work required:** identical to C10 — `GET /api/v1/creators/me/payouts`, `GET /api/v1/creators/me/payouts/history`, `POST /api/v1/creators/me/payouts`, `PATCH /api/v1/creators/me/payout-account`.

### C17 — Creator tax (`creator/C17-creator-tax.html` → `/studio/settings/tax`) — NEW
- **Verdict:** NEEDS-BACKEND (M)
- **Sections & the data each needs:**
  1. Confidentiality alert (static copy) → no data.
  2. Tax identification: **TIN** "01234567-0000" (FIRS), **business name** "Tunde Bakare Consulting", **business type** (Individual / LLC / Partnership / Corporation), **VAT registration number** (empty, "required above ₦25M") → new creator tax profile.
  3. Tax residence: Country (Nigeria/Ghana/Kenya/South Africa/Other), State/Region (Lagos/FCT-Abuja/Rivers/Oyo/Kano/Other), Address → new.
  4. Monthly statements table, 6 columns × 4 rows: Month (+ date range), Gross, Platform fee, Net payout, Status (Final / Partial month), Statement (PDF) → new; depends on the same ledger as C7/C18. **The design's C17 figures contradict C18's for the same months** (April: ₦412,800 vs ₦430,000; net ₦371,520 = 90% vs ₦378,400 = 88%) — one statements service must serve both screens.
  5. "Last saved 5 hours ago" → client-side.
- **Reusable components:** settings sidebar; `.alert-info`; `.text-mono` for the TIN/VAT only.
- **Empty/loading/error states needed:** "no tax information on file — payouts above ₦50,000/month are paused" (the design's own rule), "statement not ready yet".
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/creators/me/tax` →
    ```
    CreatorTaxProfile {
      tin: string|null
      businessName: string|null
      businessType: "individual" | "llc" | "partnership" | "corporation" | null
      vatNumber: string|null
      country: string|null          // ISO-3166 alpha-2
      state: string|null
      address: string|null
      updatedAt: date-time|null
    }
    ```
  - **NEW** `PUT /api/v1/creators/me/tax` body = the same fields (all optional, partial update).
  - **NEW** `GET /api/v1/creators/me/statements?page&pageSize` → `Paginated<RevenueStatement>`:
    ```
    RevenueStatement {
      id, reference: "ILK-REV-2026-05",
      month: "2026-05", periodStart: date, periodEnd: date,
      grossAmount, platformFeeAmount, processorFeeAmount, creatorNetAmount, currency,
      status: "partial" | "final",
      documentUrl: string|null       // PDF
      generatedAt: date-time
    }
    ```
    (shared by C17 and C18 — C18 needs `creatorNet` at 88%, C17 currently shows 90%; **the service must define one definition of `creatorNet` and both screens must use it**).

### C18 — Creator revenue (`creator/C18-creator-revenue.html` → `/studio/settings/revenue`) — NEW
- **Verdict:** NEEDS-BACKEND (L)
- **Sections & the data each needs:**
  1. 4 stats: Lifetime earnings ₦4.1M (since March 2024) · This month ₦487,200 (+12.4% MoM) · Avg per month ₦340,000 (12-month average) · Avg per member ₦4,892 (across 1,940 members) → new aggregates. (Note "₦4,892 × 1,940 members" does not reconcile with either the lifetime or the monthly figure — fix the definition: *lifetime net per member* = ₦4,089,400 ÷ 1,940 = ₦2,108.)
  2. Revenue share card: 88% creator / 10% platform / ~2% Paystack → policy constants (see *Revenue-share feasibility*).
  3. 12-month revenue chart (Jun 2025 ₦228k → May 2026 ₦487k, Y 0–500k) + footer "Best month ₦487k · May · 12-month total ₦4,089,400 · YoY growth +113%" → new monthly series. (The growth % is unverifiable: +113% implies a Jun-2025 base of ~₦228k → May-2026 ₹487k, which is +113% ✓ — consistent.)
  4. Monthly statements table, 7 columns × 12 rows: Month, Statement ID (`ILK-REV-2026-05`, mono), Gross, Platform fee (10%), Creator net (88%), Status (Final / Partial), Download (PDF) → new (shared statement service with C17).
  5. Footer "12 months · Total gross ₦4,089,400 · Total net ₦3,599,327" → client-side sums; **the printed total net (₦3,599,327) does not equal the sum of the 12 rows (₦3,598,672 = 4,089,400 × 0.88)** — fix the design number.
- **Reusable components:** settings sidebar; the static SVG line+area chart; `MoneyAmount`.
- **Empty/loading/error states needed:** "no revenue yet", "statement generation pending", chart empty state.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/creators/me/revenue` →
    ```
    CreatorRevenue {
      lifetimeGrossAmount, lifetimeNetAmount: string
      currentMonthGrossAmount, currentMonthNetAmount: string
      currentMonthChangePercent: number
      averageMonthlyGrossAmount, averageMonthlyNetAmount: string
      averagePerMemberAmount: string
      memberCount: integer
      share: { creatorBps: 8800, platformBps: 1000, processorBps: 200 }
      monthly: [{ month: "2026-05", grossAmount, platformFeeAmount, processorFeeAmount, creatorNetAmount, statementId, statementStatus }]
      bestMonth: { month, grossAmount }
      yoyGrowthPercent: number
    }
    ```
  - **NEW** `GET /api/v1/creators/me/statements` + `GET /api/v1/creators/me/statements/{id}/pdf` (shared with C17).

### C19 — Creator verification (`creator/C19-creator-verification.html` → `/studio/settings/verification`) — NEW
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Verified status banner: "You're verified · Verified since March 14, 2024 · Verification ID ILK-VRF-9281" → `GET /creators/me` → `verificationStatus`, `isVerified` LIVE; **"Verified since" and the verification ID have no field** → NEW `verifiedAt`, `verificationId`.
  2. "What we verified" — 4 checked items with detail: National identity (NIN •••• 4471), Proof of work (LinkedIn + website + portfolio), LinkedIn profile (linkedin.com/in/tunde-bakare), Email + phone (tunde@bakare.dev · +234 803 ••• 4821), each with a "Verified Mar 14, 2024" timestamp → **no evidence/checks resource**. → NEW.
  3. "Update evidence" card + "Re-submit evidence" button + "Last submission: Mar 14, 2024" + "We'll re-review within 2 business days" → NEW submission endpoint.
  4. Submission history table, 5 columns × 3 rows: Date, Type ("Initial verification"), Status (Approved/Pending/Rejected), Reviewer (name + "Admin · Operations" avatar, or "— / Resubmitted by you"), Details (View / rejection reason "Insufficient work proof") → NEW.
  5. "Why verification matters" — 3 bullets, one of which claims the creator spotlight newsletter has **48,200 subscribers** (a platform statistic that does not exist anywhere) and that verified creators get Friday payout priority (a policy the money subsystem must honour) → static copy; the 48,200 figure must be removed or sourced.
  6. The admin route `PATCH /api/v1/admin/creators/{user_id}/verification` body `{ status }` exists — but it is **admin-only**, so the creator screen can only ever read.
- **Reusable components:** settings sidebar; teal `--verify` check circle (used **only** here and in C13); `alert-success`; status badges.
- **Empty/loading/error states needed:** "not submitted yet" / "under review" / "rejected — fix and resubmit" states with the rejection reason.
- **Backend work required (concrete contract):**
  - **NEW** `GET /api/v1/creators/me/verification` →
    ```
    CreatorVerification {
      verificationId: string|null        // "ILK-VRF-9281"
      status: "pending" | "verified" | "rejected"
      submittedAt: date-time|null
      verifiedAt: date-time|null
      reviewer: { userId, displayName, role } | null
      checks: [{ key: "nin"|"proof_of_work"|"linkedin"|"email_phone", label, status: "verified"|"pending"|"rejected"|"not_submitted", verifiedAt: date-time|null, maskedValue: string|null, detail: string|null }]
      submissions: [{ id, submittedAt, type, status, reviewer, rejectionReason, evidence }]
    }
    ```
  - **NEW** `POST /api/v1/creators/me/verification` body `{ nin?, proofOfWorkUrls[]?, linkedinUrl?, websiteUrl?, phone? }` → submission record.
  - Extend `CreatorProfileResponse` with `verifiedAt` + `verificationId` (S) so the badge and the public creator page can show the date without the extra call.

### C20 — Manage discussions (`creator/C20-manage-discussions.html` → `/studio/communities/[id]/discussions`) — NEW
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. Header "47 threads · 12 unanswered · 3 reported" + Back / New thread → counts need a new summary endpoint.
  2. 5 filter tabs with counts: All 47 · Pinned 2 · Locked 5 · Reported 3 · Unanswered 12 → NEW per-tab counts and a `filter` query param.
  3. Search threads + Sort (Newest / Most voted / Most replied / Oldest) → `search` exists on `GET /communities/{slug}/posts`; **sort by votes/replies does not** → NEW sort params.
  4. 8 thread cards, each with: vote widget (up/down buttons + count 124 / 89 / 47 / 32 / 24 / 12 / 8 / −3 and the "voted" state), status badge (Pinned / Reported / Locked / Unanswered), reply count + view count ("18 replies · 2.4k views"), title, author (name or *Anonymous*) + relative time + "pinned by you / locked by you / violates community guidelines", tags (RAG, Beginner, Show & tell…), and an actions row (Pin/Unpin, Lock/Unlock, Edit, Delete) → **of these, only title, author, time, `isPinned`, `isAnnouncement` and `commentCount` exist**. Missing: `voteCount` + my vote, `viewCount`, `isLocked`, report state + reporter count, `tags[]`, anonymous author, "answered" state, and the votes/lock/report actions.
  5. Pagination (1–8 of 47) → `page`/`pageSize`/`total` LIVE.
- **Reusable components:** `.thread-card`, `.thread-vote`, `.thread-vote-count`, `.thread-title`, `.thread-meta`, `.thread-tags`, `.chip-sm` — all already in the design system; the learner feed page (`app/(learner)/communities/[slug]/feed/page.tsx`) already calls `GET /communities/{slug}/posts` and `POST /communities/{slug}/posts` and can be the source of the card component.
- **Empty/loading/error states needed:** "no threads match these filter", "no threads yet — start the conversation", per-tab empty states.
- **Backend work required (concrete contract):**
  - Extend `PostResponse` with `isLocked: boolean`, `isAnonymous: boolean`, `voteCount: integer`, `viewerVote: -1|0|1`, `viewCount: integer`, `reportCount: integer`, `tags: string[]`, `answeredByUserId: uuid|null`, `replyCount: integer` (alias of `commentCount`) (M).
  - **NEW** `POST /api/v1/posts/{post_id}/vote` body `{ direction: "up" | "down" }` → updated vote state.
  - **NEW** `PATCH /api/v1/posts/{post_id}` already accepts `isPinned`; add `isLocked` to `PostUpdateRequest` (S).
  - **NEW** `POST /api/v1/posts/{post_id}/report` body `{ reason: string }` → report record; **NEW** `GET /api/v1/posts/{post_id}/reports` → reporter list; **NEW** `DELETE /api/v1/reports/{report_id}` (dismiss).
  - **NEW** `GET /api/v1/communities/{slug}/posts/summary` → `{ total, pinned, locked, reported, unanswered }`.
  - **NEW** query params on `GET /api/v1/communities/{slug}/posts`: `filter` ∈ `all|pinned|locked|reported|unanswered`, `sort` ∈ `newest|most_voted|most_replied|oldest`.

## Backend gaps consolidated

| Gap | Screens affected | Proposed endpoint/model | Effort |
|---|---|---|---|
| **Transaction ledger** (gross / platform fee / processor fee / creator net / status / plan / discount code / receipt) | C7, C4, C6, C11, C14, C17, C18 | **NEW** `GET /api/v1/communities/{slug}/transactions` → `Paginated<TransactionItem>` (fields in C7 detail) + **NEW** `GET /api/v1/communities/{slug}/transactions/summary?from&to&bucket` | **L** |
| **Payout subsystem** (balance, bank account, schedule, history, request, receipt) | C10, C16, C7, C4, C14, C18 | **NEW** `GET /api/v1/creators/me/payouts`, `GET /api/v1/creators/me/payouts/history`, `POST /api/v1/creators/me/payouts`, `PATCH /api/v1/creators/me/payout-account`, `POST /api/v1/creators/me/payout-account/verify` | **L** |
| **Creator revenue aggregate + 12-month series** | C18, C2, C13, C17, C11 | **NEW** `GET /api/v1/creators/me/revenue` (see C18 contract) | **L** |
| **Monthly statements + PDFs** (shared by C17 and C18) | C17, C18 | **NEW** `GET /api/v1/creators/me/statements`, `GET /api/v1/creators/me/statements/{id}/pdf` | **M** |
| **Analytics** (member growth, completion, cohorts, engagement, per-community revenue) | C11, C4, C2, C6 | **NEW** `GET /api/v1/communities/{slug}/analytics`, `GET /api/v1/creators/me/analytics` | **L** |
| **Discount codes** (CRUD, redemption counts, expiry, scope, revenue impact) | C12, C5, C7, C14 | **NEW** `GET|POST /api/v1/communities/{slug}/discount-codes`, `PATCH|DELETE .../{code_id}`, `GET .../summary`; **NEW** `POST /api/v1/communities/{slug}/enroll` body `{discountCode}` | **M** |
| **Notifications** (feed, per-type counts, read state, preferences) | C14 | **NEW** `GET /api/v1/notifications`, `GET /api/v1/notifications/summary`, `PATCH /api/v1/notifications/{id}/read`, `POST /api/v1/notifications/read-all`, `GET|PUT /api/v1/me/notification-preferences` | **M** |
| **Creator tax profile** (TIN, business, VAT, residence, address) | C17 | **NEW** `GET|PUT /api/v1/creators/me/tax` | **M** |
| **Creator verification detail** (ID, date, 4 checks, submission history, evidence submission) | C19, C13, C14, C1 | **NEW** `GET|POST /api/v1/creators/me/verification`; extend `CreatorProfileResponse` with `verifiedAt`, `verificationId` | **M** |
| **Per-member progress** (C6 progress bar, C4 completion rate, C11 lesson completion) | C6, C4, C11 | **NEW** `GET /api/v1/communities/{slug}/members/{user_id}/progress`; add `progressPercent` to `MemberResponse`; add `GET /api/v1/communities/{slug}/members/summary` | **M** |
| **Community write model gaps** (tags, learning outcomes, pricing model/cadence, publish date) | C3, C4, C5, C2 | Extend `CommunityCreateRequest`/`CommunityUpdateRequest`/`CommunityDetail` with `tags[]`, `learningOutcomes[]`, `pricingModel`, `lifetimePriceAmount`, `billingInterval`, `publishedAt` | **S–M** |
| **Creator profile write model gaps** (headline, cover banner, social links, creator display name) | C1, C15, C13 | Extend `CreatorProfileResponse`/`CreatorProfileRequest` with `headline`, `coverUrl`, `socialLinks{twitter,linkedin,github,website}`, `creatorDisplayName`, `updatedAt` | **S** |
| **Member roster gaps** (email, plan, amount paid, Paused/Refunded statuses, joined-date + plan filters) | C6, C4, C7 | Extend `MemberResponse`; extend `EnrollmentStatus` enum; add `joinedFrom`/`joinedTo`/`plan` params to `GET /communities/{slug}/members` | **M** |
| **Course/list counts** (module & lesson counts without N+1) | C4, C8, C9, C2 | Add `moduleCount`, `lessonCount` to `CourseResponse` | **S** |
| **Lesson gating & extras** (Both type, free preview, preview attachment, prerequisite, lock-until, resources, video processing) | C9, C8 | Extend lesson schemas; **NEW** `GET|POST|DELETE /api/v1/lessons/{lesson_id}/resources`; extend `LessonContentType` with `both` | **M** |
| **Module prerequisite** | C8, C9 | Add `prerequisiteModuleId` to module schemas | **S** |
| **Discussion moderation** (votes, views, lock, reports, tags, anonymous, unanswered, sort) | C20, C14, C9 | Extend `PostResponse`/`PostUpdateRequest`; **NEW** `POST /api/v1/posts/{id}/vote`, `POST /api/v1/posts/{id}/report`, `GET /api/v1/posts/{id}/reports`, `GET /api/v1/communities/{slug}/posts/summary` | **M** |
| **Lesson-scoped discussion** (threads + reply tree; backend comments are one level deep, no `parentId`) | C9, C20 | **NEW** `GET /api/v1/lessons/{lesson_id}/discussions` → `Paginated<DiscussionThread>`; add `parentId` to `CommentResponse` | **M** |
| **Community danger zone** (archive 30-day, restore, delete + email confirmation + refunds) | C5 | **NEW** `POST /api/v1/communities/{slug}/archive`, `.../restore`, `DELETE /api/v1/communities/{slug}`, `POST .../delete-confirmation` | **M** (depends on refunds) |
| **Category counts** (the design shows "· 184 communities") | C3, C5 | Add `communityCount` to `CategoryResponse`; **NEW** `GET /api/v1/categories?includeCounts=true` | **S** |
| **Platform fee policy** (88/10/2) as data rather than copy | C13, C18, C1, C7 | **NEW** `GET /api/v1/platform/fees` → `{ creatorBps, platformBps, processorBps, minPayoutAmount, schedule, waiverThreshold }` | **S** (after the money subsystem) |
| **Video upload / transcode** (C9's "Processing 64% complete") | C9 | **NEW** `POST /api/v1/uploads/videos` + `GET /api/v1/uploads/videos/{id}` → `{ status, progressPercent, durationSeconds }` | **L** (or drop the panel) |

## Revenue-share feasibility: can the current backend express 88 / 10 / 2?

**No — not even close.** The live backend has **no fee model of any kind**:

1. `CommunityCreateRequest.priceAmount` (decimal string, default `"0.00"`) is the **only** price in the system, and `CommunityDetail.isFree` is derived from it being zero. There is **no** `platformFeeBps`, no `creatorShareBps`, no `processorFeeBps`, no per-plan price, no cadence.
2. `POST /api/v1/communities/{slug}/enroll` is **free-join only** (a paid community returns `402 payment_required` — the learner hook already handles this). **No checkout, no payment intent, no provider call, no ledger.** So there is no gross amount to split in the first place.
3. `CommunityDetail` / `CommunityListItem` / `EnrollmentResponse` carry **no** money other than `priceAmount` / `priceCurrency`. `MemberResponse` carries no money at all.

To express 88/10/2 the backend needs, at minimum:

| Piece | Why the current model cannot carry it | Proposed field |
|---|---|---|
| Creator share | No fee configuration anywhere | `share.creatorBps = 8800` |
| Platform fee | No fee configuration anywhere | `share.platformBps = 1000` |
| Paystack processing | The processor fee is charged at source by the PSP, not by Interlekt — but the creator's net must still be stated after it, so it must be modelled explicitly | `share.processorBps = 200` |
| Gross vs net | Only `priceAmount` exists; there is no gross/settled amount | `TransactionItem.grossAmount` / `platformFeeAmount` / `processorFeeAmount` / `creatorNetAmount` |
| Per-plan pricing | One price field, no cadence, no second price | `CommunityDetail.pricingModel` + `priceAmount` + `lifetimePriceAmount` + `billingInterval` |
| Fee waivers ("₦0 Paystack fee for first ₦500k") | No threshold concept | `share.processorFeeWaiverThreshold = 500000` (or a per-transaction fee rule) |
| Payout thresholds ("minimum ₦10,000") | No payout resource | `CreatorPayoutSummary.minimumPayoutAmount` |

**And the design itself is inconsistent about it** (see below). The 88/10/2 split must be resolved to **one** definition before the money subsystem is specified — right now C7 and C17 compute creator net as **90%** (gross − 10% platform fee) while C13 and C18 promise **88%**. That is a 2-point-of-revenue product decision, not an implementation detail.

## Design arithmetic / consistency bugs found while mapping (must be fixed in the design, not in the code)

1. **Creator share contradicts itself.** C13/C18 say **88% creator / 10% platform / ~2% Paystack**. C7's stat card computes ₦320,400 gross − ₦32,040 (10%) = **₦288,360 = 90%**, not 88%. C17's statements also use 90% (₦487,200 − ₦48,720 = ₦438,480) while C18's use 88% for the same month (₦428,736).
2. **C7's footer mixes three different bases.** "12 transactions · Gross ₦253,725 · Platform fee ₦24,522 · Your net ₦213,053": ₦253,725 is the sum of **all 12 rows** (including the refunded ₦8,500 and the failed ₦8,500); ₦24,522 is the sum of the **11 rows that carry a fee** (all but the failed one); ₦213,053 is the sum of the **10 rows that are neither failed nor refunded** (paid + pending). So gross − fee = ₦229,203 ≠ ₦213,053 — off by **₦16,150**. The internally consistent footer is **gross ₦236,725 · platform fee ₦23,672 · your net ₦213,053** (paid + pending, and ₦236,725 − ₦23,672 = ₦213,053 exactly), or the fully-settled view **₦228,225 / ₦22,822 / ₦205,403**.
3. **C18's footer total net is wrong.** The 12 rows sum to **₦3,598,672** (= ₦4,089,400 × 0.88). The printed ₦3,599,327 is ₦655 too high.
4. **C18's table has no Paystack-fee column** even though its "Creator net" row is 88% (i.e. it already deducts 2%). Add a "Processing fee" column or label the column "Net after fees".
5. **"Save 17%" is arithmetically wrong** (C5). ₦85,000 lifetime = exactly 10 × ₦8,500 monthly → the saving is **0%**, not 17%.
6. **C5 and C12 describe the same discount codes with different numbers.** C5: ADA15 142/200, WELCOME100 38/50, "2 active codes · 180 total redemptions". C12: ADA15 47/100, WELCOME100 50/50 (used up), plus EARLYBIRD/LAUNCH50/FOUNDERS/BETA — 6 codes, 248 redemptions.
7. **C11 labels the same number two ways.** ₦320,400 is "Gross volume" in C7 but "30-day net" in C11. Likewise C11's per-community revenue (₦92,820 / ₦58,200) contradicts C2's tiles (₦98,800 / ₦68,000), and C11's footer total ₦471,420 contradicts C2's ₦487,200.
8. **Minimum payout: ₦5,000 (C1) vs ₦10,000 (C10/C16).**
9. **Payout fee threshold contradicts itself.** C10's ILK-PAY-123 note says "Earnings > ₦500k threshold" (that payout was ₦72,800, i.e. *under* ₦500k) while C7 says "₦0 Paystack fee for first ₦500k".
10. **Next-payout date disagrees** between the two payout screens: C10 "Fri May 25" / C16 "Friday, May 24, 2026"; pending ₦48,200 vs ₦487,200.
11. **C17 and C18 disagree on the same months**: April gross ₦412,800 vs ₦430,000; March ₦328,400 vs ₦415,000.
12. **"Avg per member ₦4,892 across 1,940 members" (C11, C18) does not reconcile** with either the month (₦487,200) or the lifetime (₦4.1M); lifetime net per member is ₦2,108.
13. **"1,184 active" vs the member statuses.** The backend's only member statuses are `pending|active|cancelled` — there is no "paused" or "refunded", so C6's filters and the "Refunded 12" stat have no source.
14. **C19 claims a 48,200-subscriber newsletter** and "verified creators get Friday payout priority" — neither exists in the backend; both must be sourced or removed.
