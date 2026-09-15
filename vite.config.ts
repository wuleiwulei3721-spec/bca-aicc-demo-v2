import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendMode = env.VITE_COMMON_PHRASE_BACKEND ?? 'fastapi'
  const defaultBackendUrl =
    backendMode === 'node'
      ? 'http://127.0.0.1:3001'
      : 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': env.VITE_COMMON_PHRASE_BACKEND_URL ?? defaultBackendUrl,
      },
    },
  }
})
