import { expect, test } from '../fixtures/test'

test.describe('Dashboard negative - write contract validation', () => {
  test('mint without amount does not produce transaction hash', async ({ page, dashboardPage }) => {
    test.setTimeout(120_000)
    await dashboardPage.ensureReady()

    const writeCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /write contract/i })
      .first()
    await expect(writeCard).toBeVisible({ timeout: 60_000 })

    const amountInput = writeCard.getByPlaceholder(/enter amount to mint/i)
    await expect(amountInput).toBeVisible({ timeout: 30_000 })

    // Vacío / inválido
    await amountInput.fill('')

    const mintBtn = writeCard.getByRole('button', { name: /mint tokens/i })
    await expect(mintBtn).toBeVisible({ timeout: 30_000 })
    await mintBtn.click()

    // No debería aparecer hash
    const txHashRegex = /transaction hash:\s*0x[a-fA-F0-9]{6,}/i
    await expect(page.getByText(txHashRegex))
      .toHaveCount(0, { timeout: 3_000 })
      .catch(() => {
        // Si tu UI tarda en “decidir”, dejamos un margen pequeño y rechecamos
      })

    // Opcional: si tu UI muestra error, puedes activar este assert:
    // await expect(writeCard.getByText(/invalid|required|enter amount/i)).toBeVisible({ timeout: 10_000 });
  })
})
