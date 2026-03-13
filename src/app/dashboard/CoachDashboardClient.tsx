"use client";

import type { Prisma, Consultation } from "@prisma/client";
import { useState } from "react";

type CoachDashboardData = (Prisma.UserGetPayload<{
    include: {
        track: true;
        assignments: {
            include: { feedbacks: true };
        };
    };
}>)[];

export default function CoachDashboardClient({ 
    students, 
    consultations 
}: { 
    students: CoachDashboardData, 
    consultations: Consultation[] 
}) {
    const [view, setView] = useState<"students" | "consultations">("students");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);
    const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(consultations[0]?.id || null);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const selectedConsultation = consultations.find(c => c.id === selectedConsultationId);

    const submitFeedback = async (assignmentId: string) => {
        if (!feedbackText.trim()) return;
        setIsSubmitting(true);

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
                window.location.reload();
            } else {
                alert("피드백 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
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

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* View Switcher */}
            <div style={{ display: "flex", gap: "10px", padding: "4px", background: "#f5f5f7", borderRadius: "12px", width: "fit-content" }}>
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
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem", minHeight: "70vh" }}>
                {/* Left: List View */}
                <aside style={{ background: "#fff", borderRadius: "24px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    {view === "students" ? (
                        <>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>수강생 목록 ({students.length})</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {students.map(student => (
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
                                        <div style={{ fontWeight: 700, color: "#1d1d1f" }}>{student.name}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#86868b", marginTop: "4px" }}>
                                            {student.track?.name || "배정 대기"} • 과제 {student.assignments.length}개
                                        </div>
                                    </button>
                                ))}
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
                                            {c.name}
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
                <main style={{ background: "#fff", borderRadius: "24px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    {view === "students" ? (
                        selectedStudent ? (
                            <div>
                                <div style={{ borderBottom: "1px solid #f5f5f7", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{selectedStudent.name} 님의 워크스페이스</h2>
                                    <p style={{ color: "#86868b" }}>이메일: {selectedStudent.email}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                    {selectedStudent.assignments.length === 0 ? (
                                        <p style={{ textAlign: "center", color: "#86868b", padding: "4rem" }}>제출된 과제가 없습니다.</p>
                                    ) : (
                                        selectedStudent.assignments.map(assignment => (
                                            <div key={assignment.id} style={{ border: "1px solid #f0f0f2", borderRadius: "20px", padding: "1.5rem" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                                    <h3 style={{ fontWeight: 700 }}>{assignment.title}</h3>
                                                    <span style={{ fontSize: "0.8rem", color: "#86868b" }}>제출일: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ background: "#f5f5f7", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
                                                    <audio src={assignment.audioFileUrl || ""} controls style={{ width: "100%", height: "36px" }} />
                                                </div>
                                                <textarea
                                                    value={feedbackText}
                                                    onChange={(e) => setFeedbackText(e.target.value)}
                                                    placeholder="피드백 입력..."
                                                    style={{ width: "100%", height: "80px", padding: "1rem", borderRadius: "12px", border: "1px solid #f0f0f2", marginBottom: "1rem" }}
                                                />
                                                <button onClick={() => submitFeedback(assignment.id)} style={{ background: "#FF9F0A", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>피드백 등록</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : <p>수강생을 선택해 주세요.</p>
                    ) : (
                        selectedConsultation ? (
                            <div>
                                <div style={{ borderBottom: "1px solid #f5f5f7", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{selectedConsultation.name} 님의 상담 신청</h2>
                                            <p style={{ color: "#86868b", fontSize: "1.1rem" }}>연락처: {selectedConsultation.phone}</p>
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

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                    <div style={{ background: "#f9f9fb", padding: "1.5rem", borderRadius: "20px" }}>
                                        <h4 style={{ fontWeight: 800, marginBottom: "1rem", fontSize: "0.9rem", color: "#86868b" }}>진단 상세 내용</h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <div><strong>병목:</strong> {selectedConsultation.bottleneck || "-"}</div>
                                            <div><strong>동기:</strong> {selectedConsultation.motivation || "-"}</div>
                                            <div><strong>일정:</strong> {selectedConsultation.timeline || "-"}</div>
                                            <div><strong>레벨:</strong> {selectedConsultation.level || "-"}</div>
                                            <div><strong>투자시간:</strong> {selectedConsultation.timeInvestment || "-"}</div>
                                            <div><strong>참고:</strong> {selectedConsultation.reference || "-"}</div>
                                        </div>
                                    </div>
                                    <div style={{ background: "#f9f9fb", padding: "1.5rem", borderRadius: "20px" }}>
                                        <h4 style={{ fontWeight: 800, marginBottom: "1rem", fontSize: "0.9rem", color: "#86868b" }}>기타 정보</h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <div><strong>희망 통화 시간:</strong> {selectedConsultation.preferredTime || "-"}</div>
                                            <div><strong>신청일:</strong> {new Date(selectedConsultation.createdAt).toLocaleString()}</div>
                                            <div style={{ borderTop: "1px solid #e5e5e7", marginTop: "10px", paddingTop: "10px" }}>
                                                <strong>노트:</strong>
                                                <p style={{ marginTop: "8px", whiteSpace: "pre-wrap", color: "#48484a" }}>{selectedConsultation.notes || "내역 없음"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <p>상담 신청 건을 선택해 주세요.</p>
                    )}
                </main>
            </div>
        </div>
    );
}
