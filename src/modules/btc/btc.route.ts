import { type FastifyInstance } from 'fastify'
import { auth } from '../../middleware/auth.js'
import { $ref } from './btc.schema.js'
import { purchaseBTCHandler } from './btc.controller.js'

async function btcRoutes(server: FastifyInstance) {
  server.register(auth).post(
    '/btc/purchase',
    {
      schema: {
        body: $ref('purchaseSchema'),
      },
    },
    purchaseBTCHandler,
  )
}

export default btcRoutes
