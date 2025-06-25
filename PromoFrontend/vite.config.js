import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:5265',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
