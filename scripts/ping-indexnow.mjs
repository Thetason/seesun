#!/usr/bin/env node
// Tells Naver and Bing a URL changed, instead of waiting for their crawler.
// Google does not support IndexNow — it is covered by sitemap lastmod, which
// the content engine already keeps accurate.
//
// Usage:
//   node scripts/ping-indexnow.mjs                 # every URL in the sitemap
//   node scripts/ping-indexnow.mjs <url> [url...]  # specific URLs

const KEY = "cf41f5164b7f7284db7f1332a9105b27";
const HOST = "seesunmusic.com";
const SITE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`사이트맵을 읽지 못했습니다 (HTTP ${res.status})`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length ? args : await sitemapUrls();

const foreign = urlList.filter((u) => !u.startsWith(SITE));
if (foreign.length) {
  console.error(`다른 도메인 URL은 보낼 수 없습니다: ${foreign.join(", ")}`);
  process.exit(1);
}

console.log(`IndexNow 전송 — ${urlList.length}개 URL`);
for (const u of urlList) console.log(`  · ${u}`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});

// 200 accepted, 202 accepted but key still being verified.
if (res.status === 200 || res.status === 202) {
  console.log(`\n전송 완료 (HTTP ${res.status}) — 네이버·빙에 색인 요청됨`);
} else {
  console.error(`\n전송 실패 (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
