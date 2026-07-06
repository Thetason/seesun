# SEE:SUN Project System Architecture

Date: 2026-06-08
Status: Active architecture direction
Scope: Internal project boundaries for Kakashi, Obiwan, and Gojo

## One-Line System

Kakashi operates the member relationship, Obiwan trains and analyzes the voice, and Gojo decides which SEE:SUN routine should happen next.

## Project Kakashi

Customer-facing name:

SEE:SUN App

Role:

Member management and coaching operations web app.

Kakashi owns:

- lead and consultation records
- paid member enrollment
- member profile
- member login
- routine publication
- recording submission
- check-ins
- coach feedback
- weekly reports
- contact logs
- operating queues
- retention and proof records

Kakashi should answer:

- Who is this member?
- What program are they in?
- What should they see today?
- Did they record?
- Did the coach respond?
- Is the member drifting?

Kakashi should not decide vocal technique from raw sound by itself.

## Project Obiwan

Role:

Vocal training and vocal signal analysis app.

Obiwan owns:

- AI vocal practice experience
- pitch stability analysis
- rhythm stability analysis
- phrase-level repetition
- voice-state signals
- vocal training feedback
- deeper audio workflows

Obiwan should answer:

- What happened in the member's sound?
- Which phrase was unstable?
- Was pitch, rhythm, breath, or entry the main issue?
- Did repeated practice improve the signal?

Obiwan should not manage paid membership, weekly coaching operations, or academy retention.

## Project Gojo

Role:

Routine Recommendation Engine.

Gojo owns:

- SEE:SUN coaching rulebook
- routine template tagging
- member state snapshots
- trigger rules
- recommendation scoring
- recommendation rationale
- automatic routine drafts
- low-risk automatic routine publication
- future interpretation of Obiwan signals

Gojo should answer:

- What state is this member in today?
- What kind of routine is appropriate?
- Which approved routine template best matches that state?
- Should this be auto-published or coach-approved?
- Why was this routine selected?

Gojo should not create uncontrolled, unapproved coaching advice.

## Data Flow

Current MVP flow:

`Kakashi member state -> Gojo rules -> Kakashi routine draft/publication`

Future vocal-intelligence flow:

`Kakashi member state + Obiwan vocal signals -> Gojo recommendation -> Kakashi routine publication`

Member-facing flow:

`Kakashi shows one calm routine card`

Coach-facing flow:

`Kakashi shows Gojo's recommendation reason and lets the coach approve, edit, or auto-send`

## Recommendation Inputs

Gojo should use:

- consultation goal
- program type
- representative song goal
- practice life anchor
- recent routine completion
- recent check-in condition
- missed-day count
- latest coach feedback
- latest weekly report next focus
- recent recording availability
- Obiwan vocal analysis signals

## Recommendation Outputs

Gojo should return:

- selected routine template id
- routine title
- member-facing coach memo
- expected minutes
- life anchor suggestion
- risk level
- automation mode
- rationale
- signals used

Automation mode:

- `AUTO_PUBLISH`: safe, low-risk routines such as return routines and check-in routines
- `COACH_APPROVAL`: normal coaching recommendations
- `COACH_REQUIRED`: sensitive, technical, or high-pressure cases

## First Gojo MVP

The first Gojo MVP can operate without live Obiwan.

It should start with Kakashi data only:

- missed-day count
- check-in condition
- active program
- practice life anchor
- recent routine status
- latest coach feedback
- next lesson focus

First rule examples:

- missed 3 days -> return routine
- tired check-in -> low-load routine
- lesson just completed -> lesson-point lock-in routine
- representative song goal but no recent recording -> first-phrase recording routine
- high completion streak -> 7-minute expansion routine

Implemented Kakashi harness:

- `GojoRoutineRecommendation` stores recommendation, rationale, source snapshot, automation mode, and publication links.
- `ObiwanVocalSignal` stores Obiwan analysis signals for a member.
- `POST /api/admin/gojo/recommendations` generates a Gojo recommendation for a member.
- `POST /api/admin/gojo/recommendations/[recommendationId]/publish` publishes a recommendation into Kakashi as today's routine.
- `POST /api/integrations/obiwan/signals` receives Obiwan vocal signals, normalizes Session Coach payloads, stores `ObiwanVocalSignal`, and creates a Gojo recommendation queue item by default. Production requires `OBIWAN_INTEGRATION_SECRET`.
- `GET /api/admin/internal-os/member-state?userId=...` returns the bounded Kakashi/Gojo/Obiwan operating packet for a member.
- `POST /api/admin/internal-os/recommendations/[recommendationId]/decision` lets a coach accept or dismiss a Gojo recommendation before publication.
- Coach dashboard shows Project Gojo recommendation, source signals, rationale, Routine Studio handoff, and direct publication.

Current internal OS contract:

- `docs/current/2026-06-08_INTERNAL_OS_CONTRACT.md`

## Product Rule

Members should not see recommendation complexity.

Members only see:

`Today, do this one thing.`

Coaches and owners can see:

`Why this routine was chosen.`
