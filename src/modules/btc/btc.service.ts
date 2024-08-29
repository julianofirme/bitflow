import { BadRequestError } from '../../errors/bad-request-error.js'
import { NotFoundError } from '../../errors/not-found-error.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { db } from '../../lib/prisma.js'

export async function validateUserBalance(
  type: 'buy' | 'sell',
  userId: string,
  amount: number,
) {
  const wallet = await db.wallet.findFirst({ where: { userId } })
  const btc = await fetchTickerData()
  if (!wallet) throw new NotFoundError('Wallet not found')

  if (type === 'buy') {
    const purchaseValue = Number(btc.buy) * amount

    if (wallet.amount < purchaseValue)
      throw new BadRequestError('Insufficient funds')

    await db.wallet.update({
      where: { id: wallet.id },
      data: { amount: { decrement: purchaseValue } },
    })
  }

  if (type === 'sell') {
    if (wallet.amount_btc < amount) {
      throw new BadRequestError('Insufficient BTC balance to sell')
    }
  }
}
