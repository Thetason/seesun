# SEE:SUN App Product Doctrine

Date: 2026-06-08
Status: Active direction
Scope: Product, UX, education model, and implementation boundaries for SEE:SUN App

## One-Line Definition

SEE:SUN App is the paid-member coaching OS for SEE:SUN MUSIC.

It is not a generic vocal practice app. It is the place where a paid member's lesson, life rhythm, daily voice routine, recordings, coach feedback, and weekly progress become visible and manageable.

Internal codename:

Project Kakashi.

Kakashi is the operating system for member management, coaching delivery, routine publication, records, and retention.

## North Star

Help adult members install music practice into their real life with the least possible psychological friction.

The member should not feel, "I have homework."

The member should feel, "My coach left one clear thing for me today, and I can do it in a few quiet minutes."

## Product Standard

Build as if Apple made a calm, premium operating system for a music academy and life-coaching studio.

That means:

- fewer visible choices
- high trust
- immediate clarity
- warm human language
- quiet luxury
- strong privacy reassurance
- a daily action that feels easy to start
- a coach workflow that never depends on memory alone

## The Core Loop

The SEE:SUN App loop is:

1. Lesson insight
2. Life-fit routine
3. Gentle daily check-in
4. Voice recording
5. Coach feedback
6. Weekly reflection
7. Next routine

This loop exists to protect the six days between lessons.

Traditional lesson flow:

`lesson -> student leaves -> practice disappears -> next lesson restarts`

SEE:SUN App flow:

`lesson -> today's routine -> recording -> coach touchpoint -> weekly report -> next lesson compounds`

## Routine Source And Selection Criteria

Routine content comes from the human SEE:SUN education system, not from a generic exercise library.

Current routine sources:

- first onboarding routine created during consultation-to-member conversion
- coach-issued routine from Routine Studio
- saved routine template, adjusted by the coach before sending
- Obiwan analysis signal, only as an input signal for Gojo/coach decision

The coach chooses the routine by looking at:

- consultation goal
- recent lesson note
- recent recording
- check-in condition
- practice life anchor
- next lesson focus
- member's psychological load this week

Member-facing rule:

The member should never see a menu of routines as the default experience.

The member sees one calm answer:

`Today, do this one thing.`

## Project Boundary

The SEE:SUN system has three internal projects.

### Project Kakashi

Kakashi is this web app.

It handles:

- landing-page leads
- consultation records
- paid member enrollment
- member login
- routine publication
- recording submission
- coach feedback
- weekly reports
- operating queues
- retention and proof records

Kakashi should not become the vocal analysis engine.

### Project Obiwan

Obiwan is the vocal training app.

It handles:

- AI vocal practice
- pitch and rhythm analysis
- phrase-level practice
- voice-state signals
- repeated vocal training workflows

Obiwan should not become the member management OS.

### Project Gojo

Gojo is the Routine Recommendation Engine.

It handles:

- member state snapshots
- SEE:SUN coaching rules
- routine trigger rules
- routine template matching
- recommendation rationale
- automatic draft generation
- automatic low-risk routine publication
- Obiwan signal interpretation

Gojo should not invent random routines. It should choose from SEE:SUN-approved routine patterns and explain why a routine was chosen.

The desired system flow is:

`Kakashi member state + SEE:SUN coaching rules + Obiwan vocal signals -> Gojo recommendation -> Kakashi routine publication`

## What We Are Building

SEE:SUN App is a paid-member experience with three audiences.

### Member

The member needs a calm mobile-first space that answers one question:

What should I do today?

The member experience centers on:

- today's routine
- expected time
- life anchor
- guide audio or video
- record button
- send to coach
- latest feedback
- next lesson focus

### Coach

The coach needs an operating queue, not just a list of students.

The coach experience centers on:

- routine not issued
- recording received
- feedback waiting
- no check-in for 48 hours
- lesson note needed
- weekly report needed
- payment or registration follow-up needed

### Owner

The owner needs to know whether the education system is actually operating.

The owner experience centers on:

- active paid members
- program status
- coach response quality
- routine completion
- feedback latency
- member risk
- revenue and enrollment status

