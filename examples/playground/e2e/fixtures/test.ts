import { test as base } from '@playwright/test'
import { AuthPage } from '../pages/auth.page'
import { DashboardPage } from '../pages/dashboard.page'

type Fixtures = {
  authPage: AuthPage
  dashboardPage: DashboardPage
}

// Extiende Playwright con Page Objects reutilizables
export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
})

// Re-exporta expect para usar el mismo import en los specs
export { expect } from '@playwright/test'
