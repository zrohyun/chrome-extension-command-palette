import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { success } from '.'
import manifest from '../manifest'
import type { PluginOption } from 'vite'

// Paths
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')
const manifestJson = resolve(dist, 'manifest.json')
const manifestTs = resolve(root, 'manifest.ts')

/**
 * Saves 'manifest.ts' as 'manifest.json'.
 */
export function manifestInjector(): PluginOption {
  return {
    name: 'manifest-injector',
    // Make vite to watch changes of manifest.ts file.
    buildStart() {
      this.addWatchFile(manifestTs)
    },
    // Saves manifest.ts as JSON.
    buildEnd() {
      if (!existsSync(dist)) {
        mkdirSync(dist, { recursive: true })
      }

      const json = JSON.stringify(manifest, null, 2)
      writeFileSync(manifestJson, json, { flag: 'w' })

      success('\n' + `Manifest file generated: ${manifestJson}` + '\n')
    },
  }
}
