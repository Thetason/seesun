# LongBlack Style Routine Delivery

Date: 2026-06-12
Status: Implemented email/outbox MVP
Scope: Project Kakashi / SEE:SUN App

## 벤치마크 요약

롱블랙은 유료 멤버에게 매일의 콘텐츠를 보내는 습관형 구독 서비스다.

공개 FAQ 기준:

- 오늘의 노트는 매주 월요일부터 토요일까지 하루 한 편 발행된다.
- 오늘의 노트 플랜에서는 자정에 전달되고 24시간 뒤 열람이 제한된다.
- 매일 알림은 이메일 뉴스레터, 카카오톡 채널, 앱 푸시 세 가지 수단으로 제공된다.
- 앱 푸시는 사용자가 원하는 시간/요일을 설정할 수 있다.
- 개별 앱 푸시 알림을 설정하면 기본 오전 8시 알림은 이중 발송 방지를 위해 발송되지 않는다.

## SEE:SUN 적용 원칙

롱블랙의 콘텐츠 알림을 그대로 복제하지 않는다.

SEE:SUN은 교육/라이프코칭 서비스이므로, 알림의 목적은 “읽히기”가 아니라 “오늘 연습을 삶 안에 붙이기”다.

회원에게 보이는 문장:

`오늘은 이것만 하면 됩니다.`

운영 구조:

`DailyRoutine -> delivery message -> email/kakao outbox -> member opens routine -> recording/check-in -> coach follow-up`

## 현재 구현

### Email

SMTP 설정이 있으면 오늘 열려 있는 `DailyRoutine`을 회원 이메일로 자동 발송한다.

필요 env:

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_FROM`

### Kakao

카카오 비즈 채널/API 자격은 아직 없으므로 자동 발송은 하지 않는다.

대신 `RoutineDeliveryLog`에 `KAKAO / READY` 상태로 메시지와 링크를 쌓는다.

이 outbox는 이후 다음 중 하나로 연결할 수 있다.

- 카카오톡 채널 관리자 수동 발송
- 알림톡/친구톡 발송 대행사 API
- Kakao Business API

### App Push

아직 네이티브 앱/푸시 토큰이 없으므로 미구현이다.

롱블랙과 같은 앱 푸시 설정은 모바일 앱 또는 PWA push 설계 후 붙인다.

## Cron

Vercel cron:

```json
{
  "path": "/api/internal/routines/daily-delivery",
  "schedule": "0 23 * * *"
}
```

`0 23 * * *`는 UTC 기준이며 한국시간 오전 8시다.

## 주요 파일

- `src/lib/routine-delivery.ts`
- `src/app/api/internal/routines/daily-delivery/route.ts`
- `vercel.json`
- `prisma/schema.prisma`

## 검증

```bash
npm run lint
npm run build
```

Dry run:

```bash
curl "http://localhost:3000/api/internal/routines/daily-delivery?dryRun=1"
```
