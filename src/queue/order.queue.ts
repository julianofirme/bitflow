import Bull from 'bull'
import { db } from '../lib/prisma.js'
import { logger } from '../logger/logger.js'
import { fetchTickerData } from '../integration/btc.api.js'

export const orderQueue = new Bull('order-queue', {
  redis: { host: '127.0.0.1', port: 6379 },
})

orderQueue.process(async (job) => {
  const { type, amount, userId } = job.data

  const wallet = await db.wallet.findFirst({ where: { userId } })

  if (!wallet) {
    throw new Error('Wallet not found during order processing')
  }

  const currentBTC = await fetchTickerData()

  if (type === 'buy') {
    await db.wallet.update({
      where: { id: wallet.id },
      data: { amount_btc: { increment: amount } },
    })
    logger.info(
      `Purchase of ${amount} BTC for user ${userId} has been processed`,
    )
  }

  if (wallet.amount_btc < amount) {
    throw new Error(`Insufficient BTC balance to sell for user ${userId}`)
  }

  await db.$transaction(async (transaction) => {
    await transaction.wallet.update({
      where: { id: wallet.id },
      data: { amount_btc: { decrement: amount } },
    })
    await transaction.wallet.update({
      where: { id: wallet.id },
      data: { amount: { increment: amount * Number(currentBTC.sell) } },
    })
  })
  logger.info(`Sale of ${amount} BTC for user ${userId} has been processed`)
})

orderQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`)
})

orderQueue.on('failed', (job, error) => {
  logger.error(`Job ${job.id} failed with error: ${error.message}`)
})

orderQueue.on('active', (job) => {
  logger.info(`Processing job ${job.id}...`)
})

orderQueue.on('waiting', (jobId) => {
  logger.info(`Job ${jobId} is waiting to be processed`)
})

orderQueue.on('stalled', (job) => {
  logger.warn(`Job ${job.id} stalled and will be retried`)
})
