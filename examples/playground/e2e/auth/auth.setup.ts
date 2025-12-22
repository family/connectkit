import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { AuthPage } from '../pages/auth.page'
import { DashboardPage } from '../pages/dashboard.page'
import { AUTH_STATE_PATH, TEST_RESULTS_DIR } from '../utils/constants'

test('setup: create guest wallet and persist auth state', async ({ page }) => {
  // Prepara directorios necesarios
  const authDir = path.dirname(AUTH_STATE_PATH)
  fs.mkdirSync(authDir, { recursive: true })
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true })

  // Page Objects
  const auth = new AuthPage(page)
  const dash = new DashboardPage(page)

  // Flujo de creación de wallet como guest
  await auth.goto()
  await auth.openConnectModalFromNavbar()
  await auth.continueAsGuest()
  await auth.createWalletWithPassword()

  // Verifica que el dashboard está cargado
  await dash.expectLoaded()

  // Guarda la sesión para otros tests
  await page.context().storageState({ path: AUTH_STATE_PATH })

  // Comprobación básica
  expect(fs.existsSync(AUTH_STATE_PATH)).toBeTruthy()
})
