import { test, expect } from '@playwright/test'

test.describe('Theme Appearance Switcher', () => {
  test('toggles dark mode class on html element', async ({ page, isMobile }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    if (isMobile) {
      // On mobile view, open sidebar drawer first to access SwitchAppearance
      const burger = page.locator('.top-bar button').first()
      await burger.click()
    }

    const switchBtn = page.locator('.VPSwitchAppearance:visible').first()
    await expect(switchBtn).toBeVisible()

    const html = page.locator('html')
    const initialIsDark = await html.evaluate((el) => el.classList.contains('dark'))

    await switchBtn.click()

    if (initialIsDark) {
      await expect(html).not.toHaveClass(/dark/)
    } else {
      await expect(html).toHaveClass(/dark/)
    }
  })
})
