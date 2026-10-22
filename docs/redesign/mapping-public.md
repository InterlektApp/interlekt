# Mapping — Public shell (24 screens)

> Source of truth: `backend-openapi.json` (47 paths) + live probes against
> `https://interlekt-backend.onrender.com/api/v1` on 2026-10-22.
> Frontend conventions verified in `apps/web/src/` (Next 15 App Router, TanStack Query,
> `API_BASE = "/api/v1"` via `next.config.ts` rewrites, `Authorization: Bearer <accessToken>`,
> tokens in `localStorage` — **no cookies**).

## Summary
- Screens mapped: 24
- LIVE: 7 · PARTIAL: 13 · MOCK: 1 · NEEDS-BACKEND: 3
- Backend endpoints used (existing): `GET /api/v1/communities`, `GET /api/v1/communities/{slug}`,
  `GET /api/v1/communities/{slug}/courses`, `GET /api/v1/categories`, `GET /api/v1/creators/{user_id}`,
  `GET /api/v1/users/{user_id}`, `GET /api/v1/auth/me`, `POST /api/v1/auth/login`,
  `POST /api/v1/auth/register`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/forgot-password`,
  `POST /api/v1/auth/reset-password`, `POST /api/v1/communities/{slug}/enroll`,
  `GET /api/v1/enrollments/mine`
- Backend endpoints that must be built (NEW): `GET /api/v1/stats` · `GET /api/v1/platform/public-config` ·
  `GET /api/v1/communities?creatorId&isFree&minRating&sort=rating|price_asc|price_desc` ·
  `GET /api/v1/categories` + `communityCount` · anon `GET /api/v1/courses/{id}/modules` ·
  anon `GET /api/v1/communities/{slug}/reviews` + `ratingBreakdown` ·
  anon `GET /api/v1/communities/{slug}/members` · anon `GET /api/v1/communities/{slug}/posts` ·
  `GET /api/v1/discussions` · `POST /api/v1/posts/{id}/vote` + `voteCount` ·
  `GET /api/v1/creators/{id}/experience` · `POST|DELETE /api/v1/creators/{id}/follow` ·
  `GET|POST /api/v1/messages` · `POST /api/v1/auth/verify-email` + `resend-verification` ·
  `POST /api/v1/auth/oauth/google` · `POST /api/v1/reports` · `GET /api/v1/help/articles` ·
  payments: `POST /api/v1/enrollments/{id}/checkout`, `GET /api/v1/transactions`, `POST|GET /api/v1/payouts`

### Live backend facts that decide this mapping (probed, not assumed)
| Probe | Result |
|---|---|
| `GET /communities?pageSize=50` | 200. **4 communities total.** 3 have 0 courses; `python-for-absolute-beginners` has 2 courses / 9 lessons, `memberCount=5`, `isFree=true`. All `rating:null`, `reviewCount:0`. Prices `"2500.00"`/`"5000.00"`/`"0.00"`, `priceCurrency:"NGN"`. |
| `GET /communities/{slug}` (anon) | 200. Returns `id,title,slug,description,imageUrl,priceAmount,priceCurrency,isFree,memberCount,rating,reviewCount,isPublished,categories[],creator,courses[],createdAt,updatedAt`. |
| `GET /communities/{slug}/courses` (anon) | 200. Returns `items[]` of `CourseResponse` (title, moduleCount, lessonCount, position, isPublished). |
| **`GET /courses/{id}` (anon)** | **401** |
| **`GET /courses/{id}/modules` (anon)** | **401** → the Curriculum accordion on A3 is *not* publicly readable today. |
| **`GET /communities/{slug}/reviews` (anon)** | **401** → A3 review list + A3/A4 rating breakdown are not public. |
| **`GET /communities/{slug}/members` (anon)** | **401** → A3 member avatar-stack is not public. |
| **`GET /communities/{slug}/posts` (anon)** | **401** → A3 Feed tab + A24 are not public. |
| `GET /creators/{user_id}` (anon) | OpenAPI 200 schema includes `userId,displayName,avatarUrl,bio,headline,coverUrl,socialLinks,expertise[],verificationStatus,isVerified,communityCount,memberCount,createdAt`. `memberCount` is required; headline, cover and social links are optional. Location and rating are absent. |
| `GET /users/{user_id}` (anon) | 200. `id,displayName,avatarUrl,bio,roles[],isCreator,createdAt`. |
| `GET /categories` (anon) | 200. **8 categories**, each with `id,name,slug,description`. **No counts.** |
| `GET /communities?category=&sort=&search=&page=&pageSize=` | 200. `sort` ∈ `newest｜most_members｜alphabetical`. **No `creatorId`, no `isFree`, no `minRating`, no price/rating sort.** |
| Frontend auth storage | `localStorage` + in-memory bearer token. **Zero cookies.** A19's cookie policy is factually wrong about this codebase. |

### Frontend reality (what exists vs what must be rewritten)
| Design screen | Route | Today | Action |
|---|---|---|---|
| A1 | `/` | `app/page.tsx` exists, **already calls `GET /communities`** (`useCommunities({pageSize:4})`), but uses a *different* visual system (sky/#b5e5f1, eyebrows, shadows) | **Rewrite markup to design system; keep the data hook** |
| A2 | `/communities` | `app/communities/page.tsx` exists, **already calls `GET /communities` + `GET /categories`** | Rewrite to sidebar layout; add missing filter params |
| A3 | `/communities/[slug]` | `app/communities/[slug]/page.tsx` exists, **already calls `GET /communities/{slug}`** | Rewrite; add curriculum/reviews/members tabs |
| A4 | `/creators/[slug]` | `app/creators/[slug]/page.tsx` exists, **already calls `GET /creators/{id}`**; communities by filtering the full list client-side | Rewrite; add `creatorId` filter |
| A5 | `/auth/login` | `app/auth/login/page.tsx` exists, **already calls `POST /auth/login`** via `useLogin()` | Restyle only — **already LIVE** |
| A6 | `/auth/register` | `app/auth/register/page.tsx` exists, **already calls `POST /auth/register`** | Restyle only — **already LIVE** |
| A7 | `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` exists, **already calls `POST /auth/forgot-password`** | Restyle only — **already LIVE** |
| A8 | `/search` | `app/search/page.tsx` exists, **already calls `GET /communities?search=`** | Rewrite; add creator/lesson tabs |
| A9 | `/logout` | **No route.** `useLogout()` exists in `hooks/use-auth.ts` but nothing renders it | **NEW route** wrapping `useLogout()` |
| A10 | `/auth/verify-email` | **No route, no backend** | **NEW route + NEW backend** |
| A11 | `/auth/reset-password` | **No route.** Backend `POST /auth/reset-password` exists | **NEW route** |
| A12 | `/*` | **No `not-found.tsx`** | **NEW `app/not-found.tsx`** |
| A13 | error | **No `error.tsx` / `global-error.tsx`** | **NEW `app/error.tsx` + `app/global-error.tsx`** |
| A14–A21 | `/about /pricing /help /terms /privacy /cookies /refunds /trust` | **None exist** | **NEW routes** (8) |
| A22 | `/auth/learner-login` | **No route** | **NEW route** (thin wrapper over A5) |
| A23 | `/creators/auth/login` | **No route** | **NEW route** (thin wrapper over A5) |
| A24 | `/discussions` | **No route** | **NEW route + NEW backend** |

**Contract recheck — 2026-10-22** (`apps/web/src/types/api.ts`):
- The public directory contract still uses `category`, `sort`, `page`, `pageSize`, and `search`, with a flat paginated `CommunityListItem` response. The frontend query names, sort values, and response envelope match.
- The deployed OpenAPI advertises 200/422 for `GET /api/v1/communities`; a live request currently returns 500 `internal_error`, so directory data cannot load until the backend is repaired.
- `CreatorProfileResponse` now requires `memberCount`; `headline`, `coverUrl`, and `socialLinks` are optional. The frontend type and public creator stats now use this contract.

---

## Table

| Screen ID | Design file | Next.js route | Status | Backend endpoint(s) | Data fields the screen needs | Notes / gaps |
|---|---|---|---|---|---|---|
| A1 | `public/A1-landing.html` | `/` EXISTING | **PARTIAL** | `GET /communities`, `GET /categories` | cards: `items[].title/imageUrl/creator.displayName/creator.avatarUrl/creator.isVerified/memberCount/rating/reviewCount/priceAmount/isFree`; categories `[]`; `total` | 4 platform stats + 10 category counts + 3 creator-econ numbers + testimonial have no source. `/mo` suffix unsupported. |
| A2 | `public/A2-explore.html` | `/communities` EXISTING | **PARTIAL** | `GET /communities`, `GET /categories` | `items[]` card fields, `total`, `totalPages`, `categories[].name/slug` | Category counts, price filter, rating filter, "Top rated"/price sorts, "Popular" ordering all missing server-side. |
| A3 | `public/A3-community-detail.html` | `/communities/[slug]` EXISTING | **PARTIAL** | `GET /communities/{slug}` (200), `GET /communities/{slug}/courses` (200), `GET /creators/{id}` (200) | `title/slug/description/imageUrl/memberCount/rating/reviewCount/priceAmount/priceCurrency/isFree/isPublished/categories[].name/creator.*/courses[].moduleCount/lessons` | Curriculum module+lesson outline is **401 anon**; reviews **401 anon** + no breakdown; members **401 anon**; feed **401 anon**; creator job-title/total-members missing; billing toggle unsupported; no lesson-preview endpoint. |
| A4 | `public/A4-creator-profile.html` | `/creators/[slug]` EXISTING | **PARTIAL** | `GET /creators/{user_id}` (200), `GET /communities` | `displayName/avatarUrl/bio/expertise[]/verificationStatus/isVerified/communityCount/createdAt`; `items[].creator.userId` | Missing: headline/job title, location, total members, creator rating+review count, lifetime earnings, experience timeline, follow, message, `creatorId` filter. |
| A5 | `public/A5-login.html` | `/auth/login` EXISTING | **PARTIAL** | `POST /auth/login` | req `email`,`password` → `accessToken`,`refreshToken`,`expiresIn`,`user.roles[]` | Everything live **except** "Continue with Google" (no OAuth endpoint → must ship disabled, as today). |
| A6 | `public/A6-register.html` | `/auth/register` EXISTING | **PARTIAL** | `POST /auth/register` | req `email`,`password`,`displayName`,`role` → `user.roles[]` | Live except Google OAuth, terms-consent capture (no field), and email-verification interstitial (no verify model). |
| A7 | `public/A7-forgot-password.html` | `/auth/forgot-password` EXISTING | **PARTIAL** | `POST /auth/forgot-password` → 202 | req `email`; resp `message` | Reset-link TTL ("expires in 60 minutes") and resend cooldown are **not** returned. |
| A8 | `public/A8-search-results.html` | `/search` EXISTING | **PARTIAL** | `GET /communities?search=` | `items[]`, `total`, `totalPages` | Live for the Communities tab only. Creators tab + Lessons tab have **no endpoint**; per-category result counts missing; "Relevance" sort + timing string client-side only. |
| A9 | `public/A9-logout.html` | `/logout` **NEW** | **LIVE** | `POST /auth/logout` `{refreshToken}` → 204 | refresh token (from `localStorage`) | `useLogout()` already exists. New route + button only. |
| A10 | `public/A10-email-verify.html` | `/auth/verify-email` **NEW** | **NEEDS-BACKEND** | none | email to verify, resend cooldown, verify token, `isEmailVerified` | **No verification model exists.** `AccountResponse` has no `isEmailVerified`; register returns usable tokens immediately. Effort **M**. |
| A11 | `public/A11-password-reset.html` | `/auth/reset-password` **NEW** | **PARTIAL** | `POST /auth/reset-password` `{token,newPassword}` → `message` | URL `token`, new+confirm password, strength score | Token plumbing and confirm-match are client-side; strength is client-computed; backend returns no expiry. Effort **S**. |
| A12 | `public/A12-404.html` | `/*` → `app/not-found.tsx` **NEW** | **LIVE** | none (optional `GET /communities?search=` for suggestions) | bad-path slug → suggested communities | Static page + optional client-side suggestion fetch. |
| A13 | `public/A13-500.html` | `app/error.tsx` + `global-error.tsx` **NEW** | **LIVE** | none | incident ID (server-generated) | Static page. `error.tsx` gets `reset()`; `global-error.tsx` renders `<html>`. |
| A14 | `public/A14-about.html` | `/about` **NEW** | **PARTIAL** | `GET /communities` (total) | 4 stat numbers, 4 team members, 3 investors, 2 prose blocks | Only "Live communities" is derivable (`GET /communities.total`). Learners / ₦ paid / mentors need `GET /stats`. Team + investors + story = static content. |
| A15 | `public/A15-pricing.html` | `/pricing` **NEW** | **NEEDS-BACKEND** | none | 88% share, 10% fee, ₦500k payout-free, ₦4,500/mo floor, 30/14-day refund windows, weekly-Friday payout | The platform has **no pricing, checkout, payout or refund model**. Page can ship as prose but every number is unbacked. Effort **M** (config) → **L** (payments). |
| A16 | `public/A16-help-center.html` | `/help` **NEW** | **MOCK** | none | 6 popular articles, 6 topic links, 3 escalation channels, search index | No help/CMS endpoint. Ship with in-repo MDX + client-side search. Honest empty state: "No articles matched — email support@interlekt.com". |
| A17 | `public/A17-terms.html` | `/terms` **NEW** | **LIVE** | none | 12 prose sections, effective date, `legal@interlekt.com` | Pure static legal. Content source `content/legal/terms.mdx`. |
| A18 | `public/A18-privacy.html` | `/privacy` **NEW** | **LIVE** | none | 11 prose sections, effective date, `privacy@interlekt.com` | Pure static legal. Content source `content/legal/privacy.mdx`. |
| A19 | `public/A19-cookies.html` | `/cookies` **NEW** | **LIVE** | none | cookie table (4 rows), 6 prose sections | Pure static legal — **but factually wrong today**: the app uses `localStorage` bearer tokens, not cookies. Rewrite §2/§4 or move to httpOnly cookies. |
| A20 | `public/A20-refund-policy.html` | `/refunds` **NEW** | **LIVE** | none | 8 prose sections, 30/14-day windows, `support@interlekt.com` | Pure static legal. §1/§3/§4 reference "Account Settings → Subscriptions" + self-serve refunds — **neither exists**. |
| A21 | `public/A21-trust-safety.html` | `/trust` **NEW** | **PARTIAL** | none | 4 commitments, 4 verification checks, SLA table (4 rows), 4 prohibited behaviours, `safety@interlekt.com` | Prose = static. The "Report a community or user" flow needs `POST /reports` (NEW, effort **M**). Teal check = `creator.isVerified` (LIVE). |
| A22 | `public/A22-learner-login.html` | `/auth/learner-login` **NEW** | **PARTIAL** | `POST /auth/login` | same as A5 + role assertion | Same `POST /auth/login`; role must be asserted client-side from `user.roles[]` (no role-scoped login endpoint). Google OAuth missing. |
| A23 | `public/A23-creator-login.html` | `/creators/auth/login` **NEW** | **PARTIAL** | `POST /auth/login` | same as A5 + role assertion | Same as A22. The design's `POST /api/creators/auth/login` **does not exist** — do not invent it; reuse `POST /auth/login` and branch on `user.roles`. |
| A24 | `public/A24-discussions.html` | `/discussions` **NEW** | **NEEDS-BACKEND** | `GET /communities/{slug}/posts` (**401 anon**) | 6 thread cards (title, community, author, **vote count**, tags, time), 5 contributors (avatar, name, role, **posts this week**), 7 filter chips | No cross-community public thread index; no votes at all; no contributor aggregation; no tags on posts. Effort **M** (index + votes). |

---

## Per-screen detail

### A1 — Landing page (`public/A1-landing.html` → `/`)
- **Verdict:** PARTIAL — the community grid is LIVE, the trust strip is not.
- **Sections & the data each needs:**
  1. **Hero** — headline/lead/CTAs are static copy. Search input → `GET /communities?search=` **LIVE** (existing `app/page.tsx` has no search box — add one, submit to `/search?q=`).
  2. **"Popular:" chip row** — AI engineering / Product design / FinTech / Content creation / Cybersecurity. These are **design-invented labels that do not exist in the backend**. Backend has 8 categories: Technology & Programming, Business & Entrepreneurship, Design & Creative, Finance & Investing, Health & Wellness, Language & Communication, Agriculture & Sustainability, Education & Teaching. → Render `GET /categories` items instead; map the 5 chips to real slugs or drop them.
  3. **Trust strip (4 numbers)** — `48,200 Active learners` / `1,140 Live communities` / `₦214M Paid to creators` / `312 Verified mentors`:
     - Live communities → `GET /communities` → `total` **LIVE** (real value today: **4**).
     - Active learners, ₦ paid to creators, Verified mentors → **no endpoint**. `NEW GET /api/v1/stats` → `{ activeLearners, liveCommunities, paidToCreators, verifiedMentors }`. Effort **S**.
     - Honest interim: show `total` for communities and hide/replace the other three — do **not** ship 48,200 (live data says 4).
  4. **"Featured this week" — 6 community cards** → `GET /communities?pageSize=6` **LIVE**: `items[].title`, `imageUrl`, `creator.displayName`, `creator.avatarUrl`, `creator.isVerified` (teal check), `memberCount`, `rating` + `reviewCount`, `priceAmount` + `priceCurrency`, `isFree`.
     - **Gap:** the `/mo` suffix assumes a monthly billing interval. `priceAmount` is a single decimal with **no interval field**. Add `billingPeriod: "free"|"monthly"|"lifetime"` + `lifetimePriceAmount` to `Community` (effort **S**, touches pricing model) — or drop the suffix.
     - **Gap:** "featured" ordering is not supported. `sort` ∈ `newest｜most_members｜alphabetical` → use `most_members` and relabel the section.
  5. **Category chip row (10 chips with counts 184/96/142/…)** → `GET /categories` gives names/slugs only; **no counts**, and the design's 10 labels ≠ backend's 8. → `NEW`: add `communityCount` to `CategoryResponse` (effort **S**) or `GET /categories/with-counts`.
  6. **Creator pitch dark band** — `88% Creator revenue share` / `₦0 Payout fees, first ₦500k` / `Weekly Paystack payouts` → **no payments, payouts or platform-config model at all**. `NEW GET /api/v1/platform/public-config` → `{ creatorRevenueSharePct, platformFeePct, payoutSchedule, payoutFeeFreeThreshold, minCommunityPrice, refundWindowDays:{monthly,lifetime} }` (effort **S**), but the underlying payout engine is **L**. Until then this band must not promise weekly payouts.
  7. **Creator testimonial** — quote + name + "Senior Engineer, Paystack" + "1,240 members" → pure marketing content, **MOCK**. Real `memberCount` for the quoted creator comes from `GET /creators/{id}` → `communityCount` only.
  8. **"How it works" 3 steps** — static copy. Step 2 says "paid in ₦ via Paystack" → untrue today (only free enroll exists).
  9. **Final CTA** — "Join 48,200 Nigerian learners" → same `GET /stats` gap.
- **Reusable components:** `CommunityCard` (exists, rewrite to design-system), `MoneyAmount` (exists — handles the decimal string), `VerificationBadge` (exists; **recolour to teal `#0F766E`**, currently `text-blue-500`), new `StatStrip` (number-first, no icon tiles).
- **Empty/loading/error states needed:** loading = 3 skeleton cards in `.stagger`; error = "Communities could not be loaded from the backend" + Retry (already in `app/page.tsx` — keep); empty = "No published communities yet"; stats = hide the whole strip until `GET /stats` exists (never show zeros).
- **Backend work required:** `NEW GET /api/v1/stats` (S); `NEW GET /api/v1/platform/public-config` (S); `communityCount` on categories (S); `billingPeriod` on community (S).

### A2 — Explore communities (`public/A2-explore.html` → `/communities`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Page header** — "1,140 live communities" → `GET /communities` → `total` **LIVE** (real: 4). H1/lead static.
  2. **Search bar** → `GET /communities?search=` **LIVE**.
  3. **Sidebar → Category list with counts** — `All categories 1,140` + 10 categories with counts → `GET /categories` gives `name`/`slug` **LIVE**; **counts are not returned**. `NEW`: `communityCount` per category (S). Real categories are the backend's 8, not the design's 10.
  4. **Sidebar → Price radio (Free / Paid / Both)** → `isFree` is on every `CommunityListItem` **LIVE**, but there is **no `isFree` query param** → filter client-side on the current page only (silently wrong on page ≥ 2). `NEW`: `GET /communities?isFree=true|false` (S).
  5. **Sidebar → Rating radio (4.5+ / 4.0+ / Any)** → `rating` is on every item **LIVE**, but there is **no `minRating` param** → same client-side limitation. `NEW`: `GET /communities?minRating=4.5` (S).
  6. **Sidebar → Sort select** — design offers Popular / Newest / Top rated / Price: low→high / Price: high→low. Backend `sort` enum = `newest｜most_members｜alphabetical`:
     - Popular → `most_members` (nearest match) **LIVE**
     - Newest → `newest` **LIVE**
     - Top rated → **not supported** (NEW `sort=rating`, S)
     - Price low→high / high→low → **not supported** (NEW `sort=price_asc|price_desc`, S)
  7. **"Showing 24 of 1,140 communities"** → `items.length` + `total` **LIVE**.
  8. **9 community cards** → `GET /communities` `items[]` **LIVE** — identical field set to A1 §4. Same `/mo` suffix gap.
  9. **Pagination (1 … 12)** → `totalPages` **LIVE**; `PageNav` component exists.
  10. **Empty state (HTML-commented in the design)** — "No communities match your filters" + Reset all filters. Must be wired: show when `items.length === 0`. Note the design copy hardcodes "1,140 communities on Interlekt" → replace with `total`.
- **Reusable components:** `CommunityCard`, `PageNav`, `MoneyAmount`, `VerificationBadge`; new `FilterSidebar` (hairline links + native radios + select, per design).
- **Empty/loading/error states needed:** loading = 6 skeleton cards; error = retry banner (exists); empty = design's empty block; **out-of-range page** = "There are no communities on page N" (exists in current code — keep).
- **Backend work required:** `isFree`, `minRating`, `sort=rating|price_asc|price_desc` query params on `GET /communities` (S); `communityCount` on `CategoryResponse` (S).

### A3 — Community detail (`public/A3-community-detail.html` → `/communities/[slug]`)
- **Verdict:** PARTIAL — the header/creator/pricing/enroll block is LIVE; curriculum, reviews, members and feed are all behind auth today.
- **Sections & the data each needs:**
  1. **Breadcrumb** — Explore / *category* / title → `categories[0].name` + `title` **LIVE**.
  2. **Cover image** → `imageUrl` **LIVE**. (Seed: 2 of 4 have a real Cloudinary URL, 2 are `null` → render the initial-letter fallback.)
  3. **Category tag + `badge-success "Active"`** → `categories[].name` **LIVE**; `isPublished` **LIVE** (map `true → "Active"`).
  4. **H1 title** → `title` **LIVE**.
  5. **Creator row** — avatar `creator.avatarUrl` **LIVE**; name `creator.displayName` **LIVE**; teal check `creator.isVerified` **LIVE**; **"Senior Engineer, Paystack" → NO FIELD** (no `headline`/`title`/`occupation` on `CreatorSummary` or `CreatorProfileResponse`). → `NEW` field `headline` (S).
  6. **Tabs** — Overview | Curriculum | Reviews `212` | Members `1,240` | Feed:
     - Reviews count → `reviewCount` **LIVE** (real value: 0 today)
     - Members count → `memberCount` **LIVE** (real: 0–5)
     - Curriculum → see §7
     - Feed → see §11
  7. **Curriculum accordion (4 modules / 18 lessons / 6 hours)**:
     - Course list + `moduleCount` + `lessonCount` → `GET /communities/{slug}` → `courses[]` (`CourseSummary`) **LIVE**, and `GET /communities/{slug}/courses` **LIVE**.
     - Module titles, lesson titles, per-lesson minutes, per-module duration → `GET /courses/{course_id}/modules` → `ModuleWithLessons.lessons[]` (`LessonOutline`: `title`, `summary`, `contentType`, `durationSeconds`, `position`, `isPublished`) — **but this endpoint is 401 for anonymous**. `NEW`: allow anonymous read of the *outline* (`LessonOutline` carries no `content`, so it is safe to expose) (S).
     - "6 hours" total → client-side `sum(durationSeconds)/3600` **LIVE once modules are readable**.
     - Lesson "done ✓" checkmarks → `GET /courses/{course_id}/progress` (auth-only). For anonymous visitors every lesson must render **locked**, never "done".
  8. **Reviews block** — "212 reviews · 96% would recommend", big `4.9`, 5-bar distribution `89/8/2/1/0`, 3 sample review cards (author name, avatar, teal check, "3 weeks ago", 5 stars, body), "See all 212 reviews":
     - Aggregate `rating` + `reviewCount` → `GET /communities/{slug}` **LIVE**.
     - **Rating distribution** → **NO FIELD**. `NEW`: `ratingBreakdown: { "5": n, "4": n, "3": n, "2": n, "1": n }` on `CommunityDetail`, or `GET /communities/{slug}/reviews/summary` (S).
     - **Review list** → `GET /communities/{slug}/reviews` is **401 anon**. `NEW`: allow anonymous GET (reviews are `AuthorSummary` + `rating` + `content` + `createdAt`) (S). Relative timestamps ("3 weeks ago") = client-side `Intl.RelativeTimeFormat` on `createdAt` **LIVE**.
     - "96% would recommend" → **NO FIELD anywhere**. `NEW`: `wouldRecommendPct` on `CommunityDetail` (S) — or drop the claim.
  9. **Enroll card**:
     - Billing toggle **Monthly / One-time** → **no billing-interval model**. `NEW`: `billingPeriod` + `lifetimePriceAmount` on `Community` (S) — until then the toggle must be removed or static.
     - Price `₦8,500 /month` → `priceAmount` + `priceCurrency` **LIVE**; the "/month" label is the interval gap above.
     - "Enroll now" → `POST /communities/{slug}/enroll` **LIVE for free only**; paid returns 402 `payment_required` (already handled in `hooks/use-enrollments.ts` → `enrollErrorMessage`). No checkout → **NEEDS-BACKEND (L)** for paid.
     - "Try 1 free lesson" → **no preview endpoint**. `NEW`: `GET /lessons/{lesson_id}/preview` or `previewLessonId` on `CourseSummary` (S).
     - "30-day money-back guarantee" → policy prose; source it from `platform/public-config` (S) once that exists.
     - "Pays with Paystack" → static copy; untrue until payments exist.
     - "1,240 enrolled" → `memberCount` **LIVE**.
     - "Updated 2 days ago" → `updatedAt` **LIVE** (relative-time client-side).
  10. **Creator card** — avatar/name/check **LIVE**; job title **gap**; **"3 communities · 4,892 members"** → `communityCount` **LIVE**; **total members across communities → NO FIELD** (and `types/api.ts` wrongly claims `memberCount` on `CreatorProfileResponse` — live response has no such key). `NEW`: `memberCount` on `CreatorProfileResponse` (S).
  11. **"What's included" (6 items)** — static marketing list; item 1 ("18 video lessons across 4 modules") is derivable from `courses[]` `lessonCount`/`moduleCount` **LIVE**; items 2–6 static, but "Certificate of completion" and "Weekly office hours" have **no backend model** → treat as marketing copy only.
  12. **Members preview (8-avatar stack + "+1,232 more")** → `GET /communities/{slug}/members` is **401 anon**. `NEW`: anonymous read of the first N members, or add `GET /communities/{slug}/members/preview?limit=8` (S). "+N more" = `memberCount − stack.length` **LIVE**.
  13. **Feed tab** → `GET /communities/{slug}/posts` is **401 anon**. `NEW`: allow anonymous GET for published communities (S).
- **Reusable components:** `EnrollCard` (exists — rewrite markup), `MoneyAmount`, `VerificationBadge`, new `Tabs` (underline + `.tab-count`), new `ModuleAccordion` (design `.module-accordion` / `.lesson-row` / `.lesson-status`), new `RatingBars` (`.progress` + `.progress-bar-ink`), new `StickyAside`.
- **Empty/loading/error states needed:** loading skeleton for the whole grid; 404 → `notFound()` (already wired via `ApiError.status === 404` — keep); non-404 error → retry card (exists); empty curriculum → "Curriculum is being prepared" (exists — keep); empty reviews → "No reviews yet — be the first"; empty members → no stack, just `memberCount`.
- **Backend work required:** anon `GET /courses/{id}/modules` (S); anon `GET /communities/{slug}/reviews` (S); `ratingBreakdown` + `wouldRecommendPct` on `CommunityDetail` (S); anon `GET /communities/{slug}/members` preview (S); anon `GET /communities/{slug}/posts` (S); `headline` + `memberCount` on `CreatorProfileResponse`/`CreatorSummary` (S); `billingPeriod` + `lifetimePriceAmount` on `Community` (S); lesson preview (S); checkout (L).

### A4 — Creator profile (`public/A4-creator-profile.html` → `/creators/[slug]`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Dark cover banner** — static; `ILK.injectAmbientIcons({layout:'minimal'})` decorative only.
  2. **Avatar (xl, overlapping)** → `avatarUrl` **LIVE** (seed: `avatarUrl` is `null` on both probed creators → initial-letter fallback).
  3. **Name + teal check** → `displayName` + `isVerified` **LIVE**.
  4. **"Senior Engineer, Paystack"** → **NO FIELD**. `NEW` `headline` on `CreatorProfileResponse` (S).
  5. **"Lagos, Nigeria"** → **NO FIELD** (no location on any creator schema). `NEW` `location` (S) — note `ProfileUpdateRequest` has no location either, so it needs a creator-side write path.
  6. **Follow button** → **no follow model**. `NEW POST|DELETE /creators/{user_id}/follow`, `GET /creators/{user_id}/followers`, `followerCount` on the profile (M).
  7. **Message button** → **no messaging at all**. `NEW GET|POST /api/v1/messages` (+ threads, read receipts) (L).
  8. **Stat cards (4)**:
     - `Communities 3` → `communityCount` **LIVE**
     - `Total members 4,892` → **NO FIELD** → `NEW memberCount` (S)
     - `Avg rating 4.9 / 389 reviews` → **NO FIELD** → `NEW avgRating` + `reviewCount` aggregate on the creator profile (S, depends on the public reviews endpoint)
     - `Lifetime earnings ₦1.4M` → **NO FIELD, and no payments subsystem** → depends on the payments build (L)
  9. **About (3 paragraphs)** → `bio` is a single nullable string **LIVE**. Render as paragraphs split on `\n\n`; the design's 3-paragraph shape is not enforced by the schema.
  10. **Expertise chips (6)** → `expertise[]` **LIVE** (real: `["software engineering"]`).
  11. **Experience timeline (3 entries: period, title, description)** → **NO MODEL**. `NEW GET|POST /creators/{user_id}/experience` → `{ id, role, organisation, startDate, endDate, description, position }` (M).
  12. **"Communities by Tunde" (3 cards)** → `GET /communities` then filter on `items[].creator.userId` client-side. **Problem:** the backend has **no `creatorId` query param**, so the current frontend fetches `pageSize=100` and filters — silently incomplete at scale. `NEW GET /communities?creatorId={user_id}` (S).
- **Reusable components:** `CommunityCard`, `VerificationBadge`; new `StatCard` (number-first, no tile), new `VerticalTimeline` (hairline, no dots), new `ChipRow`.
- **Empty/loading/error states needed:** loading skeleton; 404 → `notFound()` (already wired); error → retry (exists); zero communities → "No published communities yet" (exists — keep); no bio → hide the About block; no expertise → hide the chips row.
- **Backend work required:** `headline`, `location`, `memberCount`, `avgRating`, `reviewCount` on `CreatorProfileResponse` (S); `GET /communities?creatorId=` (S); `creator_experience` resource (M); follow resource (M); messaging (L); creator earnings (L).

### A5 — Login (`public/A5-login.html` → `/auth/login`)
- **Verdict:** PARTIAL — every credential field is LIVE; the Google button is not.
- **Sections & the data each needs:**
  1. **Brand block** — static (`components/logo.tsx` exists).
  2. **Email field** → `LoginRequest.email` **LIVE**.
  3. **Password field + show/hide eye toggle** → `LoginRequest.password` **LIVE**; eye toggle is client-side (not in the current code — add it).
  4. **Remember me checkbox** → no backend field. Client-side: choose the `localStorage` vs session-only persistence for the refresh token in `lib/api/session.ts`. **LIVE (client)**.
  5. **Forgot password link** → `/auth/forgot-password` (exists) **LIVE**.
  6. **Sign in button** → `POST /auth/login` → `TokenResponse{accessToken,refreshToken,tokenType,expiresIn,user{roles[]}}` **LIVE**. Existing `useLogin()` + `loginRequest()` already store tokens and redirect by `user.roles.includes("creator")`.
  7. **"or" divider** — static.
  8. **Continue with Google** → **no OAuth endpoint**. `NEW POST /auth/oauth/google` + `GET /auth/oauth/google/redirect` (M). Until then the button must be **disabled with a one-line explanation** — the current code already does this honestly (`continueWithGoogle` sets a server error). Keep that behaviour; do not fake a flow.
  9. **"Create an account" CTA** → `/auth/register` **LIVE**.
- **Reusable components:** `AuthShell` (exists), `GoogleMark` (exists), `Button`.
- **Empty/loading/error states needed:** submitting → spinner + disabled button (exists); 422 → field-level message via `apiErrorToFormErrors` (exists); 401 → "Those details don't match an account"; network → `ApiError.code === "NETWORK_ERROR"` message (exists).
- **Backend work required:** Google OAuth (M).

### A6 — Register (`public/A6-register.html` → `/auth/register`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Step 1 — Role chooser (learner / creator)** → `RegisterRequest.role` (`"learner"|"creator"`, default `"learner"`) **LIVE**. The current page splits first/last name into two inputs; the design has **one "Full name"** → map to `displayName` directly.
  2. **Step 2 — Full name** → `RegisterRequest.displayName` **LIVE**.
  3. **Email** → `RegisterRequest.email` **LIVE**.
  4. **Password + 4-pill strength meter** → `RegisterRequest.password` **LIVE**; the strength score (Weak/Fair/Strong/Very strong) is **client-side** — the backend only enforces length. Zero backend work.
  5. **Terms checkbox (required)** → **no consent field** on `RegisterRequest` and no consent model. If you need to prove consent, `NEW` `acceptedTermsAt` + `termsVersion` on the user (S) — otherwise keep the checkbox client-side and store the version in the consent record you build (see A17's `termsVersion`).
  6. **Create account** → `POST /auth/register` → `TokenResponse` **LIVE**. Note: the backend returns usable tokens immediately, so the design's "then go to A10 email-verify" step has no backend hook (see A10).
  7. **Continue with Google** → no OAuth endpoint (M) — same honest-disabled treatment as A5.
  8. **"Already have an account? Sign in"** → route **LIVE**.
  9. **"Join 48,200 learners and creators"** sub-copy → `GET /stats` (S) or make it non-numeric.
- **Reusable components:** `AuthShell`, `GoogleMark`, `PasswordStrength` (new, 4 monochrome pills).
- **Empty/loading/error states needed:** submitting spinner (exists); `email_taken` → field error on email (already handled — keep); 422 → per-field errors via `apiErrorToFormErrors` (exists); password-strength label updates live.
- **Backend work required:** Google OAuth (M); optional `acceptedTermsAt`/`termsVersion` (S).

### A7 — Forgot password (`public/A7-forgot-password.html` → `/auth/forgot-password`)
- **Verdict:** PARTIAL — the request/response loop is fully LIVE.
- **Sections & the data each needs:**
  1. **Email field** → `ForgotPasswordRequest.email` **LIVE**.
  2. **"Send reset link"** → `POST /auth/forgot-password` → **202** `MessageResponse{message}` **LIVE**. The backend returns 202 whether or not the email exists — the page must **never** reveal account existence. Existing code already treats a network failure as success (good; keep).
  3. **Success state** — "We've sent a reset link to **ada@interlekt.com**. It expires in 60 minutes." → the email is the submitted value (**LIVE, client**); **"expires in 60 minutes" is NOT returned by the backend**. `NEW`: include `expiresInMinutes` in the 202 body (or a `GET /auth/password-reset-policy`) (S). Without it, the copy is a guess.
  4. **"Open email app"** → `mailto:` link, client-side **LIVE**.
  5. **Resend link (rate-limited 60s)** → **no rate-limit info in the contract**. Client-side cooldown + rely on backend 429. `NEW`: return `Retry-After` on 429 (S).
  6. **"Try a different email"** → back to the form **LIVE**.
  7. **Back to sign in** → route **LIVE**.
- **Reusable components:** `AuthShell`; new `AlertSuccess` (design `.alert.alert-success`).
- **Empty/loading/error states needed:** sending → spinner; success → the design's alert-success block (currently HTML-commented in the mock — it must be a real second state, not a comment); error → retry.
- **Backend work required:** `expiresInMinutes` on the 202 response + `Retry-After` header on 429 (S).

### A8 — Search results (`public/A8-search-results.html` → `/search`)
- **Verdict:** PARTIAL — the Communities tab is LIVE, the Creators and Lessons tabs have no endpoint.
- **Sections & the data each needs:**
  1. **Search bar (pre-filled "AI engineering") + clear button** → `?q=` **LIVE**.
  2. **"24 results for 'AI engineering' in 0.04s"** → the total is `GET /communities?search=` → `total` **LIVE**; the **timing string** is client-measured (not a backend field). The design's "24" counts communities + creators + lessons; the backend only counts communities → the number will differ. Either sum the tabs or relabel to "N communities".
  3. **Sidebar filters** — identical to A2: category counts (missing), price (missing), rating (missing), sort (`Relevance` not supported; `Most members`→`most_members`, `Top rated`→NEW, `Newest`→`newest`).
  4. **Per-category result counts (24/18/1/2/1/0/2/0/0/0)** → **NO ENDPOINT**. The backend can count one category at a time (N× `GET /communities?category=&search=`) but that is N round-trips and only works if the search filter is applied server-side per category. `NEW`: a search-facets endpoint `GET /communities/search/facets?search=` → `{ categories: [{slug,count}], priceBuckets, ratingBuckets }` (M).
  5. **Result tabs — Communities (18)** → `GET /communities?search=` **LIVE**; each card uses the same field set as A1/A2.
  6. **Result tabs — Creators (4)** → **NO ENDPOINT**. `GET /creators/{user_id}` is by-id only; there is no creator search and no creator list. `NEW GET /creators?search=&page=&pageSize=` → `Paginated<CreatorProfileResponse>` (M). Each creator row needs: avatar, name, check, headline, "N communities", "N members" — the last two need the A4 gaps.
  7. **Result tabs — Lessons (2)** → **NO ENDPOINT**. There is no lesson search/list endpoint at all (`GET /modules/{id}/lessons` is by module, and `GET /courses/{id}` is 401 anon). `NEW GET /lessons?search=&communityId=&page=` → `Paginated<LessonSearchItem>` with `{ id, title, summary, courseTitle, communitySlug, contentType, durationSeconds }` (M).
  8. **Pagination** → `totalPages` **LIVE** for communities; the other tabs need their own pagination.
- **Reusable components:** `CommunityCard`, `PageNav`, `MoneyAmount`; new `ResultTabs`, `CreatorRow` (flat hairline row, no tile).
- **Empty/loading/error states needed:** loading skeleton per tab; error banner + Retry (exists); empty → "Nothing matched 'q'" + Browse communities (exists — keep); a tab with 0 results → hide the tab or show "No creators matched".
- **Backend work required:** `GET /creators?search=` (M); `GET /lessons?search=` (M); search facets (M); the same A2 filter params (S).

### A9 — Logout confirmation (`public/A9-logout.html` → `/logout`)
- **Verdict:** **LIVE** — no new backend.
- **Sections & the data each needs:**
  1. **Brand block** — static.
  2. **"Sign out?" heading + lead** — static copy.
  3. **"Sign out" button (`.btn-danger`)** → `POST /auth/logout` `{refreshToken}` → **204** **LIVE**. `useLogout()` + `logoutRequest()` already exist in `hooks/use-auth.ts` / `lib/api/session.ts` (best-effort: revokes server-side, always clears local tokens, clears the query cache).
  4. **"Cancel"** → return to the previous screen (design links to the learner dashboard). Use `router.back()` with a `/dashboard` fallback.
  5. **"Your progress is saved automatically."** — static reassurance; true because `lessons/{id}/complete` + `courses/{id}/progress` persist server-side.
  6. **User display name (optional, per the header comment)** → `GET /auth/me` → `AccountResponse.displayName` **LIVE** (optional; only if you personalise the copy).
- **Reusable components:** `Logo`, `Button` (needs a `danger` variant — check `components/ui/button.tsx`).
- **Empty/loading/error states needed:** button disabled while the mutation is in flight; on failure the user must still be signed out locally (already guaranteed by `logoutRequest`'s `finally`).
- **Backend work required:** none.

### A10 — Email verification (`public/A10-email-verify.html` → `/auth/verify-email`)
- **Verdict:** **NEEDS-BACKEND** (effort **M**)
- **Sections & the data each needs:**
  1. **64px inline mail icon** — decorative.
  2. **"We sent a verification link to ada@interlekt.com"** → the pending email. **No backend state**: `AccountResponse` has **no `isEmailVerified` / `emailVerifiedAt`** field, `POST /auth/register` returns usable tokens immediately, and there is no verify-token table. `NEW`: `isEmailVerified: boolean` + `emailVerifiedAt: string|null` on `AccountResponse`/`ProfileResponse` (S).
  3. **"Resend email" (60s cooldown)** → **NEW `POST /auth/verify-email/resend`** → 202 `{ message, retryAfterSeconds }` (S).
  4. **Token verification (server-side)** → **NEW `POST /auth/verify-email`** body `{ token }` → 200 `{ verified: true }`, 400 on invalid/expired (M — needs a verification-token model with TTL + single-use).
  5. **"Use a different email"** → `/auth/register` (route) **LIVE**.
  6. **Success state ("Email verified. Welcome to Interlekt." + Continue to dashboard)** → depends on §4.
- **Reusable components:** `AuthShell`, new `AlertSuccess`, `Brand` (lightning-E variant from A22/A23).
- **Empty/loading/error states needed:** pending (default), success, invalid-token ("This link has expired — request a new one"), already-verified, resend-cooldown countdown.
- **Backend work required:** `email_verification_tokens` table (token, user_id, expires_at, used_at) + `isEmailVerified` on the user + `POST /auth/verify-email` + `POST /auth/verify-email/resend` (M). **Alternative (cheaper): drop A10 entirely** — registration already grants access, and the screen adds a step the product cannot honour.

### A11 — Password reset (`public/A11-password-reset.html` → `/auth/reset-password`)
- **Verdict:** PARTIAL — the backend endpoint exists; only the route and two client-side affordances are missing.
- **Sections & the data each needs:**
  1. **Token from URL** → `ResetPasswordRequest.token` **LIVE** (read `?token=` from the URL; the backend defines the token but the OpenAPI does not document its format).
  2. **New password field + eye toggle** → `ResetPasswordRequest.newPassword` **LIVE**.
  3. **4-pill strength meter (Weak/Fair/Strong/Very strong)** → **client-side scoring**, zero backend work. Design rule: monochrome ink, no green/amber.
  4. **Confirm password** → **client-side only** (must equal the new password before submit) — not a backend field.
  5. **"Reset password" submit** → `POST /auth/reset-password` → 200 `MessageResponse{message}` **LIVE**.
  6. **"Make it at least 8 characters with a mix of letters, numbers, and symbols."** → the backend's actual password policy is not in the OpenAPI (register validation is a 422). Confirm the real policy before shipping this copy; consider exposing `GET /auth/password-policy` (S).
  7. **Success state ("Password reset. Sign in with your new password." + Sign in button)** → depends on §5 **LIVE**.
- **Reusable components:** `AuthShell`, `PasswordStrength` (shared with A6), `AlertSuccess`.
- **Empty/loading/error states needed:** submitting spinner; invalid/expired token → "This reset link has expired — request a new one" + link to `/auth/forgot-password`; password mismatch → inline error on the confirm field.
- **Backend work required:** none (optionally `GET /auth/password-policy`, S).

### A12 — 404 (`public/A12-404.html` → `app/not-found.tsx`)
- **Verdict:** **LIVE** — static page, no API.
- **Sections & the data each needs:**
  1. **Brand block** — static.
  2. **"404" in `--ink-5` at 120px** — static.
  3. **"Page not found" + lead** — static.
  4. **Two CTAs: "Go home" (`/`) + "Browse communities" (`/communities`)** — routes **LIVE**.
  5. **Quiet search helper** → submits to `/search?q=` **LIVE**. Optional enrichment: `GET /communities?search=<slug>&pageSize=3` → suggest 3 communities whose title matches the bad path. The header comment calls for "Suggested communities based on the bad URL slug" — that is **client-side derivation** from `GET /communities`, no new endpoint.
  6. **Referrer URL → fallback "Go home" target** — no backend; use `usePathname()` / `document.referrer` if you want it, otherwise keep the static "Go home".
- **Reusable components:** `Logo`, `Button`, `InputGroup`.
- **Empty/loading/error states needed:** this *is* the error state. Note Next.js App Router: `not-found.tsx` must render its own `<html>/<body>` only at the root segment.
- **Backend work required:** none.

### A13 — 500 (`public/A13-500.html` → `app/error.tsx` + `app/global-error.tsx`)
- **Verdict:** **LIVE** — static page, no API.
- **Sections & the data each needs:**
  1. **Brand block** — static.
  2. **"500" in `--ink-5` at 120px** — static.
  3. **"Something went wrong" + lead** — static.
  4. **"Try again"** → `reset()` from the `error.tsx` props (Next 15 App Router) — **no reload needed**; the design's `window.location.reload()` is acceptable as a fallback in `global-error.tsx`.
  5. **"Go home"** → `/` **LIVE**.
  6. **`support@interlekt.com`** — static.
  7. **"All systems" → status page link** — external link. The design links to `status.interlekt.com`; there is **no status page** and no uptime endpoint. Link to a real URL or drop the link — do not point at a non-existent host.
  8. **"Incident ID 4f8a-2026-10-01"** → **no incident service**. `NEW`: generate a per-error correlation id in the Next.js error boundary (e.g. `crypto.randomUUID()`) and log it — **S, frontend-only**. If you want a real incident ID you need an error-reporting service (Sentry/Datadog) — **M**.
- **Reusable components:** `Logo`, `Button`.
- **Empty/loading/error states needed:** this *is* the error state. `error.tsx` must be a client component (`"use client"`).
- **Backend work required:** none (optional external error-reporting service, M).

### A14 — About (`public/A14-about.html` → `/about`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Hero (H1 + 3-sentence lead)** — static content.
  2. **Mission block (3 paragraphs)** — static content. Claims "88% of every enrollment, paid out weekly" → unsourced; see A15.
  3. **4-stat strip** — `48,200 Active learners` / `1,140 Live communities` / `₦214M Paid to creators` / `312 Verified mentors`:
     - Live communities → `GET /communities` → `total` **LIVE** (real: **4**)
     - The other three → **NEW `GET /api/v1/stats`** (S). Must ship as "—" / the strip hidden until then.
  4. **"How we started" (2 paragraphs)** — static content, contains hardcoded numbers (240 learners, ₦214,000 first week, 2024) → editorial copy, keep as prose.
  5. **Values 2×2 grid (4 cards)** — static content.
  6. **Team (4 cards: photo, name, role, bio)** — static content; needs real photos + `role` strings.
  7. **"Backed by" (investors)** — static content.
  8. **Final CTA** — "Join 48,200 learners, or join 312 creators earning in naira every Friday" → `GET /stats` gap + the earnings claim.
- **Reusable components:** `StatCard` (shared with A4), `SiteFooter` (rewrite to the design's 4-column dark footer from `ILK.injectFooter()`), `SectionBand`.
- **Empty/loading/error states needed:** loading = skeleton for the stat strip; error = hide the strip (never show zeros); static content = no empty states.
- **Backend work required:** `NEW GET /api/v1/stats` (S). Content source: in-repo `content/about.mdx` (MDX or a typed TS module) — no CMS endpoint needed.

### A15 — Pricing (`public/A15-pricing.html` → `/pricing`)
- **Verdict:** **NEEDS-BACKEND** (effort **M** for the config source → **L** for the payments that make it true)
- **Sections & the data each needs:**
  1. **Hero (H1 + lead)** — static.
  2. **"For learners" card** — "Free to join", "Paid communities start at **₦4,500**/mo" → **no price floor exists in the backend** (`CommunityCreateRequest.priceAmount` defaults to `"0.00"` and any amount is allowed; the lowest paid seed community is ₦2,500). `NEW` platform config: `minCommunityPrice` (S).
  3. **"For creators" card** — **88%** revenue share, "10% platform fee + Paystack processing", "Weekly payouts", "First **₦500k** payout-fee free" → **no payments, payouts, revenue-share or fee model exists**. `NEW GET /api/v1/platform/public-config` (S) is the minimum; the payout engine behind it is **L**.
  4. **FAQ (6 open Q&A rows)**:
     - "When do I get paid?" (weekly, Friday, bank account) → **no payout model**.
     - "What's the 10% platform fee for?" → same.
     - "Can I offer free communities?" → **LIVE**: `isFree` + `POST /communities/{slug}/enroll` supports free communities today.
     - "How do refunds work?" (30-day monthly / 14-day lifetime, 5–7 business days) → **no refunds, no payments**; also duplicated in A20.
     - "Do learners need to pay to browse?" → **LIVE**: browsing is free; `GET /communities` is anonymous.
     - "What payment methods are supported?" (Paystack only, no USD) → **no payment integration**.
  5. **"Visit the help center"** → `/help` (A16, NEW).
