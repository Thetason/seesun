"use client";

import { useEffect, useRef, useState } from "react";
import { getAssignmentAvailabilityState } from "@/lib/assignment-window";
import { buildAssignmentAudioUrl } from "@/lib/blob-audio";
import ScaleGuideButton from "@/components/ScaleGuideButton";

type MissionAccessFeedback = {
    id: string;
    comment: string | null;
};

type MissionAccessAssignment = {
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    audioFileUrl: string | null;
    guidePresetKey: string | null;
    guidePatternJson: string | null;
    availableFrom: Date | string | null;
    availableUntil: Date | string | null;
    feedbacks: MissionAccessFeedback[];
};

type MissionAccessClientProps = {
    accessToken: string;
    studentName: string;
    trackName?: string | null;
    assignment: MissionAccessAssignment;
};

function formatMissionPossibleWindowLabel(availableFrom: Date | string | null, availableUntil: Date | string | null) {
    const formatDate = (value: Date | string | null) => {
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

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
}

export default function MissionAccessClient({
    accessToken,
    studentName,
    trackName,
    assignment,
}: MissionAccessClientProps) {
    const [uploading, setUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [now, setNow] = useState(new Date());
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const availability = getAssignmentAvailabilityState(assignment, now);
    const remainingTarget = availability.isUpcoming ? availability.availableFrom : availability.availableUntil;
    const remainingTime = remainingTarget
        ? (() => {
            const targetTime = new Date(remainingTarget).getTime();
            const diff = targetTime - now.getTime();

            if (diff <= 0) {
                return null;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        })()
        : null;

    const uploadFile = async (file: File) => {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("assignmentId", assignment.id);
        formData.append("accessToken", accessToken);

        try {
            const response = await fetch("/api/assignments/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Upload failed");
            }

            await response.json();
            alert("오늘의 루틴이 성공적으로 제출되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(`업로드 실패: ${getErrorMessage(error)}`);
        } finally {
            setUploading(false);
        }
    };

    const startRecording = async () => {
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
                const file = new File([audioBlob], `mission-${assignment.id}.${extension}`, { type: mimeType });
                await uploadFile(file);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime((current) => current + 1);
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("마이크 접근 권한이 필요합니다. 설정에서 마이크를 허용해 주세요.");
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current) {
            return;
        }

        mediaRecorderRef.current.stop();
        setIsRecording(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const canSubmit = !assignment.isCompleted && availability.isAvailable;

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #111217 0%, #1d1d1f 100%)", color: "#fff", padding: "2rem 1.25rem 4rem" }}>
            <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "1.25rem" }}>
                <section style={{ borderRadius: "28px", padding: "1.8rem", background: "linear-gradient(135deg, rgba(255,159,10,0.18), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FFB340", marginBottom: "10px", letterSpacing: "0.08em" }}>TODAY&apos;S MISSION</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.65rem" }}>{studentName}님의 오늘 루틴</h1>
                    <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                        링크를 열자마자 오늘의 미션과 스케일 가이드를 바로 확인하고, 이 페이지에서 바로 녹음 제출까지 이어갈 수 있습니다.
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "7px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
                            {trackName || "트랙 미배정"}
                        </span>
                        <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "7px 10px", borderRadius: "999px", background: availability.isAvailable ? "rgba(52,199,89,0.18)" : availability.isUpcoming ? "rgba(0,122,255,0.18)" : "rgba(255,255,255,0.08)" }}>
                            {assignment.isCompleted ? "제출 완료" : availability.isAvailable ? "지금 제출 가능" : availability.isUpcoming ? "오픈 대기" : "제출 시간 종료"}
                        </span>
                        <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "7px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
                            {formatMissionPossibleWindowLabel(assignment.availableFrom, assignment.availableUntil)}
                        </span>
                    </div>
                </section>

                <section style={{ background: "#fff", color: "#1d1d1f", borderRadius: "28px", padding: "1.75rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 14px 40px rgba(0,0,0,0.12)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <div>
                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.06em" }}>MISSION NOTE</div>
                            <h2 style={{ fontSize: "1.55rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>{assignment.title.replace("[Mission Possible] ", "")}</h2>
                            <p style={{ color: "#6e6e73", lineHeight: 1.7, fontSize: "0.95rem" }}>
                                {assignment.description || "코치가 오늘의 루틴 방향을 메모로 남겨두었습니다."}
                            </p>
                        </div>
                        <div style={{ minWidth: "180px", padding: "12px 14px", borderRadius: "18px", background: "#f5f5f7" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#86868b", marginBottom: "6px", letterSpacing: "0.04em" }}>현재 상태</div>
                            <div style={{ fontSize: "1rem", fontWeight: 900, color: "#1d1d1f" }}>
                                {assignment.isCompleted ? "제출 완료" : remainingTime ? `${remainingTime} 남음` : availability.isExpired ? "시간 종료" : "대기 중"}
                            </div>
                            <div style={{ marginTop: "6px", fontSize: "0.8rem", color: "#6e6e73", lineHeight: 1.5 }}>
                                {availability.isUpcoming ? "오픈 시간 이후 이 페이지에서 바로 제출할 수 있습니다." : availability.isExpired ? "현재는 녹음 제출이 닫혀 있습니다." : "오늘 루틴 페이지에서 바로 녹음을 올릴 수 있습니다."}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ padding: "1rem", borderRadius: "20px", background: "rgba(255,159,10,0.08)", border: "1px solid rgba(255,159,10,0.12)" }}>
                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FF9F0A", marginBottom: "8px", letterSpacing: "0.04em" }}>ROUTINE WINDOW</div>
                            <div style={{ fontWeight: 800, color: "#1d1d1f", marginBottom: "6px" }}>{formatMissionPossibleWindowLabel(assignment.availableFrom, assignment.availableUntil)}</div>
                            <div style={{ fontSize: "0.84rem", color: "#48484a", lineHeight: 1.6 }}>
                                미션은 정해진 시간 동안만 제출할 수 있지만, 이 링크는 피드백 확인까지 이어질 수 있도록 조금 더 오래 유지됩니다.
                            </div>
                        </div>

                        <div style={{ padding: "1rem", borderRadius: "20px", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#86868b", marginBottom: "8px", letterSpacing: "0.04em" }}>SCALE GUIDE</div>
                            <ScaleGuideButton
                                title={assignment.title}
                                guidePresetKey={assignment.guidePresetKey}
                                guidePatternJson={assignment.guidePatternJson}
                            />
                        </div>
                    </div>
                </section>

                <section style={{ background: "#fff", color: "#1d1d1f", borderRadius: "28px", padding: "1.75rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 14px 40px rgba(0,0,0,0.12)" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px", letterSpacing: "0.06em" }}>VOICE SUBMISSION</div>
                    <h2 style={{ fontSize: "1.45rem", fontWeight: 900, marginBottom: "0.55rem", letterSpacing: "-0.03em" }}>여기서 바로 루틴 제출</h2>
                    <p style={{ color: "#6e6e73", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1rem" }}>
                        별도 로그인 없이 이 페이지에서 바로 녹음하거나 파일을 올릴 수 있습니다.
                    </p>

                    {canSubmit ? (
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {isRecording ? (
                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    style={{ background: "#ff3b30", color: "#fff", border: "none", borderRadius: "14px", padding: "13px 18px", fontWeight: 900, cursor: "pointer" }}
                                >
                                    녹음 중단 및 제출 ({formatTime(recordingTime)})
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    disabled={uploading}
                                    style={{ background: "#FF9F0A", color: "#fff", border: "none", borderRadius: "14px", padding: "13px 18px", fontWeight: 900, cursor: "pointer", opacity: uploading ? 0.7 : 1 }}
                                >
                                    {uploading ? "업로드 중..." : "🎤 바로 녹음 시작"}
                                </button>
                            )}

                            <label
                                htmlFor="mission-link-file-upload"
                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#f5f5f7", color: "#1d1d1f", borderRadius: "14px", padding: "13px 18px", fontWeight: 800, cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.6 : 1 }}
                            >
                                파일로 제출
                            </label>
                            <input
                                id="mission-link-file-upload"
                                type="file"
                                accept="audio/*"
                                disabled={uploading}
                                style={{ display: "none" }}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];

                                    if (file) {
                                        void uploadFile(file);
                                    }

                                    event.target.value = "";
                                }}
                            />
                        </div>
                    ) : availability.isUpcoming ? (
                        <div style={{ padding: "14px 16px", borderRadius: "16px", background: "rgba(0,122,255,0.08)", color: "#007aff", fontWeight: 700 }}>
                            아직 미션이 열리지 않았습니다. 오픈 시간 이후 이 페이지에서 바로 제출할 수 있습니다.
                        </div>
                    ) : assignment.isCompleted ? (
                        <div style={{ padding: "14px 16px", borderRadius: "16px", background: "rgba(52,199,89,0.08)", color: "#1d1d1f", fontWeight: 700 }}>
                            이 루틴은 이미 제출되었습니다. 아래에서 제출 음성과 코치 피드백을 확인해 주세요.
                        </div>
                    ) : (
                        <div style={{ padding: "14px 16px", borderRadius: "16px", background: "#f5f5f7", color: "#6e6e73", fontWeight: 700 }}>
                            제출 가능 시간이 종료되었습니다. 다음 루틴이 열리면 새 링크로 바로 들어올 수 있습니다.
                        </div>
                    )}

                    {(assignment.audioFileUrl || assignment.feedbacks[0]) && (
                        <div style={{ display: "grid", gap: "0.9rem", marginTop: "1.25rem" }}>
                            {assignment.audioFileUrl && (
                                <div style={{ background: "#f9f9fb", padding: "1rem", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.05)" }}>
                                    <div style={{ fontSize: "0.78rem", color: "#86868b", fontWeight: 800, marginBottom: "8px" }}>내가 제출한 루틴</div>
                                    <audio controls src={buildAssignmentAudioUrl(assignment.id, accessToken)} style={{ width: "100%", height: "40px" }} />
                                </div>
                            )}
                            {assignment.feedbacks[0]?.comment && (
                                <div style={{ background: "rgba(255,159,10,0.08)", padding: "1rem", borderRadius: "18px", border: "1px solid rgba(255,159,10,0.1)" }}>
                                    <div style={{ fontSize: "0.78rem", color: "#FF9F0A", fontWeight: 800, marginBottom: "8px" }}>코치 코멘트</div>
                                    <p style={{ fontSize: "0.95rem", color: "#1d1d1f", lineHeight: 1.7, margin: 0 }}>{assignment.feedbacks[0].comment}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
