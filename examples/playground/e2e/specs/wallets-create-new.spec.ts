import { expect, test } from '../fixtures/test'

test.describe('Wallets - create new wallet', () => {
  test('shows existing wallet, offers 3 creation methods, shows creating text, and creates a new wallet via Password', async ({
    page,
    dashboardPage,
  }) => {
    // Asegura sesión y dashboard listos
    await dashboardPage.ensureReady()

    // Título del card "Wallets"
    const walletsTitle = page
      .locator('[data-slot="card-title"]')
      .filter({ hasText: /^wallets$/i })
      .first()

    await expect(walletsTitle).toBeVisible({ timeout: 60_000 })

    // Contenedor del card
    const walletsCard = walletsTitle.locator('xpath=ancestor::*[@data-slot="card"][1]')
    await expect(walletsCard).toBeVisible({ timeout: 60_000 })

    // Wallets existentes
    const walletRowLocator = walletsCard.locator('button').filter({
      hasText: /0x[a-f0-9]{4,}\.\.\.[a-f0-9]{4,}/i,
    })

    const initialCount = await walletRowLocator.count()
    expect(initialCount).toBeGreaterThanOrEqual(1)

    // Crear nueva wallet
    const createNewBtn = walletsCard.getByRole('button', {
      name: /create new wallet/i,
    })
    await expect(createNewBtn).toBeVisible({ timeout: 30_000 })
    await createNewBtn.click()

    // Opciones disponibles
    const automaticBtn = walletsCard.getByRole('button', {
      name: /^automatic$/i,
    })
    const passwordBtn = walletsCard.getByRole('button', {
      name: /^password$/i,
    })
    const passkeyBtn = walletsCard.getByRole('button', {
      name: /^passkey$/i,
    })

    await expect(automaticBtn).toBeVisible({ timeout: 30_000 })
    await expect(passwordBtn).toBeVisible({ timeout: 30_000 })
    await expect(passkeyBtn).toBeVisible({ timeout: 30_000 })

    // Crear wallet con contraseña
    await passwordBtn.click()

    // Texto de creación visible
    const creatingWalletText = walletsCard.getByText(/^creating wallet with password recovery/i)
    await expect(creatingWalletText).toBeVisible({ timeout: 30_000 })

    // Espera a que aparezca una nueva wallet
    await expect.poll(async () => await walletRowLocator.count(), { timeout: 120_000 }).toBeGreaterThan(initialCount)

    const finalCount = await walletRowLocator.count()
    expect(finalCount).toBeGreaterThanOrEqual(2)
  })
})
