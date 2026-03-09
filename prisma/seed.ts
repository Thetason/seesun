import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial admin and student users...')

    // 1. Create Tracs
    await prisma.track.upsert({
        where: { id: 'track_spark' },
        update: {},
        create: {
            id: 'track_spark',
            name: 'Spark',
            description: '월 10만 원 첫 변화 체감 클래스'
        }
    })

    const signatureTrack = await prisma.track.upsert({
        where: { id: 'track_signature' },
        update: {},
        create: {
            id: 'track_signature',
            name: 'Signature',
            description: '히어로 프로덕트, 6주 단위 핵심 솔루션'
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
            trackId: signatureTrack.id
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
