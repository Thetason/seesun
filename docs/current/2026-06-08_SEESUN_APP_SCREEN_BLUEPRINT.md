# SEE:SUN App Screen Blueprint

Date: 2026-06-08
Status: Active blueprint
Scope: First-pass product screens for the paid-member coaching OS

## App Information Architecture

The product has three role-based surfaces.

### Member

- Today
- Feedback
- Records
- My Program

### Coach

- Today Queue
- Members
- Routine Studio
- Feedback Inbox
- Reports
- Consultations

### Owner

- Overview
- Enrollments
- Revenue State
- Coach Quality
- Member Risk
- Proof Archive

## Member Home: Today

Purpose:

Make the member start today's practice with almost no thought.

Primary question:

What should I do today?

Required sections:

1. Greeting
2. Today's routine card
3. Life anchor
4. Recording action
5. Coach reassurance
6. Latest feedback
7. Next lesson focus

Mobile default:

The first mobile screen must not feel like a dashboard.

Visible by default:

- greeting
- today's routine title
- why this routine was chosen in one short sentence
- life anchor
- privacy reassurance
- record/send action
- optional check-in

Collapsed by default:

- weekly report
- recent check-ins
- routine board
- lesson memo history
- long-term curriculum timeline
- free practice uploads

### Layout

Top:

- `SEE:SUN App`
- member name
- current program and week

Main card:

- routine label: `오늘의 7분 목소리 루틴`
- focus: `첫 소절 전 호흡 안정`
- time: `약 7분`
- life anchor: `퇴근 후 차 안에서`
- due state: `오늘 밤 11:00까지`

Routine steps:

1. `30초 조용한 호흡`
2. `허밍 3회`
3. `대표곡 첫 소절 녹음`

Actions:

- primary: `편하게 녹음 시작`
- secondary: `가이드 듣기`
- tertiary: `오늘은 파일로 보내기`

Reassurance:

`완벽하게 부르지 않아도 됩니다. 현재 상태를 보는 짧은 기록입니다.`

Privacy:

`이 녹음은 담당 코치만 확인합니다.`

After completion:

- `오늘의 목소리 기록이 남았습니다.`
- `코치가 확인 후 다음 포인트를 남깁니다.`
- show submitted audio player

## Member Feedback

Purpose:

Show that coaching is active and personal.

Sections:

- latest coach comment
- submitted recording
- one next focus
- one avoid point
- next recommended routine

Tone:

Coach-like and low pressure.

Example:

`오늘은 음정 자체보다 첫 호흡이 빨리 짧아지는 지점이 보였습니다. 다음 루틴에서는 첫 소절 전 2초만 더 기다려보겠습니다.`

## Member Records

Purpose:

Make progress visible without turning it into a score app.

Sections:

- weekly practice count
- recordings sent
- coach feedback received
- current representative songs
- recent wins
- gentle trend

Avoid:

- big numeric score
- public ranking
- shame-based streak language

Prefer:

- `이번 주 3번 기록했습니다`
- `첫 소절 안정 루틴이 이어지고 있습니다`
- `대표곡 1번은 다음 레슨에서 이어갑니다`

## Member Program

Purpose:

Make paid membership feel structured.

Sections:

- program name
- current week
- start date
- target end date
- coach
- primary goal
- representative songs
- upcoming lesson
- payment status label when appropriate

## Coach Home: Today Queue

Purpose:

Turn member management into an operating system.

Primary question:

Who needs me today?

Queue groups:

1. Recording arrived
2. Feedback waiting
3. Routine not issued
4. No check-in for 48 hours
5. Weekly report needed
6. Consultation to convert
7. Payment or enrollment follow-up

Each queue item:

- member name
- program/week
- last activity
- reason
- one action button

Example:

`김대표님 · Highend15 Week 03`

`어제 22:41 녹음 제출 · 피드백 대기`

Action:

`피드백 남기기`

## Coach Member Detail

Purpose:

Give the coach everything needed to guide the member without digging through Kakao or memory.

Header:

- name
- program
- status
- week
- coach
- next lesson

Action strip:

- create routine
- write feedback
- add lesson note
- create weekly report
- copy routine link
- log contact

Main columns:

Left:

- timeline
- recordings
- feedback
- lesson notes

Right:

- member profile
- practice life anchor
- pain point
- representative songs
- payment/enrollment state
- risk flags

Timeline events:

- consultation created
- paid member converted
- enrollment started
- routine issued
- recording submitted
- feedback sent
- lesson note added
- weekly report generated
- contact logged

## Routine Studio

Purpose:

Help the coach create a routine that fits the member's life.

Inputs:

- member
- routine type
- expected time
- life anchor
- focus
- steps
- guide asset
- due window
- coach memo

Routine templates:

- 3-minute return routine
- 7-minute daily routine
- 10-minute representative song routine
- before-gathering emergency routine
- post-lesson stabilizing routine

Output:

- member app card
- Kakao copy text
- access link
- scheduled availability

## Consultation To Paid Member

Purpose:

Close the gap between sales and operations.

The consultation detail screen needs a button:

`유료회원으로 전환`

Conversion form:

- program
- start date
- expected end date
- coach
- payment state
- initial goal
- practice life anchor
- representative song target
- first routine template

On submit:

- create or link user
- create student profile
- create enrollment
- copy consultation notes into member profile
- assign track
- issue first onboarding routine
- mark consultation as completed

## Owner Overview

Purpose:

Show whether the academy is actually operating well.

Metrics:

- active paid members
- pending consultations
- enrollments starting this week
- feedback waiting
- average feedback latency
- no-check-in members
- weekly report coverage
- upcoming renewals

Tables:

- member risk
- coach quality
- enrollment status
- proof candidates

## Mobile Rules

Member screens are mobile-first.

Rules:

- one primary action
- large tap targets
- no dense tables
- no multiple competing cards above the fold
- important text must not require zooming
- recording controls must be easy to reach with one thumb

## Desktop Rules

Coach and owner screens are desktop-first.

Rules:

- dense but calm
- queues before charts
- member detail without modal hunting
- filters and status tags
- fast action buttons
- avoid marketing-style hero blocks
