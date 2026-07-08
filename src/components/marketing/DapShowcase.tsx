"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import ShowcaseSideNav from "./ShowcaseSideNav";

const NAV_TIMES = [8, 13, 33, 51, 69, 89];
const NAV_LABELS = ["소개", "01 · 숨", "02 · 압력", "03 · 음색", "04 · 곡", "자동이 될 때까지"];

function subscribeReducedMotion(callback: () => void) {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

function getReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const STEPS = [
    {
        no: "01",
        label: "BREATH · 이너코어를 깨운다",
        title: "노래는 목이 아니라,\n횡격막에서 시작됩니다.",
        body: "가슴으로 얕게 쉬던 숨을 버리고, 잠들어 있던 이너코어(횡격막·속근육)를 깨웁니다. 소리를 지탱하는 진짜 엔진을 몸 안쪽에 다시 세웁니다.",
    },
    {
        no: "02",
        label: "PRESSURE · 목을 놓아준다",
        title: "속근육이 버티면,\n목은 자유로워집니다.",
        body: "이너코어가 압력을 견고하게 받쳐주면, 그동안 혼자 힘쓰던 목(외부근)이 풀립니다. 고음에서 덜 조이고, 덜 무너집니다.",
    },
    {
        no: "03",
        label: "TONE · 내 소리를 입힌다",
        title: "힘이 빠진 자리에,\n당신만의 결이 남습니다.",
        body: "몸이 소리를 지탱하기 시작하면, 비로소 음색을 다룰 여유가 생깁니다. 더 편안하고, 더 나답게 들립니다.",
    },
    {
        no: "04",
        label: "SONG · 자동이 된다",
        title: "생각하지 않아도,\n몸이 노래합니다.",
        body: "반복으로 이너코어의 움직임이 자동이 되면, 무대 위 긴장도 그 자동을 이기지 못합니다. 컨디션이 나쁜 날에도 무너지지 않습니다.",
    },
];

export default function DapShowcase() {
    const rootRef = useRef<HTMLElement | null>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    const activeRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [navVisible, setNavVisible] = useState(false);
    const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
    const lenis = useLenis();

    const jump = (i: number) => {
        const st = stRef.current;
        if (!st) return;
        const target = st.start + (NAV_TIMES[i] / 100) * (st.end - st.start);
        if (lenis) lenis.scrollTo(target, { duration: 1 });
        else window.scrollTo({ top: target, behavior: "smooth" });
    };

    useEffect(() => {
        if (reduced) return;

        gsap.registerPlugin(ScrollTrigger);
        const root = rootRef.current;
        if (!root) return;

        const q = gsap.utils.selector(root);

        gsap.set(q("[data-dap-copy]"), { autoAlpha: 0, y: 36 });
        gsap.set(q("[data-dap-intro]"), { autoAlpha: 1, y: 0 });
        gsap.set(q("[data-v-body]"), { autoAlpha: 0, y: 26 });
        gsap.set(q("[data-v-tension]"), { autoAlpha: 0 });
        gsap.set(q("[data-v-dome]"), { autoAlpha: 0, y: 12 });
        gsap.set(q("[data-v-breath]"), { autoAlpha: 0, scale: 0.85, transformOrigin: "55% 65%" });
        gsap.set(q("[data-v-column]"), { autoAlpha: 0, scaleY: 0.15, transformOrigin: "50% 100%" });
        gsap.set(q("[data-v-tick]"), { autoAlpha: 0 });
        gsap.set(q("[data-v-lfiber]"), { autoAlpha: 0 });
        gsap.set(q("[data-v-freeglow]"), { autoAlpha: 0 });
        gsap.set(q("[data-v-ring]"), { autoAlpha: 0, scale: 0.5, transformOrigin: "50% 50%" });
        gsap.set(q("[data-v-wave]"), { autoAlpha: 0 });
        gsap.set(q("[data-dap-seg]"), { backgroundColor: "rgba(0,0,0,0.12)" });

        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "+=4400",
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
                onToggle: (self) => setNavVisible(self.isActive),
                onUpdate: (self) => {
                    const time = self.progress * 100;
                    let idx = 0;
                    NAV_TIMES.forEach((t, i) => {
                        if (time >= t - 2) idx = i;
                    });
                    if (idx !== activeRef.current) {
                        activeRef.current = idx;
                        setActiveIdx(idx);
                    }
                },
            },
        });

        stRef.current = tl.scrollTrigger ?? null;

        const copies = q("[data-dap-copy]");
        const segs = q("[data-dap-seg]");

        tl.to(q("[data-v-body]"), { autoAlpha: 1, y: 0, duration: 9, ease: "power2.out" }, 0)
            .to(q("[data-v-tension]"), { autoAlpha: 1, duration: 4 }, 6)
            .to(q("[data-dap-intro]"), { autoAlpha: 0, y: -36, duration: 6 }, 8)

            .to(copies[0], { autoAlpha: 1, y: 0, duration: 6 }, 13)
            .to(segs[0], { backgroundColor: "#FE7502", duration: 2 }, 13)
            .to(q("[data-v-dome]"), { autoAlpha: 1, y: 0, duration: 6 }, 13)
            .to(q("[data-v-breath]"), { autoAlpha: 1, scale: 1, duration: 6 }, 17)
            .to(q("[data-v-tick]"), { autoAlpha: 1, duration: 2, stagger: 1.6 }, 21)
            .to(q("[data-v-lfiber]"), { autoAlpha: 1, duration: 2.5, stagger: 1.4 }, 23)

            .to(copies[0], { autoAlpha: 0, y: -36, duration: 4 }, 30)
            .to(copies[1], { autoAlpha: 1, y: 0, duration: 6 }, 33)
            .to(segs[1], { backgroundColor: "#FE7502", duration: 2 }, 33)
            .to(q("[data-v-column]"), { autoAlpha: 1, scaleY: 1, duration: 9 }, 33)
            .to(q("[data-v-tension]"), { autoAlpha: 0, duration: 5 }, 36)
            .to(q("[data-v-freeglow]"), { autoAlpha: 1, duration: 5 }, 39)
            .to(q("[data-v-freeglow]"), { scale: 1.18, transformOrigin: "50% 50%", duration: 4, yoyo: true, repeat: 1 }, 44)

            .to(copies[1], { autoAlpha: 0, y: -36, duration: 4 }, 48)
            .to(copies[2], { autoAlpha: 1, y: 0, duration: 6 }, 51)
            .to(segs[2], { backgroundColor: "#FE7502", duration: 2 }, 51)
            .to(q("[data-v-ring]")[0], { autoAlpha: 1, scale: 1, duration: 3 }, 51)
            .to(q("[data-v-ring]")[1], { autoAlpha: 1, scale: 1, duration: 3 }, 54)
            .to(q("[data-v-ring]")[2], { autoAlpha: 1, scale: 1, duration: 3 }, 57)
            .to(q("[data-v-ring]"), { scale: 1.08, duration: 7, stagger: 1.5 }, 59)

            .to(copies[2], { autoAlpha: 0, y: -36, duration: 4 }, 66)
            .to(copies[3], { autoAlpha: 1, y: 0, duration: 6 }, 69)
            .to(segs[3], { backgroundColor: "#FE7502", duration: 2 }, 69)
            .to(q("[data-v-wave]"), { autoAlpha: 1, duration: 6, stagger: 2 }, 69)
            .to(q("[data-v-all]"), { scale: 1.03, transformOrigin: "50% 60%", duration: 8, yoyo: true, repeat: 1 }, 72)
            .to(q("[data-v-wave]"), { x: -6, duration: 9, stagger: 2 }, 76)
            .to(q("[data-v-core]"), { scale: 1.1, transformOrigin: "50% 50%", duration: 8 }, 78)

            .to(copies[3], { autoAlpha: 0, y: -36, duration: 4 }, 86)
            .to(copies[4], { autoAlpha: 1, y: 0, duration: 6 }, 89)
            .to(q("[data-v-freeglow]"), { scale: 1, duration: 6 }, 90)
            .to({}, { duration: 5 }, 95);

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [reduced]);

    const visual = (
        <svg data-v-all="" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
                <linearGradient id="dapColGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#F7C948" />
                    <stop offset="1" stopColor="#FBDE8A" />
                </linearGradient>
                <radialGradient id="dapCoreGrad">
                    <stop offset="0" stopColor="#F7C948" stopOpacity="0.9" />
                    <stop offset="0.65" stopColor="#F7C948" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#F7C948" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="dapLungGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F6B7C1" />
                    <stop offset="1" stopColor="#E98BA2" />
                </linearGradient>
                <linearGradient id="dapDomeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#D9573D" />
                    <stop offset="1" stopColor="#B93A26" />
                </linearGradient>
                <linearGradient id="dapScmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#EE8496" />
                    <stop offset="1" stopColor="#D94F63" />
                </linearGradient>
                <linearGradient id="dapGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#93B89E" />
                    <stop offset="1" stopColor="#6E9A81" />
                </linearGradient>
                <clipPath id="dapPlateClip">
                    <rect x="0" y="0" width="400" height="560" rx="26" />
                </clipPath>
            </defs>

            <g clipPath="url(#dapPlateClip)">
                <rect x="0" y="0" width="400" height="560" fill="#FE7502" />

                <g data-v-wave="">
                    <path d="M 92 116 Q 68 152 92 188" stroke="#FFF6E8" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
                    <path d="M 70 100 Q 40 152 70 204" stroke="#FFF6E8" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                </g>
                <g data-v-wave="">
                    <path d="M 48 84 Q 12 152 48 220" stroke="#FFF6E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                </g>

                <path data-v-ring="" d="M 126 104 A 44 44 0 0 0 126 180" stroke="#FFF6E8" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
                <path data-v-ring="" d="M 117 88 A 62 62 0 0 0 117 196" stroke="#FFF6E8" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
                <path data-v-ring="" d="M 108 73 A 80 80 0 0 0 108 211" stroke="#FFF6E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

                <g data-v-body="">
                    <path
                        d="M 205 40 C 176 40 152 56 148 84 C 146 96 145 104 143 112 C 141 120 132 127 127 134 C 123 140 125 145 131 147 C 136 149 134 152 132 155 C 139 158 141 161 137 165 C 133 169 135 173 141 176 C 148 179 151 184 149 191 C 147 200 154 207 165 211 C 174 215 179 221 181 229 C 183 242 179 255 173 268 C 165 285 155 299 149 317 C 140 342 136 368 138 395 C 140 426 144 457 144 491 L 141 560 L 349 560 C 347 512 345 452 347 404 C 349 360 345 320 335 288 C 325 258 307 240 285 228 C 273 220 267 210 265 196 C 263 184 261 172 257 162 C 267 152 272 138 272 120 C 272 92 252 55 216 43 C 212 41 208 40 205 40 Z"
                        stroke="#FFDDBA"
                        strokeWidth="10"
                        opacity="0.6"
                    />
                    <path
                        d="M 205 40 C 176 40 152 56 148 84 C 146 96 145 104 143 112 C 141 120 132 127 127 134 C 123 140 125 145 131 147 C 136 149 134 152 132 155 C 139 158 141 161 137 165 C 133 169 135 173 141 176 C 148 179 151 184 149 191 C 147 200 154 207 165 211 C 174 215 179 221 181 229 C 183 242 179 255 173 268 C 165 285 155 299 149 317 C 140 342 136 368 138 395 C 140 426 144 457 144 491 L 141 560 L 349 560 C 347 512 345 452 347 404 C 349 360 345 320 335 288 C 325 258 307 240 285 228 C 273 220 267 210 265 196 C 263 184 261 172 257 162 C 267 152 272 138 272 120 C 272 92 252 55 216 43 C 212 41 208 40 205 40 Z"
                        fill="#FBEFDF"
                    />
                    <path
                        d="M 205 40 C 176 40 152 56 148 84 C 146 96 145 104 143 112 C 141 120 132 127 127 134 C 123 140 125 145 131 147 C 136 149 134 152 132 155 C 139 158 141 161 137 165 C 133 169 135 173 141 176 C 148 179 151 184 149 191 C 147 200 154 207 165 211 C 174 215 179 221 181 229 C 183 242 179 255 173 268 C 165 285 155 299 149 317 C 140 342 136 368 138 395 C 140 426 144 457 144 491 L 141 560 L 349 560 C 347 512 345 452 347 404 C 349 360 345 320 335 288 C 325 258 307 240 285 228 C 273 220 267 210 265 196 C 263 184 261 172 257 162 C 267 152 272 138 272 120 C 272 92 252 55 216 43 C 212 41 208 40 205 40 Z"
                        stroke="#EDD9BE"
                        strokeWidth="5"
                        opacity="0.55"
                    />
                    <path d="M 226 128 C 220 120 222 110 230 106 C 238 102 244 108 243 116 C 242 122 238 126 234 128" stroke="#E3C6A4" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 234 112 C 230 112 228 116 230 120" stroke="#E3C6A4" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 156 193 C 176 201 198 203 218 195" stroke="#EBD5B8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                    <path d="M 138 158 C 162 166 180 180 186 200 C 192 220 196 250 197 284" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
                    <path d="M 183 221 q 7.5 3 15 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                    <path d="M 185 235 q 7.5 3 15 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                    <path d="M 187 249 q 7.5 3 15 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                    <path d="M 188 263 q 7.5 3 15 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                    <circle cx="188" cy="204" r="6" fill="#C2402A" opacity="0.85" />
                </g>

                <g data-v-tension="">
                    <path d="M 246 150 C 236 186 226 222 215 252" stroke="#7C90C4" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                    <path d="M 245 160 C 236 192 227 224 218 250" stroke="#5A6FA8" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                    <path d="M 258 148 C 252 186 248 224 244 260" stroke="url(#dapGreenGrad)" strokeWidth="11" strokeLinecap="round" opacity="0.85" />
                    <path d="M 256 158 C 251 190 247 224 243 256" stroke="#5F8F73" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
                    <path d="M 260 156 C 255 190 251 226 247 258" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
                    <path d="M 240 140 C 220 180 198 224 178 260" stroke="url(#dapScmGrad)" strokeWidth="15" strokeLinecap="round" opacity="0.9" />
                    <path d="M 234 150 C 216 186 197 226 180 256" stroke="#C4485E" strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
                    <path d="M 232 148 C 213 182 194 222 176 254" stroke="#C4485E" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" />
                    <path d="M 237 144 C 218 182 198 224 179 258" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />
                </g>

                <g data-v-body="">
                    <path d="M 158 274 C 200 264 245 258 286 256" stroke="#D9C6AC" strokeWidth="15" strokeLinecap="round" opacity="0.5" />
                    <path d="M 158 272 C 200 262 245 256 286 254" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" opacity="0.85" />
                    <path d="M 166 269 C 200 261 240 256 278 254" stroke="#F3E6D0" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                </g>

                <g data-v-breath="">
                    <path
                        d="M 208 236 C 256 234 290 266 296 312 C 300 348 284 372 250 374 C 214 376 196 346 194 306 C 193 274 196 250 208 236 Z"
                        fill="url(#dapLungGrad)"
                        opacity="0.85"
                    />
                    <path data-v-lfiber="" d="M 220 258 C 246 264 264 284 270 310" stroke="#D5788A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <path data-v-lfiber="" d="M 212 276 C 238 282 256 302 262 328" stroke="#D5788A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <path data-v-lfiber="" d="M 206 296 C 230 302 246 320 252 344" stroke="#D5788A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    <path data-v-lfiber="" d="M 202 316 C 222 322 236 338 241 356" stroke="#D5788A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <path data-v-lfiber="" d="M 226 250 C 252 258 272 278 280 304" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                </g>

                <g data-v-body="">
                    <path d="M 152 288 C 205 274 262 278 318 300" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.38" />
                    <path d="M 147 318 C 202 304 264 308 324 330" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.34" />
                    <path d="M 143 348 C 200 334 266 338 328 360" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.3" />
                </g>

                <g className="dap-breathe">
                    <g data-v-breath="">
                        <ellipse data-v-core="" cx="228" cy="402" rx="54" ry="34" fill="url(#dapCoreGrad)" />
                        <path className="dap-flow" d="M 142 160 C 166 168 181 182 187 202 C 193 222 196 252 197 282" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 12" opacity="0.9" />
                    </g>
                    <g data-v-dome="">
                        <path d="M 150 372 C 194 320 270 320 310 366" stroke="url(#dapDomeGrad)" strokeWidth="16" strokeLinecap="round" opacity="0.95" />
                        <path d="M 158 390 C 198 346 264 346 300 384" stroke="#D9573D" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                        <path data-v-tick="" d="M 177 351 L 169 367" stroke="#F6C0B2" strokeWidth="2" strokeLinecap="round" />
                        <path data-v-tick="" d="M 205 335 L 201 352" stroke="#F6C0B2" strokeWidth="2" strokeLinecap="round" />
                        <path data-v-tick="" d="M 233 329 L 231 346" stroke="#F6C0B2" strokeWidth="2" strokeLinecap="round" />
                        <path data-v-tick="" d="M 261 333 L 263 350" stroke="#F6C0B2" strokeWidth="2" strokeLinecap="round" />
                        <path data-v-tick="" d="M 288 347 L 294 363" stroke="#F6C0B2" strokeWidth="2" strokeLinecap="round" />
                    </g>
                </g>

                <g data-v-column="">
                    <path d="M 197 286 C 193 258 189 232 186 206" stroke="url(#dapColGrad)" strokeWidth="17" strokeLinecap="round" opacity="0.95" />
                    <path d="M 193 276 C 190 254 188 232 186 214" stroke="#D9A621" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
                    <path d="M 200 278 C 197 256 194 234 191 212" stroke="#D9A621" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
                </g>
                <circle data-v-freeglow="" cx="188" cy="204" r="13" stroke="#FFFFFF" strokeWidth="5" opacity="0.9" fill="none" />
            </g>
        </svg>
    );

    if (reduced) {
        return (
            <section style={{ background: "#fff", padding: "8rem 2rem" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem" }}>D.A.P. SYSTEM</p>
                    <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#111", margin: "0.8rem 0 3rem" }}>
                        생각하지 않아도, 몸이 노래하는 상태.
                    </h2>
                    <div style={{ display: "grid", gap: "2.5rem" }}>
                        {STEPS.map((s) => (
                            <div key={s.no}>
                                <div style={{ color: "#FE7502", fontWeight: 900 }}>{s.no} · {s.label}</div>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", whiteSpace: "pre-line", margin: "0.5rem 0" }}>{s.title}</h3>
                                <p style={{ color: "#555", lineHeight: 1.7, maxWidth: "560px", wordBreak: "keep-all" }}>{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={rootRef} className="dap-showcase" style={{ position: "relative", background: "#fff" }}>
            <ShowcaseSideNav labels={NAV_LABELS} active={activeIdx} visible={navVisible} theme="light" onJump={jump} />
            <div className="dap-showcase__stage" style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
                <div className="dap-showcase__inner">

                    <div className="dap-showcase__copy-area">
                        <div data-dap-intro="" className="dap-showcase__block">
                            <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem", marginBottom: "1.2rem" }}>D.A.P. SYSTEM</p>
                            <h2 style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
                                목이 아니라,<br />몸으로 부릅니다.
                            </h2>
                            <p style={{ color: "#86868b", fontSize: "1.05rem", fontWeight: 500, marginTop: "1.6rem", lineHeight: 1.7, wordBreak: "keep-all" }}>
                                <strong style={{ color: "#111" }}>Diaphragm Automatic Program.</strong> 잠든 이너코어(횡격막·속근육)를 깨워, 소리를 지탱하는 일을 몸에게 자동으로 넘기는 시선뮤직의 몸쓰기 메소드입니다. — 천천히 스크롤해 보세요.
                            </p>
                        </div>

                        {STEPS.map((s) => (
                            <div key={s.no} data-dap-copy="" className="dap-showcase__block">
                                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.2rem" }}>
                                    <span style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 900, color: "#FE7502", letterSpacing: "-0.03em" }}>{s.no}</span>
                                    <span style={{ color: "#86868b", fontWeight: 800, letterSpacing: "0.18em", fontSize: "0.85rem" }}>{s.label}</span>
                                </div>
                                <h3 style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.2rem)", fontWeight: 900, color: "#111", lineHeight: 1.18, letterSpacing: "-0.02em", whiteSpace: "pre-line", wordBreak: "keep-all" }}>
                                    {s.title}
                                </h3>
                                <p style={{ color: "#555", fontSize: "clamp(0.98rem, 1.6vw, 1.15rem)", fontWeight: 500, marginTop: "1.4rem", lineHeight: 1.75, maxWidth: "460px", wordBreak: "keep-all" }}>
                                    {s.body}
                                </p>
                            </div>
                        ))}

                        <div data-dap-copy="" className="dap-showcase__block">
                            <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem", marginBottom: "1.2rem" }}>AUTOMATIC</p>
                            <h3 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#111", lineHeight: 1.15, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
                                이너코어가<br /><span style={{ color: "#FE7502" }}>자동이 될 때까지.</span>
                            </h3>
                            <p style={{ color: "#555", fontSize: "1.1rem", fontWeight: 600, marginTop: "1.4rem", lineHeight: 1.7, wordBreak: "keep-all" }}>
                                그것이 D.A.P. — 목이 아니라 몸이 노래하게 만드는 프로그램입니다.
                            </p>
                        </div>

                        <div className="dap-showcase__progress" aria-hidden="true">
                            {STEPS.map((s) => (
                                <span key={s.no} data-dap-seg="" className="dap-showcase__seg" />
                            ))}
                        </div>
                    </div>

                    <div className="dap-showcase__visual">{visual}</div>
                </div>
            </div>

            <style jsx>{`
                .dap-showcase__inner {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1.15fr 1fr;
                    align-items: center;
                    gap: 3rem;
                    height: 100%;
                }

                .dap-showcase__copy-area {
                    position: relative;
                    height: 420px;
                }

                .dap-showcase__block {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .dap-showcase__progress {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    display: flex;
                    gap: 8px;
                }

                .dap-showcase__seg {
                    width: 44px;
                    height: 4px;
                    border-radius: 999px;
                    background: rgba(0, 0, 0, 0.12);
                }

                .dap-showcase__visual {
                    height: min(66vh, 560px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dap-showcase__visual :global(.dap-breathe) {
                    animation: dapBreathe 4.8s ease-in-out infinite;
                }

                .dap-showcase__visual :global(.dap-flow) {
                    animation: dapFlow 1.6s linear infinite;
                }

                @keyframes dapBreathe {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(5px); }
                }

                @keyframes dapFlow {
                    to { stroke-dashoffset: -56; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .dap-showcase__visual :global(.dap-breathe),
                    .dap-showcase__visual :global(.dap-flow) {
                        animation: none;
                    }
                }

                @media (max-width: 860px) {
                    .dap-showcase__inner {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                        align-content: center;
                        padding-top: 9vh;
                    }

                    .dap-showcase__visual {
                        order: -1;
                        height: 34vh;
                    }

                    .dap-showcase__copy-area {
                        height: 46vh;
                    }

                    .dap-showcase__block {
                        justify-content: flex-start;
                    }
                }
            `}</style>
        </section>
    );
}
