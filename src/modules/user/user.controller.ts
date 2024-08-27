import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type CreateUserInput } from './user.schema.js'
import { createUser } from './user.service.js'

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
