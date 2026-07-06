"use client";

import type { Prisma, Consultation } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAssignmentAvailabilityState, getMissionPossibleWindowForDate } from "@/lib/assignment-window";
import { buildAssignmentAudioUrl } from "@/lib/blob-audio";
import { isMissionPossibleTrackId } from "@/lib/mission-possible";
import ScaleGuideButton from "@/components/ScaleGuideButton";
import {
    DEFAULT_SCALE_GUIDE_PRESET_KEY,
    SCALE_GUIDE_PRESETS,
    getAssignmentScaleGuidePattern,
    getScaleGuidePresetPreview,
} from "@/lib/scale-guide";
import { formatAnalyticsDuration, type SiteAnalyticsSummary } from "@/lib/site-analytics";

type CoachDashboardData = (Prisma.UserGetPayload<{
    include: {
        _count: {
            select: {
                lessonAttendances: true;
            };
        };
        track: true;
        memberProfile: true;
        enrollments: {
            include: {
                _count: {
                    select: {
                        lessonAttendances: true;
                    };
                };
                track: true;
                paymentRecords: true;
                lessonAttendances: true;
            };
        };
        lessonAttendances: true;
        dailyRoutines: {
            include: {
                assignment: {
                    include: { feedbacks: true };
                };
                checkIns: true;
                deliveryLogs: true;
            };
        };
        checkIns: true;
        contactLogs: true;
        memberInvites: true;
        weeklyReports: true;
        gojoRecommendations: true;
        obiwanSignals: true;
        assignments: {
            include: { feedbacks: true };
        };
    };
}>)[];

type RoutineTemplateItem = {
    id: string;
    title: string;
    description: string | null;
    focus: string | null;
    expectedMinutes: number | null;
    stepsJson: string | null;
    guidePresetKey: string | null;
    category: string | null;
    tagsJson: string | null;
    automationMode: string;
    sourceProject: string | null;
    isActive: boolean;
    createdByUserId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};

type GojoRecommendationItem = CoachDashboardData[number]["gojoRecommendations"][number];