- **Reusable components:** `PricingCard` (design `.card` + `.card-tinted`), `FaqRow` (open prose, no accordion), `MoneyAmount`.
- **Empty/loading/error states needed:** the platform-config numbers must render as `—` until `GET /platform/public-config` exists; **do not hardcode 88% / ₦4,500 / ₦500k** — they will contradict the product.
- **Backend work required:** `NEW GET /api/v1/platform/public-config` → `{ creatorRevenueSharePct, platformFeePct, minCommunityPrice, currency, payoutSchedule, payoutFeeFreeThreshold, refundWindowDays:{monthly,lifetime}, refundProcessingDays }` (S); then the payments subsystem (L): `POST /enrollments/{id}/checkout`, `GET /transactions`, `POST /payouts`, `GET /payouts`.

### A16 — Help center (`public/A16-help-center.html` → `/help`)
- **Verdict:** **MOCK** — no backend source; ships entirely from in-repo content.
- **Sections & the data each needs:**
  1. **Hero + 56px search bar** → **no search endpoint**. Ship a client-side search over an in-repo MDX index. **Honest empty state:** "No articles matched — email support@interlekt.com".
  2. **"Popular articles" (6 cards: title, 1-line description, Read more)** → static content, `content/help/*.mdx`.
  3. **"Browse by topic" (6 cards)** → static: Getting started / Payments & payouts / Learning & classroom / Community feed / Creator Studio / Account & security. Each links to a topic landing page (`/help/[topic]`, NEW).
  4. **"Still need help?" (3 links)** — Contact support (`support@interlekt.com`, 24h) / Creator handbook ("a 32-page guide" — the handbook does not exist; link to a real file or drop) / Status page (no status page exists — drop or point at a real URL).
