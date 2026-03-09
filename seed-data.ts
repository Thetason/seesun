import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const url = (process.env.DATABASE_URL || "").replace(/^["']|["']$/g, '');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
})

async function main() {
    console.log('Seeding rich test data...')

    // 1. Get Users
    const student = await prisma.user.findUnique({ where: { email: 'student@test.com' } })
    const coach = await prisma.user.findUnique({ where: { email: 'admin@sisun.com' } })

    if (!student || !coach) {
        throw new Error('Student or Coach not found. Run seed-admin first.')
    }

    // 2. Create Track (Signature - 5 Weeks, 4 Missions)
    const track = await prisma.track.upsert({
        where: { id: 'track-signature' },
        update: {
            name: '시선 시그니처 클래스 (Signature)',
            description: '4회 세션 보컬 부스터 멤버십 (시선 스파크 전면 포함)'
        },
        create: {
            id: 'track-signature',
            name: '시선 시그니처 클래스 (Signature)',
            description: '4회 세션 보컬 부스터 멤버십 (소진 시 연장)'
        }
    })

    // 3. Assign Student to Track
    await prisma.user.update({
        where: { id: student.id },
        data: { trackId: track.id }
    })

    // 4. Create Assignments for student@test.com
    // Mission 1 (Completed)
    const assignment1 = await prisma.assignment.upsert({
        where: { id: 'test-assign-1' },
        update: {
            title: 'STEP 01: 바디 시스템 튜닝 (1세션)',
            description: 'D.A.P 시스템을 통한 노래하는 몸 만들기 연습 녹음본을 올려주세요.',
            weekNumber: 1,
            isCompleted: true,
            audioFileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        },
        create: {
            id: 'test-assign-1',
            title: 'STEP 01: 바디 시스템 튜닝 (1세션)',
            description: 'D.A.P 시스템을 통한 노래하는 몸 만들기 연습 녹음본을 올려주세요.',
            weekNumber: 1,
            isCompleted: true,
            audioFileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            userId: student.id
        }
    })

    // Mission 2 (Active)
    await prisma.assignment.upsert({
        where: { id: 'test-assign-2' },
        update: {
            title: 'STEP 02: 보컬 아키텍처 및 톤 메이킹 (2세션)',
            description: '당신이 가진 가장 매력적인 음색을 발굴하고 고유의 톤을 다듬는 연습 녹음본을 올려주세요.',
            weekNumber: 2,
            isCompleted: false,
        },
        create: {
            id: 'test-assign-2',
            title: 'STEP 02: 보컬 아키텍처 및 톤 메이킹 (2세션)',
            description: '당신이 가진 가장 매력적인 음색을 발굴하고 고유의 톤을 다듬는 연습 녹음본을 올려주세요.',
            weekNumber: 2,
            isCompleted: false,
            userId: student.id
        }
    })

    // Mission 3 (Pending)
    await prisma.assignment.upsert({
        where: { id: 'test-assign-3' },
        update: {},
        create: {
            id: 'test-assign-3',
            title: 'STEP 03: 실전 보컬 디렉팅 및 적용 (3세션)',
            description: '훈련된 발성을 실제 곡에 적용하는 연습 녹음본을 올려주세요.',
            weekNumber: 3,
            isCompleted: false,
            userId: student.id
        }
    })

    // Mission 4 (Pending) - Week 4
    await prisma.assignment.upsert({
        where: { id: 'test-assign-4' },
        update: {},
        create: {
            id: 'test-assign-4',
            title: 'STEP 04: 퍼펙트 레코딩 및 아카이빙 (4세션)',
            description: '최종 완성곡 레코딩 및 피드백 준비용 녹음본을 올려주세요.',
            weekNumber: 4,
            isCompleted: false,
            userId: student.id
        }
    })

    // 5. Create Feedback for Assignment 1
    await prisma.feedback.upsert({
        where: { id: 'test-feedback-1' },
        update: {
            comment: '호흡이 아주 안정적입니다! 다만 끝음 처리를 조금 더 명확하게 해주시면 완벽할 것 같아요.',
            audioFileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        },
        create: {
            id: 'test-feedback-1',
            comment: '호흡이 아주 안정적입니다! 다만 끝음 처리를 조금 더 명확하게 해주시면 완벽할 것 같아요.',
            audioFileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            assignmentId: assignment1.id,
            coachId: coach.id
        }
    })

    console.log('Rich test data seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
