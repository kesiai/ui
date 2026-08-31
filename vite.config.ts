import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        '@svgedit/svgcanvas': path.resolve(import.meta.dirname, './node_modules/@svgedit/svgcanvas/svgcanvas.js'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-router', 'react-router-dom'],
    },
    define: {
      'process.env': {},
      'global': 'globalThis',
      ...(mode === 'development' && {
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      ...(mode === 'production' && {
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      'import.meta.env.KESI_PROJECT': JSON.stringify(env.KESI_PROJECT || ''),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      open: false,
      // 允许跨域读取：KESI 编辑器（localhost:5173）直接 fetch 本地 registry（public/r/*.json），
      // 否则浏览器 CORS 拦截报 "Failed to fetch"（vite 默认不对静态资源发 ACAO 头）
      cors: true,
      proxy: {
        ...(env.KESI_API_TARGET ? {
          '/rest': {
            target: env.KESI_API_TARGET,
            changeOrigin: true,
            secure: false,
          },
          '/core': {
            target: env.KESI_API_TARGET,
            changeOrigin: true,
            secure: false,
          },
          '/ws': {
            target: env.KESI_API_TARGET.replace(/^http/, 'ws'),
            changeOrigin: true,
            secure: false,
            ws: true,
          },
        } : {})
      },
    },
  }
})
