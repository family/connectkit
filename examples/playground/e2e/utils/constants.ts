import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Compatibilidad con ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Contraseña fuerte para tests E2E
export const STRONG_PASSWORD = process.env.E2E_WALLET_PASSWORD ?? 'Openfort_E2E_2025!A9x#7Kp'

// Raíz del proyecto
export const ROOT_OUT = path.resolve(__dirname, '../../../..')

// Directorios de salida de Playwright
export const TEST_RESULTS_DIR = path.join(ROOT_OUT, 'test-results')
export const AUTH_STATE_PATH = path.join(TEST_RESULTS_DIR, '.auth', 'state.json')
