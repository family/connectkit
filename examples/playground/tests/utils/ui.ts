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
