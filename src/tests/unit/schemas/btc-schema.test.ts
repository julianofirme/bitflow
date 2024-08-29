import { describe, it, expect } from 'vitest'
import { models } from '../../../modules/btc/btc.schema.js'

const { priceSchema } = models

describe('BTC Schemas', () => {
  describe('priceSchema', () => {
    it('should validate a correct price input', () => {
      const validInput = {
        buy: '50000',
        sell: '49000',
        open: '49500',
      }

      const result = priceSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate a price input with missing fields', () => {
      const invalidInput = {
        buy: '50000',
        sell: '49000',
      }

      const result = priceSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })

    it('should invalidate a price input with non-string values', () => {
      const invalidInput = {
        buy: 50000,
        sell: 49000,
        open: 49500,
      }

      const result = priceSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe(
        'Expected string, received number',
      )
    })
  })
})
