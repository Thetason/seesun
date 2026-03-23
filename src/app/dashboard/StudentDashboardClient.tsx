"use client";

import type { Prisma } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { getAssignmentAvailabilityState } from "@/lib/assignment-window";
import { buildAssignmentAudioUrl } from "@/lib/blob-audio";
import ScaleGuideButton from "@/components/ScaleGuideButton";
import { getAssignmentScaleGuidePattern } from "@/lib/scale-guide";

type StudentDashboardAssignment = Prisma.AssignmentGetPayload<{
    include: { feedbacks: true };
}>;

type StudentDashboardStudent = Prisma.UserGetPayload<{
    include: {
        track: true;
        assignments: {
            include: { feedbacks: true };
        };
    };
}>;

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
}

function isFreePracticeAssignment(assignment: StudentDashboardAssignment) {
    return assignment.title.startsWith("[Free Practice]");
}

function getMissionPossibleDisplayTitle(title: string) {
    return title.replace("[Mission Possible] ", "");
}

function formatMissionPossibleWindowLabel(availableFrom: Date | string | null | undefined, availableUntil: Date | string | null | undefined) {
    const formatDate = (value: Date | string | null | undefined) => {
        if (!value) {
            return null;
        }

        return new Intl.DateTimeFormat("ko-KR", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Seoul",
        }).format(new Date(value));
    };

    const fromLabel = formatDate(availableFrom);
    const untilLabel = formatDate(availableUntil);

    if (fromLabel && untilLabel) {
        return `${fromLabel} - ${untilLabel}`;
    }

    return fromLabel || untilLabel || "일정 미정";
}

function getRecordingFileConfig(mimeType?: string) {
    const normalizedMimeType = mimeType?.split(";")[0]?.trim();

    if (normalizedMimeType === "audio/mp4" || normalizedMimeType === "audio/x-m4a") {
        return {
            mimeType: "audio/mp4",
            extension: "m4a",
        };
    }

    if (normalizedMimeType === "audio/ogg") {
        return {
            mimeType: "audio/ogg",
            extension: "ogg",
        };
    }

    return {
        mimeType: normalizedMimeType || "audio/webm",
        extension: normalizedMimeType?.includes("mpeg") ? "mp3" : "webm",
    };
}

