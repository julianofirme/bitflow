import { type FastifyReply, type FastifyRequest } from 'fastify'
import { getInvestmentPosition } from './investment.service.js'
import { queueOrder } from './investment.queue.js'
import { type SellInput, type ExchangeInput } from './investment.schema.js'

export async function getInvestmentPositionHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId()

  const investments = await getInvestmentPosition(userId)
  return reply.code(200).send(investments)
}

export async function buyOrderHandler(
  request: FastifyRequest<{
    Body: ExchangeInput
  }>,
  reply: FastifyReply,
) {
  const { amount } = request.body
  const userId = await request.getCurrentUserId()

  await queueOrder('buy', amount, userId)
  return reply.status(200).send({ message: 'Buy order queued successfully' })
}

export async function sellOrderHandler(
  request: FastifyRequest<{
    Body: SellInput
  }>,
  reply: FastifyReply,
) {
  const { amount, investmentId } = request.body
  const userId = await request.getCurrentUserId()

  await queueOrder('sell', amount, userId, investmentId)
  return reply.status(200).send({ message: 'Sell order queued successfully' })
}
