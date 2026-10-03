Interlekt
Project Requirements Document
Hackathon MVP • Product + Engineering Specification

Document Field
 | Value
 | 
Product
 | Interlekt
 | 
Document Type
 | Project Requirements Document (PRD)
 | 
Version
 | 0.1 — Hackathon MVP
 | 
Status
 | Draft / For Implementation
 | 
Primary Market
 | Africa — initial focus on Nigeria
 | 
Primary Users
 | Learners, creators/mentors, platform administrators
 | 
MVP Objective
 | Validate discovery → trust → enrollment → payment → learning → creator revenue
 | 

Working principle: Build a focused, demonstrable product rather than a full Skool replacement.


1. Product Overview
1.1 Product Summary
Interlekt is a learning and community platform designed for African creators, mentors, and educators to build, monetize, and grow learning communities. Learners can discover communities, evaluate creators, enroll in paid or free learning experiences, access structured classroom content, and participate in community discussions.
1.2 Product Positioning
Interlekt is inspired by the community-learning model popularized by platforms such as Skool, but it is not intended to reproduce every feature of those platforms. The MVP focuses on a narrower proposition: helping African knowledge creators turn expertise into monetizable learning communities while helping learners discover and evaluate those communities.
1.3 Vision
Build a trusted platform where African expertise can become accessible learning experiences and sustainable creator businesses.
1.4 Mission
Make it easier for people to discover who to learn from, join communities that fit their goals, and enable educators to earn from the knowledge they provide.
2. Problem Statement
Online learning is abundant, but learners often struggle to determine which mentor, course, or community is worth their time and money. At the same time, African educators and subject-matter experts may have audiences and valuable knowledge but lack a focused platform for packaging that knowledge into structured, community-driven and monetizable experiences.
2.1 Core Problem
How can Interlekt connect learners with credible learning communities while giving African creators a practical path from expertise to recurring or direct revenue?
2.2 Product Hypothesis
If learners can discover communities, evaluate creators through transparent profiles/reviews/activity, and complete a simple enrollment and payment flow, while creators can create communities and see revenue, then Interlekt can demonstrate a viable learning-community marketplace model.
3. Target Users
User
 | Description
 | Primary Needs
 | 
Learner
 | Person looking to learn a skill, subject, or profession.
 | Discovery, trust, curriculum, community, affordable/local payment, progress.
 | 
Creator / Mentor
 | Expert or educator who wants to teach and monetize knowledge.
 | Community creation, classroom, students, payments, revenue visibility.
 | 
Administrator
 | Interlekt operator responsible for platform integrity.
 | User management, creator verification, moderation, transaction visibility.
 | 

4. Goals and Success Criteria
4.1 MVP Goals
Allow a learner to discover a relevant learning community.
Allow the learner to evaluate the creator and community before joining.
Allow the learner to enroll in a free or paid community.
Demonstrate a real payment flow for paid access.
Allow the learner to access structured classroom content and community discussions.
Allow a creator to create and manage a community and learning content.
Allow a creator to see basic enrollment and revenue information.
4.2 Hackathon Success Criteria
Metric / Proof
 | MVP Demonstration
 | 
Discovery
 | A learner can search/browse communities by topic/category.
 | 
Trust
 | Community page shows creator profile, verification status, rating/reviews or activity evidence.
 | 
Conversion
 | Learner can enroll in a paid community through a payment flow.
 | 
Learning
 | Enrolled learner can open a classroom, lessons, and community feed.
 | 
Creator economics
 | Creator dashboard shows members, paid members, and revenue/transaction data.
 | 
End-to-end story
 | Demo can run from discovery → evaluation → payment → learning → creator revenue.
 | 

5. MVP Scope
The MVP is intentionally constrained. Features are prioritized according to their contribution to the core product loop.
Feature
 | Priority
 | MVP Status
 | Purpose
 | 
Authentication
 | P0
 | Required
 | Secure account access.
 | 
Learner profiles
 | P0
 | Required
 | Identity and learning context.
 | 
