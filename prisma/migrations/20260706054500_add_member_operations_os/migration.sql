CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PENDING_PAYMENT', 'PAUSED', 'COMPLETED', 'CANCELLED', 'REFUND_REQUESTED');

CREATE TYPE "PaymentStatus" AS ENUM ('UNKNOWN', 'PENDING', 'DEPOSIT_PAID', 'PARTIAL_PAID', 'PAID', 'OVERDUE', 'REFUNDED');

CREATE TYPE "CheckInCondition" AS ENUM ('GREAT', 'GOOD', 'NORMAL', 'TIRED', 'REST_NEEDED');

CREATE TYPE "RoutineStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED');

CREATE TYPE "RoutineDeliveryChannel" AS ENUM ('KAKAO', 'EMAIL', 'COPY_LINK', 'MANUAL');

CREATE TYPE "RoutineDeliveryStatus" AS ENUM ('READY', 'SENT', 'FAILED');

CREATE TYPE "ContactChannel" AS ENUM ('KAKAO', 'PHONE', 'EMAIL', 'IN_PERSON', 'NOTE');

CREATE TYPE "RoutineRecommendationStatus" AS ENUM ('SUGGESTED', 'ACCEPTED', 'PUBLISHED', 'DISMISSED');

CREATE TYPE "RoutineAutomationMode" AS ENUM ('AUTO_PUBLISH', 'COACH_APPROVAL', 'COACH_REQUIRED');

CREATE TYPE "LessonAttendanceSource" AS ENUM ('QR', 'MANUAL', 'IMPORT');

CREATE TYPE "LessonAttendanceStatus" AS ENUM ('CONFIRMED', 'VOID');

ALTER TABLE "Consultation" ADD COLUMN "convertedAt" TIMESTAMP(3),
ADD COLUMN "convertedUserId" TEXT;

