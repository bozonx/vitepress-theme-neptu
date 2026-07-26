import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Home & i18n
// ---------------------------------------------------------------------------

test('home loads with correct lang and hero', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('h1')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.locator('h1')).toContainText('blocks')
})

test('root redirects to locale', async ({ page }) => {
  await page.goto('', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/en\//)
  expect(page.url()).toMatch(/\/en\//)
})

test('russian home is rendered from the declarative blocks array', async ({ page }) => {
  await page.goto('ru/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru-RU')
  // Same block markup as the component mode, driven by frontmatter only.
  await expect(page.locator('.ln-page .ln-section')).toHaveCount(15)
})

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

test('every block of the library is rendered on the home page', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.ln-page .ln-section')).toHaveCount(15)
  await expect(page.locator('.ln-feature')).toHaveCount(6)
  await expect(page.locator('.ln-carousel__slide')).toHaveCount(6)
  await expect(page.locator('.ln-plan')).toHaveCount(3)
  await expect(page.locator('.ln-faq__item')).toHaveCount(4)
  await expect(page.locator('.ln-gallery__item')).toHaveCount(6)
})

test('hero actions link to the docs', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const actions = page.locator('.ln-hero__actions .ln-btn')
  await expect(actions).toHaveCount(3)
  await expect(actions.first()).toHaveAttribute('href', /\/en\/doc/)
})

test('faq accordion opens an answer', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const second = page.locator('.ln-faq__item').nth(1)
  await expect(second).not.toHaveAttribute('open', '')
  await second.locator('summary').click()
  await expect(second).toHaveAttribute('open', '')
})

test('pricing period switch changes the displayed price', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const featured = page.locator('.ln-card--featured')
  await expect(featured).toContainText('$19')
  await page.locator('.ln-pricing__toggle-btn').nth(1).click()
  await expect(featured).toContainText('$190')
})

test('carousel scrolls when the next arrow is used', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'Arrows are hidden on narrow viewports by design')

  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const track = page.locator('.ln-carousel__track')
  const before = await track.evaluate((el) => el.scrollLeft)
  await page.locator('.ln-carousel__arrow').nth(1).click()
  await expect
    .poll(async () => track.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(before)
})

// ---------------------------------------------------------------------------
// Theme axes
// ---------------------------------------------------------------------------

test('color picker switches the palette and persists it', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')

  await page.locator('.ln-picker__btn').first().click()
  await page.locator('.ln-picker__menu .ln-picker__item', { hasText: 'Rose' }).click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rose')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rose')
})

test('style picker switches the style preset independently', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await page.locator('.ln-picker__btn').nth(1).click()
  await page.locator('.ln-picker__menu .ln-picker__item', { hasText: 'Brutal' }).click()

  await expect(page.locator('html')).toHaveAttribute('data-ln-style', 'brutal')
  // The color axis is untouched by a style change.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
})

// ---------------------------------------------------------------------------
// Documentation half of the template
// ---------------------------------------------------------------------------

test('docs pages load with the sidebar', async ({ page, isMobile }) => {
  await page.goto('en/doc/blocks', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('h1')).toContainText('Blocks')
  if (!isMobile) {
    await expect(page.locator('.VPSidebar a[href*="/en/doc/theming"]').first()).toBeVisible()
  }
})

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
