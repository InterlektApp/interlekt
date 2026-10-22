# Interlekt Redesign — Implementation Plan (82 screens → live backend)

**Date:** 2026-10-21 · **Design:** `interlekt-redesign (4).zip` v3.1 (82 screens, 4 shells)
**Backend:** `https://interlekt-backend.onrender.com` (47 paths, 76 schemas) — probed live, not inferred
**Mapping docs:** `mapping-public.md` · `mapping-learner.md` · `mapping-creator.md` · `mapping-admin.md`

---

## 1. Verdict summary

| Shell | Screens | LIVE | PARTIAL | MOCK | NEEDS-BACKEND |
|---|---|---|---|---|---|
| Public (A1–A24) | 24 | 7 | 13 | 1 | 3 |
| Learner (B1–B29) | 29 | 0 | 11 | 0 | 18 |
| Creator (C1–C20) | 20 | 0 | 10 | 0 | 10 |
| Admin (D1–D9) | 9 | 0 | 1 | 0 | 8 |
| **Total** | **82** | **7** | **35** | **1** | **39** |

**"LIVE" means static/zero-API screens** (legal pages, 404, 500, logout). Every screen that shows real
platform content is PARTIAL at best — the backend returns the entity but not the aggregate the design
shows.

**Buildable now against live data: 43 screens** (7 LIVE + 35 PARTIAL + 1 MOCK).
**Blocked on backend work: 39 screens.**

---

## 2. Wave plan — 43 screens to build now, wired to live data

Implementation order is by dependency, not by screen ID. Each wave is independently shippable.

