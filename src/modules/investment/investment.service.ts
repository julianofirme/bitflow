import { type Investment, type Wallet } from '@prisma/client'
import { BadRequestError } from '../../errors/bad-request-error.js'
import { NotFoundError } from '../../errors/not-found-error.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { db } from '../../lib/prisma.js'

async function validatePurchase(wallet: Wallet, btc: any, amount: number) {
  const purchaseValue = Number(btc.buy) * amount

  if (wallet.amount < purchaseValue) {
    throw new BadRequestError('Insufficient funds')
  }
}

async function validateSale(
  wallet: Wallet,
  investment: Investment,
  amount: number,
) {
  if (wallet.amount_btc < amount) {
    throw new BadRequestError('Insufficient BTC balance in wallet to sell')
  }

  if (investment.btcAmount < amount) {
    throw new BadRequestError('Insufficient BTC balance in investment to sell')
  }
}

export async function processPurchase(userId: string, amount: number) {
  const wallet = await db.wallet.findFirst({ where: { userId } })
  const btc = await fetchTickerData()

  if (!wallet) throw new NotFoundError('Wallet not found')

  await validatePurchase(wallet, btc, amount)

  const purchaseValue = Number(btc.buy) * amount

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
    data: {
      amount: { decrement: purchaseValue },
      amount_btc: { increment: amount },
    },
  })
}

export async function processSale(
  userId: string,
  investmentId: string,
  amount: number,
) {
  const wallet = await db.wallet.findFirst({ where: { userId } })
  const investment = await db.investment.findFirst({
    where: { id: investmentId, userId },
  })
  const btc = await fetchTickerData()

  if (!wallet) throw new NotFoundError('Wallet not found')
  if (!investment) throw new NotFoundError('Investment not found')

  await validateSale(wallet, investment, amount)

  const saleValue = Number(btc.sell) * amount
  const remainingBTC = investment.btcAmount - amount

  await db.$transaction(async (transaction) => {
    await transaction.wallet.update({
      where: { id: wallet.id },
      data: {
        amount: { increment: saleValue },
        amount_btc: { decrement: amount },
      },
    })

    if (remainingBTC === 0) {
      await transaction.investment.delete({
        where: { id: investment.id },
      })
    }

    const remainingInvestmentValue =
      remainingBTC * investment.btcPriceAtPurchase

    await transaction.investment.update({
      where: { id: investment.id },
      data: {
        btcAmount: remainingBTC,
        amountInvested: remainingInvestmentValue,
      },
    })
  })

  console.log(
    `Sale of ${amount} BTC from investment ${investmentId} for user ${userId} has been processed`,
  )
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
