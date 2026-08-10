"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_CONSULTATION_TYPE,
  normalizeConsultationType,
} from "@/lib/consultation-intake";
import { ANALYTICS_EVENT_TYPES } from "@/lib/site-analytics";
import { sendAnalyticsEvent } from "@/lib/site-analytics-client";

const KAKAO_CHAT_URL = "http://pf.kakao.com/_dLEUn/chat";

const questionSteps = [
  {
    key: "problem",
    title: "지금 가장 답답한 문제는 무엇인가요?",
    options: [
      "고음에서 목이 먼저 잠겨요",
      "호흡이 짧아 길게 못 불러요",
      "레슨 때는 되는데 실전에서 무너져요",
      "혼자 연습하는데 기준이 없어요",
      "중요한 자리에서 한 곡이 필요해요",
    ],
  },
  {
    key: "learningStyle",
    title: "현재 노래를 배우는 방식에 가장 가까운 것은 무엇인가요?",
    options: ["완전 초보예요", "혼자 연습 중이에요", "레슨을 받아본 적 있어요", "지금도 배우고 있어요"],
  },
  {
    key: "trainingCapacity",
    title: "현재 가능한 훈련 방식은 무엇인가요?",
    options: [
      "매일 10분 정도는 가능해요",
      "주 2~3회 20분 이상 가능해요",
      "오프라인 1:1도 가능해요",
      "짧은 기간 집중 투자가 가능해요",
    ],
  },
  {
    key: "desiredResult",
    title: "지금 원하는 결과에 가장 가까운 것은 무엇인가요?",
    options: [
      "혼자 연습해도 흔들리지 않는 기준",
      "몸과 소리를 본격적으로 다시 세팅하기",
      "3개월 안에 한 곡 완성하기",
    ],
  },
  {
    key: "preference",
    title: "희망하는 방식은 무엇인가요?",
    options: ["온라인 위주", "오프라인 가능", "완전 프라이빗 선호"],
  },
] as const;

type RecommendationKey = "spark" | "signature" | "reserve";

type FormState = {
  problem: string;
  learningStyle: string;
  trainingCapacity: string;
  desiredResult: string;
  preference: string;
  name: string;
  phone: string;
  email: string;
  note: string;
};

const recommendationContent: Record<
  RecommendationKey,
  {
    eyebrow: string;
    title: string;
    body: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
    consultationType: string;
  }
> = {
  spark: {
    eyebrow: "RECOMMENDATION | DAILY",
    title: "지금은 데일리(DAILY)가 가장 잘 맞습니다",
    body:
      "현재 가장 큰 병목은 ‘꾸준한 기준 부재’에 가깝습니다. 데일리는 매일 10분 루틴과 피드백으로 혼자 하는 연습의 방향부터 잡아주는 시작점입니다.",
    primaryHref: "/spark",
    primaryLabel: "데일리 자세히 보기",
    secondaryHref: "/signature",
    secondaryLabel: "시그니처도 함께 보기",
    consultationType: "데일리 월 구독 (₩120,000)",
  },
  signature: {
    eyebrow: "RECOMMENDATION | SIGNATURE",
    title: "지금은 Signature가 가장 잘 맞습니다",
    body:
      "현재는 루틴만으로 해결하기보다, 몸-호흡-발성의 재세팅이 필요한 단계로 보입니다. 시그니처는 SEE:SUN의 메인 코스로, 가장 본격적으로 바꾸기 좋은 시작점입니다.",
    primaryHref: "/signature",
    primaryLabel: "시그니처 자세히 보기",
    secondaryHref: "/spark",
    secondaryLabel: "데일리도 함께 보기",
    consultationType: "시그니처 트랙 (50분 + DAP)",
  },
  reserve: {
    eyebrow: "RECOMMENDATION | RESERVE",
    title: "지금은 Reserve가 가장 잘 맞습니다",
    body:
      "실전 목표와 기한이 분명하기 때문에, 프라이빗하게 집중하는 트랙이 더 효율적입니다. RESERVE는 15주 안에 한 곡을 실제로 해내는 상태까지 가는 프로그램입니다.",
    primaryHref: "/reserve",
    primaryLabel: "리저브 자세히 보기",
    secondaryHref: "/signature",
    secondaryLabel: "시그니처도 함께 보기",
    consultationType: "하이엔드 트랙 (15주 프라이빗)",
  },
};

function getRecommendation(formData: FormState): RecommendationKey {
  if (
    formData.problem === "중요한 자리에서 한 곡이 필요해요" ||
    formData.desiredResult === "3개월 안에 한 곡 완성하기" ||
    formData.preference === "완전 프라이빗 선호" ||
    formData.trainingCapacity === "짧은 기간 집중 투자가 가능해요"
  ) {
    return "reserve";
  }

  if (
    formData.problem === "혼자 연습하는데 기준이 없어요" ||
    formData.preference === "온라인 위주" ||
    formData.trainingCapacity === "매일 10분 정도는 가능해요"
  ) {
    return "spark";
  }

  return "signature";
}

