import { defineConfig } from 'vite'
import { resolve } from 'path'
import { src, withBase } from './base'
import type { BuildOptions } from 'vite'

const plugins = undefined
const buildOptions: BuildOptions = {
  rollupOptions: {
    input: {
      options: resolve(src, 'options', 'main.tsx'),
    },
    output: {
      entryFileNames: '[name].js',
      assetFileNames: 'assets/[name][extname]',
      chunkFileNames: 'chunks/[name].js',
    },
  },
}

export default defineConfig(withBase(buildOptions, plugins))
