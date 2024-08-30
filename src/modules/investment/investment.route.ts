import { type FastifyInstance } from 'fastify'
import { auth } from '../../middleware/auth.js'
import {
  buyOrderHandler,
  getInvestmentPositionHandler,
  sellOrderHandler,
} from './investment.controller.js'
import { $ref } from './investment.schema.js'

export async function investmentRoutes(server: FastifyInstance) {
  server.register(auth).get(
    '/btc',
    {
      schema: {
        response: {
          200: $ref('investmentPositionSchema'),
        },
      },
    },
    getInvestmentPositionHandler,
  )
  server.register(auth).post(
    '/btc/purchase',
    {
      schema: {
        body: $ref('exchangeSchema'),
      },
    },
    buyOrderHandler,
  )
  server.register(auth).post(
    '/btc/sell',
    {
      schema: {
        body: $ref('sellSchema'),
      },
    },
    sellOrderHandler,
  )
}
