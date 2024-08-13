import { defineConfig } from 'vite'
import { resolve } from 'path'
import { src, withBase } from './base'
import type { BuildOptions } from 'vite'

const plugins = undefined
const buildOptions: BuildOptions = {
  // lib: {
  //   name: "settings",
  //   entry: resolve(src, "settings", "index.tsx"),
  //   formats: ["iife"],
  //   fileName: () => "settings.js",
  // },
  rollupOptions: {
    input: {
      settings: resolve(src, 'settings', 'main.tsx'),
    },
    output: {
      entryFileNames: '[name].js',
      assetFileNames: 'assets/[name][extname]',
      chunkFileNames: 'chunks/[name].js',
    },
  },
}

export default defineConfig(withBase(buildOptions, plugins))
