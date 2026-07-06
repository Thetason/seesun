# Lesson Attendance QR

Date: 2026-06-12
Status: Implemented MVP
Scope: Project Kakashi / SEE:SUN App

## 목적

레슨 운영에서 가장 관리가 어려운 부분을 자동화한다.

- 누가 유료회원으로 등록되어 있는지
- 현재 등록 과정에서 몇 회차까지 왔는지
- 오늘 레슨 출석이 기록됐는지
- 코치가 수기로 장부를 다시 맞추지 않아도 되는지

이 기능은 결제 자동화가 아니다.

현재 목적은 레슨 참여/회차 장부를 정확히 쌓는 것이다. 결제 정책은 나중에 이 장부를 기준으로 연결할 수 있다.

## 동작 흐름

Coach:

`Dashboard -> Today Care -> Lesson QR`

Member:

`QR scan -> login if needed -> /lesson/check-in -> attendance recorded -> dashboard`

System:

`daily QR token -> session user -> active Enrollment -> LessonAttendance -> lessonNumber`

## 회차 기준

회차는 현재 활성 Enrollment 기준으로 계산한다.

- active enrollment가 있으면 해당 enrollment의 `LessonAttendance` 개수를 기준으로 다음 회차를 부여한다.
- active enrollment가 없으면 member 전체 출석 기록 기준으로 fallback한다.
- 같은 회원은 같은 날짜에 한 번만 출석 처리된다.

DB constraint:

`@@unique([userId, attendanceDate])`

## 보안/운영 기준

QR 토큰은 날짜별 HMAC이다.

Secret 우선순위:

1. `LESSON_QR_SECRET`
2. `NEXTAUTH_SECRET`
3. development fallback

Production에서는 `LESSON_QR_SECRET` 또는 `NEXTAUTH_SECRET`이 필요하다.

오늘 날짜의 QR만 출석 처리된다.

## 주요 파일

- `prisma/schema.prisma`
- `src/lib/lesson-attendance.ts`
- `src/app/api/admin/lesson-attendance/qr/route.ts`
- `src/app/api/lesson-attendance/check-in/route.ts`
- `src/app/lesson/check-in/page.tsx`
- `src/app/lesson/check-in/LessonCheckInClient.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/CoachDashboardClient.tsx`
- `src/app/dashboard/StudentDashboardClient.tsx`

## UI 기준

Coach dashboard:

- Today Care에 오늘 Lesson QR 표시
- 선택 회원의 오늘 출석 상태 표시
- Lesson Ledger에서 등록일, 누적 회차, 최근 회차 타임라인 표시
- 수강생 목록에서 오늘 출석/누적 회차를 빠르게 스캔

Member dashboard:

- My Program 카드에 오늘 출석 완료 또는 현재 회차 표시
- 세부 장부는 코치 화면 중심으로 유지

## 검증

```bash
npx prisma format
npx prisma generate
npm run lint
npm run build
npm run internal-os:regression
```
