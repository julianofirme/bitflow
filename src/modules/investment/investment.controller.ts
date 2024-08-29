import { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  getInvestmentPosition,
  processPurchase,
  processSale,
} from './investment.service.js'
import { type SellInput, type ExchangeInput } from './investment.schema.js'
import { sendMail } from '../../integration/mail.js'
import { findUserByIdService } from '../user/user.service.js'
import { NotFoundError } from '../../errors/not-found-error.js'

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
  const user = await findUserByIdService(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  await processPurchase(userId, amount)
  await sendMail(
    {
      body: `Hi ${user.name}, the value of ${amount} BTC has been purchase!`,
      subject: 'BTC Purchase',
      to: user.email,
    },
    userId,
  )
  return reply.status(200).send({ message: 'Buy order processed successfully' })
}

export async function sellOrderHandler(
  request: FastifyRequest<{
    Body: SellInput
  }>,
  reply: FastifyReply,
) {
  const { amount, position } = request.body
  const userId = await request.getCurrentUserId()
  const user = await findUserByIdService(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  await processSale(userId, position, amount)
  await sendMail(
    {
      body: `Hi ${user.name}, the value of ${amount} BTC has been sold!`,
      subject: 'BTC Sold',
      to: user.email,
    },
    userId,
  )
  return reply
    .status(200)
    .send({ message: 'Sell order processed successfully' })
}
