"use client";

import type { Prisma } from "@prisma/client";
import { useState, useRef } from "react";

type CoachDashboardData = (Prisma.UserGetPayload<{
    include: {
        track: true;
        assignments: {
            include: { feedbacks: true };
        };
    };
}>)[];

export default function CoachDashboardClient({ students }: { students: CoachDashboardData }) {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedStudent = students.find(s => s.id === selectedStudentId);

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

    return (
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem", minHeight: "80vh" }}>
            {/* Left: Student List */}
            <aside style={{ background: "#fff", borderRadius: "24px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f5f5f7" }}>수강생 목록 ({students.length})</h2>
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
                            <div style={{ fontSize: "0.8rem", color: "#86868b", marginTop: "4px" }}>
                                {student.track?.name || "배정 대기"} • 과제 {student.assignments.length}개
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Right: Management View */}
            <main style={{ background: "#fff", borderRadius: "24px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                {selectedStudent ? (
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
                                            <p style={{ fontSize: "0.9rem", color: "#48484a", marginBottom: "10px" }}>학생 제출 음성:</p>
                                            {assignment.audioFileUrl ? (
                                                <audio src={assignment.audioFileUrl} controls style={{ width: "100%", height: "36px" }} />
                                            ) : (
                                                <p style={{ color: "#ff3b30", fontSize: "0.8rem" }}>오디오 파일 없음</p>
                                            )}
                                        </div>

                                        <div style={{ background: "rgba(255, 159, 10, 0.05)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)" }}>
                                            <h4 style={{ fontWeight: 700, color: "#FF9F0A", fontSize: "0.9rem", marginBottom: "1rem" }}>코치 피드백</h4>

                                            {assignment.feedbacks.length > 0 ? (
                                                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px dashed rgba(255,159,10,0.2)" }}>
                                                    <p style={{ whiteSpace: "pre-wrap", color: "#1d1d1f", fontSize: "0.95rem" }}>{assignment.feedbacks[0].comment}</p>
                                                </div>
                                            ) : null}

                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="학생에게 전달할 코멘트를 입력하세요..."
                                                style={{
                                                    width: "100%",
                                                    height: "100px",
                                                    padding: "1rem",
                                                    borderRadius: "12px",
                                                    border: "1px solid rgba(255,159,10,0.2)",
                                                    fontSize: "0.9rem",
                                                    outline: "none",
                                                    marginBottom: "1rem"
                                                }}
                                            />
                                            <button
                                                onClick={() => submitFeedback(assignment.id)}
                                                disabled={isSubmitting}
                                                style={{
                                                    background: "#FF9F0A",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "10px 20px",
                                                    borderRadius: "10px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {isSubmitting ? "전송 중..." : "피드백 등록하기"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#86868b" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👤</div>
                        <p>수강생을 선택하여 과제 현황을 관리하세요.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
