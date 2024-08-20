import { Bookmark, Tab, TSelectedMultiple, TSelectedText } from '@/lib/types'
import { defineActions } from '../utils'
import {
  openFolders,
  open,
  openInGroup,
  openFoldersInGroup,
  openFoldersInEachGroup,
} from './definitions'
import { getBookmarks, getFolders, openBookmark } from './utils'

export const _openBookmarks = defineActions(open, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select bookmarks to open.',
      elements: await getBookmarks(),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const bookmarks = (multiple as TSelectedMultiple<Bookmark>).map(
      (e) => e.data as Bookmark
    )
    if (bookmarks.length === 0) {
      throw new Error('No bookmarks selected.')
    }

    bookmarks.forEach(openBookmark)
  },
])

export const _openBookmarkFolders = defineActions(openFolders, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select bookmark folders to open.',
      elements: await getFolders(),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const folders = (multiple as TSelectedMultiple<Bookmark>).map(
      (e) => e.data as Bookmark
    )
    if (folders.length === 0) {
      throw new Error('No bookmarks selected.')
    }

    folders.forEach(openBookmark)
  },
])

export const _openInGroup = defineActions(openInGroup, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select bookmarks to open.',
      elements: await getBookmarks(),
    }
  },
  // Step 1: multiple => text
  async (_, multiple) => {
    const bookmarks = multiple as TSelectedMultiple<Bookmark>
    if (bookmarks.length === 0) {
      throw new Error('No bookmarks selected.')
    }

    return {
      type: 'text',
      placeholder: 'Type a name of this group...',
      elements: undefined,
    }
  },
  // Step 2: multiple, text => void
  async (_, multiple, text) => {
    const title = text as TSelectedText
    const bookmarks = (multiple as TSelectedMultiple<Bookmark>).map(
      (e) => e.data as Bookmark
    )

    const tabs: Tab[] = []
    for (const bookmark of bookmarks) {
      tabs.push(...(await openBookmark(bookmark)))
    }

    const groupId = await chrome.tabs.group({
      tabIds: tabs.map((t) => t.id).filter((id) => id != null),
    })

    await chrome.tabGroups.update(groupId, { title })
  },
])

export const _openFoldersInGroup = defineActions(openFoldersInGroup, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select bookmark folders to open.',
      elements: await getFolders(),
    }
  },
  // Step 1: multiple => text
  async (_, multiple) => {
    const folders = multiple as TSelectedMultiple<Bookmark>
    if (folders.length === 0) {
      throw new Error('No bookmark folders selected.')
    }

    return {
      type: 'text',
      placeholder: 'Type a name of this group...',
      elements: undefined,
    }
  },
  // Step 2: multiple, text => void
  async (_, multiple, text) => {
    const title = text as TSelectedText
    const folders = (multiple as TSelectedMultiple<Bookmark>).map((e) => e.data)

    const tabs: Tab[] = []
    for (const folder of folders) {
      tabs.push(...(await openBookmark(folder)))
    }

    const groupId = await chrome.tabs.group({
      tabIds: tabs.map((t) => t.id).filter((id) => id != null),
    })

    await chrome.tabGroups.update(groupId, { title })
  },
])

export const _openFoldersInEachGroup = defineActions(openFoldersInEachGroup, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select bookmark folders to open.',
      elements: await getFolders(),
    }
  },
  // Step 1: multiple => text
  async (_, multiple) => {
    const folders = (multiple as TSelectedMultiple<Bookmark>).map((e) => e.data)
    if (folders.length === 0) {
      throw new Error('No bookmark folders selected.')
    }

    for (const folder of folders) {
      const tabs: Tab[] = []
      tabs.push(...(await openBookmark(folder)))
      const groupId = await chrome.tabs.group({
        tabIds: tabs.map((t) => t.id).filter((id) => id != null),
      })
      await chrome.tabGroups.update(groupId, { title: folder.title })
    }
  },
])
