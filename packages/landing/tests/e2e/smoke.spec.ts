import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Home & i18n
// ---------------------------------------------------------------------------

test('home loads with correct lang and hero', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('h1')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.locator('h1')).toContainText('Neptu Landing')
})

test('root redirects to locale', async ({ page }) => {
  await page.goto('', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/en\//)
  expect(page.url()).toMatch(/\/en\//)
})

// ---------------------------------------------------------------------------
// Features section
// ---------------------------------------------------------------------------

test('features section renders with cards', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.features')
  const features = page.locator('.feature')
  await expect(features).toHaveCount(3)
  await expect(page.locator('.feature-title').first()).toContainText('SEO-first')
})

// ---------------------------------------------------------------------------
// Hero actions
// ---------------------------------------------------------------------------

test('hero actions contain links', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.actions')
  const actions = page.locator('.action')
  await expect(actions).toHaveCount(3)
  const firstLink = actions.first()
  await expect(firstLink).toHaveAttribute('href', /\/en\/doc\/about/)
})

// ---------------------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------------------

test('doc about page loads', async ({ page }) => {
  await page.goto('en/doc/about', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toBeVisible()
})

test('donate page loads', async ({ page }) => {
  await page.goto('en/page/donate', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toBeVisible()
})

test('links page loads', async ({ page }) => {
  await page.goto('en/page/links', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toBeVisible()
})

// ---------------------------------------------------------------------------
// Navigation & Locales
// ---------------------------------------------------------------------------

test('language switch navigates to ru', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const langBtn = page.locator('.switch-lang-btn').first()
  await expect(langBtn).toBeVisible()
  await langBtn.click()

  const ruLink = page.locator('.switch-lang-btn a[href*="ru"], a[href*="/ru/"]').first()
  await expect(ruLink).toBeVisible({ timeout: 5000 })
  await ruLink.click()

  await page.waitForURL(/\/ru\//)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru-RU')
})

// ---------------------------------------------------------------------------
// SEO meta
// ---------------------------------------------------------------------------

test('canonical link present', async ({ page }) => {
  await page.goto('en/doc/about', { waitUntil: 'domcontentloaded' })
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveAttribute('href', /doc\/about/)
})

test('alternate hreflang links present', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  const alternates = await page.locator('link[rel="alternate"]').all()
  expect(alternates.length).toBeGreaterThanOrEqual(1)
})
