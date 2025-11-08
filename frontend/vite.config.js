import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Proxy disabled for local development
    // Use API_BASE_URL in frontend/src/config/api.js instead
    // proxy: {
    //   '/api': {
    //     target: 'https://campusfound.onrender.com',
    //     changeOrigin: true
    //   }
    // }
  }
})
