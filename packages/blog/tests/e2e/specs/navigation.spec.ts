import { test, expect } from '@playwright/test'

test.describe('Navigation & Locales', () => {
  test('language dropdown toggles locale links', async ({ page }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    const langBtn = page.locator('.switch-lang-btn').first()
    await expect(langBtn).toBeVisible()

    await langBtn.click()

    const ruLink = page.locator('.switch-lang-btn a[href*="ru"], a[href*="/ru/"]').first()
    await expect(ruLink).toBeVisible({ timeout: 5000 })
    await ruLink.click()

    await page.waitForURL(/\/ru\//)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru-RU')
  })

  test('pagination navigates to page 2', async ({ page }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    const pagination = page.locator('.neptu-pagination, nav[aria-label="Pagination"]').first()
    if (await pagination.isVisible()) {
      const nextPageLink = pagination.locator('a[href*="/recent/2"]').first()
      if (await nextPageLink.isVisible()) {
        await nextPageLink.click()
        await page.waitForURL(/\/recent\/2/)
        expect(page.url()).toContain('/recent/2')
      }
    }
  })

  test('mobile sidebar toggle opens drawer on mobile viewport', async ({ page, isMobile }) => {
    if (!isMobile) return

    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    const burgerBtn = page.locator('.top-bar button').first()
    if (await burgerBtn.isVisible()) {
      await burgerBtn.click()
      const sidebar = page.locator('.app-drawer').first()
      await expect(sidebar).toBeVisible()
    }
  })
})
