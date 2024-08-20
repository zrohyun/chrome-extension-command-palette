import { defineActions } from '../utils'
import {
  switchToTab,
  pinTabs,
  unpinTabs,
  createGroup,
  renameGroup,
  moveTabsToGroup,
  excludeTabsFromGroup,
  closeGroups,
  closeTabs,
} from './definitions'
import { getGroups, getTabs, getTabsGrouped, toEntries, toItem } from './utils'
import type {
  Tab,
  TabGroup,
  TSelectedMultiple,
  TSelectedSingle,
  TSelectedText,
} from '@/lib/types'

export const _switchToTab = defineActions(switchToTab, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'single',
      placeholder: 'Select a tab to switch.',
      elements: await toEntries(await getTabsGrouped({})),
    }
  },
  // Step 1: single => void
  async (_, single) => {
    const tab = (single as TSelectedSingle<Tab>).data
    if (tab.id == null) throw new Error('Tab id cannot be null.')

    await chrome.windows.update(tab.windowId, { focused: true })
    await chrome.tabs.update(tab.id, { active: true })
  },
])

export const _pinTabs = defineActions(pinTabs, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select tabs to pin.',
      elements: await toEntries(await getTabsGrouped({})),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    const tabIds = tabs.map((t) => t.id).filter((id) => id != null)
    tabIds.forEach((tabId) => chrome.tabs.update(tabId, { pinned: true }))
  },
])

export const _unpinTabs = defineActions(unpinTabs, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select tabs to unpin.',
      elements: (await getTabs({ pinned: true })).map(toItem),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    const tabIds = tabs.map((t) => t.id).filter((id) => id != null)
    tabIds.forEach((tabId) => chrome.tabs.update(tabId, { pinned: false }))
  },
])

export const _closeTabs = defineActions(closeTabs, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select tabs to close.',
      elements: await toEntries(await getTabsGrouped({})),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    const tabIds = tabs.map((t) => t.id).filter((id) => id != null)
    tabIds.forEach((tabId) => chrome.tabs.remove(tabId))
  },
])

export const _createGroup = defineActions(createGroup, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select tabs for a new group.',
      elements: await toEntries(await getTabsGrouped({})),
    }
  },
  // Step 1: multiple => text
  async (_, multiple) => {
    const tabs = multiple as TSelectedMultiple<Tab>
    if (tabs.length === 0) {
      throw new Error('No tabs selected.')
    }

    return {
      type: 'text',
      placeholder: 'Type a name of this group...',
      elements: undefined,
    }
  },
  // Step 2: multiple, single => void
  async (_, multiple, text) => {
    const title = text as TSelectedText
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    const tabIds = tabs.map((t) => t.id).filter((id) => id != null)

    const groupId = await chrome.tabs.group({ tabIds })
    await chrome.tabGroups.update(groupId, { title })
  },
])

export const _closeGroups = defineActions(closeGroups, [
  // Step 0: Command => multiple
  async () => {
    return {
      type: 'multiple',
      placeholder: 'Select tab groups to close.',
      elements: (await getGroups()).map(toItem),
    }
  },
  // Step 1: multiple => void
  async (_, multiple) => {
    const groups = (multiple as TSelectedMultiple<TabGroup>).map(
      (group) => group.data
    )

    for (const group of groups) {
      const tabs = await getTabs({ groupId: group.id })
      tabs.forEach((tab) => chrome.tabs.remove(tab.id || -1))
    }
  },
])

export const _renameGroup = defineActions(renameGroup, [
  // Step 0: Command => single
  async () => {
    return {
      type: 'single',
      placeholder: 'Select a tab group to rename.',
      elements: (await getGroups()).map(toItem),
    }
  },
  // Step 1: single => text
  async () => {
    return {
      type: 'text',
      placeholder: 'Type a name of this group...',
      elements: undefined,
    }
  },
  // Step 2: single, text => void
  async (_, single, text) => {
    const title = text as TSelectedText
    const group = (single as TSelectedSingle<TabGroup>).data
    await chrome.tabGroups.update(group.id, { title })
  },
])

export const _moveTabsToGroup = defineActions(moveTabsToGroup, [
  // Step 0: Command => single
  async () => {
    return {
      type: 'single',
      placeholder: 'Select a destination tab group.',
      elements: (await getGroups()).map(toItem),
    }
  },
  // Step 1: single => multiple
  async (_, single) => {
    const group = (single as TSelectedSingle<TabGroup>).data

    const tabsNotInDestination = await toEntries(
      (await getTabsGrouped({})).filter((elem) => {
        if (Array.isArray(elem) && elem[0].groupId === group.id) return false
        return true
      })
    )

    return {
      type: 'multiple',
      placeholder: 'Select tabs to move.',
      elements: tabsNotInDestination,
    }
  },
  // Step 2: single, multiple => void
  async (_, single, multiple) => {
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    const tabIds = tabs.map((t) => t.id).filter((id) => id != null)
    const group = (single as TSelectedSingle<TabGroup>).data

    await chrome.tabs.group({ groupId: group.id, tabIds })
  },
])

export const _excludeTabsFromGroup = defineActions(excludeTabsFromGroup, [
  // Step 0: Command => single
  async () => {
    return {
      type: 'single',
      placeholder: 'Select a target tab group.',
      elements: (await getGroups()).map(toItem),
    }
  },
  // Step 1: single => multiple
  async (_, single) => {
    const group = (single as TSelectedSingle<TabGroup>).data
    const tabsInThisGroup = (await getTabs({ groupId: group.id })).map(toItem)

    return {
      type: 'multiple',
      placeholder: 'Select tabs to remove.',
      elements: tabsInThisGroup,
    }
  },
  // Step 2: single, multiple => void
  async (_, _single, multiple) => {
    const tabs = (multiple as TSelectedMultiple<Tab>).map((e) => e.data)
    await chrome.tabs.ungroup(tabs.map((t) => t.id).filter((id) => id != null))
  },
])
