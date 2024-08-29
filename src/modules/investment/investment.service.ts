import { type Investment, type Wallet } from '@prisma/client'
import { BadRequestError } from '../../errors/bad-request-error.js'
import { NotFoundError } from '../../errors/not-found-error.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { db } from '../../lib/prisma.js'
import { sendMail } from '../../integration/mail.js'
import { logger } from '../../logger/logger.js'
import { findUserByIdService } from '../user/user.service.js'

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
  const user = await findUserByIdService(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }
  if (!wallet) throw new NotFoundError('Wallet not found')

  await validatePurchase(wallet, btc, amount)

  const purchaseValue = Number(btc.buy) * amount

  const investmnent = await db.investment.create({
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

  await sendMail(
    {
      body: `Hi ${user.name}, the value of ${amount} BTC for ${purchaseValue.toFixed(2)} BRL has been purchase!`,
      subject: 'BTC Purchase',
      to: user.email,
    },
    userId,
  )

  logger.info(
    `Purchase of ${amount} BTC from investment ${investmnent.id} for user ${userId} has been processed`,
  )

  return investmnent
}

export async function processSale(
  userId: string,
  position: string,
  amount: number,
) {
  const wallet = await db.wallet.findFirst({ where: { userId } })
  const btc = await fetchTickerData()
  const user = await findUserByIdService(userId)
  const investment = await db.investment.findFirst({
    where: { id: position, userId },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }
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

  await sendMail(
    {
      body: `Hi ${user.name}, the value of ${amount} BTC has been sold for ${saleValue.toFixed(2)}!`,
      subject: 'BTC Sold',
      to: user.email,
    },
    userId,
  )

  logger.info(
    `Sale of ${amount} BTC from investment ${position} for user ${userId} has been processed`,
  )

  return saleValue
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
