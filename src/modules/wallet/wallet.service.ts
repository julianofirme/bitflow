import { db } from '../../lib/prisma.js'

export async function getUserBalance(userId: string) {
  return await db.wallet.findFirst({
    where: {
      userId,
    },
    select: {
      amount: true,
    },
  })
}
