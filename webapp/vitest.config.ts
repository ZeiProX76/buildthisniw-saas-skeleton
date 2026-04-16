import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    },
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'tests/e2e'],
    coverage: {
      provider: 'v8',
      include: ['features/**', 'lib/**', 'components/**'],
      exclude: ['**/*.test.*', '**/*.d.ts', 'tests/**'],
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
  },
})
