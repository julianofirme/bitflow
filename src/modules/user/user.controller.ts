import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type LoginInput, type CreateUserInput } from './user.schema.js'
import { createUser, findUserByEmail } from './user.service.js'
import { verifyPassword } from '../../utils/hash.js'

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body

  try {
    const user = await createUser(body)

    return await reply.code(201).send(user)
  } catch (e) {
    console.log(e)
    return await reply.code(500).send(e)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body

  const user = await findUserByEmail(body.email)

  if (!user) {
    return await reply.code(401).send({
      message: 'Invalid email or password',
    })
  }

  const isValidPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.passwordHash,
  })

  if (!isValidPassword) {
    return await reply.status(401).send({
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

  return await reply.status(201).send({ token })
}
