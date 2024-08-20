import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { isSameKey } from '@/lib/keys'
import type { Keyboard } from '@/lib/types'

export function useToggleOnKey(
  keyToOpen: Keyboard,
  keyToClose: Keyboard
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [open, setOpen] = useState(false)

  const onTriggerKey = useCallback(
    (ev: KeyboardEvent) => {
      if (isSameKey(keyToOpen, ev)) {
        ev.preventDefault()
        setOpen(true)
        window.removeEventListener('keydown', onTriggerKey)
      }
    },
    [keyToOpen]
  )

  const onCloseKey = useCallback(
    (ev: KeyboardEvent) => {
      if (isSameKey(keyToClose, ev)) {
        ev.preventDefault()
        setOpen(false)
        window.removeEventListener('keydown', onCloseKey)
      }
    },
    [keyToClose]
  )

  useEffect(() => {
    if (!open) {
      window.addEventListener('keydown', onTriggerKey)
      window.removeEventListener('keydown', onCloseKey)
    } else {
      window.removeEventListener('keydown', onTriggerKey)
      window.addEventListener('keydown', onCloseKey)
    }
    return () => {
      window.removeEventListener('keydown', onTriggerKey)
      window.removeEventListener('keydown', onCloseKey)
    }
  }, [onCloseKey, onTriggerKey, open])

  return [open, setOpen]
}
