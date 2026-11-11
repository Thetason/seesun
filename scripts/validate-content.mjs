#!/usr/bin/env node
// Quality gate for auto-merged content drafts.
// Catches what a human reviewer would: stray characters, bad dates, thin
// articles, medical absolutes, broken related-links, duplicate slugs — and
// sentences recycled from other articles, which a weekly template drifts into.
// Exit 1 blocks the merge.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = [
  ["guide", "src/lib/content/guides.ts", "GUIDES"],
];

// Non-space characters of the article body. Re-measured 2026-11-11: avcd.kr
// ~3,700, recent 3옥타브장인 posts 1,600–3,400. Both win with direct answers,
// tables and real material rather than length, so padding is not rewarded.
const MIN_BODY_CHARS = 2500;
const TARGET_BODY_CHARS = 3500;
const MIN_SECTIONS = 5;
const MIN_PARAGRAPHS_PER_SECTION = 2;
const MIN_FAQ = 3;

// Guides published from this date follow the avcd/3옥타브장인 method in
// WRITING_GUIDE.md: each must carry real first-hand material and no D.A.P.
const METHOD_SINCE = "2026-11-12";
const DESCRIPTION_RANGE = [40, 300];

// Sentences this similar to one in another article count as recycled.
const DUPLICATE_SIMILARITY = 0.6;
const DUPLICATE_MIN_CHARS = 25;

// Korean, latin, digits, common punctuation and the dashes/quotes we use.
// Anything else (hanja, stray CJK, mojibake) is a typo we must not publish.
const ALLOWED_TEXT = /^[\s가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9.,!?;:'"()[\]{}<>/\\|~`@#$%^&*_+=\-—–·…“”‘’→←↑↓°%·、。]*$/;

const MEDICAL_ABSOLUTES = ["치료해", "완치", "치료됩니다", "낫습니다"];

// Boilerplate the template already provides; repeating it in every body is filler.
const BOILERPLATE = [
  "한 세트로 운영",
  "한 세트로 두고",
  "의료 기관이 아니라",
];

async function importTs(file) {
  const js = readFileSync(resolve(ROOT, file), "utf8")
    .replace(/^\s*import[^\n]*\n/gm, "")
    .replace(/:\s*readonly\s+ContentDoc\[\]/, "");
  return import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
}

// Evaluates one exported array literal from a TS data file without its types.
async function importArray(file, name) {
  const src = readFileSync(resolve(ROOT, file), "utf8");
  const match = src.match(new RegExp(`export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`));
  if (!match) throw new Error(`${file}: ${name} 배열을 찾지 못했습니다`);
  const js = `export default ${match[1]}`;
  return (await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))).default;
}

// Real material a guide may quote or embed: verbatim reviews and the coach's videos.
async function loadSources() {
  const reviewsFile = "src/lib/content/reviews.ts";
  const record = await importArray(reviewsFile, "RECORD_REVIEWS");
  const earlier = await importArray(reviewsFile, "EARLIER_REVIEWS");
  const videos = await importArray("src/lib/content/videos.ts", "COACH_VIDEOS");
  const squash = (t) => t.replace(/\s+/g, " ").trim();
  return {
    reviews: [...record, ...earlier].map((r) => ({
      author: r.author ?? "수강생",
      body: squash(r.body),
    })),
    videoIds: new Set(videos.map((v) => v.id)),
    squash,
  };
}

async function loadDocs(file, exportName) {
  const mod = await importTs(file);
  const docs = mod[exportName];
  if (!Array.isArray(docs)) throw new Error(`${file}: ${exportName} is not an array`);
  return docs;
}

function collectText(doc) {
  const parts = [doc.title, doc.description, doc.lead];
  for (const s of doc.sections ?? []) parts.push(s.heading, ...(s.body ?? []), ...(s.list ?? []), ...tableCells(s));
  for (const f of doc.faq ?? []) parts.push(f.q, f.a);
  return parts.filter(Boolean);
}

function tableCells(section) {
  if (!section.table) return [];
  return [...section.table.head, ...section.table.rows.flat()];
}

function bodyText(doc) {
  const parts = [doc.lead];
  for (const s of doc.sections ?? []) parts.push(s.heading, ...(s.body ?? []), ...(s.list ?? []), ...tableCells(s));
  for (const f of doc.faq ?? []) parts.push(f.q, f.a);
  return parts.filter(Boolean).join("");
}

