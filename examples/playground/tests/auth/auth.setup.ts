import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { AuthPage } from '../pages/auth.page'
import { DashboardPage } from '../pages/dashboard.page'
import { AUTH_STATE_PATH, TEST_RESULTS_DIR } from '../utils/constants'

test('setup: create guest wallet and persist auth state', async ({ page }) => {
  // Prepare necessary directories
  const authDir = path.dirname(AUTH_STATE_PATH)
  fs.mkdirSync(authDir, { recursive: true })
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true })

  // Page Objects
  const auth = new AuthPage(page)
  const dash = new DashboardPage(page)

  // Guest wallet creation flow
  await auth.goto()
  await auth.openConnectModalFromNavbar()
  await auth.continueAsGuest()

  // Verify that the dashboard is loaded
  await dash.expectLoaded()

  // Save the session for other tests
  await page.context().storageState({ path: AUTH_STATE_PATH })

  // Basic check
  expect(fs.existsSync(AUTH_STATE_PATH)).toBeTruthy()
})
