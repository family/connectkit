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
        '/api/auth': {
          target: env.VITE_BETTERAUTH_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
