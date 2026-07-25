import { defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'

const landingSrc = path.resolve(__dirname, './src')

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    pool: 'threads',
    testTimeout: 10_000,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/configs/siteLocalesBase/**',
      ],
    },
  },
  resolve: {
    alias: {
      'vitepress-theme-neptu-landing': `${landingSrc}/index.ts`,
      'vitepress-theme-neptu-landing/*': `${landingSrc}/*`,
    },
  },
})


