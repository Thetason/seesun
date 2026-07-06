# AI Handoff

Last updated: 2026-06-12

This file is a quick project handoff for other AI coding tools. It focuses on the latest product and engineering state that should not be rediscovered from scratch.

Read this first for product direction, project boundaries, current implementation, remaining work, and verification:

- `/Users/bin/Documents/New project/sisun-app/docs/current/00_START_HERE.md`

For the upcoming public-site rewrite, also read:

- `/Users/bin/Documents/New project/sisun-app/MARKETING_REFACTOR_BRIEF.md`

## 2026-06-12

### LongBlack-style daily routine delivery added

- LongBlack benchmark: daily paid-member content alerts work through email newsletter, KakaoTalk channel, and app push.
- Kakashi now has a daily routine delivery engine for today's available `DailyRoutine` records.
- Vercel cron calls `/api/internal/routines/daily-delivery` at `0 23 * * *`, which is 08:00 KST.
- Email is sent automatically when SMTP env vars are configured.
- Kakao is not auto-sent yet; the system creates `RoutineDeliveryLog` rows with `KAKAO / READY` as an outbox for Kakao Channel/Alimtalk integration.
- Mission-link tokens are used when the routine has an assignment; otherwise the delivery links to `/dashboard`.

Key files:

- `/Users/bin/Documents/New project/sisun-app/docs/current/2026-06-12_LONGBLACK_STYLE_ROUTINE_DELIVERY.md`
- `/Users/bin/Documents/New project/sisun-app/src/lib/routine-delivery.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/internal/routines/daily-delivery/route.ts`
- `/Users/bin/Documents/New project/sisun-app/vercel.json`

Operational note:

- For real email delivery, set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and optionally `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`.
- For real Kakao delivery, choose Kakao Channel manual, Alimtalk/Friendtalk provider, or Kakao Business API and consume the `KAKAO / READY` outbox.

### Lesson attendance QR and session ledger added

- Coaches can now show/copy a daily Lesson QR from the dashboard Today Care panel.
- Members who scan the QR are sent through `/lesson/check-in`; if they are not logged in, login returns them to the check-in URL.
- `LessonAttendance` records are tied to the active `Enrollment` when one exists.
- The app assigns `lessonNumber` automatically using the active enrollment attendance count.
- Duplicate same-day attendance is blocked by `@@unique([userId, attendanceDate])`.
- Coach dashboard now shows:
  - today attendance state in the student list
  - selected member's lesson count metric
  - Lesson Ledger with registration date, current count, and recent session timeline
- Member dashboard now shows a small lesson attendance status in My Program.

Key files:

- `/Users/bin/Documents/New project/sisun-app/docs/current/2026-06-12_LESSON_ATTENDANCE_QR.md`
- `/Users/bin/Documents/New project/sisun-app/prisma/schema.prisma`
- `/Users/bin/Documents/New project/sisun-app/src/lib/lesson-attendance.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/admin/lesson-attendance/qr/route.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/lesson-attendance/check-in/route.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/lesson/check-in/page.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/CoachDashboardClient.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/StudentDashboardClient.tsx`

Operational note:

- `LESSON_QR_SECRET` is optional when `NEXTAUTH_SECRET` exists, but it is the preferred dedicated secret.
- This is attendance/session accounting, not payment automation.

Verification:

- `npx prisma format`
- `npx prisma generate`
- `npm run lint`
- `npm run build`
- `npm run internal-os:regression`

## 2026-06-11

### Documentation entry point added

- `docs/current/00_START_HERE.md` is now the first document to read.
- `README.md` was rewritten from a Next.js-style starter README into a SEE:SUN project entry point.
- The docs now make the core product direction explicit:
  - Kakashi = SEE:SUN App / paid-member coaching OS
  - Obiwan = vocal training and signal analysis app
  - Gojo = Routine Recommendation Engine
- The docs now state the current loop:
  - `landing/diagnosis -> consultation -> paid member -> today's routine -> recording -> coach feedback -> weekly report -> next routine`
- The docs also list current implementation status, remaining work, and verification commands.

## 2026-06-08

### Internal OS contract added

