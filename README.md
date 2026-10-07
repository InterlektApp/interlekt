# Interlekt — Learn. Connect. Grow.

Interlekt is a learning-community marketplace built for African creators, mentors, and educators. Think of the community-learning model that made Skool work — creators packaging what they know into paid communities with structured lessons and living discussion — but rebuilt from the ground up for Nigeria first: naira pricing, Paystack payments, mobile-first pages, and trust signals that actually mean something here.

This README is written for the people building it. If you're new, read it top to bottom once. It'll take ten minutes and save you days.

---

## The one loop that matters

Everything in this repo exists to make one loop work reliably:

```
DISCOVER → TRUST → ENROLL → PAY → LEARN → ENGAGE → CREATOR EARNS
```

A learner finds a community, decides the creator is worth their money, pays, gets into the classroom, talks to people — and the creator sees the revenue land. **If a task doesn't strengthen this loop, it's secondary.** That's not a slogan; it's the scope filter we used to cut notifications, quizzes, certificates, AI features, native apps, and payouts out of the MVP. They're all in the roadmap (see below), but none of them ships before the loop closes.

The hackathon demo tells exactly this story: search as a learner → evaluate a community → pay → open a lesson → post in the feed → flip to the creator dashboard and watch the numbers move. There's a full demo script in `docs/PRD.md` §24.

---

## What's in this repo

```
interlekt/                       # Frontend repo (this one)
├── apps/
│   └── web/                  # Next.js frontend
├── docs/
│   ├── PRD.md                # The product requirements document (source of truth)
│   ├── architecture.md       # Original technical design (see note below)
│   └── skool-research.md     # What we learned studying Skool's feature set
├── .opencode/
│   └── skills/               # ui-ux-pro-max bundle (design intelligence, local data)
└── Interlekt_Project_Requirements_Document.docx   # Original PRD, for reference
```

> **Two repos, one product.** The backend lives in `InterlektApp/Interlekt-backend`
> (Python + FastAPI + PostgreSQL) and it is authoritative for the API contract.
> This repo is frontend-only — there is no `apps/api` here, and there shouldn't be.
>
> **Spec note:** `docs/architecture.md` was written before the backend team
> finalized their contract, and the two diverge in places that matter: the real
> API speaks **camelCase** (not snake_case), auth is **Bearer tokens in the
> response body** (not httpOnly cookies), money arrives as **decimal strings**
> like `"5000.00"` (not integer kobo), pagination is **`page`/`pageSize`**, and
> roles are an **array**. The frontend adapts to the backend, not the other way
> around — `src/types/api.ts` mirrors the backend's schemas field for field.
> When in doubt, read their code, not our old doc.

The backend (`apps/api`, FastAPI + PostgreSQL) is being built against the contract in `docs/architecture.md` §3. The frontend doesn't wait for it — read on.

---

## The stack, and why

**Frontend** — Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS, shadcn/ui + Radix primitives, TanStack Query for server state, exactly one Zustand store, React Hook Form + Zod for forms, Vitest + Playwright for tests.

A few of these choices deserve explanation because they shape how you write code every day:

- **Same-origin API topology.** The browser only ever talks to `/api/v1/*`, and Next.js rewrites proxy that to FastAPI. No CORS, no token handling in the browser, no third-party-cookie surprises. Auth is an httpOnly cookie JWT (15-min access, 7-day refresh, deliberately *not* rotated). You write `fetch("/api/v1/...")` and cookies just flow.
- **RSC for the read-only shell, TanStack Query only for interactive widgets.** One owner per resource per page — never both, or you get double fetches and a slower page on the exact low-bandwidth connections our users have.
- **One Zustand store** (`usePaymentFlowStore`). Filters live in the URL. Server data lives in Query. If you're about to create a second store, stop — that's scope creep wearing a trench coat.
- **Money is integer kobo, always.** No floats. The API returns `price_kobo`, `platform_fee_kobo`, `creator_amount_kobo`, and a `currency` code. The frontend renders; it never calculates. The money formatter reads `currency` from the API and never hardcodes `₦`, so multi-currency later is a data change, not a rewrite.

**Backend** — Python + FastAPI, SQLAlchemy 2.x, Alembic, Pydantic, PostgreSQL, Paystack for payments. Email, Redis, and hand-rolled Nginx were all deliberately cut (see `docs/architecture.md` §2.2 for the reasoning).

---

## Getting started

### Frontend

```bash
cd apps/web
npm install --legacy-peer-deps
cp .env.example .env.local   # then fill in what you have; it runs without them
npm run dev                  # http://localhost:3000
```

Useful commands:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (must pass before you push) |
| `npx tsc --noEmit` | Typecheck |
| `npm test` | Vitest component tests |
| `npm run gen:api` | Regenerate `src/types/api.d.ts` from the live backend's `/openapi.json` |

