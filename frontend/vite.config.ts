import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_URL;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/auth': proxyTarget,
        '/wallet': proxyTarget,
        '/payments': proxyTarget,
        '/webhooks': proxyTarget,
        '/admin': proxyTarget,
        '/health': proxyTarget,
        '/api': proxyTarget,
      },
    },
  }
})