function DiagnosisPageContent() {
  const searchParams = useSearchParams();
  const requestedType = normalizeConsultationType(searchParams.get("type") ?? DEFAULT_CONSULTATION_TYPE);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    problem: "",
    learningStyle: "",
    trainingCapacity: "",
    desiredResult: "",
    preference: "",
    name: searchParams.get("name") ?? "",
    phone: searchParams.get("phone") ?? "",
    email: searchParams.get("email") ?? "",
    note: searchParams.get("notes") ?? "",
  });

  const recommendationKey = useMemo(() => getRecommendation(formData), [formData]);
  const recommendation = recommendationContent[recommendationKey];
  const currentQuestion = questionSteps[stepIndex];
  const progressValue = Math.round(((stepIndex + 1) / (questionSteps.length + 1)) * 100);

  useEffect(() => {
    sendAnalyticsEvent({
      eventType: ANALYTICS_EVENT_TYPES.diagnosisStarted,
      path: "/diagnosis",
      label: requestedType,
    });
  }, [requestedType]);

  const updateAnswer = (key: keyof FormState, value: string) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const canMoveNext = stepIndex < questionSteps.length && Boolean(formData[currentQuestion?.key as keyof FormState]);

  async function handleSubmit() {
    if (!formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim(),
          type: recommendation.consultationType,
          bottleneck: formData.problem,
          motivation: formData.learningStyle,
          timeline: formData.desiredResult,
          level: formData.learningStyle,
          timeInvestment: formData.trainingCapacity,
          reference: formData.note.trim() || undefined,
          preferredTime: `${formData.preference} / 카카오톡 채팅 연결`,
          notes: `진단 추천 코스: ${recommendation.title}${requestedType ? ` | 유입 타입: ${requestedType}` : ""}`,
        }),
      });

      if (!response.ok) {
        setIsError(true);
        return;
      }

      sendAnalyticsEvent(
        {
          eventType: ANALYTICS_EVENT_TYPES.diagnosisCompleted,
          path: "/diagnosis",
          label: recommendation.consultationType,
        },
        { useBeacon: true }
      );
      sendAnalyticsEvent(
        {
          eventType: ANALYTICS_EVENT_TYPES.kakaoChatClick,
          path: "/diagnosis",
          label: recommendation.consultationType,
        },
        { useBeacon: true }
      );

      window.location.href = KAKAO_CHAT_URL;
    } catch (error) {
      console.error("[Diagnosis] Submission failed", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050507",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "rgba(255,255,255,0.68)",
              fontWeight: 700,
              fontSize: "0.92rem",
            }}
          >
            <span aria-hidden="true">←</span>
            돌아가기
          </Link>
          <div style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.12em" }}>
            3분 보컬 진단
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "40px 20px 96px" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ maxWidth: "720px", marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: "#f5b33f",
                marginBottom: "12px",
              }}
            >
              VOCAL DIAGNOSIS
            </div>
            <h1
              style={{
                fontSize: "clamp(2.3rem, 5vw, 4.2rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.05em",
                fontWeight: 900,
                margin: "0 0 14px",
              }}
            >
              지금 가장 막히는 지점이 무엇인지 확인하고,
              <br />
              당신에게 맞는 시작 코스를 안내합니다.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              질문은 5개입니다. 답변이 끝나면 추천 코스와 함께 바로 카카오톡 채팅으로
              이어갈 수 있습니다.
            </p>
          </div>

          <div
            style={{
              height: "10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: `${progressValue}%`,
                height: "100%",
                background: "linear-gradient(90deg, #f5b33f, #ffce6b)",
                borderRadius: "999px",
                transition: "width 0.25s ease",
              }}
            />
          </div>

          {stepIndex < questionSteps.length ? (
            <div
              style={{
                maxWidth: "760px",
                padding: "32px",
                borderRadius: "32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  color: "#f5b33f",
                  marginBottom: "14px",
                }}
              >
                STEP {stepIndex + 1} / {questionSteps.length + 1}
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                  lineHeight: 1.18,
                  letterSpacing: "-0.04em",
                  fontWeight: 900,
                  margin: "0 0 24px",
                }}
              >
                {currentQuestion.title}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                {currentQuestion.options.map((option) => {
                  const isSelected = formData[currentQuestion.key as keyof FormState] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateAnswer(currentQuestion.key as keyof FormState, option)}
                      style={{
                        padding: "18px 18px",
                        borderRadius: "18px",
                        border: isSelected
                          ? "1px solid rgba(245,179,63,0.88)"
                          : "1px solid rgba(255,255,255,0.10)",
                        background: isSelected
                          ? "rgba(245,179,63,0.14)"
                          : "rgba(255,255,255,0.02)",
                        color: isSelected ? "#f5b33f" : "#ffffff",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer",
                        minHeight: "84px",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                  disabled={stepIndex === 0}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "transparent",
                    color: stepIndex === 0 ? "rgba(255,255,255,0.28)" : "#ffffff",
                    padding: "13px 18px",
                    borderRadius: "999px",
                    fontWeight: 800,
                    cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  이전
                </button>

                <button
                  type="button"
                  onClick={() => setStepIndex((current) => current + 1)}
                  disabled={!canMoveNext}
                  style={{
                    border: "none",
                    background: canMoveNext ? "#f5b33f" : "rgba(255,255,255,0.12)",
                    color: canMoveNext ? "#050507" : "rgba(255,255,255,0.34)",
                    padding: "13px 18px",
                    borderRadius: "999px",
                    fontWeight: 900,
                    cursor: canMoveNext ? "pointer" : "not-allowed",
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.05fr) minmax(280px, 0.95fr)",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <section
                style={{
                  padding: "32px",
                  borderRadius: "32px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    color: "#f5b33f",
                    marginBottom: "14px",
                  }}
                >
                  {recommendation.eyebrow}
                </div>
                <h2
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1.12,
                    letterSpacing: "-0.04em",
                    fontWeight: 900,
                    margin: "0 0 18px",
                  }}
                >
                  {recommendation.title}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.8, margin: "0 0 22px" }}>
                  {recommendation.body}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ color: "#f5b33f", fontWeight: 900, fontSize: "0.8rem", marginBottom: "8px" }}>
                      현재 병목
                    </div>
                    <div style={{ fontWeight: 700 }}>{formData.problem}</div>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ color: "#f5b33f", fontWeight: 900, fontSize: "0.8rem", marginBottom: "8px" }}>
                      원하는 결과
                    </div>
                    <div style={{ fontWeight: 700 }}>{formData.desiredResult}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href={recommendation.primaryHref}
                    style={{
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      padding: "13px 18px",
                      borderRadius: "999px",
                      fontWeight: 800,
                    }}
                  >
                    {recommendation.primaryLabel}
                  </Link>
                  <Link
                    href={recommendation.secondaryHref}
                    style={{
                      textDecoration: "none",
                      background: "transparent",
                      color: "rgba(255,255,255,0.72)",
                      padding: "13px 18px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {recommendation.secondaryLabel}
                  </Link>
                </div>
              </section>

              <aside
                style={{
                  padding: "28px",
                  borderRadius: "32px",
                  background: "linear-gradient(180deg, rgba(245,179,63,0.13), rgba(255,255,255,0.03))",
                  border: "1px solid rgba(245,179,63,0.24)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    color: "#f5b33f",
                    marginBottom: "12px",
                  }}
                >
                  STEP 6 / 6
                </div>
                <h3
                  style={{
                    fontSize: "1.7rem",
                    lineHeight: 1.2,
                    letterSpacing: "-0.03em",
                    fontWeight: 900,
                    margin: "0 0 12px",
                  }}
                >
                  이메일만 남기면 바로 카카오톡 상담으로 이어집니다
                </h3>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: "0 0 18px" }}>
                  이메일은 진단 리드 기록용입니다. 제출 후 바로 카카오톡 채팅으로
                  이동합니다.
                </p>

                <div style={{ display: "grid", gap: "12px" }}>
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    value={formData.email}
                    onChange={(event) => updateAnswer("email", event.target.value)}
                    style={{
                      background: "rgba(0,0,0,0.22)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      padding: "15px 16px",
                      width: "100%",
                      borderRadius: "16px",
                      fontSize: "1rem",
                    }}
                  />
                  <textarea
                    placeholder="현재 가장 자주 느끼는 어려움이 있으면 남겨주세요. (선택)"
                    value={formData.note}
                    onChange={(event) => updateAnswer("note", event.target.value)}
                    rows={4}
                    style={{
                      background: "rgba(0,0,0,0.22)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      padding: "15px 16px",
                      width: "100%",
                      borderRadius: "16px",
                      fontSize: "0.96rem",
                      resize: "vertical",
                    }}
                  />
                </div>

                {isError && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,107,107,0.12)",
                      border: "1px solid rgba(255,107,107,0.22)",
                      color: "#ffd7d7",
                      lineHeight: 1.6,
                    }}
                  >
                    저장 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.email.trim() || isSubmitting}
                  style={{
                    marginTop: "18px",
                    width: "100%",
                    border: "none",
                    background:
                      formData.email.trim() && !isSubmitting
                        ? "#050507"
                        : "rgba(17,18,24,0.44)",
                    color:
                      formData.email.trim() && !isSubmitting
                        ? "#ffffff"
                        : "rgba(255,255,255,0.38)",
                    padding: "15px 18px",
                    borderRadius: "999px",
                    fontWeight: 900,
                    cursor:
                      formData.email.trim() && !isSubmitting ? "pointer" : "not-allowed",
                  }}
                >
                  {isSubmitting ? "연결 중..." : "카카오톡 채팅으로 이어가기"}
                </button>

                <button
                  type="button"
                  onClick={() => setStepIndex(questionSteps.length - 1)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.74)",
                    padding: "13px 18px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  이전 질문 다시 보기
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050507" }} />}>
      <DiagnosisPageContent />
    </Suspense>
  );
}
