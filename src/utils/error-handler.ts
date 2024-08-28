import type { FastifyInstance } from 'fastify'
import { BadRequestError } from '../errors/bad-request-error.js'
import { UnauthorizedError } from '../errors/unauthorized-error.js'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  const logger = request.log

  if (error.code === 'FST_ERR_VALIDATION') {
    logger.error(error)
    reply.status(400).send({
      error: 'Validation error',
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
