import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@svgedit/svgcanvas': path.resolve(__dirname, './node_modules/@svgedit/svgcanvas/svgcanvas.js'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/rest/core/': {
        target: 'http://192.168.99.103:3030/',
        changeOrigin: true
      },
      '/rest/flow/': {
        target: 'http://192.168.99.103:3030/',
        changeOrigin: true
      },
      '/rest/engine/': {
        target: 'http://192.168.99.103:3030/',
        changeOrigin: true
      },
      '/rest/eap/': {
        target: 'http://192.168.99.103:3030/',
        changeOrigin: true
      },
      // 匹配 /rest/core/fileServer 开头的请求
      '/rest/core/fileServer': {
        target: 'http://192.168.99.103:3030/',
        changeOrigin: true
      }
    }
  },
})