- **Reusable components:** `ArticleCard`, `TopicCard` (text-only + chevron), `SearchInput`.
- **Empty/loading/error states needed:** search-no-match (as above); articles not yet written → omit the card, do not show a broken link.
- **Backend work required:** none required. `NEW GET /api/v1/help/articles` (M) **only if** support-authored articles must be editable without a deploy — otherwise MDX is strictly better.

### A17 — Terms of Service (`public/A17-terms.html` → `/terms`)
- **Verdict:** **LIVE** — static legal page, **no API**.
- **Sections & the data each needs:**
  1. **H1 + "Last updated: October 1, 2026"** → static front-matter `effectiveDate`.
  2. **`.alert-info` quick summary** — static prose.
  3. **12 numbered sections** (§1 Acceptance → §12 Contact) — static prose.
  4. **§5 Payments / §6 Refunds** — describe a payments model that **does not exist** yet. Ship the prose as drafted policy (it is a policy, not a live readout), but flag it in the content file as "effective on payments launch" and add `termsVersion` to any consent you capture (A6).
  5. **`legal@interlekt.com` contact** — static.
- **Next.js route + content source:** `app/terms/page.tsx` (server component, no data fetching) rendering `content/legal/terms.mdx` with front-matter `{ title, effectiveDate, contactEmail }`. Add a `LegalProse` component (760px reading column, `.h1` + `.h3` per section, `alert-info` quick summary) shared with A18/A19/A20.
- **Empty/loading/error states needed:** none (static). Wrap in `SiteHeader`/`SiteFooter` (design: `nav-top` active `about` + full footer).
- **Backend work required:** none.

