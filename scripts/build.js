import { execSync } from 'child_process'
import concurrently from 'concurrently'
import { success, info, error } from './helper/colorful-log.js'

function join(...strs) {
  return strs.filter((str) => (str ? true : false)).join(' ')
}

const isDev = process.argv.includes('--dev')

info(`
============================
Running in ${isDev ? 'development' : 'production'} mode.
============================
`)

const VITE_WATCH = join(
  isDev && '__DEV__=true',
  'vite build',
  isDev && '--watch',
  '--config vite-configs/'
)

// =================================================

/** @type {import("concurrently").Command} */
const settings = {
  name: 'Settings page',
  command: VITE_WATCH + 'settings.ts',
}

/** @type {import("concurrently").Command} */
const background = {
  name: 'Background (Service Worker)',
  command: VITE_WATCH + 'background.ts',
}

/** @type {import("concurrently").Command} */
const content = {
  name: 'Content Script',
  command: VITE_WATCH + 'content.ts',
}

/** @type {import("concurrently").Command} */
const manifest = {
  name: 'Manifest File',
  command: join('node scripts/inject-manifest.js', isDev && '--watch'),
}

/** @type {import("concurrently").Command} */
const copyPublic = {
  name: 'Public Directory',
  command: join('node scripts/copy-public.js', isDev && '--watch'),
}

// =================================================

try {
  execSync('npm run clean')
  success("Finished cleaning up 'dist' directory.")
} catch (e) {
  error("Failed to clean up 'dist' directory")
  throw e
}

try {
  execSync('npm run type-check')
  success('Finished type check.')
} catch (e) {
  error('Failed to check types.')
  throw e
}

concurrently([settings, background, content, manifest, copyPublic])
