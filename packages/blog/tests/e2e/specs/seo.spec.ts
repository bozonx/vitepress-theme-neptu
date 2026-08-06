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
    await page.goto('en/posts/full-featured', { waitUntil: 'domcontentloaded' })

    const script = page.locator('script[type="application/ld+json"]').first()
    await expect(script).toBeAttached()

    const jsonText = await script.textContent()
    expect(jsonText).toBeTruthy()

    const parsed = JSON.parse(jsonText!)
    expect(parsed['@context']).toBe('https://schema.org')

    // A post with a category emits a graph: the article plus its breadcrumb
    // trail. Without one, the article is the only node.
    const nodes = parsed['@graph'] ?? [parsed]
    const types = nodes.map((node: { '@type': string }) => node['@type'])
    expect(types).toContain('BlogPosting')
    expect(types).toContain('BreadcrumbList')

    const breadcrumb = nodes.find(
      (node: { '@type': string }) => node['@type'] === 'BreadcrumbList'
    )
    // Home → categories → category → post.
    expect(breadcrumb.itemListElement).toHaveLength(4)
    expect(breadcrumb.itemListElement.at(-1).item).toContain(
      '/en/posts/full-featured'
    )
  })

  test('renders 404 page for non-existent routes', async ({ page }) => {
    await page.goto('en/non-existent-page-404-test', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toContainText(/404|Not Found/i)
  })
})
