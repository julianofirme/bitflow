import { describe, it, expect } from 'vitest'
import { models } from '../../../modules/wallet/wallet.schema.js'

const { userBalanceResponseSchema, depositSchema } = models

describe('Wallet Schemas', () => {
  describe('userBalanceResponseSchema', () => {
    it('should validate a correct balance response', () => {
      const validResponse = {
        amount: 100,
      }

      const result = userBalanceResponseSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it('should invalidate a response with a missing amount', () => {
      const invalidResponse = {}

      const result = userBalanceResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })

    it('should invalidate a response with a non-numeric amount', () => {
      const invalidResponse = {
        amount: 'not-a-number',
      }

      const result = userBalanceResponseSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Expected number, received string',
      )
    })
  })

  describe('depositSchema', () => {
    it('should validate a correct deposit input', () => {
      const validInput = {
        amount: 50,
      }

      const result = depositSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate a deposit input with a missing amount', () => {
      const invalidInput = {}

      const result = depositSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Amount is required')
    })

    it('should invalidate a deposit input with a negative amount', () => {
      const invalidInput = {
        amount: -50,
      }

      const result = depositSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Number must be greater than or equal to 0',
      )
    })

    it('should invalidate a deposit input with a non-numeric amount', () => {
      const invalidInput = {
        amount: 'not-a-number',
      }

      const result = depositSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Expected number, received string',
      )
    })
  })
})