Creator profiles
 | P0
 | Required
 | Trust and creator presentation.
 | 
Community discovery
 | P0
 | Required
 | Core marketplace/discovery experience.
 | 
Search + categories
 | P0
 | Required
 | Find relevant communities.
 | 
Community pages
 | P0
 | Required
 | Explain value before enrollment.
 | 
Classroom / courses
 | P0
 | Required
 | Structured learning.
 | 
Lessons
 | P0
 | Required
 | Actual learning content.
 | 
Community feed
 | P0
 | Required
 | Discussion and engagement.
 | 
Enrollment
 | P0
 | Required
 | Connect learner to learning experience.
 | 
Payments
 | P0
 | Required
 | Prove monetization.
 | 
Creator dashboard
 | P0
 | Required
 | Manage product and view business results.
 | 
Revenue tracking
 | P0
 | Required
 | Show creator earnings/transactions.
 | 
Reviews / ratings
 | P1
 | Recommended
 | Trust and social proof.
 | 
Creator verification
 | P1
 | Recommended
 | Trust signal.
 | 
Notifications
 | P2
 | Post-MVP
 | Engagement convenience.
 | 
Quizzes / assessments
 | P2
 | Post-MVP
 | Deeper learning measurement.
 | 
Certificates
 | P2
 | Post-MVP
 | Credentialing.
 | 
AI tutor / recommendations
 | P2
 | Post-MVP
 | Future differentiation.
 | 

