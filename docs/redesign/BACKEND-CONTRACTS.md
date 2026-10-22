# Interlekt Backend Contract Specification (The 39 Held Screens)

**Author:** Antigravity Pairing Agent  
**Target:** Interlekt Backend Engineering Team  
**Live API Host:** `https://interlekt-backend.onrender.com`  
**Frontend Codebase:** `apps/web` (Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query)  
**Status:** READY FOR BACKEND IMPLEMENTATION  

---

## 1. Executive Summary & Context

The frontend redesign (`interlekt-redesign v3.1`) encompasses **82 screens**.
- **43 screens** are currently built, verified, and mapped directly to the live backend endpoints (`/api/v1/*`), respecting all live schemas with zero fabricated mock layers.
- **39 screens** are held because their core data models and REST endpoints do not exist on the Render backend yet.
- In accordance with production design rules, **no mock data or fake counters** are rendered on the frontend. Held screens and gated blocks remain honestly empty, gracefully disabled with tooltips, or routed to status notices until the following endpoints are deployed.

This document serves as the **official API specification** for the backend developer to build and expose the remaining endpoints.

---

## 2. API Conventions & Standards

All new endpoints MUST adhere to the existing Interlekt backend architecture:
1. **Base Path:** `/api/v1`
2. **Authentication:** Bearer token in the request header:
   `Authorization: Bearer <accessToken>`
3. **Pagination Envelope (Flat):**
   ```json
   {
     "items": [],
     "total": 120,
     "page": 1,
     "pageSize": 20,
     "totalPages": 6
   }
   ```
4. **Currency & Money Representation:**
   Always serialize money as **decimal strings** (`"2500.00"`), never floating-point numbers. Include currency code (`"NGN"` default).
5. **Standard Error Envelope:**
   ```json
   {
     "error": {
       "code": "insufficient_permissions",
       "message": "Only verified creators can access this resource.",
       "details": {}
     }
   }
   ```
6. **Date Formatting:** ISO 8601 UTC strings (`YYYY-MM-DDTHH:mm:ssZ`).

---

## 3. Subsystem Specifications

### 3.1. Payments, Checkout & Subscriptions (Screens B6, B11, B12, B13, B14)

#### `POST /api/v1/communities/{slug}/checkout`
Initiates a payment session with Paystack for community enrollment.
- **Auth:** Bearer (Learner)
- **Request Body:**
  ```json
  {
    "planType": "one_time | monthly | annual",
    "discountCode": "EARLYBIRD", // optional
    "callbackUrl": "https://interlekt.app/communities/tech-lagos/classroom"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "reference": "ilk_chk_8f1b2c4e",
    "authorizationUrl": "https://checkout.paystack.com/0abc...",
    "amount": "15000.00",
    "currency": "NGN",
    "fees": "225.00",
    "discountAmount": "1500.00"
  }
  ```

#### `GET /api/v1/checkout/{reference}/verify`
Verifies payment status and completes automatic enrollment.
- **Auth:** Bearer
- **Response `200 OK`:**
  ```json
  {
    "status": "success | pending | failed",
    "reference": "ilk_chk_8f1b2c4e",
    "communityId": "uuid",
    "enrolledAt": "2026-10-22T09:30:00Z"
  }
  ```

#### `GET /api/v1/orders/me`
List learner transaction/order receipts.
- **Auth:** Bearer (Learner)
- **Response `200 OK`:** Paginated `<OrderResponse>`
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "orderNumber": "ILK-2026-8941",
        "communityId": "uuid",
        "communityTitle": "Lagos TypeScript Collective",
        "amount": "15000.00",
        "currency": "NGN",
        "status": "paid | refunded | failed",
        "paymentMethod": "card | bank_transfer",
        "receiptUrl": "https://...",
        "createdAt": "2026-10-15T14:20:00Z"
      }
    ],
    "total": 1, "page": 1, "pageSize": 20, "totalPages": 1
  }
  ```

#### `GET /api/v1/subscriptions/me`
List recurring community memberships.
- **Auth:** Bearer (Learner)
- **Response `200 OK`:** Paginated `<SubscriptionResponse>`
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "communityId": "uuid",
        "communityTitle": "Design Systems Africa",
        "plan": "monthly",
        "amount": "5000.00",
        "currency": "NGN",
        "status": "active | paused | cancelled | past_due",
        "currentPeriodEnd": "2026-11-15T00:00:00Z",
        "cancelAtPeriodEnd": false
      }
    ],
    "total": 1, "page": 1, "pageSize": 20, "totalPages": 1
  }
  ```

