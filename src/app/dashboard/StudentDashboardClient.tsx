"use client";

import type { Prisma } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

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

export default function StudentDashboardClient({ studentData }: { studentData: StudentDashboardStudent }) {
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState<string | null>(null); // assignmentId
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const quickUploadRef = useRef<HTMLInputElement>(null);

    // Audio Recording Logic
    const startRecording = async (assignmentId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const file = new File([audioBlob], `recording-${assignmentId}.webm`, { type: 'audio/webm' });
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

            alert('성공적으로 녹음 및 제출 완료되었습니다!');
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
    const totalMissions = studentData.assignments?.length || 0;
    const sortedAssignments = [...(studentData.assignments || [])].sort(
        (a: StudentDashboardAssignment, b: StudentDashboardAssignment) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0)
    );
    const completedMissionsCount = sortedAssignments.filter((mission: StudentDashboardAssignment) => mission.isCompleted).length || 0;
    const progressPerc = totalMissions === 0 ? 0 : Math.round((completedMissionsCount / totalMissions) * 100);
    const activeMissionIndex = sortedAssignments.findIndex((mission: StudentDashboardAssignment) => !mission.isCompleted);

    return (
        <div style={{ paddingBottom: "4rem" }}>
            {/* Gamification Header */}
            <section style={{ background: "#fff", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
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
                <div style={{ textAlign: "right", width: "320px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "1rem", fontWeight: 700 }}>
                        <span style={{ color: "#1d1d1f" }}>나의 성장도</span>
                        <span style={{ color: "#FF9F0A" }}>{progressPerc}%</span>
                    </div>
                    <div style={{ width: "100%", height: "12px", background: "#f5f5f7", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.03)" }}>
                        <div style={{ width: `${progressPerc}%`, height: "100%", background: "linear-gradient(90deg, #FF9F0A, #FFD60A)", borderRadius: "6px", transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}></div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#86868b", marginTop: "10px", fontWeight: 500 }}>
                        {totalMissions > 0 ? `총 ${totalMissions}개 중 ${completedMissionsCount}개의 관문을 통과했습니다.` : "곧 첫 번째 미션이 도착할 예정입니다."}
                    </p>
                </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
                <div style={{ textAlign: "center", position: "relative", marginBottom: "1rem" }}>
                    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #e5e5ea, transparent)", zIndex: 0 }}></div>
                    <span style={{ position: "relative", background: "#f5f5f7", padding: "0 20px", fontSize: "1.2rem", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em" }}>나의 학습 타임라인</span>
                </div>

                <div style={{ position: "relative", padding: "2rem 0" }}>
                    <div style={{
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

                    {totalMissions === 0 ? (
                        <div style={{ padding: "4rem", textAlign: "center", background: "#fff", borderRadius: "24px", color: "#86868b", border: "1px dashed #d1d1d6", position: "relative", zIndex: 1 }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
                            <h3 style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1d1d1f" }}>미션 배정 대기 중</h3>
                            <p style={{ marginTop: "10px" }}>전문 코치가 회원님께 딱 맞는 커리큘럼을 준비하고 있습니다.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative", zIndex: 1 }}>
                            {sortedAssignments.map((mission: StudentDashboardAssignment, index: number) => {
                                const isEven = index % 2 === 0;
                                const isActive = index === activeMissionIndex;
                                return (
                                    <div key={mission.id} style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: "4rem",
                                        width: "100%",
                                        position: "relative"
                                    }}>
                                        <div style={{ width: "45%", textAlign: isEven ? "right" : "left", padding: "0 2rem", opacity: mission.isCompleted || isActive ? 1 : 0.6 }}>
                                            {isEven && (
                                                <div style={{ animation: "fadeInLeft 0.6s ease-out forwards" }}>
                                                    <div style={{ display: "inline-block", background: mission.isCompleted ? "#FF9F0A" : "#1d1d1f", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "10px" }}>
                                                        STEP {index + 1}
                                                    </div>
                                                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#1d1d1f" }}>{mission.title}</h3>
                                                    <p style={{ fontSize: "1rem", color: "#48484a", lineHeight: 1.6 }}>{mission.description}</p>

                                                    {mission.isCompleted && mission.feedbacks && mission.feedbacks.length > 0 && (
                                                        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(255, 159, 10, 0.05)", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)", textAlign: "left" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FF9F0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7rem" }}>💬</div>
                                                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF9F0A" }}>코치 솔루션</span>
                                                            </div>
                                                            <p style={{ fontSize: "0.9rem", color: "#1d1d1f", fontWeight: 500 }}>{mission.feedbacks[0].comment}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{
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
                                            boxShadow: isActive ? "0 0 20px rgba(255,159,10,0.4)" : "none",
                                            animation: isActive ? "pulse 2s infinite" : "none"
                                        }}>
                                            {mission.isCompleted ? (
                                                <span style={{ fontSize: "1.5rem" }}>✅</span>
                                            ) : (
                                                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: isActive ? "#FF9F0A" : "#86868b" }}>{index + 1}</span>
                                            )}
                                        </div>

                                        <div style={{ width: "45%", textAlign: !isEven ? "left" : "right", padding: "0 2rem", opacity: mission.isCompleted || isActive ? 1 : 0.6 }}>
                                            {!isEven && (
                                                <div style={{ animation: "fadeInRight 0.6s ease-out forwards" }}>
                                                    <div style={{ display: "inline-block", background: mission.isCompleted ? "#FF9F0A" : "#1d1d1f", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "10px" }}>
                                                        STEP {index + 1}
                                                    </div>
                                                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#1d1d1f" }}>{mission.title}</h3>
                                                    <p style={{ fontSize: "1rem", color: "#48484a", lineHeight: 1.6 }}>{mission.description}</p>

                                                    {mission.isCompleted && mission.feedbacks && mission.feedbacks.length > 0 && (
                                                        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(255, 159, 10, 0.05)", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)", textAlign: "left" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FF9F0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7rem" }}>💬</div>
                                                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF9F0A" }}>코치 솔루션</span>
                                                            </div>
                                                            <p style={{ fontSize: "0.9rem", color: "#1d1d1f", fontWeight: 500 }}>{mission.feedbacks[0].comment}</p>
                                                        </div>
                                                    )}

                                                    {!mission.isCompleted && isActive && (
                                                        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
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
                                                                        boxShadow: "0 4px 15px rgba(255,59,48,0.3)"
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
                                                                            boxShadow: "0 4px 15px rgba(255,159,10,0.3)",
                                                                            opacity: uploadingId === mission.id ? 0.7 : 1,
                                                                            pointerEvents: uploadingId === mission.id ? "none" : "auto"
                                                                        }}
                                                                    >
                                                                        {uploadingId === mission.id ? "업로드 중..." : "🎤 바로 녹음하기"}
                                                                    </button>
                                                                    <input
                                                                        type="file"
                                                                        accept="audio/*"
                                                                        style={{ display: "none" }}
                                                                        id={`upload-${mission.id}`}
                                                                        onChange={(e) => handleFileUploadChange(e, mission.id)}
                                                                    />
                                                                    <label htmlFor={`upload-${mission.id}`} style={{
                                                                        background: "#f5f5f7",
                                                                        color: "#86868b",
                                                                        padding: "12px 20px",
                                                                        borderRadius: "12px",
                                                                        fontWeight: 700,
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        fontSize: "0.9rem"
                                                                    }}>
                                                                        파일 선택
                                                                    </label>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{
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
                    <div style={{ maxWidth: "60%" }}>
                        <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.02em" }}>자유로운 추가 연습</h3>
                        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>미션 외에도 자유롭게 녹음 파일을 올려보세요. 코치가 틈틈이 확인하고 조언을 해드립니다.</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
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
            `}</style>
        </div>
    );
}
