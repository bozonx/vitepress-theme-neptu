import { test, expect } from '@playwright/test'

test.describe('SEO & Meta Tags & 404', () => {
  test('canonical and hreflang links are correctly set', async ({ page }) => {
    await page.goto('en/', { waitUntil: 'domcontentloaded' })

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /https?:\/\//)

    const hreflangEn = page.locator('link[rel="alternate"][hreflang*="en"]').first()
    await expect(hreflangEn).toHaveAttribute('href', /en/)
  })

  test('JSON-LD schema metadata is valid on post page', async ({ page }) => {
    await page.goto('en/post/full-featured', { waitUntil: 'domcontentloaded' })

    const script = page.locator('script[type="application/ld+json"]').first()
    await expect(script).toBeAttached()

    const jsonText = await script.textContent()
    expect(jsonText).toBeTruthy()

    const parsed = JSON.parse(jsonText!)
    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('BlogPosting')
  })

  test('renders 404 page for non-existent routes', async ({ page }) => {
    await page.goto('en/non-existent-page-404-test', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toContainText(/404|Not Found/i)
  })
})
