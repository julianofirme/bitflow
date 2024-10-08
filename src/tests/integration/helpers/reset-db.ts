import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    prisma.investment.deleteMany(),
    prisma.deposit.deleteMany(),
    prisma.wallet.deleteMany(),
    prisma.user.deleteMany(),
  ])
}