5.1 Explicitly Out of MVP Scope
Native iOS/Android applications.
Live video streaming and video conferencing infrastructure.
Advanced AI tutoring or recommendation engines.
Advanced gamification and leaderboards.
Complex creator automation journeys.
Sophisticated certification infrastructure.
Multiple payment providers unless required for demonstration.
Advanced analytics and business intelligence.
Large-scale marketplace capabilities beyond learning communities.
6. Core User Journeys
6.1 Learner Journey
Open Interlekt.
Browse or search for a topic/community.
Open a community detail page.
Review creator information, verification, curriculum, price, activity, and social proof.
Select free enrollment or paid enrollment.
Complete payment if required.
Gain access to the classroom and community.
Consume lessons and participate in discussions.
6.2 Creator Journey
Create an account and select creator/mentor onboarding.
Complete creator profile.
Create a community.
Set community description, category, pricing, and access rules.
Create a course, modules, and lessons.
Publish the community.
Receive learner enrollments.
View members, transactions, and revenue in the creator dashboard.
6.3 Admin Journey
Authenticate into the admin dashboard.
Review users and creator accounts.
Review verification submissions where applicable.
Moderate reported content/users.
View platform-level enrollment and transaction information.
7. Functional Requirements
7.1 Authentication & Account Management
AUTH-001: Users shall be able to register with email and password.
AUTH-002: Users shall be able to log in and log out securely.
AUTH-003: The system shall support password hashing and secure credential handling.
AUTH-004: Protected resources shall require authenticated access.
AUTH-005: The system shall enforce authorization based on user roles/permissions.
AUTH-006: The system should support password reset for the MVP if implementation time permits.
7.2 Profiles
USER-001: Users shall have a profile containing display name, avatar, bio, and basic profile information.
USER-002: Learners shall be able to specify learning interests/categories.
CREATOR-001: Creators shall have a public-facing creator profile.
CREATOR-002: Creator profiles shall display expertise, biography, communities, and trust indicators.
7.3 Community Discovery
DISC-001: Users shall be able to browse available communities.
DISC-002: Users shall be able to search communities by name/topic.
DISC-003: Communities shall belong to one or more predefined categories.
DISC-004: Community cards shall display key information such as title, creator, price, member count, and rating/activity where available.
DISC-005: The system shall provide a community detail page before enrollment.
7.4 Community Management
COMM-001: Creators shall be able to create a community.
COMM-002: Creators shall be able to edit community title, description, category, image, and pricing.
COMM-003: Creators shall be able to publish/unpublish a community.
COMM-004: Communities shall support free or paid access.
COMM-005: Members shall be able to view community content only when authorized.
7.5 Classroom / Courses
COURSE-001: Creators shall be able to create courses within a community.
COURSE-002: Courses shall contain modules and lessons.
COURSE-003: Lessons shall support text and externally hosted/embedded video content for MVP.
COURSE-004: Creators shall be able to publish and unpublish courses/lessons.
COURSE-005: Learners shall be able to view lessons available to their enrollment level.
COURSE-006: The system should track basic lesson completion/progress if feasible within the hackathon scope.
7.6 Community Feed
FEED-001: Members shall be able to create posts within a community.
FEED-002: Members shall be able to comment on posts.
FEED-003: Creators shall be able to publish announcements.
FEED-004: Users shall only access feeds for communities in which they have appropriate access.
7.7 Enrollment & Access
ENR-001: Learners shall be able to enroll in free communities.
ENR-002: Learners shall be able to initiate paid enrollment.
ENR-003: Successful payment shall create or activate the appropriate enrollment.
ENR-004: The system shall prevent unauthorized access to paid content.
ENR-005: Enrollment status shall be persisted and queryable.
7.8 Payments & Monetization
PAY-001: Creators shall be able to configure a price for a paid community.
PAY-002: Learners shall be able to pay for paid access using the selected payment provider.
PAY-003: The system shall persist payment/transaction records.
PAY-004: Payment confirmation shall be handled using provider verification/webhooks where supported.
PAY-005: The creator dashboard shall display basic revenue and transaction information.
PAY-006: The platform shall calculate/display its platform fee and creator amount where applicable.
7.9 Reviews & Trust
TRUST-001: Eligible learners should be able to submit a rating/review.
TRUST-002: Reviews should be associated with real enrollments where technically feasible.
TRUST-003: Community pages should display rating/review information.
TRUST-004: Creators may have a verification status visible on their public profile.
7.10 Creator Dashboard
DASH-001: Creators shall see their communities.
DASH-002: Creators shall see member/enrollment counts.
DASH-003: Creators shall see payment/transaction summaries.
DASH-004: Creators shall be able to manage courses and lessons.
7.11 Admin
ADMIN-001: Administrators shall be able to view users.
ADMIN-002: Administrators shall be able to manage creator verification status.
ADMIN-003: Administrators shall be able to moderate reported users/content at a basic level.
ADMIN-004: Administrators shall be able to view platform transaction information.
8. Roles & Permissions
Capability
 | Learner
 | Creator
 | Admin
 | 
Browse communities
 | ✓
 | ✓
 | ✓
 | 
Enroll
 | ✓
 | ✓
 | ✓
 | 
Create community
 | —
 | ✓
 | ✓
 | 
Create courses/lessons
 | —
 | ✓
 | ✓
 | 
Post in community
 | ✓
 | ✓
 | ✓
 | 
Manage own community
 | —
 | ✓
 | ✓
 | 
View own revenue
 | —
 | ✓
 | ✓
 | 
Verify creators
 | —
 | —
 | ✓
 | 
Moderate platform
 | —
 | Limited
 | ✓
 | 
Manage users
 | —
 | —
 | ✓
 | 

9. Non-Functional Requirements
Security
Passwords must be securely hashed.
Authentication and authorization must be enforced server-side.
Sensitive configuration must be stored in environment variables/secrets, not committed to source control.
API inputs must be validated.
Protected resources must verify ownership/permissions.
Performance
API endpoints should return within an acceptable interactive response time under normal MVP load.
Frontend data fetching should avoid unnecessary duplicate requests.
Pagination should be used for potentially large lists such as communities, posts, members, and transactions.
Reliability
Payment processing must be idempotent where possible.
Payment webhooks must be safely repeatable.
Critical database operations should use transactions.
Accessibility & UX
The application should be responsive and mobile-first.
Forms should provide clear validation and error states.
Interactive controls should be keyboard accessible where practical.
Maintainability
Backend modules should follow clear domain boundaries.
Frontend components should be reusable and typed.
API contracts should be documented.
Database changes should be managed through migrations.
10. Proposed Technology Stack
The following stack is proposed for the hackathon MVP. Final technology decisions should be validated against implementation speed, team familiarity, hosting constraints, and required integrations.
Layer
 | Technology
 | Purpose
 | 
