# Interlekt — Technical Architecture

**Document:** Architecture / Technical Design
**Version:** 0.1 — Hackathon MVP
**Status:** 🟡 **PROPOSED — FOR TEAM REVIEW. NO IMPLEMENTATION SHOULD START BEFORE SIGN-OFF.**
**Source of truth:** `docs/PRD.md` v0.1. The PRD wins on every product question. This document only
decides how the PRD gets built.
**Audience:** primarily the frontend engineer, who starts coding as soon as this is approved.

---

## 0. Gate status

> **This architecture is presented for team review.** It has not been approved. Per the pipeline
> protocol, no implementation (Phase 4: Build) should begin until the team signs off on:
>
> 1. The **API contract** (§3) — the error envelope, pagination convention, and the 12 endpoints
>    tagged in the "Day-1 contract freeze" table.
> 2. The **payment flow and post-payment state machine** (§6, §5.6) — the highest-risk part of the demo.
> 3. The **open product decisions** in §7 — of which exactly **one is truly blocking** the frontend
>    (§7.1 question 1: one-time payments vs subscriptions). The other two blocking items are the
>    contract freeze itself and the seed data, which is a team-resource question, not a design question.
>
> Everything marked 🟢 *decided* is safe to build against. Everything marked 🟡 *assumption* is safe to
> build against **only if** the API returns the value rather than the frontend hardcoding it. Anything
> marked 🔴 *BLOCKING* must be answered before the dependent work starts.

**Note on pipeline inputs:** no `plan.md` or `profile.json` exists in this repo yet. This document was
produced directly from the PRD. That is the right call for a hackathon — the PRD is already
requirements-complete for the MVP loop.

---

## Contents

