import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the ASP.NET backend so the browser doesn't block them (CORS)
      '/api': { target: 'https://localhost:7253', changeOrigin: true, secure: false },
    },
  },
})