export default function StudentDashboardClient({ studentData }: { studentData: StudentDashboardStudent }) {
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState<string | null>(null); // assignmentId
    const [recordingTime, setRecordingTime] = useState(0);
    const [now, setNow] = useState(new Date());
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const quickUploadRef = useRef<HTMLInputElement>(null);

    // Live Timer for Countdown
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getRemainingTime = (target: Date | string | null) => {
        if (!target) return null;
        const targetTime = new Date(target).getTime();
        const diff = targetTime - now.getTime();

        if (diff <= 0) {
            return null;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Audio Recording Logic
    const startRecording = async (assignmentId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const preferredMimeType = [
                "audio/mp4",
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/ogg;codecs=opus",
                "audio/ogg",
            ].find((mimeType) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mimeType));
            const mediaRecorder = preferredMimeType
                ? new MediaRecorder(stream, { mimeType: preferredMimeType })
                : new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const { mimeType, extension } = getRecordingFileConfig(mediaRecorder.mimeType || audioChunksRef.current[0]?.type);
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                const file = new File([audioBlob], `recording-${assignmentId}.${extension}`, { type: mimeType });
                await uploadFile(file, assignmentId);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(assignmentId);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("마이크 접근 권한이 필요합니다. 설정에서 마이크를 허용해주세요.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(null);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const uploadFile = async (file: File, assignmentId?: string) => {
        setUploadingId(assignmentId || 'quick');

        const formData = new FormData();
        formData.append('file', file);
        if (assignmentId) formData.append('assignmentId', assignmentId);

        try {
            const res = await fetch('/api/assignments/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            await res.json();
            alert(
                assignmentId
                    ? "성공적으로 녹음 및 제출 완료되었습니다!"
                    : "자유 연습 업로드가 저장되었습니다. 음성 피드백 보관함과 코치 워크스페이스에서 바로 확인할 수 있습니다."
            );
            window.location.reload();
        } catch (error: unknown) {
            console.error(error);
            alert(`업로드 실패: ${getErrorMessage(error)}\n\nVercel Blob 스토리지 설정이 올바른지 확인해주세요.`);
        } finally {
            setUploadingId(null);
        }
    };

    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>, assignmentId?: string) => {
        const file = event.target.files?.[0];
        if (file) uploadFile(file, assignmentId);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Calculate progress based on completed assignments
    const missionAssignments = (studentData.assignments || []).filter((assignment) => !isFreePracticeAssignment(assignment));
    const practiceUploads = (studentData.assignments || [])
        .filter((assignment) => isFreePracticeAssignment(assignment))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const sortedAssignments = [...missionAssignments].sort(
        (a: StudentDashboardAssignment, b: StudentDashboardAssignment) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0)
    );
    const timelineMissions = sortedAssignments.map((mission) => {
        const availability = getAssignmentAvailabilityState(mission, now);

        return {
            mission,
            availability,
            isMissionPossible: availability.hasWindow,
        };
    });
    const missionPossibleAssignments = timelineMissions
        .filter(({ isMissionPossible }) => isMissionPossible)
        .sort((left, right) => {
            const leftTime = new Date(left.availability.availableFrom || left.mission.createdAt).getTime();
            const rightTime = new Date(right.availability.availableFrom || right.mission.createdAt).getTime();
            return leftTime - rightTime;
        });
    const regularTimelineAssignments = timelineMissions.filter(({ isMissionPossible }) => !isMissionPossible);
    const curriculumMissionCount = regularTimelineAssignments.length || 0;
    const completedCurriculumMissionCount = regularTimelineAssignments.filter(({ mission }) => mission.isCompleted).length || 0;
    const progressPerc = curriculumMissionCount === 0 ? 0 : Math.round((completedCurriculumMissionCount / curriculumMissionCount) * 100);
    const activeSequentialMissionId = regularTimelineAssignments.find(({ mission }) => !mission.isCompleted)?.mission.id ?? null;
    const openMissionPossibleAssignments = missionPossibleAssignments.filter(
        ({ mission, availability }) => !mission.isCompleted && availability.isAvailable
    );

    return (
        <div className="student-dashboard-root" style={{ paddingBottom: "4rem" }}>
            {/* Gamification Header */}
            <section className="student-hero-panel" style={{ background: "#fff", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="student-hero-main" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div style={{ textAlign: "right" }}>
                        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px", color: "#1d1d1f", letterSpacing: "-0.03em" }}>안녕하세요, {studentData.name}님! 👋</h1>
                        <p style={{ color: "#86868b", fontSize: "1.1rem", fontWeight: 500 }}>{studentData.track?.name || "배정 대기"} 클래스를 멋지게 소화하고 계시네요.</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        style={{
                            background: "#f5f5f7",
                            border: "1px solid rgba(0,0,0,0.1)",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            color: "#86868b",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        className="hover:bg-black hover:text-white"
                    >
                        로그아웃
                    </button>
                </div>
                <div className="student-hero-progress" style={{ textAlign: "right", width: "320px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "1rem", fontWeight: 700 }}>
                        <span style={{ color: "#1d1d1f" }}>장기 커리큘럼 성장도</span>
                        <span style={{ color: "#FF9F0A" }}>{progressPerc}%</span>
                    </div>
                    <div style={{ width: "100%", height: "12px", background: "#f5f5f7", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.03)" }}>
                        <div style={{ width: `${progressPerc}%`, height: "100%", background: "linear-gradient(90deg, #FF9F0A, #FFD60A)", borderRadius: "6px", transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}></div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#86868b", marginTop: "10px", fontWeight: 500 }}>
                        {curriculumMissionCount > 0
                            ? `장기 커리큘럼 ${curriculumMissionCount}개 중 ${completedCurriculumMissionCount}개의 단계를 완료했습니다.`
                            : "현재는 선택형 루틴 중심으로 진행 중이며, 장기 커리큘럼이 열리면 성장도가 반영됩니다."}
                    </p>
                </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                {missionPossibleAssignments.length > 0 && (
                    <section className="student-mission-possible-board" style={{ background: "#fff", borderRadius: "28px", padding: "1.75rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.08em" }}>MISSION POSSIBLE</div>
                                <h2 style={{ fontSize: "1.55rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "6px", letterSpacing: "-0.03em" }}>오늘의 선택형 루틴 보드</h2>
                                <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                    현재 열려 있는 미션파서블만 이 보드에 표시됩니다. 예정되었거나 이미 끝난 카드는 아래 레슨 메모에서 확인할 수 있습니다.
                                </p>
                            </div>
                            <div style={{ padding: "10px 14px", borderRadius: "14px", background: "rgba(255,159,10,0.08)", color: "#FF9F0A", fontWeight: 800, fontSize: "0.86rem" }}>
                                활성 루틴 {openMissionPossibleAssignments.length}개
                            </div>
                        </div>

                        {openMissionPossibleAssignments.length > 0 ? (
                            <div className="student-open-mission-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                                {openMissionPossibleAssignments.map(({ mission, availability }) => {
                                    const remainingTime = getRemainingTime(availability.availableUntil);
                                    const hasScaleGuide = Boolean(
                                        getAssignmentScaleGuidePattern({
                                            title: mission.title,
                                            guidePresetKey: mission.guidePresetKey,
                                            guidePatternJson: mission.guidePatternJson,
                                        })
                                    );

                                    return (
                                        <a
                                            key={mission.id}
                                            href={`#lesson-note-${mission.id}`}
                                            style={{
                                                background: "linear-gradient(180deg, rgba(255,159,10,0.10), rgba(255,255,255,1))",
                                                borderRadius: "20px",
                                                border: "1px solid rgba(255,159,10,0.18)",
                                                padding: "1rem",
                                                textDecoration: "none",
                                                color: "#1d1d1f",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FF9F0A", letterSpacing: "0.06em" }}>
                                                    LIVE NOW
                                                </span>
                                                <span style={{ fontSize: "0.78rem", color: "#FF9F0A", fontWeight: 800 }}>
                                                    {remainingTime ? `${remainingTime} 남음` : "지금 진행 가능"}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.35, marginBottom: "0.5rem" }}>
                                                {getMissionPossibleDisplayTitle(mission.title)}
                                            </div>
                                            {hasScaleGuide && (
                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "0.65rem", fontSize: "0.74rem", fontWeight: 800, color: "#FF9F0A", background: "rgba(255,159,10,0.12)", borderRadius: "999px", padding: "6px 10px" }}>
                                                    🎹 피아노 스케일 가이드 포함
                                                </div>
                                            )}
                                            <div style={{ fontSize: "0.82rem", color: "#86868b", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                                                {formatMissionPossibleWindowLabel(availability.availableFrom, availability.availableUntil)}
                                            </div>
                                            <div style={{ fontSize: "0.86rem", color: "#48484a", lineHeight: 1.55, marginBottom: "0.9rem" }}>
                                                {mission.description || "코치가 남긴 오늘의 루틴 메모입니다."}
                                            </div>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 12px", borderRadius: "12px", background: "#1d1d1f", color: "#fff", fontWeight: 800, fontSize: "0.85rem" }}>
                                                레슨 메모 열기
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ background: "#f9f9fb", borderRadius: "20px", border: "1px dashed rgba(0,0,0,0.08)", padding: "1.2rem", color: "#86868b" }}>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1d1d1f", marginBottom: "0.4rem" }}>지금 열려 있는 미션파서블이 없습니다.</div>
                                <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                                    다음 루틴 오픈 시간을 기다리거나, 아래 레슨 메모에서 오늘 예정된 카드와 이미 완료한 카드를 함께 확인해 주세요.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {missionPossibleAssignments.length > 0 && (
                    <section className="student-lesson-memo-shell" style={{ background: "#fff", borderRadius: "28px", padding: "1.75rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px", letterSpacing: "0.08em" }}>LESSON MEMO</div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "6px", letterSpacing: "-0.03em" }}>코치 레슨 메모</h2>
                            <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                미션파서블은 순서 고정 스텝이 아니라, 코치가 오늘 제안한 선택형 루틴 메모입니다.
                            </p>
                        </div>

                        <div className="student-lesson-memo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
                            {missionPossibleAssignments.map(({ mission, availability }) => {
                                const isLive = !mission.isCompleted && availability.isAvailable;
                                const isUpcoming = !mission.isCompleted && availability.isUpcoming;
                                const isExpired = !mission.isCompleted && availability.isExpired;
                                const remainingTime = isUpcoming
                                    ? getRemainingTime(availability.availableFrom)
                                    : getRemainingTime(availability.availableUntil);
                                const hasScaleGuide = Boolean(
                                    getAssignmentScaleGuidePattern({
                                        title: mission.title,
                                        guidePresetKey: mission.guidePresetKey,
                                        guidePatternJson: mission.guidePatternJson,
                                    })
                                );

                                return (
                                    <article
                                        key={mission.id}
                                        id={`lesson-note-${mission.id}`}
                                        style={{
                                            scrollMarginTop: "110px",
                                            background: "#f9f9fb",
                                            borderRadius: "22px",
                                            padding: "1.25rem",
                                            border: `1px solid ${isLive ? "rgba(255,159,10,0.18)" : isUpcoming ? "rgba(0,122,255,0.14)" : "rgba(0,0,0,0.05)"}`,
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1d1d1f", background: "#fff", padding: "6px 10px", borderRadius: "999px" }}>
                                                    레슨 메모
                                                </span>
                                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: isLive ? "#FF9F0A" : isUpcoming ? "#007aff" : isExpired ? "#8e8e93" : "#34C759", background: isLive ? "rgba(255,159,10,0.12)" : isUpcoming ? "rgba(0,122,255,0.08)" : "rgba(0,0,0,0.06)", padding: "6px 10px", borderRadius: "999px" }}>
                                                    {mission.isCompleted ? "완료됨" : isLive ? "지금 진행 가능" : isUpcoming ? "오픈 대기" : "시간 종료"}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: "0.78rem", color: isLive ? "#FF9F0A" : isUpcoming ? "#007aff" : "#86868b", fontWeight: 800 }}>
                                                {mission.isCompleted ? "제출 완료" : remainingTime ? `${remainingTime} 남음` : formatMissionPossibleWindowLabel(availability.availableFrom, availability.availableUntil)}
                                            </div>
                                        </div>

                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "0.65rem", lineHeight: 1.35 }}>
                                            {getMissionPossibleDisplayTitle(mission.title)}
                                        </h3>
                                        <p style={{ color: "#48484a", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                                            {mission.description || "코치가 오늘의 루틴 방향을 메모로 남겨두었습니다."}
                                        </p>
                                        <div style={{ fontSize: "0.82rem", color: "#86868b", marginBottom: "1rem" }}>
                                            {formatMissionPossibleWindowLabel(availability.availableFrom, availability.availableUntil)}
                                        </div>

                                        {hasScaleGuide && (
                                            <div style={{ marginBottom: "1rem" }}>
                                                <ScaleGuideButton
                                                    title={mission.title}
                                                    guidePresetKey={mission.guidePresetKey}
                                                    guidePatternJson={mission.guidePatternJson}
                                                />
                                            </div>
                                        )}

                                        {!mission.isCompleted && isLive && (
                                            <div className="student-mission-actions" style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                                                {isRecording === mission.id ? (
                                                    <button
                                                        onClick={stopRecording}
                                                        style={{
                                                            background: "#ff3b30",
                                                            color: "#fff",
                                                            padding: "12px 24px",
                                                            borderRadius: "12px",
                                                            fontWeight: 800,
                                                            border: "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <span style={{ width: "10px", height: "10px", background: "#fff", borderRadius: "2px" }}></span>
                                                        녹음 중단 및 제출 ({formatTime(recordingTime)})
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startRecording(mission.id)}
                                                            style={{
                                                                background: "#FF9F0A",
                                                                color: "#fff",
                                                                padding: "12px 24px",
                                                                borderRadius: "12px",
                                                                fontWeight: 800,
                                                                border: "none",
                                                                cursor: "pointer",
                                                                boxShadow: "0 4px 15px rgba(255,159,10,0.24)",
                                                                opacity: uploadingId === mission.id ? 0.7 : 1,
                                                                pointerEvents: uploadingId === mission.id ? "none" : "auto",
                                                            }}
                                                        >
                                                            {uploadingId === mission.id ? "업로드 중..." : "🎤 바로 루틴 시작"}
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="audio/*"
                                                            style={{ display: "none" }}
                                                            id={`upload-${mission.id}`}
                                                            onChange={(e) => handleFileUploadChange(e, mission.id)}
                                                        />
                                                        <label
                                                            htmlFor={`upload-${mission.id}`}
                                                            style={{
                                                                background: "#fff",
                                                                color: "#86868b",
                                                                padding: "12px 20px",
                                                                borderRadius: "12px",
                                                                fontWeight: 700,
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            파일 선택
                                                        </label>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {isUpcoming && (
                                            <div style={{ marginTop: "1rem", padding: "12px", background: "rgba(0,122,255,0.06)", borderRadius: "12px", color: "#007aff", fontSize: "0.9rem", fontWeight: 600 }}>
                                                ⏳ 아직 열리지 않은 루틴입니다. 오픈 시간 이후 이 카드에서 바로 제출할 수 있습니다.
                                            </div>
                                        )}

                                        {isExpired && (
                                            <div style={{ marginTop: "1rem", padding: "12px", background: "#f1f1f4", borderRadius: "12px", color: "#86868b", fontSize: "0.9rem", fontWeight: 600 }}>
                                                🔒 오늘 이 루틴의 제출 가능 시간이 종료되었습니다.
                                            </div>
                                        )}

                                        {mission.isCompleted && (
                                            <div style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
                                                {mission.audioFileUrl && (
                                                    <div style={{ background: "#fff", padding: "1rem", borderRadius: "16px" }}>
                                                        <div style={{ fontSize: "0.78rem", color: "#86868b", fontWeight: 800, marginBottom: "8px" }}>내가 제출한 루틴</div>
                                                        <audio controls src={buildAssignmentAudioUrl(mission.id)} style={{ width: "100%", height: "40px" }} />
                                                    </div>
                                                )}
                                                {mission.feedbacks[0] && (
                                                    <div style={{ background: "rgba(255,159,10,0.08)", padding: "1rem", borderRadius: "16px", border: "1px solid rgba(255,159,10,0.1)" }}>
                                                        <div style={{ fontSize: "0.78rem", color: "#FF9F0A", fontWeight: 800, marginBottom: "8px" }}>코치 코멘트</div>
                                                        <p style={{ fontSize: "0.92rem", color: "#1d1d1f", lineHeight: 1.6 }}>{mission.feedbacks[0].comment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section>
                    <div style={{ textAlign: "center", position: "relative", marginBottom: "1rem" }}>
                        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #e5e5ea, transparent)", zIndex: 0 }}></div>
                        <span style={{ position: "relative", background: "#f5f5f7", padding: "0 20px", fontSize: "1.2rem", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em" }}>장기 커리큘럼 타임라인</span>
                    </div>

                    <div className="student-timeline-shell" style={{ position: "relative", padding: "2rem 0" }}>
                        <div className="student-timeline-line" style={{
                            position: "absolute",
                            left: "50%",
                            top: 0,
                            bottom: 0,
                            width: "4px",
                            background: "linear-gradient(to bottom, #FF9F0A 0%, #FF9F0A " + progressPerc + "%, #e5e5ea " + progressPerc + "%, #e5e5ea 100%)",
                            transform: "translateX(-50%)",
                            borderRadius: "2px",
                            zIndex: 0
                        }}></div>

                        {regularTimelineAssignments.length === 0 ? (
                            <div style={{ padding: "3rem", textAlign: "center", background: "#fff", borderRadius: "24px", color: "#86868b", border: "1px dashed #d1d1d6", position: "relative", zIndex: 1 }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "0.9rem" }}>🗂️</div>
                                <h3 style={{ fontWeight: 700, fontSize: "1.15rem", color: "#1d1d1f" }}>장기 커리큘럼 메모 준비 중</h3>
                                <p style={{ marginTop: "10px" }}>지금은 미션파서블 중심으로 운영 중이며, 순차 커리큘럼은 코치가 이어서 정리합니다.</p>
                            </div>
                        ) : (
                            <div style={{ position: "relative", zIndex: 1 }}>
                                {regularTimelineAssignments.map(({ mission }, index) => {
                                    const isEven = index % 2 === 0;
                                    const isActive = mission.id === activeSequentialMissionId;
                                    const cardOpacity = mission.isCompleted || isActive ? 1 : 0.68;

                                    return (
                                        <div key={mission.id} className="student-mission-row" style={{ marginBottom: "4rem", width: "100%", position: "relative" }}>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", position: "relative" }}>
                                                <div className="student-mission-side" style={{ width: "45%", textAlign: isEven ? "right" : "left", padding: "0 2rem", opacity: cardOpacity }}>
                                                    {isEven && (
                                                        <div style={{ animation: "fadeInLeft 0.6s ease-out forwards" }}>
                                                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                                                <div style={{ background: mission.isCompleted ? "#FF9F0A" : "#1d1d1f", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                                                                    STEP {index + 1}
                                                                </div>
                                                            </div>
                                                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#1d1d1f" }}>{mission.title}</h3>
                                                            <p style={{ fontSize: "1rem", color: "#48484a", lineHeight: 1.6 }}>{mission.description}</p>
                                                            {mission.isCompleted && mission.feedbacks[0] && (
                                                                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(255, 159, 10, 0.05)", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)", textAlign: "left" }}>
                                                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF9F0A", marginBottom: "8px" }}>코치 솔루션</div>
                                                                    <p style={{ fontSize: "0.9rem", color: "#1d1d1f", fontWeight: 500 }}>{mission.feedbacks[0].comment}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="student-mission-node" style={{
                                                    position: "relative",
                                                    width: "60px",
                                                    height: "60px",
                                                    borderRadius: "50%",
                                                    background: "#fff",
                                                    border: `4px solid ${mission.isCompleted ? "#FF9F0A" : isActive ? "#FF9F0A" : "#e5e5ea"}`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    zIndex: 2,
                                                    boxShadow: isActive ? "0 0 20px rgba(255,159,10,0.25)" : "none",
                                                }}>
                                                    {mission.isCompleted ? (
                                                        <span style={{ fontSize: "1.5rem" }}>✅</span>
                                                    ) : (
                                                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: isActive ? "#FF9F0A" : "#86868b" }}>{index + 1}</span>
                                                    )}
                                                </div>

                                                <div className="student-mission-side" style={{ width: "45%", textAlign: !isEven ? "left" : "right", padding: "0 2rem", opacity: cardOpacity }}>
                                                    {!isEven && (
                                                        <div style={{ animation: "fadeInRight 0.6s ease-out forwards" }}>
                                                            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                                                <div style={{ background: mission.isCompleted ? "#FF9F0A" : "#1d1d1f", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                                                                    STEP {index + 1}
                                                                </div>
                                                            </div>
                                                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#1d1d1f" }}>{mission.title}</h3>
                                                            <p style={{ fontSize: "1rem", color: "#48484a", lineHeight: 1.6 }}>{mission.description}</p>
                                                            {mission.isCompleted && mission.feedbacks[0] && (
                                                                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(255, 159, 10, 0.05)", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)", textAlign: "left" }}>
                                                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF9F0A", marginBottom: "8px" }}>코치 솔루션</div>
                                                                    <p style={{ fontSize: "0.9rem", color: "#1d1d1f", fontWeight: 500 }}>{mission.feedbacks[0].comment}</p>
                                                                </div>
                                                            )}

                                                            {!mission.isCompleted && isActive && (
                                                                <div className="student-mission-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                                                                    {isRecording === mission.id ? (
                                                                        <button
                                                                            onClick={stopRecording}
                                                                            style={{
                                                                                background: "#ff3b30",
                                                                                color: "#fff",
                                                                                padding: "12px 24px",
                                                                                borderRadius: "12px",
                                                                                fontWeight: 800,
                                                                                border: "none",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "8px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <span style={{ width: "10px", height: "10px", background: "#fff", borderRadius: "2px" }}></span>
                                                                            녹음 중단 및 제출 ({formatTime(recordingTime)})
                                                                        </button>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                onClick={() => startRecording(mission.id)}
                                                                                style={{
                                                                                    background: "#FF9F0A",
                                                                                    color: "#fff",
                                                                                    padding: "12px 24px",
                                                                                    borderRadius: "12px",
                                                                                    fontWeight: 800,
                                                                                    border: "none",
                                                                                    cursor: "pointer",
                                                                                    boxShadow: "0 4px 15px rgba(255,159,10,0.24)",
                                                                                    opacity: uploadingId === mission.id ? 0.7 : 1,
                                                                                    pointerEvents: uploadingId === mission.id ? "none" : "auto",
                                                                                }}
                                                                            >
                                                                                {uploadingId === mission.id ? "업로드 중..." : "🎤 바로 루틴 시작"}
                                                                            </button>
                                                                            <input
                                                                                type="file"
                                                                                accept="audio/*"
                                                                                style={{ display: "none" }}
                                                                                id={`upload-${mission.id}`}
                                                                                onChange={(e) => handleFileUploadChange(e, mission.id)}
                                                                            />
                                                                            <label
                                                                                htmlFor={`upload-${mission.id}`}
                                                                                style={{
                                                                                    background: "#f5f5f7",
                                                                                    color: "#86868b",
                                                                                    padding: "12px 20px",
                                                                                    borderRadius: "12px",
                                                                                    fontWeight: 700,
                                                                                    cursor: "pointer",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    fontSize: "0.9rem",
                                                                                }}
                                                                            >
                                                                                파일 선택
                                                                            </label>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {!mission.isCompleted && !isActive && (
                                                                <div style={{ marginTop: "20px", padding: "12px", background: "#f5f5f7", borderRadius: "12px", color: "#86868b", fontSize: "0.9rem", fontWeight: 600 }}>
                                                                    이전 커리큘럼 단계를 완료하면 이 미션이 이어집니다.
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <div className="student-quick-practice" style={{
                    background: "#1d1d1f",
                    padding: "2.5rem",
                    borderRadius: "32px",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "2rem",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
                }}>
                    <div className="student-quick-practice__copy" style={{ maxWidth: "60%" }}>
                        <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.02em" }}>자유로운 추가 연습</h3>
                        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>미션 외에도 자유롭게 녹음 파일을 올려보세요. 코치가 틈틈이 확인하고 조언을 해드립니다.</p>
                    </div>
                    <div className="student-quick-practice__actions" style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={() => isRecording === 'quick' ? stopRecording() : startRecording('quick')}
                            style={{
                                background: isRecording === 'quick' ? "#ff3b30" : "#FF9F0A",
                                color: "#fff",
                                border: "none",
                                padding: "16px 32px",
                                borderRadius: "16px",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                boxShadow: isRecording === 'quick' ? "0 4px 15px rgba(255,59,48,0.3)" : "none"
                            }}
                        >
                            {isRecording === 'quick' ? `중단 및 제출 (${formatTime(recordingTime)})` : "🎤 바로 녹음"}
                        </button>
                        <input
                            type="file"
                            accept="audio/*"
                            style={{ display: "none" }}
                            ref={quickUploadRef}
                            onChange={(e) => handleFileUploadChange(e)}
                        />
                        <button
                            onClick={() => quickUploadRef.current?.click()}
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                border: "none",
                                padding: "16px 32px",
                                borderRadius: "16px",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                cursor: "pointer"
                            }}
                        >
                            파일 선택
                        </button>
                    </div>
                </div>

                {practiceUploads.length > 0 && (
                    <section style={{ background: "#fff", padding: "1.75rem", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.08em" }}>FREE PRACTICE</div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1d1d1f", marginBottom: "6px" }}>최근 자유 연습 업로드</h3>
                                <p style={{ color: "#86868b", fontSize: "0.92rem", lineHeight: 1.6 }}>미션 외에 올린 추가 녹음도 여기와 보관함에서 바로 확인할 수 있습니다.</p>
                            </div>
                            <a href="/dashboard/archive" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 14px", borderRadius: "12px", background: "#f5f5f7", color: "#1d1d1f", fontWeight: 800, textDecoration: "none" }}>
                                보관함 열기
                            </a>
                        </div>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {practiceUploads.slice(0, 3).map((assignment) => (
                                <div key={assignment.id} style={{ background: "#f9f9fb", borderRadius: "18px", padding: "1rem", border: "1px solid rgba(0,0,0,0.05)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                                        <div style={{ fontWeight: 800, color: "#1d1d1f" }}>{assignment.title.replace("[Free Practice] ", "자유 연습 · ")}</div>
                                        <div style={{ fontSize: "0.82rem", color: "#86868b" }}>{new Date(assignment.updatedAt).toLocaleString("ko-KR")}</div>
                                    </div>
                                    {assignment.audioFileUrl ? (
                                        <audio controls src={buildAssignmentAudioUrl(assignment.id)} style={{ width: "100%", height: "40px" }} />
                                    ) : (
                                        <p style={{ color: "#86868b", fontSize: "0.88rem" }}>파일 정보가 아직 반영되지 않았습니다.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 159, 10, 0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(255, 159, 10, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 159, 10, 0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @media (max-width: 900px) {
                    .student-dashboard-root .student-hero-panel,
                    .student-dashboard-root .student-quick-practice {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 1.25rem !important;
                    }

                    .student-dashboard-root .student-hero-main {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1rem !important;
                    }

                    .student-dashboard-root .student-hero-main > div {
                        text-align: left !important;
                    }

                    .student-dashboard-root .student-hero-progress,
                    .student-dashboard-root .student-quick-practice__copy {
                        width: 100% !important;
                        max-width: none !important;
                        text-align: left !important;
                    }

                    .student-dashboard-root .student-timeline-line {
                        display: none !important;
                    }

                    .student-dashboard-root .student-open-mission-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .student-dashboard-root .student-lesson-memo-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .student-dashboard-root .student-timeline-shell {
                        padding: 0.5rem 0 !important;
                    }

                    .student-dashboard-root .student-mission-row {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 0.9rem !important;
                        margin-bottom: 2rem !important;
                    }

                    .student-dashboard-root .student-mission-node {
                        order: 1;
                        align-self: flex-start;
                    }

                    .student-dashboard-root .student-mission-side {
                        order: 2;
                        width: 100% !important;
                        padding: 0 !important;
                        text-align: left !important;
                    }

                    .student-dashboard-root .student-mission-actions,
                    .student-dashboard-root .student-quick-practice__actions {
                        flex-direction: column !important;
                    }
                }

                @media (max-width: 640px) {
                    .student-dashboard-root .student-hero-panel,
                    .student-dashboard-root .student-quick-practice,
                    .student-dashboard-root .student-mission-possible-board,
                    .student-dashboard-root .student-lesson-memo-shell {
                        padding: 1.25rem !important;
                        border-radius: 22px !important;
                    }

                    .student-dashboard-root h1 {
                        font-size: 1.65rem !important;
                        line-height: 1.15 !important;
                    }
                }
            `}</style>
        </div>
    );
}
