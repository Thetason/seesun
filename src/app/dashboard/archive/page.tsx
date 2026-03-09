import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const student = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            assignments: {
                where: { isCompleted: true },
                include: {
                    feedbacks: {
                        include: {
                            coach: true
                        }
                    }
                },
                orderBy: { weekNumber: 'desc' }
            }
        }
    });

    if (!student) {
        redirect("/login");
    }

    return (
        <div style={{ paddingBottom: "4rem" }}>
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.03em" }}>음성 피드백 보관함 🎙️</h1>
                <p style={{ color: "#86868b", fontSize: "1.1rem", marginTop: "8px" }}>지금까지 받은 모든 코칭 데이터를 한데 모았습니다.</p>
            </div>

            {student.assignments.length === 0 ? (
                <div style={{ padding: "5rem 2rem", textAlign: "center", background: "#fff", borderRadius: "24px", border: "1px dashed #d1d1d6" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1d1d1f" }}>아직 보관된 피드백이 없습니다.</h3>
                    <p style={{ marginTop: "10px", color: "#86868b" }}>미션을 완료하고 코치의 전문적인 피드백을 받아보세요!</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                    {student.assignments.map((assignment) => (
                        <div key={assignment.id} style={{ background: "#fff", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                <div>
                                    <div style={{ display: "inline-block", background: "#f5f5f7", color: "#86868b", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "8px" }}>
                                        WEEK {assignment.weekNumber}
                                    </div>
                                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1d1d1f" }}>{assignment.title}</h3>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: "0.85rem", color: "#86868b", fontWeight: 500 }}>제출일: {new Date(assignment.updatedAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                {/* Student Side */}
                                <div style={{ background: "#f5f5f7", padding: "1.5rem", borderRadius: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "1rem" }}>🎤</span>
                                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1d1d1f" }}>나의 제출 파일</span>
                                    </div>
                                    {assignment.audioFileUrl ? (
                                        <audio controls src={assignment.audioFileUrl} style={{ width: "100%", height: "40px" }} />
                                    ) : (
                                        <p style={{ fontSize: "0.85rem", color: "#86868b" }}>파일 정보가 없습니다.</p>
                                    )}
                                </div>

                                {/* Coach Side */}
                                <div style={{ background: "rgba(255, 159, 10, 0.05)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255, 159, 10, 0.1)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "1rem" }}>👨‍🏫</span>
                                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#FF9F0A" }}>코치 솔루션</span>
                                    </div>
                                    {assignment.feedbacks.length > 0 ? (
                                        <>
                                            <p style={{ fontSize: "0.95rem", color: "#1d1d1f", fontWeight: 500, lineHeight: 1.6, marginBottom: "15px" }}>
                                                {assignment.feedbacks[0].comment}
                                            </p>
                                            {assignment.feedbacks[0].audioFileUrl && (
                                                <audio controls src={assignment.feedbacks[0].audioFileUrl} style={{ width: "100%", height: "40px" }} />
                                            )}
                                        </>
                                    ) : (
                                        <p style={{ fontSize: "0.85rem", color: "#86868b" }}>아직 코멘트가 등록되지 않았습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
