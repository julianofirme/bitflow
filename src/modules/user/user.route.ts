import { type FastifyInstance } from 'fastify'
import { loginHandler, registerUserHandler } from './user.controller.js'
import { $ref } from './user.schema.js'

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/account',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  )

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler,
  )
}

export default userRoutes
