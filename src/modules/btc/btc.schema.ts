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

export type ExchangeInput = z.infer<typeof exchangeSchema>

const models = {
  exchangeSchema,
  priceSchema,
}

export const { schemas: exchangeSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'btcSchema',
})