**Reading order for the frontend engineer: §0 → §1 → §3 (API contract) → §4 (auth) → §5 (frontend) →
§6.2 (idempotency) → §6.5 (rehearsal) → §7 (what's still open) → §13 (day-1 checklist).**
The API contract is placed ahead of the data model on purpose: the contract is what you build against,
and the schema is the backend's implementation of it.

| § | Section | Read it if you are… |
|---|---|---|
| 0 | [Gate status](#0-gate-status) | Everyone — start here |
| 1 | [TL;DR — the ten decisions that matter](#1-tldr--the-ten-decisions-that-matter) | in a hurry |
| 2 | [Stack confirmation (validating PRD §10)](#2-stack-confirmation-validating-prd-10) | the backend engineer, or deciding what to cut |
| **3** | **[API contract](#3-api-contract)** | **the frontend engineer — the main deliverable** |
| 4 | [Auth architecture](#4-auth-architecture) | frontend (route protection) + backend (dependencies) |
| **5** | **[Frontend architecture](#5-frontend-architecture)** | **the frontend engineer — the main deliverable** |
| 6 | [Payment flow (end-to-end)](#6-payment-flow-end-to-end) | everyone — highest risk in the product |
| 7 | [Open decisions (PRD §22)](#7-open-decisions-prd-22) | the team — what's still unanswered |
| 8 | [Infrastructure & delivery](#8-infrastructure--delivery) | whoever is deploying |
| 9 | [Data model](#9-data-model) | the backend engineer |
| 10 | [Security checklist (PRD §17)](#10-security-checklist-prd-17) | code review |
| 11 | [Testing strategy (PRD §18)](#11-testing-strategy-prd-18) | whoever writes tests |
| 12 | [Risks to this architecture](#12-risks-to-this-architecture) | the team, before the demo |
| 13 | [Frontend engineer's day-1 checklist](#13-frontend-engineers-day-1-checklist) | the frontend engineer — start here |
| 14 | [Sign-off](#14-sign-off) | the team |

---

## 1. TL;DR — the ten decisions that matter

| # | Decision | One line |
|---|---|---|
| 1 | **API topology** | Browser talks **only to the Next.js origin** at `/api/v1/*`, reverse-proxied to FastAPI. Same-origin ⇒ cookies work, CORS is a non-issue, third-party cookie blocking can't hurt us. |
| 2 | **Auth** | HttpOnly cookie JWT, access 15 min + refresh 7 days, **refresh token not rotated** (removes the whole RSC cookie-forwarding problem). Zero token code in the browser. |
| 3 | **Pagination** | `page` + `limit` (offset), limit capped at 50, default 20. Justified in §3.2. |
| 4 | **Errors** | One envelope, `error.code` is a stable `SCREAMING_SNAKE` string the client switches on. Never switch on `message`. |
| 5 | **Money** | Integer **kobo** everywhere, `currency` column defaults `NGN`, platform fee frozen onto the payment row at initialize time. No floats. |
| 5b | **Pricing is the creator's choice** | `communities.billing_period ∈ {one_time, monthly}`, set by the community owner at creation. Free = `price_kobo = 0`. The frontend renders whatever the API returns — it never hardcodes a pricing model. Resolves the last blocking question. |
| 6 | **Payment truth** | The only source of enrollment state is the **server**. Paystack return URL params are never trusted — they pick copy, not logic. |
| 7 | **Webhook idempotency** | `SELECT … FOR UPDATE` on the payment row + `UNIQUE(provider, provider_reference)` backstop. Repeat webhook = no-op 200. |
| 8 | **Fallback verification** | `GET /payments/{reference}/status` verifies **directly with Paystack** if the webhook hasn't landed. This is the demo's safety net and it must be built. |
| 9 | **Rendering** | RSC for the read-only shell (SEO + low bandwidth). TanStack Query only for interactive sub-widgets. **One owner per resource per page** — never both. |
| 10 | **Zustand** | Exactly one store (`usePaymentFlowStore`). Everything else is URL state or Query. Filters live in the URL, not in a store. |

**Deferred to P2 (explicitly out of the build):** notifications, quizzes, certificates, AI, native apps,
live video infra, payouts, subscriptions, real progress analytics. `notifications` table still ships in
the initial migration (empty) so the schema matches PRD §12 — zero endpoints built.

---

## 2. Stack confirmation (validating PRD §10)

PRD §10 is the settled decision. Below is a **validation**, not a re-litigation. Each row: confirm,
with the one thing that needed adjusting and why.

### 2.1 Verdict per layer

| Layer (PRD §10) | Verdict | Note |
|---|---|---|
| Next.js + React (App Router) | ✅ **Confirm** | App Router is required, not optional — we need RSC for the low-bandwidth requirement (§9, §21). |
| TypeScript | ✅ Confirm | Non-negotiable; also the contract with the generated API types (§5.2). |
| Tailwind CSS | ✅ Confirm | |
| shadcn/ui + Radix | ✅ Confirm | Exact component shortlist in §5.5. |
| TanStack Query | ⚠️ **Confirm but scope it** | Use it for **interactive client data only**, not as a universal data layer. Full rationale in §5.3. |
| Zustand | ⚠️ **Confirm but heavily scope it** | One store is justified. A second one is scope creep. §5.4. |
| React Hook Form | ✅ Confirm | All forms. |
| Zod | ✅ Confirm, with a caveat | Client Zod is **UX-only**. The backend's 422 payload is runtime truth. §5.2. |
| Python + FastAPI | ✅ Confirm | FastAPI's automatic OpenAPI is load-bearing for our frontend contract. |
| SQLAlchemy 2.x | ✅ Confirm | Typed `Mapped[]` / `mapped_column()`. |
| Alembic | ✅ Confirm, simplified | **One initial migration with the whole schema.** See §2.3. |
| PostgreSQL | ✅ Confirm | Managed instance only. Never a container. §8.3. |
| Pydantic | ✅ Confirm | v2. |
| "JWT or secure session strategy" | ✅ **Resolve to: JWT in httpOnly cookies + server-side session row for revocation** | §4. |
| RBAC / permission checks | ✅ Confirm | Single `users.role` enum, not a join table. §2.2. |
| Paystack | ✅ Confirm | NGK, one-time only. §7 decision #2. |
| **Resend / email** | ❌ **Drop for MVP** | No P0 requirement needs an email. `AUTH-006` (password reset) is explicitly *"if implementation time permits"*. §2.2. |
| **Cloudinary / S3** | ⚠️ **Reduce scope** | Unsigned upload preset only. No backend upload proxy. §5.5. |
| Docker + Compose | ✅ Confirm, local dev only | Not used in production deploys. |
| Nginx / platform proxy | ➖ **N/A** | Vercel + platform-managed ingress. Do not run a hand-rolled Nginx. |
| Pytest | ✅ Confirm | |
| Vitest + RTL | ✅ Confirm, P1 | |
| **Playwright** | ⚠️ **Scope to ONE test** | The demo E2E (§18). Not a suite. |
| FastAPI OpenAPI | ✅ Confirm — **elevate to a P0 deliverable** | It is the contract. See §3.1. |
| Git + GitHub | ✅ Confirm | |
| GitHub Actions | ✅ Confirm, minimal | Lint + typecheck + test + build. No preview envs. |
| Sentry + structured logging | ✅ Confirm | Free tier, both apps. |

### 2.2 Deviations and reductions, stated plainly

1. **Email is out.** Not in any P0 requirement ID. Recovering 3–4 hours is worth more.
2. **Redis is out.** Rate limiting is in-process (`slowapi`) plus a `login_attempts` table. No Redis dependency on the critical path.
3. **No Nginx.** Vercel's edge handles TLS/CDN/WAF-adjacent basics for the web app. Railway/Render handle ingress for the API. Hand-rolled Nginx during a hackathon is a self-inflicted outage.
4. **Roles are a single column, not a join table.** PRD §8's matrix is fully expressible with `users.role ∈ {learner, creator, admin}`. Creators can enroll and post (learner capabilities) exactly as §8 says; admins can do everything. A `user_roles` join table buys nothing here. *Production note: this is the first thing to refactor when real per-role permissions arrive.*
5. **Course/lesson deletion is a hard delete** with a confirm dialog. Soft-deleting content trees is a data-migration project. Posts/comments are soft-deleted (`deleted_at`) because moderation needs them (ADMIN-003). That asymmetry is deliberate.
6. **"One or more categories" (DISC-003)** is modelled as one required `category_id` (the browse/filter axis) plus a `tags text[]` for secondary topics. A join table buys nothing at MVP and costs a query on the hottest endpoint in the app. *Marked as assumption A-3 in §7.*

### 2.3 Alembic strategy (simplified)

- **One initial migration** containing the entire schema. `--autogenerate` once, reviewed, committed.
- After that, one migration per logical change, hand-edited.
- **The demo database is always migrated from scratch, never migrated forward.** Therefore destructive
  migrations (`drop_column`, `alter type`) are acceptable. Do not build expand-migrate-contract
  (per the `db-scale` skill) — that is a production pattern, explicitly out of scope here.
- Deploy command: `alembic upgrade head` as the release step on Railway.
- Downgrade scripts still written (PR §19 "rollback-aware"), but only smoke-tested.

### 2.4 Hosting

| Component | Provider | Why |
|---|---|---|
| `apps/web` | **Vercel** | Native Next.js, instant preview deploys per PR, global CDN for the HTML shell and images. Zero config for the rewrite in §3.4. |
| `apps/api` | **Railway** (alt: Render, Fly.io if the team knows it) | Deploy-from-Dockerfile, managed Postgres add-on, public HTTPS URL for the Paystack webhook. No k8s. |
| Postgres | **Managed** (Neon / Supabase / Railway add-on) | Never a container. A DB restart mid-demo is a lost demo. Daily snapshot is enough. |
| Media | **Cloudinary** (free tier) | Unsigned upload preset. CDN URLs. AVIF/WebP for free via transforms. |
| DNS/TLS | Cloudflare free (proxied) | One extra hop for WAF + cache rules if needed. Optional. |

> **Hackathon note:** the *only* browser-visible environment variable in `apps/web` is… none. The API
> origin is a **server-side** var (`API_ORIGIN`, no `NEXT_PUBLIC_` prefix) used only by the Next rewrite.
> The Paystack secret key never appears in any frontend env, ever (§17).

---

## 3. API contract

> **This is the highest-value section of this document.** The frontend engineer can build data access,
> types, and screen shells against this while the backend is still being written.

Base path: `/api/v1` (PRD §13). Version from day one.

### 3.1 OpenAPI is a P0 deliverable

FastAPI generates `/openapi.json` for free. It is the contract.

- Backend owns it; frontend never hand-maintains a parallel spec file.
- Frontend generates types from it: `npm run gen:api` (§5.2).
- The generated file is **committed** so the frontend can typecheck without a running backend.
- **Contract change protocol:** if the backend changes a response shape, it regenerates the spec in the
  same PR. CI diffs the generated `api.d.ts` and fails if it's stale. This is ~10 lines of CI and it
  prevents the single most common two-person-team failure mode.

### 3.2 Conventions (the three decisions every endpoint follows)

#### Pagination — `page` + `limit` (offset-based). Chosen.

Request: `?page=1&limit=20` (1-indexed). Response:

```json
{
  "items": [ /* … */ ],
  "page": { "page": 1, "limit": 20, "total": 137, "total_pages": 7, "has_next": true, "has_prev": false }
}
```

**Why offset, not cursor:**
- Our largest list in the demo is a community feed with maybe 40 posts. Offset is exactly right here.
- The frontend needs `total` anyway for "Page 1 of 3", for the members/transactions tables, and to decide
  whether "Load more" is even needed. Cursor pagination doesn't give you a count without a second query.
- Cursor pagination forces a **second opaque token type** into the generated client, plus a matching
  second pagination component. That is real time for zero user-visible benefit.
- Every list index in §3.9 already ends with `created_at DESC`, so if we ever outgrow this, flipping to
  keyset is `WHERE (created_at, id) < (:ts, :id)` and reuses the same indexes. **No index rewrite later.**

**Rules:** `limit` default `20`, max `50` (server clamps, never errors). `page < 1` → coerced to `1`.
`limit` in list *responses* is **truncated to a 280-char preview** for `body` on posts/comments — a list
payload is never a full object. That is the single biggest payload-size lever we have.

#### Error envelope

Every non-2xx response, without exception:

```json
{
  "error": {
    "code": "ALREADY_ENROLLED",
    "message": "You are already enrolled in this community.",
    "details": [
      { "field": "body.price_kobo", "issue": "Input should be greater than or equal to 100" }
    ],
    "request_id": "01JBX7QK3M9ZC4T2W0P6F8N5RV"
}
```

| Field | Contract |
|---|---|
| `code` | Stable `SCREAMING_SNAKE` identifier. **The client switches on this and only this.** Never on `message`. |
| `message` | Human-readable, English, suitable for display. May be reworded freely. |
| `details[]` | Field-level errors for forms. Maps 1:1 to RHF `setError`. **Empty array `[]` for non-validation errors** — always present, never `null`/omitted. |
| `request_id` | Also returned as the `x-request-id` response header. Sentry breadcrumb. Lets a demo-day panic find the log. |

**Status codes:**

| Code | Meaning | Interlekt examples |
|---|---|---|
| `200` | OK | updates, and **reusing an in-flight payment reference** |
| `201` | Created | resource + `Location` header |
| `204` | No content | logout, lesson complete, deletes |
| `401` | Missing / invalid / expired token | `UNAUTHENTICATED`, `SESSION_EXPIRED` |
| `402` | Payment required | "This community is paid — use the payment flow" |
| `403` | Authenticated but not permitted | `NOT_A_MEMBER`, `LESSON_LOCKED`, `NOT_COMMUNITY_OWNER`, `FORBIDDEN_ROLE` |
| `404` | Not found **or** not visible to you | We return 404 (not 403) when revealing existence would leak. Keeps unpublished communities from being probed. |
| `409` | State conflict | `ALREADY_ENROLLED`, `ALREADY_REVIEWED`, `NOTHING_TO_PUBLISH`, `PAYMENT_IN_FLIGHT` |
| `422` | **Body/field validation** (FastAPI's native `RequestValidationError`) | registration form, create community, post a review |
| `429` | Rate limited | `Retry-After` header **must** be set |
| `5xx` | Server / upstream failure | `PAYMENT_PROVIDER_UNAVAILABLE` (502), `SERVICE_UNAVAILABLE` (503) |

> **Deliberate deviation:** 422 (not 400) for field validation, because that is FastAPI's default and
> handling it costs zero lines of custom middleware. **400 is reserved for well-formed but
> semantically invalid requests** — e.g. `PUBLISH` on a community with no lessons
> (`code: "NOTHING_TO_PUBLISH"`, `details` lists each missing prerequisite). This gives the creator a
> publish-readiness checklist for free.

**Error codes the frontend will actually branch on:**

`UNAUTHENTICATED` · `SESSION_EXPIRED` · `FORBIDDEN_ROLE` · `NOT_A_MEMBER` · `LESSON_LOCKED` ·
`NOT_COMMUNITY_OWNER` · `NOT_FOUND` · `ALREADY_ENROLLED` · `ALREADY_REVIEWED` · `REQUIRES_ENROLLMENT` ·
`PAYMENT_REQUIRED` · `PAYMENT_IN_FLIGHT` · `NOTHING_TO_PUBLISH` · `EMAIL_TAKEN` · `INVALID_CREDENTIALS` ·
`RATE_LIMITED` · `PAYMENT_PROVIDER_UNAVAILABLE` · `VALIDATION_ERROR`

#### Auth levels used in the tables below

`public` · `user` (any authenticated) · `creator` · `owner` (owns the community) · `member` (has an
**active** enrollment in the community) · `admin`

---

### 3.3 Endpoints — Auth & Account (AUTH-001…006, USER-001, USER-002)

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | public | `{email, password, display_name, role?: "learner"\|"creator", interests?: string[]}` → `201 {user: UserMe}` + cookies | 201, 409 `EMAIL_TAKEN`, 422 | AUTH-001, AUTH-003, USER-001, USER-002 |
| `POST` | `/auth/login` | public | `{email, password}` → `200 {user: UserMe}` + cookies | 200, 401 `INVALID_CREDENTIALS`, 429 | AUTH-002 |
| `POST` | `/auth/refresh` | cookie | *(no body; reads `ilkt_rt`)* → `200 {user: UserMe}` + new access cookie | 200, 401 `SESSION_EXPIRED` (clears both cookies) | AUTH-002 |
| `POST` | `/auth/logout` | user | — → `204` | 204 | AUTH-002 |
| `GET` | `/auth/me` | user | → `200 UserMe` | 200, 401 | AUTH-004, USER-001 |
| `PATCH` | `/users/me` | user | `{display_name?, headline?, bio?, avatar_url?, country?, interests?}` → `200 UserMe` | 200, 422 | USER-001, USER-002 |
| `GET` | `/users/{id}` | public | → `200 UserPublic` (**no email**) | 200, 404 | USER-001 |
| `POST` | `/users/me/avatar` | user | `{image_url}` → `200 {avatar_url}` | 200, 422 | USER-001 |
| `POST` | `/auth/password/request-reset` | public | `{email}` → **`202`** always (no user enumeration) | 202 | AUTH-006 *(P2)* |
| `POST` | `/auth/password/reset` | public | `{token, new_password}` → `204` | 204, 422 | AUTH-006 *(P2)* |

**Notes the frontend must know:**

- `register` accepts `role`, but the server **hard-rejects `admin`** (422). This is the first of several
  places where a client-supplied field is a *hint*, not truth (§4.4).
- The 201/200 login responses set cookies. **The client stores nothing.**
- `UserPublic` is a strictly smaller shape than `UserMe` (no email, no role). Different TS types, both
  generated.
- Password reset is **deferred**. Design the login page with a "Forgot password?" link that is
  `disabled` + tooltip "Coming soon" rather than building a dead-end form.

**`UserMe`:**
```ts
{ id: string; email: string; display_name: string; avatar_url: string | null;
  headline: string | null; bio: string | null; country: string | null;
  interests: string[]; role: "learner" | "creator" | "admin";
  is_creator: boolean; created_at: string }
```

---

### 3.4 Endpoints — Creators (CREATOR-001/002, TRUST-004)

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `POST` | `/creators/apply` | user | `{headline?, expertise?[]}` → `201 CreatorProfilePublic` | 201, 409 `ALREADY_A_CREATOR` | CREATOR-001 |
| `GET` | `/creators/me` | creator | → `200 CreatorProfilePrivate` | 200, 403 `FORBIDDEN_ROLE` | DASH-001 |
| `PATCH` | `/creators/me` | creator | `{headline?, bio?, expertise?[], website_url?, twitter_url?}` → `200` | 200, 422 | CREATOR-001, CREATOR-002 |
| `GET` | `/creators/{slug}` | public | → `200 CreatorProfilePublic + communities[] + trust{}` | 200, 404 | CREATOR-002, TRUST-004 |
| `POST` | `/creators/me/verification` | creator | `{evidence_url, statement}` → `201 Verification` | 201, 409 `ALREADY_SUBMITTED` | TRUST-004 *(P1)* |

**`POST /creators/apply` behaviour:** flips `users.role` to `creator` and creates `creator_profiles` with a
slug derived from `display_name` and de-duplicated (`ada-obi`, `ada-obi-2`). Returns 201. The frontend
redirects to `/creator`.

**`CreatorProfilePublic`:**
```ts
{ user_id: string; slug: string; display_name: string; avatar_url: string | null;
  headline: string | null; bio: string | null; expertise: string[];
  website_url: string | null; twitter_url: string | null;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  verified_at: string | null;
  joined_at: string;
  trust: { verified: boolean; rating_avg: number | null; rating_count: number;
           total_communities: number; total_members: number };
  communities: CommunityCard[] }   // published, non-archived only
```

The **`trust` object is pre-aggregated on the server.** Do not compute rating averages or member totals
client-side from a list — you don't have the other communities' data, and you'd cause a request storm.
This applies to every aggregate on this page.

---

### 3.5 Endpoints — Communities (DISC-001…005, COMM-001…005, PAY-001)

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `GET` | `/communities` | public | `?q&category&sort&free&page&limit` → `CommunityList` | 200 | DISC-001, DISC-002, DISC-003, DISC-004 |
| `GET` | `/communities/categories` | public | → `200 [{id, slug, name, community_count}]` | 200 | DISC-003 |
| `POST` | `/communities` | creator | `{title, description, category_id, image_url?, tags?[], pricing}` → `201 Community` | 201, 422 | COMM-001, COMM-002, COMM-004, PAY-001 |
| `GET` | `/communities/{slug}` | public | → `200 CommunityDetail` | 200, 404 | DISC-005, DISC-004, FEED-004, ENR-004 |
| `PATCH` | `/communities/{id}` | owner | same shape as POST, partial → `200 Community` | 200, 403, 422 | COMM-002 |
| `POST` | `/communities/{id}/publish` | owner | `{published: boolean}` → `200 {community, publish_blockers: string[]}` | 200, 403, 409 `NOTHING_TO_PUBLISH` | COMM-003 |
| `POST` | `/communities/{id}/archive` | owner | — → `200 {status: "archived"}` | 200, 403 | COMM-003, §22.9 |
| `GET` | `/communities/{id}/members` | owner | `?page&limit&q&status` → `MemberList` | 200, 403 | DASH-002 |
| `GET` | `/communities/{id}/transactions` | owner | `?page&limit&status&from&to` → `TransactionList` | 200, 403 | DASH-003, PAY-003, PAY-006 |
| `GET` | `/creator/dashboard` | creator | `?community_id?` → `200 CreatorDashboard` | 200, 403 | DASH-001/002/003, PAY-005, PAY-006 |

**`POST /communities` request body** — note where the price *is* legitimately client-supplied:

```ts
{ title: string;              // 5–120 chars
  description: string;        // 20–5000 chars
  category_id: string;
  image_url?: string;
  tags?: string[];            // max 6
  pricing: { type: "free" | "paid";
             amount_kobo?: number;   // required iff type==="paid";
                                      // server validates 100 … 10_000_000 (₦1 … ₦10,000,000)
             currency?: "NGN" } }
```

> The price a **creator** sets is client input — that's the whole point of PAY-001. It is validated,
> clamped, and stored server-side. The price a **learner** pays is *never* client input on any
> learner-facing endpoint (§4.4).

**`GET /communities/{slug}` → `CommunityDetail` — the most important response in the product.**

This one call populates the entire community page (§15.1) **including the enrollment CTA state**, so the
client makes **no additional request** for a signed-in visitor. (Anonymous visitors get
`enrollment: null` and no extra call either.)

```ts
{ id: string; slug: string; title: string; description: string;
  image_url: string | null; image_thumb_url: string | null;   // §5.7 — always render the thumb in lists
  category: { id: string; slug: string; name: string };
  tags: string[];
  creator: { user_id: string; slug: string; display_name: string; avatar_url: string | null;
             headline: string | null; verification_status: VerificationStatus };
  pricing: { type: "free" | "paid"; amount_kobo: number; currency: "NGN" };
  platform_fee_kobo: number;        // ← computed server-side, returned so the client NEVER hardcodes the fee
  member_count: number;
  paid_member_count: number;
  status: "draft" | "published" | "archived";
  is_owner: boolean;                // viewer owns this community
  enrollment: EnrollmentSummary | null;   // null if anonymous or not enrolled
  can_enroll: boolean;              // ← what the CTA renders from
  rating: { avg: number | null; count: number; histogram: Record<"1"|"2"|"3"|"4"|"5", number> };
  curriculum_preview: {              // is_preview lessons only, for the "Evaluate" beat
    courses: { id: string; title: string;
               modules: { title: string;
                          lessons: { id: string; title: string; duration_seconds: number | null }[] }[] }[];
    total_lesson_count: number;      // real total, so the preview can say "12 lessons · 3 free to preview"
  };
  recent_activity: { id: string; kind: "post" | "announcement"; title: string | null;
                     body_preview: string; author: { display_name: string; avatar_url: string | null };
                     created_at: string; comment_count: number }[];  // max 3
  created_at: string; }
```

**Why `can_enroll` is a server boolean and not client logic:** it encodes
*"is published · not archived · not the owner · not already enrolled · viewer is not a suspended user."*
Six rules in one place. The frontend renders the CTA from it and never re-derives it. If the frontend
derives it, it will eventually get one rule wrong and grant a free-access button to a paid community —
which is a demo-ending bug and a security bug.

`POST /communities/{id}/publish` returns `publish_blockers: string[]` (e.g. `["description_too_short",
"no_published_lessons", "cover_image_missing"]`) alongside a 409. **Render this as a readiness checklist
on the community editor.** It is the cheapest possible "publish" UX and it makes §7 COMM-003 look finished.

---

### 3.6 Endpoints — Courses & Lessons (COURSE-001…006)

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `GET` | `/communities/{cid}/courses` | member | → `200 CourseSummary[]` | 200, 403 `NOT_A_MEMBER` | COURSE-001, COURSE-005 |
| `POST` | `/communities/{cid}/courses` | owner | `{title, description?}` → `201 Course` | 201, 403, 422 | COURSE-001 |
| `GET` | `/communities/{cid}/courses/{courseId}` | member | → `200 CourseDetail` (full outline w/ lock state) | 200, 403, 404 | COURSE-002, COURSE-005 |
| `PATCH` | `/courses/{courseId}` | owner | `{title?, description?, position?}` → `200` | 200, 403 | COURSE-002 |
| `POST` | `/courses/{courseId}/publish` | owner | `{published}` → `200` | 200, 403 | COURSE-004 |
| `DELETE` | `/courses/{courseId}` | owner | — → `204` (hard delete, cascades) | 204, 403 | COURSE-004 |
| `POST` | `/courses/{courseId}/modules` | owner | `{title, position?}` → `201 Module` | 201, 403 | COURSE-002 |
| `PATCH` | `/modules/{moduleId}` | owner | `{title?, position?}` → `200` | 200, 403 | COURSE-002 |
| `POST` | `/modules/{moduleId}/lessons` | owner | `{title, content_md?, video_url?, position?}` → `201 Lesson` | 201, 403, 422 | COURSE-002, COURSE-003, **DASH-004** |
| `GET` | `/lessons/{lessonId}` | member\* | → `200 LessonDetail` | 200, 403 `LESSON_LOCKED`, 404 | COURSE-003, COURSE-005, ENR-004 |
| `PATCH` | `/lessons/{lessonId}` | owner | `{title?, content_md?, video_url?, position?, is_preview?}` → `200` | 200, 403 | COURSE-004 |
| `POST` | `/lessons/{lessonId}/publish` | owner | `{published}` → `200` | 200, 403 | COURSE-004 |
| `DELETE` | `/lessons/{lessonId}` | owner | — → `204` | 204, 403 | COURSE-004 |
| `POST` | `/lessons/{lessonId}/complete` | member | `{completed: boolean}` → `204` (idempotent upsert) | 204, 403 | COURSE-006 |

\* **`GET /lessons/{id}` is `member` OR any authenticated user when `is_preview == true`.** Previews are how
the community page shows real curriculum to non-members (the "Evaluate" beat of the demo, DISC-005).

> **DASH-004 ("creators can manage courses and lessons")** is the union of this whole table: the `PATCH`,
> `POST`, and `DELETE` verbs across courses, modules, and lessons are the course builder. The frontend
> route group is `app/(creator)/creator/communities/[id]/courses/**` (§5.1).

**`CourseDetail`** — the outline, with lock state resolved **server-side per viewer**:

```ts
{ id: string; community_id: string; slug: string; title: string; description: string | null;
  position: number; is_published: boolean;
  progress: { completed_lessons: number; total_lessons: number; percent: number };
  modules: { id: string; title: string; description: string | null; position: number;
             lessons: { id: string; title: string; position: number;
                        duration_seconds: number | null; is_preview: boolean; is_published: boolean;
                        is_locked: boolean;         // ← server decides
                        completed_at: string | null }[] }[] }[];
```

> **Locked lessons are returned with metadata but no content.** The outline renders correctly, the lock
> icon shows, the click 403s. **The client must not receive a "content omitted" marker to branch on** —
> it branches on `is_locked`, which is the same field for members and non-members.

**`LessonDetail`:**
```ts
{ id: string; course_id: string; community_id: string;
  title: string; content_md: string;             // sanitized markdown, ≤ 50k chars
  video_url: string | null; video_provider: "youtube" | "vimeo" | "mp4" | "external" | null;
  duration_seconds: number | null;
  position: number; is_preview: boolean;
  prev_lesson_id: string | null; next_lesson_id: string | null;   // outline navigation
  progress: { completed: boolean; completed_at: string | null } }
```

`prev_lesson_id` / `next_lesson_id` are computed server-side. The lesson page's prev/next buttons need
zero extra request, and on mobile the "next lesson" beat is one tap from reading to advancing — which is
the core learning loop of the demo.

---

### 3.7 Endpoints — Feed (FEED-001…004) & Reviews (TRUST-001…003)

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `GET` | `/communities/{cid}/posts` | **member** | `?page&limit&kind&author_id` → `PostList` | 200, 403 `NOT_A_MEMBER` | FEED-001, FEED-004 |
| `POST` | `/communities/{cid}/posts` | member | `{title?, body, kind?}` → `201 Post` | 201, 403, 422 | FEED-001, FEED-003 |
| `GET` | `/posts/{postId}` | member | → `200 PostDetail` | 200, 403, 404 | FEED-002 |
| `PATCH` | `/posts/{postId}` | author | `{title?, body}` → `200` | 200, 403 | FEED-001 |
| `DELETE` | `/posts/{postId}` | author/owner/admin | — → `204` (soft) | 204, 403 | ADMIN-003 |
| `POST` | `/posts/{postId}/pin` | owner | `{pinned}` → `200` | 200, 403 | FEED-003 |
| `GET` | `/posts/{postId}/comments` | member | `?page&limit` → `CommentList` | 200, 403 | FEED-002 |
| `POST` | `/posts/{postId}/comments` | member | `{body}` → `201 Comment` | 201, 403, 422 | FEED-002 |
| `PATCH` | `/comments/{commentId}` | author | `{body}` → `200` | 200, 403 | FEED-002 |
| `DELETE` | `/comments/{commentId}` | author/owner/admin | — → `204` (soft) | 204, 403 | ADMIN-003 |
| `POST` | `/posts\|comments/{id}/report` | member | `{reason, details?}` → `201` | 201, 403, 422 | ADMIN-003 *(P1)* |
| `GET` | `/communities/{cid}/reviews` | public | `?page&limit&sort` → `ReviewList` | 200 | TRUST-003 |
| `POST` | `/communities/{cid}/reviews` | user | `{rating: 1–5, title?, body?}` → `201 Review` | 201, **403 `REQUIRES_ENROLLMENT`**, 409 `ALREADY_REVIEWED`, 422 | TRUST-001, TRUST-002 |
| `PATCH` | `/reviews/{id}` | author | `{rating?, title?, body?}` → `200` | 200, 403 | TRUST-001 |
| `DELETE` | `/reviews/{id}` | author/admin | — → `204` | 204, 403 | TRUST-001 |

**Feed response:**
```ts
{ items: { id: string; community_id: string; kind: "post" | "announcement";
            title: string | null; body: string;        // truncated to 280 chars in list
            author: { user_id: string; display_name: string; avatar_url: string | null };
            is_pinned: boolean; comment_count: number; created_at: string;
            can_edit: boolean; can_delete: boolean; can_pin: boolean }[];
  page: { page, limit, total, total_pages, has_next, has_prev } }
```

Pinned announcements sort first, then `created_at DESC`.

**`POST` posts — the FEED-003 rule, precisely:** `kind: "announcement"` is accepted **only** if the author
owns the community. A non-owner sending `kind:"announcement"` gets **403 `FORBIDDEN`**, *not* a silent
downgrade to `"post"`. Silently downgrading would mean the client thinks it succeeded and the owner
never sees the announcement pinned. Fail loudly.

**Reviews are DB-locked to real enrollments** (TRUST-002): `reviews.enrollment_id` is `NOT NULL` with a FK,
and the service asserts the enrollment is `active` before insert. A reviewer without an active enrollment
cannot review, even with a direct API call. This is the §21 "fake reviews" mitigation enforced in the
schema rather than in a code path someone can forget.

`GET /communities/{cid}/rating-summary` is **folded into `GET /communities/{slug}`** as `rating` — one less
round trip on the discovery-critical page. Do not call a separate endpoint.

---

### 3.8 Endpoints — Enrollments, Payments, Admin (ENR-001…005, PAY-001…006, ADMIN-001…004)

#### Enrollments

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `POST` | `/communities/{cid}/enrollments` | user | *(no body)* → `201 {enrollment, access}` | 201, **402 `PAYMENT_REQUIRED`** (body: `{checkout_required: true, community_id}`), 409 `ALREADY_ENROLLED` (body includes the existing enrollment), 403 | ENR-001, ENR-003, ENR-005 |
| `GET` | `/communities/{cid}/enrollment` | user | → `200 EnrollmentSummary` | 200, 404 | ENR-004, ENR-005 |
| `GET` | `/enrollments/me` | user | `?page&limit&status` → `EnrollmentList` | 200 | ENR-005 |

- **`POST /communities/{cid}/enrollments` is FREE ONLY.** The server asserts `pricing.type == "free"`; on a
  paid community it returns **402 with `{checkout_required: true}`** so the client can transparently pivot
  to the payment route. One endpoint, one client branch on an explicit server signal — no client-side
  "is this free?" inference.
- **409 `ALREADY_ENROLLED` carries the existing enrollment in the body.** This is deliberate: a 409 with
  a useful payload is cheaper for the frontend than a `200 already_exists` branch, and the "you're already
  in" case is common (double-tap on a slow connection).
- **Not specced, on purpose:** `POST /enrollments/{id}/cancel`, refunds, and proration. Paid cancellation
  is an open product question and is not in the demo path. Don't build the UI for it.

```ts
type EnrollmentStatus = "pending_payment" | "active" | "cancelled" | "expired";
type EnrollmentSummary = { id: string; community_id: string; user_id: string;
  status: EnrollmentStatus; access_level: "free" | "paid";
  amount_paid_kobo: number; currency: "NGN";
  payment_reference: string | null;   // null for free
  created_at: string; activated_at: string | null; };
```

#### Payments

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `POST` | `/communities/{cid}/payments` | user | `{}` — **no price in the body** → `201 PaymentInit` | **200** (reused in-flight reference), 402 (community is free → use enrollments), 403 (owner enrolling in own community), 409 `ALREADY_ENROLLED`, 502 `PAYMENT_PROVIDER_UNAVAILABLE` | PAY-001, PAY-002, PAY-006, ENR-002 |
| `GET` | `/payments/{reference}/status` | user (owner of the payment) | → `200 PaymentStatus` | 200, 401, 404 | **PAY-004, ENR-003, ENR-004, §14.3** |
| `GET` | `/payments/me` | user | `?page&limit` → `PaymentList` (receipts) | 200 | PAY-003 |
| `POST` | `/webhooks/paystack` | **HMAC signature** | Paystack event → `200` | 200 (always, for handled *and* ignored events), 401 (bad signature), 400 (unparseable) | **PAY-004, §14.3** |
| `GET` | `/health` | public | → `200 {status, db, version, time}` | 200, 503 | — |

> **`POST /communities/{cid}/payments` takes an empty body on purpose.** The amount is read from
> `communities.price_kobo` on the server. There is no code path by which a learner can influence the
> amount charged. This is the single most important line in the payment section.

```ts
type PaymentInit = { reference: string;                    // OUR reference, not Paystack's
  authorization_url: string; access_code: string;          // navigate here — nothing else
  amount_kobo: number;                                     // ← from the server, never from the client
  platform_fee_kobo: number; creator_amount_kobo: number;  // ← §6.4, frozen at init time
  currency: "NGN"; expires_at: string; };
```

```ts
type PaymentState = "pending" | "success" | "failed" | "not_found";
type PaymentStatus = { reference: string; state: PaymentState;
  // ── server-side-verified fields; ONLY meaningful when state === "success" ──
  amount_kobo: number; platform_fee_kobo: number; creator_amount_kobo: number; currency: "NGN";
  paid_at: string | null; failure_reason: string | null;
  enrollment: EnrollmentSummary | null;   // non-null ⟺ the learner genuinely has access now
  community: { id: string; slug: string; title: string } | null;
  // ── diagnostic: did this call hit Paystack, or is it reading our own row? ──
  checked_with_provider: boolean; };
```

**`GET /payments/{reference}/status` is the heart of the flow.** It is not a passive read:

1. Load the payment **scoped to the authenticated user** (404 otherwise — never leak that a reference exists).
2. If `state` is terminal (`success` / `failed`) → return immediately, no upstream call.
3. Otherwise, if `now - payment.last_verify_attempt_at > 5s` → **call `GET api.paystack.co/transaction/verify/{reference}`
   directly, right now, and reconcile** (exactly the same code path the webhook handler uses).
4. Return the reconciled state.

**This is the demo safety net.** If the webhook is delayed, misrouted, or never delivered, the learner's
own poll still verifies with Paystack and grants access. The `5s` guard prevents hammering Paystack.
In production you'd move this to a queue; here it is a `SELECT` and an `if`.

#### Admin

| Method | Path | Auth | Req → Res | Codes | Req ID |
|---|---|---|---|---|---|
| `GET` | `/admin/dashboard` | admin | → `200 AdminDashboard` | 200, 403 | ADMIN-001, ADMIN-004, PAY-006 |
| `GET` | `/admin/users` | admin | `?page&limit&q&role&is_active` → `UserAdminList` | 200, 403 | ADMIN-001 |
| `PATCH` | `/admin/users/{id}` | admin | `{is_active?, role?}` → `200` (writes an audit row) | 200, 403, 422 | ADMIN-001 |
| `GET` | `/admin/communities` | admin | `?page&limit&q&status` → `AdminCommunityList` | 200, 403 | ADMIN-001 |
| `GET` | `/admin/verifications` | admin | `?page&limit&status` → `VerificationList` | 200, 403 | ADMIN-002 |
| `POST` | `/admin/verifications/{id}/decide` | admin | `{decision: "approved"\|"rejected", note?}` → `200` | 200, 403, 409 | ADMIN-002, TRUST-004 |
| `GET` | `/admin/reports` | admin | `?page&limit&status` → `ReportList` | 200, 403 | ADMIN-003 |
| `POST` | `/admin/reports/{id}/resolve` | admin | `{resolution, note?}` → `200` | 200, 403 | ADMIN-003 |
| `GET` | `/admin/transactions` | admin | `?page&limit&status&from&to&community_id&q` → `TransactionList` | 200, 403 | ADMIN-004 |

```ts
type AdminDashboard = { users_total: number; users_7d: number; creators_total: number;
  communities_total: number; published_communities: number; enrollments_total: number;
  revenue_gross_kobo: number; platform_fee_kobo: number; creator_payable_kobo: number;
  payments_success: number; payments_pending: number; payments_failed: number;
  verifications_pending: number; reports_open: number; };
```

Every number is a single aggregate query. The admin dashboard is one request, not twelve.

**`GET /creator/dashboard`** (creator lane, §3.5) returns the same *shape* of money figures scoped to one
creator — the two dashboards share the accounting helpers in the backend, which is how you guarantee the
creator's number and the admin's number can never disagree.

```ts
type CreatorDashboard = { communities: { id: string; slug: string; title: string; status: CommunityStatus;
      image_thumb_url: string | null; pricing: { type: "free"|"paid"; amount_kobo: number; currency: "NGN" };
      member_count: number; paid_member_count: number;
      revenue_gross_kobo: number; platform_fee_kobo: number; creator_earnings_kobo: number;
      published_course_count: number; recent_transaction_count: number }[];
  totals: { community_count: number; member_count: number; paid_member_count: number;
            revenue_gross_kobo: number; platform_fee_kobo: number; creator_earnings_kobo: number } };
```

---

### 3.9 Frontend ↔ API topology — **the recommendation the frontend dev needs first**

**Decision: no BFF. Next.js is a *reverse proxy*, not an application layer. The browser's typed client
talks to a single same-origin path that Next forwards verbatim to FastAPI. RSC and TanStack Query both
speak the identical contract.**

```
                    ┌──────────────────────────────────────────────┐
 Browser ──────────▶│ interlekt.app  (Vercel, Next.js)             │
                    │                                              │
                    │  /                    → rendered RSC        │
                    │  /explore             → rendered RSC        │
                    │  /api/v1/*  ──────────┐                    │
                    └───────────────────────┼────────────────────┘
                                            │ Next `rewrites` (proxy, byte-for-byte)
                    ┌───────────────────────┼────────────────────┐
                    │ api.interlekt.app    ▼                    │
                    │  FastAPI (Railway)                         │
                    │    └── PostgreSQL / Paystack / Cloudinary  │
                    └──────────────────────────────────────────────┘
 Paystack  ──webhook─▶ api.interlekt.app/api/v1/webhooks/paystack
```

`next.config.ts` — the whole BFF:

```ts
async rewrites() {
  const api = process.env.API_ORIGIN;          // NOT NEXT_PUBLIC_ — server-side only
  return [
    { source: "/api/v1/:path*", destination: `${api}/api/v1/:path*` },
    { source: "/media/:path*",  destination: `${api}/media/:path*` },
  ];
}
```

**Why this beats the three alternatives:**

| Option | Verdict |
|---|---|
| **Same-origin reverse proxy** ✅ | Cookies are first-party, so `SameSite=Lax` survives the Paystack redirect and no `Access-Control-Allow-Credentials` gymnastics exist. `Set-Cookie` from FastAPI passes through the rewrite untouched. One origin to reason about, one env var, ~8 lines. |
| Browser → `api.interlekt.app` directly | **Reject.** Forces `credentials: 'include'` + CORS with a specific (never `*`) origin on every request, and puts cookies on a second site where Chrome's third-party-cookie phase-out can silently break the demo. One bad cookie flag and every logged-in page 401s on demo day. |
| A real BFF (Next Route Handlers re-implementing logic) | **Reject for a hackathon.** Doubles the surface area, forces a second error-mapping layer, and RSC-only BFFs break the client-side post-payment poll (§5.6) unless you also build a proxy route. It is a production pattern (session affinity at the edge, request coalescing) with no MVP payoff. |

**What this means for the frontend engineer's data layer:**

- **One client function, one base path.** `apiFetch("/communities", …)`. No `NEXT_PUBLIC_API_URL`, no
  environment branching, no "works in dev, breaks in prod".
- **Local dev is the same shape**: Next dev server on `:3000` rewrites to `http://localhost:8000`. Cookies
  are on `localhost` in both cases, so auth behaves identically.
- **The only exception is the webhook**, which must hit FastAPI's public host directly because Paystack
  can't follow a rewrite. It bypasses Next entirely.
- `Set-Cookie` on `/auth/*` responses flows to the browser through the rewrite → **httpOnly cookies work
  with zero JavaScript**.

**CORS is therefore not load-bearing.** Still enable a dev-only `CORSMiddleware` on FastAPI for
`http://localhost:3000` so the frontend dev can point Postman/Insomnia (or a temporarily direct browser
call while debugging) at the API without fighting preflights.

**Rate limiting** (PRD §17) is in-process, no Redis:

| Path pattern | Limit | Action |
|---|---|---|
| `/auth/login`, `/auth/register`, `/auth/refresh` | 10 / min / IP | 429 + `Retry-After: 60` |
| `/auth/password/*` | 5 / hour / IP | 429 |
| `/communities/*/payments` | 5 / min / user | 429 |
| `/webhooks/paystack` | 240 / min / IP | 429 (Paystack retries; do not block it hard) |
| everything else | 120 / min / IP | 429 |

Implemented with `slowapi` in-memory. **Single-process assumption is fine** — we run one uvicorn worker.
Note this in the code so nobody scales to 4 workers and silently multiplies the limit by 4.

---

### 3.10 Index support, by endpoint

The full index list is in §9.4. The mapping that actually matters at read time:

| Endpoint (§3) | Index that serves it |
|---|---|
| `GET /communities` (§3.5) | `ix_communities_discovery (status, category_id, created_at DESC)` + `GIN (title gin_trgm_ops)` |
| `GET /communities/{slug}` | `uq_communities_slug` (unique btree) |
| `GET /communities/{cid}/posts` (§3.7) | `ix_posts_feed (community_id, created_at DESC) WHERE deleted_at IS NULL` |
| `GET /posts/{pid}/comments` | `ix_comments_post (post_id, created_at ASC) WHERE deleted_at IS NULL` |
| `GET /communities/{id}/members` | `ix_enrollments_community (community_id, status, created_at DESC)` |
| `GET /communities/{id}/transactions` | `ix_payments_community (community_id, created_at DESC)` |
| `GET /enrollments/me` | `uq_enrollments_user_community (user_id, community_id)` |
| `GET /payments/{ref}/status` | `uq_payments_reference` (unique) |
| Webhook lookup | `uq_payments_provider_ref (provider, provider_reference)` (unique) — the idempotency backstop |

**Composite column order rule applied throughout:** equality predicates first, the `ORDER BY`/range
column **last**. Every one of these indexes ends with `created_at DESC`, which is what makes a future
keyset-pagination flip (§3.2) free.

---

### 3.11 Request / response conventions worth knowing

- **All request bodies are `application/json`**, except image upload, which is **not an upload** — the
  client posts a URL string (see §5.5). No `multipart/form-data` anywhere in the MVP.
- **Dates are ISO-8601 UTC strings** (`2026-09-28T14:03:11Z`). Render with `Intl.DateTimeFormat` /
  `Intl.RelativeTimeFormat` — built in, no `dayjs`/`moment`. Both are already locale-aware for `en-NG`.
- **Money is always an integer kobo value + a currency code.** Never a float, never a formatted string.
  One helper: `formatMoney(kobo, currency)` → `"₦5,000"`. The raw integer is what crosses the wire.
- **`GZipMiddleware(minimum_size=1000)`** on FastAPI. Feed payloads compress ~6×. Free bandwidth.
- **`Cache-Control`** on public GETs: `public, max-age=60, stale-while-revalidate=300`. Authenticated
  responses: `no-store`. **Never** publicly cache an authenticated response — Vercel/edge caches exist
  and that is a data-leak class bug, not a performance bug.

---

## 4. Auth architecture

PRD §10 left this open ("JWT or secure session strategy"). **Resolved as: short-lived JWT access token +
long-lived refresh token, both in httpOnly cookies, with a server-side `sessions` row so logout actually
revokes.**

### 4.1 Tokens

| | Access token | Refresh token |
|---|---|---|
| Cookie | `ilkt_at` | `ilkt_rt` |
| TTL | **15 minutes** | **7 days** |
| `Path` | `/` | `/api/v1/auth` |
| Rotation | new value on each refresh | ❌ **not rotated** — see below |
| Revocation | natural expiry only | `sessions.revoked_at` (logout, password change, admin suspend) |

JWT: **HS256**, symmetric, signed with `JWT_SECRET` from the environment. Claims:

```json
{ "sub": "<user uuid>", "role": "learner|creator|admin", "sid": "<session uuid>",
  "typ": "access", "iat": 0, "exp": 0 }
```

**Why access = 15 min and not "one long token":** the demo includes a redirect to Paystack where the user
may sit for two minutes on a card form on a phone. A 60-minute token would usually survive, but a
30-minute one might not, and a mid-demo 401 on the return page is the single worst failure mode available
to us. Fifteen minutes plus a transparent refresh is the shortest window that cannot realistically expire
during a payment. The refresh is invisible to the frontend (§4.3), so the short TTL costs nothing.

**Why the refresh token is NOT rotated.** This is the non-obvious call, and it is a direct consequence of
§3.9: the refresh cookie lives on the **Next.js origin**, but the refresh happens on the **FastAPI
origin**. When an RSC (server-side) fetch triggers a refresh, FastAPI's `Set-Cookie` travels back to the
Next server and is **not** forwarded to the browser — the browser would silently keep the old cookie.
With rotation that becomes a token-mismatch bug on the next refresh. With **no rotation**, the old cookie
stays valid for its full 7 days, and the "expired token" class of bug simply cannot occur.

*Production note: rotating refresh tokens with reuse detection is the correct answer and requires a real
BFF or a token store the browser can be forced to update. Out of scope. Documented, not forgotten.*

### 4.2 Cookies, CSRF, password hashing

```http
Set-Cookie: ilkt_at=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/;              Max-Age=900
Set-Cookie: ilkt_rt=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth;  Max-Age=604800
```

- **`HttpOnly`** → not readable by JS, so XSS cannot exfiltrate the session. This is why the frontend
  holds no token (§4.3).
- **`Secure`** → HTTPS only. Browsers treat `http://localhost` as a secure context, so dev works without
  a flag flip. If a teammate hits trouble locally, add `COOKIE_SECURE=false` to the dev `.env` — do
  **not** disable it in production.
- **`SameSite=Lax`** (not `Strict`) — `Lax` is required. The Paystack redirect back to
  `/payment/return` is a **top-level cross-site GET navigation**; `Strict` would not send the cookie and
  the return page would look like a logged-out stranger. This is a concrete, easy-to-break detail.
- **CSRF.** `SameSite=Lax` blocks cross-site form POSTs, which covers the realistic threat. As a cheap
  belt-and-braces, FastAPI middleware **rejects any non-GET request whose `Origin` header is not in the
  allowlist** (`APP_ORIGIN` in prod, `http://localhost:3000` in dev). ~12 lines, no extra endpoint, no
  extra frontend code. *Production would add a double-submit CSRF token; noted, not built.*

**Password hashing:** **Argon2id** via `pwdlib[argon2]` (FastAPI's current recommendation).
Params: `time_cost=3, memory_cost=65536 (64 MiB), parallelism=4`. Fallback `bcrypt` is acceptable if the
team's `argon2-cffi` wheel fights them on Windows/Docker — bcrypt at cost 12 is not a bad outcome. Either
is fine; argon2id is preferred because it's memory-hard. **Never store plaintext or MD5/SHA1** (AUTH-003).

### 4.3 What the frontend actually has to write (and not write)

**The browser contains no token. There is no `authSlice` with an `accessToken` field. There is no
`localStorage`.** All of it is:

```ts
// src/lib/api/client.ts — the entire auth surface on the client
async function request(path, init) {
  const res = await fetch(`/api/v1${path}`, { credentials: "same-origin", ...init });
  if (res.status === 401 && !path.startsWith("/auth/")) {
    const refreshed = await fetch("/api/v1/auth/refresh", { method: "POST", credentials: "same-origin" });
    if (refreshed.ok) return request(path, init);   // exactly one silent retry
    router.push(`/login?next=${encodeURIComponent(currentPath)}&reason=expired`);
  }
  return res;
}
```

That is the whole thing: **one retry on 401**. No `Authorization` header, no `setToken()`, no
interceptor chain, no refresh timer.

**On the server (RSC) side, the client does NOT auto-refresh.** This is deliberate and it prevents an
infinite redirect loop:

- `src/lib/api/server.ts` reads `cookies()`, forwards the `Cookie` header, returns the response as-is.
- On `401` from a **public** page (community detail, explore) → treat the viewer as anonymous. Show the
  anonymous CTA. No redirect, no noise.
- On `401` from a **protected** page (`/learn/**`, `/creator/**`, `/admin/**`) → `redirect('/login?next=…&reason=expired')`.
- **The login page, on mount, fires one silent `POST /auth/refresh` before rendering anything.** If it
  succeeds → `router.replace(next)`. If it fails → show the form. This is ~20 lines and it makes the
  expired-session path correct without any cookie-forwarding gymnastics. It is the cleanest available
  resolution of the BFF cookie problem and it should be built, not skipped.

**Login / register / logout** are the only three flows where the frontend does anything special, and even
those are thin: call the endpoint (cookies are set by the server), then `router.replace(next ?? '/learn')`.

### 4.4 Source of truth — the rule that keeps this secure

> **PRD §17: "Do not trust client-provided role, price, ownership, or payment-success fields."**
> Concretely, this table is the enforcement mechanism. The right-hand column is the *only* thing the
> backend ever reads.

| Field the client might try to send | Source of truth | How it's enforced |
|---|---|---|
| `role` on register | `users.role`; `register` accepts only `learner`/`creator` | Pydantic `Literal["learner","creator"]`. `"admin"` → 422. |
| `role` anywhere else | JWT `role` claim, re-validated against the DB row inside the service | Role dependencies query the user; they never read a body field. |
| `is_active` / `email_verified_at` | `users` columns; not in any learner-facing schema | Absent from learner request models entirely. |
| `price_kobo` on payment | `communities.price_kobo` (creator-set, validated at creation) | `POST /communities/{id}/payments` takes an **empty body**. There is no field to spoof. |
| `platform_fee_kobo` | `PLATFORM_FEE_PERCENT` env, frozen onto the payment row at init | Never in any request schema. |
| `creator_id` / `owner_id` | `communities.creator_id`, loaded server-side | Never in any request body. Ownership is a query, not an input. |
| `status: "active"` on an enrollment | `enrollments.status`, mutated **only** by the payment service | Enrollment writes live in exactly one module (`enrollments/activation.py`) that is unreachable from any request handler except the verified payment path. |
| `payment_status: "success"` | `payments.status`, set only after Paystack verification | The string `"success"` appears in exactly one `UPDATE` in the codebase. Grep for it in review. |
| `member_count`, `rating_avg` | Denormalized, server-maintained in the same transaction as the write | Never writable by any endpoint. |

**Additional auth rules:**
- **Ownership checks are always a fresh DB load**, never a client assertion and never a cached claim.
  A mutation handler loads the row and checks `row.creator_id == current_user.id` before touching anything.
- **The admin role is re-read from the database** on every `/admin/*` request. It is 1 extra indexed
  lookup on a handful of endpoints, and it means a demoted admin loses access immediately rather than in
  15 minutes.
- **Login never reveals which field was wrong.** Unknown email and wrong password both return
  `401 INVALID_CREDENTIALS` with an identical body. Enumeration prevention is one line; leave it in.
- **Password reset response is always `202`**, whether or not the email exists.

### 4.5 Next.js route protection — exactly how it works

Three layers. **Only layer 3 is a security boundary**; layers 1–2 are UX. Stating that explicitly is what
prevents a teammate from "fixing" a bypass by tightening middleware instead of the API.

**Layer 1 — `src/middleware.ts` (Edge). A cheap optimistic gate, for redirect UX only.**

```ts
export const config = { matcher: ["/learn/:path*", "/creator/:path*", "/admin/:path*", "/payment/:path*"] };

export function middleware(req: NextRequest) {
  const at = req.cookies.get("ilkt_at")?.value;
  const next = req.nextUrl.pathname + req.nextUrl.search;
  if (!at) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, req.url));
  if (next.startsWith("/admin") || next.startsWith("/creator")) {
    try {
      // jose is Edge-compatible; jsonwebtoken is not.
      const { role } = await jwtVerify(at, new TextEncoder().process.env.JWT_SECRET!);
      if (!next.startsWith("/creator") && role !== "creator" && role !== "admin")
        return NextResponse.redirect(new URL("/learn", req.url));
      if (next.startsWith("/admin") && role !== "admin")
        return NextResponse.redirect(new URL("/learn", req.url));
    } catch { return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, req.url)); }
  }
  return NextResponse.next();
}
```

Notes: the secret is inlined as a `TextEncoder` Uint8Array because `jose` requires bytes, not a string.
Middleware does **not** refresh tokens (see §4.3). If the access token is present but expired, the RSC
fetch will 401 and the login page's silent refresh recovers it.

**Layer 2 — layout guards (server components). Redirects, also UX.**

```ts
// app/(learner)/learn/layout.tsx
export default async function Layout({ children }) {
  const user = await getMe();                       // forwards cookies, no auto-refresh
  if (!user) redirect(`/login?next=${encodeURIComponent("/learn")}&reason=expired`);
  return <AppShell user={user}>{children}</AppShell>;
}
```
Repeat for `app/(creator)/creator/layout.tsx` (`requireRole(["creator","admin"])`) and
`app/(admin)/admin/layout.tsx` (`requireRole(["admin"])`). These helpers live in
`src/lib/api/server-guard.ts` and each one **re-reads the role from the API**, so the layout and the API
agree.

**Layer 3 — the FastAPI dependency. The only real boundary.**

```python
# app/deps.py — one dependency, used by every protected route
async def current_user(creds: HTTPAuthorizationCredentials | None = Depends(oauth2),
                       db: AsyncSession = Depends(get_db)) -> User:
    ...  # verify JWT, load user, reject if user.is_active is False
    return user

def require_roles(*roles: Role):
    async def dep(user: User = Depends(current_user)) -> User:
        if user.role not in roles: raise Forbidden(code="FORBIDDEN_ROLE")
        return user
    return dep
```

Every protected route declares it. `/admin/*` declares `require_roles(Role.ADMIN)`. Feed and classroom
routes additionally declare a `require_membership(community_id)` dependency that raises
**403 `NOT_A_MEMBER`** (ENR-004, FEED-004).

> **Review checklist item:** no route handler may be added without a dependency in its signature. A
> route whose only parameter is a `community_id` is a bug until proven otherwise. This is the single
> highest-value review rule for the backend engineer.

---

## 5. Frontend architecture

> This is the reader's lane. It is deliberately the most concrete section in the document.

### 5.1 Route tree, mapped to PRD §15

`apps/web/src/app/`. **URL scheme: public and learner routes use `slug`; creator and admin routes use
`id`.** Rationale: slugs are pretty and shareable on the discovery surfaces a visitor or learner sees; ids
are stable and never 404 after a rename, which is what you want inside a builder where you are actively
editing titles.

```
app/
├── layout.tsx                     root: fonts, QueryProvider, theme, <Toaster/>
├── (marketing)/
│   └── page.tsx                   §15.1 Landing                      [RSC]
│   └── terms/page.tsx             §22.8 ownership terms (static)     [RSC]
├── (public)/
│   ├── explore/page.tsx           §15.1 Explore / discovery          [RSC shell + client list]
│   ├── search/page.tsx            §15.1 Search results (?q=)         [RSC shell + client list]
│   ├── communities/[slug]/
│   │   └── page.tsx               §15.1 Community detail             [RSC + <EnrollCard>]
│   ├── creators/[slug]/page.tsx   §15.1 Creator profile              [RSC]
│   ├── login/page.tsx             §15.1 Login        [client form, + silent-refresh effect]
│   └── register/page.tsx          §15.1 Register     [client form]
│
├── (learner)/learn/               §15.2 — layout: requireUser()
│   ├── page.tsx                   Learner dashboard                  [RSC]
│   ├── communities/page.tsx       My communities                     [RSC]  ← payment landing
│   ├── profile/page.tsx           Profile                            [client, RHF]
│   └── c/[slug]/
│       ├── page.tsx               Community feed                     [client, infinite Query]
│       ├── classroom/page.tsx     Classroom (course list)            [RSC]
│       └── learn/[courseSlug]/
│           ├── page.tsx           Course outline                     [RSC]
│           └── [lessonId]/page.tsx §15.2 Lesson view                [RSC] ← content in first HTML
│
├── (checkout)/                    §15.2 Payment / enrollment flow — narrow layout
│   ├── enroll/[communityId]/page.tsx   Enrollment CTA + price breakdown   [RSC + client]
│   └── payment/return/page.tsx          Paystack return + <PaymentReturnPoll/>  [client, poller]
│
├── (creator)/creator/             §15.3 — layout: requireRole(["creator","admin"])
│   ├── page.tsx                   Creator dashboard                  [client, 1 request]
│   ├── communities/page.tsx       My communities                     [client]
│   ├── communities/[id]/
│   │   ├── edit/page.tsx          Community management               [client, RHF]
│   │   ├── members/page.tsx       Members                            [client, table + pagination]
│   │   ├── transactions/page.tsx  Revenue                            [client, table + pagination]
│   │   └── courses/page.tsx       Course list + create               [client]
│   ├── courses/[courseId]/
│   │   ├── page.tsx               Course builder (modules)           [client]
│   │   ├── lessons/[lessonId]/page.tsx  §15.3 Lesson editor         [client, RHF]
│   │   └── new-lesson/page.tsx    (or `?lesson=new`)                [client]
│   └── profile/page.tsx           Creator profile + verification     [client, RHF]
│
├── (admin)/admin/                 §15.4 — layout: requireRole(["admin"])
│   ├── page.tsx                   Admin dashboard                    [RSC, 1 request]
│   ├── users/page.tsx             Users                              [client, table]
│   ├── communities/page.tsx       (all communities, incl. drafts)   [client, table]
│   ├── verifications/page.tsx     Creator verification               [client, table + actions]
│   ├── reports/page.tsx            Reports / moderation              [client, table + actions]
│   └── transactions/page.tsx      Transactions                       [client, table]
│
├── not-found.tsx  error.tsx  loading.tsx
└── api/                           ← intentionally almost empty.
    No catch-all proxy route (§3.9 uses `rewrites`). Only, if ever needed:
    `api/health/route.ts` for a frontend-side status widget.
```

**Observation worth acting on:** 6 public + 7 learner + 9 creator + 6 admin pages ≈ 28 routes, and
**§15's 22 required pages are all covered by the above.** The four "extra" routes are the two checkout
routes and `/terms`. Everything maps; nothing is invented.

**Two layout-level details that matter for the demo:**

- `(learner)`, `(creator)`, `(admin)` each render their own `<AppShell>` with role-appropriate nav.
- The classroom subtree gets a **third, distraction-free shell** on mobile: content full-width, outline
  in a `Sheet` (bottom drawer) instead of a sidebar. This is the low-bandwidth and small-screen
  decision detailed in §5.7.

**Navigation after role change:** `POST /creators/apply` returns 201, then the client does
`router.replace("/creator")` and `router.refresh()` (the server layout must re-read the new role).
`useMe()` is reset via `queryClient.setQueryData(qk.me(), …)` from the response, so the header updates
without a refetch.

---

### 5.2 The API client and the type pipeline

```
src/lib/api/
├── client.ts          browser fetch wrapper (§4.3)  — the ONLY place `fetch` is typed
├── server.ts          RSC fetch wrapper (forwards cookies, no auto-refresh)
├── server-guard.ts    requireUser() / requireRole() for layouts
├── errors.ts          class ApiError { code, message, details, status, requestId }
├── money.ts           formatMoney(kobo, currency)   ← the only money formatter in the app
├── query-keys.ts      the qk factory (§5.3)
└── endpoints/         ← the hand-written typed surface, one file per domain
    ├── auth.ts  users.ts  creators.ts  communities.ts  courses.ts
    ├── lessons.ts  posts.ts  enrollments.ts  payments.ts  reviews.ts  admin.ts
src/types/api.d.ts     GENERATED — do not edit
src/lib/validation/   Zod schemas for forms (client-side UX only)
```

#### Type generation from OpenAPI

```jsonc
// package.json
"scripts": {
  "gen:api": "openapi-typescript http://localhost:8000/openapi.json -o src/types/api.d.ts",
  "gen:api:file": "openapi-typescript ./openapi-schema.json -o src/types/api.d.ts"
}
```

`api.d.ts` is **committed** so `tsc` works without a running backend. CI regenerates from the deployed
API and fails the build if the file changed (the contract-freeze guard, §3.1).

**Then, in `src/lib/api/endpoints/`, write ~60 lines of hand-rolled named wrappers:**

```ts
import type { components } from "@/types/api";

type CommunityDetail = components["schemas"]["CommunityDetail"];
type CommunityList   = components["schemas"]["CommunityList"];
type PageMeta        = components["schemas"]["PageMeta"];

export const communitiesApi = {
  list:   (p: CommunityFilters)                     => apiGet<CommunityList>("/communities", { params: p }),
  detail: (slug: string)                            => apiGet<CommunityDetail>(`/communities/${slug}`),
  mine:   (communityId: string)                     => apiGet<EnrollmentSummary>(`/communities/${communityId}/enrollment`),
};
```

**Why hand-written wrappers instead of an OpenAPI client generator (`orval`, `openapi-fetch` codegen, etc.):**

- The generated-client tools produce a `useGetCommunityBySlug()` hook per endpoint, which is *almost* what
  we want — but they force their own cache-key scheme, their own error shape, and their own invalidation
  primitives. Our invalidation graph (§5.3) is the part we most need to control precisely, and it crosses
  domains (a payment mutation invalidates creator-dashboard queries).
- 60 lines of wrapper, written once, is cheaper than debugging someone else's hook semantics at 2am on
  hackathon night.
- The generated **types** are the real win; the generated **client** is not needed at this size.
- *If a second frontend dev joins:* revisit `orval` for the boring CRUD (communities, courses, lessons,
  posts, comments, reviews, members) and keep auth/payments/enrollments/admin hand-written. Do not migrate
  the payment path.

#### Zod: one important caveat

The PRD puts Zod on the frontend and Pydantic on the backend. **They will drift.** That is fine, as long
as the roles are clear:

- **Zod = UX only.** Fail fast before the round trip. Inline field errors while typing.
- **Pydantic = truth.** On a 422, map `error.details[]` onto RHF with `setError`. The server wins,
  always, including when the two disagree.
- **Never** build a form's submit-guard *only* from a client schema and assume the server agrees.

```ts
// lib/api/errors.ts → mapped onto RHF centrally in a <ApiForm> helper
if (err instanceof ApiError) {
  for (const d of err.details) form.setError(d.field.replace(/^body\./, "") as never, { message: d.issue });
}
```

---

### 5.3 Rendering boundaries, query keys, and invalidation

#### The one rule

> **One owner per resource per page.** If an RSC fetched it, Query does not also fetch it. If Query owns
> it, the RSC does not touch it.

Violating this is how you get the duplicate-request problem PRD §9 explicitly calls out, and how you get
"the page says 3 posts, the list says 5" from a stale cache and a fresh fetch racing each other.

**Server-rendered (RSC, `fetch` with `next: { revalidate }`):**

| Route | Why |
|---|---|
| `/`, `/explore`, `/search` | SEO, first-paint on a slow connection, shareable links. The single most valuable low-bandwidth win in the app. |
| `/communities/[slug]` | The demo's "Evaluate" beat. Must paint on a 3G phone. |
| `/creators/[slug]` | Trust signal; SEO. |
| `/learn` and `/learn/communities` | **Server-rendered on purpose**: a hard refresh after payment must show ground truth from the DB, with no cache layer in between. This is the demo's recovery path. |
| `/learn/c/[slug]/classroom`, `…/learn/[courseSlug]`, `…/[lessonId]` | Lesson markdown in the first HTML response. The learner can *read the lesson with JS disabled or still-downloading.* This is the product's core value arriving as text, not as an app. |
| `/admin` | One aggregate request, server-rendered, no client JS needed to see the numbers. |

**Client-fetched (TanStack Query):** everything that is interactive, mutating, polls, or infinite-scrolls —
the feed, comments, the review form, all creator builder screens, members/transactions tables, the
creator dashboard stat cards (pre-warmed post-payment, §5.6), and the payment status poller.

**Notably not using `HydrationBoundary` + `dehydrate()` for the MVP.** It is the "correct" way to
hand RSC data to Query, and it is extra ceremony with a real footgun (two cache layers that can disagree).
A `staleTime` of 30–60 s on Query, plus server rendering of the shell, is enough. Revisit only if the
client-fetched screens feel slow in rehearsal.

#### The `EnrollCard` — the one client island on a public page

The community page is a server component. It reads cookies server-side and calls
`GET /communities/{id}/enrollment` **during SSR** when a session exists, then passes the result down:

```tsx
// app/(public)/communities/[slug]/page.tsx   [RSC]
const community = await getCommunity(slug);
const enrollment = await getEnrollmentOrNull(community.id);   // null on 401, no redirect
return <EnrollCard community={community} enrollment={enrollment} />;
```

**Zero client round trips for the CTA.** `EnrollCard` is a client component that takes props, renders the
correct CTA from `community.can_enroll` + `community.enrollment.status`, and owns only the *click
transition* into the payment route. This is better than fetching enrollment state client-side: it's
faster, it's correct on first paint, and it can't flash "Enroll — ₦5,000" at a user who is already a member.

#### Query keys

```ts
// src/lib/api/query-keys.ts
export const qk = {
  me:              () => ["me"] as const,

  communities:     (f: CommunityFilters)   => ["communities","list",f] as const,
  community:       (slug: string)          => ["communities","detail",slug] as const,
  enrollment:      (cid: string)           => ["communities",cid,"enrollment"] as const,
  myEnrollments:   (f: MyEnrollmentFilters) => ["enrollments","mine",f] as const,

  courses:         (cid: string)           => ["courses","by-community",cid] as const,
  course:          (cid: string, courseId: string) => ["courses","detail",cid,courseId] as const,
  lessons:         (courseId: string)      => ["lessons","by-course",courseId] as const,
  lessonProgress:  (courseId: string)      => ["lessons","progress",courseId] as const,

  posts:           (cid: string)           => ["posts","by-community",cid] as const,
  comments:        (postId: string)        => ["comments","by-post",postId] as const,

  payment:         (reference: string)     => ["payments","status",reference] as const,
  myPayments:      (f: MyPaymentFilters)   => ["payments","mine",f] as const,

  reviews:         (cid: string)           => ["reviews","by-community",cid] as const,

  creatorDashboard:()                      => ["creator","dashboard"] as const,
  members:         (cid: string, f: MemberFilters)   => ["creator","members",cid,f] as const,
  transactions:    (cid: string, f: TxnFilters)     => ["creator","transactions",cid,f] as const,

  adminDashboard:  ()                      => ["admin","dashboard"] as const,
  adminUsers:      (f: AdminUserFilters)   => ["admin","users",f] as const,
  adminVerifications: (f: VerificationFilters) => ["admin","verifications",f] as const,
  adminReports:    (f: ReportFilters)      => ["admin","reports",f] as const,
  adminTransactions: (f: TxnFilters)       => ["admin","transactions",f] as const,
};
```

**Filter objects live inside the key** (`communities("list", f)`), so changing a filter is a different cache
entry and back/forward navigation restores the previous page from cache for free.

Defaults: `staleTime: 30_000` for lists, `60_000` for dashboard aggregates, `0` for the payment poller
(§5.6). `retry: 1` for GETs, **`retry: 0` for all mutations** — retrying a `POST` risks a double payment
initialization. There is a server-side guard for that (§6.2), but the client should not lean on it.

#### Invalidation & mutation strategy

| Mutation | Optimistic? | Invalidate on success | Extra |
|---|---|---|---|
| `login` / `register` | — | — | `router.replace(next)`; `qc.setQueryData(qk.me(), user)` |
| `logout` | — | `qc.clear()` | `router.replace("/")` |
| `enrollFree` | ✅ optimistic set `enrollment = active` on `community` | `community(slug)`, `enrollment(cid)`, `myEnrollments()`, `creatorDashboard()` | Rollback on error. Then `router.push('/learn/c/'+slug)` |
| `initializePayment` | ❌ | `payment(reference)` only | **Nothing else changes yet** — don't invalidate the world; the price on screen is still correct |
| **payment → success** | ❌ | `community(slug)`, `enrollment(cid)`, `myEnrollments()`, `creatorDashboard()`, `members(cid)`, `transactions(cid)` | **Then `router.replace('/learn/c/'+slug+'?welcome=1')`.** The creator-dashboard invalidation is deliberate: it pre-warms the data for the demo's creator beat so the switch is instant |
| `createPost` | ✅ **optimistic append** (temp id, `pending: true`) | `posts(cid)`, `community(slug)` (activity preview + counts) | The "Engage" beat must feel instant. Reconcile by replacing the temp item with the server item |
| `createComment` | ✅ optimistic append | `comments(postId)`, `posts(cid)` (comment_count) | |
| `createReview` / `updateReview` | ❌ | `reviews(cid)`, `community(slug)` (rating aggregate) | Show a success toast; no optimistic rating math |
| `saveCommunity` | ❌ | `community(slug)`, `communities(f)`, `creatorDashboard()` | |
| `publishCommunity` | ❌ | `community(slug)`, `communities(f)`, `creatorDashboard()` | On 409 `NOTHING_TO_PUBLISH`, set the blockers list into local state and show the checklist — **do not** invalidate |
| course / module / lesson CRUD | ✅ optimistic for `position` reordering | `courses(cid)`, `course(cid,id)`, `lessons(courseId)`, `lessonProgress(courseId)` | Reorder via ↑/↓ buttons, **not drag-and-drop** (§5.5) |
| `completeLesson` | ✅ optimistic | `course(cid,id)` (progress), `lessonProgress(courseId)`, `myEnrollments()` | Idempotent upsert server-side, so a double-tap is harmless |
| admin actions (verify/reject, suspend, resolve report) | ❌ | the relevant `admin*` list + `adminDashboard()` | |

**Why optimistic updates only on the feed and comments:** those are the two beats in the demo script
(§24, "Engage") where a 400 ms round trip on a phone is visible. Everything else is fast enough to wait
for, and optimistic UI is a bug source when the server can reject (`NOT_A_MEMBER`, `ALREADY_REVIEWED`).

---

### 5.4 Zustand — what genuinely needs it, and what must not

**One store. Here is the entire justification.**

```ts
// src/stores/payment-flow.store.ts
type PaymentFlowState = {
  reference: string | null;
  communitySlug: string | null;
  state: "idle" | "initializing" | "redirecting" | "polling" | "success" | "failed" | "timed_out";
  startedAt: number | null;
  attempts: number;
  set: (p: Partial<PaymentFlowState>) => void;
  reset: () => void;
};
create<PaymentFlowState>()((set) => ({
  reference: null, communitySlug: null, state: "idle", startedAt: null, attempts: 0,
  set: (p) => set(p), reset: () => set({ reference: null, communitySlug: null, state: "idle", startedAt: null, attempts: 0 }),
}));
```

**Why this one earns a global store:** it is (a) written by a route in one tree (`/enroll/[id]`), read by
a route in another tree (`/payment/return`), (b) genuinely ephemeral UI state with no server equivalent,
(c) needed across a full-page navigation that destroys React state, and therefore (d) **persisted to
`sessionStorage`** so a mid-payment refresh resumes the poll. No other piece of state in Interlekt has
that combination.

A second, trivial store: `useUiStore` — sidebar collapsed, mobile nav open, feed filter tab
(`localStorage`).

### What must **not** go in Zustand

| State | Correct home | Why |
|---|---|---|
| Current user / role | **`useMe()` = TanStack Query** | It is server state. It changes behind your back (admin suspends you), and Query gives refetch-on-focus and a single dedupe point for the 4 components that need it. |
| Community list, feed, comments, dashboard numbers | **Query** | Server state, full stop. |
| Search text, category filter, sort order, page number | **URL `searchParams` (via `nuqs`)** | Must be shareable, bookmarkable, and survive back/forward. A store makes "back" broken — a bug users notice immediately. Install `nuqs`; it's ~2 KB and makes typed URL state genuinely pleasant. |
| Form field values | **React Hook Form** | Not global, ever. |
| Whether the payment modal is open | **Local `useState`** | It doesn't outlive its component. |
| Lesson draft text | **RHF** (with `sessionStorage` draft if you want crash-recovery on the lesson editor) | |
| Feed "load more" cursor/page | **Query's own `useInfiniteQuery` page param** | |
| Toasts | **`sonner`** | |
| Enrollment status | **The server, via `community.enrollment` / `enrollment(cid)`** | **Never cached client-side as an authority.** The whole §14.3 rule. |

> **Rule of thumb to write at the top of `stores/`:** *"If the value can be `SELECT`ed out of the
> database, it belongs in TanStack Query, not Zustand. Zustand is for things the database has never
> heard of."*

---

### 5.5 Components, media, and the "don't build this" list

#### shadcn/ui — install exactly this, once, at project init

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label textarea badge avatar dropdown-menu sheet \
  separator select tabs table skeleton dialog alert-dialog alert checkbox switch \
  accordion tooltip popover progress toast sonner
```

Then `npx shadcn@latest add chart` **only if** someone insists. See below.

| Screen group | Components used |
|---|---|
| Discovery / cards | `card`, `badge`, `avatar`, `button`, `skeleton`, `hover-card` (creator preview on a card) |
| Community detail | `card`, `badge` (verified / free / price), `accordion` (curriculum preview), `popover` (price + fee breakdown), `button`, `separator`, `tooltip` |
| Enrollment / checkout | `card`, `button`, `alert` (errors), `badge`, `loader` (via `button` `loading` prop) |
| Post-payment return | `card`, `alert`, `button`, `progress` (fake progress bar while polling) — **this screen is 3 states, not a spinner** |
| Classroom / lesson | `sheet` (outline drawer on mobile), `accordion` (outline), `button` (prev/next/complete), `progress`, `badge` (locked) |
| Feed | `card` (post), `avatar`, `textarea` (composer), `button`, `dropdown-menu` (edit/delete/pin/report), `badge` (announcement) |
| Reviews | `card`, `button` (1–5 star — **hand-build**, 5 buttons + `Star` icons; do NOT pull a rating library), `textarea`, `alert` |
| Creator builder | `form` (RHF), `input`, `textarea`, `label`, `select`, `switch` (publish toggles), `button`, `card`, `dialog` + `alert-dialog` (delete confirmations), `badge` (draft/published/archived), `table` (members, transactions) |
| Admin | `tabs`, `table`, `badge`, `button`, `alert-dialog`, `card` (stat tiles), `input` (search) |
| Global feedback | `sonner` (toasts), `sheet` (mobile nav), `dropdown-menu` (avatar menu), `skeleton` (all loading states) |

**Hand-build these four — do not pull a library:**

1. **`<StatCard>`** — label, big kobo-formatted number, delta, optional sub-line. ~30 lines, reused on the
   creator dashboard, the admin dashboard, and the community revenue page. The creator dashboard is
   *four* stat cards and a members table. That is the whole "Revenue tracking" P0 feature.
2. **`<PageNav>`** — prev/next + "Page 2 of 7" driven by the `page` envelope (§3.2). shadcn's `pagination`
   is coupled to `<Table>`; we need it above cards too. ~25 lines.
3. **`<StarRating>`** — display (read-only, from `rating.avg`) and input (5 buttons, RHF-controlled).
   ~40 lines total. A rating library is ~15 KB of JS for something we show four times.
4. **`<MoneyAmount>`** — `formatMoney(kobo, currency)` + optional `+ fee` breakdown line.

**Explicitly do NOT add:** `recharts` / any chart library (the revenue page is a number and a bar list;
a chart bundle is 100+ KB of JS on the exact audience in §9/§21), `dnd-kit` (use ↑/↓ buttons for module
and lesson ordering — drag-and-drop on a low-end Android is a bad demo risk for a feature nobody tests),
`cmdk`/command palette, the shadcn `sidebar` component (three nav layouts don't need it), a date library
(`Intl` is built in), a form-builder, a table library (TanStack Table for two tables is overkill —
`useState` for sort + the `page` envelope for paging is enough).

#### Media — the smallest thing that works

**Avatars and cover images are URL fields, not uploads.**

- `creator_profiles`, `communities`, `users.profiles` each have `avatar_url` / `image_url` (`TEXT`).
- The creator/community form has a text input for a URL **plus** an "Upload" button that hits
  **Cloudinary's unsigned upload preset** directly from the browser and writes the returned `secure_url`
  into the field.
- The unsigned preset means **no backend upload endpoint, no file validation code, no S3 bucket, no
  multipart parsing, and no secret in the browser** — Cloudinary's unsigned preset is a designed,
  supported pattern for exactly this.

```ts
// src/lib/media.ts — ~20 lines, the entire upload path
async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);   // unsigned preset name — not a secret
  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: fd });
  if (!r.ok) throw new Error("Upload failed");
  return (await r.json()).secure_url as string;
}
```

Still honour PRD §17's intent: client-side type check (`image/*`) and size cap (**≤ 4 MB**) before
upload, and Cloudinary's own `allowed_formats` / `max_file_size` on the preset as the server-side gate.

Every image field is stored as a **single URL string with the transformation baked in**:

| Variant | Transform | Used by |
|---|---|---|
| `thumb` | `w_400,h_400,c_fill,g_auto,q_auto,f_auto` | Every card, list row, avatar, admin table |
| `card` | `w_800,h_450,c_fill,g_auto,q_auto,f_auto` | Community card in Explore |
| `hero` | `w_1200,h_600,c_fill,g_auto,q_auto,f_auto` | Community detail hero, landing hero |

The API returns **`image_thumb_url` and `image_url`** on community shapes, pre-transformed. The frontend
never builds a Cloudinary URL by string concatenation and never requests a 2 MB original to render a
400 px card. **This is the single biggest bandwidth lever in the app** and it costs one column.

`next/image` config: `formats: ['image/avif','image/webp']`, `sizes` set on every `<Image>`,
`loading="lazy"` by default with `priority` on **exactly two images in the whole app** (the landing hero
and the community-detail hero — the LCP element).

---

### 5.6 The post-payment UX flow — concrete state machine

**This is the highest-risk surface in the demo. Implement it exactly like this.**

Route layout: `/enroll/[communityId]` (the CTA + breakdown) → full-page redirect to Paystack →
`/payment/return?reference=…&status=…` (a client component that polls).

```
┌──────────────┐
│    IDLE      │  /enroll/[communityId] — RSC reads community + enrollment server-side.
│              │  Shows: title, price, "Platform fee ₦500" + "Creator receives ₦4,500",
│              │        what you get (curriculum summary), [ Pay ₦5,000 ]
└──────┬───────┘
       │ click "Pay"                     (free community: [ Join community ] → POST enrollments)
       ▼
┌──────────────┐
│ INITIALIZING │  POST /communities/{id}/payments   →  201 PaymentInit
└──────┬───────┘
       │  402           → the community is free → call POST enrollments → SUCCESS (free path)
       │  409 ALREADY_ENROLLED → jump straight to SUCCESS with the returned enrollment
       │  409 PAYMENT_IN_FLIGHT → reuse the returned reference → REDIRECTING
       │  5xx / timeout → back to IDLE + <Alert> with a Retry button
       ▼
┌──────────────┐
│ REDIRECTING  │  window.location.assign(authorization_url)
└──────┬───────┘
       │  ── full page, off our origin, onto Paystack ──
       ▼
┌──────────────┐
│  RETURNED    │  /payment/return?reference=R&status=success|failed|abandoned
└──────┬───────┘
       │  ⚠ status=success IS IGNORED FOR LOGIC. It selects copy only. (PRD §14.3)
       │  status=abandoned / missing → FAILED (cancelled)
       │  persist {reference, state:"polling", startedAt} → sessionStorage
       ▼
┌──────────────┐
│   POLLING    │  useQuery(qk.payment(reference), { refetchInterval })
└──────┬───────┘
       │  state=pending  → <PaymentPending/>   "Confirming your payment…"
       │  state=success  → <PaymentSuccess/>   hold ~1.2 s, then navigate
       │  state=failed   → FAILED
       │  > 60 s elapsed → TIMED_OUT
       ▼
┌──────────────┐
│   SUCCESS    │  invalidate 6 keys (§5.3) → router.replace(`/learn/c/${slug}?welcome=1`)
└──────────────┘  → feed renders a "Welcome to X 🎉" banner
       │
       ├──► FAILED     → reason + [Try again] (new reference) + [Message creator]
       └──► TIMED_OUT  → "We haven't received confirmation yet. Your payment is being
                        verified — please do not pay again." + [Check again] + [My communities]
```

**The polling contract, precisely:**

```ts
useQuery({
  queryKey: qk.payment(reference),
  queryFn: () => paymentsApi.status(reference),
  refetchInterval: (q) => {
    const elapsed = Date.now() - (startedAt ?? Date.now());
    if (q.state.data?.state !== "pending") return false;   // stop the moment it's terminal
    if (elapsed > 60_000) return false;
    return elapsed < 15_000 ? 2_000 : 5_000;               // fast burst, then relax
  },
  refetchIntervalInBackground: false,   // default — pause when the tab is hidden (matters on phones)
  refetchOnWindowFocus: true,           // re-check the instant the user comes back from Paystack
  retry: 2,
  staleTime: 0,
});
```

**Why these numbers:** Paystack's webhook typically lands in 1–5 s, so a 2 s interval usually resolves
within the first three polls and the learner sees a success screen in about two seconds. The 5 s tail and
the 60 s ceiling cover a slow network without hammering the API. `refetchIntervalInBackground: false`
plus `refetchOnWindowFocus: true` is the specific pair that handles **"user switched to their banking app
and came back"** — the dominant real-world Nigerian payment pattern, and the one most likely to happen
mid-demo.

**Resume-after-refresh (≈15 lines, build it):** on app mount, if `sessionStorage` holds a `polling`
payment, restart the poll. Covers the user closing the tab mid-payment and returning ten minutes later.
*This is also your demo-day insurance: if the projector/browser does something unexpected, the state
machine picks itself back up.*

#### Five anti-patterns, written down so nobody "fixes" them into bugs

```ts
// ❌ 1. NEVER. This is a PRD §14.3 violation and it is a security bug, not a style choice.
//        ?status=success is attacker-controllable and arrives before any verification.
if (searchParams.status === "success") setEnrolled(true);

// ❌ 2. NEVER. Price comes from the API response. There is no price in the URL.
if (searchParams.amount === "0") showFreeBanner();

// ❌ 3. NEVER. Access is a server assertion, never a client-derived flag.
if (userHasPaid) renderClassroom();

// ❌ 4. AVOID. router.refresh() re-renders but re-populates the same caches — the
//        next client navigation goes stale again. Use queryClient.invalidateQueries.
router.refresh();

// ❌ 5. NEVER store these anywhere durable.
localStorage.setItem("payment", JSON.stringify({ access_code, amount, status }));
```

**Correct summary of the rule:** *the return page's only job is to ask the server "did I pay?" and show
what it says.*

#### The three screens you must not get wrong

1. **`/enroll/[id]`** — the price breakdown comes entirely from `community.platform_fee_kobo` and
   `community.pricing`. **Hardcoding a fee percentage here is forbidden**; if the platform fee changes,
   the API response changes and this screen is correct with no deploy. (This is what makes open decision
   #3 non-blocking — §7.)
2. **`/payment/return`** — three explicit states (pending / success / failed-or-timed-out), never a bare
   spinner. A stuck spinner reads as "broken" to a judge.
3. **`/learn/c/[slug]`** — the redirect target. The `?welcome=1` banner is what makes the demo's "Access"
   beat land. It reads from the server-rendered enrollment, not from a client flag.

---

### 5.7 Mobile-first and low-bandwidth strategy

PRD §9 ("responsive and mobile-first") and §21 ("poor mobile UX" is a named risk) for the Nigeria /
low-bandwidth market. This is a design constraint, not a nice-to-have.

**Target device assumption: a mid-range Android on 3G/EDGE, often inside a WhatsApp or Instagram in-app
webview.** Assume ~400 kB/s and ~1.5 s round trips to an EU-hosted origin. That assumption drives
everything below.

| Lever | Decision |
|---|---|
| **Layout** | Design at 375 px first, every screen. Desktop is the easy direction. Classroom outline lives in a `sheet` below `lg:`; nav in a `sheet`; the enroll CTA is a **sticky bottom bar** on mobile (44 px min touch target). |
| **Image weight** | The dominant byte cost. `image_thumb_url` on every card and list row (400 px, `f_auto`), `image_url` hero only. `next/image` + AVIF/WebP. `priority` on exactly two images. **Never ship an original to a card.** |
| **Lesson content** | Server-rendered markdown → the lesson text is in the first HTML response. A learner on a bad connection can *read the lesson* before a single byte of JS executes. This is the product's core value and it must not be behind a client fetch. |
| **Video** | **"Tap to load" poster.** Render a `loading="lazy"` poster image with a play affordance; only mount the YouTube/Vimeo iframe (or `<video>` for `mp4`) on click. **No autoplay, no preload.** An auto-loading iframe on a 400 kB/s connection will make the demo look broken at the exact moment you are trying to show the "Learn" beat. |
| **JavaScript budget** | Keep client components small and leaf-most. `next/dynamic` for the feed composer and the payment poller. shadcn tree-shakes, but Radix is not free — the shortlist in §5.5 is chosen to stay modest. No chart library, no dnd, no command palette (§5.5). |
| **Payload size** | `limit` default 20 / max 50. Post `body` truncated to 280 chars in list responses. `GZipMiddleware`. Column-level `select` in list queries — no `SELECT *` in any list endpoint, so a post row never drags `user.email` and `users.password_hash` into a public payload. |
| **HTTP caching** | `public, max-age=60, stale-while-revalidate=300` on public GETs; `no-store` on authenticated ones. `Cache-Control` is set in FastAPI; Vercel's CDN does the rest. |
| **Perceived speed** | Optimistic post + comment append (§5.3). Skeletons shaped like the real content. `sonner` confirmations. The optimistic feed is what makes "Engage" feel like a product rather than a demo. |
| **PWA-lite** | `manifest.webmanifest` + icons + a custom install prompt. Real value on a metered Nigerian connection (install once, relaunch without re-downloading the shell). **No offline sync, no service-worker caching of API responses** — that is a V1 project and a cache-invalidation minefield. |
| **Payment** | Full-page redirect, **not** a popup (in-app webviews block popups) and **not** a new tab. `window.location.assign()` only. |
| **Forms** | Numeric keyboards: `<Input inputMode="numeric" type="tel">` for phone/amount fields. Autocomplete attributes on email/password. `autoComplete="one-time-code"` on any OTP field. |
| **Rehearsal (non-negotiable)** | Before the demo: run the whole §24 script on a real mid-range Android, with Chrome DevTools remote debugging + **"Slow 3G" and 4× CPU throttling**. Also run it once inside the WhatsApp in-app browser. Any fix found here is worth ten found on a laptop. |

---

## 6. Payment flow (end-to-end)

**The single most important flow in the product. PRD §14.3 is the governing constraint:**

> Never grant paid access based only on frontend success state · Verify payment server-side · Persist
> provider transaction/reference IDs · Handle repeated webhook notifications safely · Keep payment and
> enrollment state consistent.

### 6.1 The sequence

```
 LEARNER (browser)        NEXT.JS                    FASTAPI                    PAYSTACK            POSTGRES
      │                     │                          │                          │                    │
 1    │ click "Pay ₦5,000"  │                          │                          │                    │
      │──POST /api/v1/communities/{id}/payments──────▶│                          │                    │
      │                     │                          │ BEGIN                   │                    │
      │                     │                          │ load community           │                    │
      │                     │                          │ price_kobo = 500000 ◀────── (price from DB,     │
      │                     │                          │                          │     never client)   │
      │                     │                          │ INSERT payment           │                    │
      │                     │                          │  status=initialized      │                    │
      │                     │                          │  reference="ilk_xxx"     │                    │
      │                     │                          │  fee = 50000 (frozen)    │                    │
      │                     │                          │  creator = 450000        │                    │
      │                     │                          │─────POST /transaction/initialize──▶│          │
      │                     │                          │◀──── authorization_url ───────────────│          │
      │                     │◀──201 {reference, authorization_url, …}──────────────────────────────│      │
 2    │◀──window.location.assign(authorization_url)───  PAYMENT PAGE (Paystack domain)  │          │
      │══════════════════════ browser leaves the app ══════════════════════════════════▶│          │
      │                     │                          │                          │                    │
 3    │  (learner pays — card or bank transfer)        │                          │                    │
      │                     │                          │◀────── POST /webhooks/paystack (charge.success) │
      │                     │                          │  x-paystack-signature =  │                    │
      │                     │                          │  HMAC-SHA512(raw_body)   │                    │
      │                     │                          │  ① verify signature      │                    │
      │                     │                          │  ② BEGIN                 │                    │
      │                     │                          │  ③ SELECT … FOR UPDATE   │                    │
      │                     │                          │     status==success? ────▶ REPEAT ⇒ no-op, 200
      │                     │                          │  ④ amount/currency match?│                    │
      │                     │                          │  ⑤ UPDATE payment        │                    │
      │                     │                          │       status=success     │                    │
      │                     │                          │  ⑥ UPSERT enrollment ──────────────────────▶│
      │                     │                          │       status=active      │                    │
      │                     │                          │  ⑦ member_count += 1     │                    │
      │                     │                          │  ⑧ COMMIT ─────────────────────────────────▶│
      │                     │                          │──── 200 ─────────────────▶│                    │
      │                     │                          │                          │                    │
 4    │◀──── 302 to callback_url = /payment/return?reference=ilk_xxx&status=success ──────│
      │───── GET /payment/return ──▶ (client component starts polling)  │          │       │
      │                     │                          │                          │                    │
 5    │──GET /payments/ilk_xxx/status (every 2s)──────▶│                          │                    │
      │                     │                          │ status==success?  yes ──▶ return immediately   │
      │                     │                          │                          │        (no upstream  │
      │◀──200 {state:"success", enrollment:{…}, community:{…}}──────────────────────────────── call)
      │  (if the webhook hasn't landed: this call itself does ③–⑧ with
       Paystack's verify API. Same code path. This is the safety net.)
      │
 6    │──invalidate 6 query keys──▶ router.replace('/learn/c/{slug}?welcome=1')
      │
 7    │──open classroom, read a lesson, post + comment──▶
      │
 8    │  [demo switches to the creator account]
      │──GET /creator/dashboard──────────────────────▶ (already warm from the step-6 invalidation)
      │                                             shows: +1 member, +1 paid member,
      │                                             ₦5,000 gross, ₦500 platform fee, ₦4,500 creator
```

**Step 3 and step 5 are the same code path.** Write one function —
`payments.settle(reference, provider_payload)` — and call it from both the webhook handler and the status
endpoint. Two implementations of "grant access" is precisely how this class of bug is born.

### 6.2 Idempotency — three independent layers

Payment correctness for a hackathon rests on three cheap mechanisms. All three are required; each covers
a failure the others don't.

**Layer 1 — Client-side double-tap guard (server).**
`POST /communities/{id}/payments` reuses an in-flight payment: if the requesting user already has a payment
row for this community with `status IN ('initialized','pending')` and `created_at > now() - 15 minutes`,
return **200** (not 201) with that row's `reference` and `authorization_url` instead of creating a new one.
Five lines, no table, no middleware. A learner who double-taps (or a flaky connection that retries) gets
one payment, not two.

> **Client-side:** the button is disabled during `INITIALIZING` and mutations use `retry: 0` (§5.3).
> The server guard is the backstop, not the plan.

**Layer 2 — Webhook idempotency (transaction + row lock).**

```python
async def settle(db: AsyncSession, reference: str, data: dict) -> None:
    async with db.begin():                              # one transaction for the whole grant
        payment = (await db.execute(
            select(Payment).where(Payment.reference == reference).with_for_update()
        )).scalar_one_or_none()
        if payment is None:            return "ignored"       # unknown reference → 200, log it
        if payment.status == "success": return "duplicate"    # ← the idempotency check
        if data["amount"] != payment.amount_kobo:              # ← never trust the amount
            payment.status = "failed"; payment.failure_reason = "amount_mismatch"
            return "amount_mismatch"                          # DO NOT grant access
        if data["currency"] != payment.currency:  return "amount_mismatch"
        await activate_enrollment(db, payment)                 # §6.3
        payment.status    = "success"
        payment.provider_reference = data["reference"]
        payment.paid_at   = now()
    return "settled"
```

`with_for_update()` serialises concurrent deliveries of the same event. The `status == "success"` early
return makes the second and subsequent deliveries free no-ops. **Paystack retries failed webhooks, and a
network blip during a demo will cause one.** This must be correct.

**Layer 3 — Database uniqueness (the backstop).**

```sql
UNIQUE (provider, provider_reference)   -- on payments
UNIQUE (user_id, community_id)          -- on enrollments
```

If a bug ever lets two settle paths through, the constraint turns a double-grant into a `IntegrityError`
inside the transaction — a failed request, not corrupted state. Belt, braces, and a rollback.

**Response codes for the webhook handler — get this right:**
- Verified signature + known event, settled or duplicate or ignored → **200**.
- Verified signature + unhandled event type → **200** (do not make Paystack retry something you'll never handle).
- Verified signature + amount mismatch → **200** (record the failure + Sentry alert; retrying won't help).
- **Invalid/missing signature → 401.** This is the one case that should not be 200.
- Unparseable body → **400**.

Returning 200 for everything you understand is what stops Paystack's retry queue from becoming a
source of duplicate-settlement pressure on demo day.

### 6.3 `activate_enrollment` — the only place access is granted

```python
async def activate_enrollment(db, payment) -> None:
    """The ONLY function in the codebase permitted to set an enrollment to active for a paid community."""
    enr, created = await upsert_enrollment(
        db, user_id=payment.user_id, community_id=payment.community_id,
        defaults=dict(status="active", access_level="paid",
                      amount_paid_kobo=payment.amount_kobo, currency=payment.currency,
                      payment_reference=payment.reference, activated_at=now()),
    )
    if created:
        await db.execute(update(Community)
            .where(Community.id == payment.community_id)
            .values(member_count=Community.member_count + 1))
```

- **Upsert, not insert.** A learner who somehow already has a row gets flipped to `active`, not a
  constraint violation. Handles the "re-enroll after a cancelled row" case for free.
- **`member_count` is a denormalized counter** updated in the same transaction. It exists because
  `COUNT(*)` over enrollments on every Explore page is the wrong query at scale and we want the index-free
  read. *Accepted trade-off: the counter can drift if a row is ever hard-deleted. Nothing hard-deletes
  enrollments — cancellation sets a status — so in practice it cannot. A nightly
  `recompute_member_counts()` script is 10 lines and is a nice-to-have, not a need.*
- **This function lives in `payments/`, not in a route handler.** The only two callers are the webhook
  handler and the status endpoint — both of which have already verified with Paystack. There is no
  request path that reaches it without verification. That is the architecture, not a convention.

**Free enrollment uses a different, trivially-safe function** (`enroll_free`, in `enrollments/`) because
there is no money to verify. Two functions, not one function with a `verified: bool` flag — the flag is
exactly the thing someone would eventually set to `True` from a request body.

### 6.4 Platform fee (PAY-006)

**Config:** one environment variable. `PLATFORM_FEE_PERCENT=10`. Read once at startup into settings.

**Calculation — integer kobo, no floats, ever:**

```python
amount_kobo   = community.price_kobo              # int, from the DB
platform_fee  = round(amount_kobo * FEE_PERCENT / 100)   # int
creator_share = amount_kobo - platform_fee                 # int; derived, never independently computed
```

`500000 → fee 50000, creator 450000`. Displayed as "₦5,000 · ₦500 platform fee · ₦4,500 to creator".

**Three rules that matter:**

1. **The fee is computed once, at payment-initialize time, and frozen onto the payment row**
   (`platform_fee_kobo`, `creator_amount_kobo`). Changing `PLATFORM_FEE_PERCENT` next month must not
   retroactively rewrite last month's revenue numbers — the creator dashboard sums the *frozen* columns,
   never recomputes from the current rate. This is the difference between an accounting system and a
   calculator.
2. **`creator_amount_kobo` is derived, not independently set.** One source of truth means the two columns
   can never disagree.
3. **The fee is never in a request body, and the frontend never computes it.** `GET /communities/{slug}`
   and `POST /communities/{id}/payments` both return the breakdown; the checkout screen renders it. *This
   is what makes open decision #3 (§7) non-blocking for the frontend.*

**Paystack's own charge** (≈1.5% + ₦100, capped) is a separate line item. Read it from
`data.fees` in the verify response and store it as `provider_fee_kobo` when present. Show it in the
creator's transaction detail as *"Paystack processing fee"* so creators aren't surprised. **Do not subtract
it from `creator_amount_kobo` in the MVP** — creator payouts are a V1.5 concern (§20) and the demo's
number should be the clean, obvious "₦4,500 to creator".

**Recommended default for the demo: 10%.** Round, memorable, and the kind of number that doesn't need a
decision memo. Change the env var if the team disagrees — nothing in the code changes.

### 6.5 Rehearsal checklist (the demo-day runbook)

1. Paystack **test mode** keys (`sk_test_…`) in dev, **live** keys in prod. Two `.env` files, and assert
   `PAYSTACK_IS_LIVE` matches the key prefix at startup — fail loudly on a mismatch rather than silently
   creating real charges.
2. Register the webhook URL `https://api.interlekt.app/api/v1/webhooks/paystack` in the Paystack
   dashboard. **Register it in test mode AND live mode, separately.** Do this at least a day before the
   demo.
3. Test card for rehearsal: `4084 0840 8408 4081`, any future expiry, CVV `408`, OTP `000000`.
   Also rehearse one **bank transfer** and one **USSD** flow — the demo audience will ask "what about
   people without cards?", and being able to answer with a working USSD flow is a strong moment. (For the
   live demo itself, use the card flow: it is faster and the webhook fires immediately.)
4. **Rehearse the webhook-failure path deliberately.** Disable the webhook in the Paystack dashboard, pay,
   and confirm the frontend still succeeds via the `GET /payments/{ref}/status` fallback (§3.8). If that
   fallback works with the webhook off, your demo cannot lose to a payment-infrastructure problem.
5. Run the full §24 script end-to-end at least twice, on the throttled mid-range Android (§5.7).
6. Keep a **second seeded creator account logged in** in a separate browser profile, so the switch to the
   creator dashboard is instant and never involves a login form on stage.
7. Have a **pre-paid, already-enrolled learner account** as the fallback if anything stalls: open the
   classroom and the feed directly and narrate. The loop is proven; a payment outage should not stop the
   story.

---

## 7. Open decisions (PRD §22)

Nine unresolved product questions. For each: **what this design assumes**, and whether it **blocks
frontend work**.

The general principle applied throughout: **whenever a decision can be pushed to the backend as a value
in an API response, it stops blocking the frontend.** I did that three times below (fee, currency,
pricing model), which is why only two of the nine actually block.

| # | PRD §22 question | Assumption in this design | Blocks frontend? |
|---|---|---|---|
| 1 | What criteria qualify a creator as verified? | Enum `unverified → pending → verified \| rejected`. Creator self-submits one `evidence_url` + a short statement (a LinkedIn profile, a notable project, a company). No document upload, no ID scanning, no automated checks. Admin approves/rejects with a note. | **No** — but the `verification_status` field must exist on `CreatorProfile` from day one, because it renders on the public creator page and the community page (§24 "evaluates… verification"). *Schema/API: now. Submission UI: P1.* |
| 2 | Subscriptions, one-time, or both? | **RESOLVED — the community owner picks, at creation time.** `communities.billing_period ∈ {one_time, monthly}` (default `one_time`), set by the creator when creating/editing a community. The frontend renders whatever the API returns — it never hardcodes a pricing model. This matches Skool's five-model flexibility (free / subscription / freemium / tiered / one-time) and removes the last blocking question. **Free** is `price_kobo = 0`. **Freemium** is a free community plus a paid tier — deferred to V1.5 (needs a `tiers` table). **Tiered** (multiple paid plans per community) is deferred to V1.5. | **No longer blocking.** The checkout UI branches on `billing_period`: `one_time` → single charge, CTA "Enroll now"; `monthly` → recurring, CTA "Subscribe". Both share the same Paystack initialize → verify → activate path. Schema note: `billing_period` ships in the initial migration. |
| 3 | What platform fee will Interlekt charge? | `PLATFORM_FEE_PERCENT=10`, env-configurable, frozen onto each payment. | **No** — by design. The API returns `platform_fee_kobo` and `creator_amount_kobo` on both `GET /communities/{slug}` and `POST /communities/{id}/payments`. **The frontend renders, never calculates.** The `%` itself is a backend env var and can be changed on demo day with a redeploy. |
| 4 | Direct payouts or Interlekt-managed payouts? | **No payouts in the MVP.** The creator dashboard shows "attributed revenue" — gross, platform fee, creator share — plus a clear *"Payouts coming soon"* note. PRD §20 already places "creator payouts" in V1.5, which settles it. | **No.** |
| 5 | Nigeria-only or Africa-wide for the hackathon? | **Nigeria only. NGN only.** No geofencing, no country allowlist. | **No** — with one rule: the money formatter **reads `currency` from the API**, it never hardcodes `₦`. A hardcoded symbol is the bug class that makes decision #6 expensive later. |
| 6 | Which other countries/currencies later? | Deferred. Every money column is `INTEGER` minor units + a `CHAR(3)` `currency` column defaulting to `'NGN'`, so multi-currency is a data change, not a schema rewrite. *Naming caveat: the columns say `*_kobo` because that's the NGN subunit. If multi-currency is ever real, rename to `*_minor`. Note it in a comment now; don't do the rename now.* | **No.** |
| 7 | What content is allowed/prohibited? | No automated moderation, no blocklists, no policy engine. Trust comes from (a) creator verification, (b) enrollment-gated reviews (TRUST-002, DB-enforced), (c) user reporting + admin triage. Minimal acceptable-use text on `/terms` and a per-community description field the creator fills in. | **No** — but ship the **Report** action on posts/comments writing to a `reports` table, or the §15.4 "Reports/moderation" page is empty on demo day. Small (one button, one table, one admin list) and it's the only thing that makes ADMIN-003 demonstrable. **P1.** |
| 8 | Who owns learner-generated vs creator course content? | Creators retain copyright in courses/lessons; learners retain copyright in posts/comments; Interlekt receives a non-exclusive licence to host and display. | **No.** A static `/terms` page, ~15 minutes. |
| 9 | What happens to enrolled learners if a creator deletes a community? | **Archive, never hard delete.** `communities.status = 'archived'`: hidden from Explore/search/API for non-members, but existing members keep full access indefinitely (no expiry job in the MVP). Hard-deleting a community would orphan enrollments, payments, and progress — a data-recovery project we cannot afford in a hackathon. | **No** — with one UI obligation: the creator's own community list must render an **"Archived"** badge for `status: "archived"` rows and explain that it's hidden from discovery. `enrollments.status` still includes `'expired'` for a future expiry job. |

### 7.1 What the team must answer before coding starts

**🔴 Blocking — answer before the frontend builds the community page and the checkout flow:**

1. ~~**One-time payments only?**~~ **RESOLVED.** The community owner picks `billing_period ∈ {one_time, monthly}` at creation time. The frontend renders whatever the API returns. See decision #2.
2. **Is the fee 10%?** (decision #3). Not technically blocking — the API returns it — but the team should
   agree so nobody hardcodes a different number in a mockup.

**🟡 Blocking for a *particular screen*, not the build as a whole:**

3. **Seed data.** §21 names "too few communities" as a live risk, and the frontend cannot build or
   visually review the community card, the creator page, or the feed without realistic content. Someone
   must produce the seed script *in parallel with* the frontend, not after. Minimum viable seed:
   **8–10 published communities across all categories, 3 verified creators, 2 unverified, ~12 users, 40+
   posts with comments, 3 courses with modules/lessons, 6+ reviews, and 2–3 successful payment records.**
   Seeded users need known passwords in the README for demo-day logins.
4. **Slug vs id in URLs** — confirm `/communities/[slug]` for public/learner, `/communities/[id]` for
   creator/admin (§5.1). Changing this after the routes exist is a cross-cutting refactor.
5. **The 12 endpoints in §7.2** are the Day-1 contract freeze. Agreeing the envelope (§3.2) and those
   twelve routes unblocks the entire frontend data layer.

**🟢 Explicitly deferrable:** everything else in this table, plus notifications, quizzes, certificates,
AI features, native apps, live video, and payouts.

### 7.2 Day-1 contract freeze — build the backend to these first

The frontend engineer can start immediately on these **twelve**, and on the envelope in §3.2:

| # | Endpoint | Unblocks |
|---|---|---|
| 1 | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` · `GET /auth/me` | Every authenticated screen; route guards |
| 2 | `GET /communities` (+ `/communities/categories`) | Explore, Search, Landing, Home nav |
| 3 | `GET /communities/{slug}` → `CommunityDetail` | The community detail page + the entire enroll CTA |
| 4 | `GET /creators/{slug}` | Creator profile page |
| 5 | `POST /communities/{cid}/enrollments` | Free enroll path |
| 6 | `POST /communities/{cid}/payments` | Checkout |
| 7 | `GET /payments/{reference}/status` | **The post-payment poller — highest-risk frontend component** |
| 8 | `GET /enrollments/me` + `GET /communities/{cid}/enrollment` | My Communities, CTA state |
| 9 | `GET /communities/{cid}/posts` + `POST …/posts` | The feed and the "Engage" demo beat |
| 10 | `GET /posts/{pid}/comments` + `POST …/comments` | Engagement |
| 11 | `GET /communities/{cid}/courses` · `…/courses/{courseId}` · `GET /lessons/{id}` · `POST /lessons/{id}/complete` | Classroom, course outline, lesson view |
| 12 | `GET /creator/dashboard` + `/communities/{id}/members` + `/communities/{id}/transactions` | The whole creator dashboard — the "Creator earns" beat |

Plus the two webhook endpoints on the backend's critical path: `POST /webhooks/paystack` and
`GET /payments/{reference}/status` (the fallback verification inside #7).

---

---

## 8. Infrastructure & delivery

### 8.1 Topology

| Layer | Choice | One-line reason |
|---|---|---|
| Repo | **Monorepo**: `apps/web`, `apps/api`, `docs`, `docker`, `infra` | PRD §19.1 explicitly allows either and says prioritise deployment simplicity. One clone, one `docker compose up`, one PR that touches both sides of a contract. Two repos means a cross-repo PR for every API change, which is fatal in a hackathon. |
| `apps/web` | **Vercel** (Next.js) | Git autodeploy, PR previews for free, global CDN for the HTML shell and images, and `rewrites` in `next.config` with zero extra config (§3.9). |
| `apps/api` | **Railway** (Dockerfile) | Deploy-from-repo, public HTTPS URL (required for the Paystack webhook), managed Postgres add-on. Alternatives (Render, Fly.io) are fine — pick whichever the team already knows. |
| Database | **Managed Postgres** (Neon / Supabase / Railway add-on) | Never a container. A DB container that restarts or gets OOM-killed mid-demo ends the demo. Daily provider snapshot is sufficient for a hackathon. |
| Media | **Cloudinary** free tier | Unsigned upload preset; thumb/card/hero URL variants; AVIF/WebP for free. |
| Reverse proxy / TLS / CDN | **Platform-managed** (Vercel edge, Railway ingress) | Do not hand-roll Nginx. Self-inflicted outage risk with zero MVP benefit. |
| Redis | **None** | In-process `slowapi` rate limiting. One uvicorn worker makes this correct for our scale. |
| Email | **None** | No P0 requirement needs it. `AUTH-006` is explicitly optional. Reclaim the time. |

### 8.2 Environments & secrets

- **Three environments**: `local` (Docker Compose) · `staging` (free Vercel + Railway tiers, used for the
  Playwright E2E and webhook rehearsal) · `production` (the demo).
- **`NEXT_PUBLIC_` vars are public by definition.** The frontend has exactly two: `NEXT_PUBLIC_CLOUDINARY_CLOUD`
  and `NEXT_PUBLIC_CLOUDINARY_PRESET` (an unsigned upload preset *name*, not a secret). Everything else is
  server-side: `API_ORIGIN` (no `NEXT_PUBLIC_`), `JWT_SECRET`, `DATABASE_URL`, `PAYSTACK_SECRET_KEY`,
  `PLATFORM_FEE_PERCENT`, `APP_ORIGIN`.
- **`.env.example` is committed with every key documented and no values.** Real values live only in Vercel
  and Railway env config. `.env*` (except `.env.example`) is in `.gitignore` — verify this is actually true
  before the first commit, because a leaked `PAYSTACK_SECRET_KEY` in git history is a real incident, not a
  theoretical one.
- **The Paystack secret key never reaches the browser.** It is used only in FastAPI: to call the Paystack
  API and to verify webhook HMACs. This is the PRD §17 rule, and the same-origin topology (§3.9) means
  there is no frontend code path that could accidentally reference it.
- **Preflight assertion at API startup** (fail fast, not silently wrong):
  - if `PAYSTACK_IS_LIVE=true` but the key starts with `sk_test_` → refuse to boot
  - if `APP_ORIGIN` is not set or not HTTPS in production → refuse to boot
  - if `JWT_SECRET` is missing or equals a dev default → refuse to boot

### 8.3 Database

- Managed Postgres 16, one instance, **one connection pool per process**. `pool_size=5, max_overflow=5,
  pool_pre_ping=True, pool_recycle=1800`. We run a single uvicorn worker, so the pool ceiling is ~10 —
  comfortably inside Postgres's default `max_connections=100`. No PgBouncer.
- **Enable `pg_trgm`** for the community search index (§9.4). One extension, one `CREATE EXTENSION` in the
  initial migration.
- **Backups**: provider-managed daily snapshot. A weekly restore test is nice but a hackathon demo does
  not recover from a bad migration often enough to justify the time; the §9.5 "migrate from scratch"
  policy removes the main corruption risk.
- **`statement_timeout = 15000`** at the database level plus a slow-query log at `> 300ms` in dev. Cheap
  insurance against a runaway query eating a connection during the demo.

### 8.4 CI/CD

**GitHub Actions — three workflows, all blocking on merge to `main`:**

| Workflow | Steps | Target |
|---|---|---|
| `api.yml` | `ruff check` → `ruff format --check` → `mypy` (lenient) → `pytest -q` (SQLite-in-Docker or a service Postgres) | < 90 s |
| `web.yml` | `eslint` → `tsc --noEmit` → `vitest run` → `next build` | < 3 min |
| `contract.yml` | Fetch deployed `/openapi.json` → `openapi-typescript` → `git diff --exit-code src/types/api.d.ts` | fails if the contract drifted |

The `contract.yml` check is the highest-value CI in the repo and costs about ten lines. It makes "the
backend changed a response shape and the frontend is now lying" a build failure instead of a demo-day
surprise.

**Deploys:** Vercel and Railway both autodeploy from `main`. **No preview environments for the API** (time).
Rollback = redeploy the previous commit, which both platforms support in one click. Migrations run as the
Railway release command: `alembic upgrade head && uvicorn app.main:app`.

**Docker Compose (local dev only):** `api` (uvicorn, `--reload`) + `db` (postgres:16) + optionally `web`.
One command gets a new teammate running. Not used in production.

### 8.5 Monitoring & observability

- **Sentry** on both apps (free tier). The frontend should `setTag` with `user_id` and add the API's
  `x-request-id` as a breadcrumb so a frontend error traces straight to the backend log line.
- **Structured JSON logs** in FastAPI (`loguru` or stdlib + a JSON formatter), one line per request:
  `ts, level, request_id, method, path, status, duration_ms, user_id`. **Never log** passwords, JWTs,
  Paystack secret keys, or full webhook bodies with customer PII.
- **The one alert that earns its keep:** a non-2xx from `POST /webhooks/paystack`, or a `settle()` that
  returns `amount_mismatch`. Both mean money and access are out of sync. Sentry → email/Slack.
- **Health check:** `GET /api/v1/health` returns `200` only if the DB answers a trivial query. Railway
  uses it as the container healthcheck. A healthcheck that returns a static `"ok"` while the DB is down
  would keep routing traffic to a broken instance.

---

## 9. Data model

Concretises PRD §12. Conventions: **`UUID` primary keys everywhere** (no sequential ints leaking into
URLs, no cross-table enumeration), **`TIMESTAMPTZ` for all times (UTC)**, **integer minor units for
money**, **`created_at`/`updated_at` on every table**, and **soft delete (`deleted_at`) only on
user-generated content** (posts, comments) where moderation needs the row.

### 9.1 Entity-relationship view

```
                          ┌─────────────┐
                          │  categories  │  seeded lookup, 8 rows
                          └──────┬──────┘
                                 │ 1
                                 │
                                 │ N
 ┌────────────┐  1:1   ┌──────────────────┐   1   ┌──────────────┐
 │   users    │───────▶│  creator_profiles│────────▶│  communities │
 │  (auth id) │  0:1   └────────┬─────────┘  owns  └──────┬───────┘
 └─────┬──────┘                 │ 1                     N │
       │ 1                     │ 0..1 verifications         │ 0..1
       │                       ▼                          │
       │                ┌──────────────┐   1:1    ┌───────┴────────┐
       │                │ verifications│          │   enrollments  │◀── the access
       │                │  (P1)        │          │  UNIQUE(u,c)   │    control point
       │                └──────────────┘          └───────┬────────┘
       │ 1                                                 │ 0..1
       ▼                                                  ▼
 ┌────────────┐                                  ┌──────────────┐
 │  profiles  │                                  │   payments   │
 └────────────┘                                  │ UNIQUE(ref)  │
                                                  │ UNIQUE(p,pr) │
       ┌──────────────────────────────────────────┴──────┬───────┘
       │ N                                            N │ 1
       ▼                                                ▼
 ┌────────────┐   N   ┌──────────┐   1   ┌──────────┐  ┌────────────────┐
 │    posts   │◀──────│ comments │   1   │  courses │  │  webhook_events│  (P0 add)
 │ (community)│        └──────────┘       └────┬─────┘  └────────────────┘
 └─────┬──────┘                                │ 1
       │ 1                                     │
       ▼ 0..1                                  ▼ N
 ┌────────────┐                          ┌──────────┐   N   ┌────────────────┐
 │   reviews  │                          │ modules  │──────▶│    lessons     │
 │ UNIQUE(u,c)│                          └──────────┘       └───────┬────────┘
 │ FK→enroll  │                                                  │ N
 └────────────┘                                          ┌───────▼────────┐
                                                         │ lesson_progress│
                                                         │ UNIQUE(u,l)    │
                                                         └────────────────┘

       ┌────────────────┐
       │  notifications │  P2 — table ships empty, zero endpoints built
       └────────────────┘
       ┌────────────────┐
       │    reports     │  P1 — makes §15.4 "Reports/moderation" demonstrable
       └────────────────┘
       ┌────────────────┐
       │   sessions     │  auth — refresh-token revocation (logout)
       └────────────────┘
```

**Reading the important relationships:**

- `users` is the auth identity; everything else hangs off it. A user has **at most one** `creator_profiles`
  row (`role='creator'`).
- `communities` belong to **exactly one** creator, and have **many** `enrollments`. The `enrollments` table
  *is* the access-control system (ENR-004, FEED-004) — there is no separate permissions table.
- `enrollments` has a **`UNIQUE(user_id, community_id)`** constraint. This single constraint gives us
  idempotent enrollment, "my communities" lookup, and a natural idempotency key for payment activation.
- `payments` references `enrollments` **nullable** — a payment can exist (initialized, unpaid) with no
  enrollment yet. On success, the enrollment is created and linked back.
- `reviews.enrollment_id` is **`NOT NULL`** — reviews cannot exist without a real enrollment. TRUST-002
  enforced in the schema, not in a code path someone can forget.
- `comments` carries a **denormalized `community_id`** in addition to `post_id`. This lets the feed's
  access check and the moderation query avoid joining through `posts` on the two hottest paths. The
  invariant (`comments.community_id = posts.community_id`) is maintained by the service layer and asserted
  by a Postgres trigger in the initial migration — cheap, and it makes the denormalization safe.

### 9.2 Tables

Legend: **PK** primary key · **FK** foreign key · **UQ** unique · **IDX** index · `*` = indexed ·
`?` = nullable. All tables additionally carry `created_at TIMESTAMPTZ NOT NULL DEFAULT now()` and
`updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` unless noted.

---

**`users`** — authentication identity (AUTH-001…005)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK**, `gen_random_uuid()` |
| `email` | CITEXT | no | **UQ**, not indexed separately (CITEXT btree serves both lookup and uniqueness) |
| `password_hash` | TEXT | no | Argon2id, `$argon2id$…` |
| `role` | ENUM(`learner`,`creator`,`admin`) | no | default `learner`; single column, not a join table (§2.2) |
| `is_active` | BOOLEAN | no | default `true`; admin-suspendable (ADMIN-001) |
| `email_verified_at` | TIMESTAMPTZ | **yes** | null = unverified. **No verification email in the MVP** (§2.2) |
| `last_login_at` | TIMESTAMPTZ | **yes** | |

**IDX**: `uq_users_email (email)` · `ix_users_role_created (role, created_at DESC)` — the admin users list.
`ix_users_active_created (is_active, created_at DESC)`.

---

**`profiles`** — public/user profile info (USER-001, USER-002). 1:1 with `users`, PK is the FK.

| Column | Type | Null | Notes |
|---|---|---|---|
| `user_id` | UUID | no | **PK**, **FK** → `users.id` ON DELETE CASCADE |
| `display_name` | TEXT | no | 2–80 chars, not unique (display names collide; slugs are what must be unique) |
| `headline` | TEXT | **yes** | ≤ 120 chars, e.g. "Backend engineer learning AI" |
| `bio` | TEXT | **yes** | ≤ 2000 chars |
| `avatar_url` | TEXT | **yes** | Cloudinary URL, 400 px thumb variant |
| `country` | TEXT | **yes** | free text, defaults to `NG` |
| `interests` | TEXT[] | no | default `{}` — learning interests (USER-002) |

**IDX**: PK only. `GIN (interests)` is P2; learner interest-matching is not in the MVP loop.

---

**`creator_profiles`** — creator expertise, bio, verification (CREATOR-001/002). 1:1 with `users`.

| Column | Type | Null | Notes |
|---|---|---|---|
| `user_id` | UUID | no | **PK**, **FK** → `users.id` ON DELETE CASCADE |
| `slug` | TEXT | no | **UQ** — URL segment, e.g. `ada-obi` |
| `bio` | TEXT | **yes** | long-form (distinct from `profiles.bio`, the short one) |
| `expertise` | TEXT[] | no | default `{}` — e.g. `["AI engineering","Python"]` (CREATOR-002) |
| `website_url`, `twitter_url` | TEXT | **yes** | |
| `verification_status` | ENUM(`unverified`,`pending`,`verified`,`rejected`) | no | default `unverified` (TRUST-004) |
| `verified_at` | TIMESTAMPTZ | **yes** | set with `verified` |
| `total_members_cached` | INTEGER | no | default 0, denormalized for the creator profile page |

**IDX**: `uq_creator_profiles_slug (slug)` · `ix_creator_profiles_verif (verification_status, created_at DESC)` — admin queue.

---

**`verifications`** — creator verification submissions (TRUST-004, ADMIN-002). **P1.**

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `creator_id` | UUID | no | **FK** → `creator_profiles.user_id` |
| `status` | ENUM(`pending`,`approved`,`rejected`) | no | default `pending` |
| `evidence_url` | TEXT | no | link to proof — **no file upload in the MVP** |
| `statement` | TEXT | no | ≤ 1000 chars, creator's own words |
| `reviewed_by` | UUID | **yes** | **FK** → `users.id` (the admin) |
| `review_note` | TEXT | **yes** | admin's note on rejection |
| `reviewed_at` | TIMESTAMPTZ | **yes** | |

**IDX**: `ix_verifications_status (status, created_at DESC)`.
> `creator_profiles.verification_status` is the denormalized read path (fast on the public page);
> this table is the audit trail. A `partial unique index` on `creator_id WHERE status='pending'` prevents
> duplicate submissions.

---

**`categories`** — seeded lookup (DISC-003). 8 rows: AI & Data, Software Development, Design & Creative,
Business & Entrepreneurship, Marketing & Growth, Personal Development, Language & Communication, Career
& Tech.

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `slug` | TEXT | no | **UQ** |
| `name` | TEXT | no | |
| `sort_order` | SMALLINT | no | default 0 |

---

**`communities`** — learning communities (COMM-001…005, PAY-001, DISC-005). **The central table.**

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `slug` | TEXT | no | **UQ** — de-duped from title, immutable after creation in the MVP (avoids redirect logic) |
| `creator_id` | UUID | no | **FK** → `users.id` RESTRICT — never client-supplied |
| `title` | TEXT | no | 5–120 chars |
| `description` | TEXT | no | 20–5000 chars |
| `category_id` | UUID | no | **FK** → `categories.id` — the primary browse axis |
| `tags` | TEXT[] | no | default `{}`, max 6 — secondary topics; satisfies "one or more categories" (DISC-003) without a join table (assumption A-3) |
| `image_url` | TEXT | **yes** | hero variant |
| `image_thumb_url` | TEXT | **yes** | 400 px — **always what cards render** |
| `is_free` | BOOLEAN | no | default `false` (COMM-004) |
| `price_kobo` | INTEGER | no | default `0`; CHECK `0 ≤ price_kobo ≤ 10000000` (₦100,000 cap) when `is_free = false` |
| `currency` | CHAR(3) | no | default `'NGN'` — present for future multi-currency (open decision #6) |
| `billing_period` | ENUM(`one_time`,`monthly`,`yearly`) | no | default `'one_time'` — one-time only in the MVP; the column exists so subscriptions are a later data change (open decision #2) |
| `status` | ENUM(`draft`,`published`,`archived`) | no | default `draft` (COMM-003; `archived` per open decision #9) |
| `member_count` | INTEGER | no | default `0`, denormalized, maintained in the enrollment transaction |
| `paid_member_count` | INTEGER | no | default `0`, denormalized (DASH-002) |
| `published_at` | TIMESTAMPTZ | **yes** | set on first publish, used by `sort=newest` |

**IDX**:
| Index | Serves |
|---|---|
| `uq_communities_slug (slug)` | `GET /communities/{slug}` — the most-hit row lookup in the app |
| `ix_communities_discovery (status, category_id, published_at DESC)` | `GET /communities` browse + category filter (equality first, sort last) |
| `ix_communities_creator (creator_id, status)` | `GET /creator/dashboard`, creator's own community list |
| `ix_communities_search_title GIN (title gin_trgm_ops)` | `GET /communities?q=` — `pg_trgm` handles `ILIKE '%term%'`, which is what a naive search box actually produces |
| `ix_communities_trending (status, member_count DESC, published_at DESC)` | `sort=trending`, the Explore default |

> **Search note:** `pg_trgm` on `title` only, not `description`, not full-text search. `ILIKE '%x%'` on a
> leading wildcard can use a trigram GIN index; a btree cannot, and `to_tsvector` requires stemming
> configuration that costs demo time. Trigram on title is the fastest correct-enough answer at this
> scale, and it makes partial-word search work ("machine learn" → "Machine Learning for Everyone").
> *Production would move to `tsvector` + a language config per market.*

---

**`enrollments`** — the user's access relationship to a community (ENR-001…005, COMM-005, FEED-004). **The access-control table.**

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `user_id` | UUID | no | **FK** → `users.id` CASCADE |
| `community_id` | UUID | no | **FK** → `communities.id` CASCADE |
| `status` | ENUM(`pending_payment`,`active`,`cancelled`,`expired`) | no | default `active` for free; `pending_payment` for paid-before-webhook |
| `access_level` | ENUM(`free`,`paid`) | no | default `free` |
| `amount_paid_kobo` | INTEGER | no | default `0` |
| `currency` | CHAR(3) | no | default `'NGN'` |
| `payment_id` | UUID | **yes** | **FK** → `payments.id` — set on activation |
| `activated_at` | TIMESTAMPTZ | **yes** | null while `pending_payment` |
| `cancelled_at` | TIMESTAMPTZ | **yes** | |

**IDX**:
| Index | Serves |
|---|---|
| `uq_enrollments_user_community UNIQUE (user_id, community_id)` | Idempotent enroll + idempotent payment activation + `GET /enrollments/me` + `GET /communities/{id}/enrollment` |
| `ix_enrollments_community (community_id, status, created_at DESC)` | Member list (DASH-002), member counts |
| `ix_enrollments_user (user_id, status, created_at DESC)` | "My communities" (ENR-005) |

> **Note on `status`:** a paid enrollment is created as `pending_payment` at initialize time and flipped to
> `active` by `activate_enrollment` (§6.3). The frontend **never** writes this and **never** infers it.
> The existence of `pending_payment` also means "user clicked pay, webhook hasn't landed" is a
> *representable* state rather than an ambiguity — which is exactly what §14.3's "keep payment and
> enrollment state consistent" asks for.

---

**`courses`** — structured learning container (COURSE-001, COURSE-004)

`id` PK · `community_id` FK CASCADE · `slug` (per-community unique) · `title` · `description?` ·
`position` INTEGER default 0 · `is_published` BOOLEAN default false · `published_at?`

**IDX**: `uq_courses_community_slug UNIQUE (community_id, slug)` · `ix_courses_community (community_id, position)`.

---

**`modules`** — groups lessons (COURSE-002)

`id` PK · `course_id` FK CASCADE · `title` · `description?` · `position` INTEGER default 0

**IDX**: `ix_modules_course (course_id, position)`.

---

**`lessons`** — individual content units (COURSE-003, COURSE-005, COURSE-006)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `module_id` | UUID | no | **FK** → `modules.id` CASCADE |
| `title` | TEXT | no | |
| `content_md` | TEXT | no | default `''`; ≤ 50 000 chars; markdown, sanitized server-side |
| `video_url` | TEXT | **yes** | external embed or MP4 (COURSE-003) |
| `video_provider` | ENUM(`youtube`,`vimeo`,`mp4`,`external`) | **yes** | |
| `duration_seconds` | INTEGER | **yes** | creator-entered; the UI shows a friendly "≈ 12 min" |
| `position` | INTEGER | no | default 0 |
| `is_published` | BOOLEAN | no | default false (COURSE-004) |
| `is_preview` | BOOLEAN | no | default false — **visible to non-members**; this is what makes the community page show real curriculum before enrollment (DISC-005) |

**IDX**: `ix_lessons_module (module_id, position)`.
> There is **no denormalized `community_id` or `course_id`** here. Reaching a lesson's community costs one
> join through `modules → courses`, and the lesson view is a single-row read. Flattening the tree to
> speed up that one query would mean keeping three copies of a relationship in sync across the builder
> screens. Not worth it. *This is the deliberate opposite of the `comments.community_id` decision above,
> and the difference is read frequency: comments are joined on every feed page, lessons are read one at a time.*

---

**`lesson_progress`** — basic completion tracking (COURSE-006, explicitly "if feasible")

`id` PK · `user_id` FK CASCADE · `lesson_id` FK CASCADE · `completed_at` TIMESTAMPTZ?

**IDX**: `uq_lesson_progress UNIQUE (user_id, lesson_id)` — makes "mark complete" an idempotent upsert ·
`ix_lesson_progress_user (user_id, completed_at DESC)`.

---

**`posts`** — community discussion (FEED-001, FEED-003)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `community_id` | UUID | no | **FK** → `communities.id` CASCADE |
| `author_id` | UUID | no | **FK** → `users.id` CASCADE |
| `kind` | ENUM(`post`,`announcement`) | no | default `post`; `announcement` **only** if author owns the community (FEED-003) |
| `title` | TEXT | **yes** | |
| `body` | TEXT | no | ≤ 10 000 chars |
| `is_pinned` | BOOLEAN | no | default false — owner/admin only |
| `deleted_at` | TIMESTAMPTZ | **yes** | soft delete for moderation (ADMIN-003) |

**IDX**:
| Index | Serves |
|---|---|
| `ix_posts_feed (community_id, created_at DESC) WHERE deleted_at IS NULL` | **The most important index in the product** — every feed page read |
| `ix_posts_pinned (community_id, is_pinned DESC, created_at DESC) WHERE deleted_at IS NULL` | pinned-first ordering without a filesort |
| `ix_posts_author (author_id, created_at DESC)` | "my posts", author profile |

> The **partial** `WHERE deleted_at IS NULL` predicate keeps the index small (soft-deleted rows fall out
> immediately) and is the cheapest available form of the partial-index pattern.

---

**`comments`** — responses to posts (FEED-002)

`id` PK · `post_id` FK CASCADE · `author_id` FK CASCADE · **`community_id` FK CASCADE** (denormalized,
see §9.1) · `body` TEXT ≤ 5000 · `deleted_at` TIMESTAMPTZ?

**IDX**: `ix_comments_post (post_id, created_at ASC) WHERE deleted_at IS NULL` — comments read oldest-first
· `ix_comments_community (community_id, created_at DESC) WHERE deleted_at IS NULL` — moderation.

---

**`reviews`** — ratings tied to real enrollments (TRUST-001…003)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `community_id` | UUID | no | **FK** → `communities.id` CASCADE |
| `user_id` | UUID | no | **FK** → `users.id` CASCADE |
| `enrollment_id` | UUID | no | **FK** → `enrollments.id` RESTRICT — **NOT NULL** (TRUST-002) |
| `rating` | SMALLINT | no | CHECK `1 ≤ rating ≤ 5` |
| `title` | TEXT | **yes** | |
| `body` | TEXT | **yes** | ≤ 4000 chars |
| `moderation_status` | ENUM(`visible`,`hidden`) | no | default `visible` |

**IDX**: `uq_reviews_user_community UNIQUE (user_id, community_id)` — one review per user per community,
enforced by the database (this is the `409 ALREADY_REVIEWED` source of truth) ·
`ix_reviews_community (community_id, created_at DESC)`.

**Rating aggregate:** `GET /communities/{slug}` computes `avg` and `histogram` with a single
`GROUP BY rating` over the (small) reviews table. **No denormalized `rating_avg` column** — a
`GROUP BY` on a few hundred rows is instant, and a cached average that drifts from its source is a
permanent source of "the page says 4.7, the list says 4.5" bugs. The API response is the single source of
truth for both surfaces.

---

**`payments`** — provider transactions + platform accounting (PAY-003, PAY-004, PAY-006)

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID | no | **PK** |
| `reference` | TEXT | no | **UQ** — **our** reference, sent to Paystack. The lookup key for the frontend and the webhook |
| `provider` | ENUM(`paystack`) | no | default `paystack` — the column exists so a second provider is a data change (§5.1 "unless required") |
| `provider_reference` | TEXT | **yes** | Paystack's own reference, set on success. **UQ with `provider`** — the webhook idempotency backstop |
| `access_code` | TEXT | **yes** | from the initialize response; diagnostic only, never used for verification |
| `user_id` | UUID | no | **FK** → `users.id` RESTRICT |
| `community_id` | UUID | no | **FK** → `communities.id` RESTRICT |
| `enrollment_id` | UUID | **yes** | **FK** → `enrollments.id`, linked on activation |
| `amount_kobo` | INTEGER | no | **copied from `communities.price_kobo` at init**; compared against the webhook amount (PAY-004) |
| `platform_fee_kobo` | INTEGER | no | **frozen at init** (§6.4) |
| `creator_amount_kobo` | INTEGER | no | `= amount_kobo - platform_fee_kobo`, derived and frozen |
| `provider_fee_kobo` | INTEGER | **yes** | Paystack's own charge, from `data.fees` when present |
| `currency` | CHAR(3) | no | default `'NGN'` |
| `status` | ENUM(`initialized`,`pending`,`success`,`failed`,`refunded`) | no | default `initialized` (PRD §14.2) |
| `failure_reason` | TEXT | **yes** | incl. `amount_mismatch` |
| `last_verify_attempt_at` | TIMESTAMPTZ | **yes** | throttles the `GET /status` Paystack fallback to once per 5 s (§3.8) |
| `paid_at` | TIMESTAMPTZ | **yes** | |
| `raw_payload` | JSONB | **yes** | the webhook body, for debugging a failed demo-day settle. **Redact before storing in production** |

**IDX**:
| Index | Serves |
|---|---|
| `uq_payments_reference UNIQUE (reference)` | `GET /payments/{ref}/status`; webhook lookup |
| `uq_payments_provider_ref UNIQUE (provider, provider_reference)` | **Webhook idempotency backstop** (§6.2 layer 3) |
| `ix_payments_community (community_id, created_at DESC)` | Creator transactions page (DASH-003) |
| `ix_payments_user (user_id, created_at DESC)` | "My payments" receipts |
| `ix_payments_status (status, created_at DESC) WHERE status IN ('initialized','pending')` | **Reconciliation sweep** (§6.1 safety net) — a tiny partial index over only the stuck rows |
| `ix_payments_dashboard (community_id, status) INCLUDE (amount_kobo, platform_fee_kobo, creator_amount_kobo)` | Covering index: the dashboard SUMs read from the index, no heap access |

---

**`webhook_events`** — *P0 addition, not in PRD §12, required by PAY-004 idempotency and §14.3 "handle
repeated webhook notifications safely."*

`id` PK · `provider` TEXT · `event_type` TEXT · `external_reference` TEXT? · `signature_valid` BOOLEAN ·
`payload` JSONB · `result` TEXT? (`settled` | `duplicate` | `ignored` | `amount_mismatch` | `bad_signature`) ·
`received_at` TIMESTAMPTZ

**IDX**: `ix_webhook_events_ref (provider, external_reference, received_at DESC)`.

**Why it's worth 15 lines:** during the demo, "the payment screen said failed but the money moved" is the
worst possible outcome, and this table is how you answer it in 30 seconds. It is also how you discover
that the webhook signature verification is wrong — a stream of `bad_signature` rows is a five-second
diagnosis that would otherwise cost an hour. *In production this is a real event-processing pipeline;
here it is an append-only log and a debugging tool.*

---

**`sessions`** — refresh-token revocation (AUTH-002 logout)

`id` UUID PK (the JWT's `sid` claim) · `user_id` FK CASCADE · `refresh_token_hash` TEXT ·
`user_agent` TEXT? · `expires_at` TIMESTAMPTZ · `revoked_at` TIMESTAMPTZ? · `created_at` TIMESTAMPTZ

**IDX**: `ix_sessions_user (user_id, created_at DESC)` · `ix_sessions_expiry (expires_at)` for a cleanup job.

---

**`reports`** — moderation queue (ADMIN-003). **P1, but ship the table + the Report button.**

`id` PK · `reporter_id` FK CASCADE · `target_type` ENUM(`post`,`comment`,`user`,`community`) ·
`target_id` UUID · `reason` ENUM(`spam`,`abuse`,`misleading`,`copyright`,`other`) · `details` TEXT? ·
`status` ENUM(`open`,`resolved`,`dismissed`) default `open` · `resolved_by` UUID? · `resolution` TEXT? ·
`resolved_at` TIMESTAMPTZ?

**IDX**: `ix_reports_status (status, created_at DESC)`.

---

**`notifications`** — P2. **Table ships in the initial migration, empty. Zero endpoints, zero UI.**

`id` PK · `user_id` FK CASCADE · `type` TEXT · `title` TEXT · `body` TEXT · `link` TEXT? ·
`read_at` TIMESTAMPTZ? · `created_at` TIMESTAMPTZ

**IDX**: `ix_notifications_user (user_id, created_at DESC)`.

> The table exists so the schema matches PRD §12 and so a later migration isn't a debate. The admin
> "approve verification" handler *may* insert a notification row as a 5-line courtesy — that's free and
> makes the verification beat feel complete. Nothing else reads it, and the nav bell is hidden.

---

### 9.3 P2 entities and features — explicitly deferred

| From PRD | Decision |
|---|---|
| **Notifications** (PRD §5 P2) | Table only. No endpoints. No bell. |
| **Quizzes / assessments** (P2) | Not modelled. No table. |
| **Certificates** (P2) | Not modelled. No table. |
| **AI tutor / recommendations** (P2) | Not modelled. No table. |
| **Subscriptions** (§22 Q2) | `communities.billing_period` column only. No plan table, no recurring-webhook handling, no renewal job. |
| **Creator payouts** (§22 Q4) | `creator_amount_kobo` is computed and displayed, but nothing is *paid out*. No payout account table, no transfer ledger. |
| **Password reset tokens** (AUTH-006) | Deferred with email. Add `password_reset_tokens (id, user_id, token_hash, expires_at, used_at)` if time appears. |

**If the team has extra time, build in this order** (highest demo value per hour):
1. Notification rows on verification decisions + a read-only list endpoint (makes verification feel alive)
2. Password reset (completes AUTH-001…006 honestly)
3. Richer progress tracking on the course outline (COURSE-006 done properly)
4. Creator revenue time-series (a simple 30-day `GROUP BY` — no chart library, just a bar list, §5.5)

---

### 9.4 SQLAlchemy 2.x sketches — the six tables that matter most

Style: `DeclarativeBase` + `Mapped[]` / `mapped_column()` (SQLAlchemy 2.0 idiomatic, no `declarative_base()`
imperative style), shared `UUIDMixin` / `TimestampMixin`, and enums declared once as Python `StrEnum`s that
`SAEnum` maps to native Postgres enums. This is a **sketch of shape and index strategy**, not the final file.

```python
# app/db/base.py
import uuid
from datetime import datetime
from sqlalchemy import DateTime, Enum as SAEnum, MetaData, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

NAMING_CONVENTION = {
    "ix": "ix_%(table_name)s_%(column_0_N_name)s",
    "uq": "uq_%(table_name)s_%(column_0_N_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_N_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)   # Alembic needs this for stable names

class UUIDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

# app/models/enums.py
from enum import StrEnum
class Role(StrEnum):            LEARNER = "learner";  CREATOR = "creator";  ADMIN = "admin"
class CommunityStatus(StrEnum): DRAFT = "draft";      PUBLISHED = "published"; ARCHIVED = "archived"
class EnrollmentStatus(StrEnum):
    PENDING_PAYMENT = "pending_payment"; ACTIVE = "active"; CANCELLED = "cancelled"; EXPIRED = "expired"
class PaymentStatus(StrEnum):
    INITIALIZED = "initialized"; PENDING = "pending"; SUCCESS = "success"
    FAILED = "failed"; REFUNDED = "refunded"
class PostKind(StrEnum):        POST = "post";         ANNOUNCEMENT = "announcement"
```

---

**1. `User` — the auth identity**

```python
class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        Index("ix_users_role_created", "role", desc("created_at")),
        Index("ix_users_active_created", "is_active", desc("created_at")),
    )

    email: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)   # case-insensitive
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)          # argon2id
    role: Mapped[Role] = mapped_column(
        SAEnum(Role, name="user_role"), nullable=False, default=Role.LEARNER
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False)
    creator_profile: Mapped["CreatorProfile | None"] = relationship(back_populates="user", uselist=False)
```

---

**2. `Community` — the central entity, and where the index strategy lives**

```python
class Community(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "communities"
    __table_args__ = (
        CheckConstraint("price_kobo >= 0 AND price_kobo <= 10_000_000", name="price_range"),
        CheckConstraint("is_free = true OR price_kobo > 0", name="paid_must_have_price"),
        # equality predicates first, the ORDER BY column last  (db-scale composite rule)
        Index("ix_communities_discovery", "status", "category_id", desc("published_at")),
        Index("ix_communities_trending",  "status", desc("member_count"), desc("published_at")),
        Index("ix_communities_creator",   "creator_id", "status"),
        Index("ix_communities_search_title", text("title gin_trgm_ops"), postgresql_using="gin"),
    )

    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    creator_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False     # never client-supplied
    )
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)

    image_url: Mapped[str | None] = mapped_column(Text)
    image_thumb_url: Mapped[str | None] = mapped_column(Text)         # cards render this, always

    is_free: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    price_kobo: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    currency: Mapped[str] = mapped_column(CHAR(3), nullable=False, default="NGN")
    billing_period: Mapped[str] = mapped_column(
        SAEnum(BillingPeriod, name="billing_period"), nullable=False, default=BillingPeriod.ONE_TIME
    )
    status: Mapped[CommunityStatus] = mapped_column(
        SAEnum(CommunityStatus, name="community_status"), nullable=False, default=CommunityStatus.DRAFT
    )

    member_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    paid_member_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    creator: Mapped["User"] = relationship(lazy="joined")     # every community response includes the creator
    category: Mapped["Category"] = relationship(lazy="joined")
```

---

**3. `Enrollment` — the access-control table**

```python
class Enrollment(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        # THE constraint: idempotent enrollment, idempotent payment activation, and the
        # lookup key for "my communities" and "is this user enrolled?" — one index, three features.
        UniqueConstraint("user_id", "community_id", name="uq_enrollments_user_community"),
        Index("ix_enrollments_community", "community_id", "status", desc("created_at")),
        Index("ix_enrollments_user",      "user_id", "status", desc("created_at")),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    community_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("communities.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[EnrollmentStatus] = mapped_column(
        SAEnum(EnrollmentStatus, name="enrollment_status"),
        nullable=False, default=EnrollmentStatus.ACTIVE,
    )
    access_level: Mapped[str] = mapped_column(
        SAEnum(AccessLevel, name="access_level"), nullable=False, default=AccessLevel.FREE
    )
    amount_paid_kobo: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    currency: Mapped[str] = mapped_column(CHAR(3), nullable=False, default="NGN")
    payment_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("payments.id", ondelete="SET NULL"))
    activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
```

---

**4. `Payment` — where idempotency and accounting live**

```python
class Payment(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "payments"
    __table_args__ = (
        UniqueConstraint("reference", name="uq_payments_reference"),
        UniqueConstraint("provider", "provider_reference", name="uq_payments_provider_ref"),  # backstop
        Index("ix_payments_community", "community_id", desc("created_at")),
        Index("ix_payments_user",      "user_id",      desc("created_at")),
        # partial: only the stuck rows are indexed, so the reconciliation sweep stays sub-millisecond
        Index("ix_payments_stuck", "created_at",
              postgresql_where=text("status IN ('initialized','pending')")),
        # covering: the dashboard's SUMs are answered from the index, no heap access
        Index("ix_payments_dashboard", "community_id", "status",
              postgresql_include=["amount_kobo", "platform_fee_kobo", "creator_amount_kobo"]),
    )

    reference: Mapped[str] = mapped_column(Text, unique=True, nullable=False)   # OURS, not Paystack's
    provider: Mapped[str] = mapped_column(
        SAEnum(PaymentProvider, name="payment_provider"), nullable=False, default=PaymentProvider.PAYSTACK
    )
    provider_reference: Mapped[str | None] = mapped_column(Text)   # Paystack's, set on success
    access_code: Mapped[str | None] = mapped_column(Text)          # diagnostic only

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    community_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("communities.id", ondelete="RESTRICT"), nullable=False
    )
    enrollment_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("enrollments.id", ondelete="SET NULL"))

    # ── frozen at initialize time; NEVER recomputed from the current fee config ──
    amount_kobo: Mapped[int] = mapped_column(Integer, nullable=False)
    platform_fee_kobo: Mapped[int] = mapped_column(Integer, nullable=False)
    creator_amount_kobo: Mapped[int] = mapped_column(Integer, nullable=False)
    provider_fee_kobo: Mapped[int | None] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(CHAR(3), nullable=False, default="NGN")

    status: Mapped[PaymentStatus] = mapped_column(
        SAEnum(PaymentStatus, name="payment_status"),
        nullable=False, default=PaymentStatus.INITIALIZED,
    )
    failure_reason: Mapped[str | None] = mapped_column(Text)
    last_verify_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))  # 5s throttle
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw_payload: Mapped[dict | None] = mapped_column(JSONB)
```

---

**5. `Post` — the feed, and the product's busiest index**

```python
class Post(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "posts"
    __table_args__ = (
        # PARTIAL index: soft-deleted rows drop out, so the index stays small and the
        # feed query never needs a filter-on-read for deleted posts.
        Index("ix_posts_feed", "community_id", desc("created_at"),
              postgresql_where=text("deleted_at IS NULL")),
        Index("ix_posts_pinned", "community_id", desc("is_pinned"), desc("created_at"),
              postgresql_where=text("deleted_at IS NULL")),
        Index("ix_posts_author", "author_id", desc("created_at"),
              postgresql_where=text("deleted_at IS NULL")),
    )

    community_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("communities.id", ondelete="CASCADE"), nullable=False
    )
    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[PostKind] = mapped_column(SAEnum(PostKind, name="post_kind"), nullable=False, default=PostKind.POST)
    title: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_pinned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")
    comment_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    author: Mapped["User"] = relationship(lazy="joined")
```

`comment_count` is denormalized so the feed renders counts without a `GROUP BY` per post. Maintained in
the same transaction as the comment insert — and since comments are soft-deleted, a hidden comment does
**not** decrement the count. Document that in the code so nobody "fixes" it later and creates an
inconsistency.

---

**6. `Lesson` — the learning content, and the access boundary**

```python
class Lesson(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "lessons"
    __table_args__ = (
        Index("ix_lessons_module", "module_id", "position"),
        CheckConstraint("char_length(content_md) <= 50000", name="content_length"),
    )

    module_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("modules.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    content_md: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    video_url: Mapped[str | None] = mapped_column(Text)
    video_provider: Mapped[str | None] = mapped_column(SAEnum(VideoProvider, name="video_provider"))
    duration_seconds: Mapped[int | None] = mapped_column(Integer)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")
    is_preview: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="0",
        comment="Visible to non-members. This is what makes the community page show real curriculum.",
    )
```

---

### 9.5 Migration strategy

1. **One initial Alembic revision** containing the entire schema above, `alembic revision --autogenerate`,
   then **read it line by line** before committing. Autogenerate gets enum types, server defaults, and
   partial-index `postgresql_where` clauses subtly wrong often enough that unreviewed autogenerate is the
   single most common cause of a bad first migration.
2. `CREATE EXTENSION IF NOT EXISTS pg_trgm;` as the first statement in the migration.
3. Seed data (`categories`, demo users, communities, content) in a **separate** `seed.py` script run
   manually — never in the migration. Migrations are schema; seeds are data; mixing them makes
   `migrate from scratch` non-deterministic.
4. The trigger asserting `comments.community_id = posts.community_id` ships in the initial migration.
5. **Demo DB policy: always `alembic upgrade head` on an empty database.** Destructive changes
   (`drop_column`, enum value removal) are acceptable. Do not build expand-migrate-contract (§2.3).
6. Every revision gets a working `downgrade()` (PR §19 rollback-aware) — smoke-tested, not exhaustively.
7. In CI, `alembic upgrade head` runs against a throwaway Postgres before tests, so a broken migration
   fails the build rather than the deploy.

---

## 10. Security checklist (PRD §17)

| Requirement | Implementation | Where to verify |
|---|---|---|
| Secrets in env, not source | `.env.example` committed, values in Vercel/Railway config, `.env*` gitignored | First commit |
| No private provider secrets in the browser | `PAYSTACK_SECRET_KEY` is backend-only; the frontend has 2 public env vars, neither a secret | §8.2 |
| Authorization on every protected operation | `current_user` / `require_roles` / `require_membership` dependencies; **no route without one** | Code review rule |
| Validate all input | Pydantic on every request model; `additionalProperties: false` on write schemas | `extra="forbid"` in the model config |
| Modern password hashing | Argon2id via `pwdlib[argon2]`, `time_cost=3, memory_cost=64 MiB, parallelism=4` | §4.2 |
| HTTPS in production | Vercel + Railway both terminate TLS; HSTS on the web origin; `COOKIE_SECURE=true` enforced by startup check | §8.2 |
| Rate limiting on sensitive endpoints | `slowapi` in-process; tight limits on `/auth/*` and payments (§3.9) | §3.9 table |
| Validate uploads, restrict types/sizes | Client type+size check; Cloudinary unsigned preset configured with `allowed_formats` + `max_file_size` | §5.5 |
| **Never trust client role/price/ownership/payment-success** | The §4.4 source-of-truth table, enforced by request models that simply don't contain those fields | §4.4 |
| Webhook authenticity | HMAC-SHA512 of the **raw body** vs `x-paystack-signature`, constant-time compare, 401 on mismatch | §6.1 |
| CSRF | `SameSite=Lax` cookies + an `Origin` allowlist check on all non-GET requests | §4.2 |
| Secrets out of logs | Structured logger with an explicit redaction list (passwords, tokens, webhook bodies with PII) | §8.5 |
| User enumeration | Identical `INVALID_CREDENTIALS` response; password-reset always `202` | §4.4 |

**Not built, and said so plainly:** refresh-token rotation with reuse detection, double-submit CSRF
tokens, Redis-backed distributed rate limiting, MFA, CAPTCHA on register, file-content scanning,
automated moderation. Each is a real production requirement and none is a hackathon requirement.

---

## 11. Testing strategy (PRD §18)

| Layer | Tool | Priority | What to actually write (scope discipline) |
|---|---|---|---|
| Backend unit | Pytest | P0 | `settle()` idempotency (3 cases: settled / duplicate / amount-mismatch), fee calculation, `can_enroll` logic, publish-blockers, comment counter maintenance. **~12 tests.** |
| Backend API | Pytest + `httpx` ASGI transport | P0 | The auth matrix and the access matrix, table-driven: for each protected route, assert 401 (no token), 403 (learner hits creator route), 403 (`NOT_A_MEMBER` hits the feed), 200 (owner), 200 (member). **This one table is the highest-value backend test in the repo** — it proves AUTH-005, ENR-004, and FEED-004 in one pass. |
| Payment | Pytest + Paystack sandbox | P0 | Signature verification (valid / tampered / missing), repeated-webhook no-op, amount-mismatch refusal. **Webhook tests are the demo.** |
| Frontend component | Vitest + RTL | P1 | `<EnrollCard>` CTA states; `<MoneyAmount>` formatting; the payment return screen's three states; `formatMoney` edge cases. **~8 tests.** |
| E2E | Playwright | P0 | **One** test: the §18 critical scenario — discover → community → enroll/pay → classroom → lesson → creator sees the transaction. Tag it so the Paystack step can be skipped against a mocked provider for CI. |
| Manual UAT | The §24 demo script | P0 | Run it on a throttled mid-range Android (§5.7) at least twice. |

**What not to write:** broad unit-test coverage of Pydantic models, snapshot tests of the whole app, a
Playwright suite across all 28 routes. Time spent there is time not spent on the payment state machine.

---

## 12. Risks to this architecture

| Risk | Severity | Mitigation |
|---|---|---|
| **Paystack webhook not delivered during the demo** | 🔴 High | The `GET /payments/{ref}/status` fallback verifies directly with Paystack (§3.8). **Rehearse with the webhook deliberately disabled** (§6.5.4). Also: pre-seed a paid enrollment as a stage fallback. |
| Backend and frontend contract drift | 🔴 High | Generated types from a single source of truth; `contract.yml` CI check (§8.4); §7.2 Day-1 freeze. |
| `member_count` / `comment_count` drift | 🟡 Medium | Maintained in the same transaction as the write; a `recompute` script as a 10-line safety net; nothing hard-deletes the source rows. |
| Too few demo communities (§21) | 🟡 Medium | Seed script produced **in parallel** with the frontend, not after. §7.1 item 3. 8–10 communities minimum. |
| Poor mobile UX on a bad connection (§21) | 🟡 Medium | Mobile-first (§5.7): thumb images, tap-to-load video, server-rendered lessons, offset pagination, RSC shell. Rehearse throttled on a real Android. |
| Scope creep (§21) | 🔴 High | The P0/P1/P2 split is enforced structurally: P2 tables exist but have no endpoints; §9.3 lists what's explicitly not modelled. The "one owner per resource per page" rule and the §5.4 "no Zustand for server state" rule each prevent a whole class of quiet scope growth. |
| One person is the single point of failure for the frontend | 🟡 Medium | The contract is written down (§3), types are generated, and the two riskiest components (post-payment state machine, feed optimistic append) are specified in enough detail to be picked up cold. |
| Auth expiry mid-demo | 🟢 Low | 15-min access + transparent refresh + the login page's silent-refresh recovery (§4.3). No user-visible expiry within a normal demo. |
| Pushback on one-time-only payments (§22 Q2) | 🟡 Medium | **The one blocking question.** Resolved in §7: one-time is the assumption, and the `billing_period` column keeps a later change cheap. If the team overrides this after the frontend has built the checkout, the rework is real and bounded (~1 day). Decide before coding, not after. |

---

## 13. Frontend engineer's day-1 checklist

Ordered so the frontend can start before the backend is more than a skeleton.

1. **Scaffold** `apps/web` (App Router, TS strict, Tailwind, shadcn init + the §5.5 component list).
2. **Wire `next.config.ts` rewrites** to `API_ORIGIN` (§3.9). Confirm `fetch("/api/v1/health")` from a
   client component reaches FastAPI and that a `Set-Cookie` from `/auth/login` lands in the browser.
3. **Build `src/lib/api/client.ts`, `errors.ts`, `money.ts`, `query-keys.ts`** (§5.2, §5.3, §3.2). ~200
   lines, and everything else depends on them. Confirm the `ApiError` → RHF `setError` mapping works
   against a hand-rolled 422.
4. **Commit a hand-written stub of `src/types/api.d.ts`** for the §7.2 twelve endpoints, or point
   `gen:api` at a Swagger UI running a mocked backend. Either way, `tsc` must pass with no backend.
5. **Route skeletons** for all 22 §15 pages with the four layout guards in place (`(learner)`, `(creator)`,
   `(admin)`, `(checkout)`) — even if every page body is a placeholder. The route tree (§5.1) is the
   skeleton of the whole product; getting it right early is nearly free.
6. **`<EnrollCard>`** driven by `community.can_enroll` + `community.enrollment` (§5.3) against mocked
   responses for all four states: anonymous / not-enrolled / already-enrolled / owner. This is the single
   most reused component in the product.
7. **The post-payment state machine** (§5.6) against a **mocked** `GET /payments/{ref}/status` that
   returns `pending` 3 times then `success`. Build the polling logic now, wire the real endpoint when it
   exists. Do not leave this for the end — it is the riskiest component and it is fully buildable against
   a fake.
8. **Feed with optimistic append** (§5.3) — post, comment, and the pinned-announcement ordering.
9. **`<StatCard>`, `<PageNav>`, `<StarRating>`, `<MoneyAmount>`** (§5.5) — four small components that four
   screens each depend on.
10. **Pull the real `/openapi.json`** and run `npm run gen:api`; reconcile any shape differences against
    §3 and raise discrepancies immediately. **This is the contract review, and it is much cheaper to do
    it in a diff than in an integration.**

---

## 14. Sign-off

**This architecture is presented for team review and is not yet approved.** No implementation should
begin before sign-off (Phase 3 → Phase 4 gate).

**Sign-off checklist:**

- [ ] **Stack (§2)** — validated, with email/Redis/Nginx dropped and Playwright scoped to one test
- [ ] **Data model (§9)** — tables, the enrollment-as-access-control decision, denormalized counters
- [ ] **API contract (§3)** — envelope, pagination, the §7.2 twelve endpoints, `/webhooks/paystack`
- [ ] **Auth (§4)** — cookie JWT, 15 min / 7 day, non-rotating refresh, three-layer route protection
- [ ] **Frontend (§5)** — route tree, one-owner-per-resource rule, Zustand scope, §5.6 state machine
- [ ] **Payment flow (§6)** — single settle path, three idempotency layers, frozen fee, §6.5 rehearsal
- [ ] **Open decisions (§7)** — ✅ #2 flexible pricing (owner picks `billing_period`); #3 fee % agreed (10% assumed)

**Open questions for the team (all answerable in a single conversation):**

1. **One-time payments only?** — blocking for the checkout UI (§7, Q2).
2. **Platform fee = 10%?** — non-blocking, but agree it so no mockup hardcodes a different number.
3. **Who owns seed data, and when?** — the frontend cannot visually review anything without it, and it
   must land in parallel, not after (§7.1, §12).
4. **Railway or Render for the API?** — anyone with prior experience should decide.
5. **Is `202`-style "no email" acceptable for password reset, or is AUTH-006 P0 for the demo?** — if P0,
  §9.3's deferral lifts and Resend comes back into scope.

**Owner:** Architecture (this document) · **Status:** 🟡 Proposed · **Next phase on approval:** Build (Phase 4),
starting with the Day-1 contract freeze in §7.2 and the frontend checklist in §13.








