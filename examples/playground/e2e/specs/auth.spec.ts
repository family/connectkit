import { expect, test } from '@playwright/test'
import { clickableByText } from '../utils/ui'

test('auth screen renders correctly', async ({ page }) => {
  await page.goto('/showcase/auth', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/showcase\/auth/i)

  await expect(page.getByText(/openfort/i).first()).toBeVisible({ timeout: 20_000 })

  await expect(clickableByText(page, /continue as guest|guest/i)).toBeVisible({ timeout: 20_000 })
  await expect(clickableByText(page, /continue with email/i)).toBeVisible({ timeout: 20_000 })
  await expect(clickableByText(page, /continue with wallet/i)).toBeVisible({ timeout: 20_000 })
})
