import { expect, test } from '../fixtures/test'

test.describe('Wallets - create new wallet', () => {
  test('shows existing wallet, offers 3 creation methods, shows creating text, and creates a new wallet via Password', async ({
    page,
    dashboardPage,
  }) => {
    // Ensure session and dashboard are ready
    await dashboardPage.ensureReady()

    // "Wallets" card title
    const walletsTitle = page
      .locator('[data-slot="card-title"]')
      .filter({ hasText: /^wallets$/i })
      .first()

    await expect(walletsTitle).toBeVisible({ timeout: 60_000 })

    // Card container
    const walletsCard = walletsTitle.locator('xpath=ancestor::*[@data-slot="card"][1]')
    await expect(walletsCard).toBeVisible({ timeout: 60_000 })

    // Existing wallets
    const walletRowLocator = walletsCard.locator('button').filter({
      hasText: /0x[a-f0-9]{4,}\.\.\.[a-f0-9]{4,}/i,
    })

    const initialCount = await walletRowLocator.count()
    expect(initialCount).toBeGreaterThanOrEqual(1)

    // Create new wallet
    const createNewBtn = walletsCard.getByRole('button', {
      name: /create new wallet/i,
    })
    await expect(createNewBtn).toBeVisible({ timeout: 30_000 })
    await createNewBtn.click()

    // Available options
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

    // Create wallet with password
    await passwordBtn.click()

    // Creation text visible
    const creatingWalletText = walletsCard.getByText(/^creating wallet with password recovery/i)
    await expect(creatingWalletText).toBeVisible({ timeout: 30_000 })

    // Wait until new wallet appears
    await expect.poll(async () => await walletRowLocator.count(), { timeout: 120_000 }).toBeGreaterThan(initialCount)

    const finalCount = await walletRowLocator.count()
    expect(finalCount).toBeGreaterThanOrEqual(2)
  })
})