Frontend framework
 | Next.js + React
 | Web application, routing, rendering, server/client components.
 | 
Frontend language
 | TypeScript
 | Type safety and maintainable application code.
 | 
Styling
 | Tailwind CSS
 | Responsive UI development.
 | 
UI components
 | shadcn/ui + Radix UI
 | Accessible, reusable interface components.
 | 
Client data fetching
 | TanStack Query
 | Server-state fetching, caching, mutations, invalidation.
 | 
Client state
 | Zustand
 | Lightweight local/global UI state.
 | 
Forms
 | React Hook Form
 | Performant form state and submission.
 | 
Validation
 | Zod
 | Schema validation and type-safe form/API boundaries.
 | 
Backend
 | Python + FastAPI
 | REST API and business logic.
 | 
ORM / database access
 | SQLAlchemy 2.x
 | Typed database access and ORM.
 | 
Migrations
 | Alembic
 | Version-controlled PostgreSQL schema migrations.
 | 
Database
 | PostgreSQL
 | Primary relational database.
 | 
API schemas
 | Pydantic
 | Request/response validation and serialization.
 | 
Authentication
 | JWT or secure session strategy
 | Authentication and authorization.
 | 
Authorization
 | RBAC / permission checks
 | Learner, creator, and admin access control.
 | 
Payments
 | Paystack initially
 | African/Nigerian payment collection for MVP.
 | 
Email
 | Resend or equivalent
 | Transactional email if required.
 | 
File/media
 | Cloudinary or S3-compatible storage
 | Avatars, community images, and future media assets.
 | 
Containerization
 | Docker + Docker Compose
 | Consistent local and deployment environments.
 | 
Reverse proxy
 | Nginx or platform-managed proxy
 | Production routing/TLS where needed.
 | 
Testing backend
 | Pytest
 | Unit and API/integration testing.
 | 
Testing frontend
 | Vitest + React Testing Library
 | Component and frontend logic testing.
 | 
E2E testing
 | Playwright
 | Critical user-flow testing.
 | 
API documentation
 | FastAPI OpenAPI/Swagger
 | Interactive API documentation.
 | 
Version control
 | Git + GitHub
 | Source control and collaboration.
 | 
CI/CD
 | GitHub Actions
 | Automated linting, testing, builds, and deployment.
 | 
Monitoring
 | Sentry + structured logging
 | Error tracking and production observability.
 | 

11. High-Level Architecture
The MVP should use a modular web architecture with a Next.js frontend communicating with a FastAPI backend. PostgreSQL is the system of record. External services handle payments, email, and media storage where needed.
Conceptual flow:
Browser → Next.js → FastAPI API → PostgreSQL
                                     ↘ Payment Provider
                                     ↘ Email Provider
                                     ↘ Object/Media Storage
11.1 Backend Domain Modules
auth
users
creators
communities
courses
lessons
posts/comments
enrollments
payments
reviews
notifications
admin
12. Proposed Data Model
The following are the major MVP entities. The full ERD should be maintained in the technical design documentation.
Entity
 | Purpose / Key Relationships
 | 
User
 | Authentication identity; linked to profile, enrollments, posts, reviews, transactions.
 | 
Profile
 | Public/user-specific profile information.
 | 
CreatorProfile
 | Creator expertise, bio, verification status.
 | 
Community
 | Learning community owned by a creator.
 | 
CommunityMember / Enrollment
 | Relationship between user and community; includes access/status.
 | 
Course
 | Structured learning container belonging to a community.
 | 
Module
 | Groups related lessons within a course.
 | 
