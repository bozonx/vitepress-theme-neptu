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

    const searchInput = page
      .locator('#search-modal input, .pagefind-ui__search-input')
      .first()
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Neptu')
    const searchDrawer = page
      .locator(
        '#search-modal .pagefind-ui__drawer, #search-modal .pagefind-ui__result'
      )
      .first()
    await expect(searchDrawer).toBeVisible({ timeout: 10000 })
  })

  test('navigates to a result and keeps history sane', async ({ page }) => {
    await page.goto('en/recent/1', { waitUntil: 'domcontentloaded' })
    const startUrl = page.url()

    await page.locator('.search-input-btn').first().click()
    const searchInput = page
      .locator('#search-modal input, .pagefind-ui__search-input')
      .first()
    await searchInput.fill('Neptu')

    const firstResult = page
      .locator('#search-modal .pagefind-ui__result-link')
      .first()
    await expect(firstResult).toBeVisible({ timeout: 10000 })
    const resultHref = await firstResult.getAttribute('href')
    await firstResult.click()

    // The modal closes and the router actually lands on the result page.
    // cleanUrls drops the .html extension that the result link's href may carry.
    await expect(page.locator('#search-modal')).toBeHidden()
    const pathWithoutExt = resultHref?.replace(/\.html$/, '')
    await expect(page).toHaveURL(
      new RegExp(`${pathWithoutExt?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.html)?$`)
    )

    // Going back returns to the page the search started from, not to the result.
    await page.goBack()
    await expect(page).toHaveURL(startUrl)
  })
})
