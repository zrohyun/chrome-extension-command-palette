import {
  useEffect,
  createContext,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import type { Theme } from '@/lib/types'

type ThemeProviderProps = {
  children: React.ReactNode
  initialTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => 'system',
}

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  initialTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useStorageState<Theme>('theme', initialTheme)

  useEffect(() => {
    if (theme == null) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      root.classList.add(getSystemTheme())
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

function getSystemTheme() {
  const query = '(prefers-color-scheme: dark)'
  return window.matchMedia(query).matches ? 'dark' : 'light'
}
