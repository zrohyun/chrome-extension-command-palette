import { Keyboard } from '@/lib/types'

export const defaultKeyToOpen: Keyboard = {
  code: 'KeyP',
  altKey: false,
  ctrlKey: true,
  metaKey: true,
  shiftKey: true,
}

export const defaultKeyToClose: Keyboard = {
  code: 'Escape',
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
}

export function isSameKey(a: Keyboard, b: Keyboard) {
  return (
    a.code === b.code &&
    a.shiftKey === b.shiftKey &&
    a.altKey === b.altKey &&
    // treat ctrl and cmd as the same key to make it compatible between mac and windows
    (a.ctrlKey || a.metaKey) === (b.ctrlKey || b.metaKey)
  )
}

export function isKeyToIgnore(code: KeyboardEvent['code']) {
  const ignoreList = new Set<KeyboardEvent['code']>([
    'ControlLeft',
    'ControlRight',
    'MetaLeft',
    'MetaRight',
    'AltLeft',
    'AltRight',
    'ShiftLeft',
    'ShiftRight',
  ])

  return ignoreList.has(code)
}
