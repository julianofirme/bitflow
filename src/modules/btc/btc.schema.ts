import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const purchaseSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .nonnegative(),
})

export type PurchaseInput = z.infer<typeof purchaseSchema>

const models = {
  purchaseSchema,
}

export const { schemas: purchaseSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'btcSchema',
})
