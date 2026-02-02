import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 匹配 /rest/core/fileServer 开头的请求
      '/rest/core/fileServer': {
        target: 'http://192.168.99.101:3031',
        changeOrigin: true
      }
    }
  },
})
