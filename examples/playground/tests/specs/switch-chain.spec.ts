import { expect, test } from '../fixtures/test'

test.describe('Switch chain', () => {
  test('can switch between available chains and updates current chain', async ({ dashboardPage }) => {
    // Ensure session and dashboard are ready
    await dashboardPage.ensureReady()

    // Card "Switch chain"
    const chainCard = await dashboardPage.getCardByTitle(/switch chain/i)

    await expect(chainCard).toBeVisible({ timeout: 60_000 })

    // Current chain text
    const currentChain = chainCard
      .locator('p')
      .filter({ hasText: /^current chain:/i })
      .first()
    await expect(currentChain).toBeVisible({ timeout: 30_000 })

    // Helper switch chain
    const switchTo = async (chainName: 'Polygon Amoy' | 'Beam Testnet' | 'Base Sepolia') => {
      const btn = chainCard.getByRole('button', {
        name: new RegExp(`^switch to\\s+${escapeRegExp(chainName)}$`, 'i'),
      })

      // Click only if not disabled
      const disabled = await btn.isDisabled().catch(() => false)
      if (!disabled) {
        await expect(btn).toBeVisible({ timeout: 30_000 })
        await btn.click()
      }

      // Success message
      const successMsg = chainCard.getByText(new RegExp(`^switched to chain\\s+${escapeRegExp(chainName)}$`, 'i'))
      await expect(successMsg).toBeVisible({ timeout: 90_000 })

      // Actualiza cadena actual
      await expect(currentChain).toContainText(new RegExp(chainName, 'i'), {
        timeout: 90_000,
      })

      // Button becomes disabled
      await expect(btn).toBeDisabled({ timeout: 90_000 })
    }

    // Cambios de chain
    await switchTo('Beam Testnet')
    await switchTo('Base Sepolia')
    await switchTo('Polygon Amoy')
  })
})

// Escapa texto para usar en RegExp
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
