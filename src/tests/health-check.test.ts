import { test, expect } from 'vitest'
import app from './integration/helpers/fastify.js'

test.only('GET /healthcheck should return status OK', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/healthcheck',
  })

  expect(response.statusCode).toBe(200)
  expect(response.json()).toEqual({ status: 'ok' })
})
