const DEFAULT_CONSULTATION_TYPE = "보컬 진단 세션 (기본)";

// Legacy keys are kept so old inbound links normalize to current labels.
const CONSULTATION_TYPE_ALIASES: Record<string, string> = {
  Diagnosis: DEFAULT_CONSULTATION_TYPE,
  [DEFAULT_CONSULTATION_TYPE]: DEFAULT_CONSULTATION_TYPE,
  Spark: "데일리 월 구독 (₩120,000)",
  "데일리 월 구독 (₩120,000)": "데일리 월 구독 (₩120,000)",
  "30일 데일리 패스 (₩100,000)": "데일리 월 구독 (₩120,000)",
  "무제한 피드백 멤버십 (₩200,000/월)": "데일리 피드백 멤버십 (₩200,000/월)",
  "데일리 피드백 멤버십 (₩200,000/월)": "데일리 피드백 멤버십 (₩200,000/월)",
  Signature: "시그니처 트랙 (50분 + DAP)",
  "시그니처 트랙 (50분 + DAP)": "시그니처 트랙 (50분 + DAP)",
  Reserve: "하이엔드 트랙 (15주 프라이빗)",
  "High-End": "하이엔드 트랙 (15주 프라이빗)",
  "하이엔드 트랙 (12주 프라이빗)": "하이엔드 트랙 (15주 프라이빗)",
  "하이엔드 트랙 (15주 프라이빗)": "하이엔드 트랙 (15주 프라이빗)",
};

const CONSULTATION_TYPE_OPTIONS = [
  DEFAULT_CONSULTATION_TYPE,
  "데일리 월 구독 (₩120,000)",
  "데일리 피드백 멤버십 (₩200,000/월)",
  "시그니처 트랙 (50분 + DAP)",
  "하이엔드 트랙 (15주 프라이빗)",
] as const;

type DiagnosisPrefill = {
  type?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  preferredTime?: string | null;
};

function appendIfPresent(params: URLSearchParams, key: string, value?: string | null) {
  if (!value) return;

  const trimmed = value.trim();
  if (!trimmed) return;

  params.set(key, trimmed);
}

export function normalizeConsultationType(value?: string | null) {
  if (!value) return DEFAULT_CONSULTATION_TYPE;

  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_CONSULTATION_TYPE;

  return CONSULTATION_TYPE_ALIASES[trimmed] ?? trimmed;
}

export function buildDiagnosisPath(prefill: DiagnosisPrefill = {}) {
  const params = new URLSearchParams();

  appendIfPresent(params, "type", normalizeConsultationType(prefill.type));
  appendIfPresent(params, "name", prefill.name);
  appendIfPresent(params, "phone", prefill.phone);
  appendIfPresent(params, "email", prefill.email);
  appendIfPresent(params, "notes", prefill.notes);
  appendIfPresent(params, "preferredTime", prefill.preferredTime);

  const query = params.toString();
  return query ? `/diagnosis?${query}` : "/diagnosis";
}

export { DEFAULT_CONSULTATION_TYPE };
export { CONSULTATION_TYPE_OPTIONS };
