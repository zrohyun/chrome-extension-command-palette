import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { info, manifestInjector } from './helper'

const isDev = process.env.__DEV__ === 'true'
const isProd = !isDev

info(`
========================================================
Running in ${isProd ? 'production' : 'development'} mode.
========================================================
`)

// Paths
const dist = resolve(__dirname, 'dist')
const src = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: { '@': src },
  },
  plugins: [react(), manifestInjector()],
  build: {
    outDir: dist,
    sourcemap: isDev,
    minify: isProd,
    reportCompressedSize: isProd,
    rollupOptions: {
      input: {
        settings: resolve(src, 'settings', 'index.tsx'),
        background: resolve(src, 'background', 'index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})
