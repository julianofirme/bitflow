import { type FastifyInstance } from 'fastify'
import { getUserBalanceHandler, depositHandler } from './wallet.controller.js'
import { auth } from '../../middleware/auth.js'
import { $ref } from './wallet.schema.js'

async function walletRoutes(server: FastifyInstance) {
  server.register(auth).get('/account/balance', getUserBalanceHandler)
  server.register(auth).post(
    '/account/deposit',
    {
      schema: {
        body: $ref('depositSchema'),
      },
    },
    depositHandler,
  )
}

export default walletRoutes
