import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://orderinventorysystem-1y9i.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/v1': {
        target: 'https://orderinventorysystem-1y9i.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

