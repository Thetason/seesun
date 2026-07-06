import type { RoutineAutomationMode } from "@prisma/client";
import { GOJO_APPROVED_ROUTINE_LIBRARY, type ApprovedRoutineTemplate } from "./routine-library";

type DateLike = Date | string | null | undefined;

type EnrollmentLike = {
    id: string;
    status: string;
    programName?: string | null;
    primaryGoal?: string | null;
    practiceAnchor?: string | null;
    representativeSongs?: string | null;
    createdAt?: DateLike;
};

type MemberProfileLike = {
    primaryGoal?: string | null;
    practiceAnchor?: string | null;
    representativeSongs?: string | null;
    painPoint?: string | null;
};

type DailyRoutineLike = {
    id: string;
    title: string;
    status: string;
    completedAt?: DateLike;
    createdAt?: DateLike;
    updatedAt?: DateLike;
};

type CheckInLike = {
    id: string;
    condition: string;
    practicedToday: boolean;
    memo?: string | null;
    createdAt: DateLike;
};

type WeeklyReportLike = {
    id: string;
    summaryTitle: string;
    nextFocus?: string | null;
    createdAt?: DateLike;
    weekStart?: DateLike;
};

type AssignmentLike = {
    id: string;
    audioFileUrl?: string | null;
    isCompleted: boolean;
    updatedAt?: DateLike;
    createdAt?: DateLike;
};

type ObiwanSignalLike = {
    id: string;
    summary?: string | null;
    pitchStability?: number | null;
    rhythmStability?: number | null;
    breathStability?: number | null;
    firstPhraseStability?: number | null;
    tensionLevel?: number | null;
    signalTagsJson?: string | null;
    createdAt?: DateLike;
};

export type RoutineTemplateLike = {
    id: string;
    title: string;
    description?: string | null;
    focus?: string | null;
    expectedMinutes?: number | null;
    category?: string | null;
    tagsJson?: string | null;
    automationMode?: RoutineAutomationMode | string | null;
    guidePresetKey?: string | null;
};

export type GojoMemberInput = {
    id: string;
    name?: string | null;
    memberProfile?: MemberProfileLike | null;
    enrollments?: EnrollmentLike[];
    dailyRoutines?: DailyRoutineLike[];
    checkIns?: CheckInLike[];
    weeklyReports?: WeeklyReportLike[];
    assignments?: AssignmentLike[];
    obiwanSignals?: ObiwanSignalLike[];
};

export type GojoRecommendationResult = {
    routineTemplateId: string | null;
    routineLibraryId: string;
    title: string;
    focus: string;
    memberMemo: string;
    expectedMinutes: number;
    lifeAnchor: string | null;
    automationMode: RoutineAutomationMode;
    rationale: string;
    signals: {
        sourceProjects: string[];
        trigger: string;
        labels: string[];
        riskLevel: "LOW" | "MEDIUM" | "HIGH";
        obiwanSignalId?: string;
    };
    sourceSnapshot: Record<string, unknown>;
};

function parseDate(value: DateLike) {
    if (!value) {
        return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysSince(value: DateLike, now: Date) {
    const parsed = parseDate(value);

    if (!parsed) {
        return null;
    }

    return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / (24 * 60 * 60 * 1000)));
}

function parseStringArrayJson(value: string | null | undefined) {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === "string")
            : [];
    } catch {
        return [];
    }
}

function normalizeTags(tags: string[]) {
    return new Set(tags.map((tag) => tag.trim().toUpperCase()).filter(Boolean));
}

function hasAnyTag(tags: Set<string>, candidates: string[]) {
    return candidates.some((candidate) => tags.has(candidate.toUpperCase()));
}

