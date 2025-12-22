import { expect, test } from '../fixtures/test'

test.describe('Session keys - multiple + delete flow', () => {
  test('can create multiple session keys, revoke one (X), and delete it (trash)', async ({ page, dashboardPage }) => {
    test.setTimeout(180_000)
    await dashboardPage.ensureReady()

    const sessionCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /session keys/i })
      .first()

    await expect(sessionCard).toBeVisible({ timeout: 60_000 })

    const createBtn = sessionCard.getByRole('button', { name: /create session key/i })
    await expect(createBtn).toBeVisible({ timeout: 30_000 })

    // Cada key visible (truncada) está en este span
    const keySpans = sessionCard.locator('span.truncate.font-mono')

    // Asegurar mínimo 2 session keys (crea si faltan)
    const ensureAtLeast = async (n: number) => {
      while ((await keySpans.count()) < n) {
        const before = await keySpans.count()
        await createBtn.click()

        await expect.poll(async () => await keySpans.count(), { timeout: 120_000 }).toBeGreaterThan(before)
      }
    }

    await ensureAtLeast(2)

    const initialCount = await keySpans.count()
    expect(initialCount).toBeGreaterThanOrEqual(2)

    // Elegimos la segunda key para revocar + borrar
    const targetKeySpan = keySpans.nth(1)
    const targetKeyText = (await targetKeySpan.textContent())?.trim()
    expect(targetKeyText).toBeTruthy()

    // Row contenedor de esa key
    const targetRow = targetKeySpan.locator('xpath=ancestor::div[@data-slot="tooltip-trigger"][1]')
    await expect(targetRow).toBeVisible({ timeout: 30_000 })

    // Dentro del row hay 1 botón (X) inicialmente.
    const rowButtons = targetRow.locator('button')
    await expect(rowButtons).toHaveCount(1, { timeout: 30_000 })

    // 1) Click en la X (revocar)
    await rowButtons.first().click()

    // Debe aparecer el tachado (line-through) en el wrapper del texto
    const struck = targetRow.locator('.line-through')
    await expect(struck).toBeVisible({ timeout: 60_000 })

    // 2) Tras revocar, aparece el botón de papelera (trash)

    const trashByClass = targetRow.locator('button:has(svg.lucide-trash)')
    let trashBtn = trashByClass

    if (!(await trashByClass.isVisible().catch(() => false))) {
      // fallback robusto
      trashBtn = targetRow.locator('button').last()
    }

    await expect(trashBtn).toBeVisible({ timeout: 60_000 })
    await trashBtn.click()

    // 3) Confirmar que la key desaparece del listado
    await expect
      .poll(
        async () => {
          const all = (await keySpans.allTextContents()).map((t) => t.trim())
          return all.includes(targetKeyText!)
        },
        { timeout: 120_000 }
      )
      .toBeFalsy()
  })
})