Lesson
 | Individual learning content unit.
 | 
Post
 | Community discussion content.
 | 
Comment
 | Responses to posts.
 | 
Review
 | Learner rating/review associated with an eligible enrollment.
 | 
Payment / Transaction
 | Payment-provider transaction and platform accounting information.
 | 
Notification
 | User notification events.
 | 
Verification
 | Creator verification submission/status.
 | 

13. API Structure
API versioning should be used from the beginning. Example base path:
/api/v1
/auth
/users
/creators
/communities
/courses
/lessons
/posts
/enrollments
/reviews
/payments
/notifications
/admin
Exact endpoint definitions, request/response schemas, status codes, pagination conventions, and error formats should be maintained in the API specification/OpenAPI documentation rather than duplicated throughout the PRD.
14. Payment & Revenue Model
14.1 MVP Revenue Model
Creators can offer paid communities. Learners pay for access, and Interlekt retains a configurable platform fee while the remainder is attributed to the creator. The hackathon should demonstrate the transaction flow with a real or sandbox payment integration.
14.2 Example
Item
 | Example
 | 
Community price
 | ₦5,000 / month
 | 
Platform fee
 | Configurable percentage or fixed amount
 | 
Creator amount
 | Community price minus applicable platform fee
 | 
Payment provider
 | Paystack for MVP
 | 
Transaction state
 | Pending → Successful / Failed
 | 

14.3 Important Payment Requirements
Never grant paid access based only on frontend success state.
Verify payment server-side.
Persist provider transaction/reference IDs.
Handle repeated webhook notifications safely.
Keep payment and enrollment state consistent.
15. UX / UI Requirements
15.1 Public Pages
Landing page
Explore/discovery page
Search results
Community detail page
Creator profile
Login/register
15.2 Learner Pages
Learner dashboard
My communities
Classroom
Lesson view
Community feed
Profile
Payment/enrollment flow
15.3 Creator Pages
Creator dashboard
Community management
Course builder
Lesson editor
Members
Transactions/revenue
15.4 Admin Pages
Admin dashboard
Users
Creator verification
Reports/moderation
Transactions
16. Acceptance Criteria for the Core Demo
Flow
 | Acceptance Criteria
 | 
Discover
 | A learner can find a community by browsing/searching a category or topic.
 | 
Evaluate
 | The community page displays creator, description, curriculum, price, and available trust/activity information.
 | 
Enroll
 | A learner can enroll in a free community or initiate a paid enrollment.
 | 
Pay
 | A paid enrollment can be completed through the selected payment provider/sandbox.
 | 
Access
 | Successful enrollment grants the correct classroom/community access.
 | 
Learn
 | The learner can open at least one course and lesson.
 | 
Engage
 | The learner can view/create a community post and comment where permitted.
 | 
Create
 | A creator can create a community and at least one course/lesson.
 | 
Earn
 | A creator can see the resulting transaction/revenue information in the dashboard.
 | 

17. Security Requirements
Use environment variables/secrets for database credentials, JWT secrets, payment keys, and third-party API keys.
Do not expose private payment/provider secrets to the browser.
Enforce authorization on every protected backend operation.
Validate all incoming request data using Pydantic and/or Zod at appropriate boundaries.
Hash passwords using a modern password hashing algorithm.
Use HTTPS in production.
Implement basic rate limiting for authentication and sensitive endpoints if infrastructure permits.
Sanitize/validate uploaded files and restrict allowed types and sizes.
Do not trust client-provided role, price, ownership, or payment-success fields.
18. Testing Strategy
Layer
 | Tools / Approach
 | Priority
 | 
Backend unit tests
 | Pytest
 | P0
 | 
API/integration tests
 | Pytest + FastAPI test client
 | P0
 | 
Frontend component tests
 | Vitest + React Testing Library
 | P1
 | 
Critical E2E flows
 | Playwright
 | P0
 | 
Payment flow
 | Provider sandbox + webhook tests
 | P0
 | 
Manual UAT
 | Hackathon demo checklist
 | P0
 | 

