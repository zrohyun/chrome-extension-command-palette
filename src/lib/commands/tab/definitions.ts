import { defineCommand } from '../utils'

export const switchToTab = defineCommand({
  id: 'tab.switch',
  name: 'Switch to tab',
})

export const pinTabs = defineCommand({
  id: 'tab.pin',
  name: 'Pin tabs',
})

export const unpinTabs = defineCommand({
  id: 'tab.unpin',
  name: 'Unpin tabs',
})

export const closeTabs = defineCommand({
  id: 'tab.close',
  name: 'Close selected tabs',
})

export const createGroup = defineCommand({
  id: 'tab.group.create',
  name: 'Create new tab group',
})

export const closeGroups = defineCommand({
  id: 'tab.group.close',
  name: 'Close tab groups',
})

export const renameGroup = defineCommand({
  id: 'tab.group.rename',
  name: 'Rename a tab group',
})

export const moveTabsToGroup = defineCommand({
  id: 'tab.group.move-tabs',
  name: 'Move tabs to a tab group',
})

export const excludeTabsFromGroup = defineCommand({
  id: 'tab.group.exclude-tabs',
  name: 'Exclude tabs from a tab group',
})