**Heads-up for Windows devs:** if the dev server starts throwing `MODULE_NOT_FOUND` or webpack errors after a big restructure, delete `apps/web/.next` and restart. The incremental cache occasionally corrupts (it's a known issue with the SWC native module on some Windows setups). Production `next build` is unaffected — if the build passes, your code is fine.

### Environment

Only three variables are public (everything else is server-side):

```
API_ORIGIN=http://localhost:8000          # FastAPI, used by next.config rewrites
NEXT_PUBLIC_CLOUDINARY_CLOUD=             # unsigned upload preset name
NEXT_PUBLIC_CLOUDINARY_PRESET=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=          # public key only — the secret never leaves the backend
```

### Working without the backend

The frontend runs fully on mocks. `src/lib/mocks.ts` mirrors the API types in `src/types/api.ts` exactly — four Nigerian creators (three verified, one not), four communities across tech/marketing/design, courses with modules and lessons, posts with comments, reviews, and a payment-status simulator that returns `pending` three times then `success` so you can build the polling flow today.

The rule: **every mock matches its type exactly.** When the backend goes live, swapping a mock fetch for the real endpoint shouldn't touch a single component. The hand-written `src/types/api.ts` gets replaced by `npm run gen:api` output once `/openapi.json` exists — reconcile the diff carefully, because that diff *is* the contract review.

---

## Frontend architecture (the short version)

The full version lives in `docs/architecture.md` §5. Here's what you need day to day:

- **Routes.** 26 of them across four groups: public (`/`, `/communities`, `/creators/[slug]`, `/search`, `/auth/*`), learner (`/dashboard`, `/my-communities`, `/classroom`, `/communities/[slug]/{feed,classroom,lessons}`, `/enroll/[communityId]`, `/profile`), creator (`/studio`, `/studio/communities/[id]/*`), admin (`/overview`, `/users`, `/verification`, `/reports`, `/transactions`). Route groups are `(learner)`, `(creator)`, `(admin)` — note the creator dashboard lives at `/studio` and admin at `/overview`, because Next.js route groups can't share identical paths.
- **Data layer.** `src/lib/api/client.ts` (typed fetch + `ApiError` with stable `error.code`), `src/lib/api/errors.ts` (maps 422s to form fields), `src/lib/money.ts`, `src/lib/query-keys.ts` (the `qk` factory — one place owns every Query key, so invalidation is predictable).
- **The payment flow** (`/enroll/[communityId]`) is the riskiest component in the product. It polls `GET /payments/{reference}/status` every 3s, up to 20 times. Success auto-routes to the classroom. Timeout does *not* declare failure — it tells the user to check back, because the webhook may still land. Never grant access based on a redirect param; the server is the only source of enrollment truth. Rehearse the demo with the webhook deliberately disabled at least once.
- **Pricing is the creator's choice.** `billing_period` is `one_time` or `monthly`, set per community at creation. Free is `price_kobo = 0`. The checkout branches on what the API returns — the CTA reads "Enroll now" or "Subscribe" accordingly. Freemium and multi-tier pricing are V1.5.

---

## Design system

The visual direction is documented by example in the code, but here's the reasoning so future changes stay on-brand:

- **Concept: "the campus, not the classroom."** Trust and momentum. Confident left-aligned layouts, one deep brand blue, generous whitespace, small mono caps labels under big display headlines.
- **Type:** Calistoga for display headlines (warmth + character), Inter for body and UI, JetBrains Mono for eyebrow labels and data. This pairing is deliberate — Inter-everywhere is the template tell.
- **Color:** paper ground, ink text, one blue accent kept under ~10% of any viewport, line-driven surfaces. Semantic green/red appear only in data contexts.
- **Icons:** Lucide only, consistent sizes. **No emoji as icons, anywhere** — not in UI, not in mock content, not in empty states. (We had two; they're gone.)
- **Motion** follows the `animate` skill's rules: CSS transitions only, `transform`/`opacity` only, 150–220ms, ease-out for entrances, hover effects gated to hover-capable pointers, `prefers-reduced-motion` respected globally. Card hover is a 2px lift — feedback, not decoration.
- **The recognition test:** remove the logo. If the page could be any SaaS template, the design failed. The display serif, the mono labels, and the asymmetric hero are what make it Interlekt.

The `ui-ux-pro-max` skill bundle in `.opencode/skills/` has searchable style, palette, typography, and UX-guideline data if you want to check a decision. Note: we overrode two of its recommendations (claymorphism + Comic Neue, then purple + Poppins) because both fight the trust-first positioning — the engine matched "education" and "marketplace" too literally. When a tool's taste conflicts with the product's needs, the product wins; that's documented here so nobody "fixes" it back.

---

## Key files for new contributors

| File | Why it matters |
|---|---|
| `docs/architecture.md` | The API contract (§3), auth (§4), payment flow (§6), and every open decision (§7). Read §1 + §13 first. |
| `apps/web/src/types/api.ts` | The frontend's view of the backend contract. |
| `apps/web/src/lib/mocks.ts` | Stand-in backend. Keep it in sync with the types. |
| `apps/web/src/components/enroll-card.tsx` | The most reused component — four states, one card. |
| `apps/web/src/app/(learner)/enroll/[communityId]/page.tsx` | The payment state machine. Handle with care. |
| `apps/web/src/components/{logo,site-header,site-footer}.tsx` | Brand shell. Change the brand here, everywhere updates. |

---

## Roadmap (after the MVP loop closes)

- **V1** — progress tracking, quizzes, notifications, creator analytics, better moderation, native video hosting with captions.
- **V1.5** — subscriptions beyond simple monthly, creator payouts (dashboard shows attributed revenue + "Payouts coming soon" until then), richer reviews, community events, freemium tiers.
- **V2** — AI recommendations and learning assistant, certificates (African career learners want credentials — Skool's biggest gap and our best differentiator), automation.
- **Future** — mobile apps (responsive web first), live classes, multi-country payments (KES, GHS, ZAR), WhatsApp integration.

---

## Contributing

- TypeScript strict. No `any` without a comment explaining why.
- 250-line file limit, 50-line function limit. Small files, small functions.
- Every API call and user interaction handles errors. Every form has validation states.
- Mobile-first, always. Test at 375px before you test at 1440px.
- `next build` must pass. `tsc --noEmit` must be clean.
- Commit conventionally (`feat:`, `fix:`, `docs:` …).

Seed data owners: the frontend can't be visually reviewed without content. Minimum viable seed is 8–10 published communities across all categories, 3 verified + 2 unverified creators, ~12 users, 40+ posts with comments, 3 courses with lessons, 6+ reviews, 2–3 successful payments — with known passwords in the backend README for demo-day logins.
