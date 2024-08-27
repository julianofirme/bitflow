import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userBalanceResponseSchema = z.object({
  amount: z.number(),
})

const depositSchema = z.object({
  amount: z.number().positive(),
})

export type DepositInput = z.infer<typeof depositSchema>

export const { schemas: walletSchemas, $ref } = buildJsonSchemas({
  userBalanceResponseSchema,
  depositSchema,
})
