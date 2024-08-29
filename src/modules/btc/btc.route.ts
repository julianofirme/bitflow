import { type FastifyInstance } from 'fastify'
import { auth } from '../../middleware/auth.js'
import { $ref } from './btc.schema.js'
import {
  purchaseBTCHandler,
  sellBTCHandler,
  priceBTCHandler,
} from './btc.controller.js'

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
  server.register(auth).post(
    '/btc/purchase',
    {
      schema: {
        body: $ref('exchangeSchema'),
      },
    },
    purchaseBTCHandler,
  )
  server.register(auth).post(
    '/btc/sell',
    {
      schema: {
        body: $ref('exchangeSchema'),
      },
    },
    sellBTCHandler,
  )
}

export default btcRoutes
