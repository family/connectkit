import { expect, test } from '../fixtures/test'

test.describe('Dashboard smoke - key cards are present', () => {
  test('shows core dashboard sections', async ({ page, dashboardPage }) => {
    await dashboardPage.ensureReady()

    // We don't couple to exact structure: we look for titles
    await expect(page.getByText(/write contract/i).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/switch chain/i).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/^wallets$/i).first()).toBeVisible({ timeout: 60_000 })

    // Signatures: we use the placeholder to avoid depending on the title
    await expect(page.getByPlaceholder(/enter a message to sign/i)).toBeVisible({ timeout: 60_000 })
  })
})
