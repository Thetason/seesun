# SEE:SUN Internal OS Contract

Date: 2026-06-08
Status: Active implementation contract
Scope: Non-UI operating layer for Kakashi, Gojo, and Obiwan signal ingestion

## Purpose

The internal OS is the invisible layer behind SEE:SUN App.

It is not a UI design task. It is the operating contract that lets:

- Obiwan send compact vocal signals.
- Kakashi attach those signals to paid members.
- Gojo convert member state plus vocal signals into approved routine recommendations.
- Coaches approve, dismiss, or publish the recommendation.
- The system keep an audit trail without storing raw audio.

## Core Flow

`Obiwan Session Coach -> Kakashi signal ingest -> Gojo recommendation queue -> coach decision -> routine publication -> member practice -> future label/outcome`

## Implemented API Contracts

### `POST /api/integrations/obiwan/signals`

Receives both legacy Obiwan signal payloads and new Session Coach payloads.

Production authorization:

- `OBIWAN_INTEGRATION_SECRET`
- `x-obiwan-secret`
- or `Authorization: Bearer ...`

Request identity:

- `userId`
- or `email`

Behavior:

- normalizes the payload into `seesun_obiwan_signal_v1`
- stores `ObiwanVocalSignal`
- creates a `GojoRoutineRecommendation` by default
- writes a `ContactLog` audit note
- returns an `operatingPacket`

Use `?recommend=0` to store the signal only.

### `GET /api/admin/internal-os/member-state?userId=...`

Coach-only endpoint that returns a bounded operating packet:

- member profile
- enrollments
- recent routines
- recent check-ins
- weekly reports
- recent Obiwan signals
- recent Gojo recommendations
- contact logs
- next operating action

### `POST /api/admin/internal-os/recommendations/[recommendationId]/decision`

Coach-only decision endpoint.

Body:

```json
{
  "decision": "accept",
  "note": "Optional coach note"
}
```

Allowed decisions:

- `accept` -> status `ACCEPTED`
- `dismiss` -> status `DISMISSED`

The existing publish route remains:

`POST /api/admin/gojo/recommendations/[recommendationId]/publish`

Guardrail:

- `COACH_REQUIRED` recommendations cannot be published until accepted.
- dismissed recommendations cannot be published.

## Obiwan Signal Normalization

Implemented in:

`src/lib/internal-os/obiwan-signal-normalizer.ts`

The normalizer extracts:

- member lookup
- external session id
- diagnosis id
- priority pattern
- focus second
- one cause
- one action
- guide tool/syllable
- confidence
- compact metrics
- recommended routine tags
- risk level
- coach-review requirement
- privacy flags

It maps Founder Coaching Model diagnoses into Gojo tags:

- `high_note_pressure` -> `HIGH_NOTE_PRESSURE`, `PRESSURE_RELEASE`, `HIGH_RANGE`
- `pitch_center_unstable` -> `PITCH_CENTER`, `CENTERING`
- `vowel_spread` -> `VOWEL_CORE`, `RESONANCE`
- `phrase_end_collapse` -> `PHRASE_END`, `ENDING`
- `breath_support_weak` -> `BREATH`, `LOW_LOAD`
- `vibrato_unstable` -> `VIBRATO`, `CENTERING`
- `stable_but_needs_refinement` -> `STABLE_REFINEMENT`, `DAILY`

## Gojo Routine Rules

Gojo now understands Obiwan Session Coach tags.

High-risk technical recommendations, such as high-note pressure and vowel spread, become `COACH_REQUIRED`.

Lower-risk routine continuity recommendations can remain `AUTO_PUBLISH` or `COACH_APPROVAL`.

Approved Obiwan-aware routine templates now include:

- high-note pressure release
- pitch center lock
- vowel core lock
- phrase end hold

## Verification

Run:

`npm run internal-os:regression`

It verifies:

- Session Coach payloads normalize into the Kakashi OS contract.
- high-note pressure signals become high-risk, coach-required Gojo input.
- Gojo selects the approved pressure-release routine.
- legacy first-phrase payloads still normalize correctly.

## Non-UI Rule

UI designers can build any surface on top of this, but the UI must not change the operating contract.

The user-facing UI should show one calm action.

The internal OS keeps the complexity.
