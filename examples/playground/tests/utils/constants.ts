import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Compatibilidad con ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Project root
export const ROOT_OUT = path.resolve(__dirname, '../../../..')

// Playwright output directories
export const TEST_RESULTS_DIR = path.join(ROOT_OUT, 'test-results')
export const AUTH_STATE_PATH = path.join(TEST_RESULTS_DIR, '.auth', 'state.json')
