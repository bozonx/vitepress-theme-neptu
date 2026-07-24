import { test, expect } from '@playwright/test'

test.describe('Pagefind Search Modal', () => {
  test('opens search modal on click and closes on Escape', async ({ page }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    const searchBtn = page.locator('.search-input-btn').first()
    await expect(searchBtn).toBeVisible()
    await searchBtn.click()

    const searchModal = page.locator('#search-modal')
    await expect(searchModal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(searchModal).toBeHidden()
  })

  test('executes search query and renders results', async ({ page }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })

    const searchBtn = page.locator('.search-input-btn').first()
    await searchBtn.click()

    const searchInput = page.locator('#search-modal input, .pagefind-ui__search-input').first()
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Neptu')
    const searchDrawer = page.locator('#search-modal .pagefind-ui__drawer, #search-modal .pagefind-ui__result').first()
    await expect(searchDrawer).toBeVisible({ timeout: 10000 })
  })
})