### A18 — Privacy Policy (`public/A18-privacy.html` → `/privacy`)
- **Verdict:** **LIVE** — static legal page, **no API**.
- **Sections & the data each needs:**
  1. **H1 + "Last updated: October 1, 2026"** → front-matter.
  2. **`.alert-info` quick summary (4 bullets)** — static.
  3. **11 numbered sections** (§1 Information we collect → §11 Contact) — static.
  4. **§1 "Information we collect"** must reflect reality: email, display name, avatar URL, bio, role, community/lesson activity, review content, post/comment content, enrollment records, and **auth tokens held in `localStorage`** (not cookies).
  5. **§4 "Your rights" / §5 "Data retention" / §9 "Cookies"** — the product has **no data export, no delete-account, and no cookie-based session**. Either add those endpoints or scope the copy to what exists (see the consolidated gaps table). `NEW DELETE /users/me` + `GET /users/me/export` are **M**; until they exist the page must not promise a self-service route.
  6. **`privacy@interlekt.com`** — static.
- **Next.js route + content source:** `app/privacy/page.tsx` + `content/legal/privacy.mdx` (front-matter `{ title, effectiveDate, contactEmail }`), sharing `LegalProse` with A17.
- **Empty/loading/error states needed:** none.
- **Backend work required:** none to ship; but see the data-export/delete-account gaps (M) if the copy is to stay truthful.

