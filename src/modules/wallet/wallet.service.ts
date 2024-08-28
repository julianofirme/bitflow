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
  return await db.$transaction(async (transaction) => {
    const wallet = await transaction.wallet.findFirst({
      where: { userId },
    })

    if (!wallet) {
      throw new Error('invalid wallet')
    }

    const updatedWallet = await transaction.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    })

    return updatedWallet
  })
}
