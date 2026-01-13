import { expect, test } from '../fixtures/test'

test.describe('Write Contract - mint tokens', () => {
  test('new wallet balance is 0 and mint shows transaction hash', async ({ page, dashboardPage }) => {
    // Ensure session and dashboard are ready
    await dashboardPage.ensureReady()

    // Card "Write Contract"
    const writeCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /write contract/i })
      .first()

    await expect(writeCard).toBeVisible({ timeout: 60_000 })

    // initial balance
    await expect(writeCard.getByText(/balance:\s*0\b/i)).toBeVisible({ timeout: 60_000 })

    // Amount to mint
    const amountInput = writeCard.getByPlaceholder(/enter amount to mint/i)
    await expect(amountInput).toBeVisible({ timeout: 30_000 })
    await amountInput.fill('7')

    // Mint tokens
    const mintBtn = writeCard.getByRole('button', { name: /mint tokens/i })
    await expect(mintBtn).toBeVisible({ timeout: 30_000 })
    await mintBtn.click()

    // Transaction hash visible
    const txHashRegex = /transaction hash:\s*0x[a-fA-F0-9]{6,}/i
    await expect(page.getByText(txHashRegex)).toBeVisible({ timeout: 90_000 })
  })
})
