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
    default_icon: {
      16: 'icon-16.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    default_title: 'Open command palette',
    default_popup: 'popup.html',
  },

  background: {
    type: 'module',
    service_worker: 'background.js',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+P',
        mac: 'Command+Shift+P',
      },
      description: 'Open command palette.',
    },
  },
  icons: {
    16: 'icon-16.png',
    48: 'icon-48.png',
    128: 'icon-128.png',
  },
  options_page: 'options.html',
  permissions: [
    'notifications',
    'storage',
    'management',
    'tabs',
    'tabGroups',
    'bookmarks',
  ],
  web_accessible_resources: [
    {
      resources: ['assets/*', 'chunks/*', 'icon-*.png'],
      matches: ['<all_urls>'],
    },
  ],
}

export default manifest
