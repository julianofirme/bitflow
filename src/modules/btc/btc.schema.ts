import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const exchangeSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
})

export type ExchangeInput = z.infer<typeof exchangeSchema>

const models = {
  exchangeSchema,
}

export const { schemas: exchangeSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'btcSchema',
})
