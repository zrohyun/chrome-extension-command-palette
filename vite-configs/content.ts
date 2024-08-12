import { defineConfig } from 'vite'
import { resolve } from 'path'
import { src, withBase } from './base'
import type { BuildOptions } from 'vite'

const plugins = undefined
const buildOptions: BuildOptions = {
  lib: {
    name: 'content',
    entry: resolve(src, 'content', 'main.tsx'),
    formats: ['iife'],
    fileName: () => 'content.js',
  },
}

export default defineConfig(withBase(buildOptions, plugins))
