# SEE:SUN App Implementation Roadmap

Date: 2026-06-08
Status: Active roadmap
Scope: Technical path for integrating paid-member management and Vocal OS features into SEE:SUN App

Internal project names:

- Project Kakashi: this SEE:SUN member management and coaching operations web app
- Project Obiwan: vocal training and voice analysis app
- Project Gojo: Routine Recommendation Engine

## Current Technical Reality

The app now has the first working foundation of the paid-member coaching OS.

Existing foundations:

- Next.js App Router
- NextAuth credential login
- Prisma
- Postgres
- Vercel deployment
- consultation API
- student and coach dashboard
- tracks
- assignments
- feedback
- Vercel Blob audio upload
- tokenized mission access link
- site analytics events
- paid enrollment state
- member profile
- life-practice context
- daily check-ins
- lesson notes
- daily routine objects
- routine delivery logs
- weekly reports
- consultation-to-member conversion
- coach member OS panel
- Routine Studio
- Gojo recommendation engine
- Obiwan signal ingestion harness
- internal OS operating packet

The missing part is no longer server possibility or the first operating model.

The remaining work is production hardening and operating depth:

- larger SEE:SUN-approved routine library
- stronger Gojo queue UX
- real Obiwan project connection
- Kakao/Alimtalk or delivery automation
- launch QA across invite, login, recording, Blob, mobile, and Vercel env
- retention/proof reporting depth

## Keep From `music edu tec`

Bring these concepts into SEE:SUN App:

- StudentProfile
- CheckIn
- LessonNote
- DailyRoutine
- RoutineDeliveryLog
- WeeklyReport
- owner/coach operating quality metrics
- local-first routine language
- life-coaching framing

Do not bring these directly:

- SQLite runtime
- login-code auth as the main auth system
- local file storage
- separate app shell

SEE:SUN App remains the production service.

## Phase 1: Product Foundation

Status:

Implemented.

Goal:

Make the product direction explicit and prepare the codebase for the new operating model.

Tasks:

- add product doctrine documentation
- add screen blueprint
- add implementation roadmap
- rename user-facing dashboard brand from `SEE:SUN STUDIO` to `SEE:SUN App`
- remove student-facing gamified tone from the dashboard over time
- define low-pressure Korean UX language

Acceptance:

- docs exist in `docs/current`
- future changes can reference a single product direction

## Phase 2: Data Model Upgrade

Status:

Implemented for the first operating OS.

Goal:

Represent paid membership, not just login accounts and assignments.

Add enums:

- EnrollmentStatus
- PaymentStatus
- RoutineStatus
- CheckInCondition
- ContactChannel

Add models:

- MemberProfile
- Enrollment
- PaymentRecord
- CheckIn
- LessonNote
- DailyRoutine
- RoutineDeliveryLog
- ContactLog
- WeeklyReport
- RoutineTemplate
- GojoRoutineRecommendation
- ObiwanVocalSignal

Recommended relationship:

- User has one MemberProfile
- User has many Enrollments
- Enrollment belongs to Track or Program label
- DailyRoutine belongs to User and optionally Enrollment
- CheckIn belongs to User and optionally DailyRoutine
- LessonNote belongs to User and coach
- WeeklyReport belongs to User and date range
- ContactLog belongs to User and optionally Consultation

Migration note:

Keep existing Assignment and Feedback during transition. Do not delete them immediately.

Map:

- existing Assignment -> DailyRoutine or curriculum item
- existing Feedback -> feedback attached to DailyRoutine or recording

## Phase 3: Consultation To Paid Member

Status:

Implemented for MVP.

Goal:

Turn sales leads into operational members without manual drift.

Tasks:

- add `convert to paid member` action in consultation detail
- create or link user from consultation email/phone
- create MemberProfile
- create Enrollment
- assign track
- copy consultation fields into profile
- add first ContactLog
- optionally create first onboarding DailyRoutine

Acceptance:

- a coach can convert a Highend15 consultation into an active member in one guided flow
- the member appears in the coach's member list with program, status, and next action

## Phase 4: Member Today Screen

Status:

Implemented as mobile-first MVP. Continue polishing for launch.

Goal:

Replace the student dashboard feel with a premium life-coaching routine surface.

Tasks:

