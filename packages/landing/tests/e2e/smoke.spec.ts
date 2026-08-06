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

test('root renders locale selector without redirecting', async ({ page }) => {
  await page.goto('', { waitUntil: 'domcontentloaded' })

  // The root page deliberately shows a locale selector instead of redirecting,
  // so every locale remains crawlable by search engines.
  await expect(page.locator('.locale-selector')).toBeVisible()
  await expect(page.locator('.locale-selector__link')).toHaveCount(2)
  expect(page.url()).not.toMatch(/\/en\//)
})

test('russian home is rendered from the declarative blocks array', async ({ page }) => {
  await page.goto('ru/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru-RU')
  // Same block markup as the component mode, driven by frontmatter only.
  await expect(page.locator('.ln-page .ln-section')).toHaveCount(24)
})

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

test('every block of the library is rendered on the home page', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.ln-page .ln-section')).toHaveCount(24)
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

test('carousel marks the slide it actually scrolled to', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'Arrows are hidden on narrow viewports by design')

  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  // Regression: the active index was computed against the section's coordinate
  // system, so on a wide viewport the highlighted dot lagged behind the track.
  const dots = page.locator('.ln-carousel__dot')
  await expect(dots.nth(0)).toHaveClass(/is-active/)

  await page.locator('.ln-carousel__arrow').nth(1).click()
  await expect(dots.nth(0)).not.toHaveClass(/is-active/)

  const track = page.locator('.ln-carousel__track')
  await track.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }))
  await expect(dots.last()).toHaveClass(/is-active/)
})

// ---------------------------------------------------------------------------
// Interactive blocks
// ---------------------------------------------------------------------------

test('code block switches samples and keeps one panel visible', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const tabs = page.locator('.ln-code__tab')
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.ln-code__panel:visible')).toHaveCount(1)

  await tabs.nth(3).click()
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.ln-code__panel:visible')).toContainText('LandingTheme')
})

test('feature tabs respond to the keyboard', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  const tabs = page.locator('#authoring-tabs [role="tab"]')
  await tabs.first().focus()
  await page.keyboard.press('ArrowRight')

  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#authoring-tabs [role="tabpanel"]:visible')).toHaveCount(1)
})

test('video embeds nothing before the visitor asks for it', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.ln-video__frame iframe')).toHaveCount(0)
  await page.locator('.ln-video__facade').click()
  await expect(page.locator('.ln-video__frame iframe')).toHaveCount(1)
})

test('banner stays dismissed across reloads', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.ln-banner__inner')).toBeVisible()
  await page.locator('.ln-banner__close').click()
  await expect(page.locator('.ln-banner__inner')).toHaveCount(0)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('.ln-banner__inner')).toHaveCount(0)
})

test('the page never scrolls sideways', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  // Wide content — the comparison table, the logo marquee — must scroll or clip
  // inside its own section. The document itself must not move.
  await expect(page.locator('.ln-compare__table')).toBeVisible()
  const scrolled = await page.evaluate(() => {
    window.scrollTo(800, 0)
    return window.scrollX
  })
  expect(scrolled).toBe(0)
})

// ---------------------------------------------------------------------------
// Theme axes
// ---------------------------------------------------------------------------

test('color picker switches the palette and persists it', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')

  await page.locator('.neptu-picker__btn').first().click()
  await page.locator('.neptu-picker__menu .neptu-picker__item', { hasText: 'Rose' }).click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rose')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rose')
})

test('style picker switches the style preset independently', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'domcontentloaded' })

  await page.locator('.neptu-picker__btn').nth(1).click()
  await page.locator('.neptu-picker__menu .neptu-picker__item', { hasText: 'Brutal' }).click()

  await expect(page.locator('html')).toHaveAttribute('data-style', 'brutal')
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
  await page.goto('en/pages/donate', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toBeVisible()
})

test('links page loads', async ({ page }) => {
  await page.goto('en/pages/links', { waitUntil: 'domcontentloaded' })
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
