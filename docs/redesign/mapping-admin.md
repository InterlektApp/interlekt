# Mapping — Admin Operations (9 screens)

## Summary
- Screens mapped: 9
- LIVE: 0 · PARTIAL: 1 · MOCK: 0 · NEEDS-BACKEND: 8
- Backend endpoints used (existing, verified live 2026-10-21):
  - `PATCH /api/v1/admin/creators/{user_id}/verification` — body `VerificationStatusUpdateRequest{status: pending|verified|rejected}` → `CreatorProfileResponse` (the only admin route in the API)
  - `GET /api/v1/users/{user_id}` → `ProfileResponse` (public, **no email**)
  - `GET /api/v1/creators/{user_id}` → `CreatorProfileResponse` (public)
  - `GET /api/v1/communities` → `PaginatedResponse_CommunityListItem_` (`total` = community count; `items[].creator.verificationStatus` is the only discovery path for pending creators)
  - `GET /api/v1/communities/{slug}` → `CommunityDetail`
  - `GET /api/v1/communities/{slug}/members` → `PaginatedResponse_MemberResponse_` (**creator-of-that-community only**)
  - `GET /api/v1/categories` → `CategoryResponse[]` (8 real categories)
  - `GET /api/v1/auth/me` → `AccountResponse` (admin identity; `roles` includes `admin`)
  - `DELETE /api/v1/posts/{post_id}` (D4 "Remove post"), `DELETE /api/v1/enrollments/{enrollment_id}` (D8 cancel)
- Backend endpoints that must be built (all `NEW`, full contracts in §Per-screen detail + §Backend gaps):
  `GET /api/v1/admin/stats` · `GET /api/v1/admin/users` · `GET /api/v1/admin/users/stats` · `PATCH /api/v1/admin/users/{user_id}` · `POST /api/v1/admin/users/invite` · `GET /api/v1/admin/users/export.csv` · `GET /api/v1/admin/creators/verification` · `GET /api/v1/admin/creators/verification/{user_id}` · `POST /api/v1/admin/creators/verification/{user_id}/notes` · `GET /api/v1/admin/creators/verification/stats` · `POST /api/v1/reports` · `GET /api/v1/admin/reports` · `GET /api/v1/admin/reports/stats` · `PATCH /api/v1/admin/reports/{report_id}` · `GET /api/v1/admin/transactions` · `GET /api/v1/admin/transactions/summary` · `GET /api/v1/admin/transactions/export.csv` · `GET /api/v1/admin/audit-log` · `GET /api/v1/admin/audit-log/export.csv` · `GET /api/v1/admin/payouts` · `GET /api/v1/admin/payouts/stats` · `POST /api/v1/admin/payouts/{payout_id}/decision` · `GET /api/v1/admin/payouts/recent-decisions` · `GET /api/v1/admin/payouts/schedule` · `POST /api/v1/creators/me/payouts` · `GET /api/v1/admin/refunds` · `GET /api/v1/admin/refunds/stats` · `POST /api/v1/admin/refunds/{refund_id}/decision` · `POST /api/v1/enrollments/{enrollment_id}/refund-request` · `GET /api/v1/admin/settings` · `PATCH /api/v1/admin/settings` · `POST /api/v1/admin/settings/api-keys` · `DELETE /api/v1/admin/settings/api-keys/{key_id}` · `POST/PATCH/DELETE /api/v1/admin/settings/webhooks[/{id}]` · `POST/PATCH /api/v1/admin/settings/roles[/{id}]`

**Shell-level finding that drives every row below:** the live admin surface is exactly one write route. There is **no** admin read endpoint of any kind — no user list, no community list, no platform stats, no reports, no ledger, no audit log, no payouts, no refunds, no settings. Eight of nine screens are therefore **NEEDS-BACKEND**; D3 is **PARTIAL** because its decision buttons map 1:1 onto the one live route.

