# SEE:SUN App

SEE:SUN App is the paid-member coaching OS for SEE:SUN MUSIC.

Customer-facing name:

`SEE:SUN App`

Internal codename:

`Project Kakashi`

## Start Here

Read this first:

- `docs/current/00_START_HERE.md`

That document explains the product goal, project boundaries, current implementation state, remaining work, and verification commands.

## Product Goal

SEE:SUN App helps paid members install music practice into their real life with the least possible psychological friction.

The member should not feel:

`I have homework.`

The member should feel:

`My coach left one clear thing for me today.`

The core operating loop is:

`landing/diagnosis -> consultation -> paid member -> today's routine -> recording -> coach feedback -> weekly report -> next routine`

## Project Map

### Project Kakashi

This repository.

Kakashi handles:

- landing and diagnosis flow
- consultation records
- paid member conversion
- member login
- routine publication
- daily routine delivery
- recording submission
- coach feedback
- weekly reports
- contact logs
- lesson attendance and session count ledger
- member retention records

### Project Obiwan

Separate vocal training app.

Obiwan handles:

- AI vocal practice
- pitch/rhythm/breath/phrase analysis
- Session Coach signals
- voice-state training data

### Project Gojo

Routine Recommendation Engine inside Kakashi.

Gojo handles:

- Kakashi member state
- Obiwan signal ingestion
- SEE:SUN-approved routine matching
- recommendation rationale
- automation mode
- coach approval/dismissal/publishing flow

System flow:

`Kakashi member state + Obiwan vocal signals -> Gojo recommendation -> Kakashi routine publication`

## Source Of Truth Documents

Read in this order:

1. `docs/current/00_START_HERE.md`
2. `docs/current/2026-06-08_SEESUN_APP_PRODUCT_DOCTRINE.md`
3. `docs/current/2026-06-08_PROJECT_SYSTEM_ARCHITECTURE.md`
4. `docs/current/2026-06-08_INTERNAL_OS_CONTRACT.md`
5. `docs/current/2026-06-12_LESSON_ATTENDANCE_QR.md`
6. `docs/current/2026-06-12_LONGBLACK_STYLE_ROUTINE_DELIVERY.md`
7. `docs/current/2026-06-08_SEESUN_APP_SCREEN_BLUEPRINT.md`
8. `docs/current/2026-06-08_SEESUN_APP_IMPLEMENTATION_ROADMAP.md`
9. `AI_HANDOFF.md`

Marketing-site work has a separate brief:

- `MARKETING_REFACTOR_BRIEF.md`

## Current Implementation Highlights

- Member profile, enrollment, payment record, check-in, lesson note, lesson attendance, daily routine, delivery log, contact log, weekly report, and invite models
- Consultation-to-paid-member conversion
- Member invite/password setup flow
- Mobile-first member Today screen
- Coach dashboard member OS
- QR-based lesson attendance and automatic lesson count ledger
- LongBlack-style daily routine delivery cron
- Routine Studio and routine templates
- Browser recording and audio upload
- Gojo recommendation engine
- Obiwan signal ingestion harness
- Internal OS member-state and coach-decision APIs
- Internal OS regression test

## Development

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run the standard checks:

```bash
npm run lint
npm run build
```

Run the Kakashi/Gojo/Obiwan internal OS regression:

```bash
npm run internal-os:regression
```

Run all available verification:

```bash
npm run verify
```

## Production Notes

- Vercel hosts the web app and server routes.
- Neon/Postgres stores app data.
- Vercel Blob stores audio.
- NextAuth handles login.
- Obiwan integration requires `OBIWAN_INTEGRATION_SECRET` in production.
- Lesson QR tokens use `LESSON_QR_SECRET` when set, otherwise `NEXTAUTH_SECRET`.
- Routine delivery email uses the existing SMTP environment variables.
- Payment automation is not the current priority.

## Working Rule

Members should see one calm action.

The internal OS can be complex.

The member experience should not be.
