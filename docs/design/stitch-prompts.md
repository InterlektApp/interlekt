# Interlekt × Google Stitch — Prompt Pack (v1)

**Companion to:** `design.md`. Every screen of Interlekt (29 + mobile bowls) gets a ready-to-paste
prompt. Screen IDs (A1…D5) match `design.md` §3.

---

## 1. How to use Stitch for this project (read first)

Grounded in Google's official Stitch Prompt Guide + community testing:

1. **Web (desktop) mode for batches A–D.** Flip Stitch to **mobile** only for the Mobile batch at the end.
2. **One screen per prompt.** Long prompts (5,000+ chars) make Stitch drop components — keep each
   prompt ≤ ~3,000 chars. These prompts are all sized accordingly.
3. **The STYLE block is your theme control.** Paste it at the top of *every* screen prompt so the theme
   stays consistent across 29 screens. Do not paraphrase it — exact hexes matter.
4. **Iterate with 1–2 changes per follow-up prompt.** ("Make the hero image larger." NOT "make the
   hero bigger, change button color, add a footer.") Stitch rebuilds and forgets when you stack changes.
5. **Save a screenshot / export after every screen that works.** Stitch regenerates aggressively.
6. **Order matters:** do landing page (A1) first, tune the vibe there, then batch the rest.
7. If Stitch ignores the cream background: "Set the page background to cream hex FAF7F2. Only cards
   and the nav use white."
8. Design **with realistic data** — the prompts embed real-looking names, ₦ prices and ratings. Keep them.

**Suggested batches:** A (public, 4 screens) → B (learner, 7) → C (creator, 9) → D (admin, 5) → E (mobile, 8).

---

## 2. The STYLE blocks (paste at the top of every prompt)

### 2A. STYLE-DESKTOP (batches A–D)

```
STYLE — match exactly:
App: "Interlekt", a learning-community platform for African creators and learners (paid communities in Nigerian naira).
Background: cream #FAF7F2. Cards & nav: white #FFFFFF with 1px border #E7E2D9, corner radius 16px; popovers/modals get a soft shadow.
Primary action color: saturated amber #F59E0B with dark navy #10233F text, fully rounded pill buttons, min-height 44px.
Secondary buttons: white pill with 1px #10233F/20 border.
Trust/progress accent: deep teal #0F766E (badges, progress bars) — teal is never a button.
Success #15803D, error #B91C1C.
Headings: Sora, semibold, dark navy #10233F. Body/UI: Inter, #1A2B3C, 15–16px. Muted text #667085.
Dark sections (use sparingly): #10233F background, white text, amber accents.
Photography: warm natural-light photos of Nigerian/African learners and mentors. Realistic demo data with naira prices like ₦8,500/mo.
Do not use: light-blue pastel theme, purple gradients, glassmorphism, neon, emoji-as-icons.
```

*(C-batch add-on line: append this sentence to the prompt when ID starts with C:*
`This screen is inside the creator "Studio" — add a 240px left rail, cream background, with a community switcher on top and nav items: Overview, Members, Transactions, Course builder, Lesson editor; active item is a soft amber pill.` *)*

*(D-batch add-on line: append when ID starts with D:*
`This screen is the Interlekt admin operations console — add a 220px fixed left rail with dark navy #10233F background, white/70 text, amber active indicator, nav: Overview, Users, Verification, Reports, Transactions.` *)*

### 2B. STYLE-MOBILE (batch E)

```
STYLE — match exactly (mobile app screens):
App: "Interlekt", learning-community platform for African learners and creators, Nigerian naira pricing.
Background cream #FAF7F2; cards white #FFFFFF, radius 16px, 1px border #E7E2D9.
Primary CTA: amber #F59E0B pill with dark navy #10233F text; secondary = outlined white pill.
Accent teal #0F766E for progress/verification; success #15803D; error #B91C1C.
Type: Sora semibold headings #10233F; Inter body #1A2B3C.
Bottom tab bar for logged-in learners: Home, Explore, My learning, Profile — white bar, hairline top border, amber active icon+label.
Min tap target 44px, 56px tall inputs, sticky bottom CTA where a purchase/join action exists.
Warm natural-light photos of Nigerian learners/mentors. Realistic naira data. No pastel blue, no purple gradients, no glassmorphism.
```

---

## 3. Batch A — Public (desktop web)

### A1 — Landing page (generate this FIRST and tune until you love it every other screen inherits the feel)

```
[paste STYLE-DESKTOP]

Design a stunning desktop web landing page for "Interlekt", a learning-community platform where African creators teach through paid communities and learners join them in naira.

Sections top to bottom:
1. Top nav: white, 64px, "Interlekt" wordmark left (Sora bold), links Explore, For creators, About; right: ghost "Sign in" + amber pill "Get started".
2. Hero on cream: left-aligned in a 2-column split — left: huge Sora heading "Learn with people who've done it." subtext "Join paid learning communities led by verified Nigerian experts. Pay in naira, learn in public, grow with the room." plus a large search input with amber pill search button and popular category chips below (Tech, Business, Design, Finance, Agriculture). Right: a collage-style composition of two overlapping photos of Nigerian learners/mentors in warm light, with a floating white card showing a mini community profile: cover image, title "AI Engineering Foundations", creator avatar "Ada Okafor" with teal Verified badge, star rating 4.9 (212), member avatars stack, price "₦8,500/mo" in Sora semibold.
3. Trust strip: one row on a white band — teal shield icon "Verified creators", users icon "12,400+ learners", wallet icon "₦ paid out weekly", star icon "4.8 average rating".
4. Featured communities: heading "Communities to grow with" + grid of 4 community cards (cover image, title, creator + verified badge, members count, star rating, price ₦ or green "Free").
5. How it works: 3 numbered steps in a row — "Find your room", "Join in one tap", "Learn & build in public" — with thin connecting line, no icon tiles.
6. Dark creator band (#10233F): left editorial heading "Teach what you know. Earn in naira." with subtext and amber pill CTA "Start teaching"; right side: a white dashboard-card mock showing revenue stat ₦262,500, members bar chart, and "New paid member — ₦8,500" toast card with teal check.
7. Summary/footer band: short line "Built for African learners & creators." + footer with 3 link columns on #0B1B2B background.
```

### A2 — Explore / directory

```
[paste STYLE-DESKTOP]

Design the "Explore" community directory page for Interlekt (desktop web).

Layout:
1. Same top nav as landing; below it a compact page header: Sora H1 "Find your community" + subtext, and a large centered search bar with amber button.
2. Category chips row (pills): All communities, Technology, Business, Design, Finance, Agriculture, Wellness, Language — active chip dark navy with white text.
3. Results toolbar: left "128 communities" muted count; right: sort dropdown "Most popular" and toggle "Free only".
4. Grid of 9 community cards: cover image (16:9), title 2-line clamp, creator row (avatar + name + teal verified check), footer row (members icon-count, star rating, price "₦5,000/mo" or green "Free").
5. Pagination: centered pills "‹ 1 2 3 … ›" with active amber.
6. One card should show a soft amber "New" tag, one a teal "Verified creator" ribbon.
```

### A3 — Community detail (the most important screen)

```
[paste STYLE-DESKTOP]

Design the community detail page for "AI Engineering Foundations" on Interlekt (desktop web). This page must earn trust in one glance.

Layout (two-column ≥1200px):
1. Hero band under nav: community cover image as a wide banner with rounded 24px, category chip "Technology", title in Sora 32px, creator row (56px avatar, "Ada Okafor", verified badge, "AI Engineer · Lagos").
2. Sticky right rail (360px): white card with price "₦8,500" Sora 32px + "/month" muted; green check row "First 7 lessons free to preview"; members avatars stack "+1,240 members"; primary amber CTA "Enroll now"; secondary outlined "Preview curriculum"; small muted line "Secure payment via Paystack in naira".
3. Left column sections separated by generous space:
   a. "About this community" paragraph + tag chips (Python, LLM apps, Career switch).
   b. "What you'll learn" 2x2 checklist with teal checks.
   c. "Curriculum preview" — course outline card: 3 modules as accordion headers with lesson count + duration, first lesson row shows amber "Free preview" tag, locked rows show small lock icon.
   d. "Meet your mentor" — horizontal card: photo, bio 2 lines, stats row (communities 3 · members 1,240 · rating 4.9).
   e. "Member reviews" — average 4.9 big Sora number + star row + 3 review cards (avatar, name, date, stars, 2-line text).
   f. "Recent activity" — 3 compact post previews showing names and two-way conversation.
4. Mobile note: right rail becomes a sticky bottom bar with price + "Enroll now".
```

### A4 — Creator profile

```
[paste STYLE-DESKTOP]

Design the public creator profile page for "Ada Okafor" on Interlekt (desktop web).

Layout:
1. Cover banner (photo, warm light) with overlapping 96px avatar card below-left.
2. Identity block: Sora H1 name, teal "Verified" badge, headline "AI Engineer · teaching 1,240 learners", bio paragraph, social links (website, X).
3. Trust stat row: 4 stat cards — Communities 3, Total learners 1,240, Average rating 4.9 (212), Member satisfaction 94%.
4. "Communities by Ada" — grid of 3 community cards (cover, title, members, rating, ₦ price or green Free).
5. "What members say" — two review cards side by side.
```

### A5–A7 — Auth trio

```
[paste STYLE-DESKTOP]

Design the sign-in page for Interlekt (desktop web): split-screen card layout — left half: hero side on dark navy #10233F with warm photo of a Nigerian mentor, short quote card from a learner, and three tiny trust bullets; right half on cream: Sora heading "Welcome back", email and password inputs (44px, rounded 12px), "Remember me" checkbox + "Forgot password" link, amber pill "Sign in", divider "or", Google button (white, official G mark), footer line "New here? Create an account". Show one inline validation example: error text in red under the email field.

Design the register page in the same style: role chooser first — two large selectable cards side by side "Learner — Join & learn" (graduation icon) and "Creator — Teach & earn" (presentation icon), the Learner card selected with amber border + soft amber fill; then First name, Last name, Email, Password inputs; amber pill "Create account"; terms line at bottom.

Design the forgot-password page in the same style: single centered card on cream, heading "Reset your password", email input, amber pill "Send reset link", muted helper text "We'll only use this to reset your password.", success state variant showing a teal confirmation card with check icon.
```

---

## 4. Batch B — Learner (desktop web, logged-in top nav + center content max 1100px)

*(Logged-in top nav note to append to each B prompt:*
`Logged-in learner top nav: Interlekt wordmark, center search field, right: notification bell with amber dot, avatar menu.`*)*

### B1 — Learner dashboard

```
[paste STYLE-DESKTOP]

Design the learner dashboard for "Chidi" on Interlekt (desktop web).

Layout:
1. Greeting header (no eyebrow label): Sora H1 "Welcome back, Chidi." + subtitle "You're 2 lessons from finishing Module 2 of AI Engineering Foundations." + amber pill "Resume lesson".
2. Continue learning hero card (wide): course cover thumb, course title, lesson "Module 2 · Lesson 7: Building your first RAG pipeline" with teal progress bar 64%, right amber button "Continue".
3. Stat row: 3 stat cards — "Lessons completed 38" (+4 this week in teal), "Communities 2", "Learning streak 6 days" with small flame icon.
4. "My communities" — 2 community cards with inline progress: cover, title, next lesson name, progress %.
5. "Upcoming for you": two rows — live session card with date chip + community pick suggestion card with cover.
```

### B2 — My communities

```
[paste STYLE-DESKTOP]

Design the "My communities" page (desktop web): Sora H1 "Your communities", filter chips (All, Active, Free, Paid), grid of 4 membership cards: cover image, title, creator name + verified badge, membership price paid ("₦8,500/mo" muted), and either a teal "Active" tag or amber "Action needed" tag. Below: a quiet "Past memberships" divider with one greyed card. Include an empty-state variant: centered illustration circle with checklist icon, "You haven't joined a community yet", subtext, amber pill "Explore communities".
```

### B3 — Classroom (course overview)

```
[paste STYLE-DESKTOP]

Design the classroom page for community "AI Engineering Foundations" (desktop web).

Layout:
1. Slim header: back link to community, Sora H1 "Classroom", right: overall course progress ring "62%".
2. Course card (large, white): left 88% width — course title "AI Engineering Foundations", description line, teal progress bar, meta "12 lessons · 8h 40m"; right column inside card: "Your progress 62%" + amber "Continue — Module 2 · Lesson 7".
3. Below: module accordion list (Module 1 Fundamentals, Module 2 Building with LLMs, Module 3 Ship your project). Each module row: number, title, "4 lessons", chevron expanded showing lesson rows: status circle (teal check complete / empty circle / video play icon), lesson title, right-side duration + lock icon for locked ones. Lesson rows hover cream.
4. Right rail (desktop): community mini card (cover, title, creator avatar), "Community feed" shortcut, "Your instructor" card with avatar + verified badge.
```

### B4 — Lesson view

```
[paste STYLE-DESKTOP]

Design the lesson viewer page (desktop web) for Interlekt.

Layout (split with right rail):
1. Main column: breadcrumb "AI Engineering Foundations / Module 2 / Building your first RAG pipeline"; lesson title Sora 28px; large video player 16:9 dark rounded-16px with play button and a duration chip, beneath it the lesson body: rich text 16px/1.7 with subheadings, one code snippet block on #0B1B2B, one resource list; bottom bar: outlined "Mark incomplete" variant shown when completed — default state shows teal outline "Mark as complete" + prev/next lesson buttons right.
2. Right rail (340px): "Up next" list of lessons with status icons; community card; discussion prompt card "2 questions about this lesson — ask the community" with outlined button.
3. Completed-state variant: teal banner chip top-right of the title "Completed ✓".
```

### B5 — Community feed

```
[paste STYLE-DESKTOP]

Design the community feed for "AI Engineering Foundations" (desktop web).

Layout (two-column ≥1024px):
1. Main column: main feed: 
   a. Composer card (top): "Share something with the room…" input row with avatar; below composer show one pinned announcement post with teal soft background strip: "📣 Announcement · Accessibility day mock interviews Friday" by Ada (Creator tag amber-soft); then 3 regular posts: avatar, name, time "2h ago", body text, one post has a photo attachment, like + comment + share icon row with counts.
   b. Two-column comment preview inside the first post.
2. Right rail: about card (cover, members 1,240, creator verified), members preview avatars, community guidelines card.
3. Mobile variant: composer docked as bottom bar with pencil FAB.
```

### B6 — Enroll / checkout (Paystack)

```
[paste STYLE-DESKTOP]

Design the enroll & checkout page (desktop web) for a paid community on Interlekt, that looks like a trusted Nigerian fintech checkout.

Layout (two columns):
1. Left: "Your order" card: community cover thumb, title "AI Engineering Foundations", creator row (avatar + verified), plan selector: two selectable plan rows — "Monthly ₦8,500/mo" (selected, amber border) and "One-time ₹49,999 lifetime" style row for "₦65,000 lifetime"; divider; price rows: "Community access ₦8,500", "Interlekt service fee ₦425" muted; total row Sora bold "₦8,925"; secure badges row: Paystack logo chip + "SSL secured" + "🔒 Pay in naira".
2. Right: "What you get" check-list card (teal checks): classroom access, feed, live Q&As, certificate track; below it "Meet your mentor" mini card; below, small guarantee line card "7-day preview lessons before you pay — no surprises".
3. Sticky footer CTA bar (mobile): total left, amber "Pay ₦8,925" pill right.
4. Include a success-state variant design: centered teal check circle card "You're in!", summary of community, primary buttons "Go to classroom" + secondary "Open community feed".
```

### B7 — Profile

```
[paste STYLE-DESKTOP]

Design the learner profile & settings page (desktop web): header with 96px avatar, name "Chidi Okeke", learner tag, stats row (communities 2 · lessons completed 38 · streak 6 days); tabs: Profile, Interests (chips grid with selectable amber pills), Account (email, country = Nigeria flag chip, password row with change link), Payments (2 receipt rows: community, amount ₦, date, status teal "Paid"); save button sticky bottom-right.
```

---

## 5. Batch C — Creator Studio (append the Studio-rail line from §2A to every prompt)

### C1 — Onboarding

```
[paste STYLE-DESKTOP + studio rail line]

Design the creator onboarding page (desktop web) — a focused 3-step flow, no rail on this screen, centered 720px card on cream.

Step indicators at top (1. Your profile → 2. Expertise → 3. Your first community). Card contains: Sora heading "Set up your creator profile", avatar upload circle with camera icon, headline input "e.g. AI Engineer · Lagos", bio textarea with live char count, expertise chip multi-select (Pill options like Python, Product, Design, Data) with 3 selected in amber soft; footer: secondary "Back" outline + amber "Continue". Show step 2 as a right-side preview card: "This is how learners will see you" mini creator profile card. Include a warm mentor photo strip at the top of the card for encouragement.
```

### C2 — Studio home

```
[paste STYLE-DESKTOP + studio rail line]

Design the Creator Studio home (desktop web): Sora H1 "Your studio" + amber pill "New community". Stat row: Revenue this month ₦262,500 (+12% teal delta), Total members 1,842, Paid members 312, Communities 4. Below: wide "Earn in naira" banner card (amber soft bg): gross vs fee explainer "You keep ₦249,375 after platform fees" with vertical bar mini-chart. Then "Your communities" grid: 4 management cards (cover, title, status pill draft/published, members count, revenue ₦, action arrow) — one card shows empty-teal draft state with amber "Finish setup". Then "Recent activity" row: 3 compact event rows: "New paid member — ₦8,500" teal check, "Lesson published", "Member completed course 2".
```

### C3 — New community (wizard)

```
[paste STYLE-DESKTOP + studio rail line]

Design the "Create a community" wizard (desktop web): centered 860px card with 3-step header (1 Basics → 2 Pricing → 3 appearance). Step 1: cover image dropzone with camera icon, title input, description textarea with helper text "What will members learn and who is it for?", category select, tag chips input. Step 2: pricing radio cards — "Free — no card required" and "Paid — set your price in ₦" selected with amount input showing ₦ formatting and helper "You keep 97% after Interlekt's fee"; billing toggle monthly/lifetime. Step 3: live preview of how the community card will appear in Explore. Footer: back + amber "Create community". Include a publish-readiness checklist variant: white card with checklist items (cover image, at least 1 lesson, description ≥ 20 words) with teal checks and one pending amber item.
```

### C4 — Community manage

```
[paste STYLE-DESKTOP + studio rail line]

Design the manage page for one creator community (desktop web): breadcrumb "Studio / AI Engineering Foundations"; header: cover thumb, title, status pill published (teal), quick action buttons (amber "Edit", outlined "View public page", danger-outline "Archive"). Stat row: Members 1,240 · Paid 312 · Revenue ₦412,500 · Rating 4.9. Two-column body: left: revenue mini chart card + recent transactions rows (name, ₦, date, status); right rail: shortcuts list (Members, Transactions, Course builder, Lesson editor, Community settings) as compact rows, and "Invitations" card with a copy-link row.
```

### C5 — Members

```
[paste STYLE-DESKTOP + studio rail line]

Design the members management table (desktop web): toolbar with search input, status filter select, export icon; header row: Member, Joined, Plan (Free/Paid pill), Progress, Rating given, Actions (kebab menu). 10 realistic member rows with avatars, names like "Tunde Bakare", tabular ₦ amounts for paid rows, teal "Active" pills, two rows "Payment failed" red pill, one row highlighted with amber left-border "Flagged". Show pagination; sticky table header. Mobile variant note: rows become stacked cards with avatar + name + plan pill.
```

### C6 — Transactions

```
[paste STYLE-DESKTOP + studio rail line]

Design the transactions/revenue page for a creator community (desktop web): top 4 stat cards (Gross revenue ₦412,500, Platform fee −₦20,625 muted red, Your earnings ₦391,875 teal, Payouts 2); date-range picker chips; ledger table: Date, Member, Reference (mono), Plan, Gross ₦, Fee ₦, Net ₦ semibold, Status (teal Paid / amber Pending / red Failed). Rows tabular right-aligned money. Below: monthly payout card "Next payout Friday · ₦124,000 to GTBank ••4521" with outlined "View payout schedule". Export CSV ghost button top-right.
```

### C7 — Course builder

```
[paste STYLE-DESKTOP + studio rail line]

Design the course builder (desktop web): full-width builder layout, no page padding. Left column (300px): community/course tree — courses list with dots, modules under selected course as collapsible tree with lesson rows; drag handles (grip dots) visible on hover; selected item amber-soft background; bottom "New module" ghost button. Right column: module editor with title input, description, "Add lesson" ghost-border card row; below, a lessons table with inline rename, duration, publish toggle (teal switch), preview-tag column, kebab. Show a drag-in-progress state: one module row slightly lifted with amber outline at drop position. Right-top action bar: amber "Publish course" + outlined "Preview as learner".
```

### C8 — Lesson editor

```
[paste STYLE-DESKTOP + studio rail line]

Design the lesson editor (desktop web): two panes in a builder layout. Left (320px): course > module breadcrumb tree with the selected module expanded, lesson list rows with type icons (video = play, text = doc), active lesson highlighted amber-soft, "+ New lesson" ghost button. Right: big editor card — title input (large, Sora 22px), content-type segmented toggle Text | Video, when Video: video URL row + "Preview embed" thumbnail placeholder, duration chip; when Text: rich toolbar (bold, italic, H2, list, code) above a clean textarea; publish toggle row with teal switch and "Free preview" amber-soft checkbox; footer right: outlined "Delete" red text + amber "Save lesson". Include an autosaved chip "Saved 12:41" muted.
```

---

## 6. Batch D — Admin (append the admin-rail line from §2A to every prompt)

### D1 — Overview

```
[paste STYLE-DESKTOP + admin rail line]

Design the admin platform overview (desktop web): Sora H1 "Platform overview" + date chip "Last 30 days" dropdown. Top: 6 compact stat cards in a 3x2 grid — Users 6,218 (+4.8% teal), Creators 214, Communities 486, Enrollments 9,832, Gross revenue ₦42.1M, Platform fees ₦2.1M. Middle: half-width panels — left: "Revenue trend" area chart on white card; right: "Queues" card: 3 actionable rows with counts and amber arrows (Creator verifications 3 pending, Open reports 1, Payments pending 7) — queues are the emphasis. Bottom: recent signups table 5 rows + recent transactions table 5 rows with ₦ tabular and status pills.
```

### D2/D3 — Verification & Reports (single prompt, two variants)

```
[paste STYLE-DESKTOP + admin rail line]

Design two admin ops screens (desktop web):

1. "Creator verification" review page: header with pending count badge "3 pending"; main card: left — creator dossier (avatar, name, headline, submitted evidence link card, statement quote block, account age chip); right — decision panel: outlined textarea "Reviewer note", amber "Approve" pill + red-outline "Reject" pill; below, previous decisions compact list with teal Approved / red Rejected tags.

2. "Reports / moderation" triage page: filter chips (All, Open, Resolved); table of reports: reporter avatar, reported item preview (post snippet with author), reason pill (amber soft "Spam", red "Harassment"), date, status, action kebab; one expanded detail panel showing full post context with nested comment, and action bar (soft "Remove content", "Suspend user", muted "Dismiss").
```

### D4/D5 — Users & Transactions (single prompt, two variants)

```
[paste STYLE-DESKTOP + admin rail line]

Design two admin money/users screens (desktop web):

1. "Users" directory: toolbar search + role filter select; dense table: user (avatar+name), email muted, Role pill (Learner neutral / Creator teal-soft / Admin ink), Communities count, Enrollment count, Joined, Status (teal Active / red Suspended), kebab; sticky header; one suspended row shows red-outline avatar ring.

2. "Transactions" ledger: filter bar (status select, date range, community search); 4 compact totals above as inline text (Gross ₦42.1M · Fees ₦2.1M · Creator payable ₦38.4M · Settled 97%); table: Date, Amount ₦ right-aligned tabular, Community, Learner, Provider ref mono, Status pill, Split column showing "₦8,500 → fee ₦425 → net ₦8,075" as compact muted math; pagination.
```

---

## 7. Batch E — Mobile (flip Stitch to mobile mode; use STYLE-MOBILE)

| # | Screen | Prompt |
|---|---|---|
| E1 | Mobile home | `Design the mobile home screen for Interlekt (mobile app format): compact top bar with wordmark + bell; big search pill; category chips scroll row; "Featured" horizontal snap carousel of tall community cards (cover, title, creator + verified, ₦ price); "Continue learning" card with teal progress; bottom tab bar: Home (amber active), Explore, My learning, Profile.` |
| E2 | Mobile explore | `Design the mobile Explore screen: search field top, sticky category chip row, vertical list of community cards (full-width, cover 16:9), infinite-scroll feel, floating count bubble. Price and rating always visible on card footer.` |
| E3 | Mobile community detail | `Design the mobile community detail page: cover image top with back chip; title + creator row; sticky bottom bar with price "₦8,500/mo" and full-width amber "Enroll now"; sections stacked: About, What you'll learn (2x2 checks), curriculum accordion with "Free preview" tag rows one open, mentor card, reviews. Min tap 44px.` |
| E4 | Mobile feed | `Design the mobile community feed: composer bar docked above the tab bar ("Share something…", pencil icon); announcement post with teal tint strip pinned top; post cards with avatar/name/role tag/time, body, image attachment, comment count; full-width layout, generous padding.` |
| E5 | Mobile classroom | `Design the mobile classroom: course card with ring progress 62% and "Continue" amber button; module accordions; lesson rows with status circles and lock icons; everything single-column, 56px rows.` |
| E6 | Mobile lesson | `Design the mobile lesson screen: video player full-bleed 16:9 on top (dark), title below, lesson body text, sticky bottom action bar: prev/next lesson arrows + teal "Mark complete" outline button. Tab bar hidden on this screen.` |
| E7 | Mobile dashboard | `Design the mobile learner dashboard: greeting "Welcome back, Chidi", streak flame chip, continue-learning hero card with progress, stat strip of 2 cards horizontal, my-communities vertical list, bottom tab bar with Home active.` |
| E8 | Mobile studio | `Design the mobile creator studio (mobile): greeting + avatar menu, revenue stat hero card amber-soft "You earned ₦124,000 this month", community list with management rows, "+" FAB for new community bottom-right, no bottom tab bar (use back arrows + top bar).` |

---

## 8. Iteration cookbook (paste-after-generate, ONE at a time)

| Goal | Prompt |
|---|---|
| Bigger hero presence | `Make the hero section 20% taller and the headline — "Learn with people who've done it" — 2x larger. Do not change anything else.` |
| CTA not punchy enough | `Set every primary button to amber #F59E0B with #10233F text and make the hero CTA 52px tall.` |
| Cards look flat | `Give community cards a 1px #E7E2D9 border, 16px radius and lift shadow only on hover. Background of the page stays cream #FAF7F2.` |
| Too corporate | `Swap all photography for warm candid photos of Nigerian learners in workshops. Keep layout identical.` |
| Money legibility | `Render all prices in Sora semibold with the ₦ symbol, and make every "Free" label green #15803D.` |
| Reduce noise | `Remove all uppercase eyebrow labels and icon-tile decorations; let headings and photos carry hierarchy.`
| Table density | `Make admin table rows 56px tall with muted 12px uppercase column headers and tabular money alignment.` |
| Dark section polish | `Make the creator band background #10233F with white text, amber accents and a large editorial serif-feel Sora heading.` |
| Trust visibility | `Add a teal check "Verified" badge next to every creator name wherever a creator appears.` |
| Empty states | `Add a designed empty state: centered teal-soft circle with icon, Sora title, one-line muted explanation, one amber pill action.` |
| Color drift | `Re-anchor theme: cream #FAF7F2 background, white cards, amber #F59E0B CTAs, ink navy #10233F headings. No pastel blue anywhere.` |

**Self-check after each screen** (the anti-slop pass): no purple/blue gradient; no glassmorphism; cream
background actually applied; ≤1 eyebrow; every creator has a verified badge where relevant; every ₦
price visible on cards; one primary CTA per viewport; photography actually Nigerian/warm.