#### `PATCH /api/v1/subscriptions/{id}`
Cancel, pause, or resume recurring memberships.
- **Auth:** Bearer (Learner)
- **Request Body:** `{ "action": "cancel | pause | resume" }`
- **Response `200 OK`:** Updated `<SubscriptionResponse>`

---

### 3.2. Creator Revenue, Transactions & Payouts (Screens C2, C4, C7, C10, C16, C18)

#### `GET /api/v1/creators/me/revenue`
Revenue overview and metrics for creator dashboard.
- **Auth:** Bearer (Creator)
- **Response `200 OK`:**
  ```json
  {
    "currency": "NGN",
    "totalGrossRevenue": "1250000.00",
    "totalNetRevenue": "1125000.00", // Platform 10% split
    "pendingPayout": "150000.00",
    "lifetimePayouts": "975000.00",
    "totalEnrollments": 84,
    "platformFeeRate": 0.10,
    "history": [
      { "date": "2026-10-01", "gross": "45000.00", "net": "40500.00" }
    ]
  }
  ```

#### `GET /api/v1/communities/{slug}/transactions`
Granular ledger entries for a community.
- **Auth:** Bearer (Creator)
- **Response `200 OK`:** Paginated `<TransactionItem>`
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "transactionReference": "TX-99014",
        "learner": { "id": "uuid", "displayName": "Adeola Vance", "avatarUrl": null },
        "amountGross": "15000.00",
        "processorFee": "225.00",
        "platformFee": "1500.00",
        "creatorNet": "13275.00",
        "currency": "NGN",
        "status": "settled | pending | refunded",
        "createdAt": "2026-10-20T11:04:00Z"
      }
    ],
    "total": 14, "page": 1, "pageSize": 20, "totalPages": 1
  }
  ```

#### `GET /api/v1/creators/me/payouts` & `POST /api/v1/creators/me/payouts`
Request manual payout or query payout batches.
- **Auth:** Bearer (Creator)
- **Request Body (POST):**
  ```json
  {
    "amount": "150000.00",
    "destinationAccountId": "uuid"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "id": "uuid",
    "amount": "150000.00",
    "currency": "NGN",
    "status": "requested | processing | completed | rejected",
    "requestedAt": "2026-10-22T08:00:00Z"
  }
  ```

---

### 3.3. Notifications & Notification Preferences (Screens B8, C14, B21)

#### `GET /api/v1/notifications`
- **Auth:** Bearer (Any)
- **Parameters:** `?page=1&pageSize=30&unreadOnly=false`
- **Response `200 OK`:**
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "type": "new_comment | lesson_completed | payout_sent | enrollment",
        "title": "New comment in React Masterclass",
        "body": "Tolu replied to your discussion post.",
        "linkUrl": "/communities/react-masterclass/feed",
        "isRead": false,
        "createdAt": "2026-10-22T09:15:00Z"
      }
    ],
    "unreadCount": 3,
    "total": 12, "page": 1, "pageSize": 30, "totalPages": 1
  }
  ```

#### `PATCH /api/v1/notifications/{id}/read`
Mark single notification as read.

#### `POST /api/v1/notifications/read-all`
Mark all notifications for authenticated user as read.

#### `GET /api/v1/me/notification-preferences` & `PUT /api/v1/me/notification-preferences`
Configure email and push alerts.
- **Payload:**
  ```json
  {
    "emailNewComments": true,
    "emailCommunityAnnouncements": true,
    "emailLessonUpdates": true,
    "emailMarketing": false,
    "pushDirectMessages": true
  }
  ```

---

### 3.4. Community Threads, Q&A & Discussions (Screens B28, B29, C20, A24)