## Relationship To Obiwan

Obiwan and SEE:SUN App must not become the same product.

Obiwan:

- AI vocal practice app
- real-time vocal training
- pitch and voice-state analysis
- phrase-specific coaching loop
- individual practice product

SEE:SUN App:

- paid-member coaching OS
- life-coaching education system
- routine delivery
- check-ins
- recording submission
- human coach feedback
- lesson notes
- weekly reports
- enrollment and member management

Current integration direction:

`SEE:SUN App routine -> practice in Obiwan -> analysis result returns to SEE:SUN App -> coach reviews member record`

Obiwan is the AI practice room.

SEE:SUN App is the coaching school, member record, and life rhythm system.

The Kakashi API already has an Obiwan signal ingest harness. The final Obiwan app still needs to send production Session Coach payloads into that contract.

## Educational Position

SEE:SUN App must take an educational and life-coaching approach.

The product should help a member attach practice to existing life moments:

- before work
- after work
- in the car
- after shower
- before sleep
- before a dinner or company gathering
- before the next lesson

The goal is not long practice.

The goal is repeated practice that survives real life.

## Language Rules

Use lower-pressure language.

Avoid:

- assignment
- evaluation
- failure
- score
- mission when it feels childish
- homework as the primary label

Prefer:

- today's routine
- voice record
- send to coach
- current state
- return routine
- quiet practice
- weekly reflection
- next focus

Examples:

- "오늘 과제를 제출하세요" -> "오늘의 목소리 기록을 코치에게 보내주세요"
- "녹음 업로드" -> "녹음 남기기"
- "미완료" -> "아직 기록 없음"
- "평가 대기" -> "코치 확인 전"
- "실패" -> "다시 시도 가능"

## Student UX Principles

1. One primary action per visit

The student home should not feel like a dashboard. It should feel like one quiet routine card.

2. Privacy is explicit

Representative and executive members need reassurance.

Use text like:

`이 녹음은 담당 코치만 확인합니다.`

3. Recording must feel safe

Before recording:

`완벽하게 부르지 않아도 됩니다. 현재 상태를 보는 짧은 기록입니다.`

After sending:

`잘 보냈습니다. 코치가 확인 후 다음 포인트를 남깁니다.`

4. Missed days need a return path

Never shame a member for missing practice.

Use:

`괜찮습니다. 오늘은 복귀 루틴만 하면 됩니다.`

5. The product should reduce decisions

Do not ask the member to choose among many lessons, files, or menus.

The coach chooses. The member acts.

## Coach UX Principles

1. The coach starts from today's queue

The first screen should answer:

Who needs me today?

2. Every member needs a next action

No active paid member should sit in the system without one of:

- routine scheduled
- routine open
- recording waiting
- feedback sent
- next lesson scheduled
- weekly report ready

3. Coach work should create member-visible value

Lesson notes, feedback, and weekly reports should not become private admin clutter. They should become the member's sense of being guided.

## Owner UX Principles

1. Member management is revenue protection

The owner needs to see who is paid, active, paused, at risk, completed, or likely to renew.

2. Coaching quality must be visible

Track:

- feedback wait time
- routine issue rate
- missed check-ins
- weekly report coverage
- member risk

3. The system must create proof

Progress records, voice submissions, and weekly summaries are future marketing proof, with consent.

## Design Direction

The UI should feel:

- quiet
- precise
- warm
- premium
- non-performative
- Korean-first
- mobile-first for members
- desktop-first for coach operations

Avoid:

- childish gamification
- busy dashboards
- oversized marketing hero sections inside the app
- decorative cards nested inside cards
- score-heavy practice-app patterns
- dark, intimidating admin surfaces for student use

Use:

- calm off-white backgrounds
- warm orange only for action and important state
- readable typography
- strong hierarchy
- compact operating queues
- clear empty states
- status labels that explain what happens next

## First Product Promise

When a paid member logs in, SEE:SUN App should make one thing obvious:

`오늘은 이것만 하면 됩니다.`

When a coach logs in, SEE:SUN App should make one thing obvious:

`오늘 내가 챙겨야 할 사람은 이 사람들입니다.`
