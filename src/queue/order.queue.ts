import Bull from 'bull'
import { logger } from '../logger/logger.js'
import {
  processPurchase,
  processSale,
} from '../modules/investment/investment.service.js'

interface JobDataProps {
  type: 'buy' | 'sell'
  amount: number
  userId: string
  investmentId: string
}

export const orderQueue = new Bull('order-queue', {
  redis: { host: '127.0.0.1', port: 6379 },
})

orderQueue.process(async (job: { data: JobDataProps }) => {
  const { type, amount, userId, investmentId } = job.data

  if (type === 'buy') {
    await processPurchase(userId, amount)
  } else if (type === 'sell') {
    await processSale(userId, investmentId, amount)
  }
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