### A19 — Cookie Policy (`public/A19-cookies.html` → `/cookies`)
- **Verdict:** **LIVE** as a static page — **but the content is factually wrong for this codebase and must be rewritten before shipping.**
- **Sections & the data each needs:**
  1. **H1 + "Last updated: October 1, 2026"** — front-matter.
  2. **§1 What are cookies** — generic prose.
  3. **§2 How we use cookies + 4-row table (Cookie type / Purpose / Duration)**: `Essential — session (until sign-out)`, `Functional — 30 days`, `Analytics — 14 months`, `Marketing — not in use`.
     - **Reality check:** `lib/api/session.ts` stores the access + refresh tokens in **`localStorage`** (`interlekt.access_token`, `interlekt.refresh_token`) plus an in-memory copy. There are **no cookies**, **no Google Analytics**, **no Paystack** (no payments), and **no marketing cookies**. Also "Filter selections … 30 days" — the current `/communities` page keeps filters in the URL, not in storage.
     - **Decision required (choose one):**
       - **(a) Rewrite the page** to describe the actual storage model: "Interlekt does not use cookies for authentication. Your session token is stored in your browser's local storage…" plus a short table of *local-storage keys* → purpose → lifetime. The cookie table then becomes a "What we store on your device" table. **No backend work.** ✅ recommended
       - **(b) Move the auth stack to httpOnly cookies** (BFF pattern, `POST /auth/login` sets `Set-Cookie`, `POST /auth/logout` clears it) — **M**, and it changes `client.ts`, `session.ts`, and the CORS/CSRF posture.
  4. **§3 Third-party cookies** — "Paystack" (no payments) and "Google Analytics" (not installed) → remove or rewrite.
  5. **§4 Managing cookies + "preference centre in Account Settings"** — **no settings page exists** and no consent store. `NEW GET|PUT /users/me/preferences` (S) if you keep the preference centre; otherwise drop the paragraph.
  6. **§5 Changes** — "notify active users by email at least 14 days before" → no notification/mailer subsystem. Either build one (M) or soften the copy.
  7. **§6 Contact `privacy@interlekt.com`** — static.
