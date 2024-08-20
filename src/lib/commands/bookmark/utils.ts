import { Bookmark, Tab, TGroup, TItem } from '@/lib/types'

export async function getBookmarks() {
  const tree = await chrome.bookmarks.getTree()
  const root = tree[0]

  return toBookmarkElements(root, [])
}

export async function getFolders() {
  const tree = await chrome.bookmarks.getTree()
  const root = tree[0]

  return toFolderElements(root, [])
}

export async function openBookmark(node: Bookmark): Promise<Tab[]> {
  if (isFolder(node)) {
    return openFolder(node)
  } else {
    return [await chrome.tabs.create({ url: node.url, active: true })]
  }
}

async function openFolder(folder: Bookmark): Promise<Tab[]> {
  const children = folder.children as Bookmark[]
  const tabs: Tab[] = []
  for (const child of children) {
    if (isFolder(child)) {
      const folderTabs = await openFolder(child)
      tabs.push(...folderTabs)
    } else {
      const tab = await openBookmark(child)
      tabs.push(...tab)
    }
  }
  return tabs
}

export function toBookmarkElements(
  node: Bookmark,
  titles: string[]
): (TItem<Bookmark> | TGroup<Bookmark>)[] {
  // handle root node
  if (isRoot(node)) {
    const children = node.children as Bookmark[]
    return children.flatMap((child) => toBookmarkElements(child, []))
  }

  // return top level bookmark as item
  if (titles.length === 0 && !isFolder(node)) {
    return [toItem(node)]
  }

  // prepare for grouping bookmarks
  const breadcrumbs = [...titles, node.title]
  const groupTitle = breadcrumbs.join(' > ')
  const { bookmarks, subfolders } = sliceByType(node)

  const subgroups = subfolders.flatMap((subFolder) =>
    toBookmarkElements(subFolder, breadcrumbs)
  )

  if (bookmarks.length === 0) return subgroups

  const group = toGroup(groupTitle, bookmarks.map(toItem))
  return [group, ...subgroups]
}

export function toFolderElements(
  node: Bookmark,
  titles: string[]
): (TItem<Bookmark> | TGroup<Bookmark>)[] {
  // handle root node
  if (isRoot(node)) {
    const children = node.children as Bookmark[]
    return children.flatMap((child) => toFolderElements(child, []))
  }

  const breadcrumbs = [...titles, node.title]
  const groupTitle = breadcrumbs.join(' > ')

  const children = node.children
  const subfolders = (children || [])
    .filter(isFolder)
    .flatMap((child) => toFolderElements(child, breadcrumbs))

  const item = toItem(node)
  item.name = groupTitle

  return [item, ...subfolders]
}

function isRoot(node: Bookmark) {
  return node.parentId == null
}

function isFolder(node: Bookmark) {
  return node.children != null
}

function sliceByType(folder: Bookmark) {
  const children = folder.children as Bookmark[]
  const bookmarks: Bookmark[] = []
  const subfolders: Bookmark[] = []

  for (const child of children) {
    if (isFolder(child)) subfolders.push(child)
    else bookmarks.push(child)
  }

  return { bookmarks, subfolders }
}

function toItem(bookmark: Bookmark): TItem<Bookmark> {
  return { id: bookmark.id, name: bookmark.title, data: bookmark }
}

function toGroup(name: string, items: TItem<Bookmark>[]): TGroup<Bookmark> {
  return { name, items }
}
