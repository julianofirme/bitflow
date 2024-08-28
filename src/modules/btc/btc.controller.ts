import { type FastifyRequest, type FastifyReply } from 'fastify'
import { queueOrder } from './btc.queue.js'

export async function purchaseBTCHandler(
  request: FastifyRequest<{
    Body: { amount: number }
  }>,
  reply: FastifyReply,
) {
  const logger = request.log
  const userId = await request.getCurrentUserId()
  const { amount } = request.body

  try {
    await queueOrder('buy', amount, userId)
    logger.info(`Order for ${amount} BTC from user ${userId} has been queued`)
    return reply
      .code(202)
      .send({ message: 'Purchase request accepted and is being processed.' })
  } catch (error) {
    logger.error(`Error queuing order: ${(error as Error).message}`)
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
}
