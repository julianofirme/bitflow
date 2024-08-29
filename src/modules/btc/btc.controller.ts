import { type FastifyRequest, type FastifyReply } from 'fastify'
import { fetchTickerData } from '../../integration/btc.api.js'
import { logger } from '../../logger/logger.js'

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
