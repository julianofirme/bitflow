import { type FastifyReply, type FastifyRequest } from 'fastify'
import { getUserWalletBalance, deposit } from './wallet.service.js'
import { type DepositInput } from './wallet.schema.js'
import { sendMail } from '../../service/mail.js'
import { findUserById } from '../user/user.service.js'

export async function getUserBalanceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const logger = request.log

  try {
    const userId = await request.getCurrentUserId()
    logger.info(`Fetching wallet balance for user ${userId}`)

    const balance = await getUserWalletBalance(userId)

    logger.info(`Fetched balance: ${balance?.amount} for user ${userId}`)
    return balance
  } catch (e) {
    logger.error(`Error fetching balance: ${(e as Error).message}`)
    return await reply.code(500).send({ error: 'Internal Server Error' })
  }
}

export async function depositHandler(
  request: FastifyRequest<{
    Body: DepositInput
  }>,
  reply: FastifyReply,
) {
  const logger = request.log

  try {
    const userId = await request.getCurrentUserId()
    const user = await findUserById(userId)

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    const { amount } = request.body
    logger.info(`User ${userId} attempting to deposit ${amount} reais`)

    const wallet = await deposit(amount, userId)

    logger.info(`User ${userId} deposited ${amount} reais successfully`)
    const { data, error } = await sendMail({
      body: `Hi ${user?.name}, the value of ${amount} reais has been deposited in your account!`,
      subject: 'Deposit',
      to: user?.email,
    })

    if (error) {
      logger.error(`Error to send email: ${error.message}`)
    }

    logger.info(
      `Email ID: ${data?.id} - Deposit email was send to user ${userId}`,
    )

    return wallet
  } catch (e) {
    logger.error(`Error depositing amount: ${(e as Error).message}`)
    return await reply.code(500).send({ error: 'Internal Server Error' })
  }
}
