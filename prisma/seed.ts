import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial admin and student users...')

    // 1. Create Tracks
    const spark = await prisma.track.upsert({
        where: { id: 'track_spark' },
        update: {
            name: 'Spark',
            description: '온라인 데일리 루틴 & 1:1 피드백 (10만/20만)',
        },
        create: {
            id: 'track_spark',
            name: 'Spark',
            description: '온라인 데일리 루틴 & 1:1 피드백 (10만/20만)',
        },
    });

    const focus = await prisma.track.upsert({
        where: { id: 'track_focus' },
        update: {
            name: 'Essential',
            description: '30분 집중 코칭: 보컬디렉팅 + 피드백음원 (가장 베이직한 경험)',
        },
        create: {
            id: 'track_focus',
            name: 'Essential',
            description: '30분 집중 코칭: 보컬디렉팅 + 피드백음원 (가장 베이직한 경험)',
        },
    });

    const signature = await prisma.track.upsert({
        where: { id: 'track_signature' },
        update: {
            name: 'Signature',
            description: '50분 메인 트랙: DAP + 보컬디렉팅 + 피드백음원 + 스파크 포함',
        },
        create: {
            id: 'track_signature',
            name: 'Signature',
            description: '50분 메인 트랙: DAP + 보컬디렉팅 + 피드백음원 + 스파크 포함',
        },
    });

    await prisma.track.upsert({
        where: { id: 'track_reserve' },
        update: {
            name: 'HighEnd',
            description: '특수 목적 및 기간 한정 고강도 트레이닝 (HIGH-END)'
        },
        create: {
            id: 'track_reserve',
            name: 'HighEnd',
            description: '특수 목적 및 기간 한정 고강도 트레이닝 (HIGH-END)'
        }
    })

    // 2. Create Admin (Coach)
    const hashedAdminPassword = await bcrypt.hash('admin123!', 10)

    await prisma.user.upsert({
        where: { email: 'admin@seesun.com' },
        update: {},
        create: {
            email: 'admin@seesun.com',
            name: 'SEE:SUN 대표 코치',
            password: hashedAdminPassword,
            role: 'COACH',
        },
    })

    // 3. Create a Test Student
    const hashedStudentPassword = await bcrypt.hash('student123!', 10)

    await prisma.user.upsert({
        where: { email: 'student@seesun.com' },
        update: {},
        create: {
            email: 'student@seesun.com',
            name: '김진수 (테스트 수강생)',
            password: hashedStudentPassword,
            role: 'STUDENT',
            trackId: signature.id
        },
    })

    console.log('Seeding completed!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
