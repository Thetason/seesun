"use client";

import type { Prisma } from "@prisma/client";
import { useState } from "react";

type AdminStudent = Prisma.UserGetPayload<{
    include: {
        track: true;
        assignments: true;
    };
}>;

type AdminAssignment = Prisma.AssignmentGetPayload<{
    include: {
        user: true;
        feedbacks: true;
    };
}>;

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
}

export default function AdminDashboardClient({
    students,
    assignments
}: {
    students: AdminStudent[];
    assignments: AdminAssignment[];
}) {
    const [activeTab, setActiveTab] = useState("missions");
    const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

    // Mission Assignment State
    const [showMissionForm, setShowMissionForm] = useState(false);
    const [selectedStudentForMission, setSelectedStudentForMission] = useState<AdminStudent | null>(null);
    const [newMission, setNewMission] = useState({ title: '', description: '', weekNumber: '' });
    const [isCreatingMission, setIsCreatingMission] = useState(false);

    const handleAssignMission = async () => {
        if (!newMission.title || !selectedStudentForMission) {
            alert("미션 제목을 입력해주세요.");
            return;
        }

        setIsCreatingMission(true);
        try {
            const res = await fetch("/api/assignments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedStudentForMission.id,
                    title: newMission.title,
                    description: newMission.description,
                    weekNumber: newMission.weekNumber
                })
            });

            if (!res.ok) throw new Error("과제 부여 실패");

            alert("새로운 훈련 미션이 성곡적으로 부여되었습니다.");
            window.location.reload();
        } catch (error: unknown) {
            console.error(error);
            alert("오류가 발생했습니다: " + getErrorMessage(error));
        } finally {
            setIsCreatingMission(false);
            setShowMissionForm(false);
        }
    };

    const handleFeedbackSubmit = async (assignmentId: string) => {
        const comment = feedbackText[assignmentId];
        if (!comment?.trim()) return;

        setIsSubmitting(prev => ({ ...prev, [assignmentId]: true }));
        try {
            const res = await fetch("/api/assignments/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignmentId, comment })
            });

            if (!res.ok) throw new Error("피드백 등록 실패");

            alert("피드백이 성공적으로 등록되었습니다");
            window.location.reload();
        } catch (error: unknown) {
            console.error(error);
            alert("오류가 발생했습니다: " + getErrorMessage(error));
        } finally {
            setIsSubmitting(prev => ({ ...prev, [assignmentId]: false }));
        }
    };

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem" }}>
                {/* Sidebar Nav */}
                <div style={{ background: "#0a0a0c", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ fontSize: "0.85rem", color: "#888", letterSpacing: "1px", marginBottom: "1rem" }}>WORKSPACE</h3>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <li>
                            <button onClick={() => setActiveTab("students")} style={{ width: "100%", textAlign: "left", background: activeTab === "students" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", padding: "10px 15px", borderRadius: "8px", color: activeTab === "students" ? "#fff" : "#ccc", cursor: "pointer", fontWeight: activeTab === "students" ? 600 : 400 }}>
                                수강생 관리 (CRM)
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("missions")} style={{ width: "100%", textAlign: "left", background: activeTab === "missions" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", padding: "10px 15px", borderRadius: "8px", color: activeTab === "missions" ? "#fff" : "#ccc", cursor: "pointer", fontWeight: activeTab === "missions" ? 600 : 400 }}>
                                과제/피드백 센터
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div style={{ background: "#0a0a0c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>

                    {activeTab === "students" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>수강생 리스트 (DB)</h2>
                                <button className="btn btn-secondary-dark" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>+ 신규 수강생 수동 등록</button>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "#888" }}>
                                            <th style={{ padding: "10px 15px" }}>이름(이메일)</th>
                                            <th style={{ padding: "10px 15px" }}>구독 클래스 (Class)</th>
                                            <th style={{ padding: "10px 15px" }}>진행 미션 수</th>
                                            <th style={{ padding: "10px 15px" }}>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                <td style={{ padding: "15px" }}>
                                                    <div style={{ fontWeight: 600 }}>{student.name}</div>
                                                    <div style={{ color: "#888", fontSize: "0.8rem" }}>{student.email}</div>
                                                </td>
                                                <td style={{ padding: "15px" }}>
                                                    <span style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.1)", color: "#fff", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                        {student.track?.name || '미배정'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "15px", color: "#888" }}>
                                                    총 {student.assignments?.length || 0} 개
                                                </td>
                                                <td style={{ padding: "15px" }}>
                                                    <button
                                                        onClick={() => { setSelectedStudentForMission(student); setShowMissionForm(true); }}
                                                        style={{ background: "transparent", border: "1px solid #FF9F0A", color: "#FF9F0A", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s" }}
                                                        className="hover:bg-orange-500 hover:text-white"
                                                    >
                                                        + 새 미션 할당
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "missions" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>등록된 전체 과제 현황</h2>
                            </div>
                            <p style={{ color: "#aaa", marginBottom: "2rem", fontSize: "0.95rem" }}>수강생들이 진행 중인 전체 훈련 현황 및 피드백 검토 대기열. (Vercel Blob 오디오 연동 예정)</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {assignments.length === 0 ? (
                                    <div style={{ color: "#888", textAlign: "center", padding: "2rem" }}>데이터가 없습니다.</div>
                                ) : assignments.map(mission => (
                                    <div key={mission.id} style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "8px", borderLeft: mission.isCompleted ? "3px solid #34c759" : "3px solid #debf8e" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <span style={{ fontSize: "0.75rem", background: mission.isCompleted ? "rgba(52, 199, 89, 0.2)" : "rgba(222, 191, 142,0.2)", color: mission.isCompleted ? "#34c759" : "#debf8e", padding: "3px 8px", borderRadius: "4px", fontWeight: 600, display: "inline-block", marginBottom: "8px" }}>
                                                    {mission.isCompleted ? "완료됨" : "진행 중"}
                                                </span>
                                                <h4 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>{mission.title}</h4>
                                                <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "10px" }}>수강생: {mission.user?.name || "알수없음"} ({mission.user?.email})</p>
                                                <p style={{ color: "#888", fontSize: "0.85rem" }}>{mission.description}</p>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "40%" }}>
                                                {mission.audioFileUrl && (
                                                    <div style={{ marginBottom: "1rem" }}>
                                                        <span style={{ fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 600, display: "block", marginBottom: "5px" }}>제출된 오디오 재생</span>
                                                        <audio controls src={mission.audioFileUrl} style={{ width: "100%", height: "35px" }} />
                                                    </div>
                                                )}

                                                {mission.isCompleted && (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                        {mission.feedbacks && mission.feedbacks.length > 0 ? (
                                                            <div style={{ padding: "12px", background: "rgba(255,159,10,0.1)", borderRadius: "8px", borderLeft: "3px solid #FF9F0A", marginTop: "10px" }}>
                                                                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#FF9F0A", display: "block", marginBottom: "5px" }}>남긴 피드백</span>
                                                                <p style={{ fontSize: "0.9rem", color: "#e5e5ea", whiteSpace: "pre-wrap" }}>{mission.feedbacks[0].comment}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <textarea
                                                                    placeholder="피드백 코멘트를 입력하세요..."
                                                                    style={{ width: "100%", minHeight: "80px", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical", fontSize: "0.9rem" }}
                                                                    value={feedbackText[mission.id] || ''}
                                                                    onChange={(e) => setFeedbackText(prev => ({ ...prev, [mission.id]: e.target.value }))}
                                                                />
                                                                <button
                                                                    className="btn btn-secondary-dark"
                                                                    style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", color: "#FF9F0A", opacity: isSubmitting[mission.id] ? 0.7 : 1 }}
                                                                    onClick={() => handleFeedbackSubmit(mission.id)}
                                                                    disabled={isSubmitting[mission.id]}
                                                                >
                                                                    {isSubmitting[mission.id] ? "등록 중..." : "피드백 코멘트 달기"}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-modal for creating a mission */}
            {showMissionForm && selectedStudentForMission && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <div style={{ background: "#1c1c1e", padding: "2rem", borderRadius: "16px", width: "90%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>
                            {selectedStudentForMission.name} 님에게 새 미션 할당
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "5px" }}>미션 제목</label>
                                <input
                                    type="text"
                                    value={newMission.title}
                                    onChange={e => setNewMission({ ...newMission, title: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#000", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                                    placeholder="예: D.A.P 코어 호흡 1주차"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "5px" }}>상세 설명</label>
                                <textarea
                                    value={newMission.description}
                                    onChange={e => setNewMission({ ...newMission, description: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#000", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", minHeight: "80px", resize: "vertical" }}
                                    placeholder="과제에 대한 상세한 가이드라인..."
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "5px" }}>주차 (선택)</label>
                                <input
                                    type="number"
                                    value={newMission.weekNumber}
                                    onChange={e => setNewMission({ ...newMission, weekNumber: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#000", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                                    placeholder="1"
                                />
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                                <button
                                    style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", cursor: "pointer" }}
                                    onClick={() => setShowMissionForm(false)}
                                >
                                    취소
                                </button>
                                <button
                                    style={{ flex: 1, padding: "12px", background: "#FF9F0A", border: "none", borderRadius: "8px", color: "#000", fontWeight: 700, cursor: "pointer", opacity: isCreatingMission ? 0.7 : 1 }}
                                    onClick={handleAssignMission}
                                    disabled={isCreatingMission}
                                >
                                    {isCreatingMission ? "전송 중..." : "과제 부여하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