Critical E2E scenario: discover community → open community → enroll/pay → access classroom → view lesson → creator sees transaction/revenue.
19. Deployment & DevOps
Development environment should run consistently through Docker where practical.
Production should use separate environment variables/secrets from development.
Database schema changes must use Alembic migrations.
GitHub Actions should run linting/tests before deployment.
Production deployments should be reproducible and rollback-aware.
Backups should be enabled for the production database.
Application logs and errors should be observable.
19.1 Suggested Repository Structure
Frontend and backend may live in separate repositories or a monorepo. For a small hackathon team, either approach is acceptable; the choice should prioritize deployment simplicity.
Example:
apps/web — Next.js application
apps/api — FastAPI application
docs — PRD, technical design, API notes
docker — shared Docker/development configuration where required
20. Roadmap After MVP
Phase
 | Potential Features
 | 
V1
 | Advanced progress tracking, quizzes, notifications, creator analytics, improved moderation.
 | 
V1.5
 | Subscriptions, creator payouts, richer reviews/reputation, community events.
 | 
V2
 | AI recommendations, AI learning assistant, certificates, advanced automation.
 | 
Future
 | Mobile apps, live classes, multi-country payment expansion, advanced marketplace capabilities.
 | 

21. Risks & Mitigations
Risk
 | Impact
 | Mitigation
 | 
Low-quality creators
 | Trust loss
 | Creator profiles, verification, reviews, moderation.
 | 
Fake reviews
 | Trust loss
 | Prefer reviews linked to real enrollments.
 | 
Payment/webhook failure
 | Incorrect access/revenue state
 | Server-side verification and idempotent processing.
 | 
Scope creep
 | MVP not finished
 | Strict P0/P1/P2 prioritization.
 | 
Too few communities
 | Weak discovery experience
 | Seed realistic demo communities/content.
 | 
Poor mobile UX
 | Reduced accessibility for target users
 | Mobile-first design and responsive testing.
 | 

22. Open Product Decisions
What exact criteria qualify a creator as verified?
Will Interlekt initially support monthly subscriptions, one-time purchases, or both?
What platform fee will Interlekt charge?
Will creators receive payouts directly or through a Interlekt-managed payout system?
Will the initial market be Nigeria-only for the hackathon or Africa-wide?
Which African countries/currencies are supported after Nigeria?
What content is allowed/prohibited on the platform?
Who owns learner-generated content and creator course content?
What happens to enrolled learners if a creator deletes a community?
23. Glossary
Term
 | Definition
 | 
Learner
 | A user who joins learning communities or consumes learning content.
 | 
Creator / Mentor
 | A user who creates and teaches through learning communities.
 | 
Community
 | A creator-managed environment containing social and learning experiences.
 | 
Classroom
 | The structured learning area containing courses, modules, and lessons.
 | 
Course
 | A structured collection of learning modules and lessons.
 | 
Enrollment
 | A learner's access relationship to a community/course.
 | 
Verification
 | A Interlekt process for reviewing creator information/credentials and assigning a trust status.
 | 
Platform fee
 | The portion of a successful transaction retained by Interlekt.
 | 

24. Hackathon Demo Script
The recommended demo should tell one complete story rather than showcase every feature.
Start as a learner: “I want to learn AI engineering.”
Search/browse Interlekt and show relevant communities.
Open one community and evaluate the creator, curriculum, activity, reviews/verification, and price.
Enroll and complete the payment flow.
Open the classroom and consume a lesson.
Post in the community to demonstrate engagement.
Switch to creator dashboard.
Show the new member and transaction/revenue information.
Close with the business proposition: Interlekt helps African experts turn knowledge into monetizable learning communities.
25. Final MVP Definition
The Interlekt MVP is complete when the following loop works reliably:
DISCOVER → TRUST → ENROLL → PAY → LEARN → ENGAGE → CREATOR EARNS
Everything that does not materially strengthen this loop should be considered secondary during the hackathon.

