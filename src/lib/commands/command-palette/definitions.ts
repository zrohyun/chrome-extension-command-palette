import { defineCommand } from '../utils'

export const disable = defineCommand({
  id: 'command-palette.disable',
  name: 'Disable this extension',
})

export const reload = defineCommand({
  id: 'command-palette.reload',
  name: 'Reload this extension',
})

export const openOptions = defineCommand({
  id: 'command-palette.options',
  name: 'Open options page',
})

export const uninstall = defineCommand({
  id: 'command-palette.uninstall',
  name: 'Uninstall this extension',
})
