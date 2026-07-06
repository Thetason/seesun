type UnknownRecord = Record<string, unknown>;

export type NormalizedObiwanSignal = {
    schemaVersion: "seesun_obiwan_signal_v1";
    memberLookup: {
        userId?: string;
        email?: string;
    };
    dbSignal: {
        assignmentId?: string;
        externalSessionId?: string;
        sourceRecordingId?: string;
        summary?: string;
        pitchStability?: number;
        rhythmStability?: number;
        breathStability?: number;
        firstPhraseStability?: number;
        tensionLevel?: number;
        signalTags: string[];
        rawPayload: unknown;
    };
    operatingSignal: {
        sourceProject: "OBIWAN";
        targetProject: "GOJO";
        operatingProject: "KAKASHI";
        contractVersion: string;
        diagnosisId?: string;
        priorityPattern?: string;
        focusSec?: number;
        oneCause?: string;
        oneAction?: string;
        guideTool?: string;
        guideSyllable?: string;
        confidence?: number;
        beforeAfterOutcomeNeeded: boolean;
        signalReady: boolean;
        gojoTriggerTags: string[];
        riskLevel: "LOW" | "MEDIUM" | "HIGH";
        coachReviewRequired: boolean;
        privacy: {
            rawAudioIncluded: false;
            rawAudioStored: false;
            directContactIncluded: false;
        };
    };
};

const DIAGNOSIS_TAGS: Record<string, string[]> = {
    high_note_pressure: ["HIGH_NOTE_PRESSURE", "PRESSURE_RELEASE", "HIGH_RANGE"],
    pitch_center_unstable: ["PITCH_CENTER", "PITCH_CENTER_UNSTABLE", "CENTERING"],
    vowel_spread: ["VOWEL_CORE", "VOWEL_SPREAD", "RESONANCE"],
    phrase_end_collapse: ["PHRASE_END", "PHRASE_END_COLLAPSE", "ENDING"],
    breath_support_weak: ["BREATH", "BREATH_SUPPORT", "LOW_LOAD"],
    vibrato_unstable: ["VIBRATO", "CENTERING", "LOW_LOAD"],
    stable_but_needs_refinement: ["STABLE_REFINEMENT", "DAILY", "OBIWAN"],
};

export function normalizeObiwanSignalPayload(payload: unknown): NormalizedObiwanSignal {
    const body = isRecord(payload) ? payload : {};
    const founderModel = getRecord(body, "founderCoachingModel");
    const seeSunDataLoop = getRecord(founderModel, "seeSunDataLoop") || getRecord(body, "seeSunDataLoop");
    const diagnosis = getRecord(founderModel, "diagnosis");
    const prescription = getRecord(founderModel, "prescription");
    const drillPlan = getRecord(prescription, "drillPlan");
    const compareRead = getRecord(body, "compareRead");
    const sessionCloseout = getRecord(compareRead, "sessionCloseout") || getRecord(body, "sessionCloseout");
    const compactMetrics = getRecord(seeSunDataLoop, "compactMetrics") || getRecord(body, "compactMetrics");

    const diagnosisId = firstText(
        getText(seeSunDataLoop, "diagnosisId"),
        getText(diagnosis, "id"),
        getText(body, "diagnosisId"),
        getText(body, "label")
    );
    const priorityPattern = firstText(getText(seeSunDataLoop, "priorityPattern"), getText(body, "priorityPattern"));
    const oneCause = firstText(getText(seeSunDataLoop, "oneCause"), getText(diagnosis, "causeHypothesis"), getText(body, "oneCause"));
    const oneAction = firstText(
        getText(seeSunDataLoop, "oneAction"),
        getText(prescription, "oneMainCorrection"),
        getText(body, "oneAction")
    );
    const guideTool = firstText(getText(seeSunDataLoop, "guideTool"), getText(prescription, "primaryTool"), getText(body, "guideTool"));
    const guideSyllable = firstText(
        getText(seeSunDataLoop, "guideSyllable"),
        getText(prescription, "primarySyllable"),
        getText(drillPlan, "primarySyllable"),
        getText(body, "guideSyllable")
    );
    const focusSec = firstNumber(getNumber(seeSunDataLoop, "focusSec"), getNumber(body, "focusSec"));
    const confidence = firstNumber(getNumber(seeSunDataLoop, "confidence"), getNumber(body, "confidence"));
    const signalReady = firstBoolean(getBoolean(seeSunDataLoop, "signalReady"), getBoolean(body, "signalReady"), true);
    const beforeAfterOutcomeNeeded = firstBoolean(
        getBoolean(seeSunDataLoop, "beforeAfterOutcomeNeeded"),
        getBoolean(sessionCloseout, "beforeAfterOutcomeNeeded"),
        getBoolean(body, "beforeAfterOutcomeNeeded"),
        true
    );

    const directTags = [
        ...getStringArray(body.signalTags),
        ...getStringArray(seeSunDataLoop?.recommendedRoutineTags),
        ...getStringArray(sessionCloseout?.seeSunSignal && isRecord(sessionCloseout.seeSunSignal)
            ? sessionCloseout.seeSunSignal.recommendedRoutineTags
            : undefined),
        ...getStringArray(body.recommendedRoutineTags),
    ];
    const diagnosisTags = diagnosisId ? DIAGNOSIS_TAGS[diagnosisId] || [diagnosisId] : [];
    const gojoTriggerTags = normalizeTags(["OBIWAN", ...directTags, ...diagnosisTags, priorityPattern || ""]);

    const pitchStability = normalizeScore(
        firstNumber(getNumber(body, "pitchStability"), getNumber(compactMetrics, "pitchStabilityScore"))
    );
    const rhythmStability = normalizeScore(
        firstNumber(getNumber(body, "rhythmStability"), getNumber(compactMetrics, "onsetControlScore"), getNumber(compactMetrics, "dynamicControlScore"))
    );
    const breathStability = normalizeScore(
        firstNumber(getNumber(body, "breathStability"), getNumber(compactMetrics, "phraseEndingScore"), getNumber(compactMetrics, "dynamicControlScore"))
    );
    const firstPhraseStability = normalizeScore(
        firstNumber(getNumber(body, "firstPhraseStability"), getNumber(compactMetrics, "onsetControlScore"), pitchStability)
    );
    const tensionLevel = normalizeScore(
        firstNumber(getNumber(body, "tensionLevel"), getNumber(compactMetrics, "pressureRiskScore"), getNumber(compactMetrics, "pressurePitchCouplingScore"))
    );
    const riskLevel = resolveRiskLevel({
        diagnosisId,
        confidence,
        tensionLevel,
        signalReady,
        beforeAfterOutcomeNeeded,
    });

    const summary = firstText(
        getText(body, "summary"),
        diagnosisId && oneCause && oneAction ? `${diagnosisId}: ${oneCause} / ${oneAction}` : undefined,
        oneCause,
        priorityPattern
    );

    return {
        schemaVersion: "seesun_obiwan_signal_v1",
        memberLookup: {
            userId: getText(body, "userId"),
            email: getText(body, "email")?.toLowerCase(),
        },
        dbSignal: {
            assignmentId: getText(body, "assignmentId"),
            externalSessionId: firstText(getText(body, "externalSessionId"), getText(body, "analysisId"), getText(seeSunDataLoop, "analysisId")),
            sourceRecordingId: firstText(getText(body, "sourceRecordingId"), getText(body, "recordingExternalId")),
            summary,
            pitchStability,
            rhythmStability,
            breathStability,
            firstPhraseStability,
            tensionLevel,
            signalTags: gojoTriggerTags,
            rawPayload: payload,
        },
        operatingSignal: {
            sourceProject: "OBIWAN",
            targetProject: "GOJO",
            operatingProject: "KAKASHI",
            contractVersion: getText(body, "schemaVersion") || getText(seeSunDataLoop, "schemaVersion") || "obiwan_session_coach_signal",
            diagnosisId,
            priorityPattern,
            focusSec,
            oneCause,
            oneAction,
            guideTool,
            guideSyllable,
            confidence,
            beforeAfterOutcomeNeeded,
            signalReady,
            gojoTriggerTags,
            riskLevel,
            coachReviewRequired: riskLevel !== "LOW" || beforeAfterOutcomeNeeded,
            privacy: {
                rawAudioIncluded: false,
                rawAudioStored: false,
                directContactIncluded: false,
            },
        },
    };
}