- **Next.js route + content source:** `app/cookies/page.tsx` + `content/legal/cookies.mdx`, sharing `LegalProse`. If option (b) is chosen, add a `CookieConsent` client component + `GET|PUT /users/me/preferences`.
- **Empty/loading/error states needed:** none.
- **Backend work required:** none under option (a); `GET|PUT /users/me/preferences` (S) + a mailer (M) under option (b).

### A20 — Refund Policy (`public/A20-refund-policy.html` → `/refunds`)
- **Verdict:** **LIVE** as a static page — but the self-serve flow it describes does not exist.
- **Sections & the data each needs:**
  1. **H1 + "Last updated: October 1, 2026"** — front-matter.
  2. **`.alert-info` quick summary (3 bullets)** — 30-day monthly, 14-day lifetime, no refunds on completed courses.
  3. **§1 Monthly subscriptions (30 days)** — "sign in, go to **Account Settings → Subscriptions**, select the community, choose *Request refund*" → **no Account Settings page, no subscriptions UI, no refund endpoint**. The only learner-side surface today is `/my-communities` (`GET /enrollments/mine` → `EnrollmentResponse{id, community, status, createdAt, cancelledAt}`) and `DELETE /enrollments/{id}` (leave, not refund).
  4. **§2 Lifetime access (14 days)** → no lifetime tier in the model (no `billingPeriod`).
  5. **§3 Free communities** — "Account Settings → Subscriptions → *Leave community*" → map to `DELETE /enrollments/{id}` **LIVE**; rename the surface to `/my-communities` in the copy. "Progress preserved for 30 days" → no such backend behaviour (`lessons/{id}/complete` rows persist indefinitely).
  6. **§4 How to request a refund** — self-serve + email. Self-serve → `NEW POST /enrollments/{id}/refund` (M) + the payments subsystem (L); email → static.
  7. **§5 Processing time (5–7 business days, Paystack)** → no payments integration; the copy is a promise about a system that does not exist.
  8. **§6 Exceptions (no refund if all lessons complete)** → computable today from `GET /courses/{id}/progress` → `completedLessons == totalLessons` **LIVE** (auth only) — this is the one rule the backend can already enforce.
  9. **§7 Creator obligations (deduct from next weekly payout)** → no payouts.
  10. **§8 Contact `support@interlekt.com` / `legal@interlekt.com`** — static.
