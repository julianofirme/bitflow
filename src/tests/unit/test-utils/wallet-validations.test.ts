import { describe, expect, test } from 'vitest'
import { type Wallet, type Investment } from '@prisma/client'
import {
  validatePurchase,
  validateSale,
} from '../../../utils/wallet-validations.js'

const mockWallet: Wallet = {
  id: 'cf4c38f0-9772-4add-ab0c-603e619319ca',
  userId: 'cf4c38f0-9772-4add-ab0c-603e619319ca',
  amount: 10000,
  amount_btc: 0.5,
  createdAt: new Date(),
}

const mockInvestment: Investment = {
  id: 'cf4c38f0-9772-4add-ab0c-603e619319ca',
  userId: 'cf4c38f0-9772-4add-ab0c-603e619319ca',
  btcAmount: 0.3,
  purchaseDate: new Date(),
  amountInvested: 15000,
  btcPriceAtPurchase: 20000,
  createdAt: new Date(),
}

const mockBtcPrice = {
  buy: 100000, // R$ 100,000 = 1 BTC
}

describe('validatePurchase', () => {
  test('should throw error if funds are insufficient', () => {
    expect(async () =>
      validatePurchase(mockWallet, mockBtcPrice, 0.2),
    ).rejects.toThrowError(/^Insufficient funds$/)
  })

  test('should not throw error if funds are sufficient', () => {
    expect(async () =>
      validatePurchase(mockWallet, mockBtcPrice, 0.05),
    ).not.toThrowError()
  })
})

describe('validateSale', () => {
  test('should throw error if BTC balance in wallet is insufficient', () => {
    expect(async () =>
      validateSale(mockWallet, mockInvestment, 1),
    ).rejects.toThrowError(/^Insufficient BTC balance in wallet to sell$/)
  })

  test('should throw error if BTC balance in investment is insufficient', () => {
    expect(async () =>
      validateSale(mockWallet, mockInvestment, 0.4),
    ).rejects.toThrowError(/^Insufficient BTC balance in investment to sell$/)
  })

  test('should not throw error if BTC balance in wallet and investment are sufficient', () => {
    expect(async () =>
      validateSale(mockWallet, mockInvestment, 0.2),
    ).not.toThrowError()
  })
})
