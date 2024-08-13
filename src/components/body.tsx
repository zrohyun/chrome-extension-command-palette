import { useRef, type ReactNode } from 'react'
import { ThemeProvider, type Theme } from './theme-provider'

type Props = {
  theme: Theme
  children?: ReactNode
}

export default function Body({ theme: initialTheme, children }: Props) {
  const body = useRef<HTMLDivElement>(null)

  return (
    <div id="chrome-extension-command-palette-body" ref={body}>
      <ThemeProvider initialTheme={initialTheme} body={body}>
        {children}
      </ThemeProvider>
    </div>
  )
}
