import type {
  MessageSender,
  QueryInfo,
  Tab,
  TabGroup,
  TGroup,
  TItem,
} from '@/lib/types'

export function groupIdOf(sender: MessageSender) {
  if (sender.tab == null) {
    throw new Error('This command should be called from a tab.')
  } else if (sender.tab.groupId < 0) {
    throw new Error('This tab is not in a tab group.')
  }

  return sender.tab.groupId
}

async function groupTitle(groupId: number) {
  return (await chrome.tabGroups.get(groupId)).title || 'Untitled'
}

export async function getGroups() {
  const tabs = await chrome.tabs.query({})
  const groupIds = new Set<number>()
  tabs.forEach((tab) => {
    if (tab.groupId < 0) return
    groupIds.add(tab.groupId)
  })

  const groups: TabGroup[] = []
  for (const groupId of groupIds) {
    groups.push(await chrome.tabGroups.get(groupId))
  }

  return groups
}

export async function getTabs(query: QueryInfo) {
  return await chrome.tabs.query(query)
}

export async function getTabsGrouped(query: QueryInfo) {
  const tabs = await chrome.tabs.query(query)
  const grouped: (Tab | Tab[])[] = []

  for (let cur = 0; cur < tabs.length; ) {
    const tab = tabs[cur]
    if (hasNoGroup(tab)) {
      grouped.push(tab)
      cur++
    } else {
      const group = sliceByGroup(tabs, tab.groupId, cur)
      grouped.push(group)
      cur += group.length
    }
  }

  return grouped
}

export function hasNoGroup(tab: Tab) {
  return tab.groupId < 0
}

export function sliceByGroup(tabs: Tab[], groupId: number, from?: number) {
  const groupTabs: Tab[] = []
  for (let i = from || 0; i < tabs.length; i++) {
    const tab = tabs[i]
    if (tab.groupId === groupId) groupTabs.push(tab)
    else break
  }
  return groupTabs
}

export function toItem<T extends Tab | TabGroup>(tab: T) {
  const { id, title } = tab
  if (id == null) throw new Error('id cannot be null.')

  return {
    id: id.toString(),
    name: title || 'Untitled',
    data: tab,
  } as TItem<T>
}

export function toGroup<T extends Tab | TabGroup>(
  name: string,
  items: TItem<T>[]
) {
  return { name, items } as TGroup<T>
}

export async function toEntries(grouped: (Tab | Tab[])[]) {
  const entries: (TItem<Tab> | TGroup<Tab>)[] = []

  for (const elem of grouped) {
    if (Array.isArray(elem)) {
      const tabs = elem as Tab[]
      const groupId = tabs[0].groupId
      const title = await groupTitle(groupId)
      entries.push(toGroup(title, elem.map(toItem)))
    } else {
      const tab = elem as Tab
      entries.push(toItem(tab))
    }
  }

  return entries
}
