import { expect, type Locator, type Page } from '@playwright/test'
import { STRONG_PASSWORD } from '../utils/constants'
import { clickableByText, safeClick } from '../utils/ui'

export class AuthPage {
  constructor(private readonly page: Page) {}

  // Navega a la pantalla de auth
  async goto() {
    await this.page.goto('/showcase/auth', { waitUntil: 'domcontentloaded' })
    await expect(this.page).toHaveURL(/\/showcase\/auth/i)
  }

  // Localiza el modal de conexión si existe
  private connectModal(): Locator {
    return this.page
      .locator('[role="dialog"]')
      .filter({ hasText: /^connect$/i })
      .first()
  }

  // Abre el modal "Connect" desde la navbar
  async openConnectModalFromNavbar() {
    await safeClick(this.page, /^(not connected|connect wallet)$/i, 30_000)

    await expect(this.page.getByText(/^connect$/i)).toBeVisible({ timeout: 30_000 })
    await expect(this.page.getByPlaceholder('Enter your email')).toBeVisible({ timeout: 30_000 })
  }

  // Continúa como guest y espera a que el flujo avance
  async continueAsGuest() {
    const modal = this.connectModal()
    const hasModal = (await modal.count().catch(() => 0)) > 0
    const root: Page | Locator = hasModal ? modal : this.page

    const guestBtn = root.getByRole('button', { name: /^guest$/i })

    // Señales de avance del flujo
    const createWalletCta = clickableByText(root as any, /create\s*wallet/i)
    const secureWalletHeading = (hasModal ? this.page : root).getByText(/secure your wallet/i)

    const creatingGuest = this.page.getByText(/creating guest user/i)
    const loadingPleaseWait = this.page.getByText(/loading,\s*please wait/i)

    // Ya hemos avanzado
    if (
      (await createWalletCta.isVisible().catch(() => false)) ||
      (await secureWalletHeading.isVisible().catch(() => false))
    ) {
      return
    }

    // Click en Guest si está disponible
    if (await guestBtn.isVisible().catch(() => false)) {
      await expect(guestBtn).toBeEnabled({ timeout: 30_000 })
      await guestBtn.click({ timeout: 30_000 })
    }

    // Espera a estado intermedio o siguiente paso
    await expect
      .poll(
        async () => {
          const a = await creatingGuest.isVisible().catch(() => false)
          const b = await loadingPleaseWait.isVisible().catch(() => false)
          const c = await createWalletCta.isVisible().catch(() => false)
          const d = await secureWalletHeading.isVisible().catch(() => false)
          return a || b || c || d
        },
        { timeout: 45_000 }
      )
      .toBeTruthy()

    // Espera a que el flujo llegue a crear wallet
    await expect
      .poll(
        async () => {
          const c = await createWalletCta.isVisible().catch(() => false)
          const d = await secureWalletHeading.isVisible().catch(() => false)
          return c || d
        },
        { timeout: 120_000 }
      )
      .toBeTruthy()
  }

  // Crea una wallet usando contraseña
  async createWalletWithPassword(password = STRONG_PASSWORD) {
    const modal = this.connectModal()
    const hasModal = (await modal.count().catch(() => 0)) > 0
    const root: Page | Locator = hasModal ? modal : this.page

    const secureWalletHeading = this.page.getByText(/secure your wallet/i)

    // Click en "Create wallet" si aún no estamos en el paso final
    if (!(await secureWalletHeading.isVisible().catch(() => false))) {
      await safeClick(root as any, /create\s*wallet/i, 60_000)
    }

    await expect(secureWalletHeading).toBeVisible({ timeout: 90_000 })

    const passwordInput = this.page.getByPlaceholder('Enter your password')
    await expect(passwordInput).toBeVisible({ timeout: 90_000 })

    await passwordInput.fill(password)
    await this.page.waitForTimeout(150)

    await safeClick(this.page, /^create wallet$/i, 90_000)
  }
}