- **Next.js route + content source:** `app/refunds/page.tsx` + `content/legal/refunds.mdx`, sharing `LegalProse`. Mark the file `status: "effective on payments launch"` so the copy is not presented as a live capability.
- **Empty/loading/error states needed:** none (static).
- **Backend work required:** none to ship the page; `POST /enrollments/{id}/refund` (M) + payments (L) to make §1/§4/§7 true.

### A21 — Trust & safety (`public/A21-trust-safety.html` → `/trust`)
- **Verdict:** PARTIAL — all prose is static; the reporting flow needs a new endpoint.
- **Sections & the data each needs:**
  1. **Hero + 5 commitments** (Real identity verification / Working professionals only / Naira-native transparency / Content moderation) — static prose. The naira claim depends on payments.
  2. **Creator verification (4 checks + manual review)** — static prose. The *state* it describes IS live: `creator.verificationStatus` (`pending｜verified｜rejected`) + `creator.isVerified` **LIVE** → drives the teal check (`ILK`/design uses teal `#0F766E`; the existing `VerificationBadge` renders `text-blue-500` for verified — **recolour**). Admin side: `PATCH /admin/creators/{user_id}/verification` **LIVE** (already used by `/verification`).
  3. **"How reporting works" + SLA prose** — static.
  4. **Severity table (Severity / Examples / Target response): Critical → 1h, High → 4h, Medium → 24h, Low → 72h** — static table (`.table-wrap` + `.table`, tabular nums).
  5. **"What we don't allow" (4 numbered items)** — static prose.
  6. **Data & privacy** — static, links to `/privacy` and `/cookies`.
  7. **"Report a community or user" CTA + "Email safety team"** → **no report endpoint**. The backend has no report model, and `app/(admin)/reports/page.tsx` already states "the backend currently exposes no report submission, listing, or moderation endpoints". `NEW POST /api/v1/reports` body `{ targetType: "community"|"post"|"comment"|"user", targetId, reason, details?, reporterEmail? }` → 201 `{ id, status, createdAt }`; plus `GET /admin/reports` + `PATCH /admin/reports/{id}` for triage (M).
  8. **`safety@interlekt.com`** — static.
- **Next.js route + content source:** `app/trust/page.tsx` + `content/legal/trust.mdx` (front-matter `{ title, updatedAt, contactEmail }`), plus a small `ReportDialog` client component that posts to `POST /api/v1/reports` once it exists. Until then the CTA must be `mailto:safety@interlekt.com` only.
- **Empty/loading/error states needed:** report form submitting / success / error states once the endpoint exists; static page otherwise.
- **Backend work required:** `POST /api/v1/reports` + admin list/patch (M).

### A22 — Learner login (`public/A22-learner-login.html` → `/auth/learner-login`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Brand (lightning-E mark + wordmark)** — static; reuse `components/logo.tsx`.
  2. **"Learner sign in" micro-label + "Welcome back" + lead** — static.
  3. **Email + password + eye toggle** → `POST /auth/login` `LoginRequest{email,password}` **LIVE**.
  4. **Remember me** → client-side token persistence in `lib/api/session.ts` **LIVE (client)**.
  5. **Forgot password?** → `/auth/forgot-password` **LIVE**.
  6. **Sign in** → `POST /auth/login` → `TokenResponse` **LIVE**.
  7. **Continue with Google** → no OAuth endpoint (M) — ship disabled with an explanation, as `app/auth/login/page.tsx` already does.
  8. **`.alert-info` "Are you a creator? Sign in to Creator Studio →"** → `/creators/auth/login` (A23, NEW) **LIVE route**.
  9. **"New to Interlekt? Create an account"** → `/auth/register` **LIVE**.
  10. **Header comment says `POST /api/auth/learner-login`** — **that endpoint does not exist.** Reuse `POST /api/v1/auth/login` and, after the response, assert the role from `user.roles[]`: if it contains `creator` and the user is on the learner page, redirect to `/studio` (or show "This account is a creator — go to Creator Studio"). Do **not** invent a role-scoped login endpoint.
- **Reusable components:** everything in A5, plus `AmbientIcons` (decorative) and `AlertInfo`.
- **Empty/loading/error states needed:** same as A5, plus the "wrong role" case above.
- **Backend work required:** none for the page; Google OAuth (M) if the button must work.

