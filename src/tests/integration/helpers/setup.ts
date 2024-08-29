import resetDb from './reset-db.js'
import { beforeEach } from 'vitest'

beforeEach(async () => {
  await resetDb()
})
