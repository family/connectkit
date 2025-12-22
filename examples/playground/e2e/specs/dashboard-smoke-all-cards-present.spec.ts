import { expect, test } from '../fixtures/test'

test.describe('Dashboard smoke - key cards are present', () => {
  test('shows core dashboard sections', async ({ page, dashboardPage }) => {
    await dashboardPage.ensureReady()

    // No acoplamos a estructura exacta: buscamos títulos
    await expect(page.getByText(/write contract/i).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/switch chain/i).first()).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(/^wallets$/i).first()).toBeVisible({ timeout: 60_000 })

    // Signatures: usamos el placeholder para no depender del título
    await expect(page.getByPlaceholder(/enter a message to sign/i)).toBeVisible({ timeout: 60_000 })
  })
})
