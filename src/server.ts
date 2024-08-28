import app from './app.js'
const PORT = 3000

async function main() {
  try {
    await app.listen({
      port: PORT,
      host: '0.0.0.0',
    })
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}

main()
