import { test } from '../fixtures/test'

test.describe('Signatures - sign a message', () => {
  test('can sign a message and shows signed result', async ({ dashboardPage }) => {
    // Blockchain/RPC puede tardar, subimos solo este test
    test.setTimeout(180_000)

    const msg = `E2E hello ${Date.now()}`
    await dashboardPage.signMessage(msg)
  })
})
