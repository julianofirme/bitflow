import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type LoginInput, type CreateUserInput } from './user.schema.js'
import {
  createUserWithWalletService,
  findUserByEmailService,
} from './user.service.js'
import { verifyPassword } from '../../utils/hash.js'

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body
  const logger = request.log

  try {
    logger.info(`Registering new user with email: ${body.email}`)
    const { user, wallet } = await createUserWithWalletService(body)

    logger.info(`User registered successfully with ID: ${user.id}`)
    logger.info(`User wallet successfully created with ID: ${wallet.id}`)
    return reply.code(201).send(user)
  } catch (e) {
    logger.error(`Error registering user: ${(e as Error).message}`)
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body
  const logger = request.log

  try {
    logger.info(`User attempting login with email: ${body.email}`)
    const user = await findUserByEmailService(body.email)

    if (!user) {
      logger.warn(`Failed login attempt with non-existent email: ${body.email}`)
      return reply.code(401).send({
        message: 'Invalid email or password',
      })
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
      return reply.status(401).send({
        message: 'Invalid password',
      })
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
  } catch (e) {
    logger.error(`Error during login: ${(e as Error).message}`)
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
}
