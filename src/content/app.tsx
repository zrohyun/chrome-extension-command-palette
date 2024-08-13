import { useCallback, useEffect, useState } from 'react'
import Body from '@/components/body'
import CommandPalette from '@/content/command-palette'
import type { Theme } from '@/components/theme-provider'

type Props = {
  theme: Theme
}

export default function App({ theme }: Props) {
  const [open, setOpen] = useState(false)

  const openCommandPalette = useCallback((ev?: KeyboardEvent) => {
    if (
      ev == null ||
      (ev.key === 'p' && ev.shiftKey && (ev.ctrlKey || ev.metaKey))
    ) {
      ev?.preventDefault()
      setOpen(true)
      window.removeEventListener('keydown', openCommandPalette)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      window.addEventListener('keydown', openCommandPalette)
      return () => window.removeEventListener('keydown', openCommandPalette)
    }
  }, [open, openCommandPalette])

  const closeCommandPalette = useCallback((ev?: KeyboardEvent) => {
    if (ev == null || ev.key === 'Escape') {
      ev?.preventDefault()
      setOpen(false)
      window.removeEventListener('keydown', closeCommandPalette)
    }
  }, [])

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', closeCommandPalette)
      return () => window.removeEventListener('keydown', closeCommandPalette)
    }
  }, [open, closeCommandPalette])

  return (
    <Body theme={theme}>
      {open && (
        <div className="fixed top-0 left-0 bg-transparent z-[2147483647]">
          <div className="h-dvh w-dvw flex flex-col items-center justify-center relative z-0">
            <div className="max-w-md w-full shadow-2xl z-20">
              <CommandPalette />
            </div>
            {/* Overlay */}
            <div
              className="h-full w-full bg-transparent absolute top-0 left-0 z-10"
              onClick={() => setOpen(false)}></div>
          </div>
        </div>
      )}
    </Body>
  )
}
