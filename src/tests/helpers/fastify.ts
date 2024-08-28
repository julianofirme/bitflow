import { beforeAll, afterAll } from 'vitest'
import app from '../../app.js'

beforeAll(async () => {
  await app.ready()
})
afterAll(async () => {
  await app.close()
})

export default app
