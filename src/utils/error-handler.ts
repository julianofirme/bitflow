import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from '../errors/bad-request-error.js'
import { UnauthorizedError } from '../errors/unauthorized-error.js'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.log('🚀 ~ error:', error)
  const logger = request.log

  if (error instanceof ZodError) {
    logger.error(error)
    reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    logger.error(error)
    reply.status(400).send({
      error: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    logger.error(error)
    reply.status(401).send({
      error: error.message,
    })
  }

  logger.error(error)

  reply.status(500).send({ message: 'Internal server error' })
}
