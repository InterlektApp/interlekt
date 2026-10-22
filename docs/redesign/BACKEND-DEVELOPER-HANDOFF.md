# Interlekt Redesign — Frontend to Backend Handoff

**From:** Product / Frontend Team  
**To:** Backend Developer  
**API Target:** `https://interlekt-backend.onrender.com`  
**Date:** October 2026  

---

Hey,

I want to give you a complete breakdown of where the Interlekt frontend stands with the new redesign, what is already working live against your Render backend, and the exact endpoints and model additions we need from you so we can unlock the rest of the product.

### The Big Picture & How We Built This
We had a total of **82 screens** designed for Interlekt across 4 shells: Public, Learner, Creator Studio, and Admin. 

One thing I locked down early: **we are treating this as a 100% real production app. No fake numbers, no mock data layer, no hardcoded stats.** 

Because of that:
- **43 screens** are completely built and wired up to your live backend right now. They pull real communities, real courses, real modules, real lessons, real posts, and real user profiles from Render.
- **39 screens** are on hold purely because the backend endpoints don't exist yet. Instead of hacking them together with fake mock data, we kept them gated with clean empty states or disabled tooltips until you build the endpoints.

---

### 1. What Is Already Working Live Against Your Backend
Everything below is live on the Next.js app and talking directly to `https://interlekt-backend.onrender.com`:

1. **Authentication:**
   - Registration (`POST /api/v1/auth/register`), Sign in (`POST /api/v1/auth/login`), Token Refresh, and Password Reset.
   - Auth tokens are handled as Bearer tokens in `localStorage` (`interlekt.access_token`).
2. **Public Explore & Communities:**
   - Community directory (`GET /communities`), detail pages (`GET /communities/{slug}`), creator profiles, categories, and live search.
3. **Learner Experience:**
   - Learner dashboard (`GET /users/me/learning`), enrolled communities, community feed/discussions (`GET|POST /communities/{slug}/posts`), reviews, and classroom lesson viewer with completion toggling (`POST|DELETE /lessons/{id}/complete`).
4. **Creator Studio:**
   - Onboarding, community creation with image uploads (`POST /uploads/images` and `POST /communities`), member list, full Course Builder (courses, modules reordering, lesson outlines), and Lesson Editor.
5. **Admin:**
   - Creator verification review workflow (`PATCH /api/v1/admin/creators/{user_id}/verification`).

---

### 2. Immediate Field Additions & Fixes Needed on Existing Endpoints

Before building new subsystems, there are a few missing fields on your existing models and endpoints that we need to make the live screens 100% complete and flexible:

| Endpoint / Model | What's Missing | Why We Need It |
|---|---|---|
| **Community model & endpoints** | `tags: string[]` (array of strings, e.g. `["Figma", "Nextjs", "Afrobeats"]`) | Rigid 8-category lists don't fit real creator niches. Creators need to type custom hashtags when creating/editing a community, and learners need to search by tags. |
| `GET /communities` | `rating` (float), `reviewCount` (int), `memberCount` (int), `tags` (string[]) | Our community cards show ratings, member counts, and tags. Right now we have to hide or default them because the list API omits them. |
| `GET /communities/{slug}` | `courses` array | The detail endpoint returns `courses: []` even when a community has courses published. We have to make a secondary call to fetch courses. |
| **User & Creator models** (`/users/me`, `/creators/me`) | `bannerUrl: string \| null` | Creators and learners can upload profile avatars today via `/uploads/images`, but they also need a personal profile header banner. |
| `GET /creators/me` | `memberCount` (int) | Needed for the creator studio stats header. |
| `PUT /creators/me` | `headline`, `coverUrl`, `socialLinks`, `bannerUrl` | When creators update their profile, the endpoint currently drops these fields. |
| **Render DB Cleanup** | Test records | During testing, a few test accounts and 3 "Probe Community" entries were created on Render. Please run a quick query to delete any communities with "Probe" in the title. |

---

### 3. The 39 Held Screens: What We Need You to Build Next

Here is the exact spec of endpoints we need you to add to `/api/v1`, grouped by feature priority:

#### Priority 1: Payments & Checkout (Paystack) — Unlocks B6, B11, B12, B13, B14
Right now, clicking "Join community" on paid communities returns `402 Payment Required`. We need:
1. `POST /api/v1/communities/{slug}/checkout`
   - Accepts `{ planType: "one_time | monthly | annual", discountCode?: string, callbackUrl: string }`
   - Returns `{ reference, authorizationUrl, amount, currency, fees }` (Paystack init).
2. `GET /api/v1/checkout/{reference}/verify`
   - Verifies Paystack reference and creates the enrollment.
3. `GET /api/v1/orders/me`
   - Flat paginated list of receipts for the learner's order history page.
4. `GET /api/v1/subscriptions/me` & `PATCH /api/v1/subscriptions/{id}`
   - List and cancel/pause recurring memberships.

#### Priority 2: Creator Revenue & Payouts — Unlocks C2, C7, C10, C16, C18
Creators need to see their real money:
1. `GET /api/v1/creators/me/revenue`
   - Summary object: `{ totalGrossRevenue, totalNetRevenue, pendingPayout, lifetimePayouts, platformFeeRate: 0.10 }`.
   - Note: Platform split is **90% creator / 10% platform**. Please serve this from the server rather than letting frontend hardcode it.
2. `GET /api/v1/communities/{slug}/transactions`
   - Ledger table: learner name, amount gross, Paystack processor fee, platform fee, creator net, status, date.
3. `GET|POST /api/v1/creators/me/payouts`
   - Request payout and view payout history.

#### Priority 3: Notifications & Preferences — Unlocks B8, C14, B21
1. `GET /api/v1/notifications` (paginated, with `unreadCount`).
2. `PATCH /api/v1/notifications/{id}/read` & `POST /api/v1/notifications/read-all`.
3. `GET|PUT /api/v1/me/notification-preferences`.

#### Priority 4: Community Discussions & Q&A Threads — Unlocks B28, B29, C20, A24
Right now we have basic feed posts, but we need threaded discussions:
1. `GET|POST /api/v1/communities/{slug}/threads`
2. `GET /api/v1/threads/{id}` (includes replies tree, upvotes, accepted answer).
3. `POST /api/v1/threads/{id}/replies` & `POST /api/v1/threads/{id}/vote`.

#### Priority 5: Learner Activity & Gamification — Unlocks B1, B27
1. `GET /api/v1/users/me/activity` (returns `{ currentStreak, longestStreak, totalMinutes, heatmap: [{ date, count }] }`).
2. `GET /api/v1/users/me/badges` (earned milestones).

#### Priority 6: Admin Dashboard & Audit Logs — Unlocks D1, D2, D4, D5, D6, D7, D8, D9
1. `GET /api/v1/admin/stats` (platform-wide counters).
2. `GET /api/v1/admin/users` (user search and status update).
3. `GET /api/v1/admin/audit-log` (event log).
4. `POST /api/v1/admin/payouts/{id}/decision` (`{ action: "approve | reject", reason: string }`).

---

### Response Format Reminder
Please stick to your existing conventions:
- Flat pagination envelope: `{ items, total, page, pageSize, totalPages }`.
- Money as decimal strings (`"2500.00"`), never floating point.
- Standard error shape: `{"error": {"code": "...", "message": "...", "details": {}}}`.

Let me know once you push any of these to Render, and we will immediately connect the remaining screens on our end!
