import { db } from '../../lib/prisma.js'

export async function getUserWalletBalance(userId: string) {
  return await db.wallet.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      amount: true,
    },
  })
}

export async function deposit(amount: number, userId: string) {
  const wallet = await db.wallet.findFirst({
    where: { userId },
  })

  if (!wallet) {
    throw new Error('invalid wallet')
  }

  return db.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      amount,
    },
  })
}
