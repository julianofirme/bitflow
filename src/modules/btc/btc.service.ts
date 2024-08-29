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

    await db.investment.create({
      data: {
        userId,
        amountInvested: purchaseValue,
        btcAmount: amount,
        btcPriceAtPurchase: Number(btc.buy),
      },
    })

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
export async function getInvestmentPosition(userId: string) {
  const investments = await db.investment.findMany({
    where: { userId },
  })

  if (investments.length === 0) {
    return []
  }

  const currentBTC = await fetchTickerData()
  const currentBTCPrice = Number(currentBTC.last)

  return investments.map((investment) => {
    const priceVariation =
      ((currentBTCPrice - investment.btcPriceAtPurchase) /
        investment.btcPriceAtPurchase) *
      100

    const currentGrossValue = investment.btcAmount * currentBTCPrice

    return {
      id: investment.id,
      purchaseDate: investment.purchaseDate,
      amountInvested: investment.amountInvested,
      btcPriceAtPurchase: investment.btcPriceAtPurchase,
      priceVariation,
      currentGrossValue,
    }
  })
}