### Wave 0 — Design system port (blocks everything)
| Task | Detail |
|---|---|
| `design-system.css` → Tailwind tokens | Extract `:root` vars from `styles/design-system.css` into `tailwind.config.ts` theme + `globals.css` CSS vars. One accent (#0071E3), Inter only, radii 8/12/16 + pill, hairline `--line` borders, **no card shadows** (`.card-lift` hover lift only). |
| Component port | `icons.js` icon set → Lucide (already in repo) or an inline SVG map. `ILK.injectNavTop / injectStudioRail / injectAdminRail / injectFooter / injectAmbientIcons` → 4 React shell components: `PublicNav`, `LearnerNav`, `StudioRail`, `AdminRail`, `SiteFooter`. |
| Motion | `.fade-in-up` + IntersectionObserver → one `Reveal` wrapper component. `.stagger` → CSS delays. `.collapsible-*`, `.tabs-animated`, `.carousel-wrap`, `.heatmap`, `.thread-card`, `.reply-tree`, `.settings-shell` → React primitives. |
| **Fix design-system gaps** | `.discussions-grid`, `.discussions-rail`, `.code-block`, `.activity-grid`, `.activity-side-grid` are used by B27/B28/B29 but **do not exist** in the CSS. Must be authored. |

### Wave 1 — Public shell, real data (13 screens)
`/` · `/communities` · `/communities/[slug]` · `/creators/[slug]` · `/search` · `/auth/login` ·
`/auth/register` · `/auth/forgot-password` · `/auth/reset-password` (NEW) · `/auth/learner-login` (NEW) ·
`/creators/auth/login` (NEW) · `/logout` (NEW) · `not-found.tsx` + `error.tsx` + `global-error.tsx` (NEW)

**Endpoints:** `GET /communities` · `GET /communities/{slug}` · `GET /communities/{slug}/courses` ·
`GET /creators/{user_id}` · `GET /categories` · `POST /auth/login` · `POST /auth/register` ·
`POST /auth/forgot-password` · `POST /auth/reset-password` · `POST /auth/logout`

**Known live constraints to design around (verified):**
- `GET /communities/{slug}/courses` → **401 anonymous**; `GET /communities/{slug}/reviews` → **401 anon**;
  `GET /communities/{slug}/members` → **403 for learners** ("Only the community's creator can view its members").
  → A3's curriculum/reviews/members tabs must degrade to an **enrolled-only** state with a locked preview.
- `GET /categories` returns **8** categories with no counts. The design hardcodes 10 chips with counts →
  **render the 8 real categories, no counts**, until a `communityCount` field exists.
- `priceAmount` is a bare list price with **no billing interval** → the design's "/mo" suffix has no data
  source. Render `₦2,500` with no cadence, or derive cadence from a new field.
- `GET /users/{user_id}` is the public profile **by UUID**; `/creators/[slug]` is served by slug today.
  A4's "username" is unavailable.
- Google OAuth has no endpoint → ship the button **disabled** with honest copy (current app already does this).
- `POST /auth/register` returns usable tokens immediately and there is **no email-verification model** → A10
  cannot be truthful; it ships as "verification arrives by email" copy only once the backend adds the model.

### Wave 2 — Public static + legal (11 screens)
`/about` · `/pricing` · `/help` · `/terms` · `/privacy` · `/cookies` · `/refunds` · `/trust` ·
`/auth/verify-email` · `/discussions` (needs backend) · `/`

**Content source:** `content/legal/*.mdx` + `content/help/*.mdx`, rendered by a static route group.
**Legal copy must be corrected against reality** — see §5 (A19 cookies, A20 refunds, A15 pricing).

### Wave 3 — Learner core (7 screens)
`/dashboard` · `/my-communities` · `/communities/[slug]/classroom` ·
`/communities/[slug]/classroom/lessons/[lessonId]` · `/communities/[slug]/feed` · `/profile` ·
`/communities/[slug]/review` (NEW)

**Endpoints:** `GET /users/me/learning` · `GET /enrollments/mine` · `GET /communities/{slug}` ·
`GET /courses/{id}` · `GET /courses/{id}/progress` · `GET /lessons/{id}` · `POST|DELETE /lessons/{id}/complete` ·
`GET|POST /communities/{slug}/posts` · `GET|POST /posts/{id}/comments` · `GET|POST|PATCH /communities/{slug}/reviews` ·
`PATCH /users/me`

**Live data available:** module/lesson tree, per-lesson completion, course %, enrollments, posts,
comments, review rating + body, profile fields.
**Honest gaps to render as empty states:** streaks, weekly minutes, activity heatmap, achievements,
member avatar stack (403), likes, top-contributor aggregation, lesson resources/transcript/code-block
(`content` is one opaque string), lock states, next live session.

### Wave 4 — Learner settings hub (10 screens)
`/settings` · `/settings/profile` · `/settings/account` · `/settings/notifications` · `/settings/privacy` ·
`/settings/connected` · `/settings/sessions` · `/settings/data` · `/settings/delete` · `/welcome`

**Live:** `GET /users/me` · `PATCH /users/me` (`displayName`, `avatarUrl`, `bio` only) ·
`GET /auth/me` (email) · `POST /auth/forgot-password` · `POST /auth/reset-password` · `GET /categories`

**Design conflict to resolve before build:** B10 uses a 6-item sidebar; B19–B26 use the `.settings-shell`
8-item sidebar. **Pick one** — recommend the `.settings-shell` (8 items) since 8 of the 10 screens are
sub-routes of it, and fold B10's "Billing & payments" + "Danger zone" into it.

### Wave 5 — Creator studio (10 screens)
`/onboarding` · `/studio` · `/studio/communities/new` · `/studio/communities/[id]` ·
`/studio/communities/[id]/edit` · `/studio/communities/[id]/members` ·
`/studio/communities/[id]/course-builder` · `/studio/communities/[id]/lesson-editor` ·
`/studio/settings` · `/studio/settings/public-profile` · `/studio/settings/verification` ·
`/studio/communities/[id]/discussions`

**Endpoints:** `GET|PUT /creators/me` · `GET /communities/mine` · `GET|POST|PATCH /communities/{slug}` ·
`POST /communities/{slug}/publish|unpublish` · `GET /communities/{slug}/members` ·
`GET|POST|PATCH|DELETE /communities/{slug}/courses` · `PATCH /courses/{id}/modules/reorder` ·
`GET|POST|PATCH|DELETE /modules/{id}/lessons` · `POST /modules/{id}/lessons/reorder` ·
`POST /lessons/{id}/publish|unpublish` · `GET|PATCH|DELETE /posts/{post_id}` · `GET /categories` ·
`POST /uploads/images`

**C8 (course builder) and C9 (lesson editor) are the most buildable in the whole product** — the full
courses → modules → lessons CRUD, reorder, publish, delete loop already works live. Only 3–4 fields are
missing (prereq module, lock state, `contentType: "both"`, `moduleCount`/`lessonCount` on the list endpoint).

**Live gotchas (verified by probe):**
- `PUT /creators/me` **silently drops** `headline`, `socialLinks`, `coverUrl` — no error. C15's headline and
  cover banner need new fields before the UI can be honest.
- `GET /creators/me` does **not** return `memberCount` even though the OpenAPI declares it.
- `CommunityDetail.courses[]` is **always `[]`** even for a community with a published course → C4's
  "2 courses · 5 modules · 20 lessons" must come from `/courses` + `/courses/{id}`, not from the detail call.
- `POST /communities` requires the creator profile to have `expertise` first (`422 creator_profile_required`).
- `POST /modules` defaults `isPublished: true`; lessons created published still report `publishedAt: null`.

### Wave 6 — Admin (1 screen live-partial, 1 decision working)
`/verification` (D3) — the **only** live admin action:
`PATCH /api/v1/admin/creators/{user_id}/verification` body `{status: pending|verified|rejected}`.
Today the request accepts **only `status`** — no reviewer note, no reason, no evidence. D3's decision
panel must render the three actions live and show the note field disabled until the request widens.

**All 5 existing admin pages are static placeholders** (literal `"—"`, zero `useQuery` calls) — they must be
rewritten, and there is no `hooks/use-admin.ts` and no `admin` block in `query-keys.ts` today.

---

## 3. The 39 backend-blocked screens — what the dev must build

Full request/response contracts are in the four mapping docs. Consolidated by subsystem:

### L — new subsystems (blocks 30 of the 39 screens)
| Subsystem | Endpoints | Screens |
|---|---|---|
| **Payments** | `POST /communities/{slug}/checkout` (plans → session), `GET /checkout/{ref}`, `GET /enrollments/mine` (with plan), `POST /enrollments/{id}/cancel`, `POST /enrollments/{id}/refund-request`, `GET /orders/me`, `GET|PUT /payment-methods`, `GET /subscriptions/me` + `PATCH` (pause/resume/cancel) | B6, B11, B12, B13, B14 |
| **Money/ledger** | `GET /communities/{slug}/transactions`, `GET /communities/{slug}/transactions/summary`, `GET /creators/me/revenue`, `GET /admin/transactions` + `/summary` + `/export.csv`, `GET /admin/payouts` + `/stats` + `POST /{id}/decision` + `/recent-decisions`, `GET /admin/refunds` + `/stats` + `POST /{id}/decision` | C2, C4, C7, C10, C16, C18, D1, D5, D7, D8, B6 |
| **Notifications** | `GET /notifications` + `/summary` + `PATCH /{id}/read` + `POST /read-all`, `GET|PUT /me/notification-preferences` | B8, C14, B21 |
| **Messaging** | `GET /conversations`, `GET /conversations/{id}/messages`, `POST /messages`, `POST /reports` | B9, D4 |
| **Threads/discussions** | `GET /communities/{slug}/threads`, `GET /threads/{id}`, `POST /threads`, `POST /threads/{id}/replies`, `POST /threads/{id}/vote`, `GET /discussions` (cross-community), tags, accepted-answer, contributors | B28, B29, C20, A24 |
| **Activity/streaks/badges** | `GET /users/me/activity` (daily buckets), `GET /users/me/badges`, `GET /users/me/streak` | B27, B1 |
| **Certificates** | `GET /certificates/{id}`, `GET /certificates/verify/{code}`, `GET /users/me/certificates` | B16 |
| **Calendar/live sessions** | `GET /events`, `GET /communities/{slug}/events` | B18, B1, B3 |
| **Analytics** | `GET /communities/{slug}/analytics`, `GET /creators/me/analytics` | C11, C4 |
| **Admin ops** | `GET /admin/stats`, `GET /admin/users` + `/stats` + `PATCH /admin/users/{id}` + `/invite`, `GET /admin/reports` + `/stats` + `PATCH /{id}`, `GET /admin/audit-log` + `/export.csv`, `GET|PATCH /admin/settings` (+ api-keys, webhooks, roles, email templates, feature flags) | D1, D2, D4, D6, D9 |
| **Payouts (creator side)** | `GET|POST /creators/me/payouts`, `GET /creators/me/payouts/history`, `PATCH /creators/me/payout-account` | C10, C16 |
| **Platform config** | `GET /platform/fees`, `GET /platform/public-config`, `GET /stats` (public counters) | A1, A2, A15, C13, C18 |

### M — new resource + CRUD (9 screens)
Email verification (A10) · discount codes (C12) · creator tax + statements (C17) · creator verification
detail + submission history (C19) · privacy model + block list (B22) · connected accounts (B23) ·
sessions + login history (B24) · data export (B25) · account deletion (B26) · 2FA + password change (B20) ·
notification preferences (B21) · member progress + summary (C6)

### S — field additions only (no new endpoint)
`users`: `username`, `location`, `pronouns`, `coverUrl`, `interests`, `emailVerified`, `phoneNumber`,
`passwordLastChanged` · `communities`: `tags[]`, `learningOutcomes[]`, `pricingModel`,
`lifetimePriceAmount`, `billingInterval`, `publishedAt` · `creators`: `headline`, `coverUrl`,
`socialLinks`, `creatorDisplayName`, `verifiedAt`, `verificationId` · `lessons`: `resources[]`,
`isFreePreview`, `prerequisiteLessonId`, `lockedUntil`, `contentType: "both"` ·
`posts`: `isLocked`, `isAnonymous`, `voteCount`, `viewCount`, `reportCount`, `tags` ·
`reviews`: `recommend`, `showNamePublicly` · `categories`: `communityCount` ·
`MemberResponse`: `email`, `plan`, `amountPaid`, `paused`, `refunded` · `CourseResponse`:
`moduleCount`, `lessonCount` · `AccountResponse`: `isEmailVerified` · `VerificationStatusUpdateRequest`:
`reason`, `note`, `evidence`

---

## 4. Backend facts that must be respected (verified live, not from the spec)

1. **Pagination envelope is FLAT**: `{ items, total, page, pageSize, totalPages }` — not nested under `page`.
   The frontend `Paginated<T>` type is already correct.
2. **Auth is Bearer in the body**, not cookies. Tokens live in `localStorage`
   (`interlekt.access_token`). There are **zero cookies** in the app.
3. **Money is a decimal string** (`"2500.00"`) with `priceCurrency`. Never a float, never a number.
4. **Roles are an array** (`user.roles: ["creator"]`), not a single field.
5. `priceAmount` is a **community list price**, not revenue, not a transaction. Do not aggregate it as money.
6. `GET /users/{user_id}` deliberately **omits email**. Admin user lists need a private read.
7. `GET /communities/{slug}/members` is **creator-only (403)**.
8. `GET /communities/{slug}/posts` is **403 for non-enrolled**; `GET /communities/{slug}/reviews` is **401 anon**.
9. `POST /communities/{slug}/enroll` returns **402 `payment_required`** for paid communities — the free-enroll
   hook already handles this; a checkout flow must slot in behind it.
10. `GET /creators/me` omits `memberCount`; `PUT /creators/me` silently drops `headline`/`socialLinks`/`coverUrl`.
11. `CommunityDetail.courses[]` is always `[]`.
12. `UserRole` enum is `learner|creator|admin` — the design's 4 admin roles (Super Admin/Operator/Support/
    Read-only) do not exist.
