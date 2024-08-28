import { BadRequestError } from '../../errors/bad-request-error.js'
import { db } from '../../lib/prisma.js'

export async function validateUserBalance(userId: string, amount: number) {
  const wallet = await db.wallet.findFirst({ where: { userId } })

  if (!wallet) throw new BadRequestError('Wallet not found')
  if (wallet.amount < amount) throw new BadRequestError('Insufficient funds')

  await db.wallet.update({
    where: { id: wallet.id },
    data: { amount: { decrement: amount } },
  })
}
