import { expect, test } from '../fixtures/test'

test.describe('Dashboard integration - wallets + signatures', () => {
  test('create new wallet (password) -> wallet appears -> can still sign message', async ({ page, dashboardPage }) => {
    await dashboardPage.ensureReady()

    // --- Wallets card (por título)
    const walletsTitle = page
      .locator('[data-slot="card-title"]')
      .filter({ hasText: /^wallets$/i })
      .first()
    await expect(walletsTitle).toBeVisible({ timeout: 60_000 })

    const walletsCard = walletsTitle.locator('xpath=ancestor::*[@data-slot="card"][1]')
    await expect(walletsCard).toBeVisible({ timeout: 60_000 })

    const walletRowLocator = walletsCard.locator('button').filter({
      hasText: /0x[a-f0-9]{4,}\.\.\.[a-f0-9]{4,}/i,
    })

    const initialCount = await walletRowLocator.count()

    // Create new wallet -> opciones
    const createNewBtn = walletsCard.getByRole('button', { name: /create new wallet/i })
    await expect(createNewBtn).toBeVisible({ timeout: 30_000 })
    await createNewBtn.click()

    const automaticBtn = walletsCard.getByRole('button', { name: /^automatic$/i })
    const passwordBtn = walletsCard.getByRole('button', { name: /^password$/i })
    const passkeyBtn = walletsCard.getByRole('button', { name: /^passkey$/i })

    await expect(automaticBtn).toBeVisible({ timeout: 30_000 })
    await expect(passwordBtn).toBeVisible({ timeout: 30_000 })
    await expect(passkeyBtn).toBeVisible({ timeout: 30_000 })

    // Click Password
    await passwordBtn.click()

    // “Creating wallet…” visible
    const creatingWalletText = walletsCard.getByText(/^creating wallet with password recovery/i)
    await expect(creatingWalletText).toBeVisible({ timeout: 30_000 })

    // Nueva wallet aparece (count sube)
    await expect.poll(async () => await walletRowLocator.count(), { timeout: 120_000 }).toBeGreaterThan(initialCount)

    // --- Ahora validamos que aún se puede firmar (no se rompe el dashboard)
    const msg = `Cross-feature sign ${Date.now()}`
    await dashboardPage.signMessage(msg)
  })
})
