import { type FastifyInstance } from 'fastify'
import { auth } from '../../middleware/auth.js'
import { $ref } from './btc.schema.js'
import { priceBTCHandler } from './btc.controller.js'

async function btcRoutes(server: FastifyInstance) {
  server.register(auth).get(
    '/btc/price',
    {
      schema: {
        response: {
          200: $ref('priceSchema'),
        },
      },
    },
    priceBTCHandler,
  )
}

export default btcRoutes
