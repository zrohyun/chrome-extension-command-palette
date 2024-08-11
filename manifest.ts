import { name, version, description } from './package.json'

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name,
  version,
  description,
  action: {
    default_popup: 'settings.html',
  },
  icons: {
    '16': 'icon-16.png',
    '48': 'icon-48.png',
    '128': 'icon-128.png',
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
