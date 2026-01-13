import { expect, test } from '../fixtures/test'

test.describe('Dashboard integration - chain + signatures', () => {
  test('switch chain -> sign message -> chain stays selected', async ({ dashboardPage }) => {
    await dashboardPage.ensureReady()

    const chainCard = await dashboardPage.getCardByTitle(/switch chain/i)

    const currentChain = chainCard
      .locator('p')
      .filter({ hasText: /^current chain:/i })
      .first()
    await expect(currentChain).toBeVisible({ timeout: 30_000 })

    const target = 'Beam Testnet'

    const btn = chainCard.getByRole('button', { name: new RegExp(`^switch to\\s+${escapeRegExp(target)}$`, 'i') })
    if (!(await btn.isDisabled().catch(() => false))) {
      await btn.click()
    }

    const successMsg = chainCard.getByText(new RegExp(`^switched to chain\\s+${escapeRegExp(target)}$`, 'i'))
    await expect(successMsg).toBeVisible({ timeout: 90_000 })
    await expect(currentChain).toContainText(new RegExp(target, 'i'), { timeout: 90_000 })

    const msg = `Chain-sign ${Date.now()}`
    await dashboardPage.signMessage(msg)

    await expect(currentChain).toContainText(/beam testnet/i, { timeout: 30_000 })
  })
})

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
