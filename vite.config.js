import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'react-simple-maps', 'papaparse']
  }
})
