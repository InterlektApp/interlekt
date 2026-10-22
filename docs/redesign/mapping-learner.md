# Mapping — Learner (29 screens)

## Summary
- Screens mapped: 29
- LIVE: 0 · PARTIAL: 11 · MOCK: 0 · NEEDS-BACKEND: 18
- Backend endpoints used (existing, verified against `backend-openapi.json` + live `https://interlekt-backend.onrender.com`):
  `POST /api/v1/auth/register` · `POST /api/v1/auth/login` · `POST /api/v1/auth/logout` · `POST /api/v1/auth/refresh` · `GET /api/v1/auth/me` · `POST /api/v1/auth/forgot-password` · `POST /api/v1/auth/reset-password` · `GET /api/v1/users/me` · `PATCH /api/v1/users/me` · `GET /api/v1/users/me/learning` · `GET /api/v1/users/{user_id}` · `GET /api/v1/creators/{user_id}` · `GET /api/v1/categories` · `GET /api/v1/communities` · `GET /api/v1/communities/mine` · `GET /api/v1/communities/{slug}` · `GET /api/v1/communities/{slug}/courses` · `GET /api/v1/communities/{slug}/posts` · `POST /api/v1/communities/{slug}/posts` · `GET /api/v1/communities/{slug}/reviews` · `POST /api/v1/communities/{slug}/reviews` · `PATCH /api/v1/reviews/{id}` · `GET /api/v1/posts/{id}/comments` · `POST /api/v1/posts/{id}/comments` · `GET /api/v1/enrollments/mine` · `POST /api/v1/communities/{slug}/enroll` · `DELETE /api/v1/enrollments/{id}` · `GET /api/v1/courses/{id}` · `GET /api/v1/courses/{id}/progress` · `GET /api/v1/courses/{id}/modules` · `GET /api/v1/modules/{id}/lessons` · `GET /api/v1/lessons/{id}` · `POST /api/v1/lessons/{id}/complete` · `DELETE /api/v1/lessons/{id}/complete` · `POST /api/v1/uploads/images`
- Backend endpoints that must be built (all marked `NEW` in detail sections):
  - **Payments** — `GET /api/v1/communities/{slug}/plans` · `POST /api/v1/checkout/sessions` · `GET /api/v1/checkout/sessions/{checkoutId}` · `GET /api/v1/orders` · `GET /api/v1/orders/{orderId}` · `GET /api/v1/orders/{orderId}/refund-eligibility` · `POST /api/v1/refund-requests` · `GET /api/v1/payment-methods` · `POST /api/v1/payment-methods/setup` · `DELETE /api/v1/payment-methods/{id}` · `POST /api/v1/payment-methods/{id}/default` · `GET /api/v1/subscriptions` · `POST /api/v1/subscriptions/{id}/pause` · `POST /api/v1/subscriptions/{id}/resume` · `POST /api/v1/subscriptions/{id}/cancel` · `PATCH /api/v1/subscriptions/{id}` · `POST /api/v1/discounts/validate`
  - **Social** — `GET /api/v1/notifications` · `POST /api/v1/notifications/read` · `POST /api/v1/notifications/read-all` · `GET/PUT /api/v1/notification-preferences` · `GET /api/v1/privacy-settings` · `PUT /api/v1/privacy-settings` · `POST /api/v1/privacy-settings/blocked` · `DELETE /api/v1/privacy-settings/blocked/{userId}` · `GET /api/v1/communities/{slug}/rules` · `GET /api/v1/communities/{slug}/top-contributors` · `GET /api/v1/communities/{slug}/members/preview` · `GET /api/v1/threads` (per community) · `GET/POST /api/v1/communities/{slug}/threads` · `GET /api/v1/threads/{threadId}` · `POST /api/v1/threads/{threadId}/replies` · `POST /api/v1/threads/{threadId}/vote` · `POST /api/v1/replies/{id}/vote` · `POST /api/v1/threads/{threadId}/mark-answer` · `POST /api/v1/threads/{threadId}/bookmark` · `POST /api/v1/threads/{threadId}/subscribe` · `POST /api/v1/threads/{threadId}/flag` · `GET /api/v1/communities/{slug}/tags` · `POST /api/v1/posts/{id}/like` · `GET /api/v1/posts/{id}/likes`
  - **Messaging** — `GET /api/v1/conversations` · `GET /api/v1/conversations/{id}` · `POST /api/v1/conversations` · `POST /api/v1/conversations/{id}/messages` · `GET /api/v1/conversations/{id}/messages` · `POST /api/v1/conversations/{id}/read`
  - **Calendar** — `GET /api/v1/sessions` · `GET /api/v1/sessions/{id}` · `POST /api/v1/sessions/{id}/subscribe` · `DELETE /api/v1/sessions/{id}/subscribe` · `GET /api/v1/sessions/{id}/recording`
  - **Certificates** — `GET /api/v1/certificates` · `GET /api/v1/certificates/{id}` · `GET /api/v1/certificates/verify/{certificateNumber}` (public)
  - **Activity / gamification** — `GET /api/v1/users/me/activity` · `GET /api/v1/users/me/badges`
  - **Account / security** — `GET /api/v1/auth/sessions` · `DELETE /api/v1/auth/sessions/{id}` · `POST /api/v1/auth/sessions/revoke-all` · `GET /api/v1/auth/login-history` · `POST /api/v1/auth/2fa/setup` · `POST /api/v1/auth/2fa/enable` · `POST /api/v1/auth/2fa/disable` · `PATCH /api/v1/users/me/email` · `POST /api/v1/users/me/email/confirm` · `PATCH /api/v1/users/me/password` · `GET/PUT /api/v1/connected-accounts` · `POST /api/v1/connected-accounts/{service}/connect` · `DELETE /api/v1/connected-accounts/{service}` · `POST /api/v1/data-exports` · `GET /api/v1/data-exports` · `GET /api/v1/data-exports/{id}/download` · `DELETE /api/v1/users/me` · `GET /api/v1/users/{username}` (public by username)
  - **Schema extensions (no new path)** — `ProfileUpdateRequest` + `ProfileResponse`: `username`, `location`, `pronouns`, `coverUrl`, `interests[]`, `emailVerified`, `phoneNumber` · `AuthorSummary.isVerified` · `ReviewCreateRequest/ReviewResponse`: `recommend`, `showNamePublicly`, `editedAt`, `editableUntil` · `EnrollmentResponse.learningStatus` · `LearningCommunityItem.status`, `LearningCommunityItem.nextLessonTitle` · `LessonResponse.contentBlocks[]`, `LessonResponse.transcriptUrl`, `LessonResponse.resources[]` · `ModuleResponse.isLocked`, `ModuleResponse.unlocksAfterLessonId` · `CommunityDetail.rules[]` · `MemberResponse` → learner-readable member preview

---

## Table

| Screen ID | Design file | Next.js route | Status | Backend endpoint(s) | Data fields the screen needs | Notes / gaps |
|---|---|---|---|---|---|---|
| B1 | `learner/B1-dashboard.html` | `/dashboard` — **EXISTING** | PARTIAL | `GET /users/me/learning`, `GET /communities/{slug}`, `GET /courses/{id}/progress`, `GET /lessons/{id}` | streakDays, lessonsCompleted, weeklyMinutes, activeCommunities, continue-learning cards (cover/title/currentLesson/progressPct), 5×7 weekly activity grid, upcoming live sessions, streak milestone ring | Community count + lessons completed + course % are LIVE. Streak, weekly minutes, activity grid, live sessions have no source. |
| B2 | `learner/B2-my-communities.html` | `/my-communities` — **EXISTING** | PARTIAL | `GET /users/me/learning`, `GET /enrollments/mine`, `GET /communities/{slug}` | per community: cover, title, creator+verified, category, memberCount, rating, progressPct, lessonsComplete, lessonsTotal, status(active/completed/archived), nextLessonTitle; tab counts (All/Active/Completed/Archived); sort + grid/list toggle | Progress, price/Free badge, creator verified, memberCount, rating, reviewCount all LIVE. `archived` and `completed` enrollment states and `nextLessonTitle` need a new backend field. |
| B3 | `learner/B3-classroom.html` | `/communities/[slug]/classroom` — **EXISTING** | PARTIAL | `GET /communities/{slug}`, `GET /courses/{id}`, `GET /courses/{id}/progress`, `GET /communities/{slug}/members` | modules[] (title, lessonCount, completionPct, isLocked), lessons[] (title, duration, status done/current/locked), overall progress %, est. remaining time, community info card, next live session, members avatar stack + "+1,232 more" | Module/lesson tree, durations, per-lesson completion and module completion % are LIVE. **Lock states have no backend model.** **Member stack is impossible for learners — `GET /communities/{slug}/members` returns 403 `forbidden` ("Only the community's creator can view its members").** Next session needs calendar. |
| B4 | `learner/B4-lesson-view.html` | `/communities/[slug]/classroom/lessons/[lessonId]` — **EXISTING** | PARTIAL | `GET /lessons/{id}`, `GET /courses/{id}`, `GET /courses/{id}/progress`, `POST/DELETE /lessons/{id}/complete` | lesson.title, durationSeconds, videoUrl, overview content, code example, keyTakeaways[], tryItPrompt, transcript, resources[] (filename/size/type), tab counts (Discussion 24), prev/next, mark-complete, ask-the-creator | Lesson title/summary/content/videoUrl/durationSeconds + mark-complete + prev/next are LIVE. `content` is one opaque string — no structured code block / takeaways / try-it / transcript. No resource/file entity on lessons. No lesson comment thread. Ask-the-creator needs DMs or lesson Q&A. |
| B5 | `learner/B5-community-feed.html` | `/communities/[slug]/feed` — **EXISTING** | PARTIAL | `GET /communities/{slug}/posts`, `POST /communities/{slug}/posts`, `GET /posts/{id}/comments`, `GET /communities/{slug}` | posts[] (author name/photo/verified/role, time, body, image, likes, comments), pinned/announcement, tab counts (Feed/Q&A/Announcements/Members), community rules[4], topContributors[5] (name, posts, photo, verified), onlineCount, memberCount, upcoming sessions | Posts, author, createdAt, isPinned, isAnnouncement, commentCount, memberCount are LIVE. **No likes entity.** No Q&A flag. No rules entity. No contributor aggregation. No online count. `AuthorSummary` has no `isVerified`. Post has no attachment. Feed is **403 for non-enrolled users**. |
| B6 | `learner/B6-enroll-checkout.html` | `/enroll/[communityId]` — **EXISTING** (free-enroll only today) | NEEDS-BACKEND | `GET /communities/{slug}` only | plans[] (monthly/lifetime + prices + save %), selected plan, discount code + amount, VAT rate + amount, line items, subtotal/discount/VAT/total, card form, receipt (orderId, amountPaid, paystackFee, creatorNet 88 %), 3 payment methods | **No payments subsystem exists.** `POST /communities/{slug}/enroll` returns 402 `payment_required` for paid communities. Full contract below. |
| B7 | `learner/B7-profile.html` | `/profile` — **EXISTING** | PARTIAL | `GET /users/me`, `GET /auth/me`, `GET /users/me/learning`, `GET /enrollments/mine`, `GET /communities/{slug}` | displayName, role, location, bio, interests[], joinedDate, streakDays, lessonsCompleted, weeklyMinutes, communitiesJoined, achievements[] (4), email, notificationPrefs[], paymentMethods[], transactions[] | displayName/bio/avatarUrl/roles/createdAt + course progress + enrollment count are LIVE. Location, interests, streak, time, achievements, billing all have no source. `AccountResponse` has no `emailVerified` / phone. |
| B8 | `learner/B8-notifications.html` | `/notifications` — **NEW** | NEEDS-BACKEND | none | notifications[] (id, type, actor, content, timestamp, unread), filter counts (all 24 / unread 8 / mentions 3 / replies 5 / live 2), mark-all-as-read, load-more | No notifications subsystem at all. Full contract below. |
| B9 | `learner/B9-messages.html` | `/messages` — **NEW** | NEEDS-BACKEND | none | conversations[] (id, name, lastMessage, timestamp, unreadCount, isGroup), messages[] (author, body, timestamp, hasCodeBlock), partner profile (name, role, verified), new-message + attach actions | No messaging subsystem. Full contract below. |
| B10 | `learner/B10-settings.html` | `/settings` — **NEW** | PARTIAL | `PATCH /users/me`, `GET /auth/me` | email (readonly), phone (masked), displayName (editable), bio (editable), 8 notification toggles, 5 privacy toggles, connected accounts[3], saved cards[2], default payment method, danger-zone delete | Only displayName + bio are writable today. `ProfileUpdateRequest` = {displayName, avatarUrl, bio}. No phone, no email change, no notification/privacy prefs, no connected accounts, no cards. **Design conflict: B10's 6-item sidebar vs B19–B26's 8-item `.settings-shell` sidebar — two competing settings shells.** |
| B11 | `learner/B11-order-history.html` | `/orders` — **NEW** | NEEDS-BACKEND | none | orders[] (id, date, community, plan, amount, status, receiptUrl), filters (dateRange, status), lifetime totals (totalSpent ₦158,700, 12 orders, 1 refunded), Export CSV | No order/transaction ledger exists. Full contract below. |
| B12 | `learner/B12-manage-subscription.html` | `/subscriptions` — **NEW** | NEEDS-BACKEND | none | subscriptions[] (community, creator, status active/paused, plan, price, nextBilling, paymentMethod, enrolledSince, pausedOn), lifetimeAccess[], actions pause/resume/cancel/updatePayment | No subscription entity. `EnrollmentResponse.status` is only pending/active/cancelled. Full contract below. |
| B13 | `learner/B13-payment-methods.html` | `/payment-methods` — **NEW** | NEEDS-BACKEND | none | savedCards[] (type, last4, expiry, isDefault), add-card form (number, expiry, cvv, name), edit/remove/make-default actions | No stored payment methods. Raw PAN must never hit our server — use a Paystack setup/authorization-code flow. Full contract below. |
| B14 | `learner/B14-refund-request.html` | `/refund` — **NEW** | NEEDS-BACKEND | none | eligibleOrders[] (id, communityName, date, amount, plan), refundEligibilityCheck(orderId) → bool + reason, 5 refund reasons, notes, acknowledgment, submit → refundId | No refunds, no orders. Full contract below. |
| B15 | `learner/B15-onboarding.html` | `/welcome` — **NEW** | NEEDS-BACKEND | `GET /categories` | 12 topic chips, 4 preselected, "Selected: 4 of 12" count, step 2 of 3, continue/back | `GET /categories` returns **8** real categories, and the design's 12 labels ("AI & Engineering", "Product Design", "FinTech & Business", "Content & Creative", "Cybersecurity", "Data & ML", "Marketing & Growth", "Career & Soft Skills", "Languages", "Academics", "Web Development", "Mobile Development") **do not map 1:1 onto the 8 category names**. No user-interest field exists to persist the selection. Step state is client-side. |
| B16 | `learner/B16-certificate.html` | `/certificate/[certificateId]` — **NEW** | NEEDS-BACKEND | none | certificate.id, recipientName, communityTitle, creatorName, creatorRole, completedDate, verifyUrl, achievements[4] (lessons, live sessions, capstone, alumni community) | No certificates subsystem. `CommunityDetail.reviewCount`/`rating` are unrelated. Full contract below. |
| B17 | `learner/B17-write-review.html` | `/communities/[slug]/review` — **NEW** | PARTIAL | `GET /communities/{slug}`, `GET /communities/{slug}/reviews`, `POST /communities/{slug}/reviews`, `PATCH /reviews/{id}` | community.title, creatorName, rating 1–5, body, recommend (yes/no), showNamePublicly toggle | `ReviewCreateRequest` = {rating, content} — **rating and body are LIVE**. `recommend` and `showNamePublicly` are not in `ReviewCreateRequest`/`ReviewResponse` → need two new fields. "Edit within 30 days" has no server-side window. |
| B18 | `learner/B18-calendar.html` | `/calendar` — **NEW** | NEEDS-BACKEND | none | weekRange, sessionsByDay[] (day, date, time, title, community, host, status, badge "In N days"), upcomingThisMonth[5], pastSessions[3] + recordingUrl, timeZone (Africa/Lagos, GMT+1), Subscribe | No calendar/events entity. Full contract below. |
| B19 | `learner/B19-edit-profile.html` | `/settings/profile` — **NEW** | PARTIAL | `GET /users/me`, `PATCH /users/me`, `POST /uploads/images` | displayName, username, bio, location, pronouns, photoUrl, coverUrl, username availability check | `ProfileUpdateRequest` = {displayName, avatarUrl, bio} → 3 of 7 fields LIVE. `username`, `location`, `pronouns`, `coverUrl` need new fields. **Username has no uniqueness check endpoint** and no public profile route (`GET /users/{user_id}` is by UUID; the app serves creators at `/creators/[slug]`). |
| B20 | `learner/B20-email-password.html` | `/settings/account` — **NEW** | PARTIAL | `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` | email + verified flag, passwordLastChanged, twoFactorEnabled + method, 2FA QR + 10 recovery codes, loginHistory[3] (device, ip, location, time) | Email value LIVE via `AccountResponse.email`. **No email-change endpoint. No password-change endpoint** (only forgot→reset via emailed token). **No 2FA. No login history. No `passwordLastChanged` field.** Design bug: recovery codes are rendered while 2FA is "Not enabled". |
| B21 | `learner/B21-notification-preferences.html` | `/settings/notifications` — **NEW** | NEEDS-BACKEND | none | email (6 toggles), push (5 toggles), in-app (4 toggles), email address, "Enable on this device", last-saved | No notification preferences storage. Full contract below. |
| B22 | `learner/B22-privacy.html` | `/settings/privacy` — **NEW** | NEEDS-BACKEND | none | profileVisibility (public/members/private), dmPermission (anyone/communities/noone), allowMentions, showActivity, showLastActive, blockedUsers[] (id, displayName, username, avatar, blockedAt) | No privacy model, no block list, no DM permission concept. Full contract below. |
| B23 | `learner/B23-connected-accounts.html` | `/settings/connected` — **NEW** | NEEDS-BACKEND | none | connectedAccounts[] (Google, Paystack, GitHub, Discord — status, description, connectedAt, scopes) | No OAuth / connected-account store. Full contract below. |
| B24 | `learner/B24-sessions.html` | `/settings/sessions` — **NEW** | NEEDS-BACKEND | `POST /auth/logout` only | activeSessions[] (device, location, browser, lastActive, isCurrent), loginHistory[] (date, device, ip, location, status success/failed), revoke one, log out all, lastPasswordChange, CSV download | `POST /auth/logout` revokes exactly **one** refresh token. There is no session list, no revoke-one, no revoke-all, no login history, no failed-attempt log. Full contract below. |
| B25 | `learner/B25-data-export.html` | `/settings/data` — **NEW** | NEEDS-BACKEND | none | 4 export categories, exportHistory[] (id, requestedAt, fileSize, downloadUrl, expiresAt), request-export, download, delete-account link | No export subsystem. Note the "Payments & orders" and "Certificates" categories reference data that also does not exist. Full contract below. |
| B26 | `learner/B26-delete-account.html` | `/settings/delete` — **NEW** | NEEDS-BACKEND | none | 6 delete reasons + free-text feedback, 4 confirmation checkboxes, type-"DELETE" gate, activeSubscription count | No account-deletion endpoint exists (no `DELETE /users/me`). Full contract below. |
| B27 | `learner/B27-activity.html` | `/activity` — **NEW** | NEEDS-BACKEND | none | memberSince, contributionsThisYear (247), currentStreak (12), longestStreak (47), weeklyHours (8h24m), heatmap[365] levels 0–4, activityTimeline[6] with dot colours, badges[] (name, tier bronze/silver/gold/platinum, earnedAt), monthlyContributions[12] | No activity/streak/badge/heatmap data. `LessonProgressResponse.completedAt` and `CourseProgressResponse.lessons[].completedAt` are the only raw event timestamps — no daily aggregation endpoint. Full contract below. |
| B28 | `learner/B28-discussions.html` | `/communities/[slug]/discussions` — **NEW** | NEEDS-BACKEND | `GET /communities/{slug}` (name/memberCount only) | threads[] (id, title, preview, author, votes, replies, tags[], createdAt, pinned, announcement, answered), sortTabs (all 47 / hot / new / top / unanswered 12), tag chips with counts, communityRules[4], topContributors[5] (posts + upvotes) | Backend has **flat posts + flat comments** — no thread, no vote, no tag, no answer, no nesting (`CommentResponse` has no `parentCommentId`). Full contract below. |
| B29 | `learner/B29-thread-detail.html` | `/communities/[slug]/discussions/[threadId]` — **NEW** | NEEDS-BACKEND | none | thread.title/body/author/createdAt/votes/tags[]/replyCount, replies[] (author, body, votes, createdAt, isAnswer, children[]), mark-as-answered, upvote, bookmark, share, flag, subscribe-to-replies, sort (top/newest/oldest) | Same gap as B28, plus nesting, answer marking, bookmarks, flags, subscriptions. Full contract below. |

