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
import { btcSchemas } from './modules/btc/btc.schema.js'
import btcRoutes from './modules/btc/btc.route.js'
import { investmentRoutes } from './modules/investment/investment.route.js'
import { investmentSchemas } from './modules/investment/investment.schema.js'
import fastifyHelmet from '@fastify/helmet'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

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

app.register(fastifyHelmet, { global: true })

app.get('/healthcheck', async function () {
  return {
    status: 'ok',
  }
})

app.register(userRoutes)
app.register(walletRoutes)
app.register(btcRoutes)
app.register(investmentRoutes)

app.register(fastifySwagger, {})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: false,
  transformStaticCSP: (header: any) => header,
})

app.ready((err) => {
  if (err) throw err
  app.swagger()
})

for (const schema of [
  ...userSchemas,
  ...walletSchemas,
  ...btcSchemas,
  ...investmentSchemas,
]) {
  app.addSchema(schema)
}

export default app
