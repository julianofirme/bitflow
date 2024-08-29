/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, vitest } from 'vitest'
import { errorHandler } from '../../../utils/error-handler.js'
import { BadRequestError } from '../../../errors/bad-request-error.js'
import { NotFoundError } from '../../../errors/not-found-error.js'
import { UnauthorizedError } from '../../../errors/unauthorized-error.js'
import { type FastifyError } from 'fastify'

describe('Error Handler', () => {
  const mockRequest = {
    log: {
      error: vitest.fn(), // Mocking the logger
    },
  } as any

  const mockReply = {
    status: vitest.fn().mockReturnThis(),
    send: vitest.fn(),
  } as any

  it('should handle validation errors correctly', () => {
    const validationError = new Error('Validation failed') as FastifyError
    validationError.code = 'FST_ERR_VALIDATION'

    errorHandler(validationError, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Validation error' })
  })

  it('should handle BadRequestError correctly', () => {
    const badRequestError = new BadRequestError(
      'Bad request error',
    ) as FastifyError

    errorHandler(badRequestError, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Bad request error' })
  })

  it('should handle UnauthorizedError correctly', () => {
    const unauthorizedError = new UnauthorizedError(
      'Unauthorized error',
    ) as FastifyError

    errorHandler(unauthorizedError, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(401)
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized error' })
  })

  it('should handle NotFoundError correctly', () => {
    const notFoundError = new NotFoundError('Not found error') as FastifyError

    errorHandler(notFoundError, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(404)
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Not found error' })
  })

  it('should handle unexpected errors correctly', () => {
    const unexpectedError = new Error('Unexpected error') as FastifyError

    errorHandler(unexpectedError, mockRequest, mockReply)

    expect(mockReply.status).toHaveBeenCalledWith(500)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Internal server error',
    })
  })
})
