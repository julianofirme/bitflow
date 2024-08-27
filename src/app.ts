/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fastify from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import userRoutes from './modules/user/user.route.js'
import { userSchemas } from './modules/user/user.schema.js'

const PORT = 3000

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})

server.register(fjwt, {
  secret: process.env.JWT_SECRET!,
})

server.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

server.get('/healthcheck', async function () {
  return {
    status: 'OK',
  }
})

async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema)
  }

  server.register(userRoutes)

  try {
    await server.listen({
      port: PORT,
      host: '0.0.0.0',
    })
  } catch (e) {
    server.log.error(e)
    process.exit(1)
  }
}

main()
