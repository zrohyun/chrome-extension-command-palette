import { useEffect } from 'react'
import { isSameKey } from '@/lib/keys'
import { reload } from '@/lib/commands/command-palette/definitions'
import type { Keyboard } from '@/lib/types'

export function useDevReload() {
  useEffect(() => {
    if (import.meta.env.VITE_DEV === 'true') {
      const reloadTrigger: Keyboard = {
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
        altKey: true,
        code: 'KeyP',
      }

      function onTriggerReload(ev: KeyboardEvent) {
        if (isSameKey(reloadTrigger, ev)) {
          ev.preventDefault()
          chrome.runtime.sendMessage([reload])
        }
      }

      window.addEventListener('keydown', onTriggerReload)
      return () => window.removeEventListener('keydown', onTriggerReload)
    }
  }, [])
}
