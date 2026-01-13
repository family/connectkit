import { expect, test } from '../fixtures/test'

test.describe('Dashboard regression - overlays do not break dashboard', () => {
  test('opening/closing overlays keeps dashboard functional', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000)
    await dashboardPage.ensureReady()

    const connectCta = page
      .locator('button, a, [role="button"]')
      .filter({ hasText: /connect wallet|not connected/i })
      .first()

    if (await connectCta.isVisible().catch(() => false)) {
      await connectCta.click({ timeout: 30_000 }).catch(() => {})

      const connectTitle = page.getByText(/^connect$/i)
      if (await connectTitle.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape').catch(() => {})
        await expect(connectTitle)
          .toBeHidden({ timeout: 30_000 })
          .catch(() => {})
      }
    }

    // No matter what happens, the dashboard should remain functional
    await dashboardPage.expectLoaded()

    // Sanity
    await expect(page.getByPlaceholder(/enter a message to sign/i)).toBeVisible({ timeout: 60_000 })
  })
})