## Table
| Screen ID | Design file | Next.js route | Status | Backend endpoint(s) | Data fields the screen needs | Notes / gaps |
|---|---|---|---|---|---|---|
| D1 | `admin/D1-platform-overview.html` | `/overview` — **EXISTING** (static placeholder; 4 tiles render "—", zero fetches) | **NEEDS-BACKEND** | (none usable) `GET /api/v1/communities` gives `total` only | users total + Δ7d · communities total + Δ7d · enrollments total + Δ7d · revenue 30d + MoM · 30-day revenue series · 3 queue counts (verifications/reports/payout ₦) · support tickets · 6-row activity feed (timestamp/type/description/user/action) · top-5 communities by revenue (members, revenue, growth %) · top-5 states by member count + "others" | Only `communities.total` (4 live) is derivable. Everything monetary/geographic/temporal needs a stats subsystem. |
| D2 | `admin/D2-users.html` | `/users` — **EXISTING** (static; 3 "Unavailable" cards, one `colSpan=4` empty row) | **NEEDS-BACKEND** | `GET /api/v1/users/{user_id}` (no email/status/community count) | 4 mini-stats (total / verified creators / suspended / new-this-week) · search + role + status + joined filters · 7 table columns (user+email, role, joined, communities, status, last active, 3-dot menu) · result count · pagination 1…48 · Export CSV · Invite user · suspend/activate/promote | `GET /users/{id}` omits email, `isActive`, `lastActiveAt`, community count. `GET /auth/me` is self-only. No admin user list exists. |
| D3 | `admin/D3-creator-verification.html` | `/verification` — **EXISTING** (static; "Queue unavailable", explicitly does not call the live PATCH) | **PARTIAL** | **`PATCH /api/v1/admin/creators/{user_id}/verification`** ← live today · `GET /api/v1/creators/{user_id}` · `GET /api/v1/users/{user_id}` · `GET /api/v1/communities` (`items[].creator.verificationStatus`) | queue + tab counts (pending/approved/rejected/all) · applied date + application #VA-318 · community + member count · 3 evidence pills (ID / work / LinkedIn) · ID type + document link + NIMC auto-verify · work proof (employer, role, period, 3 links) · bio · recent activity (3 items) · internal note · **Approve / Reject / Request more info** · 3-step checklist · approval history (4 entries w/ admin + timestamp) | The **decision action** works live today (status `verified`/`rejected`/`pending`). The entire read side — queue, evidence, notes, checklist, history — needs new endpoints. `VerificationStatusUpdateRequest` currently accepts **only** `status` (no note/reason). |
| D4 | `admin/D4-reports.html` | `/reports` — **EXISTING** (static; 3 "Unavailable" cards) | **NEEDS-BACKEND** | `DELETE /api/v1/posts/{post_id}` (Remove post only) | 4 mini-stats (open / resolved 7d / avg 4h 12m + median 2h 38m / escalated 2) · status tabs + reason + severity filters · 5 report cards (report #ID, severity badge, reason tag, age, quoted content, reporter count + feed name, reported user + member-since/communities/posts) · 6 action buttons (View post, Remove post, Warn, Suspend, Dismiss, Resolve) | No report entity exists at all — nothing can create or list one. Also needs a *learner-side* report submission route or the queue is permanently empty — no reports can ever be filed. |
| D5 | `admin/D5-transactions.html` | `/transactions` — **EXISTING** (static; 3 "Unavailable" cards) | **NEEDS-BACKEND** | `GET /api/v1/communities` (price *list*, not a ledger) | 4 stats (gross ₦214.4M, fees ₦25.7M/10%, payouts ₦188.7M/88%, refunds ₦2.14M/1.0%) · 30-day gross+fees dual-area series · 5 filters (range, status, community, method, search) · 11 columns (txn ID, date, member, community, plan, method, gross, fee, creator net, status, view) · page footer totals · Export ledger | **No payment endpoint exists.** `CommunityListItem.priceAmount` is a list price; `POST /communities/{slug}/enroll` is free-only. Whole subsystem. |
| D6 | `admin/D6-audit-log.html` | `/audit-log` — **NEW** | **NEEDS-BACKEND** | (none) | 6 columns (timestamp w/ WAT, actor avatar+name+role label, action badge, target, IP mono, free-text details) · 12 distinct action types · actor filter (admins/creators/system) · action filter (5 groups) · search · date-range segmented (Today/7d/30d/Custom) · "248 events today" + "12,408 all-time" counts · Export | No audit table, no instrumentation. Depends on the same event store that would serve D1's activity feed. |
| D7 | `admin/D7-payout-approval.html` | `/payout-approval` — **NEW** | **NEEDS-BACKEND** | (none) | 4 stats (pending 12, approved today 48 / 5 admins, held today 3, total pending ₦4.2M / 12 creators) · tabs (12/248/18/278) · amount band + creator search · 5 payout cards (payout ID, submitted-ago, amount, requested timestamp, creator + verified avatar + title + communities/members/tenure, bank name + ••••last4, requested amount, net-after-fee + fee note, 4 evidence stats: revenue 30d / refund rate % / complaint rate % / first payout date) · Approve / Hold / View profile · **large-payout 2-admin rule** ("Approve (1 of 2)") · 4 approval guidelines · 4 recent decisions (amount, creator, admin, ago) · payout schedule (Friday 9am WAT, next in 3 days) · Export | No payout model, no creator bank accounts, no approval workflow. Requires a 2-signature rule. |
| D8 | `admin/D8-refund-approval.html` | `/refund-approval` — **NEW** | **NEEDS-BACKEND** | `DELETE /api/v1/enrollments/{enrollment_id}` (cancel only) | 4 stats (pending 8, approved today 24, rejected today 3, total pending ₦64,200 / 8 learners) · tabs (8/142/18/168) · reason filter + learner search · 5 cards (refund ID, submitted-ago, amount, reason label, learner + member-since/communities/prior-refunds, 4-col order block: order ID / community / amount / purchased date, learner note blockquote, eligibility line "within 30-day window, <50% complete") · Approve / Reject / View order · policy footnote (30d monthly / 14d lifetime / auto-reject >50% complete) | No refund entity, no order, no learner-initiated refund request. Eligibility needs `lesson_progress` (exists) joined to enrollment age. |
| D9 | `admin/D9-admin-settings.html` | `/admin/settings` — **NEW** | **NEEDS-BACKEND** | `GET /api/v1/categories` (read-only, unrelated to platform config) | **General**: platform name, support email, default currency (6 options), payout schedule (4 options), revenue share (platform 10% / creator 88%), min payout ₦10,000, "last saved 2h ago by Ada Okafor" · **Feature flags**: 8 toggles (onboarding✔ lifetime✔ free✔ discounts✔ affiliate✘ cohorts✔ broadcasts✘ verification✔) · **Email templates**: 6 (welcome, payment receipt, payout notification, refund confirmation, verification approved/rejected) with subject + `{{placeholders}}` · **Roles**: 4 (Super Admin/Operator/Support/Read-only) × 6 permissions matrix + Create role · **API keys**: 2 (Production `ilk_live_••••4821` Jan 14 2026; Sandbox `ilk_test_••••9999` Feb 03 2026) + Copy/Revoke/Create · **Webhooks**: 3 (Paystack / Discord / Slack w/ event lists + delivery status) | No settings, flags, templates, admin-role model, key store, or webhook registry. **Design note: sections 2–6 ship as HTML comment blocks and must be uncommented + wired.** `UserRole` enum is `learner\|creator\|admin` — the 4 admin roles do not exist. |

## Per-screen detail

### D1 — Platform overview (`admin/D1-platform-overview.html` → `/overview`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** EXISTING — `apps/web/src/app/(admin)/overview/page.tsx`. 47 lines, **no `useQuery`, no fetch**. The `metrics` array (Users / Communities / Enrollments / Transactions) renders four tiles whose value is the literal string `—` with `aria-label="…total not available"`. The "Platform activity" card is a hardcoded empty state. **Fully static placeholder — rewrite.**
- **Sections & the data each needs:**
  1. Header — "Last updated 2 minutes ago · Auto-refresh every 60s" → client-side clock; date-range segmented control `Today | 7d | 30d | 90d | YTD` → `range` query param on the stats endpoint.
  2. Stat card **Total users** `48,209` + "+1,248 this week" → **no source**. `GET /communities` has no user count; `GET /users/me` is self-only.
  3. Stat card **Active communities** `1,140` + "+18 this week" → **PARTIAL**: `GET /api/v1/communities` → `total` (live value today = **4**). The Δ7d and the "active" (published) qualifier need a stats endpoint.
  4. Stat card **Total enrollments** `84,210` + "+1,890 this week" → **no source**. `GET /enrollments/mine` is the signed-in user's enrollments only; no platform-wide count.
  5. Stat card **Revenue (30d)** `₦214,420,500` + "+₦21.2M MoM" → **no source**. There is no money in the API at all (`priceAmount` is a list price; no transaction model).
  6. **Revenue trend** card — inline SVG area chart, Y-axis `12M/9M/6M/3M/0`, X-axis `May 1, May 5, May 10, May 15, May 20, May 25, May 30`, 30 daily points. Comparison row: "This month ₦214M · Last month ₦193M · Same period last year ₦124M". → needs `revenueSeries[]` + `revenueComparisons{}`.
  7. **Pending queues** card — 4 rows: Creator verification "3 pending" (→ D3), Reported posts "7 open" (→ D4), Payout queue "₦4.2M awaiting" + `badge-warning Awaiting`, Support tickets "12 unresolved". → 4 independent counts. Support tickets have **no backend surface at all** (no ticketing system).
  8. **Recent platform activity** table — 5 columns (Timestamp, Type, Description, User, Action) × 6 rows. Types carry distinct badge semantics: `Enrollment` (info), `Payout` (success), `Verification` (warning), `Report` (danger), `Registration` (neutral). Descriptions embed money and counts ("Payout released to Tunde Bakare — ₦487,200", "Post reported for harassment — 5 reports", "New account registered via Google"). Actor "System" is used for machine events. → needs an event feed.
  9. **Top communities by revenue** table — columns Community (title + creator name), Members, Revenue 30d, Growth ("+12.4% / vs last 30d"). 5 rows. → `memberCount` is live (`CommunityListItem.memberCount`); **revenue and growth % are not**.
  10. **Geographic distribution** — 5 horizontal ink bars: Lagos 18,402 (100%), Abuja FCT 6,108 (33.2%), Rivers 4,221 (22.9%), Oyo 3,894 (21.2%), Kano 3,108 (16.9%) + footer "35,733 members across top 5 states · 12,476 across all others". Note the bar widths are % **of Lagos**, not % of total — preserve that when porting. → **no geo field exists on any model**.
- **Reusable components:** `.admin-shell` + `ILK.injectAdminRail('overview')` · `.card`/`.card-sm`/`.card-header` · `.stat-label`/`.stat-value`/`.stat-meta`/`.text-money` · `.table` + `.name-cell`/`.meta-cell`/`.num` · `.badge badge-{info,success,warning,danger,neutral}` · `.chip chip-sm` segmented control · inline SVG area chart (accent `#0071E3` + `rev-area` gradient, no animation) · horizontal bar list.
- **Empty/loading/error states needed:** honest empty state for the chart ("No revenue yet — payments are not enabled on this platform"), skeleton for the 4 stat tiles, empty state for the activity table ("No platform events recorded"), empty state for geography ("No member locations collected"), empty state for the queue card with each count at 0 rather than hidden.
- **Backend work required:** **`NEW` `GET /api/v1/admin/stats`**
  - Query: `range=today|7d|30d|90d|ytd`, optional `communityId`.
  - Response:
    ```
    {
      "range": "30d",
      "generatedAt": "2026-10-21T12:00:00Z",
      "totals": {
        "users": 48209, "usersDelta7d": 1248,
        "communities": 1140, "communitiesDelta7d": 18,
        "enrollments": 84210, "enrollmentsDelta7d": 1890,
        "revenueAmount": "214420500.00", "revenueCurrency": "NGN",
        "revenueMoMAmount": "21200000.00"
      },
      "revenueSeries": [ { "date": "2026-09-22", "grossAmount": "6100000.00", "feesAmount": "610000.00", "refundsAmount": "0.00" } ],
      "revenueComparisons": { "currentMonthAmount": "214000000.00", "lastMonthAmount": "193000000.00", "samePeriodLastYearAmount": "124000000.00" },
      "queues": {
        "verificationsPending": 3,
        "reportsOpen": 7,
        "payoutsPendingCount": 12, "payoutsPendingAmount": "4200000.00",
        "refundsPendingCount": 8, "refundsPendingAmount": "64200.00",
        "supportTicketsOpen": 12
      },
      "activity": [ { "id":"uuid", "type":"enrollment|payout|verification|report|registration", "description":"…", "actorName":"…", "actorUserId":null, "targetId":null, "occurredAt":"…" } ],
      "topCommunities": [ { "communityId":"uuid", "slug":"…", "title":"…", "creatorName":"…", "memberCount":1240, "revenueAmount":"48420000.00", "growthPercent":12.4 } ],
      "geography": [ { "state":"Lagos", "memberCount":18402, "shareOfTopPercent":100 } ]
    }
    ```
  - Model changes: `users` gains `last_active_at`, `state` (or `country`), `created_at` index; `communities` gains a `revenue_total` aggregate or is joined to the daily rollup; new table `daily_metrics(day date, gross_amount numeric(18,2), fees_amount numeric(18,2), refunds_amount numeric(18,2), payouts_amount numeric(18,2))`; new table `platform_events` (shared with D6).
  - Effort **L** (blocked on the payments subsystem for the money fields).

### D2 — Users (`admin/D2-users.html` → `/users`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** EXISTING — `apps/web/src/app/(admin)/users/page.tsx`. Static; 3 cards render the literal string **"Unavailable"**; the table body is a single `<td colSpan={4}>` empty state reading "Account directory unavailable — The backend does not provide a user-list endpoint for this view." A blue note confirms no access-management ops. **Fully static placeholder — rewrite.**
- **Sections & the data each needs:**
  1. Header — "48,209 total · 12,408 active today"; buttons **Export** (CSV) and **Invite user**.
  2. Mini-stat **Total users** `48,209` ("All-time sign-ups"); **Verified creators** `312` ("+8 this week"); **Suspended** `84` ("0.17% of total" — computed client-side from total/suspended); **New this week** `1,248` ("+2.6% vs last week" — computed from the two counts).
  3. Filters — search input "Search by name, email, or ID…"; role select `All roles|Learners|Creators|Admins`; status select `All statuses|Active|Suspended|Pending verification`; joined select `Joined any time|Last 7 days|Last 30 days|Last 90 days|Year to date`; Clear filters; live result count `1,248 results`.
  4. Table, 7 columns: **User** (avatar + `name-cell` name + `meta-cell` email) · **Role** badge (`Creator` = badge-info, `Learner` = badge-neutral) · **Joined** (`meta-cell text-tabular`, "Mar 2024" — month-year format, not raw ISO) · **Communities** (`num`, right-aligned) · **Status** badge (`Active` = success, `Pending verification` = warning, `Suspended` = danger) · **Last active** (`meta-cell`, relative "2m ago") · **Actions** (3-dot ghost button → suspend / activate / promote).
  5. 10 sample rows cover all three role badges and all three status badges — the row set must be driven by real data, not the samples.
  6. Footer — "Showing 1–10 of 48,209" + pagination `1 2 3 … 48` (48 = totalPages for pageSize 10).
- **Reusable components:** `.table` + `.avatar.avatar-sm` (bg-image) · `.badge` role/status mapping · `.input`/`.select`/`.field` · `.pagination`/`.page-btn` · `.btn-icon.btn-ghost.btn-icon-sm` (3-dot) · `.btn-primary`/`.btn-secondary`.
- **Empty/loading/error states needed:** empty state on zero search results ("No accounts match these filters") **and** a distinct first-run state ("No accounts yet"); row-level suspended state; error state if the admin scope is missing.
- **Backend work required:** **`NEW` admin user directory**
  - **`NEW` `GET /api/v1/admin/users`** — Query: `page`, `pageSize`, `search` (name / email / uuid), `role=learner|creator|admin`, `status=active|suspended|pending_verification`, `joined=any|7d|30d|90d|ytd`, `sort`.
    Response `PaginatedResponse_AdminUserListItem_`:
    ```
    { "items": [ {
        "id": "uuid",
        "email": "tunde.bakare@paystack.com",
        "displayName": "Tunde Bakare",
        "avatarUrl": null,
        "roles": ["creator"],
        "isCreator": true,
        "createdAt": "2026-02-14T09:00:00Z",
        "joinedLabel": "Mar 2024",
        "communityCount": 3,
        "status": "active",
        "verificationStatus": "verified",
        "lastActiveAt": "2026-10-21T11:58:00Z",
        "lastActiveLabel": "2m ago"
    } ], "total": 48209, "page": 1, "pageSize": 10, "totalPages": 4821 }
    ```
    Note: `email` **must** come from `AccountResponse.email` semantics — `ProfileResponse` (public `GET /users/{id}`) deliberately omits email, so the admin read must return the private account shape.
  - **`NEW` `GET /api/v1/admin/users/stats`** → `{ "totalUsers": 48209, "verifiedCreators": 312, "verifiedCreatorsDelta7d": 8, "suspended": 84, "newThisWeek": 1248, "newLastWeek": 1216, "activeToday": 12408 }`.
  - **`NEW` `PATCH /api/v1/admin/users/{user_id}`** — body `{ "status": "active" | "suspended", "roles": ["learner","creator","admin"], "reason": "string?" }` → returns the updated `AdminUserListItem`. Must write an audit event (see D6).
  - **`NEW` `POST /api/v1/admin/users/invite`** — body `{ "email": "string", "displayName": "string", "role": "learner" | "creator" }` → `{ "inviteId": "uuid", "email": "…", "sentAt": "…" }`.
  - **`NEW` `GET /api/v1/admin/users/export.csv`** — same filter params; streams CSV.
  - Model changes: `users` gains `status` (or `suspended_at` + `suspension_reason`), `last_active_at`, `state`. Index on `(status, created_at)` and a trigram/FTS index on `display_name`/`email`. Add `admin_action_log` writes.
  - Effort **M** (new resource + read/filters/pagination + 3 write ops + export; the model additions are a handful of columns).

### D3 — Creator verification (`admin/D3-creator-verification.html` → `/verification`)
- **Verdict:** PARTIAL
- **Route status:** EXISTING — `apps/web/src/app/(admin)/verification/page.tsx`. Static; 3 cards "Unavailable"; a "Queue unavailable" pill; an explicit paragraph: *"The backend exposes a creator verification status-update route, but no queue, evidence-listing, or decision-note endpoint. **This page does not change verification status.**"* → the one live admin route is **not wired at all**. **Rewrite, and this is the only screen where a live write already exists.**
- **Sections & the data each needs:**
  1. Header — "3 pending · 12 approved this week · 4 rejected this week" → 3 counts.
  2. Status tabs — `Pending 3 | Approved 142 | Rejected 18 | All 163` + search "Search applicants…".
  3. **Expanded card (Sola Akinwale)** — avatar-lg · "Applied 2 days ago · Application #VA-318" · Collapse button · "1 community · Kippa Founder Cohort · 388 members" · evidence pills `ID submitted` (success) / `Work proof` (success) / `LinkedIn pending` (warning).
  4. Evidence detail blocks — **Submitted ID type** "NIN (National Identification Number)" + "Submitted 2 days ago · Auto-verified against NIMC" + "View document" link · **Work proof** "Kippa · Founder & CEO (2021–present)" + 3 links (LinkedIn profile / Personal website / Recent portfolio `kippa.co`) + "View links" · **Bio** (free text) · **Recent activity on platform** (3 rows: "Posted 4 lessons in …" 3d ago, "Created community …" 5d ago, "Joined Interlekt" 7d ago). Footer button "Review evidence".
  5. **Collapsed cards (Emeka Nwosu #VA-317 5d, 1 community · Freelance Dev Roadmap · 47 members; Halima Bello #VA-319 1d, 1 community · Marketing Automation · 0 members)** — name, applied date + application #, community + member count, 3 pills, "Review evidence" button.
  6. **Sticky review panel** — "Reviewing / Sola Akinwale / Application #VA-318 · Applied 2 days ago" · Identity block ("NIN — submitted 2 days ago", "Auto-verified against NIMC database", View document) · Work proof block (2 accent links + "Recent portfolio: kippa.co") · **Internal note** textarea (admin-only; pre-filled sample note) · **Decision**: Approve / Reject / Request more info · **Verification checklist** 3 steps: *Verify identity* (✓ "NIN matched against NIMC database"), *Verify work history* (✓ "LinkedIn confirmed · Kippa founder role verified"), *Confirm profile completeness* (○ "Awaiting LinkedIn connection confirmation") · **Approval history** 4 entries (Approved/Ada Okafor · by A. Operator 2h ago; Approved/Tunde Bakare 1d ago; Rejected/F. Iroko 2d ago; Approved/Kwame Mensah 3d ago).
- **What exists today (exact):**
  - **LIVE write:** `PATCH /api/v1/admin/creators/{user_id}/verification` — request `VerificationStatusUpdateRequest{ "status": "pending" | "verified" | "rejected" }`; response `CreatorProfileResponse{userId, displayName, avatarUrl, bio, expertise[], verificationStatus, isVerified, communityCount, createdAt}`. → maps to **Approve** = `verified`, **Reject** = `rejected`, **Request more info** = `pending`. Verified live: returns **401** without a bearer token, so the admin route is correctly protected; the frontend `api()` client already attaches `Authorization: Bearer` and rotates on 401.
  - **LIVE read (per creator):** `GET /api/v1/creators/{user_id}` → `CreatorProfileResponse` supplies `displayName`, `avatarUrl`, `bio`, `expertise[]`, `verificationStatus`, `isVerified`, `communityCount`, `createdAt`. `GET /api/v1/users/{user_id}` → `ProfileResponse` supplies `id`, `displayName`, `avatarUrl`, `bio`, `roles[]`, `isCreator`, `createdAt`.
  - **Partial queue discovery (client-side only):** `GET /api/v1/communities` → `items[].creator` is a `CreatorSummary{userId, displayName, avatarUrl, verificationStatus, isVerified}`. Filtering `creator.verificationStatus === "pending"` over the paginated community list yields the pending creators (live today: 1 pending — "Akaka favour", 1 community). **This is a stopgap, not the contract**: it misses creators with zero communities, cannot be filtered/paged by application state, and cannot show evidence.
  - **Missing:** application records, evidence, notes, checklist state, approval history.
- **Reusable components:** `.tabs`/`.tab`/`.tab-count` · `.avatar.avatar-lg` · `.badge` status pills · `.input`/`.textarea`/`.field-label` · `.btn-primary`/`.btn-danger`/`.btn-ghost` · inline ink checkmarks (note the design says **ink, not green** — teal is reserved for the verified avatar dot) · `.alert-info` for request-more-info.
- **Empty/loading/error states needed:** empty state per tab ("No pending applications — queue clear"); a tab-specific empty for Approved/Rejected; **"Request more info" must be honest** — the live endpoint's `pending` status is not a request-more-info state, so it needs a `reason` on the request body, otherwise the action is indistinguishable from "re-open for review"; error state when the PATCH returns 403 for a non-admin.
- **Backend work required:**
  - **Extend** `VerificationStatusUpdateRequest` → `{ "status": "pending|verified|rejected", "reason"?: string, "note"?: string, "evidence"?: { "identityStatus"?: "submitted|pending|missing", "workStatus"?: …, "linkedinStatus"?: … } }` — today it accepts **only** `status`. Effort **S**.
  - **`NEW` `GET /api/v1/admin/creators/verification`** — Query: `status=pending|verified|rejected|all`, `search`, `page`, `pageSize`.
    ```
    { "items": [ {
        "applicationId": "VA-318",
        "userId": "uuid",
        "displayName": "Sola Akinwale",
        "avatarUrl": null,
        "appliedAt": "2026-10-19T08:00:00Z",
        "appliedLabel": "2 days ago",
        "status": "pending",
        "communityCount": 1,
        "community": { "id":"uuid", "title":"Kippa Founder Cohort", "slug":"…", "memberCount":388 },
        "evidence": {
          "identity": { "status":"submitted", "idType":"nin", "idTypeLabel":"NIN (National Identification Number)", "documentUrl":"https://…", "submittedAt":"…", "autoVerified":true, "autoVerifiedLabel":"Auto-verified against NIMC" },
          "work": { "status":"submitted", "employer":"Kippa", "role":"Founder & CEO", "period":"2021–present", "submittedAt":"…", "links":[ {"label":"LinkedIn profile","url":"https://…"}, {"label":"Personal website","url":"…"}, {"label":"Recent portfolio","url":"…"} ] },
          "linkedin": { "status":"pending", "url": null }
        },
        "bio": "…",
        "expertise": ["…"],
        "recentActivity": [ { "text":"Posted 4 lessons in Kippa Founder Cohort", "occurredAt":"…", "occurredLabel":"3 days ago" } ]
    } ], "total": 163, "page": 1, "pageSize": 20, "totalPages": 9 }
    ```
  - **`NEW` `GET /api/v1/admin/creators/verification/{user_id}`** → the above + `notes[]`, `checklist[{key:"identity"|"work_history"|"profile_completeness", completed:bool, detail:string}]`, `history[{id, action:"approved|rejected|note_added|requested_info", adminName, adminUserId, note, occurredAt, occurredLabel}]`.
  - **`NEW` `POST /api/v1/admin/creators/verification/{user_id}/notes`** — body `{ "note": "string" }` → `{ "id":"uuid", "createdAt":"…" }`. Admin-only visibility.
  - **`NEW` `GET /api/v1/admin/creators/verification/stats`** → `{ "pending":3, "approvedThisWeek":12, "rejectedThisWeek":4, "totalApproved":142, "totalRejected":18, "total":163 }`.
  - Model changes: new table `verification_applications` (user_id, status, applied_at, id_type, id_document_url, id_submitted_at, id_auto_verified, work_status, work_employer, work_role, work_period, work_links jsonb, linkedin_status, linkedin_url, bio_snapshot); `verification_notes` (application_id, admin_user_id, note, created_at); `verification_checks` (application_id, key, completed, detail); audit writes for every decision.
  - Effort **M** (new resource + queue read + decision write + notes + history).

### D4 — Reports & moderation (`admin/D4-reports.html` → `/reports`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** EXISTING — `apps/web/src/app/(admin)/reports/page.tsx`. Static; 3 cards "Unavailable"; "Reports unavailable" pill; copy states the backend "does not expose report submission, listing, or moderation endpoints". **Fully static placeholder — rewrite.**
- **Sections & the data each needs:**
  1. Header — "7 open · 24 resolved this week".
  2. Mini-stats — **Open reports** `7` ("Across 5 communities") · **Resolved (7d)** `24` ("+6 vs prior 7d") · **Avg time to resolve** `4h 12m` ("Median 2h 38m") · **Escalated** `2` ("To Trust & Safety").
  3. Filters — status tabs `Open 7 | Resolved 24 | Dismissed 4 | All 35` · reason select `Spam|Harassment|Misinformation|Self-promotion|Other` · severity select `Low|Medium|High|Critical` · Clear filters. (Note the design says severity badge = Critical is `badge-danger`, High and Medium both `badge-warning`, Low `badge-neutral` — High vs Medium share a colour.)
  4. **5 report cards**, each with: `Report #4821` (`.text-mono`) · severity badge · reason `.tag` · "Reported 2h ago" · **Reported content** (quoted, italic, in a `paper-3` box — content is a snapshot, e.g. *"Stop posting stupid questions, this is basic stuff."*) · **Reported by** ("5 community members" + feed name "AI Engineering Foundations feed"; report 2 adds "+ 1 moderator"; report 4 says "Posted across 3 communities") · **Reported user** (avatar + name + "Member since May 2024 · 1 community · 4 posts"; anonymous users render an "A" initial tile and "Account pending verification").
  5. **6 action buttons per card** — View full post · Remove post · Warn user · Suspend user · Dismiss report · Resolve.
- **What exists today (exact):** only `DELETE /api/v1/posts/{post_id}` (Remove post) and `GET /api/v1/posts/{post_id}` / `GET /api/v1/communities/{slug}/posts` → `PostResponse{id, communityId, authorId, author{userId,displayName,avatarUrl}, content, isPinned, isAnnouncement, commentCount, createdAt, updatedAt}` (View full post, and the content snapshot source). There is **no report entity** — nothing can file, count, filter, or resolve a report.
- **Reusable components:** `.post-card` · `.tabs`/`.tab-count` · `.badge` severity · `.tag` reason · `.text-mono` report ID · `.avatar.avatar-sm` + initial-letter fallback tile · `.btn-danger`/`.btn-secondary`/`.btn-ghost`/`.btn-primary` action row.
- **Empty/loading/error states needed:** per-tab empty states ("No open reports" / "No resolved reports in this window"); severity/reason-filtered zero state; card-level "content was deleted" state; escalation state ("Escalated to Trust & Safety" — currently no such team/route, so this must be a flag, not a workflow).
- **Backend work required:**
  - **`NEW` `POST /api/v1/reports`** (learner-side intake, required or the admin queue can never fill) — body `{ "targetType": "post"|"comment"|"user", "targetId": "uuid", "communityId": "uuid", "reason": "spam|harassment|misinformation|self_promotion|other", "note"?: "string" }` → `{ "id":"uuid", "status":"open", "createdAt":"…" }`.
  - **`NEW` `GET /api/v1/admin/reports`** — Query: `status=open|in_review|resolved|dismissed|escalated`, `reason`, `severity=low|medium|high|critical`, `page`, `pageSize`.
    ```
    { "items": [ {
        "id": "4821", "reportId": "#4821",
        "reason": "harassment", "reasonLabel": "Harassment",
        "severity": "critical", "severityLabel": "Critical",
        "status": "open", "statusLabel": "Open",
        "createdAt": "…", "createdLabel": "2h ago",
        "targetType": "post", "targetId": "uuid",
        "content": "\"Stop posting stupid questions, this is basic stuff.\"",
        "reportedBy": { "kind":"community_members|member|moderator", "count":5, "label":"5 community members", "communityTitle":"AI Engineering Foundations feed", "communitySlug":"…" },
        "reportedUser": { "userId":"uuid", "displayName":"Emeka Nwosu", "avatarUrl":null, "isAnonymous":false,
            "memberSinceLabel":"May 2024", "communityCount":1, "postCount":4, "verificationStatus":"rejected" }
    } ], "total": 35, "page": 1, "pageSize": 20, "totalPages": 2 }
    ```
  - **`NEW` `GET /api/v1/admin/reports/stats`** → `{ "open":7, "openCommunityCount":5, "resolved7d":24, "resolvedPrior7d":18, "avgTimeToResolveMinutes":252, "medianTimeToResolveMinutes":158, "escalated":2 }`.
  - **`NEW` `PATCH /api/v1/admin/reports/{report_id}`** — body `{ "action": "dismiss"|"resolve"|"escalate"|"warn_user"|"suspend_user"|"remove_content", "note"?: "string" }` → updated report. `remove_content` internally calls the existing `DELETE /posts/{post_id}`; `suspend_user` calls the D2 `PATCH /admin/users/{user_id}`.
  - Model changes: new tables `reports` (id, target_type, target_id, reporter_user_id?, community_id, reason, severity, status, content_snapshot, created_at, resolved_at, resolved_by, resolution_note, escalated_at), `report_votes` (report_id, user_id) — unique — to express "5 community members" without storing 5 rows per report, `user_warnings` (user_id, report_id, warned_at, warned_by).
  - Effort **L** (new subsystem: public intake + triage read + 6 moderation actions + suspend/warn, plus severity/aggregation).

### D5 — Platform transactions (`admin/D5-transactions.html` → `/transactions`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** EXISTING — `apps/web/src/app/(admin)/transactions/page.tsx`. Static; 3 cards "Unavailable"; a `colSpan={5}` empty row reading "Transaction history unavailable — The backend does not currently expose payment, transaction, or payout read endpoints"; a shield note. **Fully static placeholder — rewrite.**
- **Sections & the data each needs:**
  1. Header — "₦214,420,500 total volume · 24,108 transactions (30d)" + **Export ledger** button.
  2. Stats — **Gross volume (30d)** `₦214,420,500` ("+11% MoM") · **Platform fees (30d)** `₦25,730,460` ("10% of gross") · **Creator payouts (30d)** `₦188,690,040` ("88% of gross") · **Refunds (30d)** `₦2,140,820` ("1.0% of gross").
  3. **Revenue trend** — dual area SVG: gross = accent line + `gross-area` gradient; **platform fees = grey fill only, no line** (deliberately reads as "the platform's share"). Y-axis `12M/9M/6M/3M/0`, X `May 1…May 30`.
  4. Filters — date range `Last 30 days|Today|Last 7 days|Last 90 days|All time|Custom range…` · status `All statuses|Paid|Pending|Refunded|Failed` · community (All + 6 named) · method `All methods|Card|Bank transfer|USSD` · search "Search by transaction ID or member…" · Clear filters · "24,108 results".
  5. Table, **11 columns**: Transaction (`ILK-7283`, `.text-mono`) · Date / Time ("May 18 · 14:32") · Member (avatar + name; failed rows render an "Anonymous" initial tile) · Community (title) · Plan (`Monthly|Lifetime|Free|Discount · ADA15`) · Method (`Card|Bank|USSD|—`) · Gross · Fee · Creator net (heavier weight) · Status badge (`Paid` success, `Pending` warning, `Refunded` danger, `Failed` danger, `N/A` neutral for free) · View / Retry link.
  6. 12 sample rows spanning all five statuses — including a **free** row (`Free` plan, all money cells `—`, badge `N/A`) and a **failed** row (all money cells `—`, action becomes **Retry**).
  7. Footer summary — "Showing 12 of 24,108 · Gross ₦166,425 · Fees ₦16,442 · Creator net ₦149,983 · Refunds ₦8,500" (page-level sums, computed server-side or from the page's rows).
  8. Pagination — "Page 1 of 2,008", `1 2 3 … 2008`.
- **What exists today (exact):** nothing monetary. `CommunityListItem.priceAmount`/`priceCurrency`/`isFree` are the *list price* of a community (live seed: `"2500.00"`, `"NGN"`). `EnrollmentResponse{id, community, status, createdAt, cancelledAt}` carries **no amount** — `POST /communities/{slug}/enroll` is explicitly free-only. There is no provider, no webhook, no order.
- **Reusable components:** `.text-money`/`.text-tabular` (money is **monochrome ink** — no green payouts, no red refunds) · `.text-mono` for transaction IDs only · inline SVG dual-area chart · `.table` · `.badge` status · `.select`/`.input` filters · `.pagination` · `.btn-secondary` Export.
- **Empty/loading/error states needed:** "No payments yet — payments are not enabled" (not an empty ledger); per-filter zero state; chart empty state without the axis 0–12M scale; failed rows must render `—` for gross/fee/net rather than `₦0` (the design distinguishes `₦0` on the refunded row from `—` on free/failed rows — preserve that).
- **Backend work required:**
  - **`NEW` `GET /api/v1/admin/transactions`** — Query: `range=today|7d|30d|90d|all` + `from`/`to` for custom, `status=paid|pending|refunded|failed`, `communityId`, `method=card|bank_transfer|ussd`, `search` (txn id or member name), `page`, `pageSize`.
    ```
    { "items": [ {
        "id": "ILK-7283", "transactionId": "ILK-7283",
        "occurredAt": "2026-05-18T14:32:00Z", "occurredLabel": "May 18 · 14:32",
        "member": { "userId":"uuid", "displayName":"Ada Okafor", "avatarUrl":null },
        "community": { "id":"uuid", "title":"AI Engineering Foundations", "slug":"…" },
        "plan": "monthly", "planLabel": "Monthly", "discountCode": null,
        "method": "card", "methodLabel": "Card",
        "grossAmount": "8500.00", "feeAmount": "850.00", "creatorNetAmount": "7650.00", "currency": "NGN",
        "status": "paid", "statusLabel": "Paid", "isFree": false
    } ], "total": 24108, "page": 1, "pageSize": 12, "totalPages": 2008,
      "pageTotals": { "grossAmount":"166425.00", "feeAmount":"16442.00", "creatorNetAmount":"149983.00", "refundAmount":"8500.00" } }
    ```
    Money stays a **decimal string** per the platform convention (`"8500.00"`, never a JSON number).
  - **`NEW` `GET /api/v1/admin/transactions/summary?range=30d`** → `{ "grossAmount":"214420500.00", "feesAmount":"25730460.00", "creatorPayoutsAmount":"188690040.00", "refundsAmount":"2140820.00", "feesPercent":10, "payoutsPercent":88, "refundsPercent":1.0, "grossMoMAmount":"21200000.00", "transactionCount":24108, "series":[ { "date":"2026-04-22", "grossAmount":"6100000.00", "feesAmount":"610000.00" } ] }`.
  - **`NEW` `GET /api/v1/admin/transactions/export.csv?range=…`** — CSV of the current filter.
  - Model changes: new tables `transactions` (id, reference, community_id, user_id, plan, method, gross_amount numeric(18,2), fee_amount numeric(18,2), creator_net_amount numeric(18,2), currency char(3), status, provider_ref, discount_code, occurred_at, created_at), `refunds` (id, transaction_id, amount, reason, status, requested_by, decided_by, created_at), `payment_events` (provider webhook log, idempotency key unique). `communities.price_amount` becomes the plan price source; a `plan` dimension (monthly/lifetime) is **new**.
  - Effort **L** (new payments subsystem: provider integration, webhook intake, ledger, refunds, fee split, rollups).

### D6 — Audit log (`admin/D6-audit-log.html` → `/audit-log`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** **NEW** — no `apps/web/src/app/(admin)/audit-log/` exists. Also note the design's own rail uses `ILK.injectAdminRail('overview')` for this page, so the route needs adding to the rail as its own item.
- **Sections & the data each needs:**
  1. Header — "Every admin and system action — timestamp, actor, target, IP and details." + date-range segmented `Today|7d|30d|Custom…` + **Export** button.
  2. Filter row (a bordered card) — **Actor** select `All actors|Admins|Creators|System` · **Action type** select `All actions|User changes|Payouts|Refunds|Verifications|System` · search "e.g. Ada Okafor, payout, suspend…" · Clear filters · right-aligned "248 events today".
  3. Table, **6 columns**: **Timestamp** (`meta-cell text-tabular`, "May 18 · 14:32:14 WAT") · **Actor** (avatar + name + role label `Admin|Creator|Automated`; **System** rows use a filled ink circle with an info glyph instead of a photo) · **Action** badge · **Target** (`.name-cell`) · **IP address** (`.text-mono`, e.g. `102.89.124.18`; system rows show an em-dash) · **Details** (free text, may embed money in `.text-money`: "Monthly price ₦8,500 → ₦9,200 (effective May 25)", "₦82,400 to Access Bank •••• 4821", "Total ₦2.4M processed", "Learner → Pending verification", "Cohort 4 published, 388 enrolled").
  4. 12 rows exercising every action type: `Approved verification` (info) · `Refund processed` (warning) · `Updated pricing` (info) · `Suspended user` (danger) · `Payout processed` (success) · `Payment received` (success) · `Rejected verification` (danger) · `Resolved report` (info) · `Daily payout batch` (neutral) · `Published community` (info) · `Failed payment` (danger) · `Updated role` (info).
  5. Pagination — "Showing 1–12 of 248 today · 12,408 all-time" + `1 2 3 … 248`.
  6. Design rules to honour: timestamp uses **tabular Inter, not mono**; **IP is the only mono field in the table**; money in Details is monochrome ink (`.text-money`), never green/red.
- **Reusable components:** `.table` · `.badge badge-{info,success,warning,danger,neutral}` · `.field`/`.field-label`/`.select`/`.input` · `.avatar.avatar-sm` + ink system-circle variant · `.text-mono` (IP + IDs only) · `.pagination` · `.chip chip-sm` segmented control · `.btn-secondary` Export.
- **Empty/loading/error states needed:** per-range empty state ("No events recorded today"); filtered zero state; system-only vs human-only actor rendering; IP "—" for system actors is *correct*, not missing data.
- **Backend work required:**
  - **`NEW` `GET /api/v1/admin/audit-log`** — Query: `actorType=admin|creator|system`, `actionType=user|payouts|refunds|verifications|system`, `search`, `from`, `to`, `page`, `pageSize`.
    ```
    { "items": [ {
        "id": "uuid",
        "occurredAt": "2026-05-18T14:32:14Z", "occurredLabel": "May 18 · 14:32:14 WAT",
        "actor": { "type":"admin", "userId":"uuid", "displayName":"Ada Okafor", "roleLabel":"Admin", "avatarUrl":null },
        "action": "approved_verification", "actionLabel": "Approved verification",
        "targetType": "user", "targetLabel": "Sola Akinwale",
        "ipAddress": "102.89.124.18",
        "details": "Approved with note: strong portfolio",
        "detailsFields": [ { "label":"Monthly price", "from":"8500.00", "to":"9200.00" } ]
    } ], "total": 12408, "page": 1, "pageSize": 12, "totalPages": 1034,
      "counts": { "today": 248, "allTime": 12408 } }
    ```
  - **`NEW` `GET /api/v1/admin/audit-log/export.csv`** — same filters.
  - Model changes: new table `audit_events` (id, actor_user_id?, actor_type, action, target_type, target_id, target_label, ip_address, user_agent, details text, details_fields jsonb, metadata jsonb, occurred_at) with indexes on `(occurred_at desc)`, `(action)`, `(actor_user_id)`. Plus a `record_audit(...)` service called from **every** mutating route (verification PATCH, user PATCH, report PATCH, payout/refund decisions, settings PATCH, publish/unpublish, enroll). The same table can back D1's activity feed — build it once, project twice.
  - Effort **M** (one table + a write helper + instrumentation across ~15 routes).

### D7 — Payout approval (`admin/D7-payout-approval.html` → `/payout-approval`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** **NEW** — no `apps/web/src/app/(admin)/payout-approval/`.
- **Sections & the data each needs:**
  1. Header — "12 pending · ₦4.2M total · Next batch Friday 9am WAT" + Export.
  2. Stats — **Pending** `12` (`badge-warning Awaiting review`) · **Approved today** `48` ("Across 5 admins") · **Held today** `3` ("Manual review") · **Total pending** `₦4.2M` ("Across 12 creators").
  3. Tabs `Pending 12 | Approved 248 | Held 18 | All 278` · amount-band select `All amounts|Under ₦500k|₦500k – ₦2M|Over ₦2M` · search "Search by creator…".
  4. **5 payout cards** (`ILK-PAY-129` … `ILK-PAY-133`). Each card needs: payout ID (`.text-mono`) · `Pending` badge · "Submitted 2h ago" · **amount** (big `.text-money`) · **Requested** timestamp ("May 18, 2026 · 12:08 WAT") · **creator row** (`.avatar.avatar-verified` — teal dot is the only teal on the page — name + title "Senior Engineer, Paystack" + "3 communities · 4,892 members · 18-month creator") · **3-col details**: Bank (name + `•••• 4821` mono) / Requested amount / Net after fee (+ fee note "No fee · under ₦500k" or "₦2,400 Paystack fee") · **Review evidence** 4-col: Revenue 30d `₦471k` / Refund rate `1.2%` / Complaint rate `0.4%` / First payout `Mar 2024` · actions **Approve** (`.btn-primary`) / **Hold** (`.btn-secondary`) / **View profile →** (`.btn-ghost`).
  5. Card 3 (`ILK-PAY-131`, ₦1,240,000) additionally carries `badge-danger "Large payout · 2 admins required"` and its button reads **"Approve (1 of 2)"** — a two-signature approval state.
  6. **Sticky right panel** — **Approval guidelines** (4 bullets: under ₦500k auto-approve; ₦500k–₦2M needs 1 admin; ₦2M+ needs 2 admins; flag refund rate > 5%) · **Recent approvals** (4 rows: amount + creator + admin + relative time; states Approved/Held) · **Payout schedule** ("Payouts batch processed every Friday 9am WAT. Next batch in 3 days.").
- **What exists today (exact):** nothing. No payout model, no creator balance, no bank accounts, no approval workflow. `CreatorProfileResponse.communityCount` and `memberCount` are the only creator metrics available — and `memberCount` is **missing from the live deployment** (see §Backend gaps note 1).
- **Reusable components:** `.card`/`.stat` · `.tabs`/`.tab-count` · `.badge badge-warning`/`.badge-danger` · `.avatar.avatar-verified` · `.text-money` (monochrome ink — **no** green/red on amounts) · `.text-mono` for payout IDs and masked account digits · `.select`/`.input` · `.btn-primary`/`.btn-secondary`/`.btn-ghost` · `.card-tinted` for the schedule panel.
- **Empty/loading/error states needed:** "No payouts pending" per tab; amount-band zero state; a distinct "awaiting second administrator" state on large payouts (must not look like a failure); hold-without-reason guard.
- **Backend work required:**
  - **`NEW` `GET /api/v1/admin/payouts`** — Query: `status=pending|approved|held|paid|rejected`, `amountBand=under_500k|500k_2m|over_2m`, `search`, `page`, `pageSize`.
    ```
    { "items": [ {
        "id": "ILK-PAY-129",
        "creatorUserId": "uuid", "creatorName": "Tunde Bakare", "creatorAvatarUrl": null, "creatorTitle": "Senior Engineer, Paystack", "isVerified": true,
        "communityCount": 3, "memberCount": 4892,
        "creatorSince": "2024-03-01", "creatorSinceLabel": "Mar 2024", "creatorTenureLabel": "18-month creator",
        "amount": "487200.00", "netAmount": "487200.00", "feeAmount": "0.00", "feeNote": "No fee · under ₦500k", "currency": "NGN",
        "bank": { "name": "Access Bank", "accountLast4": "4821" },
        "status": "pending", "statusLabel": "Pending",
        "requestedAt": "2026-05-18T12:08:00Z", "requestedLabel": "Submitted 2h ago",
        "approvalsRequired": 1, "approvalsReceived": 0, "approverNames": [],
        "evidence": { "revenue30dAmount":"471000.00", "refundRatePercent":1.2, "complaintRatePercent":0.4, "firstPayoutAt":"2024-03-01", "firstPayoutLabel":"Mar 2024" },
        "largePayout": false, "largePayoutThreshold": "2000000.00"
    } ], "total": 278, "page": 1, "pageSize": 20, "totalPages": 14 }
    ```
  - **`NEW` `GET /api/v1/admin/payouts/stats`** → `{ "pending":12, "pendingTotalAmount":"4200000.00", "pendingCreatorCount":12, "approvedToday":48, "approvedTodayAdminCount":5, "heldToday":3 }`.
  - **`NEW` `POST /api/v1/admin/payouts/{payout_id}/decision`** — body `{ "decision": "approve" | "hold", "note"?: "string" }` → `{ "payout": {…}, "approvalsRequired": 2, "approvalsReceived": 1, "released": false }`. **Enforce the 2-admin rule server-side**: `amount > 2000000` requires two *distinct* admin approvals before `released=true`; a second admin approving the same payout must not double-count.
  - **`NEW` `GET /api/v1/admin/payouts/recent-decisions`** → `[{ "id":"uuid", "amount":"288000.00", "creatorName":"Tunde Bakare", "decision":"approved|held", "adminName":"Ada Okafor", "occurredAt":"…", "occurredLabel":"12 min ago" }]`.
  - **`NEW` `GET /api/v1/admin/payouts/schedule`** → `{ "frequency":"weekly", "weekday":"friday", "time":"09:00", "timezone":"Africa/Lagos", "nextBatchAt":"…", "daysUntilNextBatch":3 }`.
  - **`NEW` `POST /api/v1/creators/me/payouts`** (creator side, else the queue is permanently empty) — body `{ "amount"?: "string", "bankAccountId": "uuid" }` → creates a `payout_request` in `pending`.
  - Model changes: `payout_requests` (id, reference, creator_user_id, amount, net_amount, fee_amount, currency, bank_name, bank_account_last4, status, requested_at, approved_at, held_at, hold_reason), `payout_approvals` (payout_id, admin_user_id, decision, note, created_at) with `UNIQUE(payout_id, admin_user_id)`, `creator_bank_accounts` (id, user_id, bank_name, account_number_encrypted, account_last4, is_default, verified_at).
  - Effort **L** (new payments/banking subsystem + multi-approver workflow).

### D8 — Refund approval (`admin/D8-refund-approval.html` → `/refund-approval`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** **NEW** — no `apps/web/src/app/(admin)/refund-approval/`.
- **Sections & the data each needs:**
  1. Header — "8 pending · ₦64,200 total · 30-day window · 14-day on lifetime".
  2. Stats — **Pending** `8` (`badge-warning Awaiting review`) · **Approved today** `24` ("Across 5 admins") · **Rejected today** `3` ("Outside policy window") · **Total pending** `₦64,200` ("Across 8 learners").
  3. Tabs `Pending 8 | Approved 142 | Rejected 18 | All 168` · reason select `Quality|Found an alternative|No longer interested|Technical issues|Other` · search "Search by learner…".
  4. **5 refund cards** (`ILK-REF-082` … `ILK-REF-078`). Each needs: refund ID (`.text-mono`) · `Pending` badge · "Submitted 3h ago" · **amount** (big `.text-money`) · **Reason** label · **learner row** (avatar + name + "Member since 2024 · 4 communities · 1 prior refund") · **4-col order block**: Order ID (`ILK-7284`, mono) / Community / Amount / Purchased (date) · **Learner note** (blockquote: paper-3 bg, 2px left border, italic, ink-2) · **eligibility line** (ink check + "Eligible: within 30-day window, <50% complete") · actions **Approve** (`.btn-primary`) / **Reject** (`.btn-danger`) / **View order →** (`.btn-ghost`).
  5. Policy footnote (small muted, centered) — "Refund policy: 30-day money-back on monthly, 14-day on lifetime. Auto-reject if learner has completed >50% of lessons."
- **What exists today (exact):** `EnrollmentResponse{id, community{CommunityRef}, status, createdAt, cancelledAt}` and `DELETE /api/v1/enrollments/{enrollment_id}` — a cancellation, not a refund. `CommunityRef.priceAmount` gives the community's list price (a proxy for the order amount, but there is no order). Lesson completion **is** computable from `GET /api/v1/courses/{course_id}/progress` → `CourseProgressResponse`, which is what the ">50% complete" eligibility rule needs.
- **Reusable components:** `.card`/`.stat` · `.tabs`/`.tab-count` · `.badge badge-warning` · `.avatar.avatar-sm` · `.text-money` (monochrome) · `.text-mono` for request/order IDs only · `.input-group`-style 4-col grid · blockquote learner note · inline ink check (no green) · `.btn-primary`/`.btn-danger`/`.btn-ghost`.
- **Empty/loading/error states needed:** "No refunds pending" per tab; reason-filtered zero state; "outside policy window" state distinct from "rejected by an admin"; a rejected card must show the rejection reason and who rejected it.
- **Backend work required:**
  - **`NEW` `GET /api/v1/admin/refunds`** — Query: `status=pending|approved|rejected`, `reason=quality|found_alternative|no_longer_interested|technical_issues|other`, `search`, `page`, `pageSize`.
    ```
    { "items": [ {
        "id": "ILK-REF-082",
        "learnerUserId": "uuid", "learnerName": "Ada Okafor", "learnerAvatarUrl": null,
        "memberSinceLabel": "Member since 2024", "communityCount": 4, "priorRefundCount": 1,
        "orderId": "ILK-7284",
        "community": { "id":"uuid", "title":"AI Engineering Foundations", "slug":"…" },
        "amount": "8500.00", "currency": "NGN",
        "purchasedAt": "2026-05-02T00:00:00Z", "purchasedLabel": "May 02, 2026",
        "reason": "quality", "reasonLabel": "Quality didn't match expectations",
        "note": "\"The lessons felt rushed, expected more depth on evals.\"",
        "eligibility": { "eligible": true, "label": "Eligible: within 30-day window, <50% complete",
                         "withinWindow": true, "completionPercent": 38, "policyWindowDays": 30 },
        "status": "pending", "statusLabel": "Pending",
        "requestedAt": "…", "requestedLabel": "Submitted 3h ago"
    } ], "total": 168, "page": 1, "pageSize": 20, "totalPages": 9 }
    ```
  - **`NEW` `GET /api/v1/admin/refunds/stats`** → `{ "pending":8, "pendingTotalAmount":"64200.00", "pendingLearnerCount":8, "approvedToday":24, "rejectedToday":3 }`.
  - **`NEW` `POST /api/v1/admin/refunds/{refund_id}/decision`** — body `{ "decision": "approve" | "reject", "note"?: "string" }` → `{ "refund": {…}, "refundCreated": true, "enrollmentCancelled": true }`.
  - **`NEW` `POST /api/v1/enrollments/{enrollment_id}/refund-request`** (learner side) — body `{ "reason": "quality|found_alternative|no_longer_interested|technical_issues|other", "note"?: "string" }` → creates a pending refund request; computes and stores the eligibility snapshot.
  - **`NEW` `GET /api/v1/admin/refunds/policy`** (or fold into D9 settings) → `{ "monthlyWindowDays":30, "lifetimeWindowDays":14, "autoRejectAboveCompletionPercent":50 }`.
  - Model changes: `refund_requests` (id, reference, enrollment_id, transaction_id?, user_id, community_id, amount, currency, reason, note, status, requested_at, decided_at, decided_by, decision_note, eligibility_snapshot jsonb); eligibility is computed from `enrollments.created_at` + lesson progress.
  - Effort **L** (depends on D5's transaction model for the money side; the queue read/decision layer alone is M).

### D9 — Admin settings (`admin/D9-admin-settings.html` → `/admin/settings`)
- **Verdict:** NEEDS-BACKEND
- **Route status:** **NEW** — no `apps/web/src/app/(admin)/settings/` and no `/admin/settings` route. **Design note: only the General section is live markup — Feature flags, Email templates, Roles & permissions, API keys and Webhooks are shipped as HTML comment blocks** and must be uncommented and wired.
- **Sections & the data each needs:**
  1. Header — "Platform configuration. Changes apply across all communities and accounts."
  2. **Sidebar nav** (240px sticky, plain text links) — General (active) · Feature flags · Email templates · Roles & permissions · API keys · Webhooks · **Audit log** (deep-links to D6).
  3. **General settings form** (2-col grid) — **Platform name** = "Interlekt" (help "Shown in the top nav, emails and footer.") · **Support email** = "support@interlekt.com" (help "Receives learner reports and platform alerts.") · **Default currency** select: `₦ Nigerian Naira (NGN)` selected, plus USD / EUR / GBP / KES / GHS (help "Default for new communities and payouts. Creators cannot change this per-community.") · **Default payout schedule** select: `Weekly (Fridays)` selected, plus Bi-weekly / Monthly (1st) / On-request only (help "When creator earnings are batched and sent.") · **Revenue share**: two number inputs side by side — Platform fee `10` (min 0, max 50) and Creator share `88` (min 50, max 100) — with help "Paystack processing ~2% is separate — deducted from the platform fee, not the creator share. Defaults to 10% / 88%." · **Minimum payout threshold** `10000` with a `₦` prefix (min 1000, step 500) · **Discard changes** (ghost) / **Save changes** (primary) · footnote "Last saved 2 hours ago by Ada Okafor".
  4. **Feature flags** — 8 toggles with label + description: *Enable new learner onboarding* (ON) · *Allow lifetime pricing* (ON) · *Allow free communities* (ON) · *Enable discount codes* (ON) · *Enable affiliate program* (OFF) · *Enable community cohorts* (ON) · *Enable email broadcasts* (OFF) · *Require creator verification* (ON). Save flag changes button.
  5. **Email templates** — 6 rows (name + subject preview + Edit link): Welcome ("Welcome to Interlekt, {{first_name}}!") · Payment receipt ("Receipt for {{community_name}} — ₦{{amount}}") · Payout notification ("Payout of ₦{{amount}} sent to {{bank_name}}") · Refund confirmation ("Refund processed — ₦{{amount}} back to your card") · Verification approved ("You're verified — publish your first community") · Verification rejected ("Verification update — please resubmit").
  6. **Roles & permissions** — 4 roles (Super Admin / Operator / Support / Read-only) × 6 permissions (View platform overview; Approve creator verification; Approve payouts; Approve refunds; Suspend users; Edit platform settings) as a check/dash matrix + **Create role** button. → the live `UserRole` enum is only `learner|creator|admin`; these 4 admin roles do not exist and need their own model.
  7. **API keys** — 2 rows: Production (`Active`, `ilk_live_••••••••••••••••4821`, created Jan 14 2026, last used 2 hours ago) and Sandbox (`Active`, `ilk_test_••••••••••••••••9999`, created Feb 03 2026, last used 6 days ago) with Copy / Revoke + **Create key** button. Design rule: **never render full key text** — show a masked value only.
  8. **Webhooks** — 3 rows with endpoint URL + event list + delivery status: Paystack events (Active — `payment.success, refund.processed, payout.failed`) · Discord notifications (Active — `verification.submitted, report.created`) · Slack notifications (`badge-warning "Pending retry"` — `payout.processed, refund.approved · last 200 OK 4h ago`) + Edit / Delete + **Add webhook** button.
- **What exists today (exact):** `GET /api/v1/categories` is the only global configuration in the API, and it is read-only and unrelated. No settings, no flags, no templates, no admin-role model, no key store, no webhook registry. `GET /api/v1/auth/me` → `AccountResponse.roles` is the only role source (3 values).
- **Reusable components:** `.settings-shell` layout (240px sidebar + content) · `.field`/`.field-label`/`.field-help`/`.input`/`.select` · `.input-group` with `.prefix`/`.suffix` (the ₦ prefix and the `%` suffix) · `.toggle`/`.toggle.on` with `role="switch"`/`aria-checked` · `.text-mono` for masked keys and URLs only · `.btn-primary`/`.btn-secondary`/`.btn-danger`/`.btn-ghost` · `.rail-item`/`.rail-item.active` for the section nav.
- **Empty/loading/error states needed:** per-section loading; "unsaved changes" guard on section switch; Save failure (e.g. platform fee + creator share must sum ≤ 100 — validate client- and server-side); API-key create success must show the key **once** then mask it; revoke confirm; webhook test-delivery result.
- **Backend work required:**
  - **`NEW` `GET /api/v1/admin/settings`** — single settings document:
    ```
    {
      "platform": {
        "name": "Interlekt",
        "supportEmail": "support@interlekt.com",
        "defaultCurrency": "NGN", "defaultCurrencyLabel": "₦ Nigerian Naira (NGN)",
        "payoutSchedule": "weekly_fridays", "payoutScheduleLabel": "Weekly (Fridays)",
        "revenueShare": { "platformFeePercent": 10, "creatorSharePercent": 88,
                          "processorFeeNote": "Paystack processing ~2% is separate — deducted from the platform fee, not the creator share." },
        "minimumPayoutAmount": "10000.00", "minimumPayoutCurrency": "NGN",
        "refundPolicy": { "monthlyWindowDays": 30, "lifetimeWindowDays": 14, "autoRejectAboveCompletionPercent": 50 },
        "payoutGuidelines": [ { "id":"g1", "text":"Payouts under ₦500k auto-approve — no review needed.", "amountFrom":"0.00", "amountTo":"500000.00", "approvalsRequired":0 } ]
      },
      "featureFlags": [ { "key":"onboarding", "label":"Enable new learner onboarding", "description":"Three-step welcome flow for first-time signups.", "enabled":true } ],
      "emailTemplates": [ { "key":"welcome", "name":"Welcome email", "subject":"Welcome to Interlekt, {{first_name}}!", "body":"…", "updatedAt":"…" } ],
      "roles": [ { "key":"super_admin", "name":"Super Admin", "isSystem":true,
                   "permissions": { "viewOverview":true, "approveVerification":true, "approvePayouts":true, "approveRefunds":true, "suspendUsers":true, "editPlatformSettings":true } } ],
      "apiKeys": [ { "id":"uuid", "label":"Production", "prefix":"ilk_live", "maskedKey":"ilk_live_••••••••••••••••4821", "status":"active", "createdAt":"2026-01-14", "lastUsedAt":"…", "lastUsedLabel":"2 hours ago" } ],
      "webhooks": [ { "id":"uuid", "name":"Paystack events", "url":"https://api.interlekt.com/webhooks/paystack", "events":["payment.success","refund.processed","payout.failed"], "status":"active", "lastStatusCode":200, "lastDeliveryAt":"…" } ],
      "meta": { "updatedAt":"…", "updatedBy":"Ada Okafor", "updatedLabel":"2 hours ago" }
    }
    ```
    The 8 feature-flag keys: `onboarding`, `lifetime_pricing`, `free_communities`, `discount_codes`, `affiliate_program`, `community_cohorts`, `email_broadcasts`, `require_creator_verification`. The 6 template keys: `welcome`, `payment_receipt`, `payout_notification`, `refund_confirmation`, `verification_approved`, `verification_rejected`. The 4 role keys: `super_admin`, `operator`, `support`, `read_only`.
  - **`NEW` `PATCH /api/v1/admin/settings`** — body accepts any subset of `platform`, `featureFlags[{key,enabled}]`, `emailTemplates[{key,subject,body}]`, `roles[]`, `webhooks[]` → returns the updated settings document; writes an audit event (D6).
  - **`NEW` `POST /api/v1/admin/settings/api-keys`** — body `{ "label":"string", "environment":"live|sandbox" }` → returns the key **once**: `{ "id":"uuid", "key":"ilk_live_…", "prefix":"ilk_live", "maskedKey":"ilk_live_••••••••••••••••4821" }`. Store a hash + last4 only.
  - **`NEW` `DELETE /api/v1/admin/settings/api-keys/{key_id}`** → revoke.
  - **`NEW` `POST /api/v1/admin/settings/webhooks`** — body `{ "name", "url", "events":[] }`; **`PATCH`**/**`DELETE** `/api/v1/admin/settings/webhooks/{id}` → `{ "id","name","url","events","status","lastStatusCode","lastDeliveryAt" }`.
  - **`NEW` `POST /api/v1/admin/settings/roles`** — body `{ "name", "permissions":{…} }`; **`PATCH`** `/api/v1/admin/settings/roles/{key}`.
  - Model changes: `platform_settings` (single row, typed columns + `updated_at`/`updated_by`), `feature_flags` (key pk, enabled, label, description, updated_at, updated_by), `email_templates` (key pk, name, subject, body, updated_at), `admin_roles` (key pk, name, is_system, permissions jsonb) + `admin_user_roles` (admin_user_id, role_key), `api_keys` (id, label, environment, prefix, key_hash, key_last4, status, created_at, last_used_at, created_by) — **hash only**, `webhooks` (id, name, url, secret_hash, events jsonb, status, last_status_code, last_delivery_at).
  - Effort **L** (whole config subsystem incl. secret management, an admin RBAC tier, and a webhook registry).

## Backend gaps consolidated
| Gap | Screens affected | Proposed endpoint/model | Effort |
|---|---|---|---|
| **1. Platform stats / dashboard** — users, communities, enrollments, revenue, revenue series, queues, activity feed, top communities by revenue, geography | D1 | `NEW GET /api/v1/admin/stats` (contract in D1). Model: `users.last_active_at` + `users.state`; `daily_metrics(day, gross, fees, refunds, payouts)`; `platform_events` | **L** |
| **2. Admin user directory** — list, search, role/status/joined filters, email, community count, last active, suspend/activate/promote, invite, export, 4 mini-stats | D2 | `NEW GET /api/v1/admin/users`, `GET /api/v1/admin/users/stats`, `PATCH /api/v1/admin/users/{user_id}`, `POST /api/v1/admin/users/invite`, `GET /api/v1/admin/users/export.csv`. Model: `users.status`, `users.suspended_at`, `users.suspension_reason`, `users.last_active_at` | **M** |
| **3. Verification applications + evidence + notes + history** — the queue itself | D3 | `NEW GET /api/v1/admin/creators/verification[/{user_id}]`, `POST …/{user_id}/notes`, `GET …/stats`; **extend** `VerificationStatusUpdateRequest` with `reason`/`note`/`evidence`. Model: `verification_applications`, `verification_notes`, `verification_checks` | **M** |
| **4. Report / moderation subsystem** — report entity, public intake, triage filters, 6 moderation actions, warn/suspend, severity, resolution-time stats | D4 | `NEW POST /api/v1/reports` (learner), `GET /api/v1/admin/reports`, `GET /api/v1/admin/reports/stats`, `PATCH /api/v1/admin/reports/{report_id}`. Model: `reports`, `report_votes`, `user_warnings`. Reuses `DELETE /posts/{post_id}` and D2's user PATCH | **L** |
| **5. Payments / ledger** — transactions, fee split, plan, method, refunds, series, page totals, export | D5 (+ D1, D7, D8) | `NEW GET /api/v1/admin/transactions`, `GET /api/v1/admin/transactions/summary`, `GET /api/v1/admin/transactions/export.csv`. Model: `transactions`, `refunds`, `payment_events`; add `plan` dimension to `communities` | **L** |
| **6. Audit log / event store** — 6-column trail, actor/action filters, IP, structured details, event counts, export | D6 (+ D1 activity feed, D2/D3/D4/D7/D8/D9 writes) | `NEW GET /api/v1/admin/audit-log`, `GET /api/v1/admin/audit-log/export.csv`, plus a `record_audit()` service called from every mutating route. Model: `audit_events` | **M** |
| **7. Payouts + multi-approver workflow** — payout requests, bank accounts, net-after-fee, revenue/refund/complaint evidence, 2-admin rule, guidelines, schedule | D7 | `NEW GET /api/v1/admin/payouts`, `GET /api/v1/admin/payouts/stats`, `POST /api/v1/admin/payouts/{id}/decision`, `GET /api/v1/admin/payouts/recent-decisions`, `GET /api/v1/admin/payouts/schedule`, `POST /api/v1/creators/me/payouts`. Model: `payout_requests`, `payout_approvals`, `creator_bank_accounts` | **L** |
| **8. Refunds** — refund requests, orders, eligibility computation, decisions, policy | D8 | `NEW GET /api/v1/admin/refunds`, `GET /api/v1/admin/refunds/stats`, `POST /api/v1/admin/refunds/{id}/decision`, `POST /api/v1/enrollments/{id}/refund-request`, `GET /api/v1/admin/refunds/policy`. Model: `refund_requests` (+ `refund_eligibility` computed from `enrollments` + lesson progress) | **L** |
| **9. Platform settings / feature flags / email templates / admin roles / API keys / webhooks** | D9 (+ D7 guidelines, D8 policy) | `NEW GET/PATCH /api/v1/admin/settings`, `POST /api/v1/admin/settings/api-keys`, `DELETE …/api-keys/{id}`, `POST/PATCH/DELETE …/webhooks[/{id}]`, `POST/PATCH …/roles[/{id}]`. Model: `platform_settings`, `feature_flags`, `email_templates`, `admin_roles`, `admin_user_roles`, `api_keys` (hash-only), `webhooks` | **L** |
| **10. Admin RBAC** — D9's 4 admin roles + the per-screen permission gates; the live `UserRole` enum is only `learner\|creator\|admin` and there is no permission model at all | D2, D3, D4, D6, D7, D8, D9 | Model: `admin_roles` + `admin_user_roles`; a `require_permission(...)` dependency on every `/api/v1/admin/*` route | **M** |
| **11. Creator engagement metrics** — community count, member count, 30d revenue, refund rate, complaint rate, tenure | D1, D2, D7 | `CreatorProfileResponse` has `communityCount` (+ `memberCount` in the OpenAPI) but **no revenue / refund-rate / complaint-rate**. Needs a creator-analytics projection over `transactions` + `refunds` + `reports` | **M** (depends on #5) |
| **12. `CreatorProfileResponse.memberCount` is missing from the deployed backend** — the OpenAPI lists it as **required**, but the live response omits it entirely (verified against 2 live creators). D3 and D7 both want member counts. | D3, D7 | Deploy the field the spec already promises, or add `GET /api/v1/admin/creators/{user_id}/metrics` | **S** |
| **13. Support tickets** — D1's "Support tickets: 12 unresolved" queue has no backend surface whatsoever (no ticket entity, no queue) | D1 | `NEW` ticketing entity + `GET /api/v1/admin/support-tickets`, or drop the row from the queue card | **M** |
| **14. Admin invite / export** — no CSV export endpoint and no invite flow anywhere in the API | D2, D5, D6, D7 | `NEW GET /api/v1/admin/{users,transactions,audit-log,payouts}/export.csv` + `POST /api/v1/admin/users/invite` | **S** each |
| **15. Frontend type drift (no backend work)** — `apps/web/src/types/api.ts` `CommunityListItem` omits `rating: number\|null` and `reviewCount: number`, both present in the live `GET /communities` payload and required/optional in the OpenAPI; `CommunityDetail` inherits the gap. Also no `VerificationStatusUpdateRequest` type despite the live admin route. | D2, D3 | Update `types/api.ts` only | **S** |

### Notable discrepancies found while verifying (design vs backend vs frontend)

1. **Pagination envelope**: `MAP-CONTEXT.md` states `{ items, page: { page, pageSize, total, totalPages } }`. The OpenAPI (`PaginatedResponse_CommunityListItem_`, `PaginatedResponse_MemberResponse_`, …) and the **live** API both use a **flat** envelope `{ items, total, page, pageSize, totalPages }` — confirmed against `GET /api/v1/communities?pageSize=2`. The frontend `Paginated<T>` in `types/api.ts` is **correct**; the shared context file is wrong. Every NEW admin list endpoint should use the flat shape.
2. **`CreatorProfileResponse.memberCount` is in the spec but not in the deployment.** Verified against two live creators — the field is absent from the response body.
3. **`GET /api/v1/users/{user_id}` deliberately omits `email`** (public profile). D2's user directory column is impossible without a private admin read.
4. **The only live admin route is write-only and its request body accepts just `status`.** D3's "Request more info", internal note, and approval history have nowhere to go.
5. **Every existing admin page is a static placeholder.** `/overview`, `/users`, `/verification`, `/reports`, `/transactions` all render literal `"—"` / `"Unavailable"` strings, contain **zero** `useQuery` calls, and never touch the API — including `/verification`, which explicitly disclaims using the one endpoint that does exist. There is no `hooks/use-admin.ts` and no `admin` block in `lib/query-keys.ts`.
6. **`priceAmount` ≠ money.** `CommunityListItem.priceAmount` is a community's *list price* (`"2500.00"`, `"NGN"` in the live seed). D1/D5/D7/D8 treat it as revenue, fees, payouts and refunds — that is a category error, and the ledger must be modelled separately.
7. **D5's "Bank" method label vs the filter's "Bank transfer"** — a small copy inconsistency to normalise.
8. **D1's geography bars are relative to the top state (Lagos = 100%)**, not to the total; and the "12,476 across all others" figure is **not** on the same scale as the bars. Keep that distinction when porting.
9. **D9's five secondary sections ship as HTML comment blocks** — they must be uncommented, not rebuilt.
10. **Live seed is thin for every screen**: 4 communities, all `memberCount: 0`, `reviewCount: 0`, `rating: null`, 1 creator pending verification, 1 verified creator, 3 communities for the second creator. Even a fully-built admin shell would render near-empty against this seed — a content-seeding step is required before the shell can be demoed.
