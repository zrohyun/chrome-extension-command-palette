import { useCallback } from 'react'
import { useToggleOnKey } from '@/content/use-toggle-on-key'
import Body from '@/components/body'
import CommandPalette from '@/content/command-palette'
import CommandPaletteOverlay from './command-palette-overlay'
import type { Keyboard, Theme } from '@/lib/types'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import { defaultKeyToOpen } from '@/lib/keys'
import { useDevReload } from '@/lib/hooks/use-dev-reload'
import { defaultGroups } from '@/lib/commands/default-groups'

export default function App() {
  useDevReload()

  const [theme] = useStorageState<Theme>('theme', 'system')
  const [keyToOpen] = useStorageState<Keyboard>('keyToOpen', defaultKeyToOpen)
  const [keyToClose] = useStorageState<Keyboard>('keyToClose', defaultKeyToOpen)
  const [open, setOpen] = useToggleOnKey(keyToOpen, keyToClose)
  const close = useCallback(() => setOpen(false), [setOpen])

  return (
    <Body theme={theme}>
      {open && (
        <div className="fixed top-0 left-0 bg-transparent z-[2147483647]">
          <div className="h-dvh w-dvw p-4 flex flex-col items-center justify-center relative z-0">
            <CommandPalette
              commands={defaultGroups}
              close={close}
              className="max-w-xl w-full z-20"
            />
            <CommandPaletteOverlay
              onClick={close}
              className="absolute top-0 left-0 z-10"
            />
          </div>
        </div>
      )}
    </Body>
  )
}
