# Interlekt UI Redesign — Design System & Screen Inventory (v2.0)

> **Purpose of this document:** single source of truth for the full UI redesign.
> Feed it — together with `stitch-prompts.md` — to Google Stitch (and to any developer or agent
> implementing the results). The PRD (`docs/PRD.md`) still wins on *what* the product does; this
> document decides *how it looks and feels*.

---

## 1. What Interlekt is (context for designers/AI)

**Interlekt** is a learning + community platform for African creators, mentors and educators
(initial focus: Nigeria). Learners discover and evaluate learning communities, enroll free or paid
(in **₦ naira** via **Paystack**), then learn in a structured **Classroom** (courses → modules →
lessons) and engage in a **community feed**. Creators build communities, publish curriculum, manage
members and track revenue. Admins run verification, moderation and platform money views.

**The one loop the whole UI must serve:**
`DISCOVER → TRUST → ENROLL → PAY → LEARN → ENGAGE → CREATOR EARNS`

**Design north stars**
1. **Trust you can see** — creator faces, verification badges, ratings, member counts, live activity. Nothing abstract.
2. **Naira native** — prices, revenue and transactions always shown in ₦ with clean formatting (`₦5,000`).
3. **Mobile-first Nigeria** — every screen must work beautifully at 360–430px width; data-cheap, fast-feeling, generous touch targets (min 44px).
4. **Confident, warm, editorial** — a real brand, not a generic SaaS template.

---

## 2. Diagnosis: what's wrong with the current UI (v1 — do not repeat)

| # | Problem in v1 | Rule for v2 |
|---|---|---|
| 1 | Washed-out pale sky/cyan everywhere; pale primary buttons (`#b5e5f1`) with poor contrast | Strong contrast: cream paper background, deep ink navy for authority, saturated amber for every primary CTA |
| 2 | Literally every element is `rounded-2xl border border-sky-...` — no visual rhythm | Explicit scale: cards 16px, inputs 12px, pills for tags/CTAs; cards carry real elevation only where it means something |
| 3 | Uppercase mono "eyebrow" label above nearly every heading | Eyebrows allowed **max once per screen**; hierarchy from type scale, not labels |
| 4 | Zero photography or human faces — looks like an unstyled wireframe | Use real-feeling photography (African learners/mentors), avatar stacks, community cover images everywhere |
| 5 | Placeholder/stub content shipped ("Unavailable", "—", "Live reporting") | Every screen must be designed with **realistic full data**, plus designed empty & error states |
| 6 | Homepage doesn't prove trust or show the money (₦) | Landing must show: search, categories, community cards with ratings/prices, creator proof, and a clear pay-in-naira story |
| 7 | Four different shells feel like four different apps (public / learner / creator / admin) | One family, four shells — same tokens, consistent left-rail vs top-nav logic (§7) |
| 8 | No dark sections, no imagery depth, flat | Use one "ink" dark mode surface for creator/earn sections and admin shell |

---

## 3. Full screen inventory (29 screens — everything the app has)

Routes as they exist in `apps/web/src/app/**`. Each screen gets its own Stitch prompt in
`stitch-prompts.md` (IDs match).

### A. Public (8) — top nav + footer shell, cream background
| ID | Screen | Route | Core purpose |
|---|---|---|---|
| A1 | **Landing page** | `/` | Prove the promise; route learners to Explore, creators to sign-up |
| A2 | **Explore / directory** | `/communities` | Search + category chips + curated community cards + pagination |
| A3 | **Community detail** | `/communities/[slug]` | The trust page: creator, verification, curriculum preview, reviews, price, enroll CTA |
| A4 | **Creator profile** | `/creators/[slug]` | Expertise, bio, trust stats, their communities |
| A5 | **Login** | `/auth/login` | Email + password, Google button, forgot password |
| A6 | **Register** | `/auth/register` | Learner vs Creator role chooser + account fields |
| A7 | **Forgot password** | `/auth/forgot-password` | Request reset |
| A8 | **Search results** | `/search` | Query results view (variant of A2) |