#### `GET /api/v1/communities/{slug}/threads`
- **Auth:** Bearer (Enrolled learners + Creator)
- **Parameters:** `?page=1&pageSize=20&filter=all|unanswered|solved&sort=recent|top`
- **Response `200 OK`:** Paginated `<ThreadSummary>`

#### `POST /api/v1/communities/{slug}/threads`
Create question or discussion thread.
- **Request Body:**
  ```json
  {
    "title": "How do you handle Server Actions with TanStack Query in Next 15?",
    "content": "Detailed markdown explanation...",
    "tags": ["nextjs", "react-query"]
  }
  ```

#### `GET /api/v1/threads/{threadId}`
Full thread with hierarchical replies.
- **Response `200 OK`:** `<ThreadDetailResponse>` with `replies: []`, `upvotes: int`, `acceptedAnswerId: uuid | null`.

#### `POST /api/v1/threads/{threadId}/replies`
Post an answer or sub-reply.

#### `POST /api/v1/threads/{threadId}/vote`
Upvote or toggle upvote on a discussion thread.

---

### 3.5. Learner Gamification, Streaks & Activity (Screens B1, B27)

#### `GET /api/v1/users/me/activity`
Daily learning activity metrics for heatmaps and weekly graphs.
- **Response `200 OK`:**
  ```json
  {
    "currentStreak": 7,
    "longestStreak": 21,
    "totalLessonsCompleted": 48,
    "totalMinutesLearned": 720,
    "heatmap": [
      { "date": "2026-10-21", "count": 4, "minutes": 45 },
      { "date": "2026-10-22", "count": 2, "minutes": 30 }
    ]
  }
  ```

#### `GET /api/v1/users/me/badges`
Badges and achievement milestones earned.

---

### 3.6. Admin Operations & Auditing (Screens D1, D2, D4, D5, D6, D7, D8, D9)

#### `GET /api/v1/admin/stats`
Global system metrics.
- **Auth:** Bearer (Role: `admin`)
- **Response `200 OK`:**
  ```json
  {
    "totalUsers": 1420,
    "totalLearners": 1340,
    "totalCreators": 80,
    "totalCommunities": 28,
    "totalVolume": "14850000.00",
    "currency": "NGN",
    "pendingVerifications": 4,
    "pendingPayouts": 2,
    "openReports": 1
  }
  ```

#### `GET /api/v1/admin/users`
Admin user search and role management.
- **Parameters:** `?query=&role=learner|creator|admin&status=active|suspended`

#### `GET /api/v1/admin/audit-log`
Auditable security event stream (logins, role changes, payouts, verification decisions).

#### `POST /api/v1/admin/payouts/{id}/decision`
Approve or reject a creator payout request.
- **Request Body:** `{ "action": "approve | reject", "reason": "Bank KYC verified" }`

---

## 4. Immediate Field Additions to Existing Endpoints

To make current live screens 100% accurate without breaking contracts:

| Endpoint | Missing Field | Type | UI Impact |
|---|---|---|---|
| `GET /communities` | `rating` | `float` (e.g. 4.9) | Displayed on community cards |
| `GET /communities` | `reviewCount` | `int` | Rating review badge |
| `GET /communities` | `memberCount` | `int` | Live learner member counter |
| `GET /creators/me` | `memberCount` | `int` | Creator dashboard header |
| `PUT /creators/me` | `headline`, `coverUrl`, `socialLinks` | `string` / `dict` | Saves creator profile without dropping data |
| `GET /communities/{slug}` | `courses` | Array of `<CourseSummary>` | Currently returns empty array `[]` on live backend |

---

## 5. Live Database Probe Data Cleanup

During testing and mapping against the Render backend, test entries were inserted:
- **Accounts:** ~9 throwaway test creator accounts.
- **Communities:** 3 test entries ("Probe Community").
- **Action Required:** Backend developer should execute a database cleanup migration or admin query on Render Postgres to drop communities with titles matching `*Probe*` or `*Test*`.

---

## 6. Frontend Readiness

- All 43 buildable routes build cleanly with Next.js 15 (`pnpm build` passes with 0 errors).
- All screens handle empty and loading states honestly.
- Once the above endpoints are added to the backend, the corresponding frontend route shells can immediately connect by importing TanStack Query hooks from `@/hooks/`.
