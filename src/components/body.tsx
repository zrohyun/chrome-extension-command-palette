import { useRef, type ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import type { Theme } from '@/lib/types'

type Props = {
  theme: Theme
  className?: string
  children?: ReactNode
}

export default function Body({ theme, className, children }: Props) {
  const body = useRef<HTMLDivElement>(null)
  const bodyId = 'chrome-extension-command-palette-body'

  return (
    <div id={bodyId} ref={body} className={className}>
      <ThemeProvider initialTheme={theme} body={body}>
        {children}
      </ThemeProvider>
    </div>
  )
}
