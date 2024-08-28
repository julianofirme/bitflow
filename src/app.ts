/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fastify from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import 'dotenv/config'
import userRoutes from './modules/user/user.route.js'
import walletRoutes from './modules/wallet/wallet.route.js'
import { userSchemas } from './modules/user/user.schema.js'
import { walletSchemas } from './modules/wallet/wallet.schema.js'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})

app.register(fjwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

app.get('/healthcheck', async function () {
  return {
    status: 'ok',
  }
})

app.register(userRoutes)
app.register(walletRoutes)

for (const schema of [...userSchemas, ...walletSchemas]) {
  app.addSchema(schema)
}

export default app