- create `TodayRoutineCard`
- show one primary open routine
- show expected time
- show life anchor
- show privacy reassurance
- support guide audio/video
- support record in browser
- support file upload fallback
- show latest coach feedback
- show next lesson focus

Acceptance:

- the member can log in on mobile and understand the next action in under five seconds
- no dense dashboard content appears above the primary routine

## Phase 5: Coach Today Queue

Status:

Partially implemented through the coach member OS and Gojo panel. Dedicated queue UX still needs refinement.

Goal:

Make coach operations queue-based.

Tasks:

- compute queue items server-side
- add queue groups:
  - recording arrived
  - feedback waiting
  - routine not issued
  - no check-in for 48 hours
  - weekly report needed
  - consultation to convert
  - payment follow-up
- add one-click actions from each queue item

Acceptance:

- a coach can start the day from queue items instead of remembering every student

## Phase 6: Routine Studio

Status:

Implemented for MVP.

Goal:

Make routine creation easy and educational.

Tasks:

- create routine templates
- add life anchor field
- add expected minutes
- add due window
- add coach memo
- generate member-facing routine card
- generate Kakao copy text
- generate tokenized access link

Acceptance:

- a coach can create a life-fit routine in under one minute
- the member sees one calm routine card

## Phase 6.5: Project Gojo MVP

Status:

Implemented as Kakashi-native MVP with Obiwan signal harness.

Goal:

Stop requiring the owner or coach to manually think up every daily routine.

Gojo should recommend the next routine from Kakashi member state and SEE:SUN-approved routine templates.

MVP inputs:

- active enrollment
- practice life anchor
- recent routine completion
- missed-day count
- recent check-in condition
- latest coach feedback
- latest weekly report next focus
- representative song goal

MVP outputs:

- recommended routine template
- routine title
- member-facing memo
- expected minutes
- recommendation rationale
- automation mode

Automation modes:

- auto-publish low-risk routines
- draft normal routines for coach approval
- require coach decision for technical or sensitive routines

Acceptance:

- Kakashi can prepare a routine recommendation without the owner manually writing it each day
- the coach can see why Gojo recommended it
- the member still sees only one calm routine card
- no unapproved random AI coaching advice is shown to members

## Phase 6.6: Internal OS Contract

Status:

Implemented as the non-UI Kakashi/Gojo/Obiwan operating layer.

Goal:

Let Kakashi, Gojo, and Obiwan exchange compact operating signals without exposing complexity to members.

Implemented:

- Obiwan signal normalization
- `ObiwanVocalSignal`
- automatic Gojo recommendation creation from Session Coach payloads
- member-state operating packet
- coach recommendation decision endpoint
- `COACH_REQUIRED` publish guardrail
- dismissed recommendation publish guardrail
- internal OS regression script

Acceptance:

- Obiwan can send a compact signal into Kakashi
- Kakashi can store that signal against a paid member
- Gojo can create a recommendation from that signal
- a coach can accept, dismiss, or publish the recommendation
- members still see only the calm daily routine surface

## Phase 7: Reports And Proof

Goal:

Turn operating data into member retention and future marketing proof.

Tasks:

- weekly report generator
- practice count
- recordings sent
- feedback sent
- coach observed change
- next focus
- proof candidate tagging

Acceptance:

- owner can see which members are progressing
- member can feel continuity
- future testimonials have structured source material

## Server And Infrastructure

Recommended production stack:

- Vercel for web app and server routes
- Neon Postgres or current Postgres for database
- Vercel Blob for audio files
- NextAuth for login
- Vercel Cron for reminders and weekly report prompts
- Kakao link copy first, Kakao Alimtalk later

No dedicated physical server is needed for MVP.

## Web App Versus Mobile App

Start with mobile-first web app.

Reasons:

- login works
- microphone recording works in modern mobile browsers
- file upload works
- routine links work through Kakao
- deployment is fast
- iteration cost is low
- members can add it to home screen

Build a native mobile app only when:

- push notifications become central
- offline recording is needed
- native audio processing is needed
- Obiwan integration requires deeper native flow
- member volume justifies app-store distribution

## First Build Milestone

The first milestone should be:

`Consultation -> Active paid member -> Today's routine -> Recording -> Coach feedback`

This proves the business loop.

Everything else can follow.
