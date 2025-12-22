import { expect, test } from '@playwright/test'
import { AuthPage } from '../pages/auth.page'
import { DashboardPage } from '../pages/dashboard.page'

test.describe('Wallet guest flow (end-to-end)', () => {
  test('guest -> create wallet -> dashboard visible', async ({ page }) => {
    // Page Objects
    const auth = new AuthPage(page)
    const dash = new DashboardPage(page)

    // Flujo completo como guest
    await auth.goto()
    await auth.openConnectModalFromNavbar()
    await auth.continueAsGuest()
    await auth.createWalletWithPassword()

    // Dashboard visible
    await dash.expectLoaded()
    await expect(dash.signOutButton()).toBeVisible()
  })
})
