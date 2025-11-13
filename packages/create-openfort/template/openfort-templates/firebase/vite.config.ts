import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