CREATE TABLE "MemberProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "kakaoId" TEXT,
    "roleTitle" TEXT,
    "industry" TEXT,
    "primaryGoal" TEXT,
    "painPoint" TEXT,
    "practiceAnchor" TEXT,
    "preferredContact" TEXT,
    "representativeSongs" TEXT,
    "privateNotes" TEXT,
    "createdFromConsultationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT,
    "consultationId" TEXT,
    "programName" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "coachId" TEXT,
    "coachName" TEXT,
    "primaryGoal" TEXT,
    "practiceAnchor" TEXT,
    "representativeSongs" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "amountKrw" INTEGER,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyRoutineId" TEXT,
    "condition" "CheckInCondition" NOT NULL DEFAULT 'NORMAL',
    "practicedToday" BOOLEAN NOT NULL DEFAULT false,
    "memo" TEXT,
    "audioFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LessonNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coachId" TEXT,
    "enrollmentId" TEXT,
    "title" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "keyFocus" TEXT,
    "cautionSummary" TEXT,
    "nextLessonGoal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LessonAttendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "recordedByUserId" TEXT,
    "attendanceDate" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "LessonAttendanceSource" NOT NULL DEFAULT 'QR',
    "status" "LessonAttendanceStatus" NOT NULL DEFAULT 'CONFIRMED',
    "qrTokenDate" TEXT,
    "lessonNumber" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonAttendance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyRoutine" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "generatedByUserId" TEXT,
    "title" TEXT NOT NULL,
    "focus" TEXT,
    "lifeAnchor" TEXT,
    "expectedMinutes" INTEGER,
    "stepsJson" TEXT,
    "coachMemo" TEXT,
    "guideUrl" TEXT,
    "assignmentId" TEXT,
    "shareToken" TEXT,
    "status" "RoutineStatus" NOT NULL DEFAULT 'ACTIVE',
    "availableFrom" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyRoutine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoutineDeliveryLog" (
    "id" TEXT NOT NULL,
    "dailyRoutineId" TEXT NOT NULL,
    "channel" "RoutineDeliveryChannel" NOT NULL,
    "status" "RoutineDeliveryStatus" NOT NULL DEFAULT 'READY',
    "recipient" TEXT,
    "message" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutineDeliveryLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoutineTemplate" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "focus" TEXT,
    "expectedMinutes" INTEGER,
    "stepsJson" TEXT,
    "guidePresetKey" TEXT,
    "category" TEXT,
    "tagsJson" TEXT,
    "automationMode" "RoutineAutomationMode" NOT NULL DEFAULT 'COACH_APPROVAL',
    "sourceProject" TEXT DEFAULT 'KAKASHI',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutineTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GojoRoutineRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "routineTemplateId" TEXT,
    "generatedByUserId" TEXT,
    "obiwanSignalId" TEXT,
    "assignmentId" TEXT,
    "dailyRoutineId" TEXT,
    "status" "RoutineRecommendationStatus" NOT NULL DEFAULT 'SUGGESTED',
    "automationMode" "RoutineAutomationMode" NOT NULL DEFAULT 'COACH_APPROVAL',
    "title" TEXT NOT NULL,
    "focus" TEXT,
    "memberMemo" TEXT NOT NULL,
    "expectedMinutes" INTEGER NOT NULL DEFAULT 7,
    "lifeAnchor" TEXT,
    "rationale" TEXT NOT NULL,
    "signalsJson" TEXT,
    "sourceSnapshotJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GojoRoutineRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ObiwanVocalSignal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "externalSessionId" TEXT,
    "sourceRecordingId" TEXT,
    "summary" TEXT,
    "pitchStability" INTEGER,
    "rhythmStability" INTEGER,
    "breathStability" INTEGER,
    "firstPhraseStability" INTEGER,
    "tensionLevel" INTEGER,
    "signalTagsJson" TEXT,
    "rawPayloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObiwanVocalSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MemberInvite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberInvite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coachId" TEXT,
    "consultationId" TEXT,
    "channel" "ContactChannel" NOT NULL DEFAULT 'NOTE',
    "summary" TEXT NOT NULL,
    "nextAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "generatedByUserId" TEXT,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "routineCount" INTEGER NOT NULL DEFAULT 0,
    "recordingCount" INTEGER NOT NULL DEFAULT 0,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "summaryTitle" TEXT NOT NULL,
    "summaryBody" TEXT NOT NULL,
    "nextFocus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "MemberProfile"("userId");

CREATE UNIQUE INDEX "MemberProfile_createdFromConsultationId_key" ON "MemberProfile"("createdFromConsultationId");

CREATE INDEX "Enrollment_userId_status_idx" ON "Enrollment"("userId", "status");

CREATE INDEX "Enrollment_consultationId_idx" ON "Enrollment"("consultationId");

CREATE INDEX "Enrollment_trackId_idx" ON "Enrollment"("trackId");

CREATE INDEX "PaymentRecord_enrollmentId_status_idx" ON "PaymentRecord"("enrollmentId", "status");

CREATE INDEX "CheckIn_userId_createdAt_idx" ON "CheckIn"("userId", "createdAt");

CREATE INDEX "CheckIn_dailyRoutineId_idx" ON "CheckIn"("dailyRoutineId");

CREATE INDEX "LessonNote_userId_createdAt_idx" ON "LessonNote"("userId", "createdAt");

CREATE INDEX "LessonNote_coachId_createdAt_idx" ON "LessonNote"("coachId", "createdAt");

CREATE INDEX "LessonNote_enrollmentId_idx" ON "LessonNote"("enrollmentId");

CREATE INDEX "LessonAttendance_enrollmentId_attendanceDate_idx" ON "LessonAttendance"("enrollmentId", "attendanceDate");

CREATE INDEX "LessonAttendance_attendanceDate_status_idx" ON "LessonAttendance"("attendanceDate", "status");

CREATE INDEX "LessonAttendance_recordedByUserId_checkedInAt_idx" ON "LessonAttendance"("recordedByUserId", "checkedInAt");

CREATE UNIQUE INDEX "LessonAttendance_userId_attendanceDate_key" ON "LessonAttendance"("userId", "attendanceDate");

CREATE UNIQUE INDEX "DailyRoutine_shareToken_key" ON "DailyRoutine"("shareToken");

