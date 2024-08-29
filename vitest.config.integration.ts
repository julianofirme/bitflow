import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/tests/integration/**/*.test.ts'],
    setupFiles: ['src/tests/integration/helpers/setup.ts'],
  },
})