---

## Per-screen detail

### B1 — Learner dashboard (`learner/B1-dashboard.html` → `/dashboard`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Greeting** — "Welcome back, Ada" → `GET /users/me` → `ProfileResponse.displayName` (first-name split client-side). LIVE.
  2. **Stat row (4 number-first cards)**
     - Streak `12 days`, "+2 from last week" → **no source**. Streak is not derivable from any endpoint (`LessonProgressItem.completedAt` is per-lesson and uncapped; no daily rollup). GAP.
     - Lessons completed `47`, "+5 this week" → **LIVE**: sum of `LearningCommunityItem.courses[].completedLessons` from `GET /users/me/learning`. The "+5 this week" delta needs a week-scoped aggregate → GAP.
     - This week `8h 24m` → **no source** (no time-tracking). GAP.
     - Active communities `3` → **LIVE**: `GET /users/me/learning` → `items.length` (or `GET /enrollments/mine` filtered to `status === "active"`).
  3. **Continue learning (2 cards)** — cover image, course title, "Lesson 8 · Few-shot prompting patterns", progress bar %, "12 of 20 lessons · 60%" → cover/title/**percentage** are LIVE (`LearningCourseItem.percentComplete`, `totalLessons`, `completedLessons`; `CommunityRef.imageUrl`). The **current lesson title** is not in `LearningCommunityItem`: derive it client-side as `GET /courses/{courseId}/progress` → `lessons[]` first entry with `completed === false` (ordered by `position`), then `GET /lessons/{lessonId}` → `LessonResponse.title`. N+1 (1 + 2 requests per community) — acceptable for ≤5 cards, but a `nextLessonTitle` field on `LearningCourseItem` would remove it.
  4. **Your communities (3 cards)** — cover, title, creator name + photo + verified, progress %, lessons count → `GET /users/me/learning` + `GET /communities/{slug}` → `CommunityDetail.creator` (`CreatorSummary.displayName`, `avatarUrl`, `isVerified`). LIVE.
  5. **Right rail — This week's activity (5×7 dot grid, "32 of 35 days")** → **no source**. GAP.
  6. **Right rail — Upcoming live sessions (title, day, time, host, Add to calendar)** → **no source**. GAP → calendar subsystem.
  7. **Right rail — Streak card (12 days, 14-day milestone dots, "Next milestone: 14 days · 2 days to go")** → **no source**. The 14-day milestone constant is hardcoded; a real milestone ladder needs a `GET /users/me/badges`/`activity` feed.
- **Reusable components:** `.stat` / `.stat-value` / `.stat-label` / `.stat-meta`; `.community-card` + `.community-card-cover` / `-body` / `-title` / `-creator`; `.progress` + `.progress-bar`; `.card card-sm`; `.avatar avatar-sm` + teal verified check (`--verify`); `ILK.injectNavTop('', { signedIn: true })`.
- **Empty/loading/error states needed:** no enrollments → "You haven't joined anything yet" (already implemented in the current page — keep it); no learning data → "Unavailable" for the streak card (current page already does this); loading skeleton per card; 401 → sign-in prompt.
- **Backend work required:** NEW `GET /users/me/activity` (streak + daily heatmap + weekly minutes) — **M**; NEW `GET /sessions` (upcoming live sessions) — **M**; optional NEW field `LearningCourseItem.nextLessonTitle` — **S**.

### B2 — My communities (`learner/B2-my-communities.html` → `/my-communities`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Subhead "3 active · 1 completed · 2 archived"** → `active` = `GET /enrollments/mine` → `EnrollmentResponse.status === "active"` (LIVE). `completed` = derivable (all courses `percentComplete === 100`) but **not stored**. `archived` → **no source at all**.
  2. **Sort select (Recent / Progress / Alphabetical)** → client-side over the loaded list. No backend need. (Note: the backend's `CommunitySort` enum is `newest | most_members | alphabetical` — no "progress" sort; do it client-side.)
  3. **View toggle (Grid / List)** → client-side state. No backend need.
  4. **Tabs with counts (All 6 / Active 3 / Completed 1 / Archived 2)** → counts must come from a per-community status. GAP for `completed` + `archived`.
  5. **Community cards (5 shown)** — cover → `CommunityRef.imageUrl` (LIVE); title → `CommunityRef.title` (LIVE); creator name + photo + verified → `GET /communities/{slug}` → `CommunityDetail.creator` (LIVE); "Free" badge → `CommunityRef.isFree` (LIVE); progress bar + "12 of 20 lessons · 60%" → `LearningCourseItem` (LIVE); "Continue →" / "View certificate →" → link state derived from status; **"View certificate" needs a certificate id that does not exist** (see B16).
  6. **Not shown but in the header comment:** per-community `category`, `membersCount`, `rating` → `GET /communities/{slug}` → `CommunityDetail.categories[0].name`, `.memberCount`, `.rating`, `.reviewCount` (LIVE, but requires 1 request per community — N+1; batch with `useQueries`).
  7. **Empty state (documented in an HTML comment)** — "No communities yet" + Browse CTA → `GET /enrollments/mine` empty. Implement as written; already exists in the current page.
- **Reusable components:** `.tabs` + `.tab` + `.tab-count`; `.community-card`; `.badge-fill-accent` (Free); `.progress`; `.select`; `.grid-auto-lg`; `.empty` + `.empty-icon` / `.empty-title` / `.empty-text`.
- **Empty/loading/error states needed:** no communities → documented `.empty` block; 401 → sign-in; per-card community fetch failure → fall back to `CommunityRef` only (no creator/rating).
- **Backend work required:** NEW field `EnrollmentResponse.learningStatus: "active" | "completed" | "archived"` (+ `archivedAt`) — **S**; NEW field `LearningCommunityItem.status` + `nextLessonTitle` — **S**; NEW `GET /certificates?communityId=` for the certificate link — **M** (shared with B16).
- **Design-vs-backend note:** the header comment says 5 communities (3 active / 1 completed / 1 archived) but the page subhead says "3 active · 1 completed · 2 archived" and the tabs say All 6 — while only 5 cards are rendered and none is archived. The tab counts and the card list disagree in the mock.

### B3 — Classroom (`learner/B3-classroom.html` → `/communities/[slug]/classroom`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Breadcrumb** — community title from `GET /communities/{slug}` → `CommunityDetail.title`. LIVE.
  2. **Header "4 modules · 20 lessons · 8h 24m total"** → module/lesson counts: `CourseDetail.moduleCount` / `.lessonCount` (LIVE) — but the community has **multiple courses** and the design treats it as one flat module list. The backend nests modules *inside a course*: `CommunityDetail.courses[]` → `CourseSummary` → `GET /courses/{id}` → `CourseDetail.modules[]`. The classroom must be rendered **per course**, not per community. **Total duration 8h24m**: computable client-side by summing `LessonOutline.durationSeconds` — LIVE (computed).
  3. **Large progress bar "12 of 20 lessons complete · 60%"** → `GET /courses/{id}/progress` → `CourseProgressResponse.completedLessons` / `.totalLessons` / `.percentComplete` (LIVE).
  4. **Module accordions (4)** — "01 Foundations · 5 lessons · 100%" → `CourseDetail.modules[]` → `ModuleWithLessons.title` / `.position` / `.lessonCount` (LIVE); completion % → `CourseProgressResponse.modules[]` → `ModuleProgressItem.completedCount` / `.lessonCount` (LIVE).
  5. **Lesson rows (status done / current / locked + title + duration "8:42")** → `ModuleWithLessons.lessons[]` → `LessonOutline.id` / `.title` / `.durationSeconds` / `.position` (LIVE); done/current → `CourseProgressResponse.lessons[]` → `LessonProgressItem.completed` (LIVE, join on `lessonId`); duration → format `durationSeconds` to `m:ss` (LIVE). **Locked**: **no backend model** — `ModuleResponse.isPublished` is a *publish* flag, not a prerequisite lock. A locked module/lesson needs a new prerequisite field.
  6. **Right rail — community info card** — cover, title, creator name + photo + verified → `CommunityDetail` (LIVE); "1,240 members · AI & Engineering" → `.memberCount` + `.categories[0].name` (LIVE).
  7. **Right rail — Your progress** — 60% (LIVE), "12 of 20" (LIVE), "Est. 3h 12m remaining" → computed from `LessonProgressItem.durationSeconds` of incomplete lessons (LIVE, computed).
  8. **Right rail — Next live session (title, "Wed 22 Oct · 6pm WAT", host, Add to calendar)** → **no source**. GAP → calendar subsystem.
  9. **Right rail — Members avatar stack (8 photos) + "+1,232 more"** → **BLOCKED**: `GET /communities/{slug}/members` returns **403 `forbidden`** for learners (verified live). It is a creator-only endpoint. `CommunityDetail.memberCount` gives the count (LIVE) but not the photos. Needs a new learner-readable preview endpoint.
- **Reusable components:** `.module-accordion` / `.module-header` / `.module-number` / `.module-title` / `.module-meta`; `.lesson-row` / `.lesson-title` / `.lesson-meta` / `.lesson-status` (`.done` / `.current` / `.locked`); `.progress.progress-lg`; `.avatar-stack`; `.alert-info`; `.breadcrumb`; `.card card-sm`.
- **Empty/loading/error states needed:** community not found → 404; not enrolled → 403 → "Join to unlock this classroom" CTA to `/enroll/{slug}`; no published courses → "No published courses yet" (already implemented); per-course progress failure → "Personal progress is unavailable" (already implemented) and hide done/locked marks.
- **Backend work required:** NEW `GET /communities/{slug}/members/preview?limit=8` (learner-readable, avatar + displayName + count) — **S**; NEW `ModuleResponse.isLocked` + `unlocksAfterLessonId` (+ lesson-level equivalent) — **M**; NEW `GET /sessions?communityId=` for the next-session card — **M**.
- **Design-vs-backend note:** module 2 header says "6 lessons · 67%" but shows 2 done + 1 current out of 6 = 50%. Module durations and the 8h24m "total" are copy-pasted from the dashboard's "this week" figure in B1 — the same number appears in two different meanings.

### B4 — Lesson view (`learner/B4-lesson-view.html` → `/communities/[slug]/classroom/lessons/[lessonId]`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Video player** — poster, `14:32` duration, 16:9 letterbox → `GET /lessons/{id}` → `LessonResponse.videoUrl` + `.durationSeconds` + `.contentType` (LIVE). Real `<video>`/player instead of the mock frame.
  2. **Tabs Overview / Transcript / Resources / Discussion (24)** — Overview = `LessonResponse.content` (LIVE but opaque). **Transcript**: no field → GAP. **Resources**: no field → GAP. **Discussion count 24**: lessons have no comment thread — `GET /posts/{id}/comments` is per *post*, not per lesson. GAP (or re-point the tab at the community feed, but then the count is wrong).
  3. **Overview content** — H1 (LIVE), 3 paragraphs, a `<pre><code>` block, 4 "Key takeaways" bullets, a "Try it yourself" callout → `LessonResponse.content` is a **single free-form string** with `contentType ∈ {text, video}`. There is no structured representation of code examples, takeaways, or callouts. Either (a) define a content-block format, or (b) render `content` as Markdown and require creators to author the blocks in Markdown. Option (b) is zero backend work; option (a) is a schema change.
  4. **Right rail — lesson list (Module 2 · Lessons, 6 rows, done/current/locked)** → `GET /courses/{id}` → `ModuleWithLessons.lessons[]` + `GET /courses/{id}/progress` → `CourseProgressResponse.lessons[]` (LIVE for done/current; **locked** GAP).
  5. **Right rail — Lesson resources (3 files: name + size, download icon)** → **no file/resource entity**. `POST /uploads/images` exists but is image-only and not attachable to a lesson. GAP.
  6. **Right rail — Ask the creator (avatar, name, "Creator · replies in ~12h", textarea, Send)** → needs DMs (B9 subsystem) or a lesson-scoped Q&A. The "replies in ~12h" SLA is creator metadata that does not exist. GAP.
  7. **Footer nav — Previous (Lesson 2) / Mark as complete / Next (Lesson 4)** → `POST /lessons/{id}/complete` and `DELETE /lessons/{id}/complete` (LIVE, and the current page already implements both). Prev/next computed from the module's lesson order (LIVE).
- **Reusable components:** `.tabs` + `.tab-count`; `.alert-info`; `.lesson-row`; `.card card-sm`; `.field` + `.textarea`; `.btn-primary.btn-lg`; `.breadcrumb`; `<pre><code>` mono on `--paper-2`.
- **Empty/loading/error states needed:** no video → "No video for this lesson" (already implemented); empty content → fall back to `summary`; lesson not published / not enrolled → 403 → "Enroll to unlock this lesson"; complete mutation failure → inline error.
- **Backend work required:** NEW `LessonResponse.contentBlocks[]` (typed: `paragraph` | `code` | `takeaways` | `callout` | `image`), `transcriptUrl`, `resources[{name, sizeBytes, type, url}]` — **M** (or zero if Markdown-only content is accepted); NEW `LessonResponse.isLocked` + `unlocksAfterLessonId` — **S**; NEW `POST /lessons/{id}/questions` (ask-the-creator) — **S** if scoped to lessons, otherwise part of the DMs subsystem — **L**.

### B5 — Community feed (`learner/B5-community-feed.html` → `/communities/[slug]/feed`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Header "Posts, questions, and announcements from {title} · 1,240 members"** → `GET /communities/{slug}` → `CommunityDetail.title` + `.memberCount` (LIVE).
  2. **Tabs Feed / Q&A (18) / Announcements (3) / Members (1,240)** → Feed = all posts (LIVE). Announcements = filter on `PostResponse.isAnnouncement` (client-side; the endpoint has no filter param). **Q&A has no post flag** → GAP. Members count = `CommunityDetail.memberCount` (LIVE) but the tab's *list* needs the member list, which is 403 for learners → GAP.
  3. **Composer** — textarea + "Image / Code / Link" buttons + Post → `POST /communities/{slug}/posts` with `{content}` (LIVE). **`PostCreateRequest` = {content, isPinned, isAnnouncement}** — no attachment, no code-block, no link-preview fields → the three buttons have no backend target. GAP.
  4. **Post cards (6 in the mock)** — author photo + name + verified check + role ("Creator" / "Learner") + relative time + body + footer (likes / comments / share) →
     - author name + photo: `PostResponse.author` → `AuthorSummary.displayName` / `.avatarUrl` (LIVE).
     - **verified check on the author**: `AuthorSummary` has **no `isVerified`** → GAP (schema extension).
     - **author role**: `AuthorSummary` has no role/roles → GAP (would need `GET /users/{user_id}` per author — N+1 — or a new field).
     - relative time: `PostResponse.createdAt` (LIVE, computed).
     - body: `PostResponse.content` (LIVE).
     - **likes "89 likes"**: no like entity anywhere in the backend → GAP.
     - comments count: `PostResponse.commentCount` (LIVE).
     - **image attachment (Emeka's MLOps diagram)**: no attachment field → GAP.
     - "Pinned" / "Announcement" tags: `PostResponse.isPinned` / `.isAnnouncement` (LIVE).
  5. **Right rail — community card (cover, title, "47 online now", memberCount, Classroom + joined buttons)** → cover/title/memberCount LIVE; **online count has no source** (and the brief bans a green presence dot) → GAP.
  6. **Right rail — Community rules (4 numbered)** → **no rules entity on `CommunityDetail`** → GAP.
  7. **Right rail — Top contributors this week (5: name, photo, verified, "14 posts", rank)** → no aggregation endpoint → GAP.
  8. **Right rail — Upcoming (2 sessions: day, date, title, time, host)** → calendar subsystem → GAP.
- **Reusable components:** `.post-card` / `.post-announcement` (accent left rule) / `.post-header` / `.post-author` / `.post-meta` / `.post-body` / `.post-footer` / `.post-action`; `.badge-fill-accent` (Pinned), `.badge-info` (Announcement); `.tabs`; `.avatar`; `.card card-sm`; `ILK.injectNavTop`.
- **Empty/loading/error states needed:** no posts → "No posts yet / Start the first conversation" (already implemented); **403 for non-enrolled users** (verified live) → "Join this community to see the feed" with an enroll CTA; composer 403 → disable and explain.
- **Backend work required:** NEW `AuthorSummary.isVerified` + `AuthorSummary.roles` — **S**; NEW `POST /posts/{id}/like` + `DELETE /posts/{id}/like` + `GET /posts/{id}/likes` + `PostResponse.likeCount`/`viewerHasLiked` — **M**; NEW `PostCreateRequest.attachments[]` — **M**; NEW `CommunityDetail.rules[]` — **S**; NEW `GET /communities/{slug}/top-contributors?window=week` — **M**; NEW `GET /communities/{slug}/online-count` (or drop the metric) — **S**; NEW `GET /sessions?communityId=` — **M**.

### B6 — Enroll / checkout (`learner/B6-enroll-checkout.html` → `/enroll/[communityId]`, EXISTING route, currently free-enroll only)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Order summary — community thumb + title + creator name + photo + verified** → `GET /communities/{slug}` → `CommunityDetail.imageUrl` / `.title` / `.creator.displayName` / `.creator.avatarUrl` / `.creator.isVerified`. LIVE today.
  2. **Plan selector (radio cards)** — Monthly `₦8,500/mo` "Billed each month · cancel anytime"; Lifetime `₦85,000` "One-time payment · access forever" + "Save 17%" badge → **the backend stores one flat `CommunityDetail.priceAmount`** ("2500.00" on live data) with no plan, interval, or lifetime option. GAP → new `Plan` resource.
  3. **Line items** — "AI Engineering Foundations — monthly ₦8,500"; "Discount code ADA15 −₦1,275" → no discount-code store, no plan-scoped line item. GAP.
  4. **Totals** — Subtotal ₦8,500 / Discount −₦1,275 / VAT (7.5%) ₦544 / Total today ₦7,769 → **no tax configuration, no discount, no order entity**. GAP. These must be computed **server-side** so the amount charged equals the amount displayed.
  5. **Payment method tabs** — Card / Bank transfer / USSD → Paystack supports card/bank/USSD; no backend representation today.
  6. **Card form** — card number, expiry, CVV, name on card → **the raw PAN/CVV must not be posted to our API** (PCI). Use Paystack's card iframe or a setup/authorization-code flow. The "Paystack" branding + "Secured by Paystack · 256-bit SSL" line is a provider choice, not a backend field.
  7. **Success state** — alert, "Start Lesson 1" / "Go to dashboard", and a Receipt: Order ID `#ILK-7283`, Amount paid ₦7,769, Payment method "Paystack · Visa ending 0000", Date, **Creator receives ₦6,837 (88%)**, **Platform fee ₦932 (12%)**, "Download receipt (PDF)" → requires an order entity, a fee split, a receipt document, and a card-brand/last4 token. GAP.
- **Concrete NEW contract (payments subsystem — implement as specified):**

  ```
  NEW GET /api/v1/communities/{slug}/plans
  200 -> { items: [
    { id, communityId, code, name,                 // e.g. "monthly" | "lifetime"
      interval: "month" | "year" | "one_time",
      priceAmount: "8500.00", priceCurrency: "NGN",  // decimal string
      compareAtAmount: string | null,                // for the "Save 17%" badge
      savePercent: 17 | null,
      isDefault: true, features: [string], isActive: true, sortOrder: 1 }
  ] }
  ```
  ```
  NEW POST /api/v1/checkout/sessions
  Request  { communityId: uuid, planCode: string, discountCode?: string,
             paymentMethod: "card" | "bank" | "ussd", returnUrl?: string }
  200 -> { checkoutId, reference: "ILK-7283", authorizationUrl, accessCode?: string,
           currency: "NGN",
           subtotalAmount: "8500.00", discountAmount: "1275.00",
           vatRate: "0.075", vatAmount: "541.88", totalAmount: "7766.88",
           discount: { code: "ADA15", percent: 15 } | null,
           platformFeeRate: "0.12", platformFeeAmount: "932.03",
           creatorNetAmount: "6834.85",
           lineItems: [ { label, amount, quantity } ] }
  422 -> { error: { code: "invalid_discount" | "plan_unavailable" | "already_enrolled", ... } }
  ```
  ```
  NEW GET /api/v1/checkout/sessions/{checkoutId}
  200 -> { checkoutId, status: "pending" | "success" | "failed" | "abandoned",
           reference, amount: "7766.88", currency, paidAt, provider: "paystack",
           paymentMethod: "card" | "bank" | "ussd",
           card: { brand: "visa", last4: "0000", expMonth, expYear } | null,
           orderId, enrollmentId }
  ```
  ```
  NEW POST /api/v1/discounts/validate
  Request  { code, communityId }
  200 -> { valid: true, code, percent: 15, message: "15% off applied" }
  200 -> { valid: false, code, message: "This code has expired" }
  ```
  ```
  NEW GET /api/v1/orders?status=&from=&to=&page=&pageSize=
  200 -> { items: [ { id, reference: "ILK-7283",
           communityId, communityTitle, communitySlug,
           planCode, planName,                       // "Monthly" | "Monthly renewal" | "Lifetime" | "Free"
           amount: "8500.00", discountAmount, vatAmount, totalAmount, currency,
           status: "paid" | "pending" | "failed" | "refunded" | "partially_refunded",
           paymentMethod, cardBrand, cardLast4,
           createdAt, paidAt, receiptUrl,
           refundedAmount, refundableAmount } ],
           page, pageSize, total, totalPages,
           summary: { totalSpent: "158700.00", totalOrders: 12, totalRefunded: "4500.00" } }
  ```
  ```
  NEW GET /api/v1/orders/{orderId}
  200 -> Order (above) + { lineItems: [ { label, amount, quantity } ],
           platformFeeAmount, creatorNetAmount, receiptPdfUrl }
  ```
  ```
  NEW GET /api/v1/orders/{orderId}/refund-eligibility
  200 -> { orderId, eligible: true, reason: string | null,
           policyWindowDays: 30, eligibleUntil: "2026-06-17",
           refundableAmount: "8500.00" }
  ```
  ```
  NEW POST /api/v1/refund-requests
  Request  { orderId, reason: "quality" | "alternative" | "not_interested" | "technical" | "other",
             notes?: string (max 500), acknowledged: true }
  201 -> { refundRequestId, orderId, status: "pending" | "approved" | "rejected" | "refunded",
           submittedAt, estimatedResolutionDays: 7 }
  ```
  ```
  NEW GET  /api/v1/payment-methods
  200 -> { items: [ { id, provider: "paystack", type: "card",
                     brand: "visa", last4: "4242", expMonth: 8, expYear: 2027,
                     isDefault: true, createdAt } ] }
  NEW POST /api/v1/payment-methods/setup
  Request  { type: "card", authorizationCode: string }   // Paystack token, never a PAN
  200 -> { id, brand, last4, expMonth, expYear, isDefault }
  NEW DELETE /api/v1/payment-methods/{id}                 -> 204
  NEW POST   /api/v1/payment-methods/{id}/default         -> 200 PaymentMethod
  ```
  ```
  NEW GET /api/v1/subscriptions
  200 -> { items: [ { id, communityId, communityTitle, communitySlug, communityImageUrl,
           creatorDisplayName, creatorAvatarUrl, creatorIsVerified,
           planCode, planName, status: "active" | "paused" | "cancelled" | "past_due",
           amount: "8500.00", currency, interval,
           nextBillingDate, enrolledAt, pausedAt, cancelledAt,
           paymentMethod: { brand, last4 }, isLifetime: false } ],
           summary: { active: 3, paused: 1, lifetime: 1, cancelled: 0 } }
  NEW POST  /api/v1/subscriptions/{id}/pause
  NEW POST  /api/v1/subscriptions/{id}/resume
  NEW POST  /api/v1/subscriptions/{id}/cancel
  NEW PATCH /api/v1/subscriptions/{id}   Request { paymentMethodId }  -> 200 Subscription
  ```
- **Reusable components:** `.card` (order summary / payment / success); `.badge-fill-accent` (Save 17%); `.tabs` (Card / Bank / USSD); `.input-group` + `.prefix`; `.field` + `.field-label` + `.field-help`; `.alert-success`; `.text-money` (tabular, monochrome — no green on amounts).
- **Empty/loading/error states needed:** community is free → hide the payment card entirely and go straight to "Join for free" (`POST /communities/{slug}/enroll` already works, returns `EnrollmentResponse`); no plan configured → "This community isn't accepting payments yet"; discount invalid → inline error next to the code; payment pending → poll `GET /checkout/sessions/{id}` / use the webhook; 402 on direct `POST /communities/{slug}/enroll` for a paid community → redirect into the checkout flow (the current page already detects `error.code === "payment_required"`).
- **Backend work required:** the whole **payments subsystem** above — **L**. Minimum shippable slice: `plans` + `checkout/sessions` + `orders` + `payment-methods` + `subscriptions` + Paystack webhook → **L**.

### B7 — Profile (`learner/B7-profile.html` → `/profile`, EXISTING)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Header card** — avatar-xl photo, "Ada Okafor" + verified check, "Learner · Lagos, Nigeria", Edit profile button → `GET /users/me` → `ProfileResponse.avatarUrl` / `.displayName` / `.roles` (LIVE). **Location has no field** → GAP. **Verified check on a learner is not a thing** — `isVerified` lives on `CreatorSummary`/`CreatorProfileResponse` only, and `ProfileResponse` has no `isVerified`. A learner showing the teal check would be semantically wrong (teal = creator verification).
  2. **Tabs Profile / Learning / Account / Billing** → Learning = `GET /users/me/learning` (LIVE). Account = `GET /auth/me` (LIVE for email). Billing = orders/payment methods (GAP, B11/B13).
  3. **About** — 3 paragraphs of bio → `ProfileResponse.bio` (LIVE, one free-text field; the mock's 3 paragraphs are all one bio string).
  4. **Interests (5 chips: AI, Product Design, FinTech, Content Creation, Career Growth)** → **no interests field** on `ProfileResponse`/`ProfileUpdateRequest` → GAP.
  5. **Learning stats 2×2** — Streak 12 (Best: 21) GAP; Lessons completed 47 (+5 this week) → LIVE (sum of `completedLessons`), delta GAP; This week 8h 24m GAP; Communities joined 4 (1 completed) → LIVE count from `GET /users/me/learning` / `GET /enrollments/mine`, "1 completed" GAP.
  6. **Achievements (4: First Lesson, Week 1 Streak, First Community, 10 Lessons — each with a description and earned date + "Earned" badge)** → no badge/achievement entity → GAP.
  7. **Learning tab (documented in an HTML comment)** — 4 enrolled communities with cover + progress + "12 of 20 · 60%" → `GET /users/me/learning` + `GET /communities/{slug}` (LIVE). This is the single most data-complete part of the screen.
  8. **Account tab (commented)** — email `ada@interlekt.com` readonly → `AccountResponse.email` (LIVE); password masked → no field (masked display only, fine); Change email / Change password buttons → GAP (B20); 4 notification toggles → GAP (B21).
  9. **Billing tab (commented)** — 2 payment methods with brand/last4/expiry/Default → GAP (B13); transaction history table (Date, Community, Amount, Status) with 5 rows + "View all 14 transactions" → GAP (B11).
  10. **Right rail — Account settings links** (Edit profile, Email & password, Notifications, Privacy, Connected accounts, Delete account) → links only; targets are B19/B20/B21/B22/B23/B26 (all NEW routes).
  11. **Right rail — Member since "March 2024" / "8 months on Interlekt"** → `ProfileResponse.createdAt` (LIVE) for the date; "8 months" = computed (LIVE, computed) — but the mock's arithmetic is stale (Mar 2024 → Oct 2026 is 19 months).
  12. **Right rail — Verification card** — "Email verified ada@interlekt.com" → **no `emailVerified` field** on `AccountResponse`; `AccountResponse.isActive` is not verification. GAP. "Phone not verified" + "Verify your phone" → **no phone field at all** → GAP.
- **Reusable components:** `.avatar-xl`; `.tabs`; `.chip`; `.stat` family; `.badge-neutral` (achievements); `.card`; `.money-amount`; right-rail link rows with inline chevron; `ILK.injectNavTop`.
- **Empty/loading/error states needed:** no bio → "Add a bio" prompt; no achievements → "No achievements yet"; no communities joined → empty state (already implemented); not signed in → sign-in card (already implemented); 404 profile → notFound.
- **Backend work required:** NEW fields on `ProfileResponse`/`ProfileUpdateRequest`: `location`, `pronouns`, `coverUrl`, `interests[]`, `emailVerified`, `phoneNumber`, `phoneVerified` — **S**; NEW `GET /users/me/activity` (streak, weekly minutes) — **M**; NEW `GET /users/me/badges` — **M**; NEW orders + payment-methods endpoints (shared with B11/B13) — **L**.

### B8 — Notifications (`learner/B8-notifications.html` → `/notifications`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header actions** — settings icon → `/settings/notifications` (B21); "Mark all as read" → mutation. GAP.
  2. **Filter tabs with counts** — All 24 / Unread 8 / Mentions 3 / Replies 5 / Live sessions 2 → GAP (no notification store).
  3. **12 notification rows** — every row needs: `id`, actor (photo avatar) **or** a neutral system icon, a headline ("{actor} posted in {community}", "New lesson published in {community}", "Payment received — your subscription of ₦8,500 to {community} renewed successfully", "5 likes on your comment in {community}", "Cohort call {name} starts in 2 hours", "You completed {lesson}", "You joined {community} community", "{actor} left a new review on {community} · 4.9 · 'Lives up to the hype'"), a preview/excerpt, a relative timestamp, and an **unread flag** (ink dot vs transparent spacer). Rows link to `/communities/{slug}/feed`, `/communities/{slug}/classroom`, `/orders`, `/calendar`, `/profile`. Every one of these is a synthetic aggregation over events the backend does not record.
  4. **Load more + "Showing 12 of 24"** → `page`/`pageSize` pagination + `total` (the live convention is `{items, page, pageSize, total, totalPages}`).
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/notifications?filter=all|unread|mentions|replies|live_sessions&page=&pageSize=
  200 -> { items: [ { id, type: "post"|"comment"|"mention"|"reply"|"like"|"lesson_published"
                              |"live_session"|"payment"|"streak"|"review"|"enrollment"|"refund"|"system",
           actor: { userId, displayName, avatarUrl } | null,
           actorIsSystem: false,
           communityId: uuid | null, communityTitle: string | null,
           title: string, body: string | null,
           deepLink: "/communities/ai-engineering-foundations/feed",
           createdAt, readAt: string | null } ],
           page, pageSize, total, totalPages,
           counts: { all: 24, unread: 8, mentions: 3, replies: 5, liveSessions: 2 } }
  NEW POST   /api/v1/notifications/read      Request { ids: [uuid] } -> 204
  NEW POST   /api/v1/notifications/read-all  -> 204
  ```
  Event capture points (backend): post created, comment created, comment contains `@handle`, post liked, lesson published to a community a user is enrolled in, session scheduled/starting, payment succeeded, refund processed, enrollment created, badge earned, streak milestone reached.
- **Reusable components:** `.tabs` + `.tab-count`; `.avatar` (photo or neutral icon circle); `.btn-ghost` (mark all as read, settings); `.btn-secondary` (load more); hairline row dividers; ink unread dot (no colour).
- **Empty/loading/error states needed:** no notifications → "You're all caught up"; 0 unread → hide the unread dot and the Unread tab count; load-more error → keep the list, show a retry link.
- **Backend work required:** notifications store + event fan-out + read state + counts — **M** (a new resource + write paths on ~8 existing mutations). Deep-links to `/orders` and `/calendar` also require B11/B18.

### B9 — Messages / DMs (`learner/B9-messages.html` → `/messages`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Inbox header + search** — "New message" button, "Search conversations" input → GAP.
  2. **8 conversation rows** — avatar (photo, or a neutral "users" glyph for groups), display name, last-message preview, relative timestamp, unread count pill, `isGroup` flag → GAP.
  3. **Thread header** — avatar, name, role ("Senior Engineer, Paystack"), verified check, call / video / info buttons → no conversation-partner profile, no role/headline field, no call/video capability.
  4. **Thread messages** — day separator ("Today"), 8 bubbles with body + timestamp, a `<pre><code>` message with syntax spans, sender alignment → GAP.
  5. **Compose** — attach button, textarea, send button → GAP (attachments need an upload target that is not `POST /uploads/images`, which is image-only).
- **Concrete NEW contract:**
  ```
  NEW GET  /api/v1/conversations?search=&page=&pageSize=
  200 -> { items: [ { id, type: "direct" | "group",
           title: string,                       // group name or the other user's name
           participants: [ { userId, displayName, avatarUrl, isVerified, role } ],
           lastMessage: { id, body, authorId, createdAt } | null,
           unreadCount: 2, createdAt, updatedAt } ],
           page, pageSize, total, totalPages }
  NEW POST /api/v1/conversations
  Request  { participantIds: [uuid], groupTitle?: string, initialMessage?: string }
  201 -> Conversation
  NEW GET  /api/v1/conversations/{id}/messages?before=&page=&pageSize=
  200 -> { items: [ { id, conversationId, senderId,
           sender: { userId, displayName, avatarUrl, isVerified },
           body: string, bodyType: "text" | "code",
           attachments: [ { id, name, sizeBytes, type, url } ],
           createdAt, editedAt } ], page, pageSize, total, totalPages }
  NEW POST /api/v1/conversations/{id}/messages
  Request  { body, bodyType?: "text" | "code", attachments?: [ { uploadId } ] }
  201 -> Message
  NEW POST /api/v1/conversations/{id}/read -> 204
  NEW POST /api/v1/conversations/{id}/participants  Request { userIds: [uuid] } -> 200 Conversation
  ```
  The `role` / "Senior Engineer, Paystack" headline and the verified check need `CreatorProfileResponse` fields (expertise exists; a job title does not) — **S** on top of the messaging build.
- **Reusable components:** split-pane shell (340px inbox + 1fr thread); `.avatar` + `.avatar-lg`; group avatar as a neutral paper-2 circle with a users glyph; accent bubble for "you" (radius 16/16/4/16), paper-2 bubble for them (16/16/16/4); `<pre><code>` mono, no syntax colours; `.btn-ghost.btn-icon`; `.btn-primary` square 44×44 send.
- **Empty/loading/error states needed:** no conversations → "Start a conversation"; no messages in a thread → empty pane; send failure → keep the draft and show an inline error; unread count 0 → hide the pill.
- **Backend work required:** the whole **messaging subsystem** — **L**. Blocked by B22 (DM permissions) and B28 (mention notifications) for a coherent product.

### B10 — Settings (`learner/B10-settings.html` → `/settings`, NEW)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Sidebar (6 links)** — Account (active), Notifications, Privacy, Connected accounts, Billing & payments, Danger zone. Links only.
  2. **Account settings card**
     - Email address `ada@interlekt.com` (readonly) + "Change email" → `GET /auth/me` → `AccountResponse.email` (LIVE, read). **Change email: no endpoint** → GAP.
     - Password masked + "Change password" + "Last changed 3 months ago" → **no password field, no `passwordLastChanged`, no change endpoint**. `POST /auth/forgot-password` + `POST /auth/reset-password` can implement a *reset-by-email* flow but not an authenticated inline change. GAP.
     - Phone `+234 803 ••• 1234` (readonly, masked) + "Verify" + "Required for payouts if you become a creator" → **no phone field**. GAP.
     - Display name (editable) → `PATCH /users/me` → `ProfileUpdateRequest.displayName` (LIVE).
     - Bio (editable, 280-char counter) → `PATCH /users/me` → `ProfileUpdateRequest.bio` (LIVE).
     - "Save changes" + "Last saved 2 hours ago" → "last saved" is client-side (Zustand/localStorage) or a new `ProfileResponse.updatedAt` field (S).
  3. **Notifications section (commented, 8 toggles)** → GAP (B21 contract).
  4. **Privacy section (commented, 5 toggles)** → GAP (B22 contract).
  5. **Connected accounts section (commented, Google / Paystack / GitHub with Connected / Not connected badges)** → GAP (B23 contract).
  6. **Billing & payments section (commented, 2 saved cards, Add card, default-payment select, "View order history")** → GAP (B13 + B11 contracts).
  7. **Danger zone (commented, Delete account button)** → GAP (B26 contract).
- **Reusable components:** `.settings-shell` (240px sidebar + content) — the B10 file uses an ad-hoc two-column grid instead; **use `.settings-shell` so B10 and B19–B26 share one shell**; `.field` + `.input` + `.textarea` + `.select`; `.toggle` (role="switch", aria-checked); `.badge`; `.btn-danger` (hover fill only, no red card fill); inline SVGs, no icon boxes.
- **Empty/loading/error states needed:** each section is a separate route → per-section loading/error; save success toast; "Last changed" unknown → omit the line rather than fake a value; toggle mutation failure → revert the switch.
- **Backend work required:** `PATCH /users/me` displayName/bio only (LIVE today). Everything else is the B13/B21/B22/B23/B26 + email-change/password-change contracts — **S** (email change, phone) / **M** (prefs, privacy, connected) / **L** (cards, delete).
- **Design note:** B10 and B19–B26 are **two different settings shells** — B10 has 6 sidebar items and a bespoke two-column grid; B19–B26 use `.settings-shell` with 8 sidebar items (Edit profile, Email & password, Notifications, Privacy, Connected accounts, Sessions, Data export, Delete account). B10's "Billing & payments" and "Danger zone" have no equivalent in the B19–B26 sidebar. **Pick one shell and one sidebar** before building.

### B11 — Order history (`learner/B11-order-history.html` → `/orders`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header + "Export CSV" button** → needs the order list; CSV is a client-side export of the same page.
  2. **Filter row** — Date range (All time / Last 30 days / Last 90 days / 2026 / 2025), Status (All statuses / Paid / Refunded / Pending), "Clear filters", "12 orders" → server-side `status`, `from`, `to` query params + `total`.
  3. **Orders table — 7 columns: Order ID (mono) | Date | Community | Plan | Amount (right, tabular) | Status (badge) | Receipt (View link)** → 12 rows in the mock, with `Plan` values "Monthly", "Monthly renewal", "Monthly · initial", "Lifetime", "Free"; `Status` values Paid / Refunded / Pending / N/A; Amount "—" for the free row. → all GAP.
  4. **Footer summary** — "Total spent (lifetime) ₦158,700" (ink, tabular) + "12 orders · 1 refunded" (muted) → `summary` object on the list response.
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/orders?status=paid|pending|refunded|failed&from=YYYY-MM-DD&to=YYYY-MM-DD&page=&pageSize=
  200 -> { items: [ { id, reference: "ILK-7283",           // mono, "ILK-" prefix
           communityId, communityTitle, communitySlug,
           planCode, planName,                           // "Monthly" | "Monthly renewal" | "Lifetime" | "Free"
           amount: "8500.00", discountAmount: "1275.00" | null, vatAmount: "541.88" | null,
           totalAmount: "8500.00", currency: "NGN",
           status: "paid" | "pending" | "failed" | "refunded" | "partially_refunded",
           paymentMethod: "card" | "bank" | "ussd" | null,
           cardBrand: "visa" | null, cardLast4: "0000" | null,
           createdAt, paidAt: string | null,
           receiptUrl: string | null,
           refundedAmount: "0.00", refundableAmount: "8500.00" } ],
           page, pageSize, total, totalPages,
           summary: { totalSpent: "158700.00", totalOrders: 12,
                      totalRefunded: "4500.00", refundedCount: 1 } }
  NEW GET /api/v1/orders/{orderId}
  200 -> Order + { lineItems: [ { label, amount, quantity } ],
                   platformFeeAmount: "932.03", creatorNetAmount: "6834.85",
                   receiptPdfUrl: string | null }
  ```
  The "View" receipt link in the table points at **B14** (the refund-request page) for order ILK-7283 — that looks like a mock error; it should point at an order detail / receipt view.
- **Reusable components:** `.table-wrap` + `.table`; `th.money` right-aligned; `.text-money` tabular; status badges `.badge-success` / `.badge-danger` / `.badge-neutral` / `.badge-info` (status colour only, **no green on the amount**); `.meta-cell`; `.select`; `.btn-secondary`; `.text-xs` count.
- **Empty/loading/error states needed:** no orders → "You haven't made any payments yet" + Browse communities; 0 rows after filtering → "No orders match these filters" + Clear; free-only history → all rows show "—" for Amount and badge "N/A".
- **Backend work required:** orders + order detail (part of the payments subsystem) — **L**.

### B12 — Manage subscription (`learner/B12-manage-subscription.html` → `/subscriptions`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header "3 active · 1 lifetime · 0 canceled"** → `summary` on the subscriptions response. GAP.
  2. **3 active subscription cards**, each with: community title, creator avatar + name + verified, status badge (Active / Paused), a 4-column metadata grid (Plan name, Plan price "₦8,500/mo", Next billing date, Payment method "VISA •••• 4242", Enrolled since date), a "Paused on May 12, 2026 — Resume anytime" alert for the paused card, and 3 actions (Pause / Resume / Cancel / Update payment) → GAP.
  3. **Lifetime access card** — community, creator, "Paid ₦85,000", "Paid March 28, 2026", "Access never expires", badge "Lifetime", no actions → GAP.
- **Concrete NEW contract:** see the `GET /api/v1/subscriptions` + pause/resume/cancel/PATCH block in **B6**. The `summary` object must return `{ active, paused, lifetime, cancelled }` to feed the header counts.
- **Reusable components:** `.card` (hairline, no shadow); `.badge-success` (Active) / `.badge-warning` (Paused) / `.badge-neutral` (Lifetime); `.btn-secondary` (Pause) / `.btn-primary` (Resume — primary to distinguish) / `.btn-danger` (Cancel) / `.btn-ghost` (Update payment); `.alert-warning`; `.avatar avatar-sm`; hairline-separated metadata grid.
- **Empty/loading/error states needed:** no subscriptions → "No active subscriptions" + Browse; cancel confirmation (the design has no confirm step — **add one**, cancelling revokes access); pause on a lifetime plan → hidden (lifetime has no billing cycle); update-payment with no saved card → jump to `/payment-methods`.
- **Backend work required:** subscriptions resource + pause/resume/cancel/update-payment — **L** (part of the payments subsystem).
- **Design note:** "Product Design Bootcamp — Curated by Ada Okafor (you)" implies a learner can curate a community; the backend model is `CommunityDetail.creator` (a single owner) and `EnrollmentResponse` has no curator role. Drop the curator line or model it.

### B13 — Payment methods (`learner/B13-payment-methods.html` → `/payment-methods`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **"Add card" primary button** (page header) → opens the add-card form.
  2. **Saved cards list (2)** — brand text ("VISA" / "Mastercard"), "•••• 4242", "Expires 08/27", `.badge-info` "Default" on card 1, and per-card actions Edit / Remove / Make default → GAP.
  3. **Add-a-new-card form** — card number (input-group with a card glyph prefix, `autocomplete="cc-number"`, maxlength 19), Expiry (`cc-exp`, maxlength 5), CVV (`cc-csc`, maxlength 4), Name on card (`cc-name`), "Save card" / "Cancel" / "Encrypted end-to-end" → GAP. **PAN/CVV must not transit our API** — replace this form with a Paystack card iframe or a setup flow that returns an authorization code.
  4. **Payment security** — 3 static bullets. **Copy bug:** "Payments are processed by Paystack — the same provider used by Paystack, Flutterwave, and Kuda." Paystack is listed as its own example. Fix to "processed by Paystack — the same provider used by Flutterwave and Kuda."
- **Concrete NEW contract:** see the `GET/POST/DELETE /api/v1/payment-methods` block in **B6**. Notes for the implementer: store only `provider` token, `brand`, `last4`, `expMonth`, `expYear`; never persist PAN or CVV; `POST /payment-methods/setup` accepts a provider `authorizationCode`; `isDefault` is enforced server-side (demoting the previous default in the same transaction).
- **Reusable components:** `.card` rows; `.badge-info` (Default); `.input-group` + `.prefix`; `.field` + `.field-label`; `.btn-primary` / `.btn-ghost`; inline lock/check SVGs (no icon boxes).
- **Empty/loading/error states needed:** no saved cards → "You have no saved cards" and the form expands by default; a card that has expired → muted "Expired" and disallow it as default; the last card being removed → require the user to add a replacement first.
- **Backend work required:** payment-methods resource — **M** inside the payments subsystem (**L** overall).

### B14 — Refund request (`learner/B14-refund-request.html` → `/refund`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Breadcrumb** (Order history › Refund request) — link only.
  2. **"Which order?" select** — 6 options, each "Community — Date — ₦amount", plus helper text "Showing orders from the last 90 days. Refunds are eligible within 30 days of the most recent renewal." → needs the eligible-orders list (GAP). **The mock's dates are inconsistent:** the newest order is May 18 2026 and the 90-day window would have to be relative to ~May 2026, but the page filter in B11 offers 2026/2025 ranges.
  3. **Eligibility card** — `.alert-info` "Eligible for refund. Monthly subscriptions are eligible within 30 days of the most recent renewal." + an "Order details" mini table (Order ID, Amount, Date, Plan) → needs `GET /orders/{id}/refund-eligibility` (GAP).
  4. **Reason for refund** — 5 radio rows with fixed values `quality | alternative | not-interested | technical | other` → these are the request body enum values (GAP).
  5. **"Tell us more (optional)"** — textarea, 0/500 counter → request field `notes` (max 500).
  6. **Acknowledgment checkbox** — "I understand I'll lose access… Your progress and certificates will be preserved…" → request field `acknowledged: true`; **certificates do not exist yet** (B16) so that clause is currently false.
  7. **Submit + Cancel** + footnote "Refunds typically take 5–7 business days" → mutation.
- **Concrete NEW contract:** see `GET /api/v1/orders/{orderId}/refund-eligibility` and `POST /api/v1/refund-requests` in **B6**. The order select's option list should come from `GET /api/v1/orders?status=paid&refundable=true` — add a `refundable` query flag, or filter client-side on `refundableAmount > 0`.
- **Reusable components:** `.breadcrumb`; `.field` + `.select` + `.field-help`; `.radio-row`; `.checkbox-row`; `.alert-info`; `.btn-primary.btn-block.btn-lg`; `.btn-ghost`.
- **Empty/loading/error states needed:** no refundable orders → "You have no eligible orders for a refund"; an order that becomes ineligible after selection → re-run the eligibility check on selection change and swap the `.alert-info` for a `.alert-warning` with the reason; submit failure → keep the form and show the error.
- **Backend work required:** refund-request resource + eligibility engine — **M** inside the payments subsystem (**L** overall).

### B15 — Learner onboarding (`learner/B15-onboarding.html` → `/welcome`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Interlekt brand (no top nav)** — static.
  2. **"Step 2 of 3" + 3 progress pills** — client-side wizard state; the step must be persisted so a returning user resumes (needs a `GET/PUT /users/me/onboarding` or a `users.onboardingStep` column) — **S**.
  3. **12 topic chips, 4 preselected** → the topic vocabulary. `GET /categories` returns **8** categories with different names (Technology & Programming, Business & Entrepreneurship, Design & Creative, Finance & Investing, Health & Wellness, Language & Communication, Agriculture & Sustainability, Education & Teaching). The design's 12 ("AI & Engineering", "Product Design", "FinTech & Business", "Content & Creative", "Cybersecurity", "Data & ML", "Marketing & Growth", "Career & Soft Skills", "Languages", "Academics", "Web Development", "Mobile Development") **do not map onto the 8**. Either add a `topics` table, or re-cut the design to 8 category chips.
  4. **"Selected: 4 of 12 · pick at least 3 to continue"** — derived from the selection; the "4 of 12" denominator must match the real topic count.
  5. **"Why we ask" tinted card** — static copy.
  6. **Back / Continue** — Back to step 1 (not in this batch); Continue validates ≥3 and advances to step 3 (suggested communities, not in this batch). **Step 3 needs a recommendation endpoint** — `GET /communities?category=` exists but there is no "recommended for you" endpoint. **S/M**.
- **Concrete NEW contract:**
  ```
  NEW PATCH /api/v1/users/me   (extend ProfileUpdateRequest with)  interests: [categoryId]
  NEW GET  /api/v1/users/me/onboarding
  200 -> { step: 1 | 2 | 3, completed: false, selectedInterestIds: [uuid] }
  NEW PUT  /api/v1/users/me/onboarding
  Request  { step: 2, interestIds: [uuid] }
  200 -> { step, selectedInterestIds }
  ```
  If a dedicated topic vocabulary is wanted: `NEW GET /api/v1/topics` → `{ items: [ { id, name, categoryId? } ] }` — **S**.
- **Reusable components:** centered brand mark; `.chip` (selected = accent border + accent-soft bg + accent-ink + inline check SVG); `.card-tinted`; `.btn-primary` / `.btn-secondary`; no nav, pure white background.
- **Empty/loading/error states needed:** no topics returned → "We'll personalise recommendations as you explore" and a Continue button that skips step 2; save failure → keep the selection and show an inline error; already-completed onboarding → redirect to `/dashboard`.
- **Backend work required:** `interests` field + onboarding-step persistence + (optional) topics table — **S**; step-3 recommendations — **S/M**.

### B16 — Certificate (`learner/B16-certificate.html` → `/certificate/[certificateId]`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header** — "Certificate of completion" + "Download PDF" + "Share".
  2. **Certificate card (A4 landscape 1.414/1)** — Interlekt wordmark; "Certificate of Completion"; "This certifies that"; **recipient name (44px)**; "has successfully completed"; **community title** ("FinTech Founders — Build a payments company in Nigeria"); "a 6-week cohort led by"; **creator name + role ("Kwame Mensah, Founder") + verified check**; "Completed on May 28, 2026"; seal + "Certifying platform"; signature line + creator name + "Founder, FinTech Founders"; "Certificate ID: ILK-CERT-9281" (mono).
  3. **Verify this certificate** — read-only input `interlekt.com/c/ILK-CERT-9281` + Copy + helper text "Anyone can verify this certificate … no login required." → needs a **public** verification route and a public certificate model.
  4. **"What you achieved"** — 4 bullets: "Completed 18 of 18 lessons across all 6 modules", "Attended 4 live sessions with Kwame Mensah and guest founders", "Submitted the final capstone — 'Paystack integration for a Pidgin checkout flow'", "Joined the FinTech Founders alumni community with 388 working founders and operators". → 1 is derivable from `CourseProgressResponse`; 2–4 need entities that do not exist (session attendance, capstone submissions, alumni communities).
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/certificates?communityId=&page=&pageSize=
  200 -> { items: [ { id, certificateNumber: "ILK-CERT-9281",
           userId, recipientName, recipientAvatarUrl,
           communityId, communityTitle, communityDescription,
           creatorUserId, creatorDisplayName, creatorTitle: "Founder", creatorIsVerified: true,
           issuedAt, expiresAt: null,
           verifyUrl: "https://interlekt.com/c/ILK-CERT-9281",
           pdfUrl: string | null } ], page, pageSize, total, totalPages }

  NEW GET /api/v1/certificates/{certificateId}
  200 -> { ...certificate above,
           stats: { completedLessons: 18, totalLessons: 18, moduleCount: 6,
                    liveSessionsAttended: 4, cohortWeeks: 6 },
           capstone: { title, submittedAt } | null,
           achievements: [ "Completed 18 of 18 lessons across all 6 modules of the curriculum.",
                           "Attended 4 live sessions with Kwame Mensah and guest founders.", ... ],
           alumniCommunity: { id, title, memberCount: 388 } | null }

  NEW GET /api/v1/certificates/verify/{certificateNumber}     (PUBLIC — no auth)
  200 -> { certificateNumber, recipientName, communityTitle, creatorDisplayName,
           issuedAt, valid: true }
  404 -> { error: { code: "not_found", message: "Certificate not found" } }
  ```
  Issuance rule: a certificate is minted when every lesson in every course of a community is completed (`CourseProgressResponse.completedLessons === totalLessons` for all courses). That check is computable in the backend from existing progress data — the **certificate entity** is the only new thing. `creatorTitle` ("Founder") is a new `CreatorProfileResponse` field — **S**.
- **Reusable components:** A4-landscape card (`aspect-ratio: 1.414/1`, 64px padding, hairline border, no shadow); brand wordmark + seal; typed signature over a hairline (no script font); `.input-group` read-only verify field + Copy; `.text-xs` helper; achievement rows with inline ink check SVGs.
- **Empty/loading/error states needed:** certificate not found / not yours → notFound; no PDF generated yet → hide "Download PDF" and show "Your certificate is being generated"; invalid verify id → a neutral "Certificate not found or revoked" page (public route).
- **Backend work required:** certificate entity + issuance + PDF generation + public verify route — **M**; `creatorTitle` — **S**.

### B17 — Write a review (`learner/B17-write-review.html` → `/communities/[slug]/review`, NEW)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Breadcrumb** (My communities › FinTech Founders › Write review) — links only.
  2. **Header** — "Review {community.title}" + "…helps {creator} improve" → `GET /communities/{slug}` → `CommunityDetail.title` / `.creator.displayName` (LIVE).
  3. **Star rating (5 × 28px, amber — the one allowed non-accent colour)** + "5 out of 5 — Excellent" → `ReviewCreateRequest.rating` (integer). **LIVE**. The label mapping (1–5 → Poor/…/Excellent) is a client-side constant. The star colour contradicts the design system (single accent, amber) — flag for the design owner.
  4. **"Your review" textarea** + 4 helpful prompts + "512 / 2000" counter → `ReviewCreateRequest.content` (string). **LIVE**. The 2000-char cap is not enforced by the schema — enforce client-side and add a server-side max length.
  5. **"Would you recommend this to a friend?" (Yes / No radio)** → **NOT in `ReviewCreateRequest`** → GAP: add `recommend: bool | null`.
  6. **"Show your name publicly?" toggle (default on)** → **NOT in `ReviewCreateRequest`/`ReviewResponse`** → GAP: add `showNamePublicly: bool` (and an `isAnonymous` rendering rule when false).
  7. **Submit** → `POST /api/v1/communities/{slug}/reviews` → 201 `ReviewResponse` (LIVE). Then navigate to the community page.
  8. **Footnote "You can edit your review anytime within 30 days"** → `PATCH /api/v1/reviews/{review_id}` exists (LIVE) but there is **no server-side 30-day edit window** and `ReviewResponse` has no `editableUntil` → GAP (S).
  9. **Pre-fill for an existing review** → `GET /api/v1/communities/{slug}/reviews` and find the caller's own review by `authorId === me.id` (LIVE) — note this endpoint **requires auth** (401 when anonymous, verified live).
- **Concrete NEW contract (schema extension, no new path):**
  ```
  Extend ReviewCreateRequest:  recommend?: boolean | null, showNamePublicly?: boolean
  Extend ReviewUpdateRequest:  recommend?, showNamePublicly?, rating?, content?
  Extend ReviewResponse:       recommend: boolean | null, showNamePublicly: boolean,
                               isAnonymous: boolean, editedAt: string | null,
                               editableUntil: string | null
  ```
  Enforce in `PATCH /reviews/{id}`: reject edits when `now > editableUntil` (createdAt + 30 days) with `409 edit_window_closed`.
- **Reusable components:** `.breadcrumb`; `.card`; `.stars` (28px, amber); `.radio-row`; `.toggle` (role="switch"); `.field` + `.textarea` + `.field-help`; `.btn-primary.btn-block.btn-lg`; `.text-xs` footnote.
- **Empty/loading/error states needed:** already reviewed → pre-fill the form and change the CTA to "Update review" (the mock only shows the create state); rating 0 → block submit and show "Pick a rating"; submit failure → keep the text and show an inline error; not enrolled / not completed → 403 → "Only learners who completed this community can review it".
- **Backend work required:** 2 new review fields + `editedAt`/`editableUntil` + edit-window enforcement — **S**.

### B18 — Calendar (`learner/B18-calendar.html` → `/calendar`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header** — H1 "Calendar", "Live sessions across your enrolled communities", Week/Month toggle (plain text links), "Subscribe" secondary button → needs a per-user calendar subscription (iCal feed) → GAP.
  2. **Week selector** — "< Week of May 19–25, 2026 >" chevrons + "Today" ghost → client-side date math over a `from`/`to` query → GAP only for the session list.
  3. **Day groups** — "Wednesday, May 21" + "2 sessions" / "Saturday, May 24" + "1 session" / "Sunday, May 25" + "1 session"; each session card = time column ("6:00 PM" + "WAT"), title, `.badge-info` "In 2 days", community name, host avatar + name + verified, "Join" primary + "Add to calendar" ghost link → **no session entity** → GAP.
  4. **Right rail — Upcoming this month (5 compact rows: date, title, "6:00 PM WAT · AI Engineering")** → same GAP.
  5. **Right rail — Past sessions (3 rows: date, title, "Watch recording")** → needs `recordingUrl` on a past session → GAP.
  6. **Right rail — Time zone card** — "Africa/Lagos" / "WAT · GMT+1" + "Change time zone" → client-side `Intl.DateTimeFormat` with a stored preference → **S** (a `users.timeZone` field or localStorage).
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/sessions?from=YYYY-MM-DD&to=YYYY-MM-DD&communityId=&page=&pageSize=
  200 -> { items: [ { id, communityId, communityTitle, communitySlug,
           title, description,
           startsAt: "2026-05-21T18:00:00+01:00", endsAt: "2026-05-21T19:00:00+01:00",
           durationMinutes: 60, timeZone: "Africa/Lagos",
           hostUserId, hostDisplayName, hostAvatarUrl, hostIsVerified,
           joinUrl: string | null, recordingUrl: string | null,
           capacity: int | null, isLive: false,
           status: "scheduled" | "live" | "ended" | "cancelled" } ],
           page, pageSize, total, totalPages,
           timeZone: "Africa/Lagos" }

  NEW GET    /api/v1/sessions/{sessionId}
  200 -> Session + { calendarSubscriptionUrl: ".../api/v1/sessions/{id}/ical", subscribed: false }
  NEW POST   /api/v1/sessions/{sessionId}/subscribe  -> { subscribed: true, icalUrl }
  NEW DELETE /api/v1/sessions/{sessionId}/subscribe  -> 204
  NEW GET    /api/v1/sessions/{sessionId}/recording   -> { recordingUrl, publishedAt }
  ```
  Sessions are scoped to a community and created by the creator; a learner's calendar = the sessions of the communities they are enrolled in. "In N days" is computed client-side from `startsAt`.
- **Reusable components:** week/month plain-text toggle; week selector with chevrons + Today; session card with a 110px tabular time column; `.badge-info` ("In N days"); `.btn-primary` (Join) + `.text-sm` "Add to calendar"; `.card card-sm` right-rail lists; `.avatar avatar-sm` + verified.
- **Empty/loading/error states needed:** no sessions this week → "No sessions scheduled this week"; week in the past → show past sessions with "Watch recording" instead of "Join"; a session with no joinUrl (not live yet) → "Join" becomes "Opens 5 minutes before"; recordings not yet published → hide the link; cancelled sessions → muted with a "Cancelled" badge.
- **Backend work required:** sessions/events resource + iCal subscription + recording linkage — **M**.

### B19 — Edit profile (`learner/B19-edit-profile.html` → `/settings/profile`, NEW)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Settings shell sidebar (8 links, Edit profile active)** — links only; the shell is shared with B20–B26.
  2. **Profile photo** — 80px avatar-xl + "Upload new photo" + "Remove"; helper "Recommended 400×400px. PNG, JPG, or WebP up to 4 MB." → `GET /users/me` → `ProfileResponse.avatarUrl` (LIVE) + `PATCH /users/me` → `ProfileUpdateRequest.avatarUrl` (LIVE). Upload uses `POST /api/v1/uploads/images` (LIVE, returns `UploadImageResponse.url` / `.publicId`).
  3. **Cover photo** — 16:9 placeholder + "Upload new cover" + "Remove" → **no `coverUrl` field** → GAP (S).
  4. **Display name** → `PATCH /users/me` (LIVE).
  5. **Username** — "@" prefix input, inline "Available" check, helper "Your profile URL: interlekt.com/@adaokafor" → **no `username` field, no availability-check endpoint, no public profile route**. GAP (S for the field, S for `GET /users/username-availability?username=`, S for a public `/u/{username}` route).
  6. **Bio** (280-char counter) → `PATCH /users/me` (LIVE).
  7. **Location** ("Lagos, Nigeria") → **no field** → GAP (S).
  8. **Pronouns** (select: prefer not to say / she-her / he-him / they-them / custom) → **no field** → GAP (S).
  9. **Save changes / Cancel / "Last saved 2 hours ago"** → "last saved" is client-side or a new `ProfileResponse.updatedAt` (S).
- **Concrete NEW contract (schema extension, no new path):**
  ```
  Extend ProfileUpdateRequest: username?, location?, pronouns?, coverUrl?, interests?[]
  Extend ProfileResponse:      username?, location?, pronouns?, coverUrl?, interests?[],
                                emailVerified: boolean, phoneNumber?, phoneVerified: boolean
  NEW GET /api/v1/users/username-availability?username=adaokafor
  200 -> { available: true, username: "adaokafor" }
  NEW GET /api/v1/users/{username}   (public profile by username, mirrors GET /users/{user_id})
  ```
- **Reusable components:** `.settings-shell` + `.settings-sidebar`; `.settings-section` + `.settings-section-title`; `.field` + `.input` + `.textarea` + `.select` + `.field-help`; `.avatar-xl`; `.card-lift` on the upload zone only; `.fade-in-up` per section; `.btn-primary` / `.btn-ghost`.
- **Empty/loading/error states needed:** no avatar → initials fallback; username taken → inline "Taken" and block save; upload failure → keep the current photo and show an error; no cover → the 16:9 slot shows a neutral placeholder.
- **Backend work required:** 4–5 new profile fields + username availability + public profile by username — **S**.

### B20 — Email & password (`learner/B20-email-password.html` → `/settings/account`, NEW)
- **Verdict:** PARTIAL
- **Sections & the data each needs:**
  1. **Email address section** — current email `ada@interlekt.com` + "Verified · primary" badge + collapsible "Change email" form (new email, current password, "Send verification email") → current email: `GET /auth/me` → `AccountResponse.email` (LIVE). **"Verified" flag: no `emailVerified` field** → GAP (S). **Change email: no endpoint** → GAP (S).
  2. **Password section** — masked value + "Last changed 3 months ago" + collapsible form (current password, new password with a 4-segment strength meter + "Strength: Strong" + "14 chars", confirm new password, "Update password") → **no `passwordLastChanged` field, no change-password endpoint** → GAP (S). `POST /auth/forgot-password` + `POST /auth/reset-password` gives a reset-by-email path, not an inline change with a strength meter.
  3. **2FA section** — badge "Not enabled", `.alert-info` explainer, 4 setup steps, QR placeholder, 6-digit verification code input, "Verify and enable", and **10 recovery codes** with Download + Copy → **no 2FA at all** → GAP (M). **Design bug:** recovery codes are rendered in the not-enabled state.
  4. **Login history preview (3 rows)** — device + OS, city, IP, relative time, `.badge-success` "Current" on the first → **no login/session history** → GAP (M). Link to `/settings/sessions` (B24).
- **Concrete NEW contract:**
  ```
  NEW PATCH /api/v1/users/me/email
  Request  { newEmail: string, currentPassword: string }
  200 -> { pendingEmail: "new@example.com", verificationSent: true }
  NEW POST /api/v1/users/me/email/confirm
  Request  { token: string }                      // emailed verification token
  200 -> { email: "new@example.com", emailVerified: true }

  NEW PATCH /api/v1/users/me/password
  Request  { currentPassword: string, newPassword: string }
  200 -> { passwordChangedAt: "2026-10-21T20:00:00Z" }
  Extend AccountResponse: passwordChangedAt: string | null, emailVerified: boolean

  NEW POST /api/v1/auth/2fa/setup
  200 -> { secret: string, otpauthUrl: string, qrCodeDataUrl: string }
  NEW POST /api/v1/auth/2fa/enable
  Request  { code: string }                      // 6-digit TOTP
  200 -> { enabled: true, recoveryCodes: [ "HB7Q-X4F2-9K3P", ... ] }   // 10, single-use
  NEW POST /api/v1/auth/2fa/disable
  Request  { code: string }
  200 -> { enabled: false }
  ```
  2FA must also be enforced at `POST /api/v1/auth/login` — add an optional `totpCode` to `LoginRequest` and a `twoFactorRequired` error code when it is missing. **S/M** beyond the endpoints.
- **Reusable components:** `.settings-shell` / `.settings-section` / `.settings-row`; `.collapsible-trigger` + `.collapsible-body` for the inline forms; password strength meter (4 segments); `.badge-neutral` ("Not enabled") / `.badge-success` ("Enabled"); `.alert-info`; monospace recovery-code grid; `.text-xs` relative time.
- **Empty/loading/error states needed:** email unverified → a "Verify now" banner; 2FA enabled → hide the setup steps, show the badge "Enabled" and a "Disable 2FA" action; a failed current-password check → inline error, keep the form open; a session that is no longer current → the "Current" badge moves.
- **Backend work required:** email change + password change + `emailVerified` + `passwordChangedAt` — **S**; 2FA (setup/enable/disable + login enforcement) — **M**; login history — **M** (shared with B24).

### B21 — Notification preferences (`learner/B21-notification-preferences.html` → `/settings/notifications`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Email notifications (6 toggles)** — Weekly digest (on), New posts in your communities (on), Replies to your comments (on), Mentions (on), Live session reminders (on), Marketing emails (off). Sub-label "Sent to ada@interlekt.com" → `GET /auth/me` → `AccountResponse.email` (LIVE).
  2. **Push notifications (5 toggles)** — New posts (on), Replies (on), Mentions (on), Live session reminders (off, "15 minutes before"), Direct messages (on). "Enable on this device" link → a push-subscription endpoint (service worker + VAPID) — **M**.
  3. **In-app notifications (4 toggles)** — New posts in your communities (on), Replies and mentions (on), Live session reminders (on), Direct messages (on).
  4. **Save changes + "Last saved 2 hours ago"** → `updatedAt` on the preferences resource.
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/notification-preferences
  200 -> { channels: {
             email: { weeklyDigest: true, newPosts: true, replies: true, mentions: true,
                      liveSessions: true, marketing: false, directMessages: true },
             push:  { newPosts: true, replies: true, mentions: true,
                      liveSessions: false, directMessages: true },
             inApp: { newPosts: true, repliesAndMentions: true, liveSessions: true,
                      directMessages: true } },
           pushEnabledOnThisDevice: false,
           updatedAt: "2026-10-21T18:00:00Z" }

  NEW PUT /api/v1/notification-preferences
  Request  { email: { weeklyDigest, newPosts, replies, mentions, liveSessions, marketing, directMessages },
             push:  { newPosts, replies, mentions, liveSessions, directMessages },
             inApp: { newPosts, repliesAndMentions, liveSessions, directMessages } }
  200 -> same shape as GET

  NEW POST /api/v1/push-subscriptions
  Request  { endpoint: string, keys: { p256dh, auth } }
  201 -> { id, createdAt }
  NEW DELETE /api/v1/push-subscriptions/{id} -> 204
  ```
  This is the single source of truth for both B21 and the B10/B7 notification toggles — they must not diverge.
- **Reusable components:** `.settings-shell` / `.settings-section` / `.settings-section-title` / `.settings-row` / `.settings-label` / `.settings-help`; `.toggle` (role="switch", aria-checked, keyboard focusable); `.btn-primary`; `.text-xs` last-saved.
- **Empty/loading/error states needed:** push not enabled on this device → the "Enable on this device" link becomes a permission prompt; toggle failure → revert the switch and show a toast; "last saved" unknown → omit.
- **Backend work required:** preferences resource + push subscriptions — **M**.

### B22 — Privacy (`learner/B22-privacy.html` → `/settings/privacy`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Profile visibility (radio: Public / Members only / Private)** — `public | members | private` → no field → GAP.
  2. **Direct messages (radio: From anyone / From your communities only / From no one)** → `anyone | communities | none` → no field; also gates the B9 inbox → GAP.
  3. **Activity & presence (3 toggles)** — Allow @mentions (on), Show your activity (on, "Display your contribution heatmap, streak, and badges on your public profile"), Show when you were last active (off) → no fields → GAP. These three also gate B27 (heatmap/streak/badges) and the "last seen" label in member lists.
  4. **Blocked users (2 rows: avatar, displayName, "@username · blocked 14 days ago", Unblock)** + "2 blocked" count + "Manage blocked list →" → no block store → GAP. `@username` again requires the username field (B19).
  5. **Save changes + "Last saved 2 hours ago"** → `updatedAt`.
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/privacy-settings
  200 -> { profileVisibility: "public" | "members" | "private",
           dmPermission: "anyone" | "communities" | "none",
           allowMentions: true, showActivity: true, showLastActive: false,
           blockedUsers: [ { userId, displayName, username, avatarUrl, blockedAt } ],
           updatedAt }

  NEW PUT /api/v1/privacy-settings
  Request  { profileVisibility, dmPermission, allowMentions, showActivity, showLastActive }
  200 -> same shape

  NEW POST   /api/v1/privacy-settings/blocked
  Request  { userId }
  201 -> { userId, blockedAt }
  NEW DELETE /api/v1/privacy-settings/blocked/{userId} -> 204
  ```
  Enforcement points: `GET /users/{user_id}` must honour `profileVisibility`; `POST /posts`/`POST /comments` must reject `@mentions` of a blocked user; the messaging layer must honour `dmPermission`; `GET /users/me/activity` must honour `showActivity`.
- **Reusable components:** `.settings-shell` / `.settings-section` / `.settings-row`; `.radio-row` (custom styled radio card with a radio dot — **not** a filled radio chip); `.toggle`; `.avatar avatar-sm`; `.btn-ghost.btn-sm` (Unblock); `.text-xs` count.
- **Empty/loading/error states needed:** no blocked users → "You haven't blocked anyone" (hide the count and the manage link); radio change → dirty state on the Save button; save failure → keep the pending values and show an error.
- **Backend work required:** privacy-settings resource + block list + enforcement — **M**.

### B23 — Connected accounts (`learner/B23-connected-accounts.html` → `/settings/connected`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Google (Connected)** — glyph "G", `.badge-success` "Connected", "Used for sign-in. We access your name, email, and profile photo only.", "Disconnect" `.btn-danger.btn-sm`, "Since Mar 2024" → GAP.
  2. **Paystack (Connected)** — glyph "P", "Used for payments and (if you become a creator) payouts. Card details are tokenized — we never see them.", "Manage" `.btn-secondary`, "Since Mar 2024" → GAP (and depends on the payments subsystem for the payouts claim).
  3. **GitHub (Not connected)** — `.badge-neutral` "Not connected", "Show your repos and capstone projects on your profile. We only read public repo metadata.", "Connect" `.btn-primary` → GAP.
  4. **Discord (Not connected)** — "Get community notifications in Discord. We post messages on your behalf — nothing else.", "Connect" → GAP.
  5. **"About connected accounts" tinted card** — 3 static bullets (OAuth 2.0, minimum scope, revocable). True only if the OAuth layer is actually built.
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/connected-accounts
  200 -> { items: [ { id, service: "google" | "paystack" | "github" | "discord",
           status: "connected" | "not_connected",
           displayName: "ada@gmail.com" | null,   // the linked account
           description: string,                    // static copy per service
           connectedAt: "2024-03-14T00:00:00Z" | null,
           scopes: [ "profile", "email" ] } ] }

  NEW POST /api/v1/connected-accounts/{service}/connect
  200 -> { authorizationUrl: "https://accounts.google.com/o/oauth2/auth?..." }   // redirect
  NEW DELETE /api/v1/connected-accounts/{service} -> 204      // revoke + delete the token
  NEW GET  /api/v1/connected-accounts/{service}/callback?code=&state= -> redirect
  ```
  Store provider access/refresh tokens **encrypted at rest**, scoped minimally, and delete them on disconnect. "Sign in faster" implies an OAuth **login** path too: add `POST /api/v1/auth/login/oauth` (S/M).
- **Reusable components:** `.stagger` grid of `.card`; service glyph inline at the top of the card (no icon box); `.badge-success` / `.badge-neutral`; `.btn-danger.btn-sm` (Disconnect) / `.btn-secondary.btn-sm` (Manage) / `.btn-primary.btn-sm` (Connect); `.card-tinted` with a 3-item `<ul>`.
- **Empty/loading/error states needed:** OAuth redirect failure → "We couldn't connect {service}. Try again."; disconnect → confirm ("We'll stop syncing. Your {service} data stays with {service}."); Paystack connected but payments not live → show "Connected" but disable the "Manage" link until the payments subsystem ships.
- **Backend work required:** connected-accounts store + OAuth 2.0 flows for 4 providers + token encryption + revocation — **L**.

### B24 — Sessions & security (`learner/B24-sessions.html` → `/settings/sessions`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Active sessions header "4 devices · 1 current · 3 others"** → GAP.
  2. **4 active session rows** — device + OS, city, "Last active · 2 hours ago", IP, `.badge-success` "Current" on the first, "Revoke" ghost on the others → GAP.
  3. **"Log out of all other sessions"** `.btn-danger.btn-block` → GAP. `POST /api/v1/auth/logout` revokes exactly **one** refresh token and is not a session API.
  4. **Recent login history table (5 columns: Date & time, Device, IP address, Location, Status)** — 8 rows in the mock, with Success **and Failed** rows (2 failures from "Unknown · Linux", 41.58.20.14, Port Harcourt) → GAP.
  5. **"Download full login history (CSV)"** → the same list, client-side CSV.
  6. **"Last password change"** (listed in the header comment) → new field (B20).
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/auth/sessions
  200 -> { items: [ { id, deviceLabel: "Chrome on macOS", browser: "Chrome", os: "macOS",
                      ipAddress: "105.112.20.18", location: "Lagos, Nigeria",
                      lastActiveAt, createdAt, isCurrent: true } ],
           currentPasswordChangedAt: "2026-07-21T00:00:00Z" | null }

  NEW DELETE /api/v1/auth/sessions/{sessionId}   -> 204   (revoke one refresh token + its access tokens)
  NEW POST   /api/v1/auth/sessions/revoke-all    -> 204   (revoke every session except the caller's)
  NEW GET    /api/v1/auth/login-history?page=&pageSize=
  200 -> { items: [ { id, deviceLabel, browser, os, ipAddress, location,
                     success: true, attemptedAt, failureReason: string | null } ],
           page, pageSize, total, totalPages }
  ```
  This requires the backend to track sessions and login attempts — today `POST /auth/login` issues a refresh token and `POST /auth/logout` revokes one, with no server-side session record. **M**.
- **Reusable components:** `.settings-shell` / `.settings-section` / `.settings-row`; `.table-wrap` + `.table`; `.badge-success` ("Current"); `.btn-ghost.btn-sm` (Revoke); `.btn-danger.btn-block`; inline success/failure dot + text (no coloured badge row); `.text-xs` relative time.
- **Empty/loading/error states needed:** only one session → hide the revoke-all button; revoke failure → keep the row and show an error; a failed-attempt row → muted and marked "Failed" (never a red fill on the table).
- **Backend work required:** session tracking + revoke + login-history log — **M**.

### B25 — Data export (`learner/B25-data-export.html` → `/settings/data`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **"Download your data" card** — 4 checkbox rows (all pre-checked): Profile info ("Display name, username, bio, photo, cover, location, pronouns, settings"), Communities & posts ("Memberships, posts, comments, replies, lesson progress, certificates"), Payments & orders ("Order history, subscription records, payment methods (last 4 digits only), receipts"), Activity log ("Lessons completed, posts, comments, login history, streak data, badges earned") → 2 of these categories (Payments & orders, certificates) describe data that does not exist yet.
  2. **"Request export"** + "We'll email you a download link within 48 hours. The link expires after 7 days." → an async job + signed URL + expiry.
  3. **Last exports (2 rows)** — label ("Full export · ZIP", "Activity log only · ZIP"), "Oct 14, 2024 · 8.4 MB · expires Nov 21, 2024", Download button → GAP. Expired entries must render a muted "expired" instead of a link.
  4. **"Delete your data" danger card** — `.alert-danger` "This will cancel your paid subscriptions immediately" + "Delete account" + link to B26 → GAP.
- **Concrete NEW contract:**
  ```
  NEW POST /api/v1/data-exports
  Request  { categories: [ "profile" | "communities" | "payments" | "activity" ] }
  201 -> { exportId, status: "pending", requestedAt, categories }

  NEW GET /api/v1/data-exports
  200 -> { items: [ { id, label: "Full export", format: "zip",
                     categories: [ "profile", "communities", "payments", "activity" ],
                     requestedAt, status: "ready" | "pending" | "failed",
                     sizeBytes: 8808038, downloadUrl: string | null,
                     expiresAt: "2024-11-21T00:00:00Z" } ] }

  NEW GET /api/v1/data-exports/{exportId}/download
  302 -> { signedUrl }   // short-lived, expires in 7 days
  ```
  The export job reads from the same tables the app already reads: `users`, `enrollments`, `posts`, `comments`, `lesson_progress`, plus (once built) `orders`, `payment_methods`, `certificates`, `login_history`, `badges`. **M**.
- **Reusable components:** `.settings-shell`; `.card` + `.card-tinted`; `.checkbox-row`; `.alert-danger`; `.btn-primary` / `.btn-danger`; `.text-xs` with tabular file sizes; `.fade-in-up`.
- **Empty/loading/error states needed:** no previous exports → "You have not requested an export"; a pending export → "Preparing your export…" with no link; an expired export → muted "expired" row, no link; a request failure → inline error.
- **Backend work required:** export job + history + signed downloads — **M**.

### B26 — Delete account (`learner/B26-delete-account.html` → `/settings/delete`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **H1 "Delete your account" + lead copy** — static.
  2. **`.alert-danger` "This action is permanent"** — "Your account, posts, comments, lesson progress, certificates, and badges will be permanently deleted. Paid community access will be revoked immediately. Refunds are not issued for partial billing periods." → needs cancellation of paid subscriptions (payments subsystem) and deletion of certificates/badges (which do not exist).
  3. **"Tell us why" (optional)** — 6 radio reasons: `not useful to me | too expensive | found an alternative | privacy concerns | too many emails | other` + a free-text textarea (anonymous after deletion) → GAP.
  4. **"Confirm you understand"** — 4 required checkboxes (subscriptions cancelled, access revoked, posts/comments deleted, cannot be undone) → client-side gate + server-side enforcement → GAP.
  5. **"Type DELETE to confirm"** — exact-match input → server-side enforcement → GAP.
  6. **"Delete my account permanently"** `.btn-danger.btn-lg.btn-block` (disabled until all 4 boxes + exact text) + "Cancel and go back".
  7. **Header comment mentions `learner.activeSubscriptions[]` (count for the confirmation text)** → depends on the payments subsystem; until then, derive the count from `GET /enrollments/mine` (active enrollments) and label it "communities" rather than "subscriptions".
- **Concrete NEW contract:**
  ```
  NEW DELETE /api/v1/users/me
  Request  { reason?: "not_useful" | "too_expensive" | "alternative" | "privacy"
                       | "too_many_emails" | "other",
             feedback?: string (max 2000),
             confirmations: { subscriptionsCancelled: true, accessRevoked: true,
                              contentDeleted: true, understoodIrreversible: true },
             confirmationText: "DELETE" }
  200 -> { deleted: true, deletedAt, cancelledSubscriptions: int, deletedCounts: { posts, comments, enrollments } }
  422 -> { error: { code: "confirmation_required", details: { missing: [ ... ] } } }
  ```
  Backend must: cancel active subscriptions (and call the payment provider), anonymise or delete posts/comments (the creator's own content may be kept with the author anonymised — decide the policy), hard-delete the user + tokens + sessions, and retain the deletion reason anonymously.
- **Reusable components:** `.settings-shell`; `.alert-danger`; `.radio-row`; `.checkbox-row`; `.field` + `.input` + `.textarea` + `.field-help`; `.btn-danger.btn-lg.btn-block`; H1 in danger ink (not a red alert banner).
- **Empty/loading/error states needed:** already-deleted account → a "This account no longer exists" page; confirmation mismatch → the button stays disabled; delete failure → keep the form, show the error, never partially delete.
- **Backend work required:** account-deletion endpoint + subscription cancellation + content policy — **M** (S if subscriptions are excluded, but then the copy must change).

### B27 — Activity (`learner/B27-activity.html` → `/activity`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Header** — "Member since March 2024 · 8 months on Interlekt" → `GET /users/me` → `ProfileResponse.createdAt` (LIVE) + computed months.
  2. **Stat row (4)** — Contributions this year `247` (+38 vs last year); Current streak `12 days` (Personal best 47 days); Longest streak `47 days` (Set in May 2024); This week `8h 24m` (+2h 12m vs last week) → GAP.
  3. **Streak ring** — 128px SVG circle, stroke-dasharray progress to 14, "12 / 14 days", "2 days to next milestone (14)" → the ring geometry is client-side; the two numbers are GAP.
  4. **Contribution heatmap** — 53 cols × 7 rows, `.heatmap-cell` levels l1–l4, 12 month labels, "247 contributions in the last year", Less/More legend → GAP. The mock generates the cells from a **seeded pseudo-random JS distribution** — that must be replaced by real daily counts. The header comment says `heatmap[365]` but the grid is 371 cells.
  5. **Activity timeline (6 items)** — `.activity-dot` colour accent/success/warning, event title, meta line: lesson completed, feed post, enrolled (by another user — "By Adaeze Eze"), badge earned ("10 Lessons · Gold tier"), refund issued ("Refunded Content Creators subscription · ₦5,000 back to VISA ending 4242"), streak started → GAP (a refund event also depends on the payments subsystem).
  6. **Achievements rail (4 badge-tier cards)** — bronze "First Lesson" (Mar 14 2024), silver "Week 1 Streak" (Mar 21 2024), gold "10 Lessons" (2 days ago), bronze "First Community" (Mar 14 2024), + "View all 12 badges →" → GAP. `badge-tier` classes already exist in the design system (bronze/silver/gold/platinum) — keep them.
  7. **Monthly breakdown** — 12 bar-chart bars with counts (12, 18, 31, 42, 47, 29, 22, 14, 11, 9, 12, 18), month labels, footer "Total: 265 contributions · Avg 22/month · Peak: May (47)" → GAP. The bar heights are static CSS in the mock; they must be data-driven.
- **Concrete NEW contract:**
  ```
  NEW GET /api/v1/users/me/activity?from=YYYY-MM-DD&to=YYYY-MM-DD
  200 -> { memberSince: "2024-03-14T00:00:00Z",
           stats: { contributionsThisYear: 247, contributionsLastYear: 209,
                    currentStreakDays: 12, longestStreakDays: 47,
                    longestStreakEndedAt: "2024-05-08T00:00:00Z",
                    minutesThisWeek: 504, minutesLastWeek: 372,
                    milestones: { next: 14, remaining: 2 } },
           heatmap: [ { date: "2026-10-21", level: 0..4, count: 3 } ],   // one entry per day in range
           timeline: [ { id, type: "lesson_completed" | "post" | "enrollment" | "badge"
                                | "refund" | "streak" | "comment" | "review",
                         title, detail, communityId, communityTitle,
                         occurredAt, dot: "accent" | "success" | "warning" | "danger" } ],
           badges: [ { id, name, description, tier: "bronze" | "silver" | "gold" | "platinum",
                       earnedAt, criteria: "10 lessons completed" } ],
           monthly: [ { month: "2026-01", count: 12 } ] }
  ```
  The underlying events exist partially: `LessonProgressItem.completedAt` (lesson completions), `PostResponse.createdAt`, `CommentResponse.createdAt`, `EnrollmentResponse.createdAt`. A **daily aggregation query** over those three + a badge-award table is the minimum. **L** (new subsystem: aggregation + streaks + badges).
- **Reusable components:** `.stat` family; `.streak-ring` (SVG stroke-dasharray); `.heatmap` + `.heatmap-cell.l1`–`.l4` + `.heatmap-months` + `.heatmap-legend`; `.activity-timeline` + `.activity-item` + `.activity-dot.accent/.success/.warning`; `.badge-tier.bronze/.silver/.gold/.platinum`; `.stagger`; `.fade-in-up`; bar chart as plain divs with tabular counts.
- **Empty/loading/error states needed:** no activity → a muted "No activity yet — finish your first lesson"; a new user → the heatmap renders all-zero cells (level 0) with "0 contributions"; badges empty → "No badges yet".
- **Backend work required:** activity aggregation + streaks + badges — **L**.
- **Design-vs-backend note:** the stat card says **247** contributions this year while the monthly breakdown footer says **Total: 265** — the mock contradicts itself; a real implementation must derive both from one query.

### B28 — Discussions (`learner/B28-discussions.html` → `/communities/[slug]/discussions`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Breadcrumb** — links only.
  2. **Header** — "Discussions" + "47 threads · 12 unanswered" + "New thread" primary → GAP.
  3. **Sort tabs** — All 47 / Hot / New / Top / Unanswered 12 → GAP. "Hot" needs a score (recency + votes + replies) — a server-side ranking, not a client sort.
  4. **Tag filter chips** (10: RAG, Prompt Engineering, Production, Beginner, Showcase, Evals, LangChain, Live, Help) → GAP. The chips appear twice: once as a scrollable filter row and once in the right rail **with per-tag counts** (RAG 14, Prompt Engineering 11, Production 9, Beginner 8, Showcase 7, Evals 6, LangChain 5, Live 4, Help 3) → the counts need a tag-aggregation endpoint.
  5. **8 thread cards** — vote column (upvote button + count + downvote button, `.voted` state on the current user's vote), badges (Pinned / Announcement / Unanswered), title, preview text, meta row (author avatar + name + "(you)", a community tag, relative time, "N replies"), and 1–2 tag chips → GAP. **The backend has no votes, no tags, no "answered" state, and no thread entity.**
  6. **Right rail — Community rules (4)** → GAP (same as B5).
  7. **Right rail — Top contributors (5: name, "142 posts · 8.4k upvotes")** → GAP (same as B5) — note it needs **upvote counts**, which requires the votes subsystem.
  8. **Right rail — Tags with counts** → GAP.
  9. **Load more + "Showing 8 of 47"** → pagination.
- **Concrete NEW contract:** see the full threaded-discussions contract in **B29** (shared subsystem) plus:
  ```
  NEW GET /api/v1/communities/{slug}/tags
  200 -> { items: [ { name: "RAG", count: 14 }, { name: "Prompt Engineering", count: 11 } ] }
  ```
- **Reusable components:** `.thread-card` / `.thread-vote` / `.thread-vote-btn` (with `.voted`) / `.thread-vote-count` / `.thread-title` / `.thread-meta` / `.thread-tags`; `.tabs` + `.tab-count`; `.chip-filter-row` (scrollable) + `.chip` + `.chip.chip-sm`; `.badge-fill-accent` (Pinned) / `.badge-info` (Announcement) / `.badge-neutral` (Unanswered); `.avatar-sm` + `.avatar-verified`; `.card` + `.card-tinted`; `.stagger` + `.fade-in-up`; `.discussions-grid` / `.discussions-rail` (**note: these two layout classes are used in the design but are NOT in `design-system.css` — they must be added**).
- **Empty/loading/error states needed:** no threads → "No discussions yet — start the first one"; a community with no tags → hide the filter row and the rail tag card; "Unanswered 0" → hide the count; vote failure → revert the button state and show a toast.
- **Backend work required:** the **threaded-discussions subsystem** — **L**.

### B29 — Thread detail (`learner/B29-thread-detail.html` → `/communities/[slug]/discussions/[threadId]`, NEW)
- **Verdict:** NEEDS-BACKEND
- **Sections & the data each needs:**
  1. **Breadcrumb** — links only.
  2. **Thread hero** — H1 title, meta row (author avatar + name + verified, "posted 2h ago", "47 upvotes", "8 replies"), 3 tag chips, 3-paragraph body with inline `<code>` → GAP (no thread entity, no votes).
  3. **Action row** — upvote button with count (47), bookmark, share, flag ghost buttons, "Subscribe to replies" → GAP.
  4. **`.alert-success` "Answer marked by Tunde Bakare · see Tunde's reply below"** → GAP (no answer marking).
  5. **Replies section header** — "8 replies" + sort (Top / Newest / Oldest) → GAP.
  6. **Reply cards** — 4 top-level replies; each with author avatar + name + verified, "Answer" `.badge-success` on the accepted one, relative time, body (paragraphs + a `<pre class="code-block">` with syntax spans), and actions (vote with count 12/6/1/3, Reply, Share, "N replies"). Reply 1 additionally has a `.reply-marked` style and a success-tinted border → GAP.
  7. **Nested replies (`.reply-tree` / `.reply-item`)** — 3 under reply 1 (Ada, Ngozi, Tunde) and 1 under reply 2, each with avatar, name, "(you)", time, body, vote + Reply actions → **the backend's `CommentResponse` is flat: it has no `parentCommentId`, no nesting, no votes.** GAP.
  8. **Floating composer** — avatar + "Add your reply…" input + Reply button → GAP.
  9. **Right rail** — identical to B28 (rules, top contributors, tags) → GAP.
- **Concrete NEW contract (threaded discussions — implement as specified):**
  ```
  NEW GET /api/v1/communities/{slug}/threads?sort=hot|new|top|unanswered&tag=&page=&pageSize=
  200 -> { items: [ { id, communityId, title, body, preview,
           author: { userId, displayName, avatarUrl, isVerified, role: "creator"|"learner" },
           tags: [ "RAG", "embeddings" ],
           voteCount: 47, replyCount: 8,
           isPinned: false, isAnnouncement: false, isAnswered: false,
           viewerHasVoted: 0,            // -1 | 0 | 1
           createdAt, lastActivityAt } ],
           page, pageSize, total, totalPages,
           counts: { all: 47, hot: 12, new: 5, top: 9, unanswered: 12 } }

  NEW POST /api/v1/communities/{slug}/threads
  Request  { title: string, body: string, tags?: [string] }
  201 -> Thread

  NEW GET /api/v1/threads/{threadId}?sort=top|newest|oldest
  200 -> { id, communityId, title, body,
           author: { userId, displayName, avatarUrl, isVerified, role },
           tags: [string], voteCount, replyCount,
           isPinned, isAnnouncement, isAnswered: true,
           answeredBy: { userId, displayName } | null, answeredReplyId: uuid | null,
           viewerHasVoted: 0, viewerHasBookmarked: false, isSubscribed: false,
           createdAt, lastActivityAt,
           replies: [ { id, threadId, parentReplyId: uuid | null,
                        body, codeBlock: string | null,
                        author: { userId, displayName, avatarUrl, isVerified },
                        voteCount, isAnswer, createdAt, viewerHasVoted,
                        replyCount, children: [ <same shape> ] } ] }

  NEW POST /api/v1/threads/{threadId}/replies
  Request  { body: string, parentReplyId?: uuid }
  201 -> Reply

  NEW POST /api/v1/threads/{threadId}/vote
  Request  { value: 1 | -1 }
  200 -> { voteCount: 48, viewerVote: 1 }

  NEW POST /api/v1/replies/{replyId}/vote
  Request  { value: 1 | -1 }
  200 -> { voteCount: 13, viewerVote: 1 }

  NEW POST /api/v1/threads/{threadId}/mark-answer
  Request  { replyId: uuid }              // creator-only
  200 -> { isAnswered: true, answeredBy, answeredReplyId }

  NEW POST   /api/v1/threads/{threadId}/bookmark   -> 204
  NEW DELETE /api/v1/threads/{threadId}/bookmark   -> 204
  NEW POST   /api/v1/threads/{threadId}/subscribe  -> 204
  NEW POST   /api/v1/threads/{threadId}/flag
  Request  { reason: "spam" | "abuse" | "off_topic" | "other", note?: string }
  201 -> { flagId, status: "open" }
  ```
  Model note: `Thread` / `Reply` / `Vote` are **new tables**. The existing `posts` + `comments` are flat community feed content; the mock treats discussions as a *different* surface (threads with votes, tags, answers) from the feed (posts with likes). Either build the new tables, or graft votes/tags/answers onto `posts`/`comments` — but the existing `CommentResponse` shape (no `parentCommentId`) makes the graft a breaking change, so **new tables are the lower-risk route**.
- **Reusable components:** `.thread-hero`; `.thread-meta` + `.tag`; `.thread-tags` + `.chip.chip-sm`; `.thread-vote` + `.thread-vote-btn.voted` + `.thread-vote-count`; `.reply-tree` + `.reply-item`; `.card.reply-marked`; `.badge-success` ("Answer"); `.alert-success`; `.code-block` (**not currently in `design-system.css` — must be added**); `.floating-composer`; `.discussions-grid` / `.discussions-rail` (**also missing**).
- **Empty/loading/error states needed:** no replies → "Be the first to reply"; a deleted author → "Deleted user" with a neutral avatar; vote failure → revert; mark-answer failure → the creator sees the error and the answer badge is not applied; flag success → a toast, no state change on the button.
- **Backend work required:** the **threaded-discussions subsystem** — **L**.

---

## Backend gaps consolidated

| Gap | Screens affected | Proposed endpoint/model | Effort |
|---|---|---|---|
| **Payments subsystem** — plans, checkout, orders, refunds, payment methods, subscriptions, discounts | B6, B7 (Billing tab), B10 (Billing section), B11, B12, B13, B14, B25 (Payments category), B26, B27 (refund event) | `GET /communities/{slug}/plans` · `POST /checkout/sessions` · `GET /checkout/sessions/{id}` · `GET /orders` · `GET /orders/{id}` · `GET /orders/{id}/refund-eligibility` · `POST /refund-requests` · `GET/POST /payment-methods` · `POST /payment-methods/{id}/default` · `GET /subscriptions` · `POST /subscriptions/{id}/{pause,resume,cancel}` · `PATCH /subscriptions/{id}` · `POST /discounts/validate` — full contracts in B6 | **L** |
| **Threaded discussions** — threads, replies, nested replies, votes, tags, answers, bookmarks, flags, subscriptions, rules, contributors | B28, B29 (and C20 in the creator shell) | `GET/POST /communities/{slug}/threads` · `GET /threads/{id}` · `POST /threads/{id}/replies` · `POST /threads/{id}/vote` · `POST /replies/{id}/vote` · `POST /threads/{id}/mark-answer` · `POST /threads/{id}/{bookmark,subscribe,flag}` · `GET /communities/{slug}/tags` · `GET /communities/{slug}/rules` · `GET /communities/{slug}/top-contributors` — new `Thread`/`Reply`/`Vote`/`Tag` tables | **L** |
| **Activity / streaks / badges** — heatmap, contribution counts, timeline, tier badges, monthly rollup | B1 (stat row + rail), B7 (stats + achievements), B27 | `GET /users/me/activity` (stats + heatmap + timeline + monthly) · `GET /users/me/badges` — daily aggregation over `lesson_progress`, `posts`, `comments`, `enrollments` + a badge-award table | **L** |
| **Direct messages** — conversations, groups, messages, code blocks, attachments, unread counts | B9, B4 (ask-the-creator), B18 (host) | `GET/POST /conversations` · `GET/POST /conversations/{id}/messages` · `POST /conversations/{id}/read` · `POST /conversations/{id}/participants` | **L** |
| **Connected accounts / OAuth 2.0** — Google, Paystack, GitHub, Discord | B23, B10 (Connected accounts section) | `GET /connected-accounts` · `POST /connected-accounts/{service}/connect` · `DELETE /connected-accounts/{service}` · `GET /connected-accounts/{service}/callback` · (optional) `POST /auth/login/oauth` | **L** |
| **Calendar / live sessions** — scheduled sessions, hosting, join links, recordings, iCal subscription | B18, B1 (upcoming rail), B3 (next session), B5 (upcoming rail), B8 (live-session notifications), B16 (live sessions attended) | `GET /sessions` · `GET /sessions/{id}` · `POST/DELETE /sessions/{id}/subscribe` · `GET /sessions/{id}/recording` | **M** |
| **Notifications** — event store, per-type filters, read state, counts | B8, B10 (8 toggles), B7 (Account tab) | `GET /notifications` · `POST /notifications/read` · `POST /notifications/read-all` — event fan-out on post/comment/like/lesson-publish/session/payment/enrollment/badge/streak | **M** |
| **Notification preferences + push** — 15 toggles across 3 channels, device push | B21, B10, B7 | `GET/PUT /notification-preferences` · `POST/DELETE /push-subscriptions` | **M** |
| **Certificates** — issuance, PDF, public verification, achievement stats | B16, B2 (View certificate link), B8 (certificate notifications) | `GET /certificates` · `GET /certificates/{id}` · `GET /certificates/verify/{certificateNumber}` (public) · `CreatorProfileResponse.creatorTitle` | **M** |
| **Privacy settings + block list** — visibility, DM permission, mentions, activity, last-active, blocks | B22, B9 (DM permission), B27 (showActivity), B5/B28 (mentions) | `GET/PUT /privacy-settings` · `POST/DELETE /privacy-settings/blocked` + enforcement in profile, post, comment, messaging and activity paths | **M** |
| **Sessions & login history** — device list, revoke one, revoke all, failed-attempt log | B24, B20 (login history preview) | `GET /auth/sessions` · `DELETE /auth/sessions/{id}` · `POST /auth/sessions/revoke-all` · `GET /auth/login-history` | **M** |
| **2FA (TOTP)** — setup QR, enable/disable, recovery codes, login enforcement | B20 | `POST /auth/2fa/setup` · `POST /auth/2fa/enable` · `POST /auth/2fa/disable` · `LoginRequest.totpCode` | **M** |
| **Data export** — category selection, async job, signed URL, expiry, history | B25 | `POST /data-exports` · `GET /data-exports` · `GET /data-exports/{id}/download` | **M** |
| **Account deletion** — reasons, confirmations, subscription cancellation, content policy | B26, B10 (Danger zone), B25 (delete card) | `DELETE /users/me` with `{reason, feedback, confirmations, confirmationText}` | **M** |
| **Post likes + attachments + author enrichment** | B5, B1 (community feed), B8 (like notifications) | `POST/DELETE /posts/{id}/like` · `GET /posts/{id}/likes` · `PostCreateRequest.attachments[]` · `AuthorSummary.isVerified` + `AuthorSummary.roles` | **M** |
| **Lesson content model** — code blocks, key takeaways, try-it callouts, transcript, downloadable resources | B4, B16 (achievements) | `LessonResponse.contentBlocks[]` · `LessonResponse.transcriptUrl` · `LessonResponse.resources[{name,sizeBytes,type,url}]` — or accept Markdown-only `content` and parse client-side | **M** |
| **Sequential gating (lock states)** | B3, B4, B2 | `ModuleResponse.isLocked` + `unlocksAfterLessonId` · `LessonResponse.isLocked` + `unlocksAfterLessonId` | **M** |
| **Enrichment of `users/me/learning`** — per-community status, next lesson, category, rating | B1, B2, B3, B7, B8 (join notification) | `LearningCommunityItem.status` · `LearningCommunityItem.nextLessonTitle` · `LearningCommunityItem.category` · `LearningCommunityItem.rating` · `LearningCommunityItem.memberCount` | **S** |
| **Enrollment learning status (completed / archived)** | B2 (tabs + counts), B7, B12 | `EnrollmentResponse.learningStatus: "active"|"completed"|"archived"` + `archivedAt` | **S** |
| **Profile field extensions** — username, location, pronouns, cover, interests, email/phone verification | B19, B7, B10, B20, B22 (blocked user usernames), B25 | Extend `ProfileUpdateRequest` / `ProfileResponse` / `AccountResponse` with `username`, `location`, `pronouns`, `coverUrl`, `interests[]`, `emailVerified`, `phoneNumber`, `phoneVerified`, `passwordChangedAt` | **S** |
| **Public profile by username** | B19 ("interlekt.com/@adaokafor"), B22, B16 (verify URL shape) | `GET /users/username-availability?username=` · `GET /users/{username}` (public) | **S** |
| **Email change + password change** | B20, B10 (Account section), B7 (Account tab) | `PATCH /users/me/email` + `POST /users/me/email/confirm` · `PATCH /users/me/password` | **S** |
| **Review field extensions** | B17, B8 (review notifications), A3 (public reviews) | Extend `ReviewCreateRequest`/`ReviewUpdateRequest`/`ReviewResponse` with `recommend`, `showNamePublicly`, `isAnonymous`, `editedAt`, `editableUntil` + a server-side 30-day edit window | **S** |
| **Onboarding state + interest persistence** | B15, B7 (Interests chips), B1 (suggested communities) | `GET/PUT /users/me/onboarding` · `ProfileUpdateRequest.interests[]` · optional `GET /topics` · recommended-communities query | **S** |
| **Community rules + member preview** | B3 (avatar stack), B5 (Members tab), B28, B29 | `CommunityDetail.rules[]` · `GET /communities/{slug}/members/preview?limit=8` (learner-readable — `GET /communities/{slug}/members` is **creator-only, 403**) | **S** |
| **Post/comment authorship in `users/me/learning`** — `nextLessonTitle` needs a join, not a per-lesson fetch | B1 (Continue learning), B2 | `LearningCourseItem.nextLessonTitle` (derived server-side from the next incomplete lesson) | **S** |
| **Design-system gaps** (not backend, but blocking) | B28, B29, B4 | `design-system.css` is missing `.discussions-grid`, `.discussions-rail`, `.code-block` — used by B28/B29 and the `<pre class="code-block">` in B29. `.activity-grid` and `.activity-side-grid` (B27) are also missing. Add them or refactor the screens to existing utilities. | **S** |

### Cross-cutting findings

1. **No screen in this shell is fully LIVE.** 11 are PARTIAL, 18 need new backend work. The most complete data surfaces are the **classroom/lesson tree** (`GET /courses/{id}` + `GET /courses/{id}/progress` + `GET /lessons/{id}`) and the **community feed** (`GET /communities/{slug}/posts`). Everything gamified, social, or financial is a net-new subsystem.
2. **The 5 payment screens (B6, B11, B12, B13, B14) plus the Billing tab of B7 and the Billing section of B10 are all blocked on one subsystem.** Build `plans → checkout/sessions → orders → subscriptions → payment-methods → refund-requests` as one vertical slice; B6 alone is the highest-value first cut.
3. **`GET /communities/{slug}/members` returns 403 for learners** (verified live: "Only the community's creator can view its members"). B3's member avatar stack, B5's Members tab, and B28's contributor list all need a new learner-readable endpoint.
4. **`GET /communities/{slug}/posts` returns 403 for non-enrolled users** and **`GET /communities/{slug}/reviews` returns 401 when anonymous** (both verified live). B5 and B28 must be enrollment-gated; A3's review list is signed-in only.
5. **There is no way to express a "current lesson" or a "community-level progress" in one request** — `GET /users/me/learning` gives course-level percentages but no current lesson, and `GET /communities/{slug}/courses` returns `CourseSummary` (no `slug`, no modules). The classroom needs 1 + N requests (community → course detail → course progress) per community. Adding `nextLessonTitle` to `LearningCommunityItem` removes the worst N+1.
6. **`AuthorSummary` has no `isVerified` and no `roles`** — the feed (B5), discussions (B28) and thread detail (B29) all render a teal verification check next to a post author. That check can only come from `GET /users/{user_id}` (N+1) or a schema extension.
7. **Two competing settings shells.** B10 (`/settings`) uses a bespoke 6-item sidebar; B19–B26 use `.settings-shell` with an 8-item sidebar. B10's "Billing & payments" and "Danger zone" have no counterpart in the B19–B26 sidebar. Pick one shell + one sidebar list before implementation.
8. **The mock data is internally inconsistent** in ways that will produce bugs if copied: B2's tab counts (All 6) disagree with its 5 rendered cards; B3's module 2 says "67%" for 3/6 done; B7's "8 months on Interlekt" contradicts "March 2024" against today's date; B11 and B8 disagree on order/notification counts; B12 treats "Content Creators" as paused while B11 marks its order refunded; B16 says "18 of 18 lessons" where B2 says "20 of 20"; B27 says 247 contributions this year but its monthly bars total 265; B1's "8h 24m this week" is copied into B3 as the course total duration; B6's VAT of ₦544 on a ₦7,225 subtotal is 7.53%, not the stated 7.5% (₦542 → total ₦7,767, not ₦7,769); B13's security copy lists Paystack as its own example ("processed by Paystack — the same provider used by Paystack, Flutterwave, and Kuda"); B20 renders recovery codes while 2FA is "Not enabled".
9. **The revenue-split model is contradictory.** B6's receipt shows Creator 88% / Platform 12%, while the creator-shell brief (C18) specifies an 88/10/2 split. 88+12 ≠ 88+10+2. One canonical model must be chosen before either screen is built, and the fee must be computed server-side so the displayed split matches the charged amount.
10. **Live seed data is inadequate for any screen in this shell** — 4 communities (3 paid at ₦2,500/₦5,000, 1 free), member counts 0–4, 2 reviews on one community, 3 posts, 0 comments, 1 creator verified, all `avatarUrl` null (the mock assumes photo avatars everywhere). A **content-seeding step** — communities across all 8 categories, 2–3 courses each, modules, lessons with real `durationSeconds` and `content`, posts, comments, reviews, and a set of learners with progress — is a prerequisite for QA-ing any of these screens.
11. **`GET /categories` returns 8 categories whose names do not match B15's 12 topic chips.** Onboarding step 2 must either be re-cut to the 8 real categories or a separate `topics` table must be added.
12. **Money is a decimal string** (`"5000.00"`) everywhere and **pagination is `page` + `pageSize`** with `{items, page, pageSize, total, totalPages}`. All NEW contracts above follow these conventions so the existing `api()` client, `Paginated<T>` type, and `qk` query-key factory work unchanged.
13. **Auth is Bearer-only** (`Authorization: Bearer <accessToken>`), no httpOnly cookie. The existing `client.ts` already handles a 401 → `POST /auth/refresh` → single retry. New endpoints must use the same envelope `{ error: { code, message, details } }` so `apiErrorMessage()` and `ApiError.code` keep working (e.g. `payment_required`, `forbidden`, `unauthorized`).
