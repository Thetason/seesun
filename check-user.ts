import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'vocal202065@gmail.com' }
  })
  console.log('User found:', user ? { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password } : 'Not found')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