function resolveRiskLevel({
    diagnosisId,
    confidence,
    tensionLevel,
    signalReady,
    beforeAfterOutcomeNeeded,
}: {
    diagnosisId?: string;
    confidence?: number;
    tensionLevel?: number;
    signalReady: boolean;
    beforeAfterOutcomeNeeded: boolean;
}): "LOW" | "MEDIUM" | "HIGH" {
    if (!signalReady) {
        return "HIGH";
    }
    if (diagnosisId === "high_note_pressure" || diagnosisId === "vowel_spread" || Number(tensionLevel ?? 0) >= 74) {
        return "HIGH";
    }
    if (beforeAfterOutcomeNeeded || Number(confidence ?? 0) < 0.68) {
        return "MEDIUM";
    }
    return "LOW";
}

export function normalizeTags(tags: Array<string | undefined | null>) {
    return Array.from(new Set(tags
        .map((tag) => `${tag || ""}`.trim())
        .filter(Boolean)
        .flatMap((tag) => [tag, tag.replace(/[-\s]+/g, "_")])
        .map((tag) => tag.toUpperCase())));
}

function isRecord(value: unknown): value is UnknownRecord {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getRecord(source: unknown, key: string) {
    if (!isRecord(source)) {
        return undefined;
    }
    const value = source[key];
    return isRecord(value) ? value : undefined;
}

function getText(source: unknown, key: string) {
    if (!isRecord(source)) {
        return undefined;
    }
    const value = source[key];
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed || undefined;
}

function getNumber(source: unknown, key: string) {
    if (!isRecord(source)) {
        return undefined;
    }
    const value = Number(source[key]);
    return Number.isFinite(value) ? value : undefined;
}

function getBoolean(source: unknown, key: string) {
    if (!isRecord(source)) {
        return undefined;
    }
    const value = source[key];
    return typeof value === "boolean" ? value : undefined;
}

function getStringArray(value: unknown) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function firstText(...values: Array<string | undefined>) {
    return values.find((value) => typeof value === "string" && value.trim().length > 0);
}

function firstNumber(...values: Array<number | undefined>) {
    return values.find((value) => typeof value === "number" && Number.isFinite(value));
}

function firstBoolean(...values: Array<boolean | undefined>) {
    const found = values.find((value) => typeof value === "boolean");
    return typeof found === "boolean" ? found : false;
}

function normalizeScore(value: number | undefined) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
}
