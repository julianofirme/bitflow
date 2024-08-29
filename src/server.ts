/* eslint-disable @typescript-eslint/no-misused-promises */
import app from './app.js'
import process from 'process'
import { logger } from './logger/logger.js'

const PORT = 3000

async function main() {
  try {
    app.listen({
      port: PORT,
      host: '0.0.0.0',
    })
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }

  const shutdown = async () => {
    logger.info('Shutting down gracefully...')
    try {
      await app.close()
      logger.info('Server closed')
    } catch (err) {
      logger.error('Error during shutdown', err)
    }
    process.exit(0)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

main()
