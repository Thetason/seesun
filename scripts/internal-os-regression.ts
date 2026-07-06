import assert from "node:assert/strict";
import { generateGojoRecommendation } from "../src/lib/gojo/recommendation-engine";
import { normalizeObiwanSignalPayload } from "../src/lib/internal-os/obiwan-signal-normalizer";

const now = new Date("2026-06-08T09:00:00.000Z");

const normalized = normalizeObiwanSignalPayload({
    userId: "member_001",
    analysisId: "obiwan_session_001",
    schemaVersion: "obiwan_session_coach_contract_v1",
    founderCoachingModel: {
        diagnosis: {
            id: "high_note_pressure",
            causeHypothesis: "높은 음 직전에 볼륨과 목 압력이 먼저 올라갑니다.",
        },
        prescription: {
            oneMainCorrection: "문제음 직전 두 음만 70% 볼륨으로 줄입니다.",
            primaryTool: "bbub",
            primarySyllable: "뻡",
        },
        seeSunDataLoop: {
            schemaVersion: "obiwan_vocal_signal_for_seesun_v1",
            signalReady: true,
            analysisId: "obiwan_session_001",
            diagnosisId: "high_note_pressure",
            priorityPattern: "pressure_pitch_coupling",
            confidence: 0.78,
            focusSec: 3.6,
            oneCause: "고음 직전 압력 상승",
            oneAction: "뻡으로 문제음 직전 두 음만 작게 지나가기",
            recommendedRoutineTags: ["pressure_release", "high_range", "70_percent_volume"],
            guideTool: "bbub",
            guideSyllable: "뻡",
            beforeAfterOutcomeNeeded: true,
            compactMetrics: {
                pitchStabilityScore: 62,
                phraseEndingScore: 74,
                onsetControlScore: 58,
                pressureRiskScore: 84,
            },
        },
    },
});

assert.equal(normalized.schemaVersion, "seesun_obiwan_signal_v1");
assert.equal(normalized.memberLookup.userId, "member_001");
assert.equal(normalized.dbSignal.externalSessionId, "obiwan_session_001");
assert.equal(normalized.dbSignal.tensionLevel, 84);
assert.equal(normalized.operatingSignal.riskLevel, "HIGH");
assert.equal(normalized.operatingSignal.coachReviewRequired, true);
assert.ok(normalized.dbSignal.signalTags.includes("HIGH_NOTE_PRESSURE"));
assert.ok(normalized.dbSignal.signalTags.includes("PRESSURE_RELEASE"));
assert.ok(normalized.dbSignal.signalTags.includes("OBIWAN"));

const recommendation = generateGojoRecommendation({
    now,
    routineTemplates: [],
    member: {
        id: "member_001",
        name: "서영빈",
        memberProfile: {
            primaryGoal: "후렴 고음을 편하게 부르기",
            practiceAnchor: "퇴근 후 7분",
            representativeSongs: "괜찮아 더 높이 날아가",
            painPoint: "고음 직전 목 압력",
        },
        enrollments: [{
            id: "enroll_001",
            status: "ACTIVE",
            programName: "Signature",
            primaryGoal: "고음 압력 낮추기",
            practiceAnchor: "퇴근 후 7분",
            representativeSongs: "괜찮아 더 높이 날아가",
            createdAt: now,
        }],
        dailyRoutines: [],
        checkIns: [],
        weeklyReports: [],
        assignments: [],
        obiwanSignals: [{
            id: "signal_001",
            summary: normalized.dbSignal.summary,
            pitchStability: normalized.dbSignal.pitchStability,
            rhythmStability: normalized.dbSignal.rhythmStability,
            breathStability: normalized.dbSignal.breathStability,
            firstPhraseStability: normalized.dbSignal.firstPhraseStability,
            tensionLevel: normalized.dbSignal.tensionLevel,
            signalTagsJson: JSON.stringify(normalized.dbSignal.signalTags),
            createdAt: now,
        }],
    },
});

assert.equal(recommendation.signals.trigger, "HIGH_NOTE_PRESSURE");
assert.equal(recommendation.signals.riskLevel, "HIGH");
assert.equal(recommendation.automationMode, "COACH_REQUIRED");
assert.equal(recommendation.routineLibraryId, "gojo_high_note_pressure_release");
assert.ok(recommendation.signals.sourceProjects.includes("OBIWAN"));
assert.ok(recommendation.rationale.includes("Obiwan"));

const legacySignal = normalizeObiwanSignalPayload({
    email: "member@example.com",
    externalSessionId: "legacy-session",
    pitchStability: 55,
    firstPhraseStability: 52,
    signalTags: ["first_phrase"],
    summary: "첫 소절 진입이 흔들립니다.",
});

assert.equal(legacySignal.memberLookup.email, "member@example.com");
assert.ok(legacySignal.dbSignal.signalTags.includes("FIRST_PHRASE"));
assert.equal(legacySignal.dbSignal.pitchStability, 55);

console.log("PASS internal-os-regression");
