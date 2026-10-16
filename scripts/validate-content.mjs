#!/usr/bin/env node
// Quality gate for auto-merged content drafts.
// Catches what a human reviewer would: stray characters, bad dates, missing
// medical disclaimers, thin sections, broken related-links, duplicate slugs.
// Exit 1 blocks the merge.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = [
  ["guide", "src/lib/content/guides.ts", "GUIDES"],
];

const MIN_SECTIONS = 3;
const MIN_PARAGRAPHS_PER_SECTION = 2;
const MIN_FAQ = 3;
const MIN_BODY_CHARS = 1200;
const DESCRIPTION_RANGE = [40, 300];

// Korean, latin, digits, common punctuation and the dashes/quotes we use.
// Anything else (hanja, stray CJK, mojibake) is a typo we must not publish.
const ALLOWED_TEXT = /^[\s가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9.,!?;:'"()[\]{}<>/\\|~`@#$%^&*_+=\-—–·…“”‘’→←↑↓°%·、。]*$/;

const MEDICAL_TRIGGERS = ["목", "통증", "성대", "발성장애", "떨림", "아픔", "쉰"];
const MEDICAL_DISCLAIMER = "이비인후과";

async function loadDocs(file, exportName) {
  const src = readFileSync(resolve(ROOT, file), "utf8");
  const js = src
    .replace(/^\s*import[^\n]*\n/gm, "")
    .replace(/:\s*readonly\s+ContentDoc\[\]/, "");
  const url = "data:text/javascript;base64," + Buffer.from(js).toString("base64");
  const mod = await import(url);
  const docs = mod[exportName];
  if (!Array.isArray(docs)) throw new Error(`${file}: ${exportName} is not an array`);
  return docs;
}

function collectText(doc) {
  const parts = [doc.title, doc.description, doc.lead];
  for (const s of doc.sections ?? []) parts.push(s.heading, ...(s.body ?? []));
  for (const f of doc.faq ?? []) parts.push(f.q, f.a);
  return parts.filter(Boolean);
}

function todayKst() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

function validate(doc, allSlugs, errors, warnings) {
  const id = doc.slug || "(slug 없음)";
  const fail = (m) => errors.push(`${id}: ${m}`);
  const warn = (m) => warnings.push(`${id}: ${m}`);

  for (const field of ["kind", "slug", "category", "categoryLabel", "title", "description", "lead", "published"]) {
    if (!doc[field] || String(doc[field]).trim() === "") fail(`필수 항목 '${field}'이 비어 있습니다`);
  }

  if (doc.slug && !/^[a-z0-9-]+$/.test(doc.slug)) {
    fail(`slug은 영문 소문자·숫자·하이픈만 가능합니다 (현재: ${doc.slug})`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.published ?? "")) {
    fail(`published 형식이 잘못됐습니다 (현재: ${doc.published})`);
  } else if (doc.published > todayKst()) {
    fail(`published가 미래 날짜입니다 (${doc.published} > ${todayKst()})`);
  }

  const desc = (doc.description ?? "").length;
  if (desc && (desc < DESCRIPTION_RANGE[0] || desc > DESCRIPTION_RANGE[1])) {
    warn(`description 길이 ${desc}자 (권장 ${DESCRIPTION_RANGE.join("~")}자)`);
  }

  const sections = doc.sections ?? [];
  if (sections.length < MIN_SECTIONS) fail(`섹션이 ${sections.length}개입니다 (최소 ${MIN_SECTIONS})`);
  sections.forEach((s, i) => {
    if (!s.heading?.trim()) fail(`${i + 1}번째 섹션에 heading이 없습니다`);
    if ((s.body ?? []).length < MIN_PARAGRAPHS_PER_SECTION) {
      fail(`섹션 "${s.heading}"의 문단이 ${(s.body ?? []).length}개입니다 (최소 ${MIN_PARAGRAPHS_PER_SECTION})`);
    }
  });

  if ((doc.faq ?? []).length < MIN_FAQ) {
    fail(`FAQ가 ${(doc.faq ?? []).length}개입니다 (최소 ${MIN_FAQ})`);
  }

  const texts = collectText(doc);
  const bodyChars = texts.join("").length;
  if (bodyChars < MIN_BODY_CHARS) fail(`본문이 ${bodyChars}자입니다 (최소 ${MIN_BODY_CHARS})`);

  for (const t of texts) {
    if (!ALLOWED_TEXT.test(t)) {
      const bad = [...t].filter((c) => !ALLOWED_TEXT.test(c));
      fail(`허용되지 않는 문자 발견 (한자·깨진 글자 가능성): ${[...new Set(bad)].join(" ")} — "${t.slice(0, 40)}…"`);
    }
  }

  const joined = texts.join(" ");
  const touchesMedical = MEDICAL_TRIGGERS.some((k) => joined.includes(k));
  if (touchesMedical && !joined.includes(MEDICAL_DISCLAIMER)) {
    fail(`목·통증 관련 내용인데 '${MEDICAL_DISCLAIMER}' 안내 문장이 없습니다`);
  }
  for (const banned of ["치료해", "완치", "치료됩니다", "낫습니다"]) {
    if (joined.includes(banned)) fail(`의학적 단정 표현 "${banned}"이 포함돼 있습니다`);
  }

  for (const rel of doc.related ?? []) {
    if (!allSlugs.has(rel)) fail(`related에 존재하지 않는 slug "${rel}"가 있습니다`);
    if (rel === doc.slug) fail(`related가 자기 자신을 가리킵니다`);
  }
}

const errors = [];
const warnings = [];

for (const [kind, file, exportName] of SOURCES) {
  let docs;
  try {
    docs = await loadDocs(file, exportName);
  } catch (e) {
    errors.push(`${file} 읽기 실패: ${e.message}`);
    continue;
  }

  const slugs = new Set(docs.map((d) => d.slug));
  if (slugs.size !== docs.length) {
    const seen = new Set();
    for (const d of docs) {
      if (seen.has(d.slug)) errors.push(`중복 slug: ${d.slug}`);
      seen.add(d.slug);
    }
  }

  for (const doc of docs) {
    if (doc.kind !== kind) errors.push(`${doc.slug}: kind가 "${doc.kind}"입니다 (기대: "${kind}")`);
    validate(doc, slugs, errors, warnings);
  }

  console.log(`${file}: ${docs.length}편 검사`);
}

if (warnings.length) {
  console.log("\n경고 (머지는 가능):");
  for (const w of warnings) console.log(`  · ${w}`);
}

if (errors.length) {
  console.error(`\n검증 실패 — ${errors.length}건:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\n검증 통과 — 머지 가능");
