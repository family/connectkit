import { expect, type Locator, type Page } from '@playwright/test'

export type Root = Page | Locator

export function clickableByText(root: Root, text: RegExp) {
  return root.locator('button, a, [role="button"]').filter({ hasText: text }).first()
}

export async function safeClick(root: Root, text: RegExp, timeout = 25_000) {
  const el = clickableByText(root, text)
  await expect(el).toBeVisible({ timeout })
  await el.scrollIntoViewIfNeeded()
  await el.click({ force: true, timeout })
}

export async function waitForSettledNetwork(page: Page, idleMs = 600, timeoutMs = 15_000) {
  const start = Date.now()
  let last = Date.now()

  const onRequest = () => {
    last = Date.now()
  }

  page.on('request', onRequest)
  page.on('response', onRequest)

  try {
    while (Date.now() - start < timeoutMs) {
      if (Date.now() - last >= idleMs) return
      await page.waitForTimeout(100)
    }
  } finally {
    page.off('request', onRequest)
    page.off('response', onRequest)
  }
}