### A23 — Creator login (`public/A23-creator-login.html` → `/creators/auth/login`)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Brand (lightning-E)** — static.
  2. **"Creator sign in" micro-label + "Welcome back, creator" + lead** — static.
  3. **Email + password + eye toggle** → `POST /auth/login` **LIVE**. Same rule as A22: **the design's `POST /api/creators/auth/login` does not exist** — reuse `POST /api/v1/auth/login` and branch on `user.roles[]` (contains `creator` → `/studio`; else → redirect to `/auth/learner-login` with a notice).
  4. **Remember me / Forgot password / Sign in** → as A22 **LIVE**.
  5. **Continue with Google** → no OAuth endpoint (M).
  6. **`.alert-info` "Not a creator? Sign in as a learner →"** → `/auth/learner-login` **LIVE route**.
  7. **"Want to become a creator? Apply here"** → the design points at `C1-onboarding.html`; the real route is the existing `app/(creator)/onboarding/page.tsx` → **`/onboarding`** **LIVE**.
- **Reusable components:** as A22.
- **Empty/loading/error states needed:** as A22, plus the "not a creator" case.
- **Backend work required:** none for the page; Google OAuth (M).

### A24 — Community discussions landing (`public/A24-discussions.html` → `/discussions`)
- **Verdict:** **NEEDS-BACKEND** (effort **M**)
- **Sections & the data each needs:**
  1. **Hero + 56px search bar** → full-text across all threads + tags + community names. **No cross-community search endpoint.** `NEW GET /api/v1/discussions?search=&page=&pageSize=` (M).
  2. **7 filter chips** — Trending today / This week / All time / Unanswered / From AI & Engineering / From Product Design / From FinTech:
     - Time windows (today / week / all) → **no sort/filter on posts**. `NEW GET /discussions?sort=trending|week|all|unanswered` (M).
     - Unanswered → `PostResponse.commentCount === 0` — the field **exists**, but there is no filter param and no global list. (M)
     - Category chips → the backend's categories are the 8 real ones, not the design's names. Source them from `GET /categories` **LIVE**.
  3. **6 thread cards** — title, community name, author name + avatar + verified check, relative time, tags, **vote count**:
     - `PostResponse` gives `id, communityId, authorId, author{userId,displayName,avatarUrl}, content, isPinned, isAnnouncement, commentCount, createdAt, updatedAt` **LIVE per community** — but `GET /communities/{slug}/posts` is **401 anon** and there is no cross-community feed.
     - **Vote count → NO MODEL AT ALL.** `NEW POST /posts/{post_id}/vote` / `DELETE /posts/{post_id}/vote` + `voteCount: integer` on `PostResponse` (M).
     - **Tags → NO MODEL.** `NEW tags: string[]` on `PostResponse` + `PostCreateRequest` (S).
     - Relative time → client-side from `createdAt` **LIVE**.
     - The thread title: `PostResponse.content` is a single body string; the design's title+body split needs either a `title` field on posts (S) or a derived first-line convention.
  4. **5 top contributors** — avatar, name, role, verified, **posts this week** → **no aggregation endpoint**. `NEW GET /api/v1/discussions/top-contributors?window=week&limit=5` → `{ userId, displayName, avatarUrl, headline, isVerified, postCount }` (M).
  5. **Final CTA** — routes **LIVE**.
  6. **Thread links → `/communities/[slug]/discussions/[threadId]`** — that route belongs to the learner/learner-shell shell (B28/B29); the backend has no thread-detail endpoint beyond `GET /posts/{post_id}` (auth-gated, returns the post + comments).
- **Reusable components:** `ThreadCard` (design `.thread-card` / `.thread-vote` / `.thread-vote-count`), `ChipFilterRow`, `ContributorCard`, `Avatar` with verified check.
- **Empty/loading/error states needed:** loading skeleton; error + Retry; empty → "No discussions yet — the first one is yours to start" with a CTA to `/communities`; a filter with 0 → "No discussions match this filter".
- **Backend work required:** anon `GET /communities/{slug}/posts` (S); `NEW GET /api/v1/discussions` with `sort`/`category`/`search`/`page` (M); `NEW voteCount` + vote endpoints (M); `NEW tags` on posts (S); `NEW GET /api/v1/discussions/top-contributors` (M).

---

## Backend gaps consolidated

| Gap | Screens affected | Proposed endpoint/model | Effort |
|---|---|---|---|
| Platform-wide stats (learners, ₦ paid, verified mentors) | A1, A14 | **NEW** `GET /api/v1/stats` → `{ activeLearners, liveCommunities, paidToCreators, verifiedMentors }` | S |
| Platform public config (revenue share, fee, min price, refund windows, payout schedule) | A1, A15, A17, A20 | **NEW** `GET /api/v1/platform/public-config` | S |
| Category → community count | A1, A2, A8 | Extend `CategoryResponse` with `communityCount` (or `NEW GET /categories/with-counts`) | S |
| Community list filters & sorts (creator, free/paid, min rating, rating & price sorts) | A2, A4, A8 | Extend `GET /communities` query: `creatorId`, `isFree`, `minRating`, `sort=rating｜price_asc｜price_desc` | S |
| Public curriculum outline (module + lesson titles & durations) | A3 | Allow anonymous `GET /api/v1/courses/{course_id}/modules` — `LessonOutline` has no content, safe to expose | S |
| Public reviews + rating breakdown | A3, A8 | Allow anonymous `GET /communities/{slug}/reviews`; add `ratingBreakdown{1..5}` + `wouldRecommendPct` to `CommunityDetail` | S |
| Public member preview (avatar stack) | A3 | Allow anonymous `GET /communities/{slug}/members` (page-size-limited) | S |
| Public community feed | A3, A24 | Allow anonymous `GET /communities/{slug}/posts` for published communities | S |
| Creator profile enrichment | A3, A4, A8 | Add to `CreatorProfileResponse`: `headline`, `location`, `memberCount`, `avgRating`, `reviewCount` | S |
| Billing interval on a community | A1, A2, A3, A15, A20 | Add `billingPeriod: "free"｜"monthly"｜"lifetime"` + `lifetimePriceAmount` to `Community`/`CommunityListItem` | S |
| Free-lesson preview | A3 | `NEW GET /api/v1/lessons/{lesson_id}/preview` or `previewLessonId` on `CourseSummary` | S |
| Reset-link TTL + resend cooldown | A7, A11 | Add `expiresInMinutes` to the 202 body of `POST /auth/forgot-password`; `Retry-After` on 429 | S |
| Password policy discovery | A11 | `NEW GET /api/v1/auth/password-policy` | S |
| Email verification | A6, A10 | `isEmailVerified` on the user + `email_verification_tokens` table + `POST /auth/verify-email` + `POST /auth/verify-email/resend` | M |
| Google OAuth | A5, A6, A22, A23 | `NEW POST /auth/oauth/google` + `GET /auth/oauth/google/redirect` | M |
| Creator search | A8, A24 | `NEW GET /api/v1/creators?search=&page=&pageSize=` → `Paginated<CreatorProfileResponse>` | M |
| Lesson search | A8 | `NEW GET /api/v1/lessons?search=&communityId=&page=` | M |
| Search facets (per-category result counts) | A8 | `NEW GET /api/v1/communities/search/facets?search=` | M |
| Cross-community discussion index + filters | A24 | `NEW GET /api/v1/discussions?sort=trending｜week｜all｜unanswered&category=&search=&page=` | M |
| Post votes | A24 | `NEW POST|DELETE /api/v1/posts/{post_id}/vote` + `voteCount` on `PostResponse` | M |
| Post tags | A24 | `NEW tags: string[]` on `PostResponse` / `PostCreateRequest` | S |
| Top contributors aggregation | A24 | `NEW GET /api/v1/discussions/top-contributors?window=week&limit=` | M |
| Creator experience timeline | A4 | `NEW GET|POST /api/v1/creators/{user_id}/experience` | M |
| Creator follow | A4 | `NEW POST|DELETE /api/v1/creators/{user_id}/follow`, `followerCount` on the profile | M |
| Report submission + moderation | A21, (admin `/reports`) | `NEW POST /api/v1/reports` + `GET /admin/reports` + `PATCH /admin/reports/{id}` | M |
| Help content API (optional) | A16 | `NEW GET /api/v1/help/articles` — only if articles must be editable without a deploy | M |
| Creator ↔ learner messaging | A4 | `NEW GET|POST /api/v1/messages` (+ threads, read receipts) | L |
| Payments: checkout, subscriptions, transactions | A1, A3, A15, A20 | `NEW POST /api/v1/enrollments/{id}/checkout`, `GET /api/v1/transactions`, subscription model | L |
| Payouts (88/10 split, weekly Friday, ₦500k threshold) | A1, A4, A15 | `NEW POST /api/v1/payouts`, `GET /api/v1/payouts`, `Payout` model | L |
| Refunds (30-day / 14-day windows, self-serve) | A20, A3 | `NEW POST /api/v1/enrollments/{id}/refund` + refund ledger | L |
| Data export + account deletion (privacy claims) | A18 | `NEW GET /api/v1/users/me/export`, `NEW DELETE /api/v1/users/me` | M |
| Consent / terms version record | A6, A17 | `NEW acceptedTermsAt` + `termsVersion` on the user | S |
| Cookie preference store | A19 | `NEW GET|PUT /api/v1/users/me/preferences` | S |
| Incident correlation id / error reporting | A13 | Frontend `crypto.randomUUID()` (S) or Sentry/Datadog (M) | S–M |
