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
        "@": path.resolve(__dirname, "./src"),
        '@svgedit/svgcanvas': path.resolve(__dirname, './node_modules/@svgedit/svgcanvas/svgcanvas.js'),
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
      'import.meta.env.KESI_PROJECT_ID': JSON.stringify(env.KESI_PROJECT_ID || ''),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      open: false,
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
