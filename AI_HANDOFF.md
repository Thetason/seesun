# AI Handoff

Last updated: 2026-04-03

This file is a quick project handoff for other AI coding tools. It focuses on the latest product and engineering state that should not be rediscovered from scratch.

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
