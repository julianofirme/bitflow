import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userBalanceResponseSchema = z.object({
  amount: z.number(),
})

const depositSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
})

export type DepositInput = z.infer<typeof depositSchema>

const models = {
  userBalanceResponseSchema,
  depositSchema,
}

export const { schemas: walletSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'Wallet',
})
