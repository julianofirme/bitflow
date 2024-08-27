import { type FastifyReply, type FastifyRequest } from 'fastify'
import { getUserWalletBalance, deposit } from './wallet.service.js'
import { type DepositInput } from './wallet.schema.js'

export async function getUserBalanceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = await request.getCurrentUserId()

    const balance = await getUserWalletBalance(userId)

    return balance
  } catch (e) {
    return await reply.code(500).send(e)
  }
}

export async function depositHandler(
  request: FastifyRequest<{
    Body: DepositInput
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.getCurrentUserId()
    const { amount } = request.body

    const wallet = await deposit(amount, userId)

    return wallet
  } catch (e) {
    return await reply.code(500).send(e)
  }
}
