import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const exchangeSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
})

const priceSchema = z.object({
  buy: z.string(),
  sell: z.string(),
  open: z.string(),
})

export const investmentPositionSchema = z.object({
  id: z.string(),
  purchaseDate: z.string(),
  amountInvested: z.string(),
  btcPriceAtPurchase: z.string(),
  priceVariation: z.string(),
  currentGrossValue: z.string(),
})

export type ExchangeInput = z.infer<typeof exchangeSchema>

const models = {
  exchangeSchema,
  priceSchema,
  investmentPositionSchema,
}

export const { schemas: exchangeSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'btcSchema',
})
