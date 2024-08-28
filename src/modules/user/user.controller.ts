import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type LoginInput, type CreateUserInput } from './user.schema.js'
import {
  createUserWithWalletService,
  findUserByEmailService,
} from './user.service.js'
import { verifyPassword } from '../../utils/hash.js'
import { UnauthorizedError } from '../../errors/unauthorized-error.js'

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body
  const logger = request.log

  logger.info(`Registering new user with email: ${body.email}`)
  const { user, wallet } = await createUserWithWalletService(body)

  logger.info(`User registered successfully with ID: ${user.id}`)
  logger.info(`User wallet successfully created with ID: ${wallet.id}`)
  return reply.code(201).send(user)
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body
  const logger = request.log

  logger.info(`User attempting login with email: ${body.email}`)
  const user = await findUserByEmailService(body.email)

  if (!user) {
    logger.warn(`Failed login attempt with non-existent email: ${body.email}`)
    throw new UnauthorizedError('Invalid email or password')
  }

  const isValidPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.passwordHash,
  })

  if (!isValidPassword) {
    logger.warn(
      `Failed login attempt for user ID: ${user.id} with invalid password`,
    )

    throw new UnauthorizedError('Invalid email or password')
  }

  const token = await reply.jwtSign(
    {
      sub: user.id,
    },
    {
      sign: {
        expiresIn: '7d',
      },
    },
  )

  logger.info(`User logged in successfully with ID: ${user.id}`)
  return reply.status(201).send({ token })
}