13. `CreatorProfileResponse.memberCount` is in the OpenAPI as required but **absent from the deployment**.

---

## 5. Design data corrections required before build

The design's mock data contradicts itself and the backend. **Never port these numbers into components —
compute from the server.** Flagged by the mapping agents:

| Where | Problem |
|---|---|
| B6 vs C18 | Revenue split is 88/12 in the learner receipt, 88/10/2 in the creator screens. 88+12 ≠ 88+10+2. **Pick one policy, expose it from the backend.** |
| B6 | VAT ₦544 on a ₦7,225 subtotal is 7.53%, not the stated 7.5% (₦542). Total says ₦7,769; the rows sum to ₦7,767. |
| C7 vs C11 | C7 calls ₦320,400 "gross", C11 calls it "net". C11's per-community revenue contradicts C2's tiles. |
| C7 | Footer mixes three bases (gross = 12 rows, fee = 11 rows, net = 10 rows). Off by ₦16,150. Consistent footer: ₦236,725 / ₦23,672 / ₦213,053. |
| C7 vs C17 vs C18 | Creator net computed at **90%** in C7/C17 but promised at **88%** in C13/C18. On ₦320,400, 88% = ₦281,952, not the printed ₦288,360. |
| C18 | Footer total net is wrong by ₦655 (₦3,599,327 printed vs ₦3,598,672). |
| C10/C16 vs C1 | Minimum payout is ₦5,000 in C1, ₦10,000 in C10/C16. Next payout: May 24 (C16) vs May 25 (C10). |
| C17 vs C18 | April gross is ₦412,800 in one and ₦430,000 in the other. |
| C5 vs C12 | Same discount codes, different numbers (142/200 vs 47/100; 2 codes/180 redemptions vs 6 codes/248). |
| C1 | "Save 17%" is 0% — ₦85,000 is exactly 10 × ₦8,500. |
| D1 | Geography bars are % **of Lagos**, not % of total — the "12,476 across all others" figure is on a different scale. Do not merge. |
| B2 | Tabs say "All 6" but 5 cards render. |
| B3 | Module 2 says 67% for 3 of 6 lessons (should be 50%). "8h 24m this week" was copied into the course total duration. |
| B7 | "8 months" membership vs "joined March 2024" (9 months). |
| B16 vs B2 | Certificate says "18 of 18" lessons; B2 says "20 of 20". |
| B27 | Says 247 contributions; the bars total 265. |
| B13 | Security copy lists Paystack as its own example ("processed by Paystack — the same provider used by Paystack, Flutterwave, and Kuda"). |
| B20 | Renders 10 recovery codes while 2FA reads "Not enabled". |
| A19 | The cookie policy is factually false for this codebase (localStorage tokens, no cookies, no analytics). Rewrite for localStorage **or** move to httpOnly cookies. |
| A20 | Refund policy points at "Account Settings → Subscriptions" and self-serve refunds; neither exists. |
| A1 | "1,140 communities / 48,200 learners" is off by 3 orders of magnitude from live data (4 communities). |
| A15 | Pricing page advertises a ₦4,500/mo floor; the lowest live paid community is ₦2,500 and there is no pricing model. |
| A22/A23 | Header comments name `POST /api/auth/learner-login` and `POST /api/creators/auth/login` — **neither exists**. Reuse `POST /auth/login`, branch on `user.roles[]`. |
| B13/B18/B5 | `AuthorSummary` has **no `isVerified`** — but the design renders a teal verification check next to post authors. |

