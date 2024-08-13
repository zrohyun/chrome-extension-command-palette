import { useEffect, useState } from 'react'
import type { Theme } from '@/components/theme-provider'
import Body from '@/components/body'

type Props = {
  theme: Theme
}

export default function App({ theme }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onTrigger(ev: KeyboardEvent) {
      if (ev.key === 'p' && ev.shiftKey && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault()
        setOpen(true)
      } else if (ev.key === 'Escape') {
        ev.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onTrigger)
    return () => window.removeEventListener('keydown', onTrigger)
  }, [])

  return (
    <Body theme={theme}>
      {open && (
        <div className="fixed top-0 left-0 bg-transparent z-[2147483647]">
          <div className="h-dvh w-dvw flex flex-col items-center justify-center relative z-0">
            <div className="max-w-md w-full bg-background shadow-lg z-20 h-80">
              <span>Command Palette</span>
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
