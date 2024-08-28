import { BadRequestError } from '../../errors/bad-request-error.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { db } from '../../lib/prisma.js'

export async function validateUserBalance(userId: string, amount: number) {
  const wallet = await db.wallet.findFirst({ where: { userId } })

  const { buy } = await fetchTickerData()
  const purchaseValue = Number(buy) * amount

  if (!wallet) throw new BadRequestError('Wallet not found')
  if (wallet.amount < purchaseValue)
    throw new BadRequestError('Insufficient funds')

  await db.wallet.update({
    where: { id: wallet.id },
    data: { amount: { decrement: purchaseValue } },
  })
}
