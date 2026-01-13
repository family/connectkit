import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        [env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT]: {
          target: env.VITE_CREATE_ENCRYPTED_SESSION_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
