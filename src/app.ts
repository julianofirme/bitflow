import fastify from 'fastify'

const PORT = 3000

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})

server.get('/healthcheck', async function () {
  return {
    status: 'OK',
  }
})

async function main() {
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
