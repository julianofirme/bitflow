import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const investmentPositionSchema = z.object({
  id: z.string(),
  purchaseDate: z.string(),
  amountInvested: z.string(),
  btcPriceAtPurchase: z.string(),
  priceVariation: z.string(),
  currentGrossValue: z.string(),
})

const exchangeSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
})

const sellSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
  investmentId: z.string(),
})

const priceSchema = z.object({
  buy: z.string(),
  sell: z.string(),
  open: z.string(),
})

export type ExchangeInput = z.infer<typeof exchangeSchema>
export type SellInput = z.infer<typeof sellSchema>

const models = {
  exchangeSchema,
  sellSchema,
  priceSchema,
}

export const { schemas: investmentSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'investmentSchema',
})
