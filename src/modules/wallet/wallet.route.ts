import { type FastifyInstance } from 'fastify'
import { getUserBalanceHandler } from './wallet.controller.js'
import { auth } from '../../middleware/auth.js'

async function walletRoutes(server: FastifyInstance) {
  server.register(auth).get('/account/wallet', getUserBalanceHandler)
}

export default walletRoutes
