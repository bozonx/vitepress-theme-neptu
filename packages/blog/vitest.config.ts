import { defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    pool: 'threads',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**', 'docs/**', '.vitepress/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/generated/**',
        'src/configs/sharedLocalesBase/**',
        'src/configs/blogLocalesBase/**',
      ],
    },
  },
  resolve: {
    alias: {
      'vitepress-theme-neptu-blog': path.resolve(__dirname, './src/index.ts'),
      'vitepress-theme-neptu-blog/*': path.resolve(__dirname, './src/*'),
    },
  },
})