- Obiwan Session Coach signals now feed the Kakashi/Gojo operating layer instead of only being stored as raw integration payloads.
- `POST /api/integrations/obiwan/signals` now normalizes incoming payloads, stores `ObiwanVocalSignal`, creates a `GojoRoutineRecommendation` by default, and records a `ContactLog` audit note.
- `GET /api/admin/internal-os/member-state?userId=...` returns a bounded Kakashi/Gojo/Obiwan operating packet for a coach.
- `POST /api/admin/internal-os/recommendations/[recommendationId]/decision` lets a coach accept or dismiss a recommendation.
- `COACH_REQUIRED` recommendations must be accepted before publish; dismissed recommendations cannot be published.

Key files:

- `/Users/bin/Documents/New project/sisun-app/src/lib/internal-os/obiwan-signal-normalizer.ts`
- `/Users/bin/Documents/New project/sisun-app/src/lib/internal-os/kakashi-obiwan-os.ts`
- `/Users/bin/Documents/New project/sisun-app/src/lib/gojo/recommendation-engine.ts`
- `/Users/bin/Documents/New project/sisun-app/src/lib/gojo/routine-library.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/integrations/obiwan/signals/route.ts`
- `/Users/bin/Documents/New project/sisun-app/docs/current/2026-06-08_INTERNAL_OS_CONTRACT.md`

Verification:

- `npm run internal-os:regression`

## 2026-04-03

### Internal site analytics replaced Clarity

- External `Microsoft Clarity` integration was removed.
- Public-page analytics now write directly into the app database using the new `AnalyticsEvent` model.
- Tracked events:
  - `page_view`
  - `page_exit`
  - `diagnosis_started`
  - `diagnosis_completed`
  - `kakao_chat_click`
- Excluded paths:
  - `/admin`
  - `/dashboard`
  - `/mission/*`
  - `/api/*`
  - `/_next/*`

Key files:

- `/Users/bin/Documents/New project/sisun-app/prisma/schema.prisma`
- `/Users/bin/Documents/New project/sisun-app/prisma/migrations/20260403073000_add_analytics_events/migration.sql`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/analytics/event/route.ts`
- `/Users/bin/Documents/New project/sisun-app/src/components/SiteAnalyticsTracker.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/lib/site-analytics.ts`
- `/Users/bin/Documents/New project/sisun-app/src/lib/site-analytics-client.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/page.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/CoachDashboardClient.tsx`

Operational note:

- Coach dashboard now has a `사이트 통계` tab.
- It shows recent 7-day traffic, top pages, diagnosis starts/completions, and Kakao chat clicks.
- No external analytics account or environment variable is required.

### Spark Corner batch workflow simplified

- Spark Corner now supports selecting specific members directly inside the Spark view.
- Coaches can use `전체 선택` or `선택 해제`.
- Daily Spark routine publishing now supports multiple routines at once instead of one-by-one entry.
- Weekly batch publishing also respects selected target members instead of forcing all mission-possible members.

Key files:

- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/CoachDashboardClient.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/admin/create-assignment/route.ts`

Behavior note:

- `create-assignment` now supports `userIds[]` in addition to `userId` and broadcast mode.
- If all Spark targets are selected, the UI still uses the broadcast path.
- If only some targets are selected, the UI sends `userIds[]`.

## 2026-04-01

### Diagnosis flow reduced to email + Kakao chat handoff

- The diagnosis flow was simplified.
- Question 1 changed to:
  - `성장&변화 하고 싶은 부분은 어떤 영역이세요?`
- Question 1 now supports multiple selection.
- Final step only requires email.
- After saving the consultation lead, the user is redirected to the Kakao chat URL.

Key files:

- `/Users/bin/Documents/New project/sisun-app/src/app/diagnosis/page.tsx`
- `/Users/bin/Documents/New project/sisun-app/src/app/api/consultations/route.ts`
- `/Users/bin/Documents/New project/sisun-app/src/app/dashboard/CoachDashboardClient.tsx`

Behavior note:

- Consultation DB still keeps required `name` and `phone`.
- The API fills safe fallback values internally for email-only diagnosis leads.

## 2026-03-27

### Mission possible delivery improvements

- Daily mission magic links were added.
- Spark Corner UI was simplified around daily publishing and link copy flow.
- Weekly mission batching was added so coaches can prepare a week in advance.

Important related commits in history:

- `7f99502` `Add magic links for daily missions`
- `61d871b` `Simplify spark corner workflow`
- `582e552` `Add weekly mission batching`

## Current truth

- The app is using internal analytics, not Clarity.
- Diagnosis leads go to Kakao chat after email capture.
- Spark Corner is the main place for mission-possible batch operations.
- Daily missions can be shared through magic links.
- Weekly routines can be pre-scheduled.
