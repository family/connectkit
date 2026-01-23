import { expect, type Page } from '@playwright/test'

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // Navigate to the dashboard
  async goto() {
    await this.page.goto('/showcase/auth', { waitUntil: 'domcontentloaded' })
  }

  // Sign out button
  signOutButton() {
    return this.page.getByRole('button', { name: /^sign out$/i })
  }

  // Verify that the dashboard is loaded
  async expectLoaded() {
    await expect(this.signOutButton()).toBeVisible({ timeout: 90_000 })
    await new Promise((r) => setTimeout(r, 1000))
  }

  // Ensure navigation and ready state
  async ensureReady() {
    await this.goto()
    await this.expectLoaded()
  }

  // Sign a message and validate the result
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

  async getCardByTitle(title: string | RegExp) {
    const titleLocator = this.page.locator('[data-slot="card"]').filter({ hasText: title }).first()

    await expect(titleLocator).toBeVisible({ timeout: 10_000 })

    return titleLocator
  }
}