### B. Learner (7) — top nav with learner switcher; bottom tab bar on mobile
| ID | Screen | Route | Core purpose |
|---|---|---|---|
| B1 | **Dashboard** | `/dashboard` | Continue learning, streak/progress stats, communities |
| B2 | **My communities** | `/my-communities` | All joined communities w/ progress |
| B3 | **Classroom (course list)** | `/communities/[slug]/classroom` | Courses → modules → lessons with progress % and lock states |
| B4 | **Lesson view** | `/communities/[slug]/classroom/lessons/[lessonId]` | Video + rich text lesson, mark complete, prev/next |
| B5 | **Community feed** | `/communities/[slug]/feed` | Posts, announcements, pinned, comments, new post composer |
| B6 | **Enroll / checkout** | `/enroll/[communityId]` | Order summary + Paystack payment + success state |
| B7 | **Profile** | `/profile` | Avatar, bio, interests, account settings |

### C. Creator Studio (9) — left rail "Studio" shell (desktop) / stacked on mobile
| ID | Screen | Route | Core purpose |
|---|---|---|---|
| C1 | **Creator onboarding** | `/onboarding` | Headline, expertise, bio — the "become a creator" setup |
| C2 | **Studio home** | `/studio` | Stats (members, revenue, communities) + community cards + new community |
| C3 | **New community (wizard)** | `/studio/communities/new` | Title, description, category, cover, pricing (free/₦) |
| C4 | **Community manage** | `/studio/communities/[id]` | Overview of one community: stats, quick links, publish state |
| C5 | **Edit community** | `/studio/communities/[id]/edit` | Edit details + pricing + publish/unpublish + readiness checklist |
| C6 | **Members** | `/studio/communities/[id]/members` | Searchable member table, status, filters |
| C7 | **Transactions** | `/studio/communities/[id]/transactions` | ₦ revenue table: gross, platform fee, creator earnings |
| C8 | **Course builder** | `/studio/communities/[id]/course-builder` | Courses → modules CRUD + reorder (drag or arrows) |
| C9 | **Lesson editor** | `/studio/communities/[id]/lesson-editor` | Lesson list + editor: title, text/video, content, publish |

### D. Admin (5) — dark ink left-rail operations console
| ID | Screen | Route | Core purpose |
|---|---|---|---|
| D1 | **Platform overview** | `/overview` | Totals: users, communities, enrollments, ₦ revenue, pending queues |
| D2 | **Users** | `/users` | User table, search, role badges, suspend/activate |
| D3 | **Creator verification** | `/verification` | Evidence review queue → approve/reject with note |
| D4 | **Reports / moderation** | `/reports` | Reported posts/users triage, resolve actions |
| D5 | **Transactions** | `/transactions` | Platform-wide payment ledger with status filters, fee split |

**Screen count: 8 public + 7 learner + 9 creator + 5 admin = 29.**
Plus 2 shells that behave like screens on mobile: Learner bottom-tab bar (5 tabs: Home, Explore, My learning, Feed?, Profile) and Studio rail collapsed to a top bar + bottom sheet nav.

---

## 4. Design direction: "Ink & Amber"

A warm, editorial, high-contrast system that reads as a *trusted African learning brand* — deep ink
navy for authority, cream paper for calm reading, a single saturated amber for every call-to-action,
and teal reserved for trust/progress signals. Photography and faces do the emotional work; type does
the hierarchy work.

**Feels like:** the calm of Notion × the editorial confidence of a magazine × the money-clarity of a
fintech app. **Never feels like:** a default Tailwind template, a purple-gradient AI app, or a
washed-out blue wireframe.

---

## 5. Design tokens

### 5.1 Color
| Token | Hex | Usage |
|---|---|---|
| `ink/900` | `#10233F` | Headings, dark sections, nav text-on-cream, admin rail bg |
| `ink/950` | `#0B1B2B` | Darkest surfaces (lesson video letterbox, footer) |
| `paper` | `#FAF7F2` | Global page background (warm cream, never pure white) |
| `card` | `#FFFFFF` | Cards, sheets, tables |
| `line` | `#E7E2D9` | Borders/dividers on cream; `#E5E9EF` on white |
| `text` | `#1A2B3C` | Body text |
| `muted` | `#667085` | Secondary text, meta |
| **`amber`** | `#F59E0B` | **Primary CTA background** (text on it: `#10233F`), active nav, money highlights |
| `amber/hover` | `#DD8F06` | CTA hover |
| `amber/soft` | `#FEF3E2` | Amber tinted chips, highlight fills |
| `teal` | `#0F766E` | Trust: verification badge, progress bars, success-tinted states |
| `teal/soft` | `#E6F2F0` | Teal tinted backgrounds |
| `green/700` | `#15803D` | Success text, "paid", "active" |
| `red/700` | `#B91C1C` | Errors, destructive, "failed" |
| `amber/dark text` | `#3A2A00` | Text on amber/soft chips |

