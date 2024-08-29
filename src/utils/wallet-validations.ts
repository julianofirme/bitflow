import { type Investment, type Wallet } from '@prisma/client'
import { BadRequestError } from '../errors/bad-request-error.js'

export async function validatePurchase(
  wallet: Wallet,
  btc: any,
  amount: number,
) {
  const purchaseValue = Number(btc.buy) * amount

  if (wallet.amount < purchaseValue) {
    throw new BadRequestError('Insufficient funds')
  }
}

export async function validateSale(
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
