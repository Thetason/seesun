import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'vocal202065@gmail.com' }
  })
  
  if (!user || !user.password) {
    console.log('User not found or no password')
    return
  }

  const testPassword = 'admin123!'
  const isValid = await bcrypt.compare(testPassword, user.password)
  
  console.log('Testing password:', testPassword)
  console.log('Hashed password in DB:', user.password)
  console.log('Is valid:', isValid)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
