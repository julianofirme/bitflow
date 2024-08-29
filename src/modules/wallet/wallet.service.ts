import { NotFoundError } from '../../errors/not-found-error.js'
import { db } from '../../lib/prisma.js'

export async function getUserWalletBalance(userId: string) {
  const wallet = await db.wallet.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      amount: true,
      amount_btc: true,
    },
  })

  if (!wallet) {
    throw new NotFoundError('Wallet not found')
  }

  return wallet
}

export async function deposit(amount: number, userId: string) {
  return await db.$transaction(async (transaction) => {
    const wallet = await transaction.wallet.findFirst({
      where: { userId },
    })

    if (!wallet) {
      throw new NotFoundError('Wallet not found')
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

export async function depositBTC(amount: number, userId: string) {
  return await db.$transaction(async (transaction) => {
    const wallet = await transaction.wallet.findFirst({
      where: { userId },
    })

    if (!wallet) {
      throw new NotFoundError('Wallet not found')
    }

    const updatedWallet = await transaction.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        amount_btc: {
          increment: amount,
        },
      },
    })

    return updatedWallet
  })
}
