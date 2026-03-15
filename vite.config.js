import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    entries: ['index.html'],
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'd3-geo', 'topojson-client', 'papaparse']
  }
})
