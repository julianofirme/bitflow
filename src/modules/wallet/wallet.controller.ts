import { type FastifyRequest } from 'fastify'
import { getUserBalance } from './wallet.service.js'

export async function getUserBalanceHandler(request: FastifyRequest) {
  const userId = await request.getCurrentUserId()

  const wallet = await getUserBalance(userId)

  return wallet
}
