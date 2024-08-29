import { NotFoundError } from '../../errors/not-found-error.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { db } from '../../lib/prisma.js'
import { sendMail } from '../../integration/mail.js'
import { logger } from '../../logger/logger.js'
import { findUserByIdService } from '../user/user.service.js'
import {
  validatePurchase,
  validateSale,
} from '../../utils/wallet-validations.js'
import { type User } from '@prisma/client'

async function getUserBasicInfo(userId: string) {
  const [wallet, btc, user] = await Promise.all([
    db.wallet.findFirst({ where: { userId } }),
    fetchTickerData(),
    findUserByIdService(userId),
  ])

  if (!user) {
    throw new NotFoundError('User not found')
  }
  if (!wallet) {
    throw new NotFoundError('Wallet not found')
  }

  return { wallet, btc, user }
}

async function sendPurchaseMail(
  user: User,
  amount: number,
  purchaseValue: number,
) {
  await sendMail({
    body: `Hi ${user.name}, the value of ${amount} BTC for ${purchaseValue.toFixed(2)} BRL has been purchased!`,
    subject: 'BTC Purchase',
    to: user.email,
  })
}

async function sendSaleMail(user: User, amount: number, saleValue: number) {
  await sendMail({
    body: `Hi ${user.name}, the value of ${amount} BTC has been sold for ${saleValue.toFixed(2)}!`,
    subject: 'BTC Sold',
    to: user.email,
  })
}

export async function processPurchase(userId: string, amount: number) {
  const { user, btc, wallet } = await getUserBasicInfo(userId)
  await validatePurchase(wallet, btc, amount)

  const purchaseValue = Number(btc.buy) * amount

  const investment = await db.investment.create({
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

  await sendPurchaseMail(user, amount, purchaseValue)

  logger.info(
    `Purchase of ${amount} BTC from investment ${investment.id} for user ${userId} has been processed`,
  )

  return investment
}

export async function processSale(
  userId: string,
  position: string,
  amount: number,
) {
  const { user, btc, wallet } = await getUserBasicInfo(userId)

  const investment = await db.investment.findFirst({
    where: { id: position, userId },
  })

  if (!investment) {
    throw new NotFoundError('Investment not found')
  }

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
    } else {
      const remainingInvestmentValue =
        remainingBTC * investment.btcPriceAtPurchase
      await transaction.investment.update({
        where: { id: investment.id },
        data: {
          btcAmount: remainingBTC,
          amountInvested: remainingInvestmentValue,
        },
      })
    }
  })

  await sendSaleMail(user, amount, saleValue)

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
      btcAmount: investment.btcAmount,
    }
  })
}