function getActiveEnrollment(member: GojoMemberInput) {
    return (
        member.enrollments?.find((enrollment) => enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT") ||
        member.enrollments?.[0] ||
        null
    );
}

function getMostRecentActivityDate(member: GojoMemberInput) {
    const activityDates = [
        ...(member.checkIns || []).map((checkIn) => checkIn.createdAt),
        ...(member.dailyRoutines || []).map((routine) => routine.completedAt || routine.updatedAt || routine.createdAt),
        ...(member.assignments || []).map((assignment) => assignment.updatedAt || assignment.createdAt),
    ]
        .map(parseDate)
        .filter((date): date is Date => Boolean(date))
        .sort((left, right) => right.getTime() - left.getTime());

    return activityDates[0] || null;
}

function getCompletionStreak(member: GojoMemberInput) {
    const recentRoutines = [...(member.dailyRoutines || [])]
        .sort((left, right) => {
            const leftTime = parseDate(left.completedAt || left.updatedAt || left.createdAt)?.getTime() || 0;
            const rightTime = parseDate(right.completedAt || right.updatedAt || right.createdAt)?.getTime() || 0;
            return rightTime - leftTime;
        })
        .slice(0, 5);

    let streak = 0;

    for (const routine of recentRoutines) {
        if (routine.status === "COMPLETED") {
            streak += 1;
            continue;
        }

        break;
    }

    return streak;
}

function hasRecentRecording(member: GojoMemberInput, now: Date) {
    return (member.assignments || []).some((assignment) => {
        if (!assignment.audioFileUrl) {
            return false;
        }

        const age = daysSince(assignment.updatedAt || assignment.createdAt, now);
        return age !== null && age <= 14;
    });
}

function selectApprovedRoutine(
    preferredTags: string[],
    routineTemplates: RoutineTemplateLike[] = []
): { source: ApprovedRoutineTemplate; routineTemplateId: string | null } {
    const preferred = normalizeTags(preferredTags);

    const scoredSavedTemplates = routineTemplates
        .map((template) => {
            const tags = normalizeTags([
                ...parseStringArrayJson(template.tagsJson),
                template.category || "",
                template.focus || "",
                template.title || "",
            ]);
            const score = Array.from(preferred).reduce((sum, tag) => sum + (tags.has(tag) ? 1 : 0), 0);

            return { template, score };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score);

    if (scoredSavedTemplates[0]) {
        const template = scoredSavedTemplates[0].template;
        return {
            routineTemplateId: template.id,
            source: {
                id: `saved:${template.id}`,
                title: template.title,
                focus: template.focus || template.category || template.title,
                description: template.description || template.focus || template.title,
                expectedMinutes: template.expectedMinutes || 7,
                category: template.category || "Saved",
                tags: parseStringArrayJson(template.tagsJson),
                automationMode: (template.automationMode as RoutineAutomationMode) || "COACH_APPROVAL",
                memberMemo: template.description || template.focus || "코치가 저장해둔 루틴을 오늘 상황에 맞게 적용합니다.",
            },
        };
    }

    const scoredLibrary = GOJO_APPROVED_ROUTINE_LIBRARY
        .map((template) => {
            const tags = normalizeTags(template.tags);
            const score = Array.from(preferred).reduce((sum, tag) => sum + (tags.has(tag) ? 1 : 0), 0);
            return { template, score };
        })
        .sort((left, right) => right.score - left.score);

    return {
        routineTemplateId: null,
        source: scoredLibrary[0]?.template || GOJO_APPROVED_ROUTINE_LIBRARY[0],
    };
}

export function generateGojoRecommendation({
    member,
    routineTemplates = [],
    now = new Date(),
}: {
    member: GojoMemberInput;
    routineTemplates?: RoutineTemplateLike[];
    now?: Date;
}): GojoRecommendationResult {
    const activeEnrollment = getActiveEnrollment(member);
    const latestCheckIn = member.checkIns?.[0] || null;
    const latestWeeklyReport = member.weeklyReports?.[0] || null;
    const latestObiwanSignal = member.obiwanSignals?.[0] || null;
    const recentActivityDate = getMostRecentActivityDate(member);
    const missedDayCount = recentActivityDate ? daysSince(recentActivityDate, now) || 0 : 7;
    const completionStreak = getCompletionStreak(member);
    const representativeSongs = activeEnrollment?.representativeSongs || member.memberProfile?.representativeSongs || "";
    const primaryGoal = activeEnrollment?.primaryGoal || member.memberProfile?.primaryGoal || "";
    const lifeAnchor = activeEnrollment?.practiceAnchor || member.memberProfile?.practiceAnchor || null;
    const hasRepresentativeSongGoal = Boolean(representativeSongs.trim() || /대표곡|회식|모임|노래방|행사/.test(primaryGoal));
    const hasRecording = hasRecentRecording(member, now);

    const sourceProjects = new Set(["KAKASHI"]);
    const labels: string[] = [];
    let trigger = "DAILY";
    let preferredTags = ["DAILY", "LESSON_NOTE"];
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";

    if (latestObiwanSignal) {
        sourceProjects.add("OBIWAN");
        const signalTags = normalizeTags(parseStringArrayJson(latestObiwanSignal.signalTagsJson));
        labels.push("Obiwan 보컬 신호 반영");

        if (hasAnyTag(signalTags, ["HIGH_NOTE_PRESSURE", "PRESSURE_RELEASE", "HIGH_RANGE"]) || (latestObiwanSignal.tensionLevel ?? 0) >= 76) {
            trigger = "HIGH_NOTE_PRESSURE";
            preferredTags = ["HIGH_NOTE_PRESSURE", "PRESSURE_RELEASE", "HIGH_RANGE", "OBIWAN"];
            riskLevel = "HIGH";
            labels.push("고음 직전 압력 신호");
        } else if (hasAnyTag(signalTags, ["VOWEL_CORE", "VOWEL_SPREAD", "RESONANCE"])) {
            trigger = "VOWEL_CORE";
            preferredTags = ["VOWEL_CORE", "VOWEL_SPREAD", "RESONANCE", "OBIWAN"];
            riskLevel = "HIGH";
            labels.push("모음/공명 중심 신호");
        } else if (hasAnyTag(signalTags, ["PITCH_CENTER", "PITCH_CENTER_UNSTABLE", "CENTERING"]) || (latestObiwanSignal.pitchStability ?? 100) < 62) {
            trigger = "PITCH_CENTER";
            preferredTags = ["PITCH_CENTER", "PITCH_CENTER_UNSTABLE", "CENTERING", "OBIWAN"];
            labels.push("피치 중심 안정 필요");
        } else if (hasAnyTag(signalTags, ["PHRASE_END", "PHRASE_END_COLLAPSE", "ENDING"])) {
            trigger = "PHRASE_END";
            preferredTags = ["PHRASE_END", "PHRASE_END_COLLAPSE", "ENDING", "OBIWAN"];
            labels.push("프레이즈 끝 유지 필요");
        } else if ((latestObiwanSignal.firstPhraseStability ?? 100) < 60 || hasAnyTag(signalTags, ["FIRST_PHRASE"])) {
            trigger = "FIRST_PHRASE";
            preferredTags = ["FIRST_PHRASE", "BREATH", "OBIWAN"];
            labels.push("첫 소절 진입 안정 필요");
        } else if ((latestObiwanSignal.breathStability ?? 100) < 60 || hasAnyTag(signalTags, ["BREATH", "BREATH_SUPPORT", "LOW_LOAD"])) {
            trigger = "BREATH";
            preferredTags = ["BREATH", "TENSION", "OBIWAN"];
            labels.push("호흡/긴장 신호 확인");
        }
    }

    if (trigger === "DAILY" && missedDayCount >= 3) {
        trigger = "MISSED_DAYS";
        preferredTags = ["RETURN", "MISSED_DAYS", "LOW_LOAD"];
        riskLevel = "LOW";
        labels.push(`${missedDayCount}일 이상 기록 공백`);
    } else if (trigger === "DAILY" && (latestCheckIn?.condition === "TIRED" || latestCheckIn?.condition === "REST_NEEDED")) {
        trigger = "LOW_LOAD";
        preferredTags = ["TIRED", "REST_NEEDED", "LOW_LOAD"];
        riskLevel = "LOW";
        labels.push(`최근 체크인: ${latestCheckIn.condition}`);
    } else if (trigger === "DAILY" && hasRepresentativeSongGoal && !hasRecording) {
        trigger = "NO_RECORDING";
        preferredTags = ["REPRESENTATIVE_SONG", "NO_RECORDING", "BASELINE"];
        labels.push("대표곡 목표는 있으나 최근 녹음 없음");
    } else if (trigger === "DAILY" && latestWeeklyReport?.nextFocus) {
        trigger = "NEXT_FOCUS";
        preferredTags = /호흡|숨|긴장/.test(latestWeeklyReport.nextFocus)
            ? ["BREATH", "NEXT_FOCUS"]
            : ["LESSON_NOTE", "NEXT_FOCUS"];
        labels.push("최근 주간 리포트 next focus 반영");
    } else if (trigger === "DAILY" && completionStreak >= 3) {
        trigger = "STREAK";
        preferredTags = ["STREAK", "EXPANSION", "DAILY"];
        labels.push(`${completionStreak}회 연속 완료 흐름`);
    }

    if (labels.length === 0) {
        labels.push("기본 데일리 루틴 유지");
    }

    const selected = selectApprovedRoutine(preferredTags, routineTemplates);
    const automationMode = riskLevel === "LOW" ? "AUTO_PUBLISH" : selected.source.automationMode;
    const memberName = member.name || "회원";
    const rationale = [
        `${memberName}님의 현재 상태는 ${trigger} 기준에 가깝습니다.`,
        `사용 신호: ${labels.join(", ")}.`,
        lifeAnchor ? `생활 앵커 "${lifeAnchor}"에 붙일 수 있는 저항 낮은 루틴으로 추천했습니다.` : "생활 앵커가 아직 약해, 짧고 시작하기 쉬운 루틴을 우선 추천했습니다.",
        latestObiwanSignal?.summary ? `Obiwan 요약: ${latestObiwanSignal.summary}` : null,
    ]
        .filter(Boolean)
        .join(" ");

    return {
        routineTemplateId: selected.routineTemplateId,
        routineLibraryId: selected.source.id,
        title: selected.source.title,
        focus: selected.source.focus,
        memberMemo: selected.source.memberMemo,
        expectedMinutes: selected.source.expectedMinutes,
        lifeAnchor,
        automationMode,
        rationale,
        signals: {
            sourceProjects: Array.from(sourceProjects),
            trigger,
            labels,
            riskLevel,
            obiwanSignalId: latestObiwanSignal?.id,
        },
        sourceSnapshot: {
            generatedAt: now.toISOString(),
            activeEnrollmentId: activeEnrollment?.id || null,
            programName: activeEnrollment?.programName || null,
            practiceAnchor: lifeAnchor,
            latestCheckInCondition: latestCheckIn?.condition || null,
            latestCheckInAt: latestCheckIn?.createdAt || null,
            missedDayCount,
            completionStreak,
            hasRepresentativeSongGoal,
            hasRecentRecording: hasRecording,
            latestWeeklyNextFocus: latestWeeklyReport?.nextFocus || null,
            latestObiwanSignalId: latestObiwanSignal?.id || null,
        },
    };
}
