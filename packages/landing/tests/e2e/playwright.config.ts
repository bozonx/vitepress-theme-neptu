import { defineConfig, devices } from '@playwright/test'

const previewCmd =
  'npm run preview -w vitepress-theme-neptu-landing-example -- --port 4174 --host 127.0.0.1'
// On CI the landing example is already built by a separate workflow step;
// locally we build first to ensure the preview server has content to serve.
const webServerCommand = `npm run build -w vitepress-theme-neptu-landing-example && ${previewCmd}`

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4174/vitepress-theme-neptu/landing/',
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
    url: 'http://127.0.0.1:4174/vitepress-theme-neptu/landing/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
