import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import { AUTH_STATE_PATH, ROOT_OUT, TEST_RESULTS_DIR } from './tests/utils/constants'

const PORT = Number(process.env.PLAYGROUND_PORT ?? 5173)
const BASE_URL = process.env.PLAYGROUND_BASE_URL ?? `http://localhost:${PORT}`

const REPORT_DIR = path.join(ROOT_OUT, 'playwright-report')

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Global timeouts
  timeout: 60_000,
  expect: { timeout: 30_000 },

  // Retries and workers
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  fullyParallel: false,

  // Reporters
  reporter: [['list'], ['html', { outputFolder: REPORT_DIR, open: 'never' }]],

  // Output results
  outputDir: TEST_RESULTS_DIR,

  // Common configuration
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 45_000,
    viewport: { width: 1440, height: 900 },
  },

  // Projects
  projects: [
    {
      // Initial setup (creates session)
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      // Tests with persisted session
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: [/wallet-entry\.spec\.ts/, /auth\.spec\.ts/],
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_PATH,
      },
    },

    {
      // Tests without session
      name: 'unauthenticated',
      testMatch: /(wallet-entry|auth)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
