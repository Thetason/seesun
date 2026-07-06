# SEE:SUN App 현재 브리프

Date: 2026-06-12
Status: Active source-of-truth entry point
Audience: SEE:SUN team, AI coding agents, product/design collaborators

## 한 줄 정의

SEE:SUN App은 시선뮤직의 유료회원을 위한 음악 라이프코칭 운영체제다.

내부 코드네임은 Project Kakashi다.

Kakashi는 랜딩페이지, 상담, 유료회원 전환, 회원 로그인, 루틴 발행, 녹음 제출, 코치 피드백, 주간 리포트, 운영 기록을 하나의 흐름으로 묶는다.

## 우리가 만들려는 것

목표는 회원에게 “연습 숙제”를 주는 것이 아니다.

목표는 회원의 실제 삶 안에 음악 연습이 작게라도 반복되도록 만드는 것이다.

회원이 느껴야 하는 감각:

`오늘은 이것만 하면 됩니다.`

코치가 가져야 하는 감각:

`오늘 누구를 챙겨야 하는지, 왜 이 루틴을 줘야 하는지 기억하지 않아도 보인다.`

운영자가 가져야 하는 감각:

`유료회원이 실제로 관리되고 있고, 루틴-녹음-피드백-리포트 흐름이 매주 쌓이고 있다.`

## 제품 원칙

- 회원 화면은 모바일 우선이다.
- 회원에게는 한 번에 하나의 행동만 보여준다.
- 복잡한 추천 근거는 내부 OS에 숨기고, 회원에게는 조용한 루틴 카드만 보여준다.
- 루틴은 랜덤 AI 생성물이 아니다.
- 루틴은 SEE:SUN 교육 철학, 회원 상태, 코치 피드백, 그리고 앞으로 Obiwan 보컬 신호에 근거해야 한다.
- Obiwan은 보컬 트레이닝 앱이고, Kakashi는 회원 운영 앱이며, Gojo는 루틴 추천 엔진이다.

## 프로젝트 구조

### Project Kakashi

현재 이 저장소의 웹앱.

역할:

- 공개 랜딩/진단 흐름
- 상담 리드 관리
- 유료회원 전환
- 회원 로그인
- DailyRoutine 발행
- 녹음 제출
- 코치 피드백
- 주간 리포트
- 운영 메모
- 레슨 QR 출석/회차 장부
- 회원 리텐션 관리

Kakashi는 원시 보컬 분석 엔진이 아니다.

### Project Obiwan

별도 개발 중인 보컬 트레이닝 앱.

역할:

- AI 보컬 연습
- 음정/박자/호흡/프레이즈 분석
- Session Coach 신호 생성
- 실제 소리 기반 반복 훈련

Obiwan은 유료회원 관리 OS가 아니다.

### Project Gojo

Kakashi 안에 들어가기 시작한 Routine Recommendation Engine.

역할:

- Kakashi 회원 상태 읽기
- Obiwan 보컬 신호 수신
- SEE:SUN 승인 루틴 패턴에서 추천
- 추천 근거와 자동화 모드 저장
- 코치 승인/보류/발행 흐름 연결

Gojo는 무작위 코칭 조언 생성기가 아니다.

## 핵심 운영 흐름

현재 목표 흐름:

`랜딩/진단 -> 상담 -> 유료회원 전환 -> 오늘 루틴 -> 녹음 제출 -> 코치 피드백 -> 주간 리포트 -> 다음 루틴`

Gojo/Obiwan 포함 흐름:

`Obiwan Session Coach -> Kakashi signal ingest -> Gojo recommendation queue -> coach decision -> Kakashi routine publication -> member practice`

회원에게 보이는 흐름:

`로그인 -> 오늘 루틴 확인 -> 녹음 남기기 -> 코치 확인 대기`

레슨 출석 흐름:

`코치 Dashboard Lesson QR -> 회원 QR scan -> login -> 오늘 출석 기록 -> 현재 과정 n회차 자동 반영`

롱블랙식 루틴 발송 흐름:

`DailyRoutine -> 한국시간 오전 8시 email 발송 + Kakao outbox -> 회원 routine link -> 녹음/체크인`

## 현재 구현된 것

### 회원/운영 OS

- MemberProfile
- Enrollment
- PaymentRecord
- CheckIn
- LessonNote
- DailyRoutine
- RoutineDeliveryLog
- ContactLog
- WeeklyReport
- MemberInvite
- LessonAttendance
- consultation-to-member conversion
- invite/password setup flow
- manual payment record
- member mobile Today screen
- coach member OS panel
- daily Lesson QR
- automatic lesson number ledger

