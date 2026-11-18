"use client";

import Image from "next/image";
import Link from "next/link";
import { trackKickoff } from "@/lib/kickoff";
import { COMPRESSION15_URL, SMARTPLACE_URL, THETASON_LINKS } from "@/lib/site";
import s from "./site-chrome.module.css";

const channel = (host: string) => THETASON_LINKS.find((url) => url.includes(host)) ?? "";
export const YOUTUBE_URL = channel("youtube.com");

const NAV_LINKS = [
  ["/#method", "수업 방식"],
  ["/reviews", "후기"],
  ["/guide", "발성 가이드"],
  ["/#programs", "수업 고르기"],
] as const;

// Internal links kept on every page for crawl paths.
const FOOTER_LINKS = [
  ["/bundang-vocal-lesson", "분당 보컬레슨 안내"],
  ["/adult-vocal-lesson", "성인 보컬레슨 · 취미 보컬"],
  ["/vocal-correction", "발성교정 · 목조임 훈련"],
  ["/signature", "1:1 레슨 · 주 1회 50분"],
  ["/spark", "데일리 피드백"],
  [COMPRESSION15_URL, "컴프레션 15주"],
  ["/diagnosis", "3분 무료 발성 진단"],
  ["/guide", "발성 가이드"],
  ["/coach", "원장 소개"],
  ["/reviews", "수강생 후기"],
  ["/refund", "환불 규정"],
  ["https://thetason.com", "보컬트레이너 세타쓴"],
] as const;

export function SiteHeader() {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <Link className={s.brand} href="/">
          <Image src="/brand/seesun-mark.png" alt="" width={34} height={31} priority />
          <span>
            <span className={s.brandName}>
              <span>세타쓴</span>의 시선뮤직
            </span>
            <span className={s.brandSub}>분당 1:1 보컬레슨</span>
          </span>
        </Link>
        <nav className={s.nav} aria-label="사이트 메뉴">
          {NAV_LINKS.map(([href, label]) => (
            <Link key={href} className={s.navLink} href={href}>
              {label}
            </Link>
          ))}
          <a className={s.cta} href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("header")}>
            무료 상담 예약
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <nav className={s.footerNav} aria-label="사이트 안내">
          {FOOTER_LINKS.map(([href, label]) =>
            href.startsWith("http") ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <Link key={href} href={href}>
                {label}
              </Link>
            ),
          )}
        </nav>
        <p className={s.footerArea}>
          경기 성남시 분당구의 1:1 보컬 트레이닝 스튜디오 — 분당 · 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 · 미금동 · 구미동 · 판교 · 용인 수지 보컬레슨
        </p>
        <div className={s.footerInner}>
          <span>세타쓴의 시선뮤직 · 세타쓴(서영빈) · © 2026 SEE:SUN MUSIC</span>
          <span className={s.social}>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">유튜브</a>
            <a href={channel("instagram.com")} target="_blank" rel="noopener noreferrer">인스타그램</a>
            <a href={channel("blog.naver.com")} target="_blank" rel="noopener noreferrer">블로그</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
