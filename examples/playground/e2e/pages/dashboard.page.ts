import { expect, type Page } from '@playwright/test'

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // Navega al dashboard
  async goto() {
    await this.page.goto('/showcase/auth', { waitUntil: 'domcontentloaded' })
  }

  // Botón de cerrar sesión
  signOutButton() {
    return this.page.getByRole('button', { name: /^sign out$/i })
  }

  // Verifica que el dashboard está cargado
  async expectLoaded() {
    await expect(this.signOutButton()).toBeVisible({ timeout: 90_000 })
  }

  // Asegura navegación y estado listo
  async ensureReady() {
    await this.goto()
    await this.expectLoaded()
  }

  // Firma un mensaje y valida el resultado
  async signMessage(message: string) {
    await this.ensureReady()

    const messageInput = this.page.getByPlaceholder(/enter a message to sign/i)
    await expect(messageInput).toBeVisible({ timeout: 60_000 })
    await messageInput.fill(message)

    const signBtn = this.page.getByRole('button', { name: /sign a message/i })
    await expect(signBtn).toBeVisible({ timeout: 60_000 })

    await signBtn.click()

    const signedHash = this.page.getByText(/signed message:\s*0x[a-f0-9]{6,}/i)

    try {
      await expect(signedHash).toBeVisible({ timeout: 120_000 })
    } catch (e) {
      await this.page.screenshot({ path: 'test-results/sign-message-failed.png', fullPage: true }).catch(() => {})
      throw e
    }
  }
}
