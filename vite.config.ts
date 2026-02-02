import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@svgedit/svgcanvas': path.resolve(__dirname, './node_modules/@svgedit/svgcanvas/svgcanvas.js'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
