import { expect, test } from '../fixtures/test'

test.describe('Switch chain', () => {
  test('can switch between available chains and updates current chain', async ({ page, dashboardPage }) => {
    // Asegura sesión y dashboard listos
    await dashboardPage.ensureReady()

    // Card "Switch chain"
    const chainCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /switch chain/i })
      .first()

    await expect(chainCard).toBeVisible({ timeout: 60_000 })

    // Texto de cadena actual
    const currentChain = chainCard
      .locator('p')
      .filter({ hasText: /^current chain:/i })
      .first()
    await expect(currentChain).toBeVisible({ timeout: 30_000 })

    // Helper para cambiar de cadena
    const switchTo = async (chainName: 'Polygon Amoy' | 'Beam Testnet' | 'Base Sepolia') => {
      const btn = chainCard.getByRole('button', {
        name: new RegExp(`^switch to\\s+${escapeRegExp(chainName)}$`, 'i'),
      })

      // Click solo si no está deshabilitado
      const disabled = await btn.isDisabled().catch(() => false)
      if (!disabled) {
        await expect(btn).toBeVisible({ timeout: 30_000 })
        await btn.click()
      }

      // Mensaje de éxito
      const successMsg = chainCard.getByText(new RegExp(`^switched to chain\\s+${escapeRegExp(chainName)}$`, 'i'))
      await expect(successMsg).toBeVisible({ timeout: 90_000 })

      // Actualiza cadena actual
      await expect(currentChain).toContainText(new RegExp(chainName, 'i'), {
        timeout: 90_000,
      })

      // Botón queda deshabilitado
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
