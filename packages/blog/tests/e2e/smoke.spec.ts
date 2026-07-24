import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Home & i18n
// ---------------------------------------------------------------------------

test('home loads with correct lang and hero', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('h1')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.locator('h1')).toContainText('Neptu Blog Theme')
})

test('root redirects to locale', async ({ page }) => {
  await page.goto('', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/en\//)
  expect(page.url()).toMatch(/\/en\//)
})

// ---------------------------------------------------------------------------
// Post list & pagination
// ---------------------------------------------------------------------------

test('recent posts page loads', async ({ page }) => {
  await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/Recent/)
  await expect(page.getByText('Full-Featured Post')).toBeVisible()
})

// ---------------------------------------------------------------------------
// Individual post
// ---------------------------------------------------------------------------

test('post page loads with content and JSON-LD', async ({ page }) => {
  await page.goto('en/post/full-featured', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toContainText('Full-Featured Post')

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
  expect(jsonLd).toBeTruthy()
  expect(jsonLd).toContain('BlogPosting')
})

// ---------------------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------------------

test('about page loads', async ({ page }) => {
  await page.goto('en/page/about', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toContainText('About This Demo')
})

// ---------------------------------------------------------------------------
// Taxonomy / archive pages
// ---------------------------------------------------------------------------

test('tags page loads', async ({ page }) => {
  await page.goto('en/tags/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/Tags/)
  await expect(page.locator('main').getByText('guide').first()).toBeVisible()
})

test('authors page loads', async ({ page }) => {
  await page.goto('en/authors/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/Authors/)
  await expect(page.getByText('Ivan K')).toBeVisible()
})

test('archive page loads', async ({ page }) => {
  await page.goto('en/archive/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/Date|Archive/)
  await expect(page.getByText('2025')).toBeVisible()
})

// ---------------------------------------------------------------------------
// SEO meta
// ---------------------------------------------------------------------------

test('canonical link present', async ({ page }) => {
  await page.goto('en/post/full-featured', { waitUntil: 'domcontentloaded' })
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveAttribute('href', /post\/full-featured/)
})

test('alternate hreflang links present', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  const alternates = await page.locator('link[rel="alternate"]').all()
  expect(alternates.length).toBeGreaterThanOrEqual(1)
})

test('RSS feed link in head', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  const rss = page.locator('link[type="application/rss+xml"]').first()
  await expect(rss).toHaveAttribute('href', /feed\.rss/)
})

// ---------------------------------------------------------------------------
// Feed files
// ---------------------------------------------------------------------------

test('RSS feed is valid XML', async ({ request }) => {
  const response = await request.get('en/feed.rss')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toContain('<rss')
  expect(body).toContain('<channel>')
})