Rules: **one** saturated accent (amber) for actions. Teal never buttons. No gradients except a
subtle `ink/900 → ink/950` on dark feature sections. No glassmorphism, no neon, no purple.

### 5.2 Typography (Google Fonts — Stitch knows these names)
| Role | Font | Weight/size |
|---|---|---|
| Display/H1–H3 | **Sora** | 600–700, tight tracking (`-1%` to `-2%`) |
| Body/UI | **Inter** | 400/500; 15–16px body, 14px UI |
| Numerals/money/labels | **Inter** tabular or **IBM Plex Mono** | Stat numbers: Sora 600; tiny uppercase labels: Inter 11px, weight 600, letter-spacing 6% (sparingly) |

Scale: 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48. Headings always `ink/900` on cream, white on ink.

### 5.3 Space, radius, elevation
- **Spacing:** 4-based (4/8/12/16/20/24/32/40/56). Page gutter 20px mobile, 40px desktop; content max-width 1200px.
- **Radius:** cards `16px`, inner panels/inputs `12px`, pills `999px` (tags, primary buttons, avatars' notifications), avatars circle.
- **Elevation:** `shadow-card: 0 1px 2px rgba(16,35,63,.06), 0 8px 24px -12px rgba(16,35,63,.12)`. Cards mostly **flat with 1px `line` border**; reserved shadows only for popovers, modals, sticky elements.
- **Motion:** 150–200ms ease-out; hover = color/shadow change only. Focus rings: 2px amber, 2px offset.

### 5.4 Iconography
**Lucide** (already in the codebase), 1.5px stroke, `muted` or `ink/900`. Never filled pastel icon tiles with 4 different tints on one screen — max one tinted tile style per screen.

---

## 6. Component library spec (the vocabulary every screen reuses)

| Component | Spec |
|---|---|
| **Top nav (public)** | 64px, `card` bg, hairline bottom border. Logo wordmark "Interlekt" (Sora 700, "Inter" + "lekt" — keep existing wordmark treatment), links: Explore, For creators, About. Right: Sign in (ghost) + **Get started** (amber pill). |
| **Learner top nav** | Same bar; adds search field (center), notification bell, avatar menu (switch to Studio / Sign out). Mobile: bottom tab bar — Home, Explore, My learning, Profile — 5 tabs max, 56px tall, amber active indicator. |
| **Studio rail** | 240px fixed left, cream bg, sections: *Communities* (list), *Money*, *Account*. Active item: `amber/soft` pill w/ amber dot. Top of rail: community switcher. Mobile: top bar + slide-in sheet. |
| **Admin rail** | 220px fixed left, `ink/900` bg, white/70 text, active = `amber` text + left bar. "Operations" tag with counts (e.g. Verification 3). |
| **Community card** | Vertical: cover image (16:9, rounded 12; if missing use category-color block + Sora initial), title (Sora 600, 2-line clamp), creator row (24px avatar + name + ✓if verified), footer row: member count, rating ★, price `₦5,000/mo` or `Free` in green. Whole card clickable, hover lifts shadow. |
| **Category chip** | Pill, 36px tall, white bg + `line` border; active = `ink/900` bg, white text. Icon 16px optional. |
| **Stat card** | Number-first: Sora 600 28px value, 13px muted label, optional delta chip (`+12%` in teal/soft) and 16px icon. No icon-tile-left pattern from v1. |
| **Price tag** | `₦` amount in Sora 600; suffix `/month` or `one-time` in muted; `Free` in `green/700`. |
| **Verification badge** | Teal filled circle-check + "Verified" text, 12px semibold. |
| **Rating** | Stars 16px `#F59E0B` + `4.8 (132)` muted. |
| **Progress bar** | 6px teal fill on `#E6F2F0`, rounded; % label right-aligned Inter 12px. |
| **Post card (feed)** | White card: avatar 40px + name + role chip (Creator amber-soft) + time; body 15px/1.6; attachment/image; footer: comments count, like, share. Announcement = teal/soft left rule + 📣 tag; Pinned = pin tag amber/soft. |
| **Lesson row** | 48px min; status circle left (✓ teal when complete, ▶ play icon when video, ○ empty), title, right meta: duration + lock icon if locked. Hover `paper` bg. |
| **Module accordion** | Header: number, title, n lessons, progress %; expands to lesson rows. |
| **Table** | Cards on mobile → real table ≥768px. Header Inter 12px uppercase muted; rows 56px, hairline dividers; money columns right-aligned tabular. |
| **Empty state** | Centered: 48px illustration (single Lucide icon in `teal/soft` circle), Sora 600 title, 1-line explanation, one primary action. **Every list screen ships one.** |
| **Buttons** | Primary: amber pill, ink text, 44px. Secondary: white pill, 1px ink/20 border. Ghost: text amber-800. Destructive: red/700 text. Disabled: 40% opacity. No gradients. |
| **Inputs** | 44px tall, `card` bg, 1px `line`, radius 12; label above (Inter 13, weight 500); error text `red/700` 12px + red border; help text muted. |
| **Money + receipts** | All money `₦` + thousands separators; transaction rows show gross, platform fee (muted), creator net (semibold). |
| **Toast/inline status** | `teal/soft` bg for success, red for failure, 12–14px, top-right desktop / top-center mobile. |

---

## 7. Page shells & layout patterns

**Public shell (A screens):** top nav → hero/content on `paper` → footer (ink/950, 4 columns, newsletter-less, cap with "Built for African learners & creators"). Landing sections alternate `paper` and `card` bands for rhythm; exactly **one ink/900 dark band** (the creator pitch).

**Learner shell (B screens):** logged-in top nav; content max 1100px centered. Detail-type screens
(feed, lesson) use a **two-column split ≥1024px**: main column + right rail (community info card,
next lesson, members preview); stacked on mobile.

**Creator shell (C screens):** Studio left rail + content column ("workspace" feel, calmer, fewer
decorations, denser). Builder screens (C8/C9) may go full-bleed with their own 2-pane layout:
left = structure tree, right = editor form.

**Admin shell (D screens):** ink rail + white content cards. Very dense but orderly: filters row →
table; overview = 4 stat cards row + two half-width panels.

**Golden rules for every screen:** one H1; max one eyebrow label; primary action always visible
top-right of the content header; every list has loading (skeletons), empty and error states designed;
money always ₦; page must survive 360px width.

---

## 8. Content, imagery & tone

- **Copy tone:** direct, human, no marketing mush. Headlines ≤ 8 words. Example hero: "**Learn with people who've done it.**" Creator pitch: "**Teach what you know. Earn in naira.**"
- **Photography:** warm, natural-light photos of African learners/mentors (workshops, laptops, catch-up sessions). Use them in: landing hero side or collage (never a plain gradient), community covers, creator profiles. Avatars: real-looking names (Ada Okafor, Tunde Bakare, Chiamaka Eze, Kwame Mensah…).
- **Realistic demo data everywhere:** e.g. "AI Engineering Foundations — ₦8,500/mo — 1,240 members — ★4.9 (212)".
- **Never:** lorem ipsum, "Coming soon" labels visible, `—` placeholders, stock-generic western faces, USD.

---

## 9. Accessibility & mobile

- Contrast ≥ 4.5:1 for text; amber CTAs use `ink/900` text (pass), never white-on-amber.
- Tap targets ≥ 44px; forms 56px inputs on mobile; sticky bottom CTAs on community detail & enroll screens.
- Focus-visible rings everywhere; lesson/completion & payments keyboard-operable.
- Low-data mindset: no autoplaying hero videos; images lazy; skeletons communicated quickly.

---

## 10. Acceptance checklist (compare any redesign against this)

1. Landing converts both personas and proves trust (photos, ratings, ₦) within 2 scroll-lengths.
2. Community detail answers "is this worth it?" in one glance — creator, proof, curriculum, price, reviews.
3. Payment flow looks exactly like a Nigerian fintech checkout (₦ order summary, Paystack trust markers).
4. Classroom makes progress addictive (%, next-lesson affordance, completion states).
5. Studio makes money legible (gross/fee/net in every revenue surface).
6. Admin reads as a serious ops console, not a marketing page.
7. Every screen admires §5 tokens and §6 components — no one-off styles.
8. All 29 screens designed + mobile variants of the 7 core learner screens.
