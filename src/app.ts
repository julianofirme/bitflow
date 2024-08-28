/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fastify from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import 'dotenv/config'
import userRoutes from './modules/user/user.route.js'
import walletRoutes from './modules/wallet/wallet.route.js'
import { userSchemas } from './modules/user/user.schema.js'
import { walletSchemas } from './modules/wallet/wallet.schema.js'
import { errorHandler } from './utils/error-handler.js'
import { purchaseSchemas } from './modules/btc/btc.schema.js'
import btcRoutes from './modules/btc/btc.route.js'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})
app.setErrorHandler(errorHandler)

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
app.register(btcRoutes)

for (const schema of [...userSchemas, ...walletSchemas, ...purchaseSchemas]) {
  app.addSchema(schema)
}

export default app
