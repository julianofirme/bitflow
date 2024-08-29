import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const priceSchema = z.object({
  buy: z.string(),
  sell: z.string(),
  open: z.string(),
})

export const models = {
  priceSchema,
}

export const { schemas: btcSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'BTC',
})
