"use client";

import { useState } from "react";
import Link from "next/link";

export default function DiagnosisPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        bottleneck: "",
        motivation: "",
        timeline: "",
        level: "",
        timeInvestment: "",
        reference: "",
        name: "",
        phone: "",
        preferredTime: ""
    });

    const nextSubStep = () => setCurrentStep(currentStep + 0.5);
    const nextStep = () => setCurrentStep(Math.floor(currentStep + 1));
    const prevStep = () => setCurrentStep(Math.max(1, currentStep - 0.5));

    return (
        <div style={{ color: "#ffffff", backgroundColor: "#030304", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#86868b", fontSize: "0.9rem", fontWeight: 600 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        돌아가기
                    </Link>
                    <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "#fff", fontSize: "0.8rem" }}>SEE:SUN VOCAL DIAGNOSIS</span>
                </div>
            </header>

            <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div style={{ maxWidth: "600px", width: "100%", background: "rgba(255,255,255,0.02)", padding: "3rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>

                    {/* Step 1: Diagnostic Questions */}
                    {currentStep === 1 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em" }}>STEP 01 / 02</span>
                                <h3 style={{ fontSize: "2rem", marginTop: "0.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>보컬 진단 (1~3)</h3>
                                <p style={{ color: "#86868b", fontSize: "1rem", marginTop: "0.5rem" }}>당신에게 꼭 맞는 로드맵을 설계하기 위한 필수 체크입니다.</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>1. 이번에 가장 바꾸고 싶은 것은 무엇인가요?</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
                                        {["고음에서 자주 막힌다", "음정이 불안하다", "목에 힘이 많이 들어간다", "음색이 밋밋하다", "표현력이 부족하다", "무대 자신감이 떨어진다"].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, bottleneck: opt })} style={{ padding: "1rem", borderRadius: "12px", border: formData.bottleneck === opt ? "1px solid #FF9F0A" : "1px solid #333", background: formData.bottleneck === opt ? "rgba(255,159,10,0.1)" : "transparent", color: formData.bottleneck === opt ? "#FF9F0A" : "#86868b", textAlign: "left", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>{opt}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>2. 왜 지금 이 변화를 만들고 싶으신가요?</label>
                                    <select onChange={(e) => setFormData({ ...formData, motivation: e.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }}>
                                        <option value="">상황 선택</option>
                                        <option>취미로 제대로 배우고 싶다</option>
                                        <option>콘텐츠/녹음 퀄리티를 올리고 싶다</option>
                                        <option>공연/오디션/입시 준비</option>
                                        <option>나만의 보컬 정체성 구축</option>
                                        <option>독학의 한계를 느낌</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>3. 원하는 변화는 언제까지 필요하신가요?</label>
                                    <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                                        {["최대한 빨리", "1~3개월 안", "3~6개월 안", "특정 일정 있음"].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, timeline: opt })} style={{ padding: "0.7rem 1.2rem", borderRadius: "30px", border: formData.timeline === opt ? "1px solid #FF9F0A" : "1px solid #333", background: formData.timeline === opt ? "#FF9F0A" : "transparent", color: formData.timeline === opt ? "#000" : "#86868b", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>{opt}</button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    style={{
                                        background: (formData.bottleneck && formData.motivation && formData.timeline) ? "#fff" : "#333",
                                        color: (formData.bottleneck && formData.motivation && formData.timeline) ? "#000" : "#666",
                                        marginTop: "1.5rem",
                                        padding: "1.2rem",
                                        borderRadius: "16px",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        border: "none",
                                        cursor: (formData.bottleneck && formData.motivation && formData.timeline) ? "pointer" : "not-allowed"
                                    }}
                                    onClick={nextSubStep}
                                    disabled={!(formData.bottleneck && formData.motivation && formData.timeline)}
                                >
                                    다음 단계 (4~6)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1.5: Remaining Questions */}
                    {currentStep === 1.5 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em" }}>STEP 01 / 02</span>
                                <h3 style={{ fontSize: "2rem", marginTop: "0.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>보컬 진단 (4~6)</h3>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>4. 현재 본인의 상태는?</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
                                        {["완전 초보", "독학 경험", "레슨 경험 있음", "공연/녹음 경험 있음"].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, level: opt })} style={{ padding: "1rem", borderRadius: "12px", border: formData.level === opt ? "1px solid #FF9F0A" : "1px solid #333", background: formData.level === opt ? "rgba(255,159,10,0.1)" : "transparent", color: formData.level === opt ? "#FF9F0A" : "#86868b", cursor: "pointer", fontSize: "0.9rem" }}>{opt}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>5. 주당 연습 투자 가능 시간?</label>
                                    <select onChange={(e) => setFormData({ ...formData, timeInvestment: e.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }}>
                                        <option value="">시간 선택</option>
                                        <option>주 1시간 미만</option>
                                        <option>주 1~3시간</option>
                                        <option>주 3~5시간</option>
                                        <option>주 5시간 이상</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>6. 참고하는 아티스트 또는 곡 (선택)</label>
                                    <input type="text" placeholder="예: 박효신 - 야생화" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }} />
                                </div>

                                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                                    <button onClick={prevStep} style={{ flex: 1, padding: "1.2rem", borderRadius: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>이전</button>
                                    <button
                                        style={{
                                            flex: 2,
                                            background: (formData.level && formData.timeInvestment) ? "#fff" : "#333",
                                            color: (formData.level && formData.timeInvestment) ? "#000" : "#666",
                                            padding: "1.2rem",
                                            borderRadius: "16px",
                                            fontWeight: 700,
                                            fontSize: "1.1rem",
                                            border: "none",
                                            cursor: (formData.level && formData.timeInvestment) ? "pointer" : "not-allowed"
                                        }}
                                        onClick={nextStep}
                                        disabled={!(formData.level && formData.timeInvestment)}
                                    >
                                        진단 결과 보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personalized Preview */}
                    {currentStep === 2 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                                <div style={{ width: "64px", height: "64px", background: "rgba(255,159,10,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9F0A" strokeWidth="2.5">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <h3 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>진단 분석 리포트</h3>
                                <p style={{ color: "#FF9F0A", fontWeight: 700, marginTop: "0.7rem", fontSize: "1.1rem" }}>
                                    "{formData.bottleneck}"에서 어려움이 있으시군요.
                                </p>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "2.5rem" }}>
                                <p style={{ color: "#86868b", fontSize: "1.05rem", lineHeight: 1.7 }}>
                                    분석 결과, 킥오프 상담에서는 다음 <span style={{ color: "#fff", fontWeight: 700 }}>3가지 핵심 전략</span>을 도출하게 됩니다:
                                </p>
                                <ul style={{ color: "#fff", marginTop: "1.5rem", listStyle: "none", padding: 0 }}>
                                    <li style={{ marginBottom: "1.2rem", display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span> 
                                        <span><strong style={{ color: "#FF9F0A" }}>{formData.bottleneck}</strong>의 해결방법</span>
                                    </li>
                                    <li style={{ marginBottom: "1.2rem", display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span> 
                                        <span><strong style={{ color: "#fff" }}>1~3개월 안</strong> 내 달성 가능한 압축 로드맵</span>
                                    </li>
                                    <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span> 
                                        <span><strong style={{ color: "#fff" }}>주 1~3시간</strong> 최적화 연습 프로토콜</span>
                                    </li>
                                </ul>
                            </div>

                            <button style={{ width: "100%", padding: "1.2rem", borderRadius: "16px", background: "#fff", color: "#000", border: "none", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer" }} onClick={nextStep}>진단 상담 예약하기</button>
                        </div>
                    )}

                    {/* Step 3: Schedule Selection */}
                    {currentStep === 3 && (
                        <div>
                            <h3 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>상담 일정 및 연락처</h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.6rem", color: "#86868b", fontSize: "0.95rem" }}>성함 또는 직함 (비공개 운영)</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: 시선그룹 김대표" 
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }} 
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "0.6rem", color: "#86868b", fontSize: "0.95rem" }}>휴대폰 번호 (직통 연락용)</label>
                                    <input 
                                        type="tel" 
                                        placeholder="010-0000-0000" 
                                        value={formData.phone || ""}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }} 
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "0.6rem", color: "#86868b", fontSize: "0.95rem" }}>희망 통화 시간대 (15분 소요)</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: 평일 오후 2시~4시 사이" 
                                        value={formData.preferredTime || ""}
                                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                        style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }} 
                                    />
                                </div>

                                <div style={{ background: "rgba(255,159,10,0.05)", padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(255,159,10,0.1)", fontSize: "0.9rem", color: "#86868b", lineHeight: 1.6 }}>
                                    <strong style={{ color: "#FF9F0A" }}>[비공개 운영 및 노쇼 규정]</strong><br />
                                    모든 상담은 비공개로 운영되며 제출 자료는 안전하게 보호됩니다. 예약 확정 후 무단 노쇼 시 향후 이용이 제한될 수 있습니다.
                                </div>

                                <button 
                                    style={{ 
                                        width: "100%", 
                                        padding: "1.2rem", 
                                        borderRadius: "16px", 
                                        background: (formData.name && formData.phone) ? "#FF9F0A" : "#333", 
                                        color: (formData.name && formData.phone) ? "#000" : "#666", 
                                        border: "none", 
                                        fontWeight: 700, 
                                        fontSize: "1.1rem", 
                                        cursor: (formData.name && formData.phone) ? "pointer" : "not-allowed" 
                                    }} 
                                    onClick={async () => {
                                        if (!formData.name || !formData.phone) return;
                                        
                                        try {
                                            const res = await fetch("/api/consultations", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    ...formData,
                                                    type: "Diagnosis"
                                                })
                                            });
                                            if (res.ok) {
                                                nextStep();
                                            } else {
                                                alert("상담 신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("네트워크 오류가 발생했습니다.");
                                        }
                                    }}
                                    disabled={!formData.name || !formData.phone}
                                >
                                    진단 예약 확정하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {currentStep === 4 && (
                        <div style={{ textAlign: "center", padding: "1rem 0" }}>
                            <div style={{ width: "80px", height: "80px", background: "rgba(255,159,10,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", color: "#FF9F0A" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "2.2rem", marginBottom: "1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>예약이 완료되었습니다</h3>
                            <p style={{ color: "#86868b", lineHeight: 1.6, marginBottom: "3rem", fontSize: "1.1rem" }}>
                                담당 마스터가 진단 리포트를 확인 후 곧 연락드리겠습니다.<br />
                                <span style={{ color: "#fff" }}>상담의 정확도를 높이고 싶다면 아래 샘플을 추가해 주세요.</span>
                            </p>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                                <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#fff" }}>선택형 음성 샘플 업로드</h4>
                                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "2rem" }}>가장 자신 있는 구간 30초, 혹은 고민인 구간 30초면 충분합니다.</p>
                                <label style={{ display: "inline-block", padding: "1rem 2rem", background: "rgba(255,255,255,0.05)", color: "#fff", borderRadius: "12px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>
                                    파일 선택하기
                                    <input type="file" style={{ display: "none" }} />
                                </label>
                            </div>

                            <Link href="/" style={{ display: "block", marginTop: "2.5rem", color: "#86868b", textDecoration: "none", fontWeight: 600 }}>메인으로 돌아가기</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