function sentences(doc) {
  const out = [];
  for (const t of collectText(doc)) {
    for (const s of t.split(/(?<=[.?!])\s+/)) {
      const norm = s.replace(/[\s.,!?;:'"()“”‘’—–·…\-]/g, "");
      if (norm.length >= DUPLICATE_MIN_CHARS) out.push({ text: s.trim(), grams: bigrams(norm) });
    }
  }
  return out;
}

function bigrams(s) {
  const set = new Set();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const g of a) if (b.has(g)) inter++;
  return inter / (a.size + b.size - inter);
}

function todayKst() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

function validateMaterial(doc, sources, fail) {
  const sections = doc.sections ?? [];
  for (const s of sections) {
    if (s.video && !sources.videoIds.has(s.video)) {
      fail(`video "${s.video}"는 videos.ts에 없는 영상입니다 — 원장 영상만 넣을 수 있습니다`);
    }
    if (s.testimonial) {
      const { author, excerpt } = s.testimonial;
      const found = sources.reviews.some(
        (r) => r.author === author && r.body.includes(sources.squash(excerpt ?? ""))
      );
      if (!found) fail(`testimonial이 reviews.ts의 "${author}" 후기 원문과 일치하지 않습니다 — 후기는 글자 그대로만 인용합니다`);
      if ((excerpt ?? "").length < 20) fail(`testimonial 발췌가 너무 짧습니다 (20자 이상)`);
    }
    if (s.table) {
      const width = s.table.head.length;
      if (width < 2 || s.table.rows.length < 2) fail(`섹션 "${s.heading}"의 표는 2열·2행 이상이어야 합니다`);
      for (const row of s.table.rows) {
        if (row.length !== width) fail(`섹션 "${s.heading}"의 표 행 길이가 머리글(${width}칸)과 다릅니다`);
      }
    }
  }

  if ((doc.published ?? "") < METHOD_SINCE) return;
  if (!sections.some((s) => s.video || s.testimonial)) {
    fail(`실제 재료(원장 영상 video 또는 수강생 후기 testimonial)가 하나도 없습니다`);
  }
  if (JSON.stringify(doc).includes("D.A.P")) fail(`"D.A.P." 표현이 있습니다 — 2026-11-08부터 새 글에 쓰지 않습니다`);
}

function validate(doc, allSlugs, sources, errors, warnings) {
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
  if (doc.updated && doc.updated > todayKst()) {
    fail(`updated가 미래 날짜입니다 (${doc.updated})`);
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

  const chars = bodyText(doc).replace(/\s/g, "").length;
  if (chars < MIN_BODY_CHARS) fail(`본문이 ${chars}자입니다 (최소 ${MIN_BODY_CHARS}, 목표 ${TARGET_BODY_CHARS})`);
  else if (chars < TARGET_BODY_CHARS) warn(`본문 ${chars}자 — 목표 ${TARGET_BODY_CHARS}자에 못 미칩니다`);

  const texts = collectText(doc);
  for (const t of texts) {
    if (!ALLOWED_TEXT.test(t)) {
      const bad = [...t].filter((c) => !ALLOWED_TEXT.test(c));
      fail(`허용되지 않는 문자 발견 (한자·깨진 글자 가능성): ${[...new Set(bad)].join(" ")} — "${t.slice(0, 40)}…"`);
    }
  }

  const joined = texts.join(" ");
  for (const banned of MEDICAL_ABSOLUTES) {
    if (joined.includes(banned)) fail(`의학적 단정 표현 "${banned}"이 포함돼 있습니다`);
  }
  // The studio is not a registered 학원 (학원법), so it must never describe itself as one.
  if (JSON.stringify(doc).includes("학원")) fail(`"학원" 표현이 있습니다 — 보컬레슨·보컬 트레이닝으로 바꿔 주세요`);
  // Lessons are adults-only; entrance-exam prep would be 과외교습 under the same law.
  if (JSON.stringify(doc).includes("입시")) fail(`"입시" 표현이 있습니다 — 성인 전용 레슨이라 입시 준비를 다루지 않습니다`);
  for (const phrase of BOILERPLATE) {
    if (joined.includes(phrase)) fail(`템플릿이 이미 넣는 상투 문구 "${phrase}"가 본문에 있습니다`);
  }

  validateMaterial(doc, sources, fail);

  for (const rel of doc.related ?? []) {
    if (!allSlugs.has(rel)) fail(`related에 존재하지 않는 slug "${rel}"가 있습니다`);
    if (rel === doc.slug) fail(`related가 자기 자신을 가리킵니다`);
  }
}

function checkCrossDuplicates(docs, errors) {
  const per = docs.map((d) => ({ slug: d.slug, sents: sentences(d) }));
  const reported = new Set();
  for (let i = 0; i < per.length; i++) {
    for (let j = i + 1; j < per.length; j++) {
      for (const a of per[i].sents) {
        for (const b of per[j].sents) {
          if (jaccard(a.grams, b.grams) < DUPLICATE_SIMILARITY) continue;
          const key = `${per[i].slug}|${a.text}`;
          if (reported.has(key)) continue;
          reported.add(key);
          errors.push(
            `${per[j].slug}: "${b.text.slice(0, 50)}…" — ${per[i].slug}의 문장과 거의 같습니다`
          );
        }
      }
    }
  }
}

const errors = [];
const warnings = [];
const sources = await loadSources();

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
    validate(doc, slugs, sources, errors, warnings);
  }
  checkCrossDuplicates(docs, errors);

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