type LessonQrState = {
    dateKey: string;
    checkInUrl: string;
    qrDataUrl: string;
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

type MissionPossibleDashboardItem = {
    id: string;
    title: string;
    isCompleted: boolean;
    windowLabel: string | null;
    releaseDateKey: string | null;
    availableFrom?: Date | string | null;
    availableUntil?: Date | string | null;
    createdAt: Date | string;
    studentId: string;
    studentName: string;
    trackName: string;
    hasScaleGuide: boolean;
};

type MissionDraft = {
    title: string;
    description: string;
    weekNumber: string;
    guidePresetKey: string;
};

type ConversionDraft = {
    name: string;
    email: string;
    initialPassword: string;
    trackId: string;
    programName: string;
    paymentStatus: string;
    primaryGoal: string;
    practiceAnchor: string;
    representativeSongs: string;
};

type ContactLogDraft = {
    channel: string;
    summary: string;
    nextAction: string;
};

type WeeklyReportDraft = {
    summaryTitle: string;
    summaryBody: string;
    nextFocus: string;
};

type PaymentDraft = {
    amountKrw: string;
    status: string;
    dueDate: string;
    paidAt: string;
    note: string;
};

type SparkMissionDraft = MissionDraft & {
    id: string;
};

type WeeklyMissionDraft = MissionDraft & {
    dateKey: string;
};

const EMPTY_MISSION_DRAFT: MissionDraft = {
    title: "",
    description: "",
    weekNumber: "",
    guidePresetKey: "",
};

const DEFAULT_SPARK_BATCH_ROWS = 3;
const WEEKLY_BATCH_DAYS = 7;
const trackOptions = [
    { id: "track_spark", label: "Spark" },
    { id: "track_focus", label: "Essential" },
    { id: "track_signature", label: "Signature" },
    { id: "track_reserve", label: "HighEnd" },
];
const paymentStatusOptions = [
    { id: "PENDING", label: "결제 대기" },
    { id: "DEPOSIT_PAID", label: "예약금 입금" },
    { id: "PARTIAL_PAID", label: "분납 진행" },
    { id: "PAID", label: "완납" },
    { id: "OVERDUE", label: "확인 필요" },
];
const contactChannelOptions = [
    { id: "KAKAO", label: "카카오" },
    { id: "PHONE", label: "전화" },
    { id: "EMAIL", label: "이메일" },
    { id: "IN_PERSON", label: "대면" },
    { id: "NOTE", label: "메모" },
];
const enrollmentStatusLabels: Record<string, string> = {
    ACTIVE: "운영 중",
    PENDING_PAYMENT: "결제 확인 중",
    PAUSED: "일시정지",
    COMPLETED: "완료",
    CANCELLED: "취소",
    REFUND_REQUESTED: "환불 요청",
};
const paymentStatusLabels: Record<string, string> = {
    UNKNOWN: "미확인",
    PENDING: "결제 대기",
    DEPOSIT_PAID: "예약금",
    PARTIAL_PAID: "분납",
    PAID: "완납",
    OVERDUE: "확인 필요",
    REFUNDED: "환불",
};
const checkInConditionLabels: Record<string, string> = {
    GREAT: "매우 좋음",
    GOOD: "좋음",
    NORMAL: "보통",
    TIRED: "피곤함",
    REST_NEEDED: "휴식 필요",
};
const gojoAutomationLabels: Record<string, string> = {
    AUTO_PUBLISH: "저위험 자동발행 가능",
    COACH_APPROVAL: "코치 승인 권장",
    COACH_REQUIRED: "코치 판단 필수",
};
const gojoRecommendationStatusLabels: Record<string, string> = {
    SUGGESTED: "추천됨",
    ACCEPTED: "불러옴",
    PUBLISHED: "발행 완료",
    DISMISSED: "보류",
};

function createSparkMissionDraft(overrides: Partial<MissionDraft> = {}): SparkMissionDraft {
    return {
        id: `spark-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...EMPTY_MISSION_DRAFT,
        ...overrides,
    };
}

function createSparkMissionDrafts(count = DEFAULT_SPARK_BATCH_ROWS) {
    return Array.from({ length: count }, () => createSparkMissionDraft());
}

function getKstDateParts(value: Date | string | null | undefined) {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    const kst = new Date(parsed.getTime() + KST_OFFSET_MS);

    return {
        year: kst.getUTCFullYear(),
        month: kst.getUTCMonth() + 1,
        day: kst.getUTCDate(),
        hours: kst.getUTCHours(),
        minutes: kst.getUTCMinutes(),
    };
}

function toDateKey(year: number, month: number, day: number) {
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function parseDateKey(dateKey: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);

    if (!match) {
        return null;
    }

    const [, yearValue, monthValue, dayValue] = match;

    return {
        year: Number(yearValue),
        month: Number(monthValue),
        day: Number(dayValue),
    };
}

function shiftDateKey(dateKey: string, amount: number) {
    const parsed = parseDateKey(dateKey);

    if (!parsed) {
        return dateKey;
    }

    const shifted = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + amount));

    return toDateKey(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

function formatDateKeyWithWeekday(dateKey: string) {
    const parsed = parseDateKey(dateKey);

    if (!parsed) {
        return dateKey;
    }

    const weekday = weekdayLabels[new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).getUTCDay()];

    return `${parsed.month}/${parsed.day} (${weekday})`;
}

function createWeeklyMissionDrafts(startDateKey: string, currentDrafts?: WeeklyMissionDraft[]) {
    return Array.from({ length: WEEKLY_BATCH_DAYS }, (_, index) => {
        const currentDraft = currentDrafts?.[index];

        return {
            dateKey: shiftDateKey(startDateKey, index),
            title: currentDraft?.title ?? "",
            description: currentDraft?.description ?? "",
            weekNumber: currentDraft?.weekNumber ?? "",
            guidePresetKey: currentDraft?.guidePresetKey ?? "",
        };
    });
}

function getTodayKstDateKey() {
    const today = getKstDateParts(new Date());

    if (!today) {
        return "";
    }

    return toDateKey(today.year, today.month, today.day);
}

function getMonthKey(dateKey: string) {
    return dateKey.slice(0, 7);
}

function getMonthLabel(monthKey: string) {
    const [year, month] = monthKey.split("-");
    return `${year}년 ${Number(month)}월`;
}

function shiftMonthKey(monthKey: string, amount: number) {
    const [yearValue, monthValue] = monthKey.split("-");
    const baseYear = Number(yearValue);
    const baseMonth = Number(monthValue);
    const shiftedIndex = baseYear * 12 + (baseMonth - 1) + amount;
    const nextYear = Math.floor(shiftedIndex / 12);
    const nextMonth = (shiftedIndex % 12) + 1;

    return `${nextYear}-${nextMonth.toString().padStart(2, "0")}`;
}

function getCalendarCells(monthKey: string) {
    const [yearValue, monthValue] = monthKey.split("-");
    const year = Number(yearValue);
    const month = Number(monthValue);
    const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const cells: Array<{ dateKey: string; day: number } | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push({ dateKey: toDateKey(year, month, day), day });
    }

    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    return cells;
}

function formatKstDateTime(value: Date | string | null | undefined) {
    const parts = getKstDateParts(value);

    if (!parts) {
        return null;
    }

    return `${parts.month}/${parts.day} ${parts.hours.toString().padStart(2, "0")}:${parts.minutes.toString().padStart(2, "0")}`;
}

function formatKstDate(value: Date | string | null | undefined) {
    const parts = getKstDateParts(value);

    if (!parts) {
        return "날짜 미정";
    }

    return `${parts.year}.${parts.month.toString().padStart(2, "0")}.${parts.day.toString().padStart(2, "0")}`;
}

function formatRoutineDateRange(
    availableFrom: Date | string | null | undefined,
    expiresAt: Date | string | null | undefined
) {
    const fromLabel = formatKstDateTime(availableFrom);
    const untilLabel = formatKstDateTime(expiresAt);

    if (fromLabel && untilLabel) {
        return `${fromLabel} - ${untilLabel}`;
    }

    return fromLabel || untilLabel || "상시 루틴";
}

function getRelativeDaysLabel(value: Date | string | null | undefined) {
    if (!value) {
        return "기록 없음";
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return "기록 없음";
    }

    const diffDays = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / (24 * 60 * 60 * 1000)));

    if (diffDays === 0) {
        return "오늘";
    }

    return `${diffDays}일 전`;
}

function parseGojoSignals(value: string | null | undefined) {
    if (!value) {
        return null;
    }

    try {
        const parsed = JSON.parse(value);

        if (!parsed || typeof parsed !== "object") {
            return null;
        }

        return parsed as {
            sourceProjects?: string[];
            trigger?: string;
            labels?: string[];
            riskLevel?: string;
        };
    } catch {
        return null;
    }
}

function formatMissionPossibleWindow(
    availableFrom: Date | string | null | undefined,
    availableUntil: Date | string | null | undefined
) {
    const fromLabel = formatKstDateTime(availableFrom);
    const untilLabel = formatKstDateTime(availableUntil);

    if (!fromLabel || !untilLabel) {
        return null;
    }

    return `${fromLabel} ~ ${untilLabel} KST`;
}

function getMissionPossibleReleaseDateKey(availableFrom: Date | string | null | undefined) {
    const parts = getKstDateParts(availableFrom);

    if (!parts) {
        return null;
    }

    return toDateKey(parts.year, parts.month, parts.day);
}

function getMissionPossibleCardTitle(title: string) {
    const normalized = title.replace(/^\[[^\]]+\]\s*/, "").trim();
    return normalized || title;
}

function hasStructuredConsultationDetails(consultation: Consultation) {
    return Boolean(
        consultation.bottleneck ||
        consultation.motivation ||
        consultation.timeline ||
        consultation.level ||
        consultation.timeInvestment ||
        consultation.reference
    );
}

function getDefaultTrackIdFromConsultation(consultation: Consultation) {
    const source = `${consultation.type || ""} ${consultation.reference || ""}`.toLowerCase();

    if (source.includes("spark") || source.includes("스파크")) {
        return "track_spark";
    }

    if (source.includes("signature") || source.includes("시그니처")) {
        return "track_signature";
    }

    if (
        source.includes("reserve") ||
        source.includes("highend") ||
        source.includes("high-end") ||
        source.includes("하이엔드") ||
        source.includes("15주")
    ) {
        return "track_reserve";
    }

    return "track_signature";
}

function getProgramNameFromTrackId(trackId: string) {
    return trackOptions.find((track) => track.id === trackId)?.label || "SEE:SUN Coaching";
}

function buildDefaultConversionDraft(consultation: Consultation): ConversionDraft {
    const trackId = getDefaultTrackIdFromConsultation(consultation);

    return {
        name: getConsultationDisplayName(consultation),
        email: consultation.email || "",
        initialPassword: "",
        trackId,
        programName: getProgramNameFromTrackId(trackId),
        paymentStatus: "PENDING",
        primaryGoal: consultation.motivation || consultation.bottleneck || "",
        practiceAnchor: consultation.timeInvestment || consultation.preferredTime || "",
        representativeSongs: "",
    };
}

function getConsultationDisplayName(consultation: Consultation) {
    return consultation.name || consultation.email || consultation.phone || "이름 미기재";
}

function getConsultationContactSummary(consultation: Consultation) {
    const parts: string[] = [];

    if (consultation.email) {
        parts.push(`이메일: ${consultation.email}`);
    }

    if (consultation.phone) {
        parts.push(`연락처: ${consultation.phone}`);
    }

    return parts.join(" · ") || "연락처 정보 없음";
}

function formatConsultationCreatedAt(value: Date | string) {
    return new Date(value).toLocaleString("ko-KR");
}

function getConsultationAlertStatusLabel(consultation: Consultation) {
    switch (consultation.lastAlertStatus) {
        case "SENT":
            return "즉시 알림 전송됨";
        case "PARTIAL":
            return "일부 채널 알림 전송";
        case "FAILED":
            return "알림 전송 실패";
        case "NO_CHANNEL":
            return "알림 채널 미설정";
        default:
            return "알림 상태 미기록";
    }
}

function getConsultationAlertStatusColor(consultation: Consultation) {
    switch (consultation.lastAlertStatus) {
        case "SENT":
            return "#34C759";
        case "PARTIAL":
            return "#FF9F0A";
        case "FAILED":
        case "NO_CHANNEL":
            return "#FF3B30";
        default:
            return "#86868b";
    }
}

function getMissionPossibleItemsForStudent(student: CoachDashboardData[number] | null | undefined): MissionPossibleDashboardItem[] {
    if (!student) {
        return [];
    }

    return student.assignments
        .filter((assignment) => assignment.availableFrom || assignment.availableUntil)
        .sort((left, right) => {
            const leftTime = new Date(left.availableFrom || left.createdAt).getTime();
            const rightTime = new Date(right.availableFrom || right.createdAt).getTime();
            return leftTime - rightTime;
        })
        .map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            isCompleted: assignment.isCompleted,
            windowLabel: formatMissionPossibleWindow(assignment.availableFrom, assignment.availableUntil),
            releaseDateKey: getMissionPossibleReleaseDateKey(assignment.availableFrom),
            availableFrom: assignment.availableFrom,
            availableUntil: assignment.availableUntil,
            createdAt: assignment.createdAt,
            studentId: student.id,
            studentName: student.name || "이름 미지정",
            trackName: student.track?.name || "배정 대기",
            hasScaleGuide: Boolean(
                getAssignmentScaleGuidePattern({
                    title: assignment.title,
                    guidePresetKey: assignment.guidePresetKey,
                    guidePatternJson: assignment.guidePatternJson,
                })
            ),
        }));
}

export default function CoachDashboardClient({ 
    students, 
    consultations,
    analyticsSummary,
    routineTemplates,
}: { 
    students: CoachDashboardData, 
    consultations: Consultation[],
    analyticsSummary: SiteAnalyticsSummary,
    routineTemplates: RoutineTemplateItem[],
}) {
    const todayKstDateKey = getTodayKstDateKey();
    const sparkStudents = students.filter((student) => isMissionPossibleTrackId(student.trackId));
    const sparkStudentIdsKey = sparkStudents.map((student) => student.id).join(",");
    const [view, setView] = useState<"students" | "spark" | "analytics" | "consultations">("students");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);
    const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(consultations[0]?.id || null);
    const [feedbackTextByAssignment, setFeedbackTextByAssignment] = useState<Record<string, string>>({});
    const [isSubmittingByAssignment, setIsSubmittingByAssignment] = useState<Record<string, boolean>>({});
    
    // Management State
    const [isAssigningTrack, setIsAssigningTrack] = useState(false);
    const [newMission, setNewMission] = useState<MissionDraft>(EMPTY_MISSION_DRAFT);
    const [isMissionPossible, setIsMissionPossible] = useState(false);
    const [missionPossibleDate, setMissionPossibleDate] = useState(todayKstDateKey);
    const [calendarMonthKey, setCalendarMonthKey] = useState(getMonthKey(todayKstDateKey));
    const [isCreatingMission, setIsCreatingMission] = useState(false);
    const [isCreatingWeeklyMission, setIsCreatingWeeklyMission] = useState(false);
    const [isSavingContactLog, setIsSavingContactLog] = useState(false);
    const [isSavingWeeklyReport, setIsSavingWeeklyReport] = useState(false);
    const [isCreatingMemberInvite, setIsCreatingMemberInvite] = useState(false);
    const [copyingLinkAssignmentId, setCopyingLinkAssignmentId] = useState<string | null>(null);
    const [isConvertingConsultation, setIsConvertingConsultation] = useState(false);
    const [conversionDraftByConsultation, setConversionDraftByConsultation] = useState<Record<string, ConversionDraft>>({});
    const [contactDraftByStudent, setContactDraftByStudent] = useState<Record<string, ContactLogDraft>>({});
    const [weeklyReportDraftByStudent, setWeeklyReportDraftByStudent] = useState<Record<string, WeeklyReportDraft>>({});
    const [paymentDraftByEnrollment, setPaymentDraftByEnrollment] = useState<Record<string, PaymentDraft>>({});
    const [isSavingPaymentRecord, setIsSavingPaymentRecord] = useState(false);
    const [isSavingRoutineTemplate, setIsSavingRoutineTemplate] = useState(false);
    const [isGeneratingGojoRecommendation, setIsGeneratingGojoRecommendation] = useState(false);
    const [publishingGojoRecommendationId, setPublishingGojoRecommendationId] = useState<string | null>(null);
    const [gojoRecommendationByStudent, setGojoRecommendationByStudent] = useState<Record<string, GojoRecommendationItem>>({});
    const [activeGojoRecommendationId, setActiveGojoRecommendationId] = useState<string | null>(null);
    const [showMissionAdvanced, setShowMissionAdvanced] = useState(false);
    const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);
    const [showSparkCalendar, setShowSparkCalendar] = useState(false);
    const [selectedSparkTargetIds, setSelectedSparkTargetIds] = useState<string[]>(() => sparkStudents.map((student) => student.id));
    const [sparkMissionDrafts, setSparkMissionDrafts] = useState<SparkMissionDraft[]>(() => createSparkMissionDrafts());
    const [weeklyMissionStartDate, setWeeklyMissionStartDate] = useState(todayKstDateKey);
    const [weeklyMissionDrafts, setWeeklyMissionDrafts] = useState<WeeklyMissionDraft[]>(
        () => createWeeklyMissionDrafts(todayKstDateKey)
    );
    const [lessonQr, setLessonQr] = useState<LessonQrState | null>(null);
    const [lessonQrError, setLessonQrError] = useState("");
    const [isCopyingLessonQrLink, setIsCopyingLessonQrLink] = useState(false);

    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const selectedConsultation = consultations.find(c => c.id === selectedConsultationId);
    const selectedConsultationHasDetails = selectedConsultation ? hasStructuredConsultationDetails(selectedConsultation) : false;
    const selectedConsultationDisplayName = selectedConsultation ? getConsultationDisplayName(selectedConsultation) : null;
    const selectedConsultationContactSummary = selectedConsultation ? getConsultationContactSummary(selectedConsultation) : null;
    const selectedConversionDraft = selectedConsultation
        ? conversionDraftByConsultation[selectedConsultation.id] || buildDefaultConversionDraft(selectedConsultation)
        : null;
    const selectedActiveEnrollment = selectedStudent?.enrollments.find((enrollment) =>
        enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT"
    ) || selectedStudent?.enrollments[0] || null;
    const selectedLatestCheckIn = selectedStudent?.checkIns[0] || null;
    const selectedLatestWeeklyReport = selectedStudent?.weeklyReports[0] || null;
    const selectedEnrollmentLessonAttendances = selectedActiveEnrollment?.lessonAttendances || [];
    const selectedLessonAttendances = selectedEnrollmentLessonAttendances.length > 0
        ? selectedEnrollmentLessonAttendances
        : selectedStudent?.lessonAttendances || [];
    const selectedLessonAttendanceCount = selectedActiveEnrollment?._count.lessonAttendances || selectedStudent?._count.lessonAttendances || 0;
    const selectedTodayLessonAttendance = selectedLessonAttendances.find((attendance) => attendance.attendanceDate === todayKstDateKey) || null;
    const selectedLatestGojoRecommendation = selectedStudent
        ? gojoRecommendationByStudent[selectedStudent.id] || selectedStudent.gojoRecommendations[0] || null
        : null;
    const selectedGojoSignals = parseGojoSignals(selectedLatestGojoRecommendation?.signalsJson);
    const selectedLatestObiwanSignal = selectedStudent?.obiwanSignals[0] || null;
    const selectedLatestInvite = selectedStudent?.memberInvites[0] || null;
    const selectedRecentRoutines = selectedStudent?.dailyRoutines.slice(0, 6) || [];
    const selectedOpenRoutines = selectedStudent?.dailyRoutines.filter((routine) => {
        const state = getAssignmentAvailabilityState({
            availableFrom: routine.availableFrom,
            availableUntil: routine.expiresAt,
        });

        return routine.status !== "COMPLETED" && routine.status !== "CANCELLED" && state.isAvailable;
    }) || [];
    const selectedCompletedRoutineCount = selectedStudent?.dailyRoutines.filter((routine) => routine.status === "COMPLETED").length || 0;
    const selectedContactDraft = selectedStudent
        ? contactDraftByStudent[selectedStudent.id] || { channel: "KAKAO", summary: "", nextAction: "" }
        : null;
    const selectedPaymentDraft = selectedActiveEnrollment
        ? paymentDraftByEnrollment[selectedActiveEnrollment.id] || {
            amountKrw: "",
            status: selectedActiveEnrollment.paymentStatus || "PENDING",
            dueDate: "",
            paidAt: "",
            note: "",
        }
        : null;
    const selectedWeeklyReportDraft = selectedStudent
        ? weeklyReportDraftByStudent[selectedStudent.id] || {
            summaryTitle: `${selectedStudent.name || "회원"}님의 이번 주 연습 리듬`,
            summaryBody: "",
            nextFocus: "",
        }
        : null;
    const selectedSparkTargetIdSet = new Set(selectedSparkTargetIds);
    const selectedSparkTargetStudents = sparkStudents.filter((student) => selectedSparkTargetIdSet.has(student.id));
    const selectedSparkTargetCount = selectedSparkTargetStudents.length;
    const isAllSparkTargetsSelected = sparkStudents.length > 0 && selectedSparkTargetCount === sparkStudents.length;
    const selectedStudentMissionPossibleAssignments = getMissionPossibleItemsForStudent(selectedStudent);
    const sparkMissionPossibleAssignments = sparkStudents.flatMap((student) => getMissionPossibleItemsForStudent(student));
    const filteredSparkMissionPossibleAssignments = sparkMissionPossibleAssignments.filter((assignment) => selectedSparkTargetIdSet.has(assignment.studentId));
    const activePlannerAssignments = view === "spark"
        ? filteredSparkMissionPossibleAssignments
        : selectedStudentMissionPossibleAssignments;
    const missionPossibleAssignmentsByDate = activePlannerAssignments.reduce<
        Record<string, MissionPossibleDashboardItem[]>
    >((current, assignment) => {
        const releaseDateKey = assignment.releaseDateKey;

        if (!releaseDateKey) {
            return current;
        }

        if (!current[releaseDateKey]) {
            current[releaseDateKey] = [];
        }

        current[releaseDateKey].push(assignment);

        return current;
    }, {});
    const selectedDateMissionPossibleAssignments = missionPossibleAssignmentsByDate[missionPossibleDate] || [];
    const scheduledMissionPossibleWindowPreview = getMissionPossibleWindowForDate(missionPossibleDate);
    const calendarCells = getCalendarCells(calendarMonthKey);
    const todaySparkAssignments = filteredSparkMissionPossibleAssignments.filter((assignment) => assignment.releaseDateKey === todayKstDateKey);
    const todayPendingSparkAssignments = todaySparkAssignments.filter((assignment) => !assignment.isCompleted);
    const pendingSparkAssignmentsCount = filteredSparkMissionPossibleAssignments.filter((assignment) => !assignment.isCompleted).length;
    const filledSparkMissionDraftCount = sparkMissionDrafts.filter((draft) => draft.title.trim()).length;
    const sparkSelectedTracks = Array.from(
        new Set(selectedSparkTargetStudents.map((student) => student.track?.name || "트랙 미배정"))
    );
    const filledWeeklyMissionCount = weeklyMissionDrafts.filter((draft) => draft.title.trim()).length;
    const weeklyMissionEndDate = weeklyMissionDrafts[weeklyMissionDrafts.length - 1]?.dateKey || weeklyMissionStartDate;
    const weeklyMissionRangeLabel = `${formatDateKeyWithWeekday(weeklyMissionStartDate)} - ${formatDateKeyWithWeekday(weeklyMissionEndDate)}`;

    useEffect(() => {
        let isMounted = true;

        async function loadLessonQr() {
            try {
                const response = await fetch("/api/admin/lesson-attendance/qr");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "레슨 QR을 불러오지 못했습니다.");
                }

                if (isMounted) {
                    setLessonQr({
                        dateKey: data.dateKey,
                        checkInUrl: data.checkInUrl,
                        qrDataUrl: data.qrDataUrl,
                    });
                    setLessonQrError("");
                }
            } catch (error) {
                if (isMounted) {
                    setLessonQrError(error instanceof Error ? error.message : "레슨 QR을 불러오지 못했습니다.");
                }
            }
        }

        void loadLessonQr();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!/스케일|scale/i.test(newMission.title) || newMission.guidePresetKey) {
            return;
        }

        setNewMission((current) => {
            if (current.guidePresetKey) {
                return current;
            }

            return {
                ...current,
                guidePresetKey: DEFAULT_SCALE_GUIDE_PRESET_KEY,
            };
        });
    }, [newMission.title, newMission.guidePresetKey]);

    useEffect(() => {
        setSelectedSparkTargetIds((current) =>
            current.filter((studentId) => sparkStudents.some((student) => student.id === studentId))
        );
    }, [sparkStudentIdsKey, sparkStudents]);

    const submitFeedback = async (assignmentId: string) => {
        const feedbackText = feedbackTextByAssignment[assignmentId]?.trim();
        if (!feedbackText) return;
        setIsSubmittingByAssignment((current) => ({ ...current, [assignmentId]: true }));

        try {
            const res = await fetch("/api/assignments/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignmentId,
                    comment: feedbackText,
                }),
            });

            if (res.ok) {
                alert("피드백이 성공적으로 등록되었습니다.");
                setFeedbackTextByAssignment((current) => ({ ...current, [assignmentId]: "" }));
                window.location.reload();
            } else {
                alert("피드백 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setIsSubmittingByAssignment((current) => ({ ...current, [assignmentId]: false }));
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/consultations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("상태 업데이트 실패");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const assignTrack = async (studentId: string, trackId: string) => {
        setIsAssigningTrack(true);
        try {
            const res = await fetch("/api/admin/assign-track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, trackId }),
            });
            if (res.ok) {
                alert("트랙이 성공적으로 배정되었습니다.");
                window.location.reload();
            } else {
                alert("트랙 배정 실패");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAssigningTrack(false);
        }
    };

    const updateConversionDraft = (consultation: Consultation, patch: Partial<ConversionDraft>) => {
        setConversionDraftByConsultation((current) => {
            const currentDraft = current[consultation.id] || buildDefaultConversionDraft(consultation);
            const nextDraft = {
                ...currentDraft,
                ...patch,
            };

            if (patch.trackId && !patch.programName) {
                nextDraft.programName = getProgramNameFromTrackId(patch.trackId);
            }

            return {
                ...current,
                [consultation.id]: nextDraft,
            };
        });
    };

    const updateContactDraft = (studentId: string, patch: Partial<ContactLogDraft>) => {
        setContactDraftByStudent((current) => {
            const base = current[studentId] || {
                channel: "KAKAO",
                summary: "",
                nextAction: "",
            };

            return {
                ...current,
                [studentId]: {
                    ...base,
                    ...patch,
                },
            };
        });
    };

    const updateWeeklyReportDraft = (studentId: string, patch: Partial<WeeklyReportDraft>) => {
        setWeeklyReportDraftByStudent((current) => {
            const base = current[studentId] || {
                summaryTitle: "",
                summaryBody: "",
                nextFocus: "",
            };

            return {
                ...current,
                [studentId]: {
                    ...base,
                    ...patch,
                },
            };
        });
    };

    const updatePaymentDraft = (enrollmentId: string, patch: Partial<PaymentDraft>) => {
        setPaymentDraftByEnrollment((current) => {
            const base = current[enrollmentId] || {
                amountKrw: "",
                status: "PENDING",
                dueDate: "",
                paidAt: "",
                note: "",
            };

            return {
                ...current,
                [enrollmentId]: {
                    ...base,
                    ...patch,
                },
            };
        });
    };

    const applyRoutineTemplate = (templateId: string) => {
        const template = routineTemplates.find((item) => item.id === templateId);

        if (!template) {
            return;
        }

        setNewMission((current) => ({
            ...current,
            title: template.title,
            description: template.description || template.focus || "",
            guidePresetKey: template.guidePresetKey || "",
        }));
    };

    const saveRoutineTemplate = async () => {
        if (!newMission.title.trim()) {
            return alert("템플릿으로 저장할 루틴 제목을 입력해 주세요.");
        }

        setIsSavingRoutineTemplate(true);

        try {
            const response = await fetch("/api/admin/routine-template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newMission.title,
                    description: newMission.description,
                    focus: newMission.description,
                    expectedMinutes: 7,
                    guidePresetKey: newMission.guidePresetKey || undefined,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "루틴 템플릿 저장 실패");
            }

            alert("루틴 템플릿을 저장했습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "루틴 템플릿 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingRoutineTemplate(false);
        }
    };

    const applyGojoRecommendationToRoutineStudio = (recommendation: GojoRecommendationItem) => {
        setNewMission({
            title: recommendation.title,
            description: recommendation.memberMemo || recommendation.focus || recommendation.rationale,
            weekNumber: "",
            guidePresetKey: "",
        });
        setIsMissionPossible(true);
        setShowMissionAdvanced(false);
        setActiveGojoRecommendationId(recommendation.id);
        alert("Gojo 추천을 Routine Studio에 불러왔습니다. 필요하면 문구를 다듬고 발행해 주세요.");
    };

    const generateGojoRecommendationForStudent = async (studentId: string) => {
        setIsGeneratingGojoRecommendation(true);

        try {
            const response = await fetch("/api/admin/gojo/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: studentId }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gojo 추천 생성 실패");
            }

            setGojoRecommendationByStudent((current) => ({
                ...current,
                [studentId]: data.recommendation,
            }));
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Gojo 추천 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGeneratingGojoRecommendation(false);
        }
    };

    const publishGojoRecommendationForStudent = async (recommendation: GojoRecommendationItem) => {
        setPublishingGojoRecommendationId(recommendation.id);

        try {
            const response = await fetch(`/api/admin/gojo/recommendations/${recommendation.id}/publish`, {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gojo 추천 발행 실패");
            }

            alert(data.alreadyPublished ? "이미 발행된 Gojo 추천입니다." : "Gojo 추천 루틴을 오늘 루틴으로 발행했습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Gojo 추천 발행 중 오류가 발생했습니다.");
        } finally {
            setPublishingGojoRecommendationId(null);
        }
    };

    const savePaymentRecord = async (enrollmentId: string) => {
        const draft = paymentDraftByEnrollment[enrollmentId] || selectedPaymentDraft;

        if (!draft) {
            return alert("등록 정보를 찾을 수 없습니다.");
        }

        setIsSavingPaymentRecord(true);

        try {
            const response = await fetch("/api/admin/payment-record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enrollmentId,
                    ...draft,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "결제 기록 저장 실패");
            }

            alert("결제 기록을 저장했습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "결제 기록 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingPaymentRecord(false);
        }
    };

    const saveContactLog = async (studentId: string) => {
        const draft = contactDraftByStudent[studentId] || { channel: "KAKAO", summary: "", nextAction: "" };

        if (!draft.summary.trim()) {
            return alert("남길 연락 기록을 입력해 주세요.");
        }

        setIsSavingContactLog(true);

        try {
            const response = await fetch("/api/admin/contact-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: studentId,
                    ...draft,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "연락 기록 저장 실패");
            }

            alert("회원 연락 기록을 저장했습니다.");
            setContactDraftByStudent((current) => ({
                ...current,
                [studentId]: { channel: "KAKAO", summary: "", nextAction: "" },
            }));
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "연락 기록 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingContactLog(false);
        }
    };

    const saveWeeklyReport = async (studentId: string) => {
        const draft = weeklyReportDraftByStudent[studentId] || selectedWeeklyReportDraft;

        if (!draft?.summaryBody.trim()) {
            return alert("회원에게 남길 주간 요약을 입력해 주세요.");
        }

        setIsSavingWeeklyReport(true);

        try {
            const response = await fetch("/api/admin/weekly-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: studentId,
                    ...draft,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "주간 리포트 저장 실패");
            }

            alert("주간 리포트를 저장했습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "주간 리포트 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingWeeklyReport(false);
        }
    };

    const createMemberInvite = async (studentId: string, studentName: string) => {
        setIsCreatingMemberInvite(true);

        try {
            const response = await fetch("/api/admin/member-invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: studentId }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "초대 링크 생성 실패");
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(data.inviteUrl);
            } else {
                window.prompt("아래 초대 링크를 복사해 주세요.", data.inviteUrl);
            }

            alert(
                data.emailSent
                    ? `${studentName}님에게 초대 이메일을 보냈고 링크도 복사했습니다.`
                    : `${studentName}님의 초대 링크를 복사했습니다. 카카오나 문자로 전달해 주세요.`
            );
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "초대 링크 생성 중 오류가 발생했습니다.");
        } finally {
            setIsCreatingMemberInvite(false);
        }
    };

    const copyLessonQrLink = async () => {
        if (!lessonQr?.checkInUrl) {
            return alert("아직 복사할 레슨 QR 링크가 준비되지 않았습니다.");
        }

        setIsCopyingLessonQrLink(true);

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(lessonQr.checkInUrl);
            } else {
                window.prompt("아래 레슨 출석 링크를 복사해 주세요.", lessonQr.checkInUrl);
            }

            alert("오늘 레슨 출석 링크를 복사했습니다.");
        } catch (error) {
            console.error(error);
            alert("레슨 출석 링크 복사 중 오류가 발생했습니다.");
        } finally {
            setIsCopyingLessonQrLink(false);
        }
    };

    const convertConsultationToMember = async (consultation: Consultation) => {
        const draft = conversionDraftByConsultation[consultation.id] || buildDefaultConversionDraft(consultation);

        if (!draft.email.trim()) {
            return alert("회원 로그인을 만들 이메일을 입력해 주세요.");
        }

        if (draft.initialPassword.trim() && draft.initialPassword.trim().length < 8) {
            return alert("초기 비밀번호를 직접 지정하려면 8자 이상으로 입력해 주세요.");
        }

        setIsConvertingConsultation(true);

        try {
            const response = await fetch("/api/admin/convert-consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    consultationId: consultation.id,
                    ...draft,
                    initialPassword: draft.initialPassword.trim(),
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "유료회원 전환 실패");
            }

            if (data.inviteUrl && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(data.inviteUrl);
            }

            alert(
                data.inviteUrl
                    ? `유료회원 전환이 완료되었습니다. 첫 7분 루틴과 초대 링크가 준비됐고, 링크를 복사했습니다.${data.emailSent ? "\n초대 이메일도 발송했습니다." : ""}`
                    : "유료회원 전환이 완료되었습니다. 첫 7분 루틴도 함께 준비되었습니다."
            );
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "유료회원 전환 중 오류가 발생했습니다.");
        } finally {
            setIsConvertingConsultation(false);
        }
    };

    const handleMissionPossibleDateChange = (nextDateKey: string) => {
        setMissionPossibleDate(nextDateKey);
        setCalendarMonthKey(getMonthKey(nextDateKey));
    };

    const handleWeeklyMissionStartDateChange = (nextDateKey: string) => {
        setWeeklyMissionStartDate(nextDateKey);
        setWeeklyMissionDrafts((current) => createWeeklyMissionDrafts(nextDateKey, current));
    };

    const updateSparkMissionDraft = (
        missionId: string,
        patch: Partial<Pick<SparkMissionDraft, "title" | "description" | "weekNumber" | "guidePresetKey">>
    ) => {
        setSparkMissionDrafts((current) =>
            current.map((draft) => {
                if (draft.id !== missionId) {
                    return draft;
                }

                const nextDraft = {
                    ...draft,
                    ...patch,
                };

                if (
                    typeof patch.title === "string" &&
                    /스케일|scale/i.test(patch.title) &&
                    !nextDraft.guidePresetKey
                ) {
                    nextDraft.guidePresetKey = DEFAULT_SCALE_GUIDE_PRESET_KEY;
                }

                return nextDraft;
            })
        );
    };

    const addSparkMissionDraftRow = () => {
        setSparkMissionDrafts((current) => [...current, createSparkMissionDraft()]);
    };

    const removeSparkMissionDraftRow = (missionId: string) => {
        setSparkMissionDrafts((current) => {
            if (current.length === 1) {
                return [createSparkMissionDraft()];
            }

            return current.filter((draft) => draft.id !== missionId);
        });
    };

    const selectAllSparkTargets = () => {
        setSelectedSparkTargetIds(sparkStudents.map((student) => student.id));
    };

    const clearSparkTargets = () => {
        setSelectedSparkTargetIds([]);
    };

    const toggleSparkTarget = (studentId: string) => {
        setSelectedSparkTargetIds((current) =>
            current.includes(studentId)
                ? current.filter((value) => value !== studentId)
                : [...current, studentId]
        );
    };

    const updateWeeklyMissionDraft = (
        index: number,
        patch: Partial<Pick<WeeklyMissionDraft, "title" | "description" | "guidePresetKey">>
    ) => {
        setWeeklyMissionDrafts((current) =>
            current.map((draft, draftIndex) => {
                if (draftIndex !== index) {
                    return draft;
                }

                const nextDraft = {
                    ...draft,
                    ...patch,
                };

                if (
                    typeof patch.title === "string" &&
                    /스케일|scale/i.test(patch.title) &&
                    !nextDraft.guidePresetKey
                ) {
                    nextDraft.guidePresetKey = DEFAULT_SCALE_GUIDE_PRESET_KEY;
                }

                return nextDraft;
            })
        );
    };

    const submitAssignmentDraft = async ({
        mission,
        userId,
        userIds,
        broadcastToMissionPossibleStudents = false,
        forceMissionPossible = false,
        dateKey,
    }: {
        mission: MissionDraft;
        userId?: string;
        userIds?: string[];
        broadcastToMissionPossibleStudents?: boolean;
        forceMissionPossible?: boolean;
        dateKey?: string;
    }) => {
        let availableFrom = null;
        let availableUntil = null;

        if (dateKey || forceMissionPossible || isMissionPossible) {
            const window = getMissionPossibleWindowForDate(dateKey || missionPossibleDate);
            availableFrom = window.availableFrom.toISOString();
            availableUntil = window.availableUntil.toISOString();
        }

        const res = await fetch("/api/admin/create-assignment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                userIds,
                broadcastToMissionPossibleStudents,
                title: mission.title.trim(),
                description: mission.description.trim() || null,
                weekNumber: mission.weekNumber || null,
                availableFrom,
                availableUntil,
                guidePresetKey: mission.guidePresetKey || null,
                gojoRecommendationId: userId && !userIds?.length && !broadcastToMissionPossibleStudents
                    ? activeGojoRecommendationId
                    : null,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "미션 생성 실패");
        }

        return data;
    };

    const createAssignment = async ({
        userId,
        forceMissionPossible = false,
        broadcastToMissionPossibleStudents = false,
    }: {
        userId?: string;
        forceMissionPossible?: boolean;
        broadcastToMissionPossibleStudents?: boolean;
    }) => {
        if (!newMission.title.trim()) return alert("미션 제목을 입력해 주세요.");
        if (!broadcastToMissionPossibleStudents && !userId) return alert("대상 수강생을 선택해 주세요.");
        setIsCreatingMission(true);

        try {
            const data = await submitAssignmentDraft({
                mission: newMission,
                userId,
                broadcastToMissionPossibleStudents,
                forceMissionPossible,
            });

            if (broadcastToMissionPossibleStudents) {
                const skippedMessage = data.skippedCount > 0 ? `\n이미 같은 날짜로 배정된 ${data.skippedCount}명은 제외했습니다.` : "";
                alert(`공통 미션파서블이 ${data.createdCount}명에게 발행되었습니다.${skippedMessage}`);
            } else {
                alert("미션이 생성되었습니다.");
            }
            setNewMission(EMPTY_MISSION_DRAFT);
            setIsMissionPossible(false);
            setActiveGojoRecommendationId(null);
            setShowMissionAdvanced(false);
            setMissionPossibleDate(todayKstDateKey);
            setCalendarMonthKey(getMonthKey(todayKstDateKey));
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "미션 생성 실패");
        } finally {
            setIsCreatingMission(false);
        }
    };

    const createSparkMissionBatch = async () => {
        const draftsToCreate = sparkMissionDrafts.filter((draft) => draft.title.trim());

        if (draftsToCreate.length === 0) {
            return alert("루틴 제목을 한 개 이상 입력해 주세요.");
        }

        if (selectedSparkTargetIds.length === 0) {
            return alert("대상 멤버를 한 명 이상 선택해 주세요.");
        }

        setIsCreatingMission(true);

        let totalCreated = 0;
        let totalSkipped = 0;
        const failedTitles: string[] = [];

        try {
            for (const draft of draftsToCreate) {
                try {
                    const data = await submitAssignmentDraft({
                        mission: draft,
                        userIds: isAllSparkTargetsSelected ? undefined : selectedSparkTargetIds,
                        broadcastToMissionPossibleStudents: isAllSparkTargetsSelected,
                        forceMissionPossible: true,
                        dateKey: missionPossibleDate,
                    });

                    totalCreated += data.createdCount ?? 0;
                    totalSkipped += data.skippedCount ?? 0;
                } catch (error) {
                    console.error(error);
                    failedTitles.push(draft.title.trim());
                }
            }

            if (failedTitles.length === draftsToCreate.length) {
                alert("선택한 루틴 발행에 실패했습니다.");
                return;
            }

            const failedMessage = failedTitles.length > 0
                ? `\n실패 루틴: ${failedTitles.join(", ")}`
                : "";

            alert(
                `${draftsToCreate.length - failedTitles.length}개 루틴을 ${selectedSparkTargetCount}명에게 발행했습니다.\n신규 발행 ${totalCreated}건\n중복 제외 ${totalSkipped}건${failedMessage}`
            );

            setSparkMissionDrafts(createSparkMissionDrafts());
            setShowMissionAdvanced(false);
            window.location.reload();
        } finally {
            setIsCreatingMission(false);
        }
    };

    const createWeeklyMissionBatch = async () => {
        const draftsToCreate = weeklyMissionDrafts.filter((draft) => draft.title.trim());

        if (draftsToCreate.length === 0) {
            return alert("주간 루틴 제목을 한 개 이상 입력해 주세요.");
        }

        if (selectedSparkTargetIds.length === 0) {
            return alert("대상 멤버를 한 명 이상 선택해 주세요.");
        }

        setIsCreatingWeeklyMission(true);

        let totalCreated = 0;
        let totalSkipped = 0;
        const failedDates: string[] = [];

        try {
            for (const draft of draftsToCreate) {
                try {
                    const data = await submitAssignmentDraft({
                        mission: draft,
                        userIds: isAllSparkTargetsSelected ? undefined : selectedSparkTargetIds,
                        broadcastToMissionPossibleStudents: isAllSparkTargetsSelected,
                        forceMissionPossible: true,
                        dateKey: draft.dateKey,
                    });

                    totalCreated += data.createdCount ?? 0;
                    totalSkipped += data.skippedCount ?? 0;
                } catch (error) {
                    console.error(error);
                    failedDates.push(draft.dateKey);
                }
            }

            if (failedDates.length === draftsToCreate.length) {
                alert("주간 루틴 발행에 실패했습니다.");
                return;
            }

            const failedMessage = failedDates.length > 0
                ? `\n실패 날짜: ${failedDates.map((dateKey) => formatDateKeyWithWeekday(dateKey)).join(", ")}`
                : "";

            alert(
                `주간 루틴 ${draftsToCreate.length - failedDates.length}일 분량을 ${selectedSparkTargetCount}명 기준으로 예약했습니다.\n신규 발행 ${totalCreated}건\n중복 제외 ${totalSkipped}건\n각 루틴은 해당 날짜 오전 9시에 자동 오픈됩니다.${failedMessage}`
            );
            window.location.reload();
        } finally {
            setIsCreatingWeeklyMission(false);
        }
    };

    const copyAssignmentAccessLink = async (assignmentId: string, studentName: string) => {
        setCopyingLinkAssignmentId(assignmentId);

        try {
            const response = await fetch(`/api/admin/assignment-access-link?assignmentId=${encodeURIComponent(assignmentId)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "링크 생성 실패");
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(data.url);
            } else {
                window.prompt("아래 링크를 복사해 주세요.", data.url);
            }

            alert(`${studentName}님의 오늘 미션 링크를 복사했습니다.`);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "링크 생성 중 오류가 발생했습니다.");
        } finally {
            setCopyingLinkAssignmentId(null);
        }
    };

    const renderScaleGuideConfigurator = ({
        mission,
        onMissionChange,
        tone = "light",
    }: {
        mission: MissionDraft;
        onMissionChange: (patch: Partial<MissionDraft>) => void;
        tone?: "light" | "dark";
    }) => {
        const isDark = tone === "dark";
        const selectedGuidePreview = mission.guidePresetKey
            ? getScaleGuidePresetPreview(mission.guidePresetKey)
            : null;

        return (
            <div
                style={{
                    marginBottom: "1rem",
                    padding: "14px 16px",
                    borderRadius: "18px",
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,159,10,0.08)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,159,10,0.12)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.05em" }}>
                            SCALE GUIDE
                        </div>
                        <div style={{ fontWeight: 800, color: isDark ? "#fff" : "#1d1d1f", marginBottom: "4px" }}>
                            학생이 바로 따라 연습할 피아노 스케일 가이드
                        </div>
                        <div style={{ fontSize: "0.82rem", color: isDark ? "rgba(255,255,255,0.68)" : "#6e6e73", lineHeight: 1.55 }}>
                            스케일 미션이면 피아노 버튼이 학생 카드에 표시되고, 모바일에서도 바로 재생됩니다.
                        </div>
                    </div>
                    <select
                        value={mission.guidePresetKey}
                        onChange={(event) => onMissionChange({ guidePresetKey: event.target.value })}
                        style={{
                            minWidth: "220px",
                            padding: "11px 12px",
                            borderRadius: "12px",
                            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e5e5e7",
                            background: isDark ? "rgba(17,18,23,0.7)" : "#fff",
                            color: isDark ? "#fff" : "#1d1d1f",
                            fontWeight: 700,
                        }}
                    >
                        <option value="">가이드 없이 발행</option>
                        {SCALE_GUIDE_PRESETS.map((preset) => (
                            <option key={preset.key} value={preset.key}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>

                {mission.guidePresetKey ? (
                    <div
                        style={{
                            marginTop: "12px",
                            padding: "12px 14px",
                            borderRadius: "14px",
                            background: isDark ? "rgba(255,255,255,0.06)" : "#fff",
                            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                        }}
                    >
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "4px" }}>
                            {SCALE_GUIDE_PRESETS.find((preset) => preset.key === mission.guidePresetKey)?.label || "선택된 스케일 가이드"}
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: isDark ? "#fff" : "#1d1d1f", marginBottom: "4px" }}>
                            {selectedGuidePreview || "A2 시작 -> A3 시작 · 9음 왕복 · 2박 쉼"}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: isDark ? "rgba(255,255,255,0.7)" : "#6e6e73", lineHeight: 1.55 }}>
                            A2 B2 C#3 D3 E3까지 올라간 뒤 D3 C#3 B2 A2로 다시 내려오고, 세트 사이마다 두 박 쉰 뒤 다음 시작음으로 넘어갑니다.
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: "12px", fontSize: "0.82rem", color: isDark ? "rgba(255,255,255,0.66)" : "#86868b" }}>
                        호흡/메모형 루틴이면 가이드를 끄고, 스케일 루틴이면 프리셋을 선택해 주세요.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="coach-page-root" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* View Switcher */}
            <div className="coach-view-switcher" style={{ display: "flex", gap: "10px", padding: "4px", background: "#f5f5f7", borderRadius: "12px", width: "fit-content" }}>
                <button 
                    onClick={() => setView("students")}
                    style={{ 
                        padding: "8px 20px", 
                        borderRadius: "8px", 
                        border: "none", 
                        background: view === "students" ? "#fff" : "transparent",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: view === "students" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        color: view === "students" ? "#1d1d1f" : "#86868b"
                    }}
                >
                    수강생 관리
                </button>
                <button 
                    onClick={() => setView("spark")}
                    style={{ 
                        padding: "8px 20px", 
                        borderRadius: "8px", 
                        border: "none", 
                        background: view === "spark" ? "#fff" : "transparent",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: view === "spark" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        color: view === "spark" ? "#1d1d1f" : "#86868b"
                    }}
                >
                    스파크 코너 ({sparkStudents.length})
                </button>
                <button 
                    onClick={() => setView("consultations")}
                    style={{ 
                        padding: "8px 20px", 
                        borderRadius: "8px", 
                        border: "none", 
                        background: view === "consultations" ? "#fff" : "transparent",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: view === "consultations" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        color: view === "consultations" ? "#1d1d1f" : "#86868b"
                    }}
                >
                    상담 신청 관리 ({consultations.filter(c => c.status === "PENDING").length})
                </button>
                <button 
                    onClick={() => setView("analytics")}
                    style={{ 
                        padding: "8px 20px", 
                        borderRadius: "8px", 
                        border: "none", 
                        background: view === "analytics" ? "#fff" : "transparent",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: view === "analytics" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        color: view === "analytics" ? "#1d1d1f" : "#86868b"
                    }}
                >
                    사이트 통계
                </button>
            </div>

            <div className="coach-dashboard-layout" style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem", minHeight: "70vh" }}>
                {/* Left: List View */}
                <aside className="coach-sidebar" style={{ background: "#fff", borderRadius: "24px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    {view === "students" ? (
                        <>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>수강생 목록 ({students.length})</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {students.map(student => {
                                    const activeEnrollment = student.enrollments.find((enrollment) =>
                                        enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT"
                                    ) || student.enrollments[0] || null;
                                    const lessonCount = activeEnrollment?._count.lessonAttendances || student._count.lessonAttendances || 0;
                                    const attendedToday = (activeEnrollment?.lessonAttendances || student.lessonAttendances)
                                        .some((attendance) => attendance.attendanceDate === todayKstDateKey);

                                    return (
                                        <button
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id)}
                                            style={{
                                                textAlign: "left",
                                                padding: "1rem",
                                                borderRadius: "16px",
                                                border: selectedStudentId === student.id ? "1px solid #FF9F0A" : "1px solid transparent",
                                                background: selectedStudentId === student.id ? "rgba(255, 159, 10, 0.05)" : "#f9f9fb",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start" }}>
                                                <div style={{ fontWeight: 700, color: "#1d1d1f" }}>{student.name}</div>
                                                <span style={{ flex: "0 0 auto", borderRadius: "999px", padding: "4px 8px", background: attendedToday ? "rgba(52,199,89,0.1)" : "#fff", color: attendedToday ? "#1d8f3f" : "#86868b", fontSize: "0.7rem", fontWeight: 900 }}>
                                                    {attendedToday ? "오늘 출석" : `${lessonCount}회`}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#86868b", marginTop: "4px" }}>
                                                {student.track?.name || "배정 대기"} • 과제 {student.assignments.length}개
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : view === "spark" ? (
                        <>
                            <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.35rem" }}>스파크 코너</h2>
                                <p style={{ fontSize: "0.82rem", color: "#86868b", lineHeight: 1.5 }}>
                                    스파크 코어 루틴을 스파크, 시그니처, 하이엔드 멤버에게 확장 운영하는 전용 보드입니다.
                                </p>
                            </div>
                            {sparkStudents.length === 0 ? (
                                <div style={{ padding: "1.2rem", borderRadius: "18px", background: "#f9f9fb", color: "#86868b", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                    아직 스파크 코어 루틴 운영 대상 수강생이 없습니다.
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ padding: "12px 14px", borderRadius: "18px", background: "linear-gradient(135deg, rgba(255,159,10,0.10), rgba(255,214,10,0.05))", border: "1px solid rgba(255,159,10,0.12)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                                            <div>
                                                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "4px", letterSpacing: "0.04em" }}>TARGET MEMBERS</div>
                                                <div style={{ fontWeight: 800, color: "#1d1d1f" }}>
                                                    {selectedSparkTargetCount}명 선택됨 / 전체 {sparkStudents.length}명
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <button
                                                    type="button"
                                                    onClick={selectAllSparkTargets}
                                                    style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "999px", padding: "8px 12px", fontWeight: 800, cursor: "pointer", fontSize: "0.78rem" }}
                                                >
                                                    전체 선택
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={clearSparkTargets}
                                                    style={{ background: "#fff", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "999px", padding: "8px 12px", fontWeight: 800, cursor: "pointer", fontSize: "0.78rem" }}
                                                >
                                                    선택 해제
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "0.78rem", color: "#6e6e73", lineHeight: 1.5 }}>
                                            멤버를 직접 체크해서 특정 그룹에게만 공통 루틴을 보낼 수 있습니다.
                                        </div>
                                    </div>

                                    {sparkStudents.map((student) => {
                                        const studentItems = getMissionPossibleItemsForStudent(student);
                                        const pendingCount = studentItems.filter((item) => !item.isCompleted).length;
                                        const todayCount = studentItems.filter((item) => item.releaseDateKey === todayKstDateKey).length;
                                        const isSelected = selectedSparkTargetIdSet.has(student.id);

                                        return (
                                            <button
                                                key={student.id}
                                                type="button"
                                                onClick={() => toggleSparkTarget(student.id)}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "1rem",
                                                    borderRadius: "18px",
                                                    border: isSelected ? "1px solid #FF9F0A" : "1px solid rgba(0,0,0,0.04)",
                                                    background: isSelected ? "linear-gradient(180deg, rgba(255,159,10,0.12), rgba(255,159,10,0.04))" : "#f9f9fb",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                borderRadius: "50%",
                                                                border: isSelected ? "none" : "1px solid rgba(0,0,0,0.12)",
                                                                background: isSelected ? "#FF9F0A" : "#fff",
                                                                color: "#fff",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "0.72rem",
                                                                fontWeight: 900,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {isSelected ? "✓" : ""}
                                                        </span>
                                                        <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{student.name}</div>
                                                    </div>
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.12)", padding: "5px 8px", borderRadius: "999px" }}>
                                                        {student.track?.name || "트랙 미배정"}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "#86868b", marginBottom: "8px" }}>{student.email}</div>
                                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                    <span style={{ fontSize: "0.72rem", color: "#1d1d1f", fontWeight: 700, background: "#fff", padding: "4px 8px", borderRadius: "999px" }}>
                                                        루틴 {studentItems.length}개
                                                    </span>
                                                    <span style={{ fontSize: "0.72rem", color: pendingCount > 0 ? "#ff3b30" : "#34C759", fontWeight: 700, background: pendingCount > 0 ? "rgba(255,59,48,0.08)" : "rgba(52,199,89,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                        대기 {pendingCount}개
                                                    </span>
                                                    <span style={{ fontSize: "0.72rem", color: "#007aff", fontWeight: 700, background: "rgba(0,122,255,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                        오늘 {todayCount}개
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : view === "analytics" ? (
                        <>
                            <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.35rem" }}>사이트 통계</h2>
                                <p style={{ fontSize: "0.82rem", color: "#86868b", lineHeight: 1.5 }}>
                                    최근 7일 공개 페이지 기준 방문 수와 진단 전환 흐름을 바로 볼 수 있습니다.
                                </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ padding: "1rem", borderRadius: "18px", background: "linear-gradient(135deg, rgba(0,122,255,0.08), rgba(255,255,255,1))", border: "1px solid rgba(0,122,255,0.08)" }}>
                                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#007aff", marginBottom: "6px", letterSpacing: "0.04em" }}>최근 7일</div>
                                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "4px" }}>
                                        {analyticsSummary.totals.pageViews}회 방문
                                    </div>
                                    <div style={{ fontSize: "0.82rem", color: "#6e6e73", lineHeight: 1.5 }}>
                                        유니크 방문자 {analyticsSummary.totals.uniqueVisitors}명 · 카카오 클릭 {analyticsSummary.totals.kakaoClicks}회
                                    </div>
                                </div>

                                <div style={{ display: "grid", gap: "10px" }}>
                                    {analyticsSummary.topPages.slice(0, 5).map((page) => (
                                        <div key={page.path} style={{ padding: "1rem", borderRadius: "18px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                                                <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{page.label}</div>
                                                <div style={{ fontSize: "0.76rem", color: "#86868b" }}>{page.path}</div>
                                            </div>
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <span style={{ fontSize: "0.72rem", color: "#1d1d1f", fontWeight: 700, background: "#fff", padding: "4px 8px", borderRadius: "999px" }}>
                                                    조회 {page.views}
                                                </span>
                                                <span style={{ fontSize: "0.72rem", color: "#007aff", fontWeight: 700, background: "rgba(0,122,255,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                    방문자 {page.uniqueVisitors}
                                                </span>
                                                <span style={{ fontSize: "0.72rem", color: "#34C759", fontWeight: 700, background: "rgba(52,199,89,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                    평균 체류 {formatAnalyticsDuration(page.averageStaySeconds)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>상담 신청 목록 ({consultations.length})</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {consultations.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedConsultationId(c.id)}
                                        style={{
                                            textAlign: "left",
                                            padding: "1rem",
                                            borderRadius: "16px",
                                            border: selectedConsultationId === c.id ? "1px solid #FF9F0A" : "1px solid transparent",
                                            background: selectedConsultationId === c.id ? "rgba(255, 159, 10, 0.05)" : "#f9f9fb",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, color: "#1d1d1f", display: "flex", justifyContent: "space-between" }}>
                                            {getConsultationDisplayName(c)}
                                            <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "10px", background: c.status === "PENDING" ? "#ff3b30" : "#86868b", color: "#fff" }}>{c.status}</span>
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#86868b", marginTop: "4px" }}>
                                            {c.type} • {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </aside>

                {/* Right: Detail View */}
                <main className="coach-main-panel" style={{ background: "#fff", borderRadius: "24px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    {view === "students" ? (
                        selectedStudent ? (
                            <div>
                                <div style={{ borderBottom: "1px solid #f5f5f7", paddingBottom: "1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <div>
                                        <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{selectedStudent.name} 님의 워크스페이스</h2>
                                        <p style={{ color: "#86868b" }}>이메일: {selectedStudent.email}</p>
                                        
                                        {/* Linked Consultation Data */}
                                        {(() => {
                                            const matchingConsultation = consultations.find(c => c.email?.toLowerCase() === selectedStudent.email?.toLowerCase());
                                            if (matchingConsultation) {
                                                return (
                                                    <div style={{ marginTop: "1rem", padding: "12px 18px", background: "rgba(52, 199, 89, 0.05)", borderRadius: "12px", border: "1px solid rgba(52, 199, 89, 0.1)", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                                                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#34C759" }}>신규 연동됨</span>
                                                        <span style={{ fontSize: "0.85rem", color: "#1d1d1f", fontWeight: 600 }}>진단 신청 내역이 발견되었습니다. ({matchingConsultation.type})</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#86868b" }}>현재 트랙:</span>
                                        <select 
                                            value={selectedStudent.trackId || ""} 
                                            onChange={(e) => assignTrack(selectedStudent.id, e.target.value)}
                                            disabled={isAssigningTrack}
                                            style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #f0f0f2", fontWeight: 600, fontSize: "0.9rem" }}
                                        >
                                            <option value="">-- 트랙 배정 --</option>
                                            <option value="track_spark">스파크 (DAILY)</option>
                                            <option value="track_focus">에센셜 (ESSENTIAL)</option>
                                            <option value="track_signature">시그니처 (SIGNATURE)</option>
                                            <option value="track_reserve">하이엔드 (HIGH-END)</option>
                                        </select>
                                        <span style={{
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                            color: isMissionPossibleTrackId(selectedStudent.trackId) ? "#FF9F0A" : "#86868b",
                                            background: isMissionPossibleTrackId(selectedStudent.trackId) ? "rgba(255,159,10,0.1)" : "#f5f5f7",
                                            padding: "8px 12px",
                                            borderRadius: "999px"
                                        }}>
                                            {isMissionPossibleTrackId(selectedStudent.trackId)
                                                ? "미션파서블 운영 포함 트랙"
                                                : "일반 미션 발행 가능"}
                                        </span>
                                    </div>
                                </div>
                                {isMissionPossibleTrackId(selectedStudent.trackId) && (
                                    <div style={{ marginBottom: "1.5rem", padding: "1rem 1.2rem", borderRadius: "18px", background: "linear-gradient(135deg, rgba(255,159,10,0.12), rgba(255,214,10,0.06))", border: "1px solid rgba(255,159,10,0.16)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                                        <div>
                                            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.04em" }}>SPARK CORNER</div>
                                            <div style={{ fontWeight: 800, color: "#1d1d1f", marginBottom: "4px" }}>이 멤버는 스파크 코어 루틴 운영 대상입니다.</div>
                                            <div style={{ fontSize: "0.85rem", color: "#48484a", lineHeight: 1.5 }}>
                                                미션파서블 캘린더, 오늘 릴리즈 현황, 대상 멤버 운영은 스파크 코너에서 더 빠르게 관리할 수 있습니다.
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setView("spark")}
                                            style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}
                                        >
                                            스파크 코너 열기
                                        </button>
                                    </div>
                                )}

                                <section style={{ marginBottom: "2rem", display: "grid", gap: "1rem" }}>
                                    <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)", gap: "1rem" }}>
                                        <div style={{ borderRadius: "26px", padding: "1.5rem", background: "linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)", color: "#fff", overflow: "hidden" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.3rem" }}>
                                                <div>
                                                    <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#FFB340", letterSpacing: "0.08em", marginBottom: "0.45rem" }}>MEMBER OS</div>
                                                    <h3 style={{ fontSize: "1.55rem", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: "0.5rem" }}>회원 운영 상태</h3>
                                                    <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.65, fontSize: "0.92rem", maxWidth: "620px" }}>
                                                        결제, 루틴, 체크인, 피드백 흐름을 한 자리에서 확인합니다.
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignContent: "flex-start" }}>
                                                    <span style={{ padding: "8px 11px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.78rem", fontWeight: 900 }}>
                                                        {selectedActiveEnrollment ? enrollmentStatusLabels[selectedActiveEnrollment.status] || selectedActiveEnrollment.status : "등록 전"}
                                                    </span>
                                                    <span style={{ padding: "8px 11px", borderRadius: "999px", background: selectedActiveEnrollment?.paymentStatus === "PAID" ? "rgba(52,199,89,0.18)" : "rgba(255,159,10,0.16)", color: selectedActiveEnrollment?.paymentStatus === "PAID" ? "#8ff0a4" : "#FFB340", fontSize: "0.78rem", fontWeight: 900 }}>
                                                        {selectedActiveEnrollment ? paymentStatusLabels[selectedActiveEnrollment.paymentStatus] || selectedActiveEnrollment.paymentStatus : "결제 미확인"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="member-os-metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px", marginBottom: "1.2rem" }}>
                                                {[
                                                    { label: "레슨 회차", value: `${selectedLessonAttendanceCount}회`, hint: selectedTodayLessonAttendance ? `오늘 ${selectedTodayLessonAttendance.lessonNumber || selectedLessonAttendanceCount}회차 출석` : "오늘 미출석" },
                                                    { label: "열린 루틴", value: `${selectedOpenRoutines.length}개`, hint: "지금 진행 가능" },
                                                    { label: "완료 루틴", value: `${selectedCompletedRoutineCount}개`, hint: `전체 ${selectedStudent.dailyRoutines.length}개` },
                                                    { label: "최근 체크인", value: getRelativeDaysLabel(selectedLatestCheckIn?.createdAt), hint: selectedLatestCheckIn ? checkInConditionLabels[selectedLatestCheckIn.condition] || selectedLatestCheckIn.condition : "대기 중" },
                                                    { label: "최근 리포트", value: getRelativeDaysLabel(selectedLatestWeeklyReport?.weekStart), hint: selectedLatestWeeklyReport?.summaryTitle || "미작성" },
                                                ].map((item) => (
                                                    <div key={item.label} style={{ padding: "1rem", borderRadius: "18px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.58)", fontWeight: 800, marginBottom: "0.35rem" }}>{item.label}</div>
                                                        <div style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: "0.25rem" }}>{item.value}</div>
                                                        <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.35 }}>{item.hint}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ display: "grid", gap: "0.65rem" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.8rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.76)" }}>
                                                    <span style={{ color: "rgba(255,255,255,0.48)", fontWeight: 800 }}>프로그램</span>
                                                    <span>{selectedActiveEnrollment?.programName || selectedStudent.track?.name || "트랙 배정 대기"}</span>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.8rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.76)" }}>
                                                    <span style={{ color: "rgba(255,255,255,0.48)", fontWeight: 800 }}>생활 앵커</span>
                                                    <span>{selectedActiveEnrollment?.practiceAnchor || selectedStudent.memberProfile?.practiceAnchor || "아직 정하지 않음"}</span>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.8rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.76)" }}>
                                                    <span style={{ color: "rgba(255,255,255,0.48)", fontWeight: 800 }}>1차 목표</span>
                                                    <span>{selectedActiveEnrollment?.primaryGoal || selectedStudent.memberProfile?.primaryGoal || "목표 기록 대기"}</span>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.8rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.76)" }}>
                                                    <span style={{ color: "rgba(255,255,255,0.48)", fontWeight: 800 }}>운영 기간</span>
                                                    <span>{selectedActiveEnrollment ? `${formatKstDate(selectedActiveEnrollment.startDate)} - ${formatKstDate(selectedActiveEnrollment.expectedEndDate)}` : "등록 정보 없음"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ borderRadius: "26px", padding: "1.35rem", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)", display: "grid", gap: "1rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#007aff", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>TODAY CARE</div>
                                                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "0.4rem" }}>오늘 챙길 회원 액션</h3>
                                                <p style={{ color: "#6e6e73", fontSize: "0.88rem", lineHeight: 1.55 }}>
                                                    루틴이 열려 있으면 링크를 보내고, 체크인이 없으면 짧게 안부를 남기세요.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => createMemberInvite(selectedStudent.id, selectedStudent.name || "회원")}
                                                disabled={isCreatingMemberInvite}
                                                style={{ border: "none", borderRadius: "14px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isCreatingMemberInvite ? 0.7 : 1 }}
                                            >
                                                {isCreatingMemberInvite ? "초대 준비 중..." : "회원 초대 링크 복사"}
                                            </button>
                                            <div style={{ padding: "0.9rem 1rem", borderRadius: "18px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", color: "#6e6e73", fontSize: "0.84rem", lineHeight: 1.55 }}>
                                                {selectedLatestInvite
                                                    ? selectedLatestInvite.acceptedAt
                                                        ? `초대 수락 완료 · ${formatKstDateTime(selectedLatestInvite.acceptedAt)}`
                                                        : `최근 초대 생성 · ${formatKstDateTime(selectedLatestInvite.createdAt)}`
                                                    : "아직 생성된 초대 링크가 없습니다."}
                                            </div>
                                            <div style={{ padding: "1rem", borderRadius: "20px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", display: "grid", gap: "0.85rem" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start" }}>
                                                    <div>
                                                        <div style={{ fontSize: "0.72rem", color: "#007aff", fontWeight: 900, letterSpacing: "0.07em", marginBottom: "0.35rem" }}>LESSON QR</div>
                                                        <div style={{ fontSize: "0.98rem", color: "#1d1d1f", fontWeight: 900, lineHeight: 1.35 }}>오늘 출석 자동 기록</div>
                                                    </div>
                                                    <span style={{ borderRadius: "999px", background: selectedTodayLessonAttendance ? "rgba(52,199,89,0.1)" : "rgba(255,159,10,0.1)", color: selectedTodayLessonAttendance ? "#1d8f3f" : "#bf6a02", padding: "6px 9px", fontSize: "0.72rem", fontWeight: 900 }}>
                                                        {selectedTodayLessonAttendance ? "오늘 완료" : "오늘 대기"}
                                                    </span>
                                                </div>
                                                {lessonQr ? (
                                                    <>
                                                        <div style={{ display: "grid", gridTemplateColumns: "112px 1fr", gap: "0.85rem", alignItems: "center" }}>
                                                            <Image
                                                                src={lessonQr.qrDataUrl}
                                                                alt="오늘 레슨 출석 QR"
                                                                width={112}
                                                                height={112}
                                                                unoptimized
                                                                style={{ width: "112px", height: "112px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.06)", background: "#fff" }}
                                                            />
                                                            <div style={{ display: "grid", gap: "0.45rem" }}>
                                                                <div style={{ color: "#48484a", fontSize: "0.84rem", lineHeight: 1.5 }}>
                                                                    현장 출석용 · {selectedTodayLessonAttendance ? `${selectedTodayLessonAttendance.lessonNumber || selectedLessonAttendanceCount}회차 완료` : "대기"}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={copyLessonQrLink}
                                                                    disabled={isCopyingLessonQrLink}
                                                                    style={{ border: "none", borderRadius: "12px", padding: "10px 12px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isCopyingLessonQrLink ? 0.7 : 1 }}
                                                                >
                                                                    {isCopyingLessonQrLink ? "복사 중..." : "출석 링크 복사"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div style={{ color: "#86868b", fontSize: "0.78rem", lineHeight: 1.45 }}>
                                                            QR 날짜: {formatDateKeyWithWeekday(lessonQr.dateKey)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div style={{ color: lessonQrError ? "#d70015" : "#86868b", fontSize: "0.84rem", lineHeight: 1.55 }}>
                                                        {lessonQrError || "오늘 레슨 QR을 준비하고 있습니다."}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: "grid", gap: "10px" }}>
                                                {selectedOpenRoutines.length === 0 ? (
                                                    <div style={{ padding: "1rem", borderRadius: "18px", background: "#fff", color: "#86868b", fontSize: "0.88rem", lineHeight: 1.55 }}>
                                                        지금 열려 있는 루틴은 없습니다. 아래 Routine Studio에서 오늘 루틴을 발행할 수 있습니다.
                                                    </div>
                                                ) : (
                                                    selectedOpenRoutines.slice(0, 3).map((routine) => (
                                                        <div key={routine.id} style={{ padding: "1rem", borderRadius: "18px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.45rem" }}>
                                                                <div style={{ fontWeight: 900, color: "#1d1d1f" }}>{routine.title}</div>
                                                                <span style={{ color: "#FF9F0A", fontSize: "0.76rem", fontWeight: 900 }}>{routine.status}</span>
                                                            </div>
                                                            <div style={{ color: "#6e6e73", fontSize: "0.8rem", marginBottom: "0.65rem" }}>{formatRoutineDateRange(routine.availableFrom, routine.expiresAt)}</div>
                                                            {routine.assignment && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyAssignmentAccessLink(routine.assignment!.id, selectedStudent.name || "회원")}
                                                                    disabled={copyingLinkAssignmentId === routine.assignment.id}
                                                                    style={{ width: "100%", border: "none", borderRadius: "12px", padding: "10px 12px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer" }}
                                                                >
                                                                    {copyingLinkAssignmentId === routine.assignment.id ? "링크 준비 중..." : "오늘 루틴 링크 복사"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderRadius: "26px", padding: "1.45rem", background: "linear-gradient(135deg, rgba(0,122,255,0.08), rgba(255,255,255,1))", border: "1px solid rgba(0,122,255,0.12)", boxShadow: "0 8px 30px rgba(0,0,0,0.025)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#007aff", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>PROJECT GOJO</div>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>Routine Recommendation Engine</h3>
                                                <p style={{ color: "#6e6e73", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "720px" }}>
                                                    Kakashi 회원 상태를 읽고, Obiwan 보컬 신호가 있으면 함께 반영해 오늘의 루틴 후보와 추천 근거를 만듭니다.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => generateGojoRecommendationForStudent(selectedStudent.id)}
                                                disabled={isGeneratingGojoRecommendation}
                                                style={{ border: "none", borderRadius: "14px", padding: "12px 16px", background: "#007aff", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isGeneratingGojoRecommendation ? 0.7 : 1 }}
                                            >
                                                {isGeneratingGojoRecommendation ? "Gojo 판단 중..." : "Gojo 추천 생성"}
                                            </button>
                                        </div>

                                        {selectedLatestGojoRecommendation ? (
                                            <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 0.52fr)", gap: "1rem", alignItems: "stretch" }}>
                                                <div style={{ borderRadius: "20px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", padding: "1.15rem" }}>
                                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                                                        <span style={{ borderRadius: "999px", background: "rgba(0,122,255,0.08)", color: "#007aff", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 900 }}>
                                                            {gojoRecommendationStatusLabels[selectedLatestGojoRecommendation.status] || selectedLatestGojoRecommendation.status}
                                                        </span>
                                                        <span style={{ borderRadius: "999px", background: selectedLatestGojoRecommendation.automationMode === "AUTO_PUBLISH" ? "rgba(52,199,89,0.12)" : "rgba(255,159,10,0.12)", color: selectedLatestGojoRecommendation.automationMode === "AUTO_PUBLISH" ? "#1d8f3f" : "#bf6a02", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 900 }}>
                                                            {gojoAutomationLabels[selectedLatestGojoRecommendation.automationMode] || selectedLatestGojoRecommendation.automationMode}
                                                        </span>
                                                        {selectedGojoSignals?.sourceProjects?.map((source) => (
                                                            <span key={source} style={{ borderRadius: "999px", background: "#f5f5f7", color: "#48484a", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 900 }}>
                                                                {source}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h4 style={{ fontSize: "1.28rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "0.45rem", lineHeight: 1.3 }}>
                                                        {selectedLatestGojoRecommendation.title}
                                                    </h4>
                                                    <p style={{ color: "#48484a", fontSize: "0.92rem", lineHeight: 1.65, whiteSpace: "pre-wrap", marginBottom: "0.9rem" }}>
                                                        {selectedLatestGojoRecommendation.memberMemo}
                                                    </p>
                                                    <div style={{ padding: "0.95rem", borderRadius: "16px", background: "#f9f9fb", color: "#6e6e73", fontSize: "0.86rem", lineHeight: 1.6 }}>
                                                        <strong style={{ color: "#1d1d1f" }}>추천 근거</strong>
                                                        <br />
                                                        {selectedLatestGojoRecommendation.rationale}
                                                    </div>
                                                </div>

                                                <div style={{ borderRadius: "20px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
                                                    <div>
                                                        <div style={{ fontSize: "0.74rem", color: "#86868b", fontWeight: 900, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>HARNESS SIGNALS</div>
                                                        <div style={{ color: "#1d1d1f", fontWeight: 900, fontSize: "0.95rem", marginBottom: "0.35rem" }}>
                                                            {selectedGojoSignals?.trigger || "DAILY"}
                                                        </div>
                                                        <div style={{ color: "#6e6e73", fontSize: "0.84rem", lineHeight: 1.5 }}>
                                                            {selectedGojoSignals?.labels?.join(" · ") || "Kakashi 회원 상태 기준"}
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: "0.9rem", borderRadius: "16px", background: "#f9f9fb", color: "#6e6e73", fontSize: "0.84rem", lineHeight: 1.55 }}>
                                                        {selectedLatestObiwanSignal
                                                            ? `최근 Obiwan 신호: ${selectedLatestObiwanSignal.summary || "분석 신호 수신됨"}`
                                                            : "아직 Obiwan 신호는 없습니다. 지금은 Kakashi 운영 데이터만으로 추천합니다."}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => applyGojoRecommendationToRoutineStudio(selectedLatestGojoRecommendation)}
                                                        disabled={selectedLatestGojoRecommendation.status === "PUBLISHED"}
                                                        style={{ border: "none", borderRadius: "13px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: selectedLatestGojoRecommendation.status === "PUBLISHED" ? "not-allowed" : "pointer", opacity: selectedLatestGojoRecommendation.status === "PUBLISHED" ? 0.55 : 1 }}
                                                    >
                                                        Routine Studio로 불러오기
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => publishGojoRecommendationForStudent(selectedLatestGojoRecommendation)}
                                                        disabled={selectedLatestGojoRecommendation.status === "PUBLISHED" || publishingGojoRecommendationId === selectedLatestGojoRecommendation.id}
                                                        style={{ border: "1px solid rgba(0,122,255,0.18)", borderRadius: "13px", padding: "12px 14px", background: "#fff", color: "#007aff", fontWeight: 900, cursor: selectedLatestGojoRecommendation.status === "PUBLISHED" ? "not-allowed" : "pointer", opacity: publishingGojoRecommendationId === selectedLatestGojoRecommendation.id || selectedLatestGojoRecommendation.status === "PUBLISHED" ? 0.6 : 1 }}
                                                    >
                                                        {publishingGojoRecommendationId === selectedLatestGojoRecommendation.id ? "발행 중..." : "Gojo 추천 바로 발행"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ borderRadius: "20px", background: "#fff", border: "1px dashed rgba(0,122,255,0.18)", padding: "1rem", color: "#6e6e73", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                                아직 생성된 Gojo 추천이 없습니다. 추천을 생성하면 오늘 루틴 후보, 추천 근거, 자동화 모드가 여기에 표시됩니다.
                                            </div>
                                        )}
                                    </div>

                                    {selectedActiveEnrollment && selectedPaymentDraft && (
                                        <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)", gap: "1rem" }}>
                                            <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#34C759", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>PAYMENT LEDGER</div>
                                                <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>결제 기록</h3>
                                                <div style={{ display: "grid", gap: "10px" }}>
                                                    <select
                                                        value={selectedPaymentDraft.status}
                                                        onChange={(event) => updatePaymentDraft(selectedActiveEnrollment.id, { status: event.target.value })}
                                                        style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 800, background: "#fff" }}
                                                    >
                                                        {Object.entries(paymentStatusLabels).map(([id, label]) => (
                                                            <option key={id} value={id}>{label}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        value={selectedPaymentDraft.amountKrw}
                                                        onChange={(event) => updatePaymentDraft(selectedActiveEnrollment.id, { amountKrw: event.target.value })}
                                                        placeholder="금액 (원)"
                                                        inputMode="numeric"
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                    />
                                                    <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                                        <input
                                                            type="date"
                                                            value={selectedPaymentDraft.dueDate}
                                                            onChange={(event) => updatePaymentDraft(selectedActiveEnrollment.id, { dueDate: event.target.value })}
                                                            style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                        />
                                                        <input
                                                            type="date"
                                                            value={selectedPaymentDraft.paidAt}
                                                            onChange={(event) => updatePaymentDraft(selectedActiveEnrollment.id, { paidAt: event.target.value })}
                                                            style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                        />
                                                    </div>
                                                    <input
                                                        value={selectedPaymentDraft.note}
                                                        onChange={(event) => updatePaymentDraft(selectedActiveEnrollment.id, { note: event.target.value })}
                                                        placeholder="결제 메모"
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => savePaymentRecord(selectedActiveEnrollment.id)}
                                                        disabled={isSavingPaymentRecord}
                                                        style={{ border: "none", borderRadius: "12px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isSavingPaymentRecord ? 0.7 : 1 }}
                                                    >
                                                        {isSavingPaymentRecord ? "저장 중..." : "결제 기록 저장"}
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#86868b", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>PAYMENT HISTORY</div>
                                                <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>최근 결제 메모</h3>
                                                <div style={{ display: "grid", gap: "10px" }}>
                                                    {selectedActiveEnrollment.paymentRecords.length === 0 ? (
                                                        <div style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", color: "#86868b", fontSize: "0.88rem" }}>
                                                            아직 결제 기록이 없습니다.
                                                        </div>
                                                    ) : (
                                                        selectedActiveEnrollment.paymentRecords.slice(0, 5).map((record) => (
                                                            <div key={record.id} style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.35rem" }}>
                                                                    <div style={{ fontWeight: 900, color: "#1d1d1f" }}>{paymentStatusLabels[record.status] || record.status}</div>
                                                                    <div style={{ color: "#86868b", fontSize: "0.78rem" }}>{formatKstDate(record.createdAt)}</div>
                                                                </div>
                                                                <div style={{ color: "#48484a", fontSize: "0.88rem", lineHeight: 1.55 }}>
                                                                    {record.amountKrw ? `${record.amountKrw.toLocaleString("ko-KR")}원` : "금액 미기재"}
                                                                    {record.note ? ` · ${record.note}` : ""}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ borderRadius: "26px", padding: "1.45rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 28px rgba(0,0,0,0.025)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#007aff", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>LESSON LEDGER</div>
                                                <h3 style={{ fontSize: "1.18rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "0.45rem" }}>자동 회차 장부</h3>
                                                <p style={{ color: "#6e6e73", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                                    등록/출석 현황과 최근 회차 기록입니다.
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <span style={{ padding: "8px 11px", borderRadius: "999px", background: "#f5f5f7", color: "#48484a", fontSize: "0.78rem", fontWeight: 900 }}>
                                                    등록일 {selectedActiveEnrollment ? formatKstDate(selectedActiveEnrollment.startDate || selectedActiveEnrollment.createdAt) : "대기"}
                                                </span>
                                                <span style={{ padding: "8px 11px", borderRadius: "999px", background: selectedTodayLessonAttendance ? "rgba(52,199,89,0.1)" : "rgba(255,159,10,0.1)", color: selectedTodayLessonAttendance ? "#1d8f3f" : "#bf6a02", fontSize: "0.78rem", fontWeight: 900 }}>
                                                    {selectedTodayLessonAttendance ? `오늘 ${selectedTodayLessonAttendance.lessonNumber || selectedLessonAttendanceCount}회차` : "오늘 미출석"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1rem", alignItems: "start" }}>
                                            <div style={{ borderRadius: "20px", background: "#f9f9fb", padding: "1.1rem", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                <div style={{ color: "#86868b", fontSize: "0.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>현재 과정 누적</div>
                                                <div style={{ color: "#1d1d1f", fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.4rem" }}>{selectedLessonAttendanceCount}회</div>
                                                <div style={{ color: "#6e6e73", fontSize: "0.84rem", lineHeight: 1.55 }}>
                                                    {selectedActiveEnrollment?.programName || selectedStudent.track?.name || "등록된 프로그램"}
                                                </div>
                                            </div>

                                            <div style={{ display: "grid", gap: "10px" }}>
                                                {selectedLessonAttendances.length === 0 ? (
                                                    <div style={{ padding: "1rem", borderRadius: "18px", background: "#f9f9fb", border: "1px dashed rgba(0,0,0,0.08)", color: "#86868b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                                        아직 레슨 출석 기록이 없습니다. 첫 출석 대기 상태입니다.
                                                    </div>
                                                ) : (
                                                    selectedLessonAttendances.slice(0, 8).map((attendance, index) => (
                                                        <div key={attendance.id} style={{ display: "grid", gridTemplateColumns: "86px 1fr auto", gap: "0.75rem", alignItems: "center", padding: "0.9rem 1rem", borderRadius: "18px", background: index === 0 ? "rgba(0,122,255,0.06)" : "#f9f9fb", border: `1px solid ${index === 0 ? "rgba(0,122,255,0.12)" : "rgba(0,0,0,0.04)"}` }}>
                                                            <div style={{ color: "#007aff", fontWeight: 900 }}>{attendance.lessonNumber ? `${attendance.lessonNumber}회차` : `${selectedLessonAttendanceCount - index}회차`}</div>
                                                            <div>
                                                                <div style={{ color: "#1d1d1f", fontWeight: 900, marginBottom: "0.25rem" }}>{formatDateKeyWithWeekday(attendance.attendanceDate)}</div>
                                                                <div style={{ color: "#86868b", fontSize: "0.78rem" }}>{formatKstDateTime(attendance.checkedInAt)}</div>
                                                            </div>
                                                            <span style={{ borderRadius: "999px", background: attendance.source === "QR" ? "rgba(52,199,89,0.1)" : "#f1f1f4", color: attendance.source === "QR" ? "#1d8f3f" : "#6e6e73", padding: "6px 9px", fontSize: "0.72rem", fontWeight: 900 }}>
                                                                {attendance.source === "QR" ? "QR" : attendance.source}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "1rem" }}>
                                        <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#FF9F0A", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>CHECK-IN STREAM</div>
                                            <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>최근 체크인</h3>
                                            <div style={{ display: "grid", gap: "10px" }}>
                                                {selectedStudent.checkIns.length === 0 ? (
                                                    <div style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", color: "#86868b", fontSize: "0.88rem" }}>
                                                        아직 회원 체크인이 없습니다.
                                                    </div>
                                                ) : (
                                                    selectedStudent.checkIns.slice(0, 5).map((checkIn) => (
                                                        <div key={checkIn.id} style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                                                                <div style={{ fontWeight: 900, color: checkIn.practicedToday ? "#34C759" : "#86868b" }}>
                                                                    {checkIn.practicedToday ? "연습 완료" : "상태 기록"}
                                                                </div>
                                                                <div style={{ color: "#86868b", fontSize: "0.78rem" }}>{formatKstDateTime(checkIn.createdAt)}</div>
                                                            </div>
                                                            <div style={{ color: "#1d1d1f", fontSize: "0.88rem", lineHeight: 1.55 }}>
                                                                {checkInConditionLabels[checkIn.condition] || checkIn.condition}
                                                                {checkIn.memo ? ` · ${checkIn.memo}` : ""}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#007aff", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>WEEKLY REPORT</div>
                                            <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>주간 리포트 작성</h3>
                                            {selectedLatestWeeklyReport && (
                                                <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(0,122,255,0.06)", border: "1px solid rgba(0,122,255,0.08)", marginBottom: "1rem" }}>
                                                    <div style={{ fontWeight: 900, color: "#1d1d1f", marginBottom: "0.35rem" }}>{selectedLatestWeeklyReport.summaryTitle}</div>
                                                    <div style={{ color: "#6e6e73", fontSize: "0.86rem", lineHeight: 1.55 }}>{selectedLatestWeeklyReport.summaryBody}</div>
                                                </div>
                                            )}
                                            {selectedWeeklyReportDraft && (
                                                <div style={{ display: "grid", gap: "10px" }}>
                                                    <input
                                                        value={selectedWeeklyReportDraft.summaryTitle}
                                                        onChange={(event) => updateWeeklyReportDraft(selectedStudent.id, { summaryTitle: event.target.value })}
                                                        placeholder="리포트 제목"
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 800 }}
                                                    />
                                                    <textarea
                                                        value={selectedWeeklyReportDraft.summaryBody}
                                                        onChange={(event) => updateWeeklyReportDraft(selectedStudent.id, { summaryBody: event.target.value })}
                                                        placeholder="이번 주 연습 리듬, 좋아진 점, 놓친 지점을 짧게 정리"
                                                        style={{ width: "100%", minHeight: "92px", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", resize: "vertical", lineHeight: 1.55 }}
                                                    />
                                                    <input
                                                        value={selectedWeeklyReportDraft.nextFocus}
                                                        onChange={(event) => updateWeeklyReportDraft(selectedStudent.id, { nextFocus: event.target.value })}
                                                        placeholder="다음 주 초점"
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => saveWeeklyReport(selectedStudent.id)}
                                                        disabled={isSavingWeeklyReport}
                                                        style={{ border: "none", borderRadius: "12px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isSavingWeeklyReport ? 0.7 : 1 }}
                                                    >
                                                        {isSavingWeeklyReport ? "저장 중..." : "주간 리포트 저장"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="member-os-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "1rem" }}>
                                        <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#34C759", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>CONTACT LOG</div>
                                            <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>연락 기록 남기기</h3>
                                            {selectedContactDraft && (
                                                <div style={{ display: "grid", gap: "10px" }}>
                                                    <select
                                                        value={selectedContactDraft.channel}
                                                        onChange={(event) => updateContactDraft(selectedStudent.id, { channel: event.target.value })}
                                                        style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 800, background: "#fff" }}
                                                    >
                                                        {contactChannelOptions.map((channel) => (
                                                            <option key={channel.id} value={channel.id}>{channel.label}</option>
                                                        ))}
                                                    </select>
                                                    <textarea
                                                        value={selectedContactDraft.summary}
                                                        onChange={(event) => updateContactDraft(selectedStudent.id, { summary: event.target.value })}
                                                        placeholder="예: 오늘 루틴 링크 전달, 목 상태 확인"
                                                        style={{ width: "100%", minHeight: "82px", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", resize: "vertical", lineHeight: 1.55 }}
                                                    />
                                                    <input
                                                        value={selectedContactDraft.nextAction}
                                                        onChange={(event) => updateContactDraft(selectedStudent.id, { nextAction: event.target.value })}
                                                        placeholder="다음 액션 (선택)"
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => saveContactLog(selectedStudent.id)}
                                                        disabled={isSavingContactLog}
                                                        style={{ border: "none", borderRadius: "12px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isSavingContactLog ? 0.7 : 1 }}
                                                    >
                                                        {isSavingContactLog ? "저장 중..." : "연락 기록 저장"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#86868b", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>RECENT CONTACTS</div>
                                            <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>최근 운영 메모</h3>
                                            <div style={{ display: "grid", gap: "10px" }}>
                                                {selectedStudent.contactLogs.length === 0 ? (
                                                    <div style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", color: "#86868b", fontSize: "0.88rem" }}>
                                                        아직 코치 연락 기록이 없습니다.
                                                    </div>
                                                ) : (
                                                    selectedStudent.contactLogs.slice(0, 5).map((log) => (
                                                        <div key={log.id} style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                                                                <div style={{ fontWeight: 900, color: "#1d1d1f" }}>{contactChannelOptions.find((channel) => channel.id === log.channel)?.label || log.channel}</div>
                                                                <div style={{ color: "#86868b", fontSize: "0.78rem" }}>{formatKstDateTime(log.createdAt)}</div>
                                                            </div>
                                                            <div style={{ color: "#48484a", fontSize: "0.88rem", lineHeight: 1.55 }}>{log.summary}</div>
                                                            {log.nextAction && (
                                                                <div style={{ marginTop: "0.5rem", color: "#007aff", fontSize: "0.82rem", fontWeight: 800 }}>다음: {log.nextAction}</div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderRadius: "24px", padding: "1.35rem", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 24px rgba(0,0,0,0.025)" }}>
                                        <div style={{ fontSize: "0.76rem", fontWeight: 900, color: "#FF9F0A", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>ROUTINE HISTORY</div>
                                        <h3 style={{ fontSize: "1.12rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "1rem" }}>최근 루틴 운영</h3>
                                        <div className="member-routine-list" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                                            {selectedRecentRoutines.length === 0 ? (
                                                <div style={{ gridColumn: "1 / -1", padding: "1rem", borderRadius: "16px", background: "#f9f9fb", color: "#86868b", fontSize: "0.88rem" }}>
                                                    아직 DailyRoutine 기록이 없습니다. 아래 Routine Studio로 오늘 루틴을 발행해 주세요.
                                                </div>
                                            ) : (
                                                selectedRecentRoutines.map((routine) => (
                                                    <div key={routine.id} style={{ padding: "1rem", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                                        <div style={{ fontSize: "0.74rem", fontWeight: 900, color: routine.status === "COMPLETED" ? "#34C759" : routine.status === "SCHEDULED" ? "#007aff" : "#FF9F0A", marginBottom: "0.4rem" }}>{routine.status}</div>
                                                        <div style={{ fontWeight: 900, color: "#1d1d1f", lineHeight: 1.35, marginBottom: "0.45rem" }}>{routine.title}</div>
                                                        <div style={{ color: "#86868b", fontSize: "0.78rem", lineHeight: 1.45 }}>{formatRoutineDateRange(routine.availableFrom, routine.expiresAt)}</div>
                                                        {routine.assignment?.audioFileUrl && (
                                                            <div style={{ marginTop: "0.75rem" }}>
                                                                <audio src={buildAssignmentAudioUrl(routine.assignment.id)} controls style={{ width: "100%", height: "34px" }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </section>
                                
                                {/* New Assignment Form */}
                                <div style={{ background: "#f9f9fb", padding: "1.5rem", borderRadius: "24px", marginBottom: "3rem", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.2rem" }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.35rem" }}>Routine Studio</h3>
                                            <p style={{ color: "#86868b", fontSize: "0.9rem", lineHeight: 1.5 }}>
                                                상담 목적, 최근 녹음, 체크인 컨디션, 생활 앵커, 다음 레슨 포인트를 기준으로 오늘 하나의 루틴만 고릅니다. 회원 화면에는 그 한 가지 행동만 먼저 보입니다.
                                            </p>
                                        </div>
                                        <div style={{ background: "#fff", borderRadius: "16px", padding: "12px 14px", minWidth: "220px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#86868b", marginBottom: "6px", letterSpacing: "0.04em" }}>운영 현황</div>
                                            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1d1d1f" }}>{selectedStudentMissionPossibleAssignments.length}개</div>
                                            <div style={{ fontSize: "0.8rem", color: "#86868b", marginTop: "4px" }}>배정된 미션파서블 루틴</div>
                                        </div>
                                    </div>
                                    <div className="routine-template-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px", marginBottom: "15px" }}>
                                        <select
                                            defaultValue=""
                                            onChange={(event) => {
                                                if (event.target.value) {
                                                    applyRoutineTemplate(event.target.value);
                                                }
                                            }}
                                            style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff", fontWeight: 800 }}
                                        >
                                            <option value="">저장된 루틴 템플릿 불러오기</option>
                                            {routineTemplates.map((template) => (
                                                <option key={template.id} value={template.id}>
                                                    {template.title}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={saveRoutineTemplate}
                                            disabled={isSavingRoutineTemplate}
                                            style={{ border: "none", borderRadius: "12px", padding: "12px 16px", background: "#fff", color: "#1d1d1f", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", opacity: isSavingRoutineTemplate ? 0.7 : 1 }}
                                        >
                                            {isSavingRoutineTemplate ? "저장 중..." : "템플릿 저장"}
                                        </button>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "10px", marginBottom: "15px" }}>
                                        <input 
                                            placeholder="미션 제목 (예: 1주차 코어 호흡)" 
                                            value={newMission.title}
                                            onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                                            style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #e5e5e7" }}
                                        />
                                        <input 
                                            placeholder="설명 (선택)" 
                                            value={newMission.description}
                                            onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                                            style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #e5e5e7" }}
                                        />
                                        <input 
                                            placeholder="주차" 
                                            type="number"
                                            value={newMission.weekNumber}
                                            onChange={(e) => setNewMission({ ...newMission, weekNumber: e.target.value })}
                                            style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #e5e5e7" }}
                                        />
                                    </div>

                                    {renderScaleGuideConfigurator({
                                        mission: newMission,
                                        onMissionChange: (patch) => setNewMission((current) => ({ ...current, ...patch })),
                                    })}

                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem", padding: "12px", background: isMissionPossible ? "rgba(255, 159, 10, 0.1)" : "#fff", borderRadius: "14px", border: "1px solid", borderColor: isMissionPossible ? "#FF9F0A" : "#e5e5e7", transition: "all 0.3s ease" }}>
                                        <input 
                                            type="checkbox" 
                                            id="missionPossible"
                                            checked={isMissionPossible}
                                            onChange={(e) => setIsMissionPossible(e.target.checked)}
                                            style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                        />
                                        <label htmlFor="missionPossible" style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 800, color: isMissionPossible ? "#FF9F0A" : "#1d1d1f", fontSize: "0.95rem" }}>
                                                미션파서블 운영 활성화 (24시간 한정)
                                            </span>
                                            <span style={{ fontSize: "0.75rem", color: "#86868b" }}>
                                                이 미션은 한국 시간 기준 오전 09:00에 열리고 다음날 오전 06:00까지만 접근 및 제출 가능합니다.
                                            </span>
                                        </label>
                                    </div>

                                    {isMissionPossible && (
                                        <div className="mission-planner-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                                            <div style={{ background: "#fff", borderRadius: "20px", padding: "1rem", border: "1px solid rgba(0,0,0,0.06)" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                                    <div>
                                                        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#86868b", marginBottom: "4px", letterSpacing: "0.04em" }}>월간 운영 보드</div>
                                                        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1d1d1f" }}>{getMonthLabel(calendarMonthKey)}</div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCalendarMonthKey(shiftMonthKey(calendarMonthKey, -1))}
                                                            style={{ background: "#f5f5f7", border: "none", borderRadius: "10px", padding: "8px 10px", cursor: "pointer", fontWeight: 700 }}
                                                        >
                                                            ←
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCalendarMonthKey(shiftMonthKey(calendarMonthKey, 1))}
                                                            style={{ background: "#f5f5f7", border: "none", borderRadius: "10px", padding: "8px 10px", cursor: "pointer", fontWeight: 700 }}
                                                        >
                                                            →
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px", marginBottom: "8px" }}>
                                                    {weekdayLabels.map((weekday) => (
                                                        <div key={weekday} style={{ textAlign: "center", fontSize: "0.75rem", color: "#86868b", fontWeight: 700 }}>
                                                            {weekday}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px" }}>
                                                    {calendarCells.map((cell, index) => {
                                                        if (!cell) {
                                                            return <div key={`empty-${index}`} style={{ minHeight: "112px", borderRadius: "16px", background: "rgba(0,0,0,0.02)" }} />;
                                                        }

                                                        const dailyAssignments = missionPossibleAssignmentsByDate[cell.dateKey] || [];
                                                        const isSelected = cell.dateKey === missionPossibleDate;

                                                        return (
                                                            <button
                                                                key={cell.dateKey}
                                                                type="button"
                                                                onClick={() => handleMissionPossibleDateChange(cell.dateKey)}
                                                                style={{
                                                                    minHeight: "112px",
                                                                    borderRadius: "16px",
                                                                    border: isSelected ? "1px solid #FF9F0A" : "1px solid rgba(0,0,0,0.06)",
                                                                    background: isSelected ? "rgba(255,159,10,0.08)" : "#fff",
                                                                    padding: "10px",
                                                                    textAlign: "left",
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "8px"
                                                                }}
                                                            >
                                                                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1d1d1f" }}>{cell.day}</div>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                                    {dailyAssignments.slice(0, 2).map((assignment) => (
                                                                        <div
                                                                            key={assignment.id}
                                                                            style={{
                                                                            fontSize: "0.68rem",
                                                                            fontWeight: 700,
                                                                            color: assignment.isCompleted ? "#1d1d1f" : "#FF9F0A",
                                                                            background: assignment.isCompleted ? "rgba(29,29,31,0.08)" : "rgba(255,159,10,0.12)",
                                                                            borderRadius: "14px",
                                                                            padding: "4px 8px",
                                                                            display: "-webkit-box",
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: "vertical",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            lineHeight: 1.35,
                                                                            textAlign: "left"
                                                                        }}
                                                                        >
                                                                            {getMissionPossibleCardTitle(assignment.title)}
                                                                        </div>
                                                                    ))}
                                                                    {dailyAssignments.length > 2 && (
                                                                        <div style={{ fontSize: "0.7rem", color: "#86868b", fontWeight: 700 }}>
                                                                            +{dailyAssignments.length - 2}개 더 있음
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div style={{ background: "#fff", borderRadius: "20px", padding: "1rem", border: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                                <div>
                                                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#86868b", marginBottom: "6px", letterSpacing: "0.04em" }}>릴리즈 날짜</div>
                                                    <input
                                                        type="date"
                                                        value={missionPossibleDate}
                                                        onChange={(e) => handleMissionPossibleDateChange(e.target.value)}
                                                        style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 600 }}
                                                    />
                                                </div>

                                                <div style={{ padding: "14px", borderRadius: "16px", background: "rgba(255,159,10,0.08)", border: "1px solid rgba(255,159,10,0.14)" }}>
                                                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.04em" }}>운영 프리뷰</div>
                                                    <div style={{ fontWeight: 800, color: "#1d1d1f", marginBottom: "6px" }}>
                                                        {formatMissionPossibleWindow(scheduledMissionPossibleWindowPreview.availableFrom, scheduledMissionPossibleWindowPreview.availableUntil)}
                                                    </div>
                                                    <div style={{ fontSize: "0.82rem", color: "#48484a", lineHeight: 1.5 }}>
                                                        오전 9시 오픈 후 다음날 오전 6시에 닫히는 스파크 코어 루틴형 운영입니다.
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#86868b", marginBottom: "8px", letterSpacing: "0.04em" }}>
                                                        선택한 날짜 배정 현황 ({selectedDateMissionPossibleAssignments.length})
                                                    </div>
                                                    {selectedDateMissionPossibleAssignments.length === 0 ? (
                                                        <div style={{ padding: "14px", borderRadius: "14px", background: "#f5f5f7", color: "#86868b", fontSize: "0.85rem" }}>
                                                            아직 배정된 미션파서블 루틴이 없습니다.
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                            {selectedDateMissionPossibleAssignments.map((assignment) => (
                                                                <div key={assignment.id} style={{ padding: "12px 14px", borderRadius: "14px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                                    <div style={{ fontWeight: 700, color: "#1d1d1f", marginBottom: "4px" }}>{getMissionPossibleCardTitle(assignment.title)}</div>
                                                                    <div style={{ fontSize: "0.75rem", color: "#86868b" }}>{assignment.windowLabel || "시간 제한 없음"}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => createAssignment({ userId: selectedStudent.id })}
                                        disabled={isCreatingMission}
                                        style={{ background: "#1d1d1f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", width: "100%" }}
                                    >
                                        {isCreatingMission ? "생성 중..." : "+ 미션 발행하기"}
                                    </button>
                                </div>

                                <div className="coach-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                    {/* Left Column: Mission History */}
                                    <div>
                                        <h3 style={{ fontWeight: 800, marginBottom: "1.5rem" }}>과제 히스토리</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                            {selectedStudent.assignments.length === 0 ? (
                                                <p style={{ textAlign: "center", color: "#86868b", padding: "4rem", background: "#f9f9fb", borderRadius: "20px" }}>제출된 과제가 없습니다.</p>
                                            ) : (
                                                selectedStudent.assignments.map(assignment => (
                                                    <div key={assignment.id} style={{ border: "1px solid #f0f0f2", borderRadius: "20px", padding: "1.5rem" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                                            <h3 style={{ fontWeight: 700 }}>{assignment.title}</h3>
                                                            <span style={{ fontSize: "0.8rem", color: "#86868b" }}>{new Date(assignment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        {(assignment.availableFrom || assignment.availableUntil) && (
                                                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
                                                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.12)", padding: "5px 9px", borderRadius: "999px" }}>
                                                                    미션파서블
                                                                </span>
                                                                <span style={{ fontSize: "0.78rem", color: "#86868b" }}>
                                                                    {formatMissionPossibleWindow(assignment.availableFrom, assignment.availableUntil)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {getAssignmentScaleGuidePattern({
                                                            title: assignment.title,
                                                            guidePresetKey: assignment.guidePresetKey,
                                                            guidePatternJson: assignment.guidePatternJson,
                                                        }) && (
                                                            <div style={{ marginBottom: "1rem" }}>
                                                                <ScaleGuideButton
                                                                    title={assignment.title}
                                                                    guidePresetKey={assignment.guidePresetKey}
                                                                    guidePatternJson={assignment.guidePatternJson}
                                                                    compact
                                                                />
                                                            </div>
                                                        )}
                                                        <div style={{ background: "#f5f5f7", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
                                                            {assignment.audioFileUrl ? (
                                                                <audio src={buildAssignmentAudioUrl(assignment.id)} controls style={{ width: "100%", height: "36px" }} />
                                                            ) : (
                                                                <div style={{ fontSize: "0.84rem", color: "#86868b" }}>아직 제출된 음성이 없습니다.</div>
                                                            )}
                                                        </div>
                                                        <textarea
                                                            value={feedbackTextByAssignment[assignment.id] || ""}
                                                            onChange={(e) =>
                                                                setFeedbackTextByAssignment((current) => ({
                                                                    ...current,
                                                                    [assignment.id]: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="피드백 입력..."
                                                            style={{ width: "100%", height: "80px", padding: "1rem", borderRadius: "12px", border: "1px solid #f0f0f2", marginBottom: "1rem" }}
                                                        />
                                                        <button
                                                            onClick={() => submitFeedback(assignment.id)}
                                                            disabled={Boolean(isSubmittingByAssignment[assignment.id])}
                                                            style={{
                                                                background: "#FF9F0A",
                                                                color: "#fff",
                                                                border: "none",
                                                                padding: "10px 20px",
                                                                borderRadius: "10px",
                                                                fontWeight: 700,
                                                                opacity: isSubmittingByAssignment[assignment.id] ? 0.7 : 1,
                                                                cursor: isSubmittingByAssignment[assignment.id] ? "wait" : "pointer",
                                                            }}
                                                        >
                                                            {isSubmittingByAssignment[assignment.id] ? "등록 중..." : "피드백 등록"}
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Diagnosis / Notes */}
                                    <div>
                                        {(() => {
                                            const matchingConsultation = consultations.find(c => c.email?.toLowerCase() === selectedStudent.email?.toLowerCase());
                                            if (matchingConsultation) {
                                                return (
                                                    <div style={{ background: "#f9f9fb", padding: "2rem", borderRadius: "24px", position: "sticky", top: "2rem" }}>
                                                        <h4 style={{ fontWeight: 800, marginBottom: "1.5rem", color: "#1d1d1f" }}>연동된 진단 상세 결과</h4>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                                            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "1rem" }}>
                                                                <div style={{ fontSize: "0.8rem", color: "#86868b", fontWeight: 700, marginBottom: "4px" }}>현재 병목(Bottleneck)</div>
                                                                <div style={{ fontWeight: 500, lineHeight: 1.5 }}>{matchingConsultation.bottleneck || "내역 없음"}</div>
                                                            </div>
                                                            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "1rem" }}>
                                                                <div style={{ fontSize: "0.8rem", color: "#86868b", fontWeight: 700, marginBottom: "4px" }}>수강 동기</div>
                                                                <div style={{ fontWeight: 500, lineHeight: 1.5 }}>{matchingConsultation.motivation || "내역 없음"}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: "0.8rem", color: "#86868b", fontWeight: 700, marginBottom: "4px" }}>희망 레벨/속도</div>
                                                                <div style={{ fontWeight: 500, lineHeight: 1.5 }}>{matchingConsultation.level || "내역 없음"}</div>
                                                            </div>
                                                            <div style={{ background: "#fff", padding: "1rem", borderRadius: "16px", marginTop: "1rem" }}>
                                                                <div style={{ fontSize: "0.75rem", color: "#FF9F0A", fontWeight: 800, marginBottom: "4px" }}>코치 참조 사항</div>
                                                                <p style={{ fontSize: "0.85rem", color: "#48484a" }}>연동일: {new Date(matchingConsultation.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div style={{ background: "#f9f9fb", padding: "2rem", borderRadius: "24px", textAlign: "center", color: "#86868b" }}>
                                                    진단 데이터가 없습니다.
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ) : <p>수강생을 선택해 주세요.</p>
                    ) : view === "spark" ? (
                        sparkStudents.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <section className="spark-hero-panel" style={{ position: "relative", overflow: "hidden", borderRadius: "28px", padding: "2rem", background: "linear-gradient(135deg, #111217 0%, #1d1d1f 55%, #2c1d07 100%)", color: "#fff" }}>
                                    <div style={{ position: "absolute", top: "-40px", right: "-20px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,10,0.32), rgba(255,159,10,0))" }} />
                                    <div style={{ position: "absolute", bottom: "-60px", left: "-20px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,10,0.18), rgba(255,214,10,0))" }} />
                                    <div className="spark-hero-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, 0.6fr)", gap: "1.5rem", alignItems: "end" }}>
                                        <div>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.12em", color: "#FFB340", marginBottom: "0.75rem" }}>SPARK CORNER</div>
                                            <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>오늘 루틴 운영 센터</h2>
                                            <p style={{ maxWidth: "760px", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, fontSize: "0.96rem" }}>
                                                복잡한 운영판 대신 오늘 해야 할 일만 남겼습니다. 공통 루틴을 발행하고, 학생별 링크를 복사해 카톡으로 보내는 흐름에 바로 집중할 수 있습니다.
                                            </p>
                                        </div>
                                        <div style={{ padding: "1rem 1.1rem", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "grid", gap: "10px" }}>
                                            <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#FFB340", letterSpacing: "0.06em" }}>TODAY AT A GLANCE</div>
                                            {[
                                                { label: "선택 멤버", value: `${selectedSparkTargetCount}명`, hint: `전체 ${sparkStudents.length}명 중` },
                                                { label: "오늘 보낼 링크", value: `${todayPendingSparkAssignments.length}개`, hint: "현재 선택 기준" },
                                                { label: "입력된 루틴", value: `${filledSparkMissionDraftCount}개`, hint: "오늘 배치 초안" },
                                            ].map((item) => (
                                                <div key={item.label} style={{ padding: "10px 12px", borderRadius: "16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.68)", marginBottom: "4px" }}>{item.label}</div>
                                                    <div style={{ fontSize: "1.18rem", fontWeight: 900, marginBottom: "2px" }}>{item.value}</div>
                                                    <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.6)" }}>{item.hint}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <div className="spark-top-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)", gap: "1.5rem" }}>
                                    <div className="spark-quick-release-panel" style={{ background: "#fff", borderRadius: "24px", padding: "1.75rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                            <div>
                                                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.06em" }}>TODAY ROUTINE</div>
                                                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "6px" }}>오늘 루틴 발행</h3>
                                                <p style={{ color: "#86868b", fontSize: "0.88rem", lineHeight: 1.6 }}>
                                                    멤버를 직접 고르고, 루틴도 여러 개를 한 번에 써서 바로 배치 발행할 수 있습니다. 자세한 설정은 필요할 때만 펼치면 됩니다.
                                                </p>
                                            </div>
                                            <div style={{ background: "rgba(255,159,10,0.10)", color: "#FF9F0A", borderRadius: "999px", padding: "8px 12px", fontSize: "0.78rem", fontWeight: 800 }}>
                                                선택 멤버 {selectedSparkTargetCount}명
                                            </div>
                                        </div>

                                        <div style={{ padding: "14px 16px", borderRadius: "18px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "8px" }}>
                                                <div style={{ fontWeight: 800, color: "#1d1d1f" }}>
                                                    {selectedSparkTargetCount === 0
                                                        ? "아직 선택된 멤버가 없습니다"
                                                        : isAllSparkTargetsSelected
                                                            ? `전체 운영 멤버 ${selectedSparkTargetCount}명에게 발행`
                                                            : `선택 멤버 ${selectedSparkTargetCount}명에게만 발행`}
                                                </div>
                                            <div style={{ fontSize: "0.8rem", color: "#6e6e73" }}>
                                                    {sparkSelectedTracks.join(" · ") || "트랙 선택 전"}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: "0.82rem", color: "#6e6e73", lineHeight: 1.55 }}>
                                                왼쪽에서 체크한 멤버에게만 오늘 루틴이 열립니다. 여러 루틴을 입력하면 같은 날짜에 순서대로 같이 배정됩니다.
                                            </div>
                                        </div>

                                        <div className="spark-quick-release-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
                                            <input
                                                type="date"
                                                value={missionPossibleDate}
                                                onChange={(e) => handleMissionPossibleDateChange(e.target.value)}
                                                style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={addSparkMissionDraftRow}
                                                style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 16px", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
                                            >
                                                + 루틴 추가
                                            </button>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "12px" }}>
                                            <button
                                                type="button"
                                                onClick={() => setShowMissionAdvanced((current) => !current)}
                                                style={{ background: "#f5f5f7", color: "#1d1d1f", border: "none", borderRadius: "12px", padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}
                                            >
                                                {showMissionAdvanced ? "고급 설정 닫기" : "설명 · 주차 · 스케일 설정"}
                                            </button>
                                            <div style={{ fontSize: "0.82rem", color: "#6e6e73" }}>
                                                오픈 시간: {formatMissionPossibleWindow(scheduledMissionPossibleWindowPreview.availableFrom, scheduledMissionPossibleWindowPreview.availableUntil)}
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gap: "12px", marginBottom: "14px" }}>
                                            {sparkMissionDrafts.map((draft, index) => (
                                                <div key={draft.id} style={{ padding: "14px", borderRadius: "18px", background: draft.title.trim() ? "rgba(255,159,10,0.06)" : "#f9f9fb", border: draft.title.trim() ? "1px solid rgba(255,159,10,0.12)" : "1px solid rgba(0,0,0,0.05)" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "10px", flexWrap: "wrap" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.10)", padding: "5px 8px", borderRadius: "999px" }}>
                                                                ROUTINE {index + 1}
                                                            </span>
                                                            <span style={{ fontSize: "0.8rem", color: "#6e6e73" }}>
                                                                {draft.title.trim() ? "발행 준비됨" : "제목을 입력해 주세요"}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSparkMissionDraftRow(draft.id)}
                                                            style={{ background: "#fff", color: "#6e6e73", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "999px", padding: "7px 10px", fontWeight: 800, cursor: "pointer", fontSize: "0.76rem" }}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>

                                                    <input
                                                        placeholder={`루틴 제목 ${index + 1}`}
                                                        value={draft.title}
                                                        onChange={(e) => updateSparkMissionDraft(draft.id, { title: e.target.value })}
                                                        style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff", marginBottom: showMissionAdvanced ? "10px" : 0 }}
                                                    />

                                                    {showMissionAdvanced && (
                                                        <div style={{ display: "grid", gap: "12px", marginTop: "10px" }}>
                                                            <div className="spark-advanced-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 120px", gap: "10px" }}>
                                                                <input
                                                                    placeholder="설명 (선택)"
                                                                    value={draft.description}
                                                                    onChange={(e) => updateSparkMissionDraft(draft.id, { description: e.target.value })}
                                                                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff" }}
                                                                />
                                                                <input
                                                                    placeholder="주차"
                                                                    type="number"
                                                                    value={draft.weekNumber}
                                                                    onChange={(e) => updateSparkMissionDraft(draft.id, { weekNumber: e.target.value })}
                                                                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff" }}
                                                                />
                                                            </div>

                                                            {renderScaleGuideConfigurator({
                                                                mission: draft,
                                                                onMissionChange: (patch) => updateSparkMissionDraft(draft.id, patch),
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "14px 16px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(255,159,10,0.12), rgba(255,214,10,0.07))", border: "1px solid rgba(255,159,10,0.14)" }}>
                                            <div>
                                                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "4px", letterSpacing: "0.05em" }}>오늘 발행 요약</div>
                                                <div style={{ fontWeight: 800, color: "#1d1d1f" }}>
                                                    {selectedSparkTargetCount}명에게 루틴 {filledSparkMissionDraftCount}개가 열립니다
                                                </div>
                                                <div style={{ fontSize: "0.82rem", color: "#48484a", marginTop: "4px" }}>
                                                    발행이 끝나면 오른쪽에서 학생별 링크를 바로 복사해 카톡으로 보낼 수 있습니다.
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={createSparkMissionBatch}
                                                disabled={isCreatingMission}
                                                style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "13px 18px", fontWeight: 800, cursor: "pointer", minWidth: "220px" }}
                                            >
                                                {isCreatingMission ? "발행 중..." : "선택 멤버에게 루틴 보내기"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="spark-side-stack" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <div style={{ background: "#fff", borderRadius: "22px", padding: "1.2rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#007aff", marginBottom: "8px", letterSpacing: "0.06em" }}>TODAY LINKS</div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                                                <div>
                                                    <h4 style={{ fontSize: "1.05rem", fontWeight: 900, marginBottom: "0.35rem" }}>오늘 보낼 링크</h4>
                                                    <p style={{ fontSize: "0.84rem", color: "#6e6e73", lineHeight: 1.55 }}>
                                                        발행 후 여기서 링크를 복사해 카톡으로 전달하면, 학생은 바로 오늘 루틴 페이지에 들어갑니다.
                                                    </p>
                                                </div>
                                                <div style={{ background: "rgba(0,122,255,0.08)", color: "#007aff", borderRadius: "999px", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 800 }}>
                                                    보낼 링크 {todayPendingSparkAssignments.length}개
                                                </div>
                                            </div>

                                            <div style={{ display: "grid", gap: "8px", marginBottom: "0.9rem" }}>
                                                {[
                                                    "1. 오늘 루틴 보내기",
                                                    "2. 학생별 링크 복사",
                                                    "3. 카톡 전송",
                                                ].map((item) => (
                                                    <div key={item} style={{ padding: "9px 12px", borderRadius: "14px", background: "#f9f9fb", color: "#48484a", fontSize: "0.82rem", lineHeight: 1.5 }}>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>

                                            {todayPendingSparkAssignments.length === 0 ? (
                                                <div style={{ padding: "14px", borderRadius: "16px", background: "#f5f5f7", color: "#86868b", fontSize: "0.84rem" }}>
                                                    {selectedSparkTargetCount === 0
                                                        ? "먼저 왼쪽에서 멤버를 선택해 주세요."
                                                        : todaySparkAssignments.length === 0
                                                        ? "선택한 멤버 기준으로 오늘 발행된 미션파서블이 아직 없습니다."
                                                        : "오늘 보낼 링크는 모두 처리됐거나 이미 제출이 완료됐습니다."}
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    {todayPendingSparkAssignments.map((assignment) => (
                                                        <div key={assignment.id} style={{ padding: "12px 14px", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start", marginBottom: "4px" }}>
                                                                <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{getMissionPossibleCardTitle(assignment.title)}</div>
                                                                {assignment.hasScaleGuide && (
                                                                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.12)", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                                                                        🎹 가이드
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: "0.78rem", color: "#48484a", marginBottom: "4px" }}>{assignment.studentName} · {assignment.trackName}</div>
                                                            <div style={{ fontSize: "0.74rem", color: "#86868b" }}>{assignment.windowLabel}</div>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyAssignmentAccessLink(assignment.id, assignment.studentName)}
                                                                disabled={copyingLinkAssignmentId === assignment.id}
                                                                style={{ marginTop: "10px", background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 12px", fontWeight: 800, cursor: "pointer", width: "100%" }}
                                                            >
                                                                {copyingLinkAssignmentId === assignment.id ? "링크 준비 중..." : "카톡용 오늘 미션 링크 복사"}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ background: "#fff", borderRadius: "22px", padding: "1.2rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.06em" }}>SELECTED TARGETS</div>
                                            <h4 style={{ fontSize: "1.05rem", fontWeight: 900, marginBottom: "0.4rem", color: "#1d1d1f" }}>
                                                {selectedSparkTargetCount === 0 ? "선택된 멤버 없음" : `${selectedSparkTargetCount}명 선택됨`}
                                            </h4>
                                            <p style={{ fontSize: "0.84rem", color: "#6e6e73", lineHeight: 1.55, marginBottom: "0.9rem" }}>
                                                {selectedSparkTargetCount === 0
                                                    ? "왼쪽 리스트에서 멤버를 체크하면 그 그룹에게만 공통 루틴이 발행됩니다."
                                                    : `${sparkSelectedTracks.join(" · ") || "트랙 선택 전"} · 대기 루틴 ${pendingSparkAssignmentsCount}개`}
                                            </p>
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <button
                                                    type="button"
                                                    onClick={selectAllSparkTargets}
                                                    style={{ flex: 1, minWidth: "120px", background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 900, cursor: "pointer" }}
                                                >
                                                    전체 선택
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={clearSparkTargets}
                                                    style={{ flex: 1, minWidth: "120px", background: "#f5f5f7", color: "#1d1d1f", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 900, cursor: "pointer" }}
                                                >
                                                    선택 해제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <section style={{ background: "#fff", borderRadius: "26px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                                        <div>
                                            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#007aff", marginBottom: "8px", letterSpacing: "0.08em" }}>WEEKLY BATCH</div>
                                            <h3 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "6px", color: "#1d1d1f" }}>주간 루틴 미리 발행</h3>
                                            <p style={{ color: "#6e6e73", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "760px" }}>
                                                일요일에 한 번만 1주치 루틴을 예약해두면, 각 루틴은 해당 날짜 오전 9시에 자동으로 열립니다. 학생은 매일 새 링크로 들어오고, 코치는 매일 다시 발행할 필요가 없습니다.
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                            <div style={{ background: "rgba(0,122,255,0.08)", color: "#007aff", borderRadius: "999px", padding: "8px 12px", fontSize: "0.78rem", fontWeight: 800 }}>
                                                준비된 날짜 {filledWeeklyMissionCount}일
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowWeeklyPlanner((current) => !current)}
                                                style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "11px 15px", fontWeight: 800, cursor: "pointer" }}
                                            >
                                                {showWeeklyPlanner ? "주간 배치 숨기기" : "주간 배치 열기"}
                                            </button>
                                        </div>
                                    </div>

                                    {showWeeklyPlanner && (
                                        <div style={{ display: "grid", gap: "1rem", marginTop: "1.25rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
                                                <div>
                                                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6e6e73", marginBottom: "6px", letterSpacing: "0.04em" }}>첫 발행일</div>
                                                    <input
                                                        type="date"
                                                        value={weeklyMissionStartDate}
                                                        onChange={(e) => handleWeeklyMissionStartDateChange(e.target.value)}
                                                        style={{ width: "220px", maxWidth: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", fontWeight: 700 }}
                                                    />
                                                </div>
                                                <div style={{ padding: "12px 14px", borderRadius: "16px", background: "#f9f9fb", color: "#48484a", fontSize: "0.84rem", lineHeight: 1.5 }}>
                                                    예약 범위: <strong>{weeklyMissionRangeLabel}</strong>
                                                    <div style={{ color: "#86868b", marginTop: "4px" }}>비어 있는 날은 자동으로 건너뜁니다.</div>
                                                </div>
                                            </div>

                                            <div className="spark-weekly-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
                                                {weeklyMissionDrafts.map((draft, index) => (
                                                    <div key={`${draft.dateKey}-${index}`} style={{ background: "#f9f9fb", borderRadius: "20px", padding: "1rem", border: "1px solid rgba(0,0,0,0.05)", display: "grid", gap: "10px" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start" }}>
                                                            <div>
                                                                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#007aff", marginBottom: "4px" }}>DAY {index + 1}</div>
                                                                <div style={{ fontSize: "1rem", fontWeight: 900, color: "#1d1d1f" }}>{formatDateKeyWithWeekday(draft.dateKey)}</div>
                                                            </div>
                                                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: draft.title.trim() ? "#34C759" : "#8e8e93", background: draft.title.trim() ? "rgba(52,199,89,0.10)" : "rgba(142,142,147,0.12)", padding: "6px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                                                                {draft.title.trim() ? "예약 준비" : "빈 날"}
                                                            </span>
                                                        </div>

                                                        <input
                                                            placeholder="오늘 루틴 제목"
                                                            value={draft.title}
                                                            onChange={(e) => updateWeeklyMissionDraft(index, { title: e.target.value })}
                                                            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff" }}
                                                        />
                                                        <input
                                                            placeholder="메모 (선택)"
                                                            value={draft.description}
                                                            onChange={(e) => updateWeeklyMissionDraft(index, { description: e.target.value })}
                                                            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff" }}
                                                        />
                                                        <select
                                                            value={draft.guidePresetKey}
                                                            onChange={(e) => updateWeeklyMissionDraft(index, { guidePresetKey: e.target.value })}
                                                            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e5e7", background: "#fff", fontWeight: 700 }}
                                                        >
                                                            <option value="">스케일 가이드 없음</option>
                                                            {SCALE_GUIDE_PRESETS.map((preset) => (
                                                                <option key={preset.key} value={preset.key}>
                                                                    {preset.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div style={{ fontSize: "0.76rem", color: "#6e6e73", lineHeight: 1.5 }}>
                                                            당일 09:00 자동 오픈 · 다음날 06:00 종료
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "14px 16px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(0,122,255,0.08), rgba(255,255,255,1))", border: "1px solid rgba(0,122,255,0.10)" }}>
                                                <div>
                                                    <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#007aff", marginBottom: "4px", letterSpacing: "0.05em" }}>주간 운영 요약</div>
                                                    <div style={{ fontWeight: 800, color: "#1d1d1f" }}>
                                                        입력한 날짜만 예약되고, 해당 날이 되면 학생 쪽에 자동으로 열립니다.
                                                    </div>
                                                    <div style={{ fontSize: "0.82rem", color: "#48484a", marginTop: "4px" }}>
                                                        예약 후에는 오늘 날짜에 맞는 링크만 오른쪽 카드에 나타납니다.
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={createWeeklyMissionBatch}
                                                    disabled={isCreatingWeeklyMission}
                                                    style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "13px 18px", fontWeight: 800, cursor: "pointer", minWidth: "220px" }}
                                                >
                                                    {isCreatingWeeklyMission ? "주간 예약 중..." : "1주치 루틴 예약하기"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <div className="spark-month-board-panel spark-month-board-panel--expanded" style={{ background: "#fff", borderRadius: "28px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showSparkCalendar ? "1.25rem" : "0", gap: "1rem", flexWrap: "wrap" }}>
                                        <div>
                                            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.08em" }}>CALENDAR</div>
                                            <h3 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "6px", color: "#1d1d1f" }}>캘린더와 날짜별 배정 보기</h3>
                                            <p style={{ color: "#6e6e73", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "760px" }}>
                                                평소에는 접어두고, 특정 날짜 발행 현황이나 미리 배정된 루틴을 확인할 때만 펼쳐서 보면 됩니다.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowSparkCalendar((current) => !current)}
                                            style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 16px", fontWeight: 800, cursor: "pointer" }}
                                        >
                                            {showSparkCalendar ? "캘린더 숨기기" : "캘린더 보기"}
                                        </button>
                                    </div>

                                    {showSparkCalendar && (
                                        <div style={{ display: "grid", gap: "1.25rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1d1d1f" }}>{getMonthLabel(calendarMonthKey)} 운영 캘린더</div>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCalendarMonthKey(shiftMonthKey(calendarMonthKey, -1))}
                                                        style={{ background: "#f5f5f7", border: "none", borderRadius: "14px", padding: "12px 14px", cursor: "pointer", fontWeight: 800, fontSize: "1.05rem" }}
                                                    >
                                                        ←
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCalendarMonthKey(shiftMonthKey(calendarMonthKey, 1))}
                                                        style={{ background: "#f5f5f7", border: "none", borderRadius: "14px", padding: "12px 14px", cursor: "pointer", fontWeight: 800, fontSize: "1.05rem" }}
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="spark-month-board-scroll" style={{ overflowX: "auto", paddingBottom: "0.25rem" }}>
                                                <div style={{ minWidth: "840px" }}>
                                                    <div className="spark-month-weekdays" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "14px", marginBottom: "12px" }}>
                                                        {weekdayLabels.map((weekday) => (
                                                            <div key={weekday} style={{ textAlign: "center", fontSize: "0.88rem", color: "#86868b", fontWeight: 800 }}>
                                                                {weekday}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="spark-month-board-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "14px" }}>
                                                        {calendarCells.map((cell, index) => {
                                                            if (!cell) {
                                                                return <div key={`spark-empty-${index}`} style={{ minHeight: "156px", borderRadius: "22px", background: "rgba(0,0,0,0.02)" }} />;
                                                            }

                                                            const dailyAssignments = missionPossibleAssignmentsByDate[cell.dateKey] || [];
                                                            const isSelected = cell.dateKey === missionPossibleDate;

                                                            return (
                                                                <button
                                                                    key={cell.dateKey}
                                                                    type="button"
                                                                    onClick={() => handleMissionPossibleDateChange(cell.dateKey)}
                                                                    style={{
                                                                        minHeight: "156px",
                                                                        borderRadius: "22px",
                                                                        border: isSelected ? "1.5px solid #FF9F0A" : "1px solid rgba(0,0,0,0.06)",
                                                                        background: isSelected ? "rgba(255,159,10,0.08)" : "#fff",
                                                                        padding: "14px",
                                                                        textAlign: "left",
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        gap: "10px"
                                                                    }}
                                                                >
                                                                    <div style={{ fontSize: "1.08rem", fontWeight: 900, color: "#1d1d1f" }}>{cell.day}</div>
                                                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                                        {dailyAssignments.slice(0, 2).map((assignment) => (
                                                                            <div
                                                                                key={assignment.id}
                                                                                style={{
                                                                                    fontSize: "0.82rem",
                                                                                    fontWeight: 800,
                                                                                    color: assignment.isCompleted ? "#1d1d1f" : "#FF9F0A",
                                                                                    background: assignment.isCompleted ? "rgba(29,29,31,0.08)" : "rgba(255,159,10,0.12)",
                                                                                    borderRadius: "14px",
                                                                                    padding: "6px 10px",
                                                                                    display: "-webkit-box",
                                                                                    WebkitLineClamp: 2,
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    lineHeight: 1.35,
                                                                                    textAlign: "left"
                                                                                }}
                                                                            >
                                                                                {getMissionPossibleCardTitle(assignment.title)}
                                                                            </div>
                                                                        ))}
                                                                        {dailyAssignments.length > 2 && (
                                                                            <div style={{ fontSize: "0.8rem", color: "#86868b", fontWeight: 800 }}>
                                                                                +{dailyAssignments.length - 2}개 더 있음
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ background: "#f9f9fb", borderRadius: "22px", padding: "1.2rem", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                                                    <div>
                                                        <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.06em" }}>SELECTED DATE</div>
                                                        <h4 style={{ fontSize: "1.05rem", fontWeight: 900, color: "#1d1d1f" }}>{missionPossibleDate} 배정 현황</h4>
                                                    </div>
                                                    <div style={{ background: "#fff", color: "#1d1d1f", borderRadius: "999px", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 800 }}>
                                                        배정 {selectedDateMissionPossibleAssignments.length}개
                                                    </div>
                                                </div>

                                                {selectedDateMissionPossibleAssignments.length === 0 ? (
                                                    <div style={{ padding: "14px", borderRadius: "16px", background: "#fff", color: "#86868b", fontSize: "0.84rem" }}>
                                                        선택한 날짜에 배정된 루틴이 없습니다.
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                        {selectedDateMissionPossibleAssignments.map((assignment) => (
                                                            <div key={assignment.id} style={{ padding: "12px 14px", borderRadius: "16px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start", marginBottom: "4px" }}>
                                                                    <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{getMissionPossibleCardTitle(assignment.title)}</div>
                                                                    {assignment.hasScaleGuide && (
                                                                        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.12)", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                                                                            🎹 가이드
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div style={{ fontSize: "0.78rem", color: "#48484a", marginBottom: "4px" }}>{assignment.studentName} · {assignment.trackName}</div>
                                                                <div style={{ fontSize: "0.74rem", color: "#86868b" }}>{assignment.windowLabel || "시간 제한 없음"}</div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyAssignmentAccessLink(assignment.id, assignment.studentName)}
                                                                    disabled={copyingLinkAssignmentId === assignment.id}
                                                                    style={{ marginTop: "10px", background: "#f5f5f7", color: "#1d1d1f", border: "none", borderRadius: "10px", padding: "8px 12px", fontWeight: 800, cursor: "pointer", width: "100%" }}
                                                                >
                                                                    {copyingLinkAssignmentId === assignment.id ? "링크 준비 중..." : "학생별 링크 복사"}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : <p>스파크 운영 대상 수강생이 없습니다.</p>
                    ) : view === "analytics" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <section style={{ position: "relative", overflow: "hidden", borderRadius: "28px", padding: "2rem", background: "linear-gradient(135deg, #111217 0%, #1d1d1f 55%, #071f2c 100%)", color: "#fff" }}>
                                <div style={{ position: "absolute", top: "-50px", right: "-30px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.28), rgba(0,122,255,0))" }} />
                                <div style={{ position: "absolute", bottom: "-50px", left: "-30px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.18), rgba(52,199,89,0))" }} />
                                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)", gap: "1.5rem", alignItems: "end" }}>
                                    <div>
                                        <div style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.12em", color: "#6ec2ff", marginBottom: "0.75rem" }}>SITE ANALYTICS</div>
                                        <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>최근 7일 공개 페이지 흐름</h2>
                                        <p style={{ maxWidth: "760px", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, fontSize: "0.96rem" }}>
                                            외부 서비스 없이 사이트 방문 수, 인기 페이지, 진단 전환, 카카오 연결 클릭 수를 바로 볼 수 있습니다.
                                        </p>
                                    </div>
                                    <div style={{ padding: "1rem 1.1rem", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "grid", gap: "10px" }}>
                                        <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#6ec2ff", letterSpacing: "0.06em" }}>{analyticsSummary.dateRangeLabel}</div>
                                        {[
                                            { label: "총 방문", value: `${analyticsSummary.totals.pageViews}회`, hint: `유니크 ${analyticsSummary.totals.uniqueVisitors}명` },
                                            { label: "진단 완료", value: `${analyticsSummary.totals.diagnosisCompletions}건`, hint: `시작 ${analyticsSummary.totals.diagnosisStarts}건` },
                                            { label: "카카오 연결", value: `${analyticsSummary.totals.kakaoClicks}회`, hint: "직접 클릭 포함" },
                                        ].map((item) => (
                                            <div key={item.label} style={{ padding: "10px 12px", borderRadius: "16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.68)", marginBottom: "4px" }}>{item.label}</div>
                                                <div style={{ fontSize: "1.18rem", fontWeight: 900, marginBottom: "2px" }}>{item.value}</div>
                                                <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.6)" }}>{item.hint}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                                {[
                                    { label: "오늘 방문", value: `${analyticsSummary.today.pageViews}회`, hint: `유니크 ${analyticsSummary.today.uniqueVisitors}명`, accent: "#007aff" },
                                    { label: "최근 7일 방문", value: `${analyticsSummary.totals.pageViews}회`, hint: `${analyticsSummary.totals.uniqueVisitors}명 방문`, accent: "#34C759" },
                                    { label: "진단 시작", value: `${analyticsSummary.totals.diagnosisStarts}건`, hint: `오늘 ${analyticsSummary.today.diagnosisStarts}건`, accent: "#FF9F0A" },
                                    { label: "진단 완료", value: `${analyticsSummary.totals.diagnosisCompletions}건`, hint: `오늘 ${analyticsSummary.today.diagnosisCompletions}건`, accent: "#af52de" },
                                    { label: "카카오 클릭", value: `${analyticsSummary.totals.kakaoClicks}회`, hint: `오늘 ${analyticsSummary.today.kakaoClicks}회`, accent: "#111217" },
                                ].map((item) => (
                                    <div key={item.label} style={{ background: "#fff", borderRadius: "22px", padding: "1.25rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                        <div style={{ fontSize: "0.74rem", fontWeight: 800, color: item.accent, marginBottom: "6px", letterSpacing: "0.05em" }}>{item.label}</div>
                                        <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "4px" }}>{item.value}</div>
                                        <div style={{ fontSize: "0.82rem", color: "#6e6e73" }}>{item.hint}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)", gap: "1.5rem" }}>
                                <section style={{ background: "#fff", borderRadius: "24px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                        <div>
                                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#007aff", marginBottom: "6px", letterSpacing: "0.06em" }}>TOP PAGES</div>
                                            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "4px" }}>가장 많이 보는 페이지</h3>
                                            <p style={{ fontSize: "0.85rem", color: "#6e6e73", lineHeight: 1.55 }}>
                                                공개 페이지 기준 조회 수, 유니크 방문자, 평균 체류 시간을 보여줍니다.
                                            </p>
                                        </div>
                                        <div style={{ background: "rgba(0,122,255,0.08)", color: "#007aff", borderRadius: "999px", padding: "7px 10px", fontSize: "0.76rem", fontWeight: 800 }}>
                                            페이지 {analyticsSummary.topPages.length}개
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gap: "10px" }}>
                                        {analyticsSummary.topPages.length === 0 ? (
                                            <div style={{ padding: "14px", borderRadius: "16px", background: "#f5f5f7", color: "#86868b", fontSize: "0.84rem" }}>
                                                아직 수집된 공개 페이지 방문 데이터가 없습니다.
                                            </div>
                                        ) : (
                                            analyticsSummary.topPages.map((page, index) => (
                                                <div key={page.path} style={{ padding: "14px", borderRadius: "18px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#007aff", background: "rgba(0,122,255,0.08)", padding: "5px 8px", borderRadius: "999px" }}>
                                                                #{index + 1}
                                                            </span>
                                                            <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{page.label}</div>
                                                        </div>
                                                        <div style={{ fontSize: "0.76rem", color: "#86868b" }}>{page.path}</div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                        <span style={{ fontSize: "0.72rem", color: "#1d1d1f", fontWeight: 700, background: "#fff", padding: "4px 8px", borderRadius: "999px" }}>
                                                            조회 {page.views}
                                                        </span>
                                                        <span style={{ fontSize: "0.72rem", color: "#34C759", fontWeight: 700, background: "rgba(52,199,89,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                            방문자 {page.uniqueVisitors}
                                                        </span>
                                                        <span style={{ fontSize: "0.72rem", color: "#FF9F0A", fontWeight: 700, background: "rgba(255,159,10,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                            평균 체류 {formatAnalyticsDuration(page.averageStaySeconds)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>

                                <section style={{ background: "#fff", borderRadius: "24px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                                    <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "6px", letterSpacing: "0.06em" }}>DAILY FLOW</div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "4px" }}>날짜별 흐름</h3>
                                    <p style={{ fontSize: "0.85rem", color: "#6e6e73", lineHeight: 1.55, marginBottom: "1rem" }}>
                                        최근 7일 기준으로 일자별 방문 수와 카카오 클릭 수를 빠르게 봅니다.
                                    </p>

                                    <div style={{ display: "grid", gap: "10px" }}>
                                        {analyticsSummary.dailyBreakdown.map((day) => (
                                            <div key={day.dateKey} style={{ padding: "12px 14px", borderRadius: "16px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", marginBottom: "8px" }}>
                                                    <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{day.label}</div>
                                                    <div style={{ fontSize: "0.76rem", color: "#86868b" }}>{day.dateKey}</div>
                                                </div>
                                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                    <span style={{ fontSize: "0.72rem", color: "#1d1d1f", fontWeight: 700, background: "#fff", padding: "4px 8px", borderRadius: "999px" }}>
                                                        방문 {day.pageViews}
                                                    </span>
                                                    <span style={{ fontSize: "0.72rem", color: "#007aff", fontWeight: 700, background: "rgba(0,122,255,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                        유니크 {day.uniqueVisitors}
                                                    </span>
                                                    <span style={{ fontSize: "0.72rem", color: "#FF9F0A", fontWeight: 700, background: "rgba(255,159,10,0.08)", padding: "4px 8px", borderRadius: "999px" }}>
                                                        카카오 {day.kakaoClicks}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        selectedConsultation ? (
                            <div>
                                <div style={{ borderBottom: "1px solid #f5f5f7", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                        <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{selectedConsultationDisplayName} 상담 신청</h2>
                                        <p style={{ color: "#86868b", fontSize: "1.1rem" }}>{selectedConsultationContactSummary}</p>
                                            <p style={{ color: "#86868b" }}>이메일: {selectedConsultation.email || "미기재"}</p>
                                            <p style={{ color: "#86868b" }}>신청 유형: {selectedConsultation.type}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <select 
                                                value={selectedConsultation.status} 
                                                onChange={(e) => updateStatus(selectedConsultation.id, e.target.value)}
                                                style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #f0f0f2", fontWeight: 600 }}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="CONTACTED">CONTACTED</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {selectedConversionDraft && (
                                    <section style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,159,10,0.12), rgba(255,255,255,1))", border: "1px solid rgba(255,159,10,0.18)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "1.2rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.76rem", color: "#FF9F0A", fontWeight: 900, letterSpacing: "0.08em", marginBottom: "0.4rem" }}>MEMBER CONVERSION</div>
                                                <h3 style={{ fontSize: "1.35rem", color: "#1d1d1f", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>유료회원으로 전환</h3>
                                                <p style={{ color: "#6e6e73", fontSize: "0.92rem", lineHeight: 1.6 }}>
                                                    상담 정보를 회원 프로필과 등록 데이터로 옮기고, 첫 7분 목소리 루틴을 자동으로 준비합니다.
                                                </p>
                                            </div>
                                            {selectedConsultation.convertedAt ? (
                                                <div style={{ padding: "9px 12px", borderRadius: "999px", background: "rgba(52,199,89,0.12)", color: "#1d8f3f", fontSize: "0.78rem", fontWeight: 900 }}>
                                                    전환 완료 · {formatConsultationCreatedAt(selectedConsultation.convertedAt)}
                                                </div>
                                            ) : (
                                                <div style={{ padding: "9px 12px", borderRadius: "999px", background: "#fff", color: "#FF9F0A", fontSize: "0.78rem", fontWeight: 900, border: "1px solid rgba(255,159,10,0.2)" }}>
                                                    첫 루틴 포함
                                                </div>
                                            )}
                                        </div>

                                        <div className="conversion-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginBottom: "1rem" }}>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                이름
                                                <input
                                                    value={selectedConversionDraft.name}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { name: event.target.value })}
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                로그인 이메일
                                                <input
                                                    type="email"
                                                    value={selectedConversionDraft.email}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { email: event.target.value })}
                                                    placeholder="member@example.com"
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                초기 비밀번호 (선택)
                                                <input
                                                    type="text"
                                                    value={selectedConversionDraft.initialPassword}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { initialPassword: event.target.value })}
                                                    placeholder="비워두면 초대 링크로 직접 설정"
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                프로그램
                                                <select
                                                    value={selectedConversionDraft.trackId}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { trackId: event.target.value })}
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                >
                                                    {trackOptions.map((track) => (
                                                        <option key={track.id} value={track.id}>{track.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                결제 상태
                                                <select
                                                    value={selectedConversionDraft.paymentStatus}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { paymentStatus: event.target.value })}
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                >
                                                    {paymentStatusOptions.map((status) => (
                                                        <option key={status.id} value={status.id}>{status.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                연습을 붙일 생활 지점
                                                <input
                                                    value={selectedConversionDraft.practiceAnchor}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { practiceAnchor: event.target.value })}
                                                    placeholder="예: 퇴근 후 차 안 7분"
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                1차 목표
                                                <input
                                                    value={selectedConversionDraft.primaryGoal}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { primaryGoal: event.target.value })}
                                                    placeholder="예: 회식에서 피하지 않을 대표곡 1곡"
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                            <label style={{ display: "grid", gap: "6px", fontSize: "0.78rem", color: "#6e6e73", fontWeight: 800 }}>
                                                대표곡 후보
                                                <input
                                                    value={selectedConversionDraft.representativeSongs}
                                                    onChange={(event) => updateConversionDraft(selectedConsultation, { representativeSongs: event.target.value })}
                                                    placeholder="예: 안전곡 / 분위기곡 / 자신감곡"
                                                    style={{ width: "100%", padding: "12px 13px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#1d1d1f", fontSize: "0.92rem", fontWeight: 700 }}
                                                />
                                            </label>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.9rem", borderTop: "1px solid rgba(255,159,10,0.18)" }}>
                                            <p style={{ color: "#6e6e73", fontSize: "0.86rem", lineHeight: 1.55, maxWidth: "560px" }}>
                                                전환하면 학생 계정, 회원 프로필, 등록 정보, 첫 루틴, 초대 링크, 코치 연락 기록이 함께 생성됩니다. SMTP가 설정되어 있으면 초대 이메일도 자동 발송됩니다.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => convertConsultationToMember(selectedConsultation)}
                                                disabled={isConvertingConsultation || Boolean(selectedConsultation.convertedAt)}
                                                style={{
                                                    border: "none",
                                                    borderRadius: "14px",
                                                    background: selectedConsultation.convertedAt ? "#d1d1d6" : "#1d1d1f",
                                                    color: "#fff",
                                                    padding: "13px 18px",
                                                    fontWeight: 900,
                                                    cursor: isConvertingConsultation || selectedConsultation.convertedAt ? "not-allowed" : "pointer",
                                                    opacity: isConvertingConsultation ? 0.7 : 1,
                                                }}
                                            >
                                                {selectedConsultation.convertedAt ? "이미 전환됨" : isConvertingConsultation ? "전환 중..." : "유료회원으로 전환"}
                                            </button>
                                        </div>
                                    </section>
                                )}

                                <div className="consult-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                    <div style={{ background: "#f9f9fb", padding: "1.5rem", borderRadius: "20px" }}>
                                        <h4 style={{ fontWeight: 800, marginBottom: "1rem", fontSize: "0.9rem", color: "#86868b" }}>
                                            {selectedConsultationHasDetails ? "진단 상세 내용" : "간편 접수 내용"}
                                        </h4>
                                        {selectedConsultationHasDetails ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                <div><strong>주요 고민:</strong> {selectedConsultation.bottleneck || "미기재"}</div>
                                                <div><strong>동기:</strong> {selectedConsultation.motivation || "미기재"}</div>
                                                <div><strong>일정:</strong> {selectedConsultation.timeline || "미기재"}</div>
                                                <div><strong>레벨:</strong> {selectedConsultation.level || "미기재"}</div>
                                                <div><strong>투자시간:</strong> {selectedConsultation.timeInvestment || "미기재"}</div>
                                                <div><strong>참고:</strong> {selectedConsultation.reference || "미기재"}</div>
                                            </div>
                                        ) : (
                                            <div style={{ background: "#fff", borderRadius: "16px", padding: "1rem", border: "1px solid #ececf1" }}>
                                                <p style={{ fontWeight: 700, color: "#1d1d1f", marginBottom: "0.5rem" }}>상세 진단 응답이 아직 없습니다.</p>
                                                <p style={{ color: "#6e6e73", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                                                    이 신청은 랜딩 페이지에서 기본 정보만 먼저 남긴 간편 상담 건입니다. 아래 메모와 연락처 기준으로 후속 상담을 진행해 주세요.
                                                </p>
                                                <div style={{ color: "#48484a", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                                    {selectedConsultation.notes || "남겨진 메모 없음"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ background: "#f9f9fb", padding: "1.5rem", borderRadius: "20px" }}>
                                        <h4 style={{ fontWeight: 800, marginBottom: "1rem", fontSize: "0.9rem", color: "#86868b" }}>기타 정보</h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <div><strong>편한 연락 시간/방식:</strong> {selectedConsultation.preferredTime || "미기재"}</div>
                                            <div>
                                                <strong>알림 상태:</strong>{" "}
                                                <span style={{ color: getConsultationAlertStatusColor(selectedConsultation), fontWeight: 700 }}>
                                                    {getConsultationAlertStatusLabel(selectedConsultation)}
                                                </span>
                                            </div>
                                            <div><strong>마지막 알림 시도:</strong> {selectedConsultation.lastAlertAttemptedAt ? formatConsultationCreatedAt(selectedConsultation.lastAlertAttemptedAt) : "없음"}</div>
                                            <div><strong>알림 채널:</strong> {selectedConsultation.lastAlertChannels || "없음"}</div>
                                            <div><strong>신청일:</strong> {formatConsultationCreatedAt(selectedConsultation.createdAt)}</div>
                                            <div style={{ borderTop: "1px solid #e5e5e7", marginTop: "10px", paddingTop: "10px" }}>
                                                <strong>노트:</strong>
                                                <p style={{ marginTop: "8px", whiteSpace: "pre-wrap", color: "#48484a" }}>{selectedConsultation.notes || "내역 없음"}</p>
                                            </div>
                                            {selectedConsultation.lastAlertError ? (
                                                <div style={{ borderTop: "1px solid #e5e5e7", marginTop: "10px", paddingTop: "10px" }}>
                                                    <strong>알림 오류:</strong>
                                                    <p style={{ marginTop: "8px", whiteSpace: "pre-wrap", color: "#ff3b30" }}>{selectedConsultation.lastAlertError}</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <p>상담 신청 건을 선택해 주세요.</p>
                    )}
                </main>
            </div>
            <style jsx>{`
                .coach-page-root,
                .coach-dashboard-layout,
                .coach-sidebar,
                .coach-main-panel,
                .coach-detail-grid,
                .consult-detail-grid,
                .conversion-grid,
                .mission-planner-grid,
                .spark-hero-grid,
                .spark-summary-grid,
                .spark-top-grid,
                .spark-side-stack,
                .spark-month-board-panel,
                .spark-month-board-scroll,
                .spark-quick-release-grid,
                .spark-advanced-grid,
                .spark-weekly-grid,
                .routine-template-grid,
                .member-os-grid,
                .member-os-metric-grid,
                .member-routine-list {
                    min-width: 0;
                }

                .coach-sidebar,
                .coach-main-panel,
                .spark-hero-panel {
                    box-sizing: border-box;
                }

                .spark-top-grid,
                .spark-top-grid > div,
                .spark-quick-release-grid,
                .spark-quick-release-grid > *,
                .spark-advanced-grid,
                .spark-advanced-grid > *,
                .spark-weekly-grid,
                .routine-template-grid,
                .routine-template-grid > *,
                .conversion-grid,
                .spark-weekly-grid > *,
                .member-os-grid,
                .member-os-grid > *,
                .member-os-metric-grid,
                .member-os-metric-grid > *,
                .member-routine-list,
                .member-routine-list > * {
                    min-width: 0;
                }

                .spark-quick-release-grid {
                    grid-template-columns: minmax(0, 1fr) 200px !important;
                    align-items: stretch;
                }

                .spark-advanced-grid {
                    grid-template-columns: minmax(0, 1fr) 120px !important;
                    align-items: stretch;
                }

                .spark-quick-release-grid > * {
                    width: 100%;
                }

                .spark-advanced-grid > * {
                    width: 100%;
                }

                .coach-view-switcher {
                    max-width: 100%;
                }

                .spark-month-board-scroll::-webkit-scrollbar {
                    height: 8px;
                }

                .spark-month-board-scroll::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.12);
                    border-radius: 999px;
                }

                @media (max-width: 1180px) {
                    .coach-dashboard-layout,
                    .coach-detail-grid,
                    .consult-detail-grid,
                    .conversion-grid,
                    .routine-template-grid,
                    .mission-planner-grid,
                    .member-os-grid,
                    .member-routine-list,
                    .spark-hero-grid,
                    .spark-top-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .spark-summary-grid,
                    .member-os-metric-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .coach-sidebar,
                    .coach-main-panel {
                        padding: 1.25rem !important;
                    }
                }

                @media (max-width: 820px) {
                    .coach-page-root {
                        gap: 1.25rem !important;
                    }

                    .coach-view-switcher {
                        width: 100% !important;
                        overflow-x: auto;
                        white-space: nowrap;
                        scrollbar-width: none;
                    }

                    .coach-view-switcher::-webkit-scrollbar {
                        display: none;
                    }

                    .coach-view-switcher button {
                        flex: 0 0 auto;
                    }

                    .spark-summary-grid,
                    .spark-quick-release-grid,
                    .spark-advanced-grid,
                    .conversion-grid,
                    .routine-template-grid,
                    .member-os-grid,
                    .member-routine-list,
                    .spark-weekly-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .coach-sidebar,
                    .coach-main-panel,
                    .spark-hero-panel {
                        padding: 1rem !important;
                        border-radius: 20px !important;
                    }

                    .spark-month-board-panel {
                        padding: 1.2rem !important;
                        border-radius: 22px !important;
                    }

                    .spark-month-board-scroll > div {
                        min-width: 720px !important;
                    }
                }

                @media (max-width: 640px) {
                    .coach-dashboard-layout {
                        gap: 1rem !important;
                    }

                    .coach-view-switcher {
                        gap: 8px !important;
                    }

                    .coach-view-switcher button {
                        padding: 10px 14px !important;
                        font-size: 0.85rem;
                    }

                    .member-os-metric-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
