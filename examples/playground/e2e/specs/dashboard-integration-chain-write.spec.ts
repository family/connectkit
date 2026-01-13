import { expect, test } from '../fixtures/test'

test.describe('Dashboard integration - chain + write contract', () => {
  test('switch chain -> mint tokens -> keeps chain + shows tx hash', async ({ page, dashboardPage }) => {
    await dashboardPage.ensureReady()

    // --- Switch chain card
    const chainCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /switch chain/i })
      .first()
    await expect(chainCard).toBeVisible({ timeout: 60_000 })

    const currentChain = chainCard
      .locator('p')
      .filter({ hasText: /^current chain:/i })
      .first()
    await expect(currentChain).toBeVisible({ timeout: 30_000 })

    // Helper switch
    const switchTo = async (chainName: 'Polygon Amoy' | 'Beam Testnet' | 'Base Sepolia') => {
      const btn = chainCard.getByRole('button', {
        name: new RegExp(`^switch to\\s+${escapeRegExp(chainName)}$`, 'i'),
      })

      if (!(await btn.isDisabled().catch(() => false))) {
        await btn.click()
      }

      const successMsg = chainCard.getByText(new RegExp(`^switched to chain\\s+${escapeRegExp(chainName)}$`, 'i'))
      await expect(successMsg).toBeVisible({ timeout: 90_000 })
      await expect(currentChain).toContainText(new RegExp(chainName, 'i'), { timeout: 90_000 })
      await expect(btn).toBeDisabled({ timeout: 90_000 })
    }

    // Change to Base Sepolia
    await switchTo('Base Sepolia')

    // --- Write Contract card
    const writeCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /write contract/i })
      .first()
    await expect(writeCard).toBeVisible({ timeout: 60_000 })

    const amountInput = writeCard.getByPlaceholder(/enter amount to mint/i)
    await expect(amountInput).toBeVisible({ timeout: 30_000 })
    await amountInput.fill('3')

    const mintBtn = writeCard.getByRole('button', { name: /mint tokens/i })
    await expect(mintBtn).toBeVisible({ timeout: 30_000 })
    await mintBtn.click()

    // Hash visible (without hardcoding)
    const txHashRegex = /transaction hash:\s*0x[a-fA-F0-9]{6,}/i
    await expect(page.getByText(txHashRegex)).toBeVisible({ timeout: 120_000 })

    // --- Re-assert: the chain remains Base Sepolia (does not "reset")
    await expect(currentChain).toContainText(/base sepolia/i, { timeout: 30_000 })
  })
})

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
