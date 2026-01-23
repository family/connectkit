import { test as base } from '@playwright/test'
import { AuthPage } from '../pages/auth.page'
import { DashboardPage } from '../pages/dashboard.page'

type Fixtures = {
  authPage: AuthPage
  dashboardPage: DashboardPage
}

// Extends Playwright with reusable Page Objects
export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
})

// Re-export expect to use the same import in specs
export { expect } from '@playwright/test'
