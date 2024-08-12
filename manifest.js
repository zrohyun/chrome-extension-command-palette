import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const packageJson = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  'package.json'
)
const { name, version, description } = JSON.parse(readFileSync(packageJson))

/** @type {chrome.runtime.ManifestV3} */
const manifest = {
  manifest_version: 3,
  name,
  version,
  description,
  action: {
    default_popup: 'settings.html',
  },
  background: {
    type: 'module',
    service_worker: 'background.js',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['content.js'],
    },
  ],
  icons: {
    16: 'icon-16.png',
    48: 'icon-48.png',
    128: 'icon-128.png',
  },
  permissions: ['notifications'],
  web_accessible_resources: [
    {
      resources: ['assets/*', 'chunks/*', 'icon-*.png'],
      matches: ['<all_urls>'],
    },
  ],
}

export default manifest