CREATE INDEX "DailyRoutine_userId_status_idx" ON "DailyRoutine"("userId", "status");

CREATE INDEX "DailyRoutine_enrollmentId_idx" ON "DailyRoutine"("enrollmentId");

CREATE INDEX "DailyRoutine_availableFrom_expiresAt_idx" ON "DailyRoutine"("availableFrom", "expiresAt");

CREATE INDEX "RoutineDeliveryLog_dailyRoutineId_createdAt_idx" ON "RoutineDeliveryLog"("dailyRoutineId", "createdAt");

CREATE INDEX "RoutineTemplate_createdByUserId_isActive_idx" ON "RoutineTemplate"("createdByUserId", "isActive");

CREATE INDEX "GojoRoutineRecommendation_userId_status_createdAt_idx" ON "GojoRoutineRecommendation"("userId", "status", "createdAt");

CREATE INDEX "GojoRoutineRecommendation_generatedByUserId_createdAt_idx" ON "GojoRoutineRecommendation"("generatedByUserId", "createdAt");

CREATE INDEX "GojoRoutineRecommendation_automationMode_status_idx" ON "GojoRoutineRecommendation"("automationMode", "status");

CREATE INDEX "ObiwanVocalSignal_userId_createdAt_idx" ON "ObiwanVocalSignal"("userId", "createdAt");

CREATE INDEX "ObiwanVocalSignal_externalSessionId_idx" ON "ObiwanVocalSignal"("externalSessionId");

CREATE INDEX "ObiwanVocalSignal_assignmentId_idx" ON "ObiwanVocalSignal"("assignmentId");

CREATE UNIQUE INDEX "MemberInvite_tokenHash_key" ON "MemberInvite"("tokenHash");

CREATE INDEX "MemberInvite_userId_createdAt_idx" ON "MemberInvite"("userId", "createdAt");

CREATE INDEX "MemberInvite_expiresAt_acceptedAt_idx" ON "MemberInvite"("expiresAt", "acceptedAt");

CREATE INDEX "ContactLog_userId_createdAt_idx" ON "ContactLog"("userId", "createdAt");

CREATE INDEX "ContactLog_consultationId_idx" ON "ContactLog"("consultationId");

CREATE INDEX "WeeklyReport_enrollmentId_idx" ON "WeeklyReport"("enrollmentId");

CREATE UNIQUE INDEX "WeeklyReport_userId_weekStart_key" ON "WeeklyReport"("userId", "weekStart");

ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_convertedUserId_fkey" FOREIGN KEY ("convertedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_createdFromConsultationId_fkey" FOREIGN KEY ("createdFromConsultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_dailyRoutineId_fkey" FOREIGN KEY ("dailyRoutineId") REFERENCES "DailyRoutine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LessonNote" ADD CONSTRAINT "LessonNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LessonNote" ADD CONSTRAINT "LessonNote_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LessonNote" ADD CONSTRAINT "LessonNote_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LessonAttendance" ADD CONSTRAINT "LessonAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LessonAttendance" ADD CONSTRAINT "LessonAttendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LessonAttendance" ADD CONSTRAINT "LessonAttendance_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RoutineDeliveryLog" ADD CONSTRAINT "RoutineDeliveryLog_dailyRoutineId_fkey" FOREIGN KEY ("dailyRoutineId") REFERENCES "DailyRoutine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RoutineTemplate" ADD CONSTRAINT "RoutineTemplate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GojoRoutineRecommendation" ADD CONSTRAINT "GojoRoutineRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GojoRoutineRecommendation" ADD CONSTRAINT "GojoRoutineRecommendation_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ObiwanVocalSignal" ADD CONSTRAINT "ObiwanVocalSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MemberInvite" ADD CONSTRAINT "MemberInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MemberInvite" ADD CONSTRAINT "MemberInvite_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ContactLog" ADD CONSTRAINT "ContactLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContactLog" ADD CONSTRAINT "ContactLog_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ContactLog" ADD CONSTRAINT "ContactLog_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
