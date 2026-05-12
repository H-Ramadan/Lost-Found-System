import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to Flask
      '/api': {
        target: 'http://localhost:5000',
        // Forward /api directly to Flask (now Flask expects /api prefix)
        changeOrigin: true,
      },
    },
  },
})