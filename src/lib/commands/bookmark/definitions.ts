import { defineCommand } from '../utils'

export const open = defineCommand({
  id: 'bookmark.open',
  name: 'Open bookmarks',
})

export const openFolders = defineCommand({
  id: 'bookmark.open-folders',
  name: 'Open bookmark folders',
})

export const openInGroup = defineCommand({
  id: 'bookmark.open-in-group',
  name: 'Open bookmarks in new tab group',
})

export const openFoldersInGroup = defineCommand({
  id: 'bookmark.open-folders-in-group',
  name: 'Open bookmark folders in a new tab group',
})

export const openFoldersInEachGroup = defineCommand({
  id: 'bookmark.open-folders-in-each-group',
  name: 'Open bookmark folders in each tab group',
})
