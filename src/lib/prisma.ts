import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const url = (process.env.DATABASE_URL || "").replace(/^["']|["']$/g, '');
    return new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
