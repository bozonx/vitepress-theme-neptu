import { defineConfig, devices } from '@playwright/test'

const previewCmd = 'npm run preview -w vitepress-theme-neptu-docs -- --port 4173 --host 127.0.0.1'
// CI builds the blog example in its own workflow step, so rebuilding here would
// just repeat several minutes of work. Locally there is no such step, so the
// build runs first to guarantee the preview server has something to serve.
const webServerCommand = process.env.CI
  ? previewCmd
  : `npm run build -w vitepress-theme-neptu-docs && ${previewCmd}`

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/vitepress-theme-neptu/blog/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: webServerCommand,
    url: 'http://127.0.0.1:4173/vitepress-theme-neptu/blog/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