### 루틴/녹음

- DailyRoutine 기반 오늘 루틴 표시
- Mission Possible/Assignment 호환
- 브라우저 녹음
- 파일 업로드
- Vercel Blob audio access
- Routine Studio
- routine templates
- weekly routine batch
- Spark member batch flow
- LongBlack-style daily routine delivery cron
- email routine delivery when SMTP is configured
- Kakao routine delivery outbox

### Project Gojo

- 승인된 루틴 라이브러리
- Kakashi 데이터 기반 추천 엔진
- GojoRoutineRecommendation 저장
- 추천 근거/rationale 저장
- automation mode 저장
- coach dashboard Project Gojo panel
- 추천 생성
- Routine Studio handoff
- direct publish
- accept/dismiss decision endpoint

### Project Obiwan harness

- `POST /api/integrations/obiwan/signals`
- legacy payload + Session Coach payload normalization
- `ObiwanVocalSignal` 저장
- Gojo recommendation queue item 자동 생성
- ContactLog audit note
- production secret guard: `OBIWAN_INTEGRATION_SECRET`

### Internal OS

- `GET /api/admin/internal-os/member-state?userId=...`
- `POST /api/admin/internal-os/recommendations/[recommendationId]/decision`
- coach-required guardrail
- dismissed recommendation publish guardrail
- `npm run internal-os:regression`

## 지금 남은 큰 일

1. SEE:SUN 승인 루틴 라이브러리 확장
2. 실제 Obiwan 프로젝트에서 Session Coach payload를 이 Kakashi API로 연결
3. Coach dashboard의 Gojo queue를 더 운영 중심으로 정리
4. Kakao/Alimtalk 자동 전달 또는 최소한 발송 큐 구현
5. 실제 런칭 전 QA: 로그인, 초대, 모바일 녹음, Blob, Vercel env, 권한, 배포 보호
6. 리포트/증거/리텐션 지표 강화
7. 레슨 출석 장부 기반 결제/차감 정책은 추후 결정
8. 결제 자동화는 현재 우선순위 아님

## 반드시 읽을 문서 순서

1. `docs/current/00_START_HERE.md`
2. `docs/current/2026-06-08_SEESUN_APP_PRODUCT_DOCTRINE.md`
3. `docs/current/2026-06-08_PROJECT_SYSTEM_ARCHITECTURE.md`
4. `docs/current/2026-06-08_INTERNAL_OS_CONTRACT.md`
5. `docs/current/2026-06-12_LESSON_ATTENDANCE_QR.md`
6. `docs/current/2026-06-12_LONGBLACK_STYLE_ROUTINE_DELIVERY.md`
7. `docs/current/2026-06-08_SEESUN_APP_SCREEN_BLUEPRINT.md`
8. `docs/current/2026-06-08_SEESUN_APP_IMPLEMENTATION_ROADMAP.md`
9. `AI_HANDOFF.md`

## 검증 명령

일반 검증:

```bash
npm run lint
npm run build
```

Internal OS 검증:

```bash
npm run internal-os:regression
```

전체 검증:

```bash
npm run verify
```

## 결정된 것

- 회원이 보는 이름은 SEE:SUN App이다.
- Project Kakashi, Project Obiwan, Project Gojo는 내부 코드네임이다.
- 모바일 회원 경험은 대시보드가 아니라 “오늘의 한 장”이어야 한다.
- Gojo는 루틴 제작 부담을 줄이기 위한 엔진이다.
- Obiwan은 Gojo 판단의 보컬 신호 공급원이다.
- Kakashi는 모든 운영 기록과 회원 관계의 중심이다.
- 레슨 회차는 현재 활성 Enrollment의 QR 출석 장부 기준으로 계산한다.
- 오늘 루틴 알림은 한국시간 오전 8시를 기본 발송 시간으로 둔다.

## 결정하지 않은 것

- Native mobile app 전환 시점
- Kakao Alimtalk 도입 시점
- 레슨 출석 장부를 결제/차감과 연결하는 정책
- 카카오 알림톡/친구톡 발송 사업자와 템플릿 승인 방식
- Obiwan의 최종 분석 payload version
- 실제 운영에서 AUTO_PUBLISH를 어느 수준까지 허용할지
