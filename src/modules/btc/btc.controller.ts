import { type FastifyRequest, type FastifyReply } from 'fastify'
import { queueOrder } from './btc.queue.js'
import { fetchTickerData } from '../../integration/btc.api.js'
import { logger } from '../../logger/logger.js'

export async function purchaseBTCHandler(
  request: FastifyRequest<{
    Body: { amount: number }
  }>,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId()
  const { amount } = request.body

  await queueOrder('buy', amount, userId)
  logger.info(
    `Order for purchase ${amount} BTC from user ${userId} has been queued`,
  )
  return reply
    .code(202)
    .send({ message: 'Purchase request accepted and is being processed.' })
}

export async function sellBTCHandler(
  request: FastifyRequest<{
    Body: { amount: number }
  }>,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId()
  const { amount } = request.body

  await queueOrder('sell', amount, userId)
  logger.info(
    `Order for sell ${amount} BTC from user ${userId} has been queued`,
  )
  return reply
    .code(202)
    .send({ message: 'Sell request accepted and is being processed.' })
}

export async function priceBTCHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentBTC = await fetchTickerData()

  logger.info('Current BTC price has been fetched successfully.')

  return reply.code(200).send({
    sell: currentBTC.sell,
    buy: currentBTC.buy,
    open: currentBTC.open,
  })
}
