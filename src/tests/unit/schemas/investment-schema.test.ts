import { describe, it, expect } from 'vitest'
import { models } from '../../../modules/investment/investment.schema.js'

const { exchangeSchema, sellSchema, priceSchema } = models

describe('Investment Schemas', () => {
  describe('exchangeSchema', () => {
    it('should validate a correct exchange input', () => {
      const validInput = {
        amount: 100,
      }

      const result = exchangeSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate an exchange input with a missing amount', () => {
      const invalidInput = {}

      const result = exchangeSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Amount is required')
    })

    it('should invalidate an exchange input with a negative amount', () => {
      const invalidInput = {
        amount: -100,
      }

      const result = exchangeSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Number must be greater than or equal to 0',
      )
    })
  })

  describe('sellSchema', () => {
    it('should validate a correct sell input', () => {
      const validInput = {
        amount: 50,
        position: 'some-position-id',
      }

      const result = sellSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate a sell input with a missing amount', () => {
      const invalidInput = {
        position: 'some-position-id',
      }

      const result = sellSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Amount is required')
    })

    it('should invalidate a sell input with a missing position', () => {
      const invalidInput = {
        amount: 50,
      }

      const result = sellSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })

    it('should invalidate a sell input with a negative amount', () => {
      const invalidInput = {
        amount: -50,
        position: 'some-position-id',
      }

      const result = sellSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Number must be greater than or equal to 0',
      )
    })
  })

  describe('priceSchema', () => {
    it('should validate a correct price input', () => {
      const validInput = {
        buy: '10000',
        sell: '9000',
        open: '9500',
      }

      const result = priceSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate a price input with missing fields', () => {
      const invalidInput = {
        buy: '10000',
        sell: '9000',
      }

      const result = priceSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })

    it('should invalidate a price input with non-string values', () => {
      const invalidInput = {
        buy: 10000,
        sell: 9000,
        open: 9500,
      }

      const result = priceSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Expected string, received number',
      )
    })
  })
})
