import { type FastifyReply, type FastifyRequest } from 'fastify'
import { getUserWalletBalance, deposit } from './wallet.service.js'
import { type DepositInput } from './wallet.schema.js'
import { sendMail } from '../../integration/mail.js'
import { findUserByIdService } from '../user/user.service.js'
import { NotFoundError } from '../../errors/not-found-error.js'

export async function getUserBalanceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const logger = request.log

  const userId = await request.getCurrentUserId()
  logger.info(`Fetching wallet balance for user ${userId}`)

  const balance = await getUserWalletBalance(userId)

  logger.info(`Fetched balance: ${balance?.amount} for user ${userId}`)
  return balance
}

export async function depositHandler(
  request: FastifyRequest<{
    Body: DepositInput
  }>,
  reply: FastifyReply,
) {
  const logger = request.log

  const userId = await request.getCurrentUserId()
  const user = await findUserByIdService(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const { amount } = request.body
  logger.info(`User ${userId} attempting to deposit ${amount} BRL`)

  const wallet = await deposit(amount, userId)

  logger.info(`User ${userId} deposited ${amount} BRL successfully`)

  await sendMail(
    {
      body: `Hi ${user.name}, the value of ${amount} BRL has been deposited in your account!`,
      subject: 'Deposit',
      to: user.email,
    },
    userId,
  )

  return await reply.code(200).send(wallet)
}
