import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userBalanceResponseSchema = z.object({
  amount: z.number(),
})

export const { schemas: walletSchemas, $ref } = buildJsonSchemas({
  userBalanceResponseSchema,
})