---

## 6. Content seeding — required before any screen can be QA'd

Live seed is 4 communities, 0 reviews, 0–4 members, 3 posts, 0 comments, **all `avatarUrl` null**,
2 of 4 with `images.example.com` cover URLs (which crash `next/image` unless the host is whitelisted —
already fixed in `next.config.ts`).

Minimum seed to make the redesign visible: 8–10 communities across the 8 real categories, real cover
images, 3–6 creators with bios/expertise/verification, 2–3 courses per community with modules and
published lessons, learners enrolled with progress, posts + comments + reviews, and platform stats
consistent with the new `/stats` endpoint.

**Image strategy (deferred, per your instruction):** `images.unsplash.com` works and is already whitelisted
in `next.config.ts`; `source.unsplash.com` is dead; the Cloudinary unsigned preset `interlekt` does not
exist on the `out05vii` cloud. Remaining options: (a) verify a curated list of Unsplash photo IDs,
(b) create the Cloudinary unsigned preset, (c) host covers ourselves.

---

## 7. Known data pollution on the live backend

The creator-mapping agent ran live API probes to verify behaviour, which wrote **~9 throwaway creator
accounts** and **3 "Probe Community" records** to `interlekt-backend.onrender.com`. There is no
`DELETE /communities` endpoint, so these cannot be removed by API. They need an admin DB action, or they
can be hidden by making the probe communities unpublished. No other data was modified; no payment,
enrollment, or user data was touched.

---

## 8. Build order summary

| Wave | Contents | Screens | Gate |
|---|---|---|---|
| 0 | Design system → Tailwind + React primitives | — | tokens, 4 shells, 5 missing CSS classes authored |
| 1 | Public shell, live data | 13 | public routes render real communities |
| 2 | Public static + legal | 11 | content written, legal copy corrected |
| 3 | Learner core | 7 | enrolled learner can learn + post + review |
| 4 | Learner settings | 10 | settings shell decided, 3 writable fields live |
| 5 | Creator studio | 10 | creator can build a community → course → lesson → publish |
| 6 | Admin | 1 live + 8 blocked | D3 decision button live; rest need backend |
| — | 39 blocked screens | 39 | after the backend dev lands the §3 contracts |
